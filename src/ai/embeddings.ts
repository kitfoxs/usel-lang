/**
 * USEL AI Embedding System — DeepNSM Vector Space
 *
 * Maps each of the 65 NSM semantic primes to a fixed 64-dimensional vector
 * embedding, encoding the hypothesis that NSM primes correspond to stable
 * monosemantic directions in the latent space of any sufficiently trained LLM.
 *
 * Key references:
 * - Wierzbicka (1996) — NSM semantic primes as universal meaning atoms
 * - Anthropic (2024) — "Scaling Monosemanticity" (SAE feature extraction)
 * - OpenAI (2025) — Sparse autoencoder interpretability research
 *
 * Design principles for the embedding space:
 * 1. Same-category primes cluster together (small angular distance)
 * 2. Opposite concepts have negative cosine similarity (GOOD↔BAD, BIG↔SMALL)
 * 3. Related concepts have moderate positive similarity (THINK↔KNOW, SEE↔HEAR)
 * 4. Unrelated concepts are near-orthogonal (~0 cosine similarity)
 * 5. Embeddings are deterministic and reproducible (seeded generation)
 *
 * @module ai/embeddings
 */

import type { USELSymbol, PrimeCategory } from '../primes/types';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface SymbolEmbedding {
  symbolId: string;
  vector: number[];   // 64-dimensional embedding
  magnitude: number;
}

export interface NearestResult extends SymbolEmbedding {
  similarity: number;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const EMBEDDING_DIM = 64;

/**
 * Category → base angle (radians) in the embedding hyperspace.
 * Each category occupies a distinct angular region so primes within
 * the same category naturally cluster together.
 */
const CATEGORY_ANGLES: Record<string, number> = {
  substantive: 0.0,
  relational:  0.45,
  determiner:  0.9,
  quantifier:  1.35,
  evaluator:   1.8,
  descriptor:  2.6,   // wider gap from evaluator (GOOD≠BIG)
  mental:      3.2,
  speech:      3.7,
  action:      4.1,
  existence:   4.5,
  life:        4.9,
  time:        5.4,
  space:       5.9,
  logical:     6.5,
  intensifier: 7.1,
  similarity:  7.6,
};

/**
 * The 65 NSM semantic primes organized by category.
 * Each prime gets a deterministic embedding based on its category angle
 * plus a within-category offset derived from its position index.
 */
const NSM_PRIMES: Record<PrimeCategory, string[]> = {
  substantive: ['I', 'YOU', 'SOMEONE', 'SOMETHING', 'PEOPLE', 'BODY'],
  relational:  ['KIND', 'PART'],
  determiner:  ['THIS', 'THE_SAME', 'OTHER', 'ELSE'],
  quantifier:  ['ONE', 'TWO', 'SOME', 'ALL', 'MUCH', 'MANY'],
  evaluator:   ['GOOD', 'BAD'],
  descriptor:  ['BIG', 'SMALL'],
  mental:      ['THINK', 'KNOW', 'WANT', 'DONT_WANT', 'FEEL', 'SEE', 'HEAR'],
  speech:      ['SAY', 'WORDS', 'TRUE'],
  action:      ['DO', 'HAPPEN', 'MOVE'],
  existence:   ['EXIST', 'HAVE'],
  life:        ['LIVE', 'DIE'],
  time:        ['WHEN', 'NOW', 'BEFORE', 'AFTER', 'A_LONG_TIME', 'A_SHORT_TIME', 'FOR_SOME_TIME', 'MOMENT'],
  space:       ['WHERE', 'HERE', 'ABOVE', 'BELOW', 'FAR', 'NEAR', 'SIDE', 'INSIDE', 'TOUCH'],
  logical:     ['NOT', 'MAYBE', 'CAN', 'BECAUSE', 'IF'],
  intensifier: ['VERY', 'MORE'],
  similarity:  ['LIKE_AS'],
};

/**
 * Pairs of semantically opposite primes. These get embeddings
 * with negative cosine similarity (roughly anti-parallel vectors).
 *
 * IMPORTANT: Each prime must appear as the SECOND element at most once,
 * since that element gets overwritten during correction.
 */
const OPPOSITE_PAIRS: [string, string][] = [
  ['GOOD', 'BAD'],
  ['BIG', 'SMALL'],
  ['WANT', 'DONT_WANT'],
  ['LIVE', 'DIE'],
  ['BEFORE', 'AFTER'],
  ['ABOVE', 'BELOW'],
  ['FAR', 'NEAR'],
  ['A_LONG_TIME', 'A_SHORT_TIME'],
];

/**
 * Pairs of semantically related primes. These get embeddings
 * with moderate positive cosine similarity (~0.3–0.6).
 */
const RELATED_PAIRS: [string, string][] = [
  ['THINK', 'KNOW'],
  ['SEE', 'HEAR'],
  ['SAY', 'WORDS'],
  ['WANT', 'FEEL'],
  ['DO', 'HAPPEN'],
  ['I', 'YOU'],
  ['SOMEONE', 'PEOPLE'],
  ['SOME', 'MANY'],
  ['WHEN', 'NOW'],
  ['WHERE', 'HERE'],
  ['EXIST', 'LIVE'],
  ['MOVE', 'DO'],
  ['TRUE', 'KNOW'],
  ['SIDE', 'NEAR'],
  ['ONE', 'TWO'],
];

// ─── Seeded PRNG ─────────────────────────────────────────────────────────────

/**
 * Simple deterministic PRNG (mulberry32) for reproducible embeddings.
 * Given the same seed, always produces the same sequence.
 */
function mulberry32(seed: number): () => number {
  let s = seed | 0;
  return () => {
    s = (s + 0x6D2B79F5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Convert a string to a deterministic 32-bit hash for seeding. */
function hashString(s: string): number {
  let hash = 0;
  for (let i = 0; i < s.length; i++) {
    hash = ((hash << 5) - hash + s.charCodeAt(i)) | 0;
  }
  return hash;
}

// ─── Embedding Generation ────────────────────────────────────────────────────

/**
 * Generate a deterministic base vector for a category.
 * Uses a seeded PRNG per category to create well-separated
 * directions in the 64-dimensional hypersphere. Each category
 * gets a distinct random unit vector as its "home direction."
 */
function categoryBaseVector(category: string): number[] {
  const seed = hashString(`USEL_CATEGORY_${category}`) ^ 0xCAFEBABE;
  const rng = mulberry32(seed);
  const vec = new Array<number>(EMBEDDING_DIM);

  for (let i = 0; i < EMBEDDING_DIM; i++) {
    // Box-Muller for approximate Gaussian (better sphere coverage)
    const u1 = rng() || 0.0001; // avoid log(0)
    const u2 = rng();
    vec[i] = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  }

  // Normalize to unit vector
  const mag = Math.sqrt(vec.reduce((s, v) => s + v * v, 0));
  return vec.map(v => v / mag);
}

/**
 * Generate a per-prime offset vector that differentiates primes
 * within the same category. Uses the prime's name as seed.
 */
function primeOffsetVector(primeId: string, withinCategoryIndex: number, categorySize: number): number[] {
  const rng = mulberry32(hashString(primeId) ^ 0xDEADBEEF);
  const vec = new Array<number>(EMBEDDING_DIM);

  // For small categories (≤2 members), use a larger spread so that
  // semantic corrections have room to push opposites apart.
  const spread = categorySize <= 2
    ? 0.3 + (withinCategoryIndex / Math.max(categorySize, 1)) * 0.2
    : 0.15 + (withinCategoryIndex / Math.max(categorySize, 1)) * 0.1;

  for (let i = 0; i < EMBEDDING_DIM; i++) {
    vec[i] = (rng() - 0.5) * spread;
  }

  return vec;
}

/**
 * Apply semantic relationship corrections: push opposite pairs apart
 * and pull related pairs together by adjusting their vectors.
 *
 * For opposites, we construct B as the reflection of A through the
 * category centroid, preserving category membership while ensuring
 * negative cosine similarity.
 */
function applySemanticCorrections(embeddingMap: Map<string, number[]>): void {
  // Step 1: Pull related pairs closer FIRST (blend toward shared midpoint)
  for (const [a, b] of RELATED_PAIRS) {
    const vecA = embeddingMap.get(a);
    const vecB = embeddingMap.get(b);
    if (!vecA || !vecB) continue;

    for (let i = 0; i < EMBEDDING_DIM; i++) {
      const midpoint = (vecA[i] + vecB[i]) / 2;
      vecA[i] = vecA[i] * 0.65 + midpoint * 0.35;
      vecB[i] = vecB[i] * 0.65 + midpoint * 0.35;
    }
  }

  // Step 2: Push opposites apart AFTER (so this is the final word)
  // For each pair, B becomes the negation of A plus a small independent
  // random perturbation (NOT derived from B, which may be too similar to A).
  for (const [a, b] of OPPOSITE_PAIRS) {
    const vecA = embeddingMap.get(a);
    const vecB = embeddingMap.get(b);
    if (!vecA || !vecB) continue;

    // Generate independent perturbation from pair-specific seed
    const rng = mulberry32(hashString(`opposite_${a}_${b}`) ^ 0xBAADF00D);
    for (let i = 0; i < EMBEDDING_DIM; i++) {
      const noise = (rng() - 0.5) * 0.15;
      vecB[i] = -vecA[i] + noise;
    }
  }
}

/** Normalize a vector to unit length. */
function normalize(vec: number[]): number[] {
  const mag = Math.sqrt(vec.reduce((sum, v) => sum + v * v, 0));
  if (mag === 0) return vec;
  return vec.map(v => v / mag);
}

/** Compute vector magnitude. */
function magnitude(vec: number[]): number {
  return Math.sqrt(vec.reduce((sum, v) => sum + v * v, 0));
}

// ─── Pre-computed Embedding Table ────────────────────────────────────────────

/** Cache of all prime embeddings, built once on module load. */
const EMBEDDING_CACHE: Map<string, SymbolEmbedding> = new Map();

function buildEmbeddingCache(): void {
  if (EMBEDDING_CACHE.size > 0) return;

  const rawVectors = new Map<string, number[]>();

  // Step 1: Generate raw vectors from category base + prime offset
  for (const [category, primes] of Object.entries(NSM_PRIMES)) {
    const baseVec = categoryBaseVector(category);

    for (let idx = 0; idx < primes.length; idx++) {
      const primeId = primes[idx];
      const offset = primeOffsetVector(primeId, idx, primes.length);
      const combined = baseVec.map((v, i) => v + offset[i]);
      rawVectors.set(primeId, combined);
    }
  }

  // Step 2: Apply semantic relationship corrections
  applySemanticCorrections(rawVectors);

  // Step 3: Normalize and cache
  for (const [primeId, vec] of rawVectors) {
    const normalized = normalize(vec);
    EMBEDDING_CACHE.set(primeId, {
      symbolId: primeId,
      vector: normalized,
      magnitude: 1.0, // unit vectors after normalization
    });
  }
}

// Initialize on module load
buildEmbeddingCache();

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Generate a deterministic embedding for a USELSymbol.
 *
 * If the symbol is a known NSM prime, returns its pre-computed embedding.
 * Otherwise, generates a new embedding seeded from the symbol's properties.
 */
export function generateEmbedding(symbol: USELSymbol): SymbolEmbedding {
  // Check pre-computed cache first
  const cached = EMBEDDING_CACHE.get(symbol.id) ?? EMBEDDING_CACHE.get(symbol.name);
  if (cached) return cached;

  // For non-prime symbols, generate from category base + name hash
  const baseVec = categoryBaseVector(symbol.category);
  const offset = primeOffsetVector(symbol.id, 0, 1);
  const combined = baseVec.map((v, i) => v + offset[i]);
  const normalized = normalize(combined);

  return {
    symbolId: symbol.id,
    vector: normalized,
    magnitude: 1.0,
  };
}

/**
 * Cosine similarity between two symbol embeddings.
 * Returns a value in [-1, 1]:
 *   1  = identical direction
 *   0  = orthogonal (unrelated)
 *  -1  = opposite direction
 */
export function cosineSimilarity(a: SymbolEmbedding, b: SymbolEmbedding): number {
  if (a.vector.length !== b.vector.length) {
    throw new Error(
      `Dimension mismatch: ${a.symbolId} has ${a.vector.length}d, ` +
      `${b.symbolId} has ${b.vector.length}d`
    );
  }

  let dot = 0;
  let magA = 0;
  let magB = 0;

  for (let i = 0; i < a.vector.length; i++) {
    dot  += a.vector[i] * b.vector[i];
    magA += a.vector[i] * a.vector[i];
    magB += b.vector[i] * b.vector[i];
  }

  const denominator = Math.sqrt(magA) * Math.sqrt(magB);
  if (denominator === 0) return 0;

  return dot / denominator;
}

/**
 * Find the k nearest primes to an arbitrary embedding vector.
 * Uses cosine similarity as the distance metric.
 */
export function nearestPrimes(embedding: number[], k: number = 5): NearestResult[] {
  buildEmbeddingCache();

  const query: SymbolEmbedding = {
    symbolId: '__query__',
    vector: normalize(embedding),
    magnitude: 1.0,
  };

  const scored: NearestResult[] = [];

  for (const cached of EMBEDDING_CACHE.values()) {
    const sim = cosineSimilarity(query, cached);
    scored.push({ ...cached, similarity: sim });
  }

  scored.sort((a, b) => b.similarity - a.similarity);
  return scored.slice(0, k);
}

/**
 * Compose multiple prime embeddings into a single vector.
 *
 * Uses weighted vector addition followed by normalization.
 * This models the hypothesis that complex meanings are linear
 * combinations of prime meanings in the embedding space.
 *
 * Example: composeEmbeddings([FEEL, VERY, GOOD]) ≈ "love" vector
 */
export function composeEmbeddings(embeddings: SymbolEmbedding[]): SymbolEmbedding {
  if (embeddings.length === 0) {
    return {
      symbolId: '__empty__',
      vector: new Array(EMBEDDING_DIM).fill(0),
      magnitude: 0,
    };
  }

  // Sum all vectors
  const composed = new Array<number>(EMBEDDING_DIM).fill(0);
  for (const emb of embeddings) {
    for (let i = 0; i < EMBEDDING_DIM; i++) {
      composed[i] += emb.vector[i];
    }
  }

  const mag = magnitude(composed);
  const normalized = mag > 0 ? composed.map(v => v / mag) : composed;
  const ids = embeddings.map(e => e.symbolId).join('+');

  return {
    symbolId: `composed(${ids})`,
    vector: normalized,
    magnitude: mag / embeddings.length, // average contribution strength
  };
}

/**
 * Decompose an arbitrary embedding into its component primes.
 *
 * Uses greedy iterative projection: find the most-aligned prime,
 * subtract its contribution, repeat until residual is below threshold.
 *
 * @param embedding - The vector to decompose
 * @param threshold - Minimum cosine similarity to include a prime (0–1)
 * @returns Array of USELSymbol IDs that compose this embedding
 */
export function decomposeEmbedding(embedding: number[], threshold: number = 0.2): string[] {
  buildEmbeddingCache();

  const residual = [...normalize(embedding)];
  const components: string[] = [];
  const used = new Set<string>();
  const maxIter = 10; // prevent infinite loops

  for (let iter = 0; iter < maxIter; iter++) {
    const resMag = magnitude(residual);
    if (resMag < threshold) break;

    // Find the prime most aligned with the residual
    const query: SymbolEmbedding = {
      symbolId: '__residual__',
      vector: normalize(residual),
      magnitude: resMag,
    };

    let bestSim = -Infinity;
    let bestPrime: SymbolEmbedding | null = null;

    for (const cached of EMBEDDING_CACHE.values()) {
      if (used.has(cached.symbolId)) continue;
      const sim = cosineSimilarity(query, cached);
      if (sim > bestSim) {
        bestSim = sim;
        bestPrime = cached;
      }
    }

    if (!bestPrime || bestSim < threshold) break;

    components.push(bestPrime.symbolId);
    used.add(bestPrime.symbolId);

    // Subtract the prime's projection from the residual
    const projScale = bestSim * resMag;
    for (let i = 0; i < EMBEDDING_DIM; i++) {
      residual[i] -= bestPrime.vector[i] * projScale;
    }
  }

  return components;
}

// ─── Utility Exports ─────────────────────────────────────────────────────────

/** Get a pre-computed embedding by prime ID. */
export function getEmbedding(primeId: string): SymbolEmbedding | undefined {
  buildEmbeddingCache();
  return EMBEDDING_CACHE.get(primeId);
}

/** Get all pre-computed prime embeddings. */
export function getAllEmbeddings(): SymbolEmbedding[] {
  buildEmbeddingCache();
  return Array.from(EMBEDDING_CACHE.values());
}

/** Get the embedding dimension (currently 64). */
export function getEmbeddingDimension(): number {
  return EMBEDDING_DIM;
}

/** List all NSM prime IDs in the embedding space. */
export function listPrimeIds(): string[] {
  return Object.values(NSM_PRIMES).flat();
}
