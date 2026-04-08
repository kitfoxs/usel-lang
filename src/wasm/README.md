# USEL → WebAssembly Compilation Target

The `src/wasm/` module compiles **USEL** (Universal Symbolic Executable Language)
programs into **WebAssembly**, enabling near-native execution in browsers, Node.js,
Deno, and any WASM runtime.

## Pipeline Overview

```
┌────────────┐    to-wat.ts     ┌──────────┐   wat-compiler.ts  ┌──────────┐   runtime.ts   ┌──────────┐
│  USEL AST  │ ──────────────►  │   WAT    │ ─────────────────► │   WASM   │ ─────────────► │  Result  │
│ (types.ts) │                  │  (text)  │                    │ (binary) │                │  (value) │
└────────────┘                  └──────────┘                    └──────────┘                └──────────┘
```

| Stage | File | Description |
|-------|------|-------------|
| **1. AST → WAT** | `to-wat.ts` | Converts the USEL node tree into valid WAT text and a structured IR |
| **2. WAT → WASM** | `wat-compiler.ts` | Compiles WAT to a WASM binary via `wabt` or a built-in encoder |
| **3. Execute** | `runtime.ts` | Loads the WASM module, provides imports, runs `main()` |

## Quick Start

```typescript
import { literal, compute, programFromExpr, compileAndRun } from './wasm';

// Build a USEL expression: (2 + 3) * 4
const expr = compute('COMPUTE_MULTIPLY',
  compute('COMPUTE_ADD', literal(2), literal(3)),
  literal(4),
);

const result = await compileAndRun(programFromExpr(expr));
console.log(result.value); // 20
```

Or if you just want the WAT text:

```typescript
import { exprToWAT, literal, compute } from './wasm';

const wat = exprToWAT(
  compute('COMPUTE_ADD', literal(5), literal(3))
);
console.log(wat);
// (module
//   (func $main (result i32)
//     i32.const 5
//     i32.const 3
//     i32.add
//   )
//   (export "main" (func $main))
// )
```

## Supported Operations

### Math (i32 and f64)

| USEL Symbol | WAT (i32) | WAT (f64) |
|-------------|-----------|-----------|
| `COMPUTE_ADD` | `i32.add` | `f64.add` |
| `COMPUTE_SUBTRACT` | `i32.sub` | `f64.sub` |
| `COMPUTE_MULTIPLY` | `i32.mul` | `f64.mul` |
| `COMPUTE_DIVIDE` | `i32.div_s` | `f64.div` |
| `COMPUTE_MODULO` | `i32.rem_s` | — |
| `COMPUTE_AND` | `i32.and` | — |
| `COMPUTE_OR` | `i32.or` | — |
| `COMPUTE_XOR` | `i32.xor` | — |
| `COMPUTE_NEGATE` | `0 - x` | `f64.neg` |
| `COMPUTE_SQRT` | — | `f64.sqrt` |
| `COMPUTE_ABS` | — | `f64.abs` |
| `COMPUTE_FLOOR` | — | `f64.floor` |
| `COMPUTE_CEIL` | — | `f64.ceil` |
| `COMPUTE_MIN` | — | `f64.min` |
| `COMPUTE_MAX` | — | `f64.max` |

### Comparisons (return i32: 0 or 1)

| USEL Symbol | WAT (i32) | WAT (f64) |
|-------------|-----------|-----------|
| `COMPUTE_EQUAL` | `i32.eq` | `f64.eq` |
| `COMPUTE_NOT_EQUAL` | `i32.ne` | `f64.ne` |
| `COMPUTE_GREATER` | `i32.gt_s` | `f64.gt` |
| `COMPUTE_LESS` | `i32.lt_s` | `f64.lt` |
| `COMPUTE_GREATER_EQUAL` | `i32.ge_s` | `f64.ge` |
| `COMPUTE_LESS_EQUAL` | `i32.le_s` | `f64.le` |

### Control Flow

| USEL Symbol | WAT Construct |
|-------------|---------------|
| `IF` | `(if (result T) (then ...) (else ...))` |
| `WHILE` | `(block (loop ... br_if ... br))` |
| `RETURN` | `return` |

### Logic

| USEL Symbol | WAT |
|-------------|-----|
| `COMPUTE_NOT` | `i32.eqz` |
| `COMPUTE_AND` | `i32.and` |
| `COMPUTE_OR` | `i32.or` |

### Type Handling

| Type | WAT | Notes |
|------|-----|-------|
| Integers | `i32` | Default numeric type |
| Floats | `f64` | Auto-detected from non-integer literals |
| Strings | `i32` (pointer) | Stored in linear memory, accessed by pointer |
| Booleans | `i32` | 0 = false, non-zero = true |

When mixing `i32` and `f64` in a binary operation, `i32` values are
automatically promoted via `f64.convert_i32_s`.

## WAT → WASM Compilation

The `wat-compiler.ts` module offers two backends:

1. **`wabt` npm package** (preferred) — full WAT parser and validator.
   Install with `npm install wabt`.
2. **Built-in binary encoder** (fallback) — encodes the structured `WasmModule`
   IR directly to the WASM binary format. Covers the entire instruction subset
   that `to-wat.ts` generates; no external dependencies needed.

```typescript
import { compileWATtoWASM } from './wasm';

// Using wabt (if installed)
const bytes = await compileWATtoWASM(watString);

// Using built-in encoder (pass the IR)
const result = compileToWAT(ast);
const bytes = await compileWATtoWASM(result.code, result.wasmModule);
```

## Runtime Imports

Every USEL WASM module receives these imports from the `env` namespace:

| Import | Signature | Description |
|--------|-----------|-------------|
| `print_i32` | `(i32) → void` | Print an integer to stdout |
| `print_f64` | `(f64) → void` | Print a float to stdout |
| `print_string` | `(i32, i32) → void` | Print a string from memory (ptr, len) |

Custom imports can be provided via `executeWASM(bytes, { extraImports: ... })`.

## Architecture Decisions

- **Stack machine alignment** — WASM is a stack machine, and so is USEL's
  expression model. This makes compilation straightforward: each expression
  node pushes its result onto the stack.
- **Single `main` function** — Currently all statements compile into one
  exported function. Future versions will support multiple named functions.
- **Left-associative folding** — N-ary operations (e.g., `ADD(1, 2, 3)`)
  fold left: `(1 + 2) + 3`.
- **Automatic type promotion** — Mixed `i32`/`f64` expressions promote to
  `f64`. Comparisons always return `i32`.

## Limitations

| Limitation | Status | Notes |
|------------|--------|-------|
| Multiple functions | ⏳ Planned | Currently single `main` only |
| Local variables | ⏳ Planned | IR supports them, WAT emission not yet wired |
| Function calls | ⏳ Planned | Cross-function calls within the module |
| String operations | 🔧 Basic | Strings stored as pointers; no concatenation yet |
| Memory management | 🔧 Basic | Static data segments only; no allocator |
| WASI support | ⏳ Planned | Would enable file I/O, CLI args, etc. |
| i64 support | ⏳ Planned | Opcodes are mapped, not yet exposed |
| Error recovery | 🔧 Basic | Compilation aborts on first error |
| Source maps | ❌ Not yet | No debug info mapping back to USEL |

## Future Plans

1. **WASI integration** — Enable USEL programs to interact with the filesystem,
   environment variables, and standard I/O via the WASI standard.
2. **Memory allocator** — A simple bump allocator for dynamic string/array
   operations within WASM linear memory.
3. **Multi-function modules** — Compile USEL function definitions to separate
   WASM functions with proper call linkage.
4. **Optimization passes** — Constant folding, dead code elimination, and
   instruction combining before binary encoding.
5. **Streaming compilation** — Use `WebAssembly.compileStreaming` for faster
   load times in browsers.
6. **WASM Component Model** — When the Component Model stabilizes, generate
   components with typed interfaces instead of raw WASM modules.

## File Structure

```
src/wasm/
├── index.ts          # Barrel exports
├── to-wat.ts         # USEL AST → WAT text + WasmModule IR
├── wat-compiler.ts   # WAT/IR → WASM binary (wabt or built-in encoder)
├── runtime.ts        # WASM instantiation and execution
└── README.md         # This file
```
