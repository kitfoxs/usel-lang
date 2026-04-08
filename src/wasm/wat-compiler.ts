/**
 * WAT → WASM Binary Compiler
 *
 * Compiles WebAssembly Text Format (WAT) strings into WASM binary (Uint8Array).
 * Uses the `wabt` npm package if available, otherwise falls back to a built-in
 * minimal binary encoder that handles the instruction subset USEL generates.
 */

import type { WasmModule, WasmInstruction, WasmValueType } from './to-wat';

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Compile a WAT string to WASM binary bytes.
 *
 * Tries the `wabt` npm package first (most complete). If wabt is not
 * installed, falls back to the built-in minimal encoder which covers
 * the instruction subset that the USEL→WAT compiler produces.
 *
 * @param wat  - Valid WAT module text
 * @param ir   - Optional WasmModule IR (enables the fallback encoder)
 */
export async function compileWATtoWASM(
  wat: string,
  ir?: WasmModule,
): Promise<Uint8Array> {
  // Attempt 1: wabt
  try {
    return await compileWithWabt(wat);
  } catch {
    // wabt not available — fall through
  }

  // Attempt 2: built-in encoder from IR
  if (ir) {
    return encodeWasmModule(ir);
  }

  throw new Error(
    'Cannot compile WAT to WASM: the `wabt` package is not installed and no ' +
    'WasmModule IR was provided for the fallback encoder. ' +
    'Install wabt with: npm install wabt',
  );
}

// ---------------------------------------------------------------------------
// wabt-based compilation
// ---------------------------------------------------------------------------

async function compileWithWabt(wat: string): Promise<Uint8Array> {
  // Dynamic import so the module isn't required at load time
  const wabtModule = await (Function('return import("wabt")')() as Promise<any>);
  const wabt = await (wabtModule.default ?? wabtModule)();
  const parsed = wabt.parseWat('usel.wat', wat);
  parsed.validate();
  const { buffer } = parsed.toBinary({ write_debug_names: false });
  parsed.destroy();
  return new Uint8Array(buffer);
}

// ---------------------------------------------------------------------------
// Built-in minimal WASM binary encoder
// ---------------------------------------------------------------------------

// -- Constants ---------------------------------------------------------------

const WASM_MAGIC = [0x00, 0x61, 0x73, 0x6d]; // \0asm
const WASM_VERSION = [0x01, 0x00, 0x00, 0x00];

const Section = {
  Type: 1,
  Import: 2,
  Function: 3,
  Memory: 5,
  Export: 7,
  Code: 10,
  Data: 11,
} as const;

const ExportKind = {
  Func: 0x00,
  Memory: 0x02,
} as const;

const ValType = {
  i32: 0x7f,
  i64: 0x7e,
  f32: 0x7d,
  f64: 0x7c,
} as const;

const BLOCK_VOID = 0x40;

const VALTYPE_MAP: Record<WasmValueType, number> = {
  i32: ValType.i32,
  i64: ValType.i64,
  f32: ValType.f32,
  f64: ValType.f64,
};

// -- WASM opcodes we emit ----------------------------------------------------

const OP: Record<string, number[]> = {
  'unreachable':        [0x00],
  'nop':                [0x01],
  'block':              [0x02],
  'loop':               [0x03],
  'if':                 [0x04],
  'else':               [0x05],
  'end':                [0x0b],
  'br':                 [0x0c],
  'br_if':              [0x0d],
  'return':             [0x0f],
  'call':               [0x10],
  'drop':               [0x1a],
  'local.get':          [0x20],
  'local.set':          [0x21],
  'local.tee':          [0x22],
  'i32.const':          [0x41],
  'i64.const':          [0x42],
  'f32.const':          [0x43],
  'f64.const':          [0x44],
  'i32.eqz':            [0x45],
  'i32.eq':             [0x46],
  'i32.ne':             [0x47],
  'i32.lt_s':           [0x48],
  'i32.lt_u':           [0x49],
  'i32.gt_s':           [0x4a],
  'i32.gt_u':           [0x4b],
  'i32.le_s':           [0x4c],
  'i32.le_u':           [0x4d],
  'i32.ge_s':           [0x4e],
  'i32.ge_u':           [0x4f],
  'f64.eq':             [0x61],
  'f64.ne':             [0x62],
  'f64.lt':             [0x63],
  'f64.gt':             [0x64],
  'f64.le':             [0x65],
  'f64.ge':             [0x66],
  'i32.add':            [0x6a],
  'i32.sub':            [0x6b],
  'i32.mul':            [0x6c],
  'i32.div_s':          [0x6d],
  'i32.div_u':          [0x6e],
  'i32.rem_s':          [0x6f],
  'i32.rem_u':          [0x70],
  'i32.and':            [0x71],
  'i32.or':             [0x72],
  'i32.xor':            [0x73],
  'i32.shl':            [0x74],
  'i32.shr_s':          [0x75],
  'i32.shr_u':          [0x76],
  'f64.abs':            [0x99],
  'f64.neg':            [0x9a],
  'f64.ceil':           [0x9b],
  'f64.floor':          [0x9c],
  'f64.sqrt':           [0x9f],
  'f64.add':            [0xa0],
  'f64.sub':            [0xa1],
  'f64.mul':            [0xa2],
  'f64.div':            [0xa3],
  'f64.min':            [0xa4],
  'f64.max':            [0xa5],
  'f64.convert_i32_s':  [0xb7],
  'f64.convert_i32_u':  [0xb8],
  'i32.trunc_f64_s':    [0xaa],
};

// -- Byte-buffer helper ------------------------------------------------------

class WasmWriter {
  private buf: number[] = [];

  /** Raw bytes */
  write(...bytes: number[]): void {
    this.buf.push(...bytes);
  }

  /** Unsigned LEB128 */
  writeU32(value: number): void {
    do {
      let byte = value & 0x7f;
      value >>>= 7;
      if (value !== 0) byte |= 0x80;
      this.buf.push(byte);
    } while (value !== 0);
  }

  /** Signed LEB128 (for i32.const, br targets, etc.) */
  writeS32(value: number): void {
    let more = true;
    while (more) {
      let byte = value & 0x7f;
      value >>= 7;
      if ((value === 0 && (byte & 0x40) === 0) || (value === -1 && (byte & 0x40) !== 0)) {
        more = false;
      } else {
        byte |= 0x80;
      }
      this.buf.push(byte);
    }
  }

  /** Signed LEB128 for i64 */
  writeS64(value: bigint): void {
    let more = true;
    while (more) {
      let byte = Number(value & 0x7fn);
      value >>= 7n;
      if ((value === 0n && (byte & 0x40) === 0) || (value === -1n && (byte & 0x40) !== 0)) {
        more = false;
      } else {
        byte |= 0x80;
      }
      this.buf.push(byte);
    }
  }

  /** IEEE 754 f64 (little-endian) */
  writeF64(value: number): void {
    const view = new DataView(new ArrayBuffer(8));
    view.setFloat64(0, value, true);
    for (let i = 0; i < 8; i++) this.buf.push(view.getUint8(i));
  }

  /** IEEE 754 f32 (little-endian) */
  writeF32(value: number): void {
    const view = new DataView(new ArrayBuffer(4));
    view.setFloat32(0, value, true);
    for (let i = 0; i < 4; i++) this.buf.push(view.getUint8(i));
  }

  /** UTF-8 string prefixed with length */
  writeName(name: string): void {
    const encoded = new TextEncoder().encode(name);
    this.writeU32(encoded.length);
    this.write(...encoded);
  }

  /** Write a size-prefixed section */
  writeSection(id: number, content: WasmWriter): void {
    const bytes = content.toBytes();
    this.write(id);
    this.writeU32(bytes.length);
    this.write(...bytes);
  }

  toBytes(): number[] {
    return this.buf;
  }

  toUint8Array(): Uint8Array {
    return new Uint8Array(this.buf);
  }
}

// -- Instruction encoding ----------------------------------------------------

function encodeInstruction(instr: WasmInstruction, w: WasmWriter): void {
  const op = instr.op;

  // Structured control: if, block, loop
  if (op === 'if') {
    w.write(...OP['if']);
    // block type
    const bt = instr.blockType;
    w.write(bt && bt !== 'void' ? VALTYPE_MAP[bt] : BLOCK_VOID);

    // then block
    if (instr.blocks && instr.blocks[0]) {
      for (const child of instr.blocks[0]) encodeInstruction(child, w);
    }
    // else block
    if (instr.blocks && instr.blocks[1] && instr.blocks[1].length > 0) {
      w.write(...OP['else']);
      for (const child of instr.blocks[1]) encodeInstruction(child, w);
    }
    w.write(...OP['end']);
    return;
  }

  if (op === 'block' || op === 'loop') {
    w.write(...OP[op]);
    const bt = instr.blockType;
    w.write(bt && bt !== 'void' ? VALTYPE_MAP[bt] : BLOCK_VOID);
    if (instr.blocks && instr.blocks[0]) {
      for (const child of instr.blocks[0]) encodeInstruction(child, w);
    }
    w.write(...OP['end']);
    return;
  }

  // i32.const
  if (op === 'i32.const') {
    w.write(...OP[op]);
    w.writeS32(instr.immediates?.[0] as number ?? 0);
    return;
  }

  // i64.const
  if (op === 'i64.const') {
    w.write(...OP[op]);
    w.writeS64(BigInt(instr.immediates?.[0] as number ?? 0));
    return;
  }

  // f32.const
  if (op === 'f32.const') {
    w.write(...OP[op]);
    w.writeF32(instr.immediates?.[0] as number ?? 0);
    return;
  }

  // f64.const
  if (op === 'f64.const') {
    w.write(...OP[op]);
    w.writeF64(instr.immediates?.[0] as number ?? 0);
    return;
  }

  // br, br_if — label index immediate
  if (op === 'br' || op === 'br_if') {
    w.write(...OP[op]);
    w.writeU32(instr.immediates?.[0] as number ?? 0);
    return;
  }

  // call — function index immediate
  if (op === 'call') {
    w.write(...OP[op]);
    w.writeU32(instr.immediates?.[0] as number ?? 0);
    return;
  }

  // local.get / local.set / local.tee — local index immediate
  if (op === 'local.get' || op === 'local.set' || op === 'local.tee') {
    w.write(...OP[op]);
    w.writeU32(instr.immediates?.[0] as number ?? 0);
    return;
  }

  // Simple opcodes (no immediates)
  const opBytes = OP[op];
  if (opBytes) {
    w.write(...opBytes);
    return;
  }

  throw new Error(`Unknown WASM opcode: ${op}`);
}

// -- Module encoding ---------------------------------------------------------

function encodeFuncType(
  params: WasmValueType[],
  results: WasmValueType[],
  w: WasmWriter,
): void {
  w.write(0x60); // func type tag
  w.writeU32(params.length);
  for (const p of params) w.write(VALTYPE_MAP[p]);
  w.writeU32(results.length);
  for (const r of results) w.write(VALTYPE_MAP[r]);
}

/**
 * Encode a WasmModule IR into a valid WASM binary.
 */
export function encodeWasmModule(mod: WasmModule): Uint8Array {
  const w = new WasmWriter();

  // Magic + version
  w.write(...WASM_MAGIC, ...WASM_VERSION);

  // Collect all unique type signatures
  type Sig = { params: WasmValueType[]; results: WasmValueType[] };
  const sigs: Sig[] = [];
  const sigIndex = (params: WasmValueType[], results: WasmValueType[]): number => {
    const key = params.join(',') + '->' + results.join(',');
    for (let i = 0; i < sigs.length; i++) {
      const s = sigs[i];
      const k = s.params.join(',') + '->' + s.results.join(',');
      if (k === key) return i;
    }
    sigs.push({ params, results });
    return sigs.length - 1;
  };

  // Register import sigs and function sigs
  const importTypeIndices = mod.imports.map(imp =>
    sigIndex(imp.params, imp.results),
  );
  const funcTypeIndices = mod.functions.map(fn =>
    sigIndex(fn.params.map(p => p.type), fn.results),
  );

  // --- Section 1: Type ---
  {
    const sec = new WasmWriter();
    sec.writeU32(sigs.length);
    for (const s of sigs) encodeFuncType(s.params, s.results, sec);
    w.writeSection(Section.Type, sec);
  }

  // --- Section 2: Import ---
  if (mod.imports.length > 0) {
    const sec = new WasmWriter();
    sec.writeU32(mod.imports.length);
    for (let i = 0; i < mod.imports.length; i++) {
      const imp = mod.imports[i];
      sec.writeName(imp.module);
      sec.writeName(imp.name);
      sec.write(0x00); // func import
      sec.writeU32(importTypeIndices[i]);
    }
    w.writeSection(Section.Import, sec);
  }

  // --- Section 3: Function ---
  {
    const sec = new WasmWriter();
    sec.writeU32(mod.functions.length);
    for (const idx of funcTypeIndices) sec.writeU32(idx);
    w.writeSection(Section.Function, sec);
  }

  // --- Section 5: Memory ---
  if (mod.memory) {
    const sec = new WasmWriter();
    sec.writeU32(1); // 1 memory
    if (mod.memory.max !== undefined) {
      sec.write(0x01); // has max
      sec.writeU32(mod.memory.initial);
      sec.writeU32(mod.memory.max);
    } else {
      sec.write(0x00); // no max
      sec.writeU32(mod.memory.initial);
    }
    w.writeSection(Section.Memory, sec);
  }

  // --- Section 7: Export ---
  {
    const exports: { name: string; kind: number; index: number }[] = [];

    for (let i = 0; i < mod.functions.length; i++) {
      const fn = mod.functions[i];
      if (fn.exported) {
        exports.push({
          name: fn.exported,
          kind: ExportKind.Func,
          index: mod.imports.length + i, // imports come first in index space
        });
      }
    }
    if (mod.memory?.exported) {
      exports.push({
        name: mod.memory.exported,
        kind: ExportKind.Memory,
        index: 0,
      });
    }

    const sec = new WasmWriter();
    sec.writeU32(exports.length);
    for (const exp of exports) {
      sec.writeName(exp.name);
      sec.write(exp.kind);
      sec.writeU32(exp.index);
    }
    w.writeSection(Section.Export, sec);
  }

  // --- Section 10: Code ---
  {
    const sec = new WasmWriter();
    sec.writeU32(mod.functions.length);

    for (const fn of mod.functions) {
      const body = new WasmWriter();

      // Locals: compress into (count, type) pairs
      const localGroups: { count: number; type: WasmValueType }[] = [];
      for (const local of fn.locals) {
        const last = localGroups[localGroups.length - 1];
        if (last && last.type === local.type) {
          last.count++;
        } else {
          localGroups.push({ count: 1, type: local.type });
        }
      }
      body.writeU32(localGroups.length);
      for (const g of localGroups) {
        body.writeU32(g.count);
        body.write(VALTYPE_MAP[g.type]);
      }

      // Instructions
      for (const instr of fn.body) {
        encodeInstruction(instr, body);
      }
      body.write(0x0b); // end

      const bodyBytes = body.toBytes();
      sec.writeU32(bodyBytes.length);
      sec.write(...bodyBytes);
    }
    w.writeSection(Section.Code, sec);
  }

  // --- Section 11: Data ---
  if (mod.dataSegments && mod.dataSegments.length > 0) {
    const sec = new WasmWriter();
    sec.writeU32(mod.dataSegments.length);
    for (const seg of mod.dataSegments) {
      sec.write(0x00); // active segment, memory 0
      // offset expression: i32.const <offset> end
      sec.write(0x41); // i32.const
      sec.writeS32(seg.offset);
      sec.write(0x0b); // end
      sec.writeU32(seg.data.length);
      sec.write(...seg.data);
    }
    w.writeSection(Section.Data, sec);
  }

  return w.toUint8Array();
}
