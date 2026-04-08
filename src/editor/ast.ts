/**
 * USEL AST Builder
 *
 * Functions to construct, flatten, and validate the USEL abstract
 * syntax tree from individual symbol nodes.
 */

import type {
  USELSymbol,
  USELNode,
  USELStatement,
  USELAST,
  AccessLevel,
} from '../primes/types';

import { canConnect, validateChain } from './grammar';

// ---------------------------------------------------------------------------
// Unique ID generation
// ---------------------------------------------------------------------------

let _counter = 0;

/** Generate a unique, deterministic-ish ID for a node. */
export function generateId(prefix = 'node'): string {
  _counter += 1;
  return `${prefix}_${Date.now().toString(36)}_${_counter.toString(36)}`;
}

/** Reset the internal counter (useful in tests). */
export function resetIdCounter(): void {
  _counter = 0;
}

// ---------------------------------------------------------------------------
// Node creation
// ---------------------------------------------------------------------------

/** Create a leaf USELNode from a symbol at an optional position. */
export function createNode(
  symbol: USELSymbol,
  position: { x: number; y: number } = { x: 0, y: 0 },
): USELNode {
  return {
    id: generateId('n'),
    symbol,
    children: [],
    position,
  };
}

// ---------------------------------------------------------------------------
// Statement creation
// ---------------------------------------------------------------------------

/**
 * Build a USELStatement from an ordered sequence of nodes.
 *
 * The first node that provides a `condition` slot will be split
 * into the statement's `condition` sub-statement automatically.
 */
export function buildStatement(nodes: USELNode[]): USELStatement {
  const conditionIdx = nodes.findIndex((n) =>
    n.symbol.provides.includes('condition'),
  );

  if (conditionIdx > 0) {
    return {
      type: 'statement',
      nodes: nodes.slice(0, conditionIdx),
      condition: {
        type: 'statement',
        nodes: nodes.slice(conditionIdx),
      },
    };
  }

  return { type: 'statement', nodes };
}

/**
 * Build a statement from raw symbols (creates nodes internally).
 */
export function buildStatementFromSymbols(symbols: USELSymbol[]): USELStatement {
  const nodes = symbols.map((s, i) =>
    createNode(s, { x: i * 140, y: 0 }),
  );
  return buildStatement(nodes);
}

// ---------------------------------------------------------------------------
// AST creation
// ---------------------------------------------------------------------------

/** Build a full USELAST from a list of statements. */
export function buildAST(
  statements: USELStatement[],
  level: AccessLevel = 1,
): USELAST {
  return {
    type: 'program',
    statements,
    metadata: {
      version: '1.0.0',
      level,
      created: new Date().toISOString(),
    },
  };
}

/**
 * Convenience: build an AST from a single flat list of symbols,
 * treating the whole list as one statement.
 */
export function buildASTFromSymbols(
  symbols: USELSymbol[],
  level: AccessLevel = 1,
): USELAST {
  const stmt = buildStatementFromSymbols(symbols);
  return buildAST([stmt], level);
}

// ---------------------------------------------------------------------------
// Flatten
// ---------------------------------------------------------------------------

/** Recursively collect every USELNode in an AST. */
export function flattenAST(ast: USELAST): USELNode[] {
  const out: USELNode[] = [];

  function walkStatement(stmt: USELStatement): void {
    for (const node of stmt.nodes) walkNode(node);
    if (stmt.condition) walkStatement(stmt.condition);
  }

  function walkNode(node: USELNode): void {
    out.push(node);
    for (const child of node.children) walkNode(child);
  }

  for (const stmt of ast.statements) walkStatement(stmt);
  return out;
}

/** Flatten a single statement into a node list. */
export function flattenStatement(stmt: USELStatement): USELNode[] {
  const out: USELNode[] = [...stmt.nodes];
  if (stmt.condition) out.push(...flattenStatement(stmt.condition));
  return out;
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

export interface ASTValidation {
  valid: boolean;
  errors: Array<{
    statementIndex: number;
    nodeIndex?: number;
    message: string;
  }>;
}

/**
 * Validate every statement in an AST against the grammar rules.
 *
 * Checks:
 *  1. Each statement has at least one node.
 *  2. Every adjacent pair of symbols in a statement can connect.
 *  3. Conditional sub-statements are also valid.
 */
export function validateAST(ast: USELAST): ASTValidation {
  const errors: ASTValidation['errors'] = [];

  function checkStatement(stmt: USELStatement, stmtIdx: number): void {
    if (stmt.nodes.length === 0) {
      errors.push({ statementIndex: stmtIdx, message: 'Empty statement' });
      return;
    }

    const symbols = stmt.nodes.map((n) => n.symbol);
    const chain = validateChain(symbols);

    for (const err of chain.errors) {
      errors.push({
        statementIndex: stmtIdx,
        nodeIndex: err.index,
        message: err.message,
      });
    }

    if (stmt.condition) {
      checkStatement(stmt.condition, stmtIdx);
    }
  }

  ast.statements.forEach((stmt, i) => checkStatement(stmt, i));

  return { valid: errors.length === 0, errors };
}
