/**
 * USEL WebAssembly Target — barrel export
 */

// AST → WAT compiler + node helpers
export {
  compileToWAT,
  exprToWAT,
  literal,
  compute,
  programFromExpr,
} from './to-wat';
export type { WasmModule, WasmInstruction, WasmFunction, WasmValueType } from './to-wat';

// WAT/IR → WASM binary
export { compileWATtoWASM, encodeWasmModule } from './wat-compiler';

// Runtime
export {
  executeWASM,
  validateWASM,
  compileAndRun,
  createImportObject,
} from './runtime';
export type { WASMExecutionResult } from './runtime';
