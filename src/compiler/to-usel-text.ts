/**
 * USEL → USEL Text Notation Compiler
 *
 * Converts a USEL AST into a compact symbolic text representation
 * using the glyphs assigned to each prime.
 *
 * Two output modes:
 *   glyph-only : [◉]+[◈]+[👁]+[☐]+[⬛]
 *   named      : [I]→[WANT]→[SEE]→[SOMETHING]→[BIG]
 *
 * Default output includes both lines for maximum readability.
 *
 * Conventions:
 *   [ ]  — enclose each prime
 *   →    — chain primes in named mode
 *   +    — chain primes in glyph mode
 *   |    — statement separator
 *   ?{ } — conditional wrapper
 *   #{ } — compute block
 */

import type { USELAST, USELNode, USELStatement } from '../primes/types.js';
import { getGlyph, classifyNode, isConditional, splitConditional } from './utils.js';

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export interface USELTextOptions {
  /** Include the glyph-only line (default: true). */
  glyphs?: boolean;
  /** Include the named line (default: true). */
  names?: boolean;
  /** Include USEL header comment (default: true). */
  header?: boolean;
}

/**
 * Compile a USEL AST into USEL text notation.
 *
 * Returns a string containing one or both representation styles
 * depending on the options provided.
 */
export function compileToUSELText(
  ast: USELAST,
  options: USELTextOptions = {},
): string {
  const { glyphs = true, names = true, header = true } = options;

  if (!ast.statements.length) return '';

  const lines: string[] = [];

  if (header) {
    lines.push(`; USEL v${ast.metadata.version} | level ${ast.metadata.level}`);
    lines.push('');
  }

  for (let i = 0; i < ast.statements.length; i++) {
    const stmt = ast.statements[i];

    if (glyphs) {
      lines.push(compileStatementGlyphs(stmt));
    }
    if (names) {
      lines.push(compileStatementNames(stmt));
    }

    // Separator between statements
    if (i < ast.statements.length - 1) {
      lines.push('|');
    }
  }

  return lines.join('\n') + '\n';
}

// ---------------------------------------------------------------------------
// Glyph-mode rendering
// ---------------------------------------------------------------------------

function compileStatementGlyphs(stmt: USELStatement): string {
  if (stmt.nodes.length === 0) return '[∅]';

  if (isConditional(stmt)) {
    return compileConditionalGlyphs(stmt);
  }

  if (stmt.condition) {
    const condGlyphs = compileStatementGlyphs(stmt.condition);
    const bodyGlyphs = nodesGlyphs(stmt.nodes);
    return `?{${condGlyphs}}+${bodyGlyphs}`;
  }

  return nodesGlyphs(stmt.nodes);
}

function compileConditionalGlyphs(stmt: USELStatement): string {
  const { conditionNodes, bodyNodes } = splitConditional(stmt);
  const condStr = conditionNodes.length ? nodesGlyphs(conditionNodes) : '[∅]';
  const bodyStr = bodyNodes.length ? nodesGlyphs(bodyNodes) : '[∅]';
  return `?{${condStr}}+${bodyStr}`;
}

function nodesGlyphs(nodes: USELNode[]): string {
  return nodes.map(n => nodeGlyph(n)).join('+');
}

function nodeGlyph(node: USELNode): string {
  const g = getGlyph(node);
  const base = `[${g}]`;

  if (node.children.length === 0) return base;

  // Render children recursively
  const childStr = node.children.map(c => nodeGlyph(c)).join('+');
  return `${base}{${childStr}}`;
}

// ---------------------------------------------------------------------------
// Named-mode rendering
// ---------------------------------------------------------------------------

function compileStatementNames(stmt: USELStatement): string {
  if (stmt.nodes.length === 0) return '[EMPTY]';

  if (isConditional(stmt)) {
    return compileConditionalNames(stmt);
  }

  if (stmt.condition) {
    const condNames = compileStatementNames(stmt.condition);
    const bodyNames = nodesNames(stmt.nodes);
    return `?{${condNames}}→${bodyNames}`;
  }

  return nodesNames(stmt.nodes);
}

function compileConditionalNames(stmt: USELStatement): string {
  const { conditionNodes, bodyNodes } = splitConditional(stmt);
  const condStr = conditionNodes.length ? nodesNames(conditionNodes) : '[EMPTY]';
  const bodyStr = bodyNodes.length ? nodesNames(bodyNodes) : '[EMPTY]';
  return `?{${condStr}}→${bodyStr}`;
}

function nodesNames(nodes: USELNode[]): string {
  return nodes.map(n => nodeName(n)).join('→');
}

function nodeName(node: USELNode): string {
  const name = node.symbol.name;
  const base = `[${name}]`;

  if (node.children.length === 0) return base;

  const childStr = node.children.map(c => nodeName(c)).join('→');
  return `${base}{${childStr}}`;
}
