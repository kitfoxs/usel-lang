import { describe, it, expect } from 'vitest';
import USELEncoder from '../src/mempalace/usel-encoder.js';
import {
  createExperiment, generateExperimentPrompts, analyzeResults,
  generateReport, getCompositionTests, getPromptTemplates,
  listExperimentPrimes,
} from '../src/ai/experiment.js';

// ─── MemPalace Encoder ───────────────────────────────────────────────────────

describe('USELEncoder', () => {
  const encoder = new USELEncoder();

  it('encode returns a string', () => {
    const result = encoder.encode('Kit went to the store yesterday');
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('encode compresses (output shorter than input)', () => {
    const input = 'Ada Marie discussed the project architecture with Kit last week';
    const result = encoder.encode(input);
    expect(result.length).toBeLessThan(input.length);
  });

  it('decode returns a string', () => {
    const encoded = encoder.encode('I thought about something good');
    const decoded = encoder.decode(encoded);
    expect(typeof decoded).toBe('string');
  });

  it('compareCompression returns comparison object', () => {
    const result = encoder.compareCompression('Kit built something amazing yesterday');
    expect(result).toHaveProperty('original');
    expect(result).toHaveProperty('aaak');
    expect(result).toHaveProperty('usel');
    expect(result).toHaveProperty('winner');
    expect(result).toHaveProperty('savings');
    expect(result.original.chars).toBeGreaterThan(0);
  });
});

// ─── Experiment Framework ────────────────────────────────────────────────────

describe('Experiment framework', () => {
  it('createExperiment returns valid config', () => {
    const config = createExperiment({ primes: ['I', 'WANT'] });
    expect(config).toHaveProperty('primes');
    expect(config.primes).toContain('I');
  });

  it('generateExperimentPrompts returns prompts', () => {
    const prompts = generateExperimentPrompts(['I', 'WANT', 'GOOD']);
    expect(Array.isArray(prompts)).toBe(true);
    expect(prompts.length).toBeGreaterThan(0);
  });

  it('getCompositionTests returns test cases', () => {
    const tests = getCompositionTests();
    expect(Array.isArray(tests)).toBe(true);
    expect(tests.length).toBeGreaterThan(0);
    expect(tests[0]).toHaveProperty('primes');
    expect(tests[0]).toHaveProperty('expected');
  });

  it('getPromptTemplates returns templates for known prime', () => {
    const templates = getPromptTemplates('THINK');
    expect(templates).toBeDefined();
    if (templates) {
      expect(templates.length).toBeGreaterThan(0);
    }
  });

  it('getPromptTemplates returns undefined for unknown prime', () => {
    expect(getPromptTemplates('NONEXISTENT')).toBeUndefined();
  });

  it('listExperimentPrimes returns array of strings', () => {
    const primes = listExperimentPrimes();
    expect(Array.isArray(primes)).toBe(true);
    expect(primes.length).toBeGreaterThan(0);
  });

  it('analyzeResults handles empty array', () => {
    const report = analyzeResults([]);
    expect(report).toBeTruthy();
  });

  it('generateReport returns string', () => {
    const report = generateReport([]);
    expect(typeof report).toBe('string');
  });
});
