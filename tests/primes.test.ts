import { describe, it, expect } from 'vitest';
import { TIER0_PRIMES, PRIME_BY_ID } from '../src/primes/tier0-core';
import { TIER1_COMPUTE, COMPUTE_BY_ID } from '../src/primes/tier1-compute';

// ─── Tier 0: 63 NSM Semantic Primes ─────────────────────────────────────────

describe('Tier 0 — NSM semantic primes', () => {
  it('should export exactly 63 primes', () => {
    expect(TIER0_PRIMES).toHaveLength(63);
  });

  it('should have unique IDs', () => {
    const ids = TIER0_PRIMES.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('should have unique glyphs', () => {
    const glyphs = TIER0_PRIMES.map((p) => p.glyph);
    expect(new Set(glyphs).size).toBe(glyphs.length);
  });

  it('every prime has required fields', () => {
    for (const p of TIER0_PRIMES) {
      expect(p.id).toBeTruthy();
      expect(p.glyph).toBeTruthy();
      expect(p.name).toBeTruthy();
      expect(p.category).toBeTruthy();
      expect(p.tier).toBe(0);
      expect(p.description).toBeTruthy();
      expect(Array.isArray(p.provides)).toBe(true);
      expect(p.provides.length).toBeGreaterThan(0);
    }
  });

  it('PRIME_BY_ID lookup works', () => {
    const want = PRIME_BY_ID['PRIME_WANT'];
    expect(want).toBeDefined();
    expect(want.name).toBe('WANT');
  });

  it('PRIME_BY_ID has all 63 entries', () => {
    expect(Object.keys(PRIME_BY_ID)).toHaveLength(63);
  });
});

// ─── Tier 1: 120 Compute Extensions ─────────────────────────────────────────

describe('Tier 1 — compute extensions', () => {
  it('should export exactly 120 compute symbols', () => {
    expect(TIER1_COMPUTE).toHaveLength(120);
  });

  it('should have unique IDs', () => {
    const ids = TIER1_COMPUTE.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('every symbol has required fields', () => {
    for (const s of TIER1_COMPUTE) {
      expect(s.id).toBeTruthy();
      expect(s.glyph).toBeTruthy();
      expect(s.name).toBeTruthy();
      expect(s.category).toBeTruthy();
      expect(s.tier).toBe(1);
    }
  });

  it('COMPUTE_BY_ID lookup works', () => {
    const add = COMPUTE_BY_ID['COMPUTE_ADD'];
    expect(add).toBeDefined();
  });

  it('COMPUTE_BY_ID has all 120 entries', () => {
    expect(Object.keys(COMPUTE_BY_ID)).toHaveLength(120);
  });

  it('no ID collisions between tier0 and tier1', () => {
    const t0ids = new Set(TIER0_PRIMES.map((p) => p.id));
    for (const s of TIER1_COMPUTE) {
      expect(t0ids.has(s.id), `Collision: ${s.id}`).toBe(false);
    }
  });
});
