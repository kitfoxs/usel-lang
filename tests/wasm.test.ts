import { describe, it, expect } from 'vitest';
import {
  compileToWAT, literal, compute, programFromExpr, exprToWAT,
} from '../src/wasm/to-wat.js';
import { compileWATtoWASM, encodeWasmModule } from '../src/wasm/wat-compiler.js';

// ─── WAT Compilation ─────────────────────────────────────────────────────────

describe('WASM — compileToWAT', () => {
  it('compiles literal to WAT', () => {
    const ast = programFromExpr(literal(42));
    const result = compileToWAT(ast);
    expect(result.target).toBe('wasm');
    expect(result.code).toContain('i32.const 42');
  });

  it('compiles addition', () => {
    const ast = programFromExpr(compute('COMPUTE_ADD', literal(2), literal(3)));
    const result = compileToWAT(ast);
    expect(result.code).toContain('i32.add');
  });

  it('compiles subtraction', () => {
    const ast = programFromExpr(compute('COMPUTE_SUBTRACT', literal(10), literal(4)));
    const result = compileToWAT(ast);
    expect(result.code).toContain('i32.sub');
  });

  it('compiles multiplication', () => {
    const ast = programFromExpr(compute('COMPUTE_MULTIPLY', literal(3), literal(7)));
    const result = compileToWAT(ast);
    expect(result.code).toContain('i32.mul');
  });

  it('compiles nested expressions', () => {
    const expr = compute('COMPUTE_ADD', literal(1), compute('COMPUTE_MULTIPLY', literal(2), literal(3)));
    const ast = programFromExpr(expr);
    const result = compileToWAT(ast);
    expect(result.code).toContain('i32.add');
    expect(result.code).toContain('i32.mul');
  });

  it('exprToWAT returns WAT string', () => {
    const wat = exprToWAT(literal(99));
    expect(typeof wat).toBe('string');
    expect(wat).toContain('99');
  });

  it('result includes wasmModule IR', () => {
    const ast = programFromExpr(literal(1));
    const result = compileToWAT(ast);
    expect(result.wasmModule).toBeDefined();
    expect(result.wasmModule.functions.length).toBeGreaterThan(0);
  });
});

// ─── WASM Binary Encoding ────────────────────────────────────────────────────

describe('WASM — binary encoding', () => {
  it('encodeWasmModule produces Uint8Array', () => {
    const ast = programFromExpr(literal(42));
    const { wasmModule } = compileToWAT(ast);
    const binary = encodeWasmModule(wasmModule);
    expect(binary).toBeInstanceOf(Uint8Array);
  });

  it('WASM binary starts with magic header', () => {
    const ast = programFromExpr(literal(42));
    const { wasmModule } = compileToWAT(ast);
    const binary = encodeWasmModule(wasmModule);
    // WASM magic: \0asm
    expect(binary[0]).toBe(0x00);
    expect(binary[1]).toBe(0x61); // 'a'
    expect(binary[2]).toBe(0x73); // 's'
    expect(binary[3]).toBe(0x6d); // 'm'
  });

  it('WASM binary has version 1', () => {
    const ast = programFromExpr(literal(42));
    const { wasmModule } = compileToWAT(ast);
    const binary = encodeWasmModule(wasmModule);
    expect(binary[4]).toBe(0x01);
    expect(binary[5]).toBe(0x00);
    expect(binary[6]).toBe(0x00);
    expect(binary[7]).toBe(0x00);
  });

  it('compileWATtoWASM returns binary from WAT text', async () => {
    const ast = programFromExpr(literal(7));
    const result = compileToWAT(ast);
    const binary = await compileWATtoWASM(result.code, result.wasmModule);
    expect(binary).toBeInstanceOf(Uint8Array);
    expect(binary.length).toBeGreaterThan(8);
  });
});
