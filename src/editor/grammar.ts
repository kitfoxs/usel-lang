/**
 * USEL Grammar Rules Engine
 *
 * Defines which ConnectionSlots can connect, which prime categories
 * fit which slots, and provides validation for symbol composition.
 */

import type {
  ConnectionSlot,
  PrimeCategory,
  ComputeCategory,
  USELSymbol,
  GrammarRule,
} from '../primes/types';

// ---------------------------------------------------------------------------
// Slot → Slot connection rules
// ---------------------------------------------------------------------------

export const GRAMMAR_RULES: GrammarRule[] = [
  { from: 'subject',   to: ['predicate'],                          description: 'A subject flows into a predicate (verb / relation)' },
  { from: 'predicate', to: ['object', 'modifier', 'value'],        description: 'A predicate takes an object, modifier, or value' },
  { from: 'object',    to: ['modifier', 'condition'],              description: 'An object can be modified or conditioned' },
  { from: 'modifier',  to: ['modifier', 'value'],                  description: 'Modifiers can chain or take a value' },
  { from: 'condition', to: ['subject', 'predicate', 'value'],      description: 'A condition opens a new clause' },
  { from: 'value',     to: ['operator', 'modifier'],               description: 'A value can be operated on or modified' },
  { from: 'operator',  to: ['value', 'subject', 'object'],         description: 'An operator consumes another value / noun' },
];

/** Look-up map built from GRAMMAR_RULES for O(1) access. */
export const SLOT_CONNECTIONS: Record<ConnectionSlot, ConnectionSlot[]> =
  GRAMMAR_RULES.reduce((map, rule) => {
    map[rule.from] = rule.to;
    return map;
  }, {} as Record<ConnectionSlot, ConnectionSlot[]>);

// ---------------------------------------------------------------------------
// Category → Slot affinity
// ---------------------------------------------------------------------------

type AnyCategory = PrimeCategory | ComputeCategory;

/** Which prime categories naturally provide / accept which slots. */
export const CATEGORY_SLOT_MAP: Record<string, { provides: ConnectionSlot[]; accepts: ConnectionSlot[] }> = {
  // --- Primes (semantic tier 0) ---
  substantive:  { provides: ['subject', 'object'],        accepts: ['modifier', 'condition'] },
  relational:   { provides: ['predicate'],                accepts: ['subject', 'object', 'modifier'] },
  determiner:   { provides: ['modifier'],                 accepts: ['subject', 'object'] },
  quantifier:   { provides: ['modifier', 'value'],        accepts: ['subject', 'object'] },
  evaluator:    { provides: ['modifier', 'predicate'],    accepts: ['subject', 'object'] },
  descriptor:   { provides: ['modifier'],                 accepts: ['subject', 'object'] },
  mental:       { provides: ['predicate'],                accepts: ['subject', 'object'] },
  speech:       { provides: ['predicate'],                accepts: ['subject', 'object', 'value'] },
  action:       { provides: ['predicate'],                accepts: ['subject', 'object'] },
  existence:    { provides: ['predicate', 'subject'],     accepts: ['subject', 'modifier'] },
  life:         { provides: ['predicate', 'subject'],     accepts: ['modifier'] },
  time:         { provides: ['modifier', 'condition'],    accepts: ['value'] },
  space:        { provides: ['modifier'],                 accepts: ['value', 'subject'] },
  logical:      { provides: ['operator', 'condition'],    accepts: ['value', 'condition'] },
  intensifier:  { provides: ['modifier'],                 accepts: ['modifier', 'value'] },
  similarity:   { provides: ['operator', 'modifier'],     accepts: ['value', 'object'] },

  // --- Compute tier 1 ---
  math:         { provides: ['operator', 'value'],        accepts: ['value'] },
  data:         { provides: ['value', 'subject'],         accepts: ['operator', 'modifier'] },
  control:      { provides: ['condition', 'operator'],    accepts: ['condition', 'value'] },
  type:         { provides: ['modifier', 'value'],        accepts: ['subject', 'object'] },
  function:     { provides: ['predicate', 'operator'],    accepts: ['value', 'subject'] },
  io:           { provides: ['predicate'],                accepts: ['value', 'object'] },
  compare:      { provides: ['operator', 'condition'],    accepts: ['value'] },

  // --- Molecule tier 2 ---
  universal:    { provides: ['subject', 'predicate'],     accepts: ['modifier', 'object'] },
  computing:    { provides: ['predicate', 'value'],       accepts: ['subject', 'object'] },
  science:      { provides: ['subject', 'value'],         accepts: ['modifier', 'predicate'] },
  social:       { provides: ['subject', 'predicate'],     accepts: ['object', 'modifier'] },
  custom:       { provides: ['subject', 'predicate'],     accepts: ['object', 'modifier'] },
};

// ---------------------------------------------------------------------------
// Connection validity checks
// ---------------------------------------------------------------------------

/**
 * Can `from` connect to `to` given slot compatibility?
 *
 * A connection is valid when at least one *provides* slot of `from`
 * has a grammar rule that leads to at least one *accepts* slot of `to`.
 */
export function canConnect(from: USELSymbol, to: USELSymbol): boolean {
  for (const provSlot of from.provides) {
    const allowed = SLOT_CONNECTIONS[provSlot];
    if (!allowed) continue;
    for (const accSlot of to.accepts) {
      if (allowed.includes(accSlot)) return true;
    }
  }
  return false;
}

/**
 * Returns all valid slots for a connection between two symbols,
 * or an empty array if no connection is possible.
 */
export function validSlotPairs(
  from: USELSymbol,
  to: USELSymbol,
): Array<{ fromSlot: ConnectionSlot; toSlot: ConnectionSlot }> {
  const pairs: Array<{ fromSlot: ConnectionSlot; toSlot: ConnectionSlot }> = [];
  for (const provSlot of from.provides) {
    const allowed = SLOT_CONNECTIONS[provSlot];
    if (!allowed) continue;
    for (const accSlot of to.accepts) {
      if (allowed.includes(accSlot)) {
        pairs.push({ fromSlot: provSlot, toSlot: accSlot });
      }
    }
  }
  return pairs;
}

/**
 * Validates an ordered sequence of symbols for chain-validity.
 * Every adjacent pair must have at least one valid slot connection.
 */
export function validateChain(symbols: USELSymbol[]): {
  valid: boolean;
  errors: Array<{ index: number; message: string }>;
} {
  const errors: Array<{ index: number; message: string }> = [];
  for (let i = 0; i < symbols.length - 1; i++) {
    if (!canConnect(symbols[i], symbols[i + 1])) {
      errors.push({
        index: i,
        message: `"${symbols[i].name}" (${symbols[i].provides.join('/')}) cannot connect to "${symbols[i + 1].name}" (accepts ${symbols[i + 1].accepts.join('/')})`,
      });
    }
  }
  return { valid: errors.length === 0, errors };
}
