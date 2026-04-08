/**
 * USEL Compiler Utilities
 *
 * Shared analysis functions used by all compilation targets.
 * Classifies nodes by syntactic role and extracts sentence structure
 * (subject–predicate–object) from flat node sequences.
 */

import type { USELNode, USELStatement, PrimeCategory, ComputeCategory } from '../primes/types.js';

// ---------------------------------------------------------------------------
// Node-role classification
// ---------------------------------------------------------------------------

/** High-level syntactic role derived from a symbol's category. */
export type NodeRole =
  | 'subject'
  | 'predicate'
  | 'object'
  | 'modifier'
  | 'logical'
  | 'compute'
  | 'temporal'
  | 'spatial';

/** Categories that typically fill a predicate slot. */
const PREDICATE_CATEGORIES: Set<string> = new Set([
  'relational', 'mental', 'speech', 'action', 'existence', 'life',
]);

/** Categories that modify an adjacent noun or verb. */
const MODIFIER_CATEGORIES: Set<string> = new Set([
  'evaluator', 'descriptor', 'intensifier', 'similarity',
  'determiner', 'quantifier',
]);

/** Categories that represent computational operations. */
const COMPUTE_CATEGORIES: Set<string> = new Set([
  'math', 'data', 'control', 'type', 'function', 'io', 'compare',
]);

/**
 * Determine the syntactic role of a single node based on its symbol's
 * category and its connection-slot metadata.
 */
export function classifyNode(node: USELNode): NodeRole {
  const cat = node.symbol.category;

  if (cat === 'logical')   return 'logical';
  if (cat === 'time')      return 'temporal';
  if (cat === 'space')     return 'spatial';
  if (COMPUTE_CATEGORIES.has(cat))  return 'compute';
  if (MODIFIER_CATEGORIES.has(cat)) return 'modifier';
  if (PREDICATE_CATEGORIES.has(cat)) return 'predicate';

  // Substantive — first occurrence is subject, later ones are objects.
  // Caller decides based on position; we just return 'subject' here.
  if (cat === 'substantive') return 'subject';

  // Fallback: treat unknowns as modifiers so they don't break output.
  return 'modifier';
}

// ---------------------------------------------------------------------------
// Statement analysis
// ---------------------------------------------------------------------------

/** Result of structurally analysing a USELStatement. */
export interface AnalysedStatement {
  subject: USELNode | null;
  predicates: USELNode[];
  objects: USELNode[];
  modifiers: USELNode[];
  logicals: USELNode[];
  computes: USELNode[];
  temporals: USELNode[];
  spatials: USELNode[];
  /** Map from node id → modifier nodes that attach to it. */
  modifierMap: Map<string, USELNode[]>;
}

/**
 * Walk a statement's node list and classify every node, splitting them
 * into subject / predicate / object / modifier / etc. buckets.
 *
 * Heuristic:
 * – The *first* substantive node is the subject.
 * – Any substantive after the first predicate is an object.
 * – Modifiers attach to the nearest substantive that precedes or follows them.
 */
export function analyseStatement(stmt: USELStatement): AnalysedStatement {
  const result: AnalysedStatement = {
    subject: null,
    predicates: [],
    objects: [],
    modifiers: [],
    logicals: [],
    computes: [],
    temporals: [],
    spatials: [],
    modifierMap: new Map(),
  };

  let foundPredicate = false;
  let lastSubstantive: USELNode | null = null;

  for (const node of stmt.nodes) {
    const role = classifyNode(node);

    switch (role) {
      case 'subject':
        if (!result.subject && !foundPredicate) {
          result.subject = node;
          lastSubstantive = node;
        } else {
          result.objects.push(node);
          lastSubstantive = node;
        }
        break;

      case 'predicate':
        foundPredicate = true;
        result.predicates.push(node);
        break;

      case 'modifier': {
        result.modifiers.push(node);
        // Attach to closest substantive (look-back).
        const anchor = lastSubstantive ?? result.subject;
        if (anchor) {
          const list = result.modifierMap.get(anchor.id) ?? [];
          list.push(node);
          result.modifierMap.set(anchor.id, list);
        }
        break;
      }

      case 'logical':   result.logicals.push(node);  break;
      case 'compute':   result.computes.push(node);  break;
      case 'temporal':   result.temporals.push(node); break;
      case 'spatial':    result.spatials.push(node);  break;
    }
  }

  // Second pass: attach orphan modifiers that appeared *before* their noun.
  // (e.g. [BIG, SOMETHING]) — reassign forward.
  let nextSubstantive: USELNode | null = null;
  for (let i = stmt.nodes.length - 1; i >= 0; i--) {
    const node = stmt.nodes[i];
    const role = classifyNode(node);
    if (role === 'subject' || result.objects.includes(node)) {
      nextSubstantive = node;
    } else if (role === 'modifier' && nextSubstantive) {
      const existing = result.modifierMap.get(nextSubstantive.id) ?? [];
      if (!existing.includes(node)) {
        existing.push(node);
        result.modifierMap.set(nextSubstantive.id, existing);
      }
    }
  }

  return result;
}

// ---------------------------------------------------------------------------
// Name helpers
// ---------------------------------------------------------------------------

/** Convert a USEL symbol name to a JS-friendly camelCase identifier. */
export function toCamelCase(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+(.)/g, (_, ch) => (ch as string).toUpperCase());
}

/** Convert a USEL symbol name to a Python-friendly snake_case identifier. */
export function toSnakeCase(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
}

/**
 * Look up a pronunciation string for the given language code.
 * Falls back to English → symbol name → "?".
 */
export function getPronunciation(node: USELNode, lang: string): string {
  const p = node.symbol.pronunciation;
  return p[lang] ?? p['en'] ?? node.symbol.name.toLowerCase() ?? '?';
}

/** Return the glyph for a node, falling back to the symbol name. */
export function getGlyph(node: USELNode): string {
  return node.symbol.glyph || node.symbol.name;
}

/**
 * Detect whether a statement is conditional by checking for an explicit
 * `condition` field or for a leading logical node whose name contains "IF".
 */
export function isConditional(stmt: USELStatement): boolean {
  if (stmt.condition) return true;
  const first = stmt.nodes[0];
  return first != null
    && classifyNode(first) === 'logical'
    && first.symbol.name.toUpperCase().includes('IF');
}

/**
 * Split a conditional statement at the IF boundary.
 * Returns { conditionNodes, bodyNodes } where conditionNodes are between
 * IF and the first action-like predicate, and bodyNodes are the rest.
 */
export function splitConditional(stmt: USELStatement): {
  conditionNodes: USELNode[];
  bodyNodes: USELNode[];
} {
  const nodes = stmt.nodes;
  let splitIdx = -1;

  // Find first action/speech/existence node after a logical IF-like node
  let passedIf = false;
  for (let i = 0; i < nodes.length; i++) {
    const role = classifyNode(nodes[i]);
    if (role === 'logical' && nodes[i].symbol.name.toUpperCase().includes('IF')) {
      passedIf = true;
      continue;
    }
    if (passedIf && role === 'predicate') {
      // Check if this looks like the "then" action (e.g. DO)
      const name = nodes[i].symbol.name.toUpperCase();
      if (name === 'DO' || name === 'MAKE' || name === 'MOVE' || name === 'SAY') {
        splitIdx = i;
        break;
      }
    }
  }

  // If we found a split point, separate condition from body.
  if (splitIdx > 0) {
    return {
      conditionNodes: nodes.slice(1, splitIdx),   // skip the IF itself
      bodyNodes: nodes.slice(splitIdx),
    };
  }

  // No clear split — treat everything after IF as body.
  return {
    conditionNodes: nodes.slice(1),
    bodyNodes: [],
  };
}
