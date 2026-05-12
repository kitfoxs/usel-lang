import { describe, it, expect } from 'vitest';
import {
  nlaToUsel,
  uselToDescription,
  reEncodeTranscript,
  detectSpecifics,
} from '../src/ai/nla-bridge.js';

describe('nla-bridge', () => {
  describe('nlaToUsel', () => {
    it('encodes a simple explanation', () => {
      const result = nlaToUsel({ rawText: 'I want to see something big' });
      expect(result.tokens).toContain('Ka8');  // I  (King, a8)
      expect(result.tokens).toContain('Bg6');  // WANT (Bishop, g6)
      expect(result.tokens).toContain('Ba5');  // SEE (Bishop, a5)
      expect(result.coverage).toBeGreaterThan(0.5);
    });

    it('produces matching primeIds and glyphs', () => {
      const result = nlaToUsel({ rawText: 'I feel good' });
      expect(result.primeIds).toContain('PRIME_I');
      expect(result.primeIds).toContain('PRIME_FEEL');
      expect(result.primeIds).toContain('PRIME_GOOD');
      expect(result.tokens.length).toBe(result.primeIds.length);
      expect(result.glyphs.split(' ').length).toBe(result.tokens.length);
    });

    it('joins tokens with the . operator', () => {
      const result = nlaToUsel({ rawText: 'I want this' });
      expect(result.text).toBe(result.tokens.join('.'));
    });

    it('handles empty input gracefully', () => {
      const result = nlaToUsel({ rawText: '' });
      expect(result.tokens).toEqual([]);
      expect(result.primeIds).toEqual([]);
      expect(result.text).toBe('');
      expect(result.glyphs).toBe('');
      expect(result.coverage).toBe(0);
    });

    it('handles confabulation-prone specifics', () => {
      const result = nlaToUsel({
        rawText: 'Mid-sentence about Anthropic Claude AI assistant being created by Alibaba',
      });
      // Specifics like "Anthropic" and "Alibaba" should not become USEL primes.
      expect(result.tokens).not.toContain('Anthropic');
      expect(result.tokens).not.toContain('Alibaba');
      // Tokens should still all be valid chess notation (one of K/Q/R/B/N/P + file/rank).
      for (const tok of result.tokens) {
        expect(tok).toMatch(/^[KQRBNP][a-hM][0-8]$/);
      }
    });

    it('coverage is between 0 and 1', () => {
      const r1 = nlaToUsel({ rawText: 'I want something good now' });
      expect(r1.coverage).toBeGreaterThanOrEqual(0);
      expect(r1.coverage).toBeLessThanOrEqual(1);
    });
  });

  describe('uselToDescription', () => {
    it('round-trips a simple encoding to readable English', () => {
      const enc = nlaToUsel({ rawText: 'I want to see something big' });
      const text = uselToDescription(enc);
      expect(text.length).toBeGreaterThan(0);
      expect(typeof text).toBe('string');
    });

    it('returns empty string for empty encoding', () => {
      const text = uselToDescription({
        tokens: [], text: '', primeIds: [], glyphs: '', coverage: 0,
      });
      expect(text).toBe('');
    });
  });

  describe('detectSpecifics', () => {
    it('flags proper nouns', () => {
      const result = detectSpecifics('Hello, I am Qwen, created by Alibaba Cloud.');
      expect(result.count).toBeGreaterThan(0);
      expect(result.examples).toContain('Qwen');
      expect(result.examples).toContain('Alibaba');
    });

    it('flags quoted strings', () => {
      const result = detectSpecifics('The token "barfoo" appeared mid-context.');
      expect(result.examples).toContain('barfoo');
    });

    it('flags numeric specifics', () => {
      const result = detectSpecifics('In 2026 the layer 20 model showed FVE 0.78.');
      expect(result.examples).toContain('2026');
      expect(result.examples).toContain('20');
      expect(result.examples).toContain('0.78');
    });

    it('returns zero on a generic explanation', () => {
      const result = detectSpecifics('the model is thinking about something good');
      expect(result.count).toBe(0);
      expect(result.examples).toEqual([]);
    });
  });

  describe('reEncodeTranscript', () => {
    it('processes per-token NLA output', () => {
      const transcript = [
        { tokenIndex: 0, tokenText: 'I',    vectorMagnitude: 100, explanation: 'I am alive' },
        { tokenIndex: 1, tokenText: 'feel', vectorMagnitude: 105, explanation: 'feel good emotion' },
      ];
      const result = reEncodeTranscript(transcript);
      expect(result).toHaveLength(2);
      expect(result[0].uselEncoding.tokens.length).toBeGreaterThan(0);
      expect(result[1].uselEncoding.primeIds).toContain('PRIME_FEEL');
      // Original fields preserved.
      expect(result[0].tokenText).toBe('I');
      expect(result[1].vectorMagnitude).toBe(105);
    });

    it('handles empty transcript', () => {
      expect(reEncodeTranscript([])).toEqual([]);
    });
  });
});
