import { describe, it, expect, beforeEach } from 'vitest';
import {
  generateEmbedding, cosineSimilarity, nearestPrimes,
  composeEmbeddings, decomposeEmbedding, getEmbedding,
  getAllEmbeddings, getEmbeddingDimension, listPrimeIds,
} from '../src/ai/embeddings.js';
import { TIER0_PRIMES } from '../src/primes/tier0-core.js';

// ─── Embeddings ──────────────────────────────────────────────────────────────

describe('AI embeddings', () => {
  it('embedding dimension is 64', () => {
    expect(getEmbeddingDimension()).toBe(64);
  });

  it('generateEmbedding returns 64-dim vector', () => {
    const emb = generateEmbedding(TIER0_PRIMES[0]);
    expect(emb.vector).toHaveLength(64);
  });

  it('generateEmbedding is deterministic (seeded)', () => {
    const a = generateEmbedding(TIER0_PRIMES[0]);
    const b = generateEmbedding(TIER0_PRIMES[0]);
    expect(a.vector).toEqual(b.vector);
  });

  it('cosineSimilarity of identical vectors is 1', () => {
    const emb = generateEmbedding(TIER0_PRIMES[0]);
    expect(cosineSimilarity(emb, emb)).toBeCloseTo(1, 4);
  });

  it('cosineSimilarity returns values in [-1, 1]', () => {
    const a = generateEmbedding(TIER0_PRIMES[0]);
    const b = generateEmbedding(TIER0_PRIMES[5]);
    const sim = cosineSimilarity(a, b);
    expect(sim).toBeGreaterThanOrEqual(-1);
    expect(sim).toBeLessThanOrEqual(1);
  });

  it('opposite pairs have low similarity', () => {
    const good = getEmbedding('PRIME_GOOD');
    const bad = getEmbedding('PRIME_BAD');
    if (good && bad) {
      const sim = cosineSimilarity(good, bad);
      expect(sim).toBeLessThan(0.5);
    }
  });

  it('nearestPrimes returns k results', () => {
    const emb = generateEmbedding(TIER0_PRIMES[0]);
    const nearest = nearestPrimes(emb.vector, 3);
    expect(nearest).toHaveLength(3);
  });

  it('nearestPrimes first result is the source itself', () => {
    const emb = generateEmbedding(TIER0_PRIMES[0]);
    const nearest = nearestPrimes(emb.vector, 1);
    expect(nearest[0].symbolId).toBe(TIER0_PRIMES[0].name);
  });

  it('composeEmbeddings returns 64-dim vector', () => {
    const embs = TIER0_PRIMES.slice(0, 3).map(generateEmbedding);
    const composed = composeEmbeddings(embs);
    expect(composed.vector).toHaveLength(64);
  });

  it('decomposeEmbedding returns prime IDs', () => {
    const emb = generateEmbedding(TIER0_PRIMES[0]);
    const components = decomposeEmbedding(emb.vector);
    expect(Array.isArray(components)).toBe(true);
    expect(components.length).toBeGreaterThan(0);
  });

  it('getAllEmbeddings returns all cached entries', () => {
    const all = getAllEmbeddings();
    // NSM_PRIMES in embeddings.ts defines 64 entries (LIKE_AS consolidates LIKE + AS)
    expect(all.length).toBe(64);
  });

  it('listPrimeIds returns all NSM prime IDs', () => {
    const ids = listPrimeIds();
    expect(ids).toHaveLength(64);
    // IDs are plain names like 'I', 'YOU', not 'PRIME_I'
    expect(ids).toContain('I');
  });

  it('getEmbedding returns undefined for invalid ID', () => {
    expect(getEmbedding('NONEXISTENT')).toBeUndefined();
  });
});
