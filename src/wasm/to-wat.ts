/**
 * USEL AST → WAT (WebAssembly Text Format) Compiler
 *
 * Converts USEL Abstract Syntax Trees into valid WAT that can be
 * compiled to WebAssembly binary format. Supports math, comparisons,
 * control flow, and basic type operations.
 */

import type {
  USELAST,
  USELStatement,
  USELNode,
  USELSymbol,
  CompilationResult,
} from '../primes/types';

// ---------------------------------------------------------------------------
// WASM IR types — shared with wat-compiler.ts
// ---------------------------------------------------------------------------

export type WasmValueType = 'i32' | 'i64' | 'f32' | 'f64';

export interface WasmInstruction {
  op: string;
  /** Immediate arguments (constants, label indices, block types, …) */
  immediates?: unknown[];
  /** Nested instruction blocks (for if/block/loop) */
  blocks?: WasmInstruction[][];
  /** Block result type (for if/block/loop) */
  blockType?: WasmValueType | 'void';
}

export interface WasmFunction {
  name: string;
  params: { name?: string; type: WasmValueType }[];
  results: WasmValueType[];
  locals: { name?: string; type: WasmValueType }[];
  body: WasmInstruction[];
  exported?: string;
}

export interface WasmImportFunc {
  module: string;
  name: string;
  params: WasmValueType[];
  results: WasmValueType[];
}

export interface WasmModule {
  functions: WasmFunction[];
  imports: WasmImportFunc[];
  memory?: { initial: number; max?: number; exported?: string };
  dataSegments?: { offset: number; data: Uint8Array }[];
}

// ---------------------------------------------------------------------------
// Symbol-ID → WASM opcode mapping
// ---------------------------------------------------------------------------

/** Maps a USEL symbol id to the corresponding i32 WASM instruction. */
const I32_OPS: Record<string, string> = {
  COMPUTE_ADD: 'i32.add',
  COMPUTE_SUBTRACT: 'i32.sub',
  COMPUTE_MULTIPLY: 'i32.mul',
  COMPUTE_DIVIDE: 'i32.div_s',
  COMPUTE_MODULO: 'i32.rem_s',
  COMPUTE_AND: 'i32.and',
  COMPUTE_OR: 'i32.or',
  COMPUTE_XOR: 'i32.xor',
  COMPUTE_SHIFT_LEFT: 'i32.shl',
  COMPUTE_SHIFT_RIGHT: 'i32.shr_s',
};

/** Maps a USEL symbol id to the corresponding f64 WASM instruction. */
const F64_OPS: Record<string, string> = {
  COMPUTE_ADD: 'f64.add',
  COMPUTE_SUBTRACT: 'f64.sub',
  COMPUTE_MULTIPLY: 'f64.mul',
  COMPUTE_DIVIDE: 'f64.div',
  COMPUTE_MIN: 'f64.min',
  COMPUTE_MAX: 'f64.max',
  COMPUTE_SQRT: 'f64.sqrt',
  COMPUTE_FLOOR: 'f64.floor',
  COMPUTE_CEIL: 'f64.ceil',
  COMPUTE_ABS: 'f64.abs',
  COMPUTE_NEGATE: 'f64.neg',
};

const I32_CMP: Record<string, string> = {
  COMPUTE_EQUAL: 'i32.eq',
  COMPUTE_NOT_EQUAL: 'i32.ne',
  COMPUTE_GREATER: 'i32.gt_s',
  COMPUTE_LESS: 'i32.lt_s',
  COMPUTE_GREATER_EQUAL: 'i32.ge_s',
  COMPUTE_LESS_EQUAL: 'i32.le_s',
};

const F64_CMP: Record<string, string> = {
  COMPUTE_EQUAL: 'f64.eq',
  COMPUTE_NOT_EQUAL: 'f64.ne',
  COMPUTE_GREATER: 'f64.gt',
  COMPUTE_LESS: 'f64.lt',
  COMPUTE_GREATER_EQUAL: 'f64.ge',
  COMPUTE_LESS_EQUAL: 'f64.le',
};

// ---------------------------------------------------------------------------
// Helpers for creating USEL nodes programmatically (for tests / quick use)
// ---------------------------------------------------------------------------

let _nodeId = 0;
function nextId(): string {
  return `__gen_${_nodeId++}`;
}

function makeSymbol(
  id: string,
  category: USELSymbol['category'] = 'math',
): USELSymbol {
  return {
    id,
    name: id,
    tier: 1,
    category,
    level: 1,
    glyph: '',
    color: '#000',
    accepts: [],
    provides: ['value'],
    pronunciation: {},
    description: '',
  };
}

/** Create a USEL node for a numeric literal. */
export function literal(value: number): USELNode {
  const isFloat = !Number.isInteger(value);
  return {
    id: nextId(),
    symbol: {
      ...makeSymbol(isFloat ? 'LITERAL_F64' : 'LITERAL_I32', 'quantifier'),
      name: String(value),
    },
    children: [],
    position: { x: 0, y: 0 },
  };
}

/** Create a compute node (e.g. COMPUTE_ADD) with children. */
export function compute(opId: string, ...children: USELNode[]): USELNode {
  const cat = I32_CMP[opId] || F64_CMP[opId]
    ? 'compare'
    : opId === 'IF' || opId === 'WHILE' || opId === 'LOOP' || opId === 'RETURN'
      ? 'control'
      : opId === 'COMPUTE_AND' || opId === 'COMPUTE_OR' || opId === 'COMPUTE_NOT'
        ? 'logical'
        : 'math';
  return {
    id: nextId(),
    symbol: makeSymbol(opId, cat as USELSymbol['category']),
    children,
    position: { x: 0, y: 0 },
  };
}

/** Convenience: build a full USEL AST from a single expression node. */
export function programFromExpr(root: USELNode): USELAST {
  return {
    type: 'program',
    statements: [{ type: 'statement', nodes: [root] }],
    metadata: { version: '1.0.0', level: 1, created: new Date().toISOString() },
  };
}

// ---------------------------------------------------------------------------
// Compilation context
// ---------------------------------------------------------------------------

interface CompilerContext {
  /** Collected WAT lines (indented) */
  lines: string[];
  /** Current indentation depth */
  indent: number;
  /** WASM IR instructions for the current function body */
  instructions: WasmInstruction[];
  /** Errors encountered during compilation */
  errors: string[];
  /** Track whether any f64 values were encountered */
  usesFloat: boolean;
  /** Track string data segments */
  strings: Map<string, number>;
  /** Next free memory offset for string data */
  memoryOffset: number;
  /** Collected WASM IR functions */
  irFunctions: WasmFunction[];
  /** Collected WASM IR imports */
  irImports: WasmImportFunc[];
  /** Collected data segments */
  irDataSegments: { offset: number; data: Uint8Array }[];
}

function createContext(): CompilerContext {
  return {
    lines: [],
    indent: 0,
    instructions: [],
    errors: [],
    usesFloat: false,
    strings: new Map(),
    memoryOffset: 0,
    irFunctions: [],
    irImports: [],
    irDataSegments: [],
  };
}

function emit(ctx: CompilerContext, line: string): void {
  ctx.lines.push('  '.repeat(ctx.indent) + line);
}

// ---------------------------------------------------------------------------
// Infer result type of an expression node
// ---------------------------------------------------------------------------

function inferType(node: USELNode): WasmValueType {
  const id = node.symbol.id;

  // Explicit literal types
  if (id === 'LITERAL_F64') return 'f64';
  if (id === 'LITERAL_I32') return 'i32';

  // If the name parses as a float, it's f64
  if (node.symbol.category === 'quantifier') {
    const v = Number(node.symbol.name);
    if (!Number.isNaN(v) && !Number.isInteger(v)) return 'f64';
    return 'i32';
  }

  // Comparisons always return i32 (0 or 1)
  if (I32_CMP[id] || F64_CMP[id]) return 'i32';

  // Unary f64 ops
  if (['COMPUTE_SQRT', 'COMPUTE_FLOOR', 'COMPUTE_CEIL', 'COMPUTE_ABS', 'COMPUTE_NEGATE'].includes(id)) {
    if (node.children.length > 0 && inferType(node.children[0]) === 'f64') return 'f64';
  }

  // Binary math — propagate f64 if either child is f64
  if (F64_OPS[id] && node.children.some(c => inferType(c) === 'f64')) return 'f64';

  // Control flow: IF result matches the type of the "then" branch
  if (id === 'IF' && node.children.length >= 3) return inferType(node.children[2]);

  return 'i32';
}

// ---------------------------------------------------------------------------
// Compile a single USEL node to WAT + IR instructions
// ---------------------------------------------------------------------------

function compileNode(node: USELNode, ctx: CompilerContext): void {
  const id = node.symbol.id;
  const cat = node.symbol.category;

  // --- Numeric Literals ---
  if (cat === 'quantifier' || id === 'LITERAL_I32' || id === 'LITERAL_F64') {
    const value = Number(node.symbol.name);
    if (Number.isNaN(value)) {
      ctx.errors.push(`Invalid numeric literal: "${node.symbol.name}"`);
      return;
    }
    const ty = inferType(node);
    if (ty === 'f64') {
      ctx.usesFloat = true;
      emit(ctx, `f64.const ${value}`);
      ctx.instructions.push({ op: 'f64.const', immediates: [value] });
    } else {
      emit(ctx, `i32.const ${value | 0}`);
      ctx.instructions.push({ op: 'i32.const', immediates: [value | 0] });
    }
    return;
  }

  // --- String Literals ---
  if (id === 'LITERAL_STRING') {
    const str = node.symbol.name;
    if (!ctx.strings.has(str)) {
      const offset = ctx.memoryOffset;
      const encoded = new TextEncoder().encode(str + '\0');
      ctx.strings.set(str, offset);
      ctx.irDataSegments.push({ offset, data: encoded });
      ctx.memoryOffset += encoded.length;
      // Align to 4 bytes
      ctx.memoryOffset = (ctx.memoryOffset + 3) & ~3;
    }
    const ptr = ctx.strings.get(str)!;
    emit(ctx, `i32.const ${ptr}  ;; string: "${str}"`);
    ctx.instructions.push({ op: 'i32.const', immediates: [ptr] });
    return;
  }

  // --- Binary Math Operations ---
  if (I32_OPS[id] || F64_OPS[id]) {
    if (node.children.length < 2) {
      // Unary operations (negate, sqrt, abs, etc.)
      if (node.children.length === 1) {
        compileNode(node.children[0], ctx);
        const childType = inferType(node.children[0]);

        if (id === 'COMPUTE_NEGATE' && childType === 'i32') {
          // i32 negate: 0 - x
          // We need to insert i32.const 0 before the child value
          // Rewrite: emit const 0, re-emit child, then sub
          const childLines = ctx.lines.splice(ctx.lines.length - 1);
          const childInstr = ctx.instructions.splice(ctx.instructions.length - 1);
          emit(ctx, 'i32.const 0');
          ctx.instructions.push({ op: 'i32.const', immediates: [0] });
          ctx.lines.push(...childLines);
          ctx.instructions.push(...childInstr);
          emit(ctx, 'i32.sub');
          ctx.instructions.push({ op: 'i32.sub' });
          return;
        }

        const op = childType === 'f64' ? F64_OPS[id] : I32_OPS[id];
        if (op) {
          emit(ctx, op);
          ctx.instructions.push({ op });
        } else {
          ctx.errors.push(`No unary ${childType} operation for ${id}`);
        }
        return;
      }
      ctx.errors.push(`${id} requires at least 2 operands, got ${node.children.length}`);
      return;
    }

    const resultType = inferType(node);
    const useFloat = resultType === 'f64';
    if (useFloat) ctx.usesFloat = true;

    // Compile first child
    compileNode(node.children[0], ctx);
    // If child is i32 but we need f64, convert
    if (useFloat && inferType(node.children[0]) === 'i32') {
      emit(ctx, 'f64.convert_i32_s');
      ctx.instructions.push({ op: 'f64.convert_i32_s' });
    }

    // Compile remaining children (left-associative folding)
    for (let i = 1; i < node.children.length; i++) {
      compileNode(node.children[i], ctx);
      if (useFloat && inferType(node.children[i]) === 'i32') {
        emit(ctx, 'f64.convert_i32_s');
        ctx.instructions.push({ op: 'f64.convert_i32_s' });
      }
      const op = useFloat ? F64_OPS[id] : I32_OPS[id];
      if (!op) {
        ctx.errors.push(`No ${useFloat ? 'f64' : 'i32'} operation for ${id}`);
        return;
      }
      emit(ctx, op);
      ctx.instructions.push({ op });
    }
    return;
  }

  // --- Comparison Operations ---
  if (I32_CMP[id] || F64_CMP[id]) {
    if (node.children.length < 2) {
      ctx.errors.push(`${id} requires 2 operands, got ${node.children.length}`);
      return;
    }
    const leftType = inferType(node.children[0]);
    const rightType = inferType(node.children[1]);
    const useFloat = leftType === 'f64' || rightType === 'f64';
    if (useFloat) ctx.usesFloat = true;

    compileNode(node.children[0], ctx);
    if (useFloat && leftType === 'i32') {
      emit(ctx, 'f64.convert_i32_s');
      ctx.instructions.push({ op: 'f64.convert_i32_s' });
    }

    compileNode(node.children[1], ctx);
    if (useFloat && rightType === 'i32') {
      emit(ctx, 'f64.convert_i32_s');
      ctx.instructions.push({ op: 'f64.convert_i32_s' });
    }

    const op = useFloat ? F64_CMP[id] : I32_CMP[id];
    if (!op) {
      ctx.errors.push(`No comparison operation for ${id}`);
      return;
    }
    emit(ctx, op);
    ctx.instructions.push({ op });
    return;
  }

  // --- Logical NOT ---
  if (id === 'COMPUTE_NOT') {
    if (node.children.length < 1) {
      ctx.errors.push('COMPUTE_NOT requires 1 operand');
      return;
    }
    compileNode(node.children[0], ctx);
    emit(ctx, 'i32.eqz');
    ctx.instructions.push({ op: 'i32.eqz' });
    return;
  }

  // --- IF / conditional ---
  if (id === 'IF') {
    // children[0] = condition, children[1] = then-expr
    // children[2] = else-expr (optional)
    if (node.children.length < 2) {
      ctx.errors.push('IF requires at least 2 children: condition, then-body');
      return;
    }
    const condNode = node.children[0];
    const thenNode = node.children[1];
    const elseNode = node.children.length > 2 ? node.children[2] : undefined;

    const resultType = thenNode ? inferType(thenNode) : 'i32';

    // Compile condition
    compileNode(condNode, ctx);

    // Save instruction position for IR
    const condInstrs = [...ctx.instructions];
    ctx.instructions = [];

    // Emit WAT if block
    emit(ctx, `(if (result ${resultType})`);
    ctx.indent++;
    emit(ctx, '(then');
    ctx.indent++;

    // Then-body
    const thenInstrStart: WasmInstruction[] = [];
    ctx.instructions = thenInstrStart;
    compileNode(thenNode, ctx);
    const thenInstrs = [...ctx.instructions];

    ctx.indent--;
    emit(ctx, ')');

    // Else-body
    emit(ctx, '(else');
    ctx.indent++;
    const elseInstrStart: WasmInstruction[] = [];
    ctx.instructions = elseInstrStart;

    if (elseNode) {
      compileNode(elseNode, ctx);
    } else {
      // Default: return 0
      if (resultType === 'f64') {
        emit(ctx, 'f64.const 0');
        ctx.instructions.push({ op: 'f64.const', immediates: [0] });
      } else {
        emit(ctx, 'i32.const 0');
        ctx.instructions.push({ op: 'i32.const', immediates: [0] });
      }
    }
    const elseInstrs = [...ctx.instructions];

    ctx.indent--;
    emit(ctx, ')');
    ctx.indent--;
    emit(ctx, ')');

    // Rebuild IR
    ctx.instructions = condInstrs;
    ctx.instructions.push({
      op: 'if',
      blockType: resultType,
      blocks: [thenInstrs, elseInstrs],
    });
    return;
  }

  // --- WHILE loop ---
  if (id === 'WHILE') {
    // children[0] = condition, children[1] = body
    if (node.children.length < 2) {
      ctx.errors.push('WHILE requires 2 children: condition, body');
      return;
    }

    emit(ctx, '(block $break');
    ctx.indent++;
    emit(ctx, '(loop $continue');
    ctx.indent++;

    // Condition — branch out if false
    compileNode(node.children[0], ctx);
    emit(ctx, 'i32.eqz');
    emit(ctx, 'br_if $break');

    // Body
    compileNode(node.children[1], ctx);
    emit(ctx, 'drop');  // discard body result to keep stack clean

    // Loop back
    emit(ctx, 'br $continue');

    ctx.indent--;
    emit(ctx, ')');
    ctx.indent--;
    emit(ctx, ')');

    // IR (simplified)
    ctx.instructions.push({
      op: 'block',
      blockType: 'void',
      blocks: [[
        { op: 'loop', blockType: 'void', blocks: [[
          ...ctx.instructions, // condition already emitted
          { op: 'i32.eqz' },
          { op: 'br_if', immediates: [1] },
          // body instructions would go here
          { op: 'br', immediates: [0] },
        ]] },
      ]],
    });
    return;
  }

  // --- RETURN ---
  if (id === 'RETURN') {
    if (node.children.length > 0) {
      compileNode(node.children[0], ctx);
    }
    emit(ctx, 'return');
    ctx.instructions.push({ op: 'return' });
    return;
  }

  // --- Unknown node ---
  ctx.errors.push(`Unknown USEL symbol: ${id} (category: ${cat})`);
}

// ---------------------------------------------------------------------------
// Compile a full USEL program
// ---------------------------------------------------------------------------

function compileStatement(
  stmt: USELStatement,
  ctx: CompilerContext,
): WasmValueType {
  let resultType: WasmValueType = 'i32';

  for (const node of stmt.nodes) {
    // If there are multiple nodes in a statement, the last value is the result
    resultType = inferType(node);
    compileNode(node, ctx);
  }
  return resultType;
}

/**
 * Compile a USEL AST into WAT text and a structured WasmModule IR.
 *
 * @returns A CompilationResult containing the WAT text, plus a `wasmModule`
 *          property on the result object for use by the binary encoder.
 */
export function compileToWAT(ast: USELAST): CompilationResult & { wasmModule: WasmModule } {
  _nodeId = 0; // reset generator
  const ctx = createContext();

  // Add standard imports
  const needsPrint = true; // always include for now
  if (needsPrint) {
    ctx.irImports.push({
      module: 'env',
      name: 'print_i32',
      params: ['i32'],
      results: [],
    });
    ctx.irImports.push({
      module: 'env',
      name: 'print_f64',
      params: ['f64'],
      results: [],
    });
  }

  // Compile each statement — for simplicity, we compile into a single `main` function.
  // The result type is determined by the last statement.
  const bodyLines: string[] = [];
  const bodyInstructions: WasmInstruction[] = [];
  let mainResultType: WasmValueType = 'i32';

  for (const stmt of ast.statements) {
    ctx.lines = [];
    ctx.instructions = [];
    mainResultType = compileStatement(stmt, ctx);
    bodyLines.push(...ctx.lines);
    bodyInstructions.push(...ctx.instructions);
  }

  if (ctx.errors.length > 0) {
    return {
      target: 'wasm',
      code: '',
      success: false,
      errors: ctx.errors,
      wasmModule: { functions: [], imports: [], },
    };
  }

  // --- Build WAT text ---
  const watLines: string[] = [];
  watLines.push('(module');

  // Memory (for strings)
  const needsMemory = ctx.strings.size > 0;
  if (needsMemory) {
    const pages = Math.max(1, Math.ceil(ctx.memoryOffset / 65536));
    watLines.push(`  (memory (export "memory") ${pages})`);
  }

  // Imports
  for (const imp of ctx.irImports) {
    const params = imp.params.map(p => `(param ${p})`).join(' ');
    const results = imp.results.map(r => `(result ${r})`).join(' ');
    const sig = [params, results].filter(Boolean).join(' ');
    watLines.push(`  (import "${imp.module}" "${imp.name}" (func $${imp.name} ${sig}))`);
  }

  // Data segments (for strings)
  for (const seg of ctx.irDataSegments) {
    const hex = Array.from(seg.data)
      .map(b => '\\' + b.toString(16).padStart(2, '0'))
      .join('');
    watLines.push(`  (data (i32.const ${seg.offset}) "${hex}")`);
  }

  // Main function
  watLines.push(`  (func $main (result ${mainResultType})`);
  for (const line of bodyLines) {
    watLines.push('    ' + line);
  }
  watLines.push('  )');
  watLines.push('  (export "main" (func $main))');
  watLines.push(')');

  const watText = watLines.join('\n') + '\n';

  // --- Build IR ---
  const wasmModule: WasmModule = {
    imports: ctx.irImports,
    functions: [{
      name: 'main',
      params: [],
      results: [mainResultType],
      locals: [],
      body: bodyInstructions,
      exported: 'main',
    }],
    ...(needsMemory ? {
      memory: {
        initial: Math.max(1, Math.ceil(ctx.memoryOffset / 65536)),
        exported: 'memory',
      },
      dataSegments: ctx.irDataSegments,
    } : {}),
  };

  return {
    target: 'wasm',
    code: watText,
    success: true,
    wasmModule,
  };
}

// ---------------------------------------------------------------------------
// Quick shorthand: compile a single expression to WAT
// ---------------------------------------------------------------------------

export function exprToWAT(root: USELNode): string {
  const result = compileToWAT(programFromExpr(root));
  if (!result.success) {
    throw new Error('USEL→WAT compilation failed:\n' + (result.errors ?? []).join('\n'));
  }
  return result.code;
}
