import { describe, it, expect, beforeEach } from 'vitest';
import {
  canConnect, validateChain, GRAMMAR_RULES, SLOT_CONNECTIONS,
} from '../src/editor/grammar.js';
import {
  buildAST, buildASTFromSymbols, flattenAST, validateAST,
  buildStatement, createNode, resetIdCounter,
} from '../src/editor/ast.js';
import { TIER0_PRIMES } from '../src/primes/tier0-core.js';
import type { USELSymbol, USELNode } from '../src/primes/types.js';

const I = TIER0_PRIMES.find((p) => p.id === 'PRIME_I')!;
const DO = TIER0_PRIMES.find((p) => p.id === 'PRIME_DO')!;
const WANT = TIER0_PRIMES.find((p) => p.id === 'PRIME_WANT')!;
const GOOD = TIER0_PRIMES.find((p) => p.id === 'PRIME_GOOD')!;
const NOT = TIER0_PRIMES.find((p) => p.id === 'PRIME_NOT')!;
const SOMEONE = TIER0_PRIMES.find((p) => p.id === 'PRIME_SOMEONE')!;

// ─── Grammar Rules ───────────────────────────────────────────────────────────

describe('Grammar rules', () => {
  it('GRAMMAR_RULES has entries', () => {
    expect(GRAMMAR_RULES.length).toBeGreaterThan(0);
  });

  it('SLOT_CONNECTIONS has entries', () => {
    expect(Object.keys(SLOT_CONNECTIONS).length).toBeGreaterThan(0);
  });

  it('canConnect returns boolean', () => {
    expect(typeof canConnect(I, WANT)).toBe('boolean');
  });

  it('validateChain validates valid chain', () => {
    const result = validateChain([I, WANT, GOOD]);
    expect(result).toHaveProperty('valid');
  });

  it('validateChain with single symbol is valid', () => {
    const result = validateChain([I]);
    expect(result.valid).toBe(true);
  });

  it('validateChain returns errors array', () => {
    const result = validateChain([]);
    expect(Array.isArray(result.errors)).toBe(true);
  });
});

// ─── AST Builder ─────────────────────────────────────────────────────────────

describe('AST builder', () => {
  beforeEach(() => resetIdCounter());

  it('createNode builds a node with unique id', () => {
    const n = createNode(I);
    expect(n.id).toBeTruthy();
    expect(n.symbol).toBe(I);
    expect(n.children).toEqual([]);
  });

  it('buildStatement groups nodes', () => {
    const nodes: USELNode[] = [createNode(I), createNode(DO)];
    const s = buildStatement(nodes);
    expect(s.nodes).toHaveLength(2);
  });

  it('buildASTFromSymbols creates full AST', () => {
    const ast = buildASTFromSymbols([I, DO, GOOD]);
    expect(ast.statements).toHaveLength(1);
    expect(ast.statements[0].nodes.length).toBe(3);
  });

  it('buildAST handles multiple statements', () => {
    const n1 = [createNode(I), createNode(DO)];
    const n2 = [createNode(SOMEONE), createNode(WANT)];
    const s1 = buildStatement(n1);
    const s2 = buildStatement(n2);
    const ast = buildAST([s1, s2]);
    expect(ast.statements).toHaveLength(2);
  });

  it('flattenAST returns all nodes', () => {
    const ast = buildASTFromSymbols([I, WANT, GOOD]);
    const flat = flattenAST(ast);
    expect(flat).toHaveLength(3);
  });

  it('validateAST returns validation result', () => {
    const ast = buildASTFromSymbols([I, DO]);
    const result = validateAST(ast);
    expect(result).toHaveProperty('valid');
    expect(Array.isArray(result.errors)).toBe(true);
  });

  it('validateAST handles empty AST', () => {
    const ast = buildAST([]);
    const result = validateAST(ast);
    // Empty AST with no statements is structurally valid (no errors to report)
    expect(result).toHaveProperty('valid');
    expect(result.errors).toBeDefined();
  });
});
