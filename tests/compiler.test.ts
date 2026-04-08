import { describe, it, expect } from 'vitest';
import { compile } from '../src/compiler/pipeline';
import { compileToJS } from '../src/compiler/to-javascript';
import { compileToPython } from '../src/compiler/to-python';
import { compileToNatural } from '../src/compiler/to-natural';
import { compileToUSELText } from '../src/compiler/to-usel-text';
import {
  classifyNode, analyseStatement, toCamelCase, toSnakeCase,
  isConditional, splitConditional,
} from '../src/compiler/utils';
import type { USELNode, USELStatement, USELAST, USELSymbol } from '../src/primes/types';
import { TIER0_PRIMES } from '../src/primes/tier0-core';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function node(symbol: USELSymbol): USELNode {
  return {
    id: `test-${symbol.id}`,
    symbol,
    children: [],
    position: { x: 0, y: 0 },
  };
}

function stmt(nodes: USELNode[]): USELStatement {
  return { type: 'statement', nodes };
}

function ast(stmts: USELStatement[]): USELAST {
  return {
    type: 'program',
    statements: stmts,
    metadata: { version: '1.0.0', level: 1, created: new Date().toISOString() },
  };
}

const DO = TIER0_PRIMES.find((p) => p.id === 'PRIME_DO')!;
const WANT = TIER0_PRIMES.find((p) => p.id === 'PRIME_WANT')!;
const GOOD = TIER0_PRIMES.find((p) => p.id === 'PRIME_GOOD')!;
const I_SYM = TIER0_PRIMES.find((p) => p.id === 'PRIME_I')!;
const NOT_SYM = TIER0_PRIMES.find((p) => p.id === 'PRIME_NOT')!;
const IF_SYM = TIER0_PRIMES.find((p) => p.id === 'PRIME_IF')!;

// ─── Utils ───────────────────────────────────────────────────────────────────

describe('Compiler utils', () => {
  it('toCamelCase', () => {
    expect(toCamelCase('HELLO_WORLD')).toBe('helloWorld');
    expect(toCamelCase('FOO')).toBe('foo');
  });

  it('toSnakeCase', () => {
    expect(toSnakeCase('HELLO WORLD')).toBe('hello_world');
    expect(toSnakeCase('FOO')).toBe('foo');
  });

  it('classifyNode assigns role based on category', () => {
    const n = node(DO);
    const role = classifyNode(n);
    expect(role).toBe('predicate');
  });

  it('isConditional detects IF node', () => {
    const s = stmt([node(IF_SYM), node(DO)]);
    expect(isConditional(s)).toBe(true);
  });

  it('isConditional returns false for non-conditional', () => {
    const s = stmt([node(GOOD)]);
    expect(isConditional(s)).toBe(false);
  });

  it('splitConditional separates condition from body', () => {
    const s = stmt([node(IF_SYM), node(GOOD), node(DO)]);
    const split = splitConditional(s);
    expect(split.conditionNodes.length).toBeGreaterThan(0);
  });

  it('analyseStatement returns populated analysis', () => {
    const s = stmt([node(I_SYM), node(WANT), node(GOOD)]);
    const analysis = analyseStatement(s);
    expect(analysis).toBeTruthy();
    expect(analysis.subject).toBeTruthy();
  });
});

// ─── Pipeline ────────────────────────────────────────────────────────────────

describe('Compile pipeline', () => {
  const testAST = ast([stmt([node(I_SYM), node(DO), node(GOOD)])]);

  it('compiles to javascript', () => {
    const result = compile(testAST, 'javascript');
    expect(result.target).toBe('javascript');
    expect(result.success).toBe(true);
    expect(result.code.length).toBeGreaterThan(0);
  });

  it('compiles to python', () => {
    const result = compile(testAST, 'python');
    expect(result.target).toBe('python');
    expect(result.success).toBe(true);
    expect(result.code.length).toBeGreaterThan(0);
  });

  it('compiles to natural', () => {
    const result = compile(testAST, 'natural');
    expect(result.target).toBe('natural');
    expect(result.success).toBe(true);
    expect(result.code.length).toBeGreaterThan(0);
  });

  it('compiles to usel-text', () => {
    const result = compile(testAST, 'usel-text');
    expect(result.target).toBe('usel-text');
    expect(result.success).toBe(true);
    expect(result.code.length).toBeGreaterThan(0);
  });

  it('returns error for unknown target', () => {
    const result = compile(testAST, 'ruby' as any);
    expect(result.success).toBe(false);
  });

  it('validates invalid AST', () => {
    const result = compile({} as any, 'javascript');
    expect(result.success).toBe(false);
  });
});

// ─── JavaScript target ──────────────────────────────────────────────────────

describe('Compile → JavaScript', () => {
  it('produces code with function calls', () => {
    const code = compileToJS(ast([stmt([node(I_SYM), node(DO)])]));
    expect(code.length).toBeGreaterThan(0);
    expect(code).toContain('do');
  });

  it('handles conditional statements', () => {
    const code = compileToJS(ast([stmt([node(IF_SYM), node(GOOD), node(DO)])]));
    expect(code).toContain('if');
  });
});

// ─── Python target ──────────────────────────────────────────────────────────

describe('Compile → Python', () => {
  it('produces python code', () => {
    const code = compileToPython(ast([stmt([node(I_SYM), node(DO)])]));
    expect(code.length).toBeGreaterThan(0);
  });

  it('handles conditional statements', () => {
    const code = compileToPython(ast([stmt([node(IF_SYM), node(GOOD), node(DO)])]));
    expect(code.toLowerCase()).toContain('if');
  });
});

// ─── Natural language target ─────────────────────────────────────────────────

describe('Compile → Natural', () => {
  it('produces readable text', () => {
    const text = compileToNatural(ast([stmt([node(I_SYM), node(WANT)])]), 'en');
    expect(text.length).toBeGreaterThan(0);
    expect(typeof text).toBe('string');
  });

  it('default language is English', () => {
    const text = compileToNatural(ast([stmt([node(GOOD)])]));
    expect(text.length).toBeGreaterThan(0);
  });
});

// ─── USEL text target ───────────────────────────────────────────────────────

describe('Compile → USEL text', () => {
  it('produces USEL notation', () => {
    const code = compileToUSELText(ast([stmt([node(I_SYM), node(DO)])]));
    expect(code.length).toBeGreaterThan(0);
    expect(code).toContain('[');
  });
});
