/**
 * WASM Runtime — load and execute compiled USEL→WASM modules.
 *
 * Provides:
 *  • Standard library imports (print, math helpers)
 *  • Module instantiation
 *  • Output capture
 */

// ---------------------------------------------------------------------------
// Runtime output capture
// ---------------------------------------------------------------------------

export interface WASMExecutionResult {
  /** Return value of the exported `main` function (if any). */
  value: unknown;
  /** Captured stdout lines from `print_*` calls. */
  stdout: string[];
  /** Execution time in milliseconds. */
  elapsed: number;
}

// ---------------------------------------------------------------------------
// Standard environment imports provided to every USEL WASM module
// ---------------------------------------------------------------------------

function createEnvImports(stdout: string[]): WebAssembly.ModuleImports {
  return {
    print_i32(v: number) {
      stdout.push(String(v));
    },
    print_f64(v: number) {
      stdout.push(String(v));
    },
    print_string(_ptr: number, _len: number) {
      // Initial stub — patched with real linear memory reader in executeWASM()
      // after the instance is available. See lines 90-98 below.
      stdout.push('[string]');
    },
  };
}

/**
 * Create a full importObject suitable for `WebAssembly.instantiate`.
 * Can be extended with user-supplied imports that override/augment the defaults.
 */
export function createImportObject(
  stdout: string[],
  extra?: Record<string, WebAssembly.ModuleImports>,
): WebAssembly.Imports {
  return {
    env: createEnvImports(stdout),
    ...extra,
  };
}

// ---------------------------------------------------------------------------
// Execution
// ---------------------------------------------------------------------------

/**
 * Instantiate and execute a compiled USEL WASM module.
 *
 * By default the runtime calls the exported `main` function and returns its
 * result along with any captured stdout output.
 *
 * @param wasmBytes  - The compiled WASM binary (Uint8Array)
 * @param options    - Optional overrides
 * @returns            Execution result with return value, stdout, and timing
 */
export async function executeWASM(
  wasmBytes: Uint8Array,
  options?: {
    /** Name of the exported function to call (default: "main") */
    entryPoint?: string;
    /** Arguments to pass to the entry-point function */
    args?: unknown[];
    /** Additional import objects to merge into the environment */
    extraImports?: Record<string, WebAssembly.ModuleImports>;
  },
): Promise<WASMExecutionResult> {
  const stdout: string[] = [];
  const importObject = createImportObject(stdout, options?.extraImports);

  const t0 = performance.now();

  const buf = wasmBytes.buffer as ArrayBuffer;
  const { instance } = await WebAssembly.instantiate(buf, importObject);

  // Patch print_string to read from the instance's memory if exported
  const memory = instance.exports['memory'] as WebAssembly.Memory | undefined;
  if (memory) {
    const env = importObject['env'] as Record<string, Function>;
    env['print_string'] = (ptr: number, len: number) => {
      const bytes = new Uint8Array(memory.buffer, ptr, len);
      stdout.push(new TextDecoder().decode(bytes));
    };
  }

  const entryPoint = options?.entryPoint ?? 'main';
  const fn = instance.exports[entryPoint];
  if (typeof fn !== 'function') {
    throw new Error(
      `WASM module has no exported function "${entryPoint}". ` +
      `Available exports: ${Object.keys(instance.exports).join(', ')}`,
    );
  }

  const args = options?.args ?? [];
  const value = (fn as Function)(...args);

  const elapsed = performance.now() - t0;

  return { value, stdout, elapsed };
}

// ---------------------------------------------------------------------------
// Validation helper
// ---------------------------------------------------------------------------

/**
 * Validate a WASM binary without executing it.
 * Returns `true` if the module is structurally valid.
 */
export async function validateWASM(wasmBytes: Uint8Array): Promise<boolean> {
  try {
    // WebAssembly.validate is synchronous in most runtimes
    if (typeof WebAssembly.validate === 'function') {
      return WebAssembly.validate(wasmBytes.buffer as ArrayBuffer);
    }
    // Fallback: try to compile — will throw on invalid modules
    await WebAssembly.compile(wasmBytes.buffer as ArrayBuffer);
    return true;
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------------
// All-in-one convenience: USEL AST → execute
// ---------------------------------------------------------------------------

import type { USELAST } from '../primes/types';
import { compileToWAT } from './to-wat';
import { compileWATtoWASM } from './wat-compiler';

/**
 * Compile a USEL AST and immediately execute the resulting WASM.
 *
 * This is a high-level convenience that chains the full pipeline:
 *   USEL AST → WAT → WASM binary → instantiate → execute
 */
export async function compileAndRun(
  ast: USELAST,
  options?: Parameters<typeof executeWASM>[1],
): Promise<WASMExecutionResult> {
  const compiled = compileToWAT(ast);
  if (!compiled.success) {
    throw new Error(
      'USEL compilation failed:\n' + (compiled.errors ?? []).join('\n'),
    );
  }

  const wasmBytes = await compileWATtoWASM(compiled.code, compiled.wasmModule);
  return executeWASM(wasmBytes, options);
}
