/**
 * USEL ↔ Natural Language Autoencoder (NLA) Bridge
 *
 * Bidirectional conversion between the natural-language explanations
 * produced by Anthropic's Natural Language Autoencoders (Fraser-Taliente
 * et al., 2026) and USEL chess notation.
 *
 * Pipeline:
 *
 *   NLA explanation text (e.g., "I want to see something big")
 *        │
 *        │  nlaToUsel()  — keyword mapping → NSM primes → chess coords
 *        ▼
 *   USELEncoding { tokens: ["Ka8", "Bg6", "Ba5", ...], glyphs: "◉ ♥ ✦ ..." }
 *        │
 *        │  uselToDescription()
 *        ▼
 *   Natural-language gloss
 *
 * The forward direction (NLA → USEL) is intentionally LOSSY: NLA
 * explanations frequently contain proper nouns, exact quotations and
 * numeric specifics that the 65-prime NSM vocabulary cannot represent
 * directly. `detectSpecifics()` surfaces those losses as confabulation
 * candidates so downstream consumers can either drop them or hoist them
 * into typed-variable extensions.
 *
 * @module ai/nla-bridge
 */

import { TIER0_PRIMES } from '../primes/tier0-core.js';
import type { USELSymbol } from '../primes/types.js';
import { naturalToUSEL, uselToNatural } from './translate.js';

// ─── Public types ────────────────────────────────────────────────────────────

/** Input to the bridge: a single NLA explanation snippet. */
export interface NLAExplanation {
  /** Raw text from inside <explanation>...</explanation> tags. */
  rawText: string;
  /** Optional metadata: model that produced it, layer index, etc. */
  source?: {
    model?: string;
    layer?: number;
    fve?: number;
    mse?: number;
  };
}

/** Result of encoding an NLA explanation as USEL chess notation. */
export interface USELEncoding {
  /** USEL chess notation tokens (e.g., ["Ka8", "Bh6", "Pa6"]). */
  tokens: string[];
  /** Concatenated USEL text with operators (e.g., "Ka8.Bh6.Pa6"). */
  text: string;
  /** USEL prime IDs (e.g., ["PRIME_I", "PRIME_FEEL", "PRIME_GOOD"]). */
  primeIds: string[];
  /** Glyph rendering (e.g., "◉ ♥ ✦"). */
  glyphs: string;
  /** Confidence: how much of the source explanation we successfully mapped. 0–1. */
  coverage: number;
}

/**
 * One token's worth of NLA inference output, mirroring the per-line
 * structure of `nla/examples/qwen7b_layer20_step4200.txt`.
 */
export interface PerTokenNLAOutput {
  tokenIndex: number;
  tokenText: string;
  vectorMagnitude: number;
  mseNorm?: number;
  cos?: number;
  fveNorm?: number;
  explanation: string;
}

/** Per-token NLA output augmented with its USEL re-encoding. */
export interface PerTokenUSELOutput extends PerTokenNLAOutput {
  uselEncoding: USELEncoding;
}

// ─── Coordinate / piece tables (USEL v2 §3.1) ────────────────────────────────

/**
 * Canonical mapping from NSM prime (short name) → USEL v2 8×8 chess
 * coordinate. Sourced from `v2/USEL_V2_PAPER.md` §3.1.
 */
const PRIME_TO_COORD: Record<string, string> = {
  // Row 8 (Entities)
  I: 'a8', YOU: 'b8', SOMEONE: 'c8', SOMETHING: 'd8',
  PEOPLE: 'e8', BODY: 'f8', KIND: 'g8', PART: 'h8',
  // Row 7 (Determiners & Quantity)
  THIS: 'a7', THE_SAME: 'b7', OTHER: 'c7', ONE: 'd7',
  TWO: 'e7', SOME: 'f7', ALL: 'g7', MUCH: 'h7',
  // Row 6 (Mind & Value)
  GOOD: 'a6', BAD: 'b6', BIG: 'c6', SMALL: 'd6',
  THINK: 'e6', KNOW: 'f6', WANT: 'g6', FEEL: 'h6',
  // Row 5 (Perception & Action)
  SEE: 'a5', HEAR: 'b5', SAY: 'c5', WORDS: 'd5',
  TRUE: 'e5', DO: 'f5', HAPPEN: 'g5', MOVE: 'h5',
  // Row 4 (Existence & Life)
  TOUCH: 'a4', BE_ID: 'b4', THERE_IS: 'c4', HAVE: 'd4',
  BE_LOC: 'e4', LIVE: 'f4', DIE: 'g4', DONT_WANT: 'h4',
  // Row 3 (Time)
  WHEN: 'a3', NOW: 'b3', BEFORE: 'c3', AFTER: 'd3',
  A_LONG_TIME: 'e3', A_SHORT_TIME: 'f3', FOR_SOME_TIME: 'g3', MOMENT: 'h3',
  // Row 2 (Space)
  WHERE: 'a2', HERE: 'b2', ABOVE: 'c2', BELOW: 'd2',
  FAR: 'e2', NEAR: 'f2', SIDE: 'g2', INSIDE: 'h2',
  // Row 1 (Logic & Degree)
  NOT: 'a1', MAYBE: 'b1', CAN: 'c1', BECAUSE: 'd1',
  IF: 'e1', VERY: 'f1', MORE: 'g1', LIKE_AS: 'h1',
  // Off-board meta
  WAY: 'M0',
};

/**
 * Aliases from prime IDs / surface forms used elsewhere in the codebase
 * (e.g., the keyword mapper's short labels) to the canonical short names
 * used by `PRIME_TO_COORD`. Allows `naturalToUSEL()` output to flow into
 * the bridge unchanged.
 */
const PRIME_ALIASES: Record<string, string> = {
  EXIST: 'BE_ID',
  MANY: 'MUCH',
  PRIME_MUCH_MANY: 'MUCH',
  PRIME_LIKE_WAY: 'LIKE_AS',
  PRIME_WHEN_TIME: 'WHEN',
  PRIME_WHERE_PLACE: 'WHERE',
  PRIME_BE: 'BE_ID',
};

/**
 * Categories used to pick the chess-piece prefix for a coordinate.
 * Defaults to P (pawn) when no specific assignment is given.
 */
const PIECE_FOR_PRIME: Record<string, 'K' | 'Q' | 'R' | 'B' | 'N' | 'P'> = {
  // K — identity
  I: 'K', YOU: 'K',
  // Q — major action / speech
  DO: 'Q', HAPPEN: 'Q', MOVE: 'Q', SAY: 'Q',
  // R — state / existence
  SOMEONE: 'R', SOMETHING: 'R', PEOPLE: 'R', BODY: 'R',
  BE_ID: 'R', BE_LOC: 'R', THERE_IS: 'R',
  // B — mental / cognitive
  THINK: 'B', KNOW: 'B', WANT: 'B', FEEL: 'B',
  SEE: 'B', HEAR: 'B', BECAUSE: 'B', MAYBE: 'B',
  // N — relational
  KIND: 'N', PART: 'N', OTHER: 'N', LIKE_AS: 'N', IF: 'N',
};

// ─── Internal lookups (built once from CORE_PRIMES) ──────────────────────────

/** Map: short prime name (e.g., "I", "WANT") → full PRIME_* id. */
const SHORT_TO_PRIME_ID = new Map<string, string>();
/** Map: full PRIME_* id → USELSymbol (for glyph / metadata). */
const PRIME_ID_TO_SYMBOL = new Map<string, USELSymbol>();

(function buildPrimeLookups(): void {
  for (const symbol of TIER0_PRIMES) {
    PRIME_ID_TO_SYMBOL.set(symbol.id, symbol);
    // Tier0 names like "A LONG TIME", "MUCH/MANY" → normalise to underscore.
    const short = symbol.name.toUpperCase().replace(/[\s/]+/g, '_').replace(/'/g, '');
    SHORT_TO_PRIME_ID.set(short, symbol.id);
    // Also accept the literal short used by the keyword mapper.
    const stripped = symbol.id.replace(/^PRIME_/, '');
    SHORT_TO_PRIME_ID.set(stripped, symbol.id);
  }
  // Manual fixups for compound names whose canonical short label collapses
  // to a single token in the coordinate table.
  SHORT_TO_PRIME_ID.set('MUCH', 'PRIME_MUCH_MANY');
  SHORT_TO_PRIME_ID.set('MANY', 'PRIME_MUCH_MANY');
  SHORT_TO_PRIME_ID.set('WHEN', 'PRIME_WHEN_TIME');
  SHORT_TO_PRIME_ID.set('WHERE', 'PRIME_WHERE_PLACE');
  SHORT_TO_PRIME_ID.set('LIKE_AS', 'PRIME_LIKE_WAY');
  SHORT_TO_PRIME_ID.set('BE_ID', 'PRIME_BE');
  SHORT_TO_PRIME_ID.set('BE_LOC', 'PRIME_BE');
  SHORT_TO_PRIME_ID.set('EXIST', 'PRIME_BE');
})();

/** Normalise any prime label to the short key used by `PRIME_TO_COORD`. */
function canonicalShort(label: string): string | undefined {
  const upper = label.toUpperCase();
  if (PRIME_ALIASES[upper]) return PRIME_ALIASES[upper];
  if (upper in PRIME_TO_COORD) return upper;
  // Strip a PRIME_ prefix if present.
  const stripped = upper.replace(/^PRIME_/, '');
  if (PRIME_ALIASES[stripped]) return PRIME_ALIASES[stripped];
  if (stripped in PRIME_TO_COORD) return stripped;
  return undefined;
}

/** Return the chess token (e.g., "Ka8") for a prime short name. */
function chessTokenFor(short: string): string | undefined {
  const coord = PRIME_TO_COORD[short];
  if (!coord) return undefined;
  const piece = PIECE_FOR_PRIME[short] ?? 'P';
  return `${piece}${coord}`;
}

// ─── Coverage helpers ────────────────────────────────────────────────────────

const STOP_WORDS = new Set([
  'the', 'a', 'an', 'to', 'of', 'and', 'but', 'or', 'for', 'with', 'at',
  'from', 'by', 'on', 'about', 'just', 'been', 'is', 'are', 'was', 'were',
  'am', 'be', 'being', 'as', 'that', 'which', 'who', 'whom', 'whose',
  'this', 'these', 'those', 'it', 'its', "it's", 'in', 'into', 'out',
  'up', 'down', 'over', 'under', 'has', 'have', 'had', 'do', 'does',
  'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must',
  'can', 'shall', 's', 't', 'll', 've', 're', 'd', 'm',
]);

/** Lower-case word tokens, dropping punctuation but keeping apostrophes. */
function contentWords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s']/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 0 && !STOP_WORDS.has(w));
}

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Convert an NLA natural-language explanation to USEL chess notation
 * via keyword mapping.
 *
 * This is the LOSSY direction — many NLA explanations mention specifics
 * (proper nouns, exact words from context) that USEL cannot represent
 * without typed-variable extensions. The function returns the best-effort
 * USEL encoding and a coverage score indicating how much of the source
 * explanation was successfully mapped.
 *
 * @param explanation - NLA explanation snippet.
 * @returns USEL encoding with tokens, primeIds, glyphs and coverage.
 */
export function nlaToUsel(explanation: NLAExplanation): USELEncoding {
  const text = explanation.rawText.trim();
  if (text.length === 0) {
    return { tokens: [], text: '', primeIds: [], glyphs: '', coverage: 0 };
  }

  const rawPrimes = naturalToUSEL(text, 'en');
  const tokens: string[] = [];
  const primeIds: string[] = [];
  const glyphParts: string[] = [];

  for (const label of rawPrimes) {
    const short = canonicalShort(label);
    if (!short) continue;
    const chess = chessTokenFor(short);
    if (!chess) continue;
    const primeId = SHORT_TO_PRIME_ID.get(short);
    if (!primeId) continue;

    tokens.push(chess);
    primeIds.push(primeId);
    const sym = PRIME_ID_TO_SYMBOL.get(primeId);
    if (sym) glyphParts.push(sym.glyph);
  }

  const denominator = Math.max(1, contentWords(text).length);
  const coverage = Math.min(1, tokens.length / denominator);

  return {
    tokens,
    text: tokens.join('.'),
    primeIds,
    glyphs: glyphParts.join(' '),
    coverage,
  };
}

/**
 * Convert a USEL token sequence back to a natural-language description.
 *
 * This is the LOSSLESS direction (within USEL's expressive coverage):
 * each prime ID has a deterministic English gloss in
 * `src/ai/translate.ts`, so round-tripping `nlaToUsel → uselToDescription`
 * yields a normalised paraphrase of the input.
 *
 * @param encoding - USEL encoding produced by {@link nlaToUsel} (or built
 *   manually from prime IDs).
 * @returns English sentence describing the encoded primes.
 */
export function uselToDescription(encoding: USELEncoding): string {
  if (encoding.primeIds.length === 0) return '';
  return uselToNatural(encoding.primeIds, 'en');
}

/**
 * Re-encode a complete NLA inference output (per-token explanations from
 * a paragraph of text) into per-token USEL encodings.
 *
 * Mirrors the structure of `nla/examples/qwen7b_layer20_step4200.txt`:
 * one entry per source token, each carrying its own short
 * natural-language explanation that becomes a stand-alone USEL chord.
 *
 * @param tokens - Per-token NLA outputs.
 * @returns Same array, augmented with `uselEncoding` for each token.
 */
export function reEncodeTranscript(
  tokens: PerTokenNLAOutput[],
): PerTokenUSELOutput[] {
  return tokens.map((t) => ({
    ...t,
    uselEncoding: nlaToUsel({ rawText: t.explanation }),
  }));
}

/**
 * Simple confabulation surface detector: count specific factual claims
 * in an NLA explanation (proper nouns, quoted strings, numeric specifics).
 *
 * USEL encoding cannot represent these directly, so they're either dropped
 * (becoming `[SOMEONE]`, `[SOMETHING]`) or smuggled into typed variables
 * by downstream pipelines. The returned `examples` list is the set of
 * candidate values that would need typed-variable representation.
 *
 * Heuristics:
 *   - Capitalised tokens that are not at sentence start.
 *   - Capitalised tokens at sentence start IF they don't appear in a small
 *     stop-list of common openers ("The", "A", "An", "I", "It", ...).
 *   - Anything inside double or single quotes.
 *   - Numeric literals (integers, decimals, years).
 *
 * @param explanationText - Raw explanation text.
 * @returns Count of detected specifics and example list (deduplicated).
 */
export function detectSpecifics(explanationText: string): {
  count: number;
  examples: string[];
} {
  const examples = new Set<string>();
  const text = explanationText;

  // Quoted strings (either " or ' delimited).
  const quoteRe = /"([^"]+)"|'([^']+)'/g;
  let m: RegExpExecArray | null;
  while ((m = quoteRe.exec(text)) !== null) {
    const captured = m[1] ?? m[2];
    if (captured && captured.trim().length > 0) examples.add(captured.trim());
  }

  // Numeric specifics (years, decimals, integers ≥ 2 digits).
  const numRe = /\b\d+(?:\.\d+)?\b/g;
  while ((m = numRe.exec(text)) !== null) {
    examples.add(m[0]);
  }

  // Proper nouns: capitalised words not at sentence start, OR sentence-
  // initial caps that aren't function-word openers.
  const opener = new Set([
    'The', 'A', 'An', 'I', 'It', 'This', 'That', 'These', 'Those',
    'There', 'Here', 'Hello', 'Hi', 'Hey', 'Mid', 'And', 'But', 'Or',
    'When', 'While', 'If', 'Because', 'So', 'Then', 'Now', 'Today',
  ]);
  // Walk sentences manually so we know whether each word is sentence-initial.
  const sentences = text.split(/(?<=[.!?])\s+/);
  for (const sent of sentences) {
    const words = sent.split(/\s+/);
    for (let i = 0; i < words.length; i++) {
      const raw = words[i].replace(/[^\w'-]/g, '');
      if (raw.length < 2) continue;
      if (!/^[A-Z]/.test(raw)) continue;
      if (i === 0 && opener.has(raw)) continue;
      // Skip ALL-CAPS acronyms? Keep them — they're specifics too.
      examples.add(raw);
    }
  }

  const list = Array.from(examples);
  return { count: list.length, examples: list };
}
