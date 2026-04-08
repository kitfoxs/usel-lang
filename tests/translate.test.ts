import { describe, it, expect } from 'vitest';
import { naturalToUSEL, uselToNatural, suggestSymbols } from '../src/ai/translate.js';

// ─── Natural → USEL ─────────────────────────────────────────────────────────

describe('naturalToUSEL', () => {
  it('translates simple English sentence', () => {
    const result = naturalToUSEL('I want something good');
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it('returns symbol IDs as strings', () => {
    const result = naturalToUSEL('think about this');
    for (const r of result) {
      expect(typeof r).toBe('string');
    }
  });

  it('detects negation', () => {
    const result = naturalToUSEL('I do not want this');
    expect(result.some((s) => s.includes('NOT') || s.includes('DONT'))).toBe(true);
  });

  it('handles empty input', () => {
    const result = naturalToUSEL('');
    expect(Array.isArray(result)).toBe(true);
  });

  it('handles unknown words gracefully', () => {
    const result = naturalToUSEL('xyzzy flurbo wibble');
    expect(Array.isArray(result)).toBe(true);
  });
});

// ─── USEL → Natural ─────────────────────────────────────────────────────────

describe('uselToNatural', () => {
  it('converts symbol IDs to English text', () => {
    const text = uselToNatural(['PRIME_I', 'PRIME_WANT', 'PRIME_GOOD']);
    expect(typeof text).toBe('string');
    expect(text.length).toBeGreaterThan(0);
  });

  it('handles single symbol', () => {
    const text = uselToNatural(['PRIME_DO']);
    expect(text.length).toBeGreaterThan(0);
  });

  it('handles empty array', () => {
    const text = uselToNatural([]);
    expect(typeof text).toBe('string');
  });
});

// ─── Suggestions / Autocomplete ──────────────────────────────────────────────

describe('suggestSymbols', () => {
  it('returns suggestions for partial text', () => {
    const suggestions = suggestSymbols('wan');
    expect(Array.isArray(suggestions)).toBe(true);
  });

  it('suggestion objects have symbolId and name', () => {
    const suggestions = suggestSymbols('good');
    for (const s of suggestions) {
      expect(s).toHaveProperty('symbolId');
      expect(s).toHaveProperty('name');
    }
  });

  it('empty input returns results', () => {
    const suggestions = suggestSymbols('');
    expect(Array.isArray(suggestions)).toBe(true);
  });
});
