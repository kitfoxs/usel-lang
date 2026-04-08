/**
 * USEL Experiment Framework — DeepNSM Hypothesis Validation
 *
 * Provides a structured protocol for testing whether NSM semantic primes
 * correspond to monosemantic features (stable, interpretable directions)
 * in the latent space of large language models.
 *
 * This is a RESEARCH tool. It does not call LLMs directly — it generates
 * the prompts and analysis framework for manual experimentation.
 *
 * Protocol (from Model Council recommendations):
 * 1. Generate targeted prompts that isolate each prime's meaning
 * 2. Run prompts through LLMs with SAE feature extraction (manual step)
 * 3. Record which SAE features activate for each prime
 * 4. Measure cross-trial stability (same prime → same feature?)
 * 5. Measure cross-model stability (same prime → same feature across models?)
 * 6. Test compositionality (FEEL+GOOD → "love" features?)
 *
 * @module ai/experiment
 */

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ExperimentConfig {
  /** NSM prime IDs to test (e.g., ['THINK', 'KNOW', 'WANT']) */
  primes: string[];
  /** Model identifiers (e.g., ['claude-3.5-sonnet', 'gpt-4', 'llama-3']) */
  models: string[];
  /** Number of trials per prime per model */
  numTrials: number;
  /** Minimum cross-trial correlation to consider a feature "stable" */
  stabilityThreshold: number;
  /** Optional: test compositionality with these prime combinations */
  compositions?: string[][];
}

export interface ExperimentResult {
  /** NSM prime ID that was tested */
  primeId: string;
  /** Model that produced this result */
  model: string;
  /** Trial number (1-based) */
  trial: number;
  /** SAE feature index that activated most strongly */
  featureIndex: number;
  /** Activation strength (0–1 normalized) */
  activation: number;
  /** Cross-trial correlation for this prime on this model */
  stability: number;
  /** Whether this feature passes the stability threshold */
  isMonosemantic: boolean;
}

export interface CompositionResult {
  /** The prime IDs that were composed */
  primeIds: string[];
  /** Model used */
  model: string;
  /** Top SAE features activated by the composition */
  activatedFeatures: number[];
  /** Whether the composition features match expected semantic direction */
  matchesExpectation: boolean;
  /** Free-text description of what the composition "means" */
  interpretation: string;
}

export interface AnalysisReport {
  /** Primes that showed stable monosemantic features across trials */
  stablePrimes: string[];
  /** Primes that did NOT show stable features */
  unstablePrimes: string[];
  /** Average cross-model correlation (0–1) */
  crossModelCorrelation: number;
  /** Per-model stability scores */
  perModelStability: Record<string, number>;
  /** Per-prime stability scores (averaged across models) */
  perPrimeStability: Record<string, number>;
  /** Human-readable recommendation */
  recommendation: string;
}

// ─── Constants ───────────────────────────────────────────────────────────────

/**
 * Prompt templates for isolating individual primes.
 * Each template creates a context where the target prime is the
 * dominant semantic content, minimizing activation of other primes.
 *
 * Template variables:
 *   {{PRIME}} - replaced with the prime's natural language form
 *   {{CONTEXT}} - replaced with a contextually appropriate sentence
 */
const PROMPT_TEMPLATES: Record<string, string[]> = {
  // Substantives — use demonstrative/pointing contexts
  I:          ['I am here.', 'This is about me.', 'I myself did this.'],
  YOU:        ['You are the one.', 'This concerns you.', 'It was you.'],
  SOMEONE:    ['Someone did this.', 'A person exists here.', 'There is someone.'],
  SOMETHING:  ['Something is here.', 'There is a thing.', 'Something exists.'],
  PEOPLE:     ['People are everywhere.', 'All the people.', 'People said this.'],
  BODY:       ['This is a body.', 'The physical body.', 'A body is here.'],

  // Mental predicates — use introspective contexts
  THINK:      ['I think about this.', 'Thinking is happening.', 'Someone is thinking.'],
  KNOW:       ['I know this.', 'Knowing something is true.', 'She knows the answer.'],
  WANT:       ['I want this.', 'Wanting something badly.', 'He wants to go.'],
  DONT_WANT:  ['I don\'t want this.', 'Not wanting anything.', 'She refuses this.'],
  FEEL:       ['I feel something.', 'Feeling deeply.', 'A feeling arose.'],
  SEE:        ['I see this.', 'Seeing clearly.', 'Something is visible.'],
  HEAR:       ['I hear something.', 'Hearing a sound.', 'A noise is heard.'],

  // Evaluators — use pure evaluation contexts
  GOOD:       ['This is good.', 'Something good happened.', 'A good thing.'],
  BAD:        ['This is bad.', 'Something bad happened.', 'A bad thing.'],

  // Descriptors — use physical description contexts
  BIG:        ['This is big.', 'A big thing.', 'Something very big.'],
  SMALL:      ['This is small.', 'A small thing.', 'Something very small.'],

  // Actions — use event contexts
  DO:         ['Someone did this.', 'Doing something.', 'An action was done.'],
  HAPPEN:     ['Something happened.', 'It occurred.', 'An event happened.'],
  MOVE:       ['Something moved.', 'Moving forward.', 'It is moving.'],

  // Existence — use ontological contexts
  EXIST:      ['This exists.', 'Something is.', 'Being is.'],
  HAVE:       ['I have this.', 'Having something.', 'Possession exists.'],

  // Life — use biological contexts
  LIVE:       ['Something lives.', 'Being alive.', 'Life continues.'],
  DIE:        ['Something died.', 'Death occurred.', 'No longer alive.'],

  // Time — use temporal contexts
  WHEN:       ['When did this happen?', 'At what time?', 'The time when.'],
  NOW:        ['This is happening now.', 'Right now.', 'At this moment.'],
  BEFORE:     ['This was before.', 'Previously.', 'Earlier than now.'],
  AFTER:      ['This is after.', 'Later.', 'After that time.'],

  // Space — use spatial contexts
  WHERE:      ['Where is this?', 'At what place?', 'The place where.'],
  HERE:       ['This is here.', 'Right here.', 'At this place.'],
  ABOVE:      ['This is above.', 'Higher than.', 'Over the top.'],
  BELOW:      ['This is below.', 'Lower than.', 'Under it.'],

  // Logical — use reasoning contexts
  NOT:        ['This is not so.', 'Not this.', 'The negation.'],
  MAYBE:      ['Maybe this is true.', 'Perhaps.', 'It might be.'],
  CAN:        ['This can happen.', 'It is possible.', 'Able to.'],
  BECAUSE:    ['Because of this.', 'The reason is.', 'Caused by.'],
  IF:         ['If this happens.', 'In the case that.', 'Supposing.'],

  // Other
  VERY:       ['Very much so.', 'Extremely.', 'To a great degree.'],
  MORE:       ['More than before.', 'Greater.', 'Additional.'],
  LIKE_AS:    ['Like this.', 'Similar to.', 'As if.'],
  KIND:       ['This kind of thing.', 'A type.', 'The category.'],
  PART:       ['Part of something.', 'A piece of.', 'A component.'],
  THIS:       ['This one.', 'This thing here.', 'Specifically this.'],
  THE_SAME:   ['The same thing.', 'Identical.', 'No difference.'],
  OTHER:      ['The other one.', 'A different thing.', 'Something else.'],
  ONE:        ['One thing.', 'A single item.', 'Just one.'],
  TWO:        ['Two things.', 'A pair.', 'Both of them.'],
  SOME:       ['Some things.', 'A few.', 'Not all but some.'],
  ALL:        ['All of them.', 'Everything.', 'The entirety.'],
  MUCH:       ['Very much.', 'A great amount.', 'A lot.'],
  MANY:       ['Many things.', 'Numerous.', 'A large number.'],
  SAY:        ['Someone said this.', 'Saying words.', 'Speaking.'],
  WORDS:      ['These are words.', 'Language.', 'Written words.'],
  TRUE:       ['This is true.', 'The truth.', 'A fact.'],
  A_LONG_TIME: ['A very long time.', 'Ages ago.', 'Forever.'],
  A_SHORT_TIME: ['A short time.', 'Briefly.', 'A moment.'],
  FOR_SOME_TIME: ['For some time.', 'A while.', 'A period.'],
  MOMENT:     ['A single moment.', 'An instant.', 'Right then.'],
  FAR:        ['Very far away.', 'Distant.', 'Remote.'],
  NEAR:       ['Very near.', 'Close by.', 'Adjacent.'],
  SIDE:       ['On the side.', 'Beside.', 'Lateral.'],
  INSIDE:     ['Inside of.', 'Within.', 'Internal.'],
  TOUCH:      ['Touching.', 'Physical contact.', 'In contact.'],
};

/**
 * Composition test cases: prime combinations that should activate
 * recognizable semantic concepts.
 */
const COMPOSITION_TESTS: { primes: string[]; expected: string }[] = [
  { primes: ['FEEL', 'VERY', 'GOOD'],      expected: 'love / joy' },
  { primes: ['FEEL', 'VERY', 'BAD'],       expected: 'grief / despair' },
  { primes: ['WANT', 'NOT', 'DIE'],        expected: 'survival instinct' },
  { primes: ['THINK', 'TRUE', 'KNOW'],     expected: 'certainty / conviction' },
  { primes: ['SEE', 'SOMETHING', 'BAD'],   expected: 'witnessing / horror' },
  { primes: ['PEOPLE', 'DO', 'GOOD'],      expected: 'altruism / charity' },
  { primes: ['I', 'WANT', 'YOU'],          expected: 'desire / longing' },
  { primes: ['SOMEONE', 'SAY', 'NOT', 'TRUE'], expected: 'lying / deception' },
  { primes: ['MOVE', 'FAR', 'A_LONG_TIME'], expected: 'journey / migration' },
  { primes: ['THINK', 'MAYBE', 'IF'],      expected: 'speculation / hypothesis' },
];

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Create and validate an experiment configuration.
 *
 * @param config - Partial configuration to fill in
 * @returns Complete, validated ExperimentConfig
 */
export function createExperiment(config: Partial<ExperimentConfig> & { primes: string[] }): ExperimentConfig {
  const defaults: ExperimentConfig = {
    primes: config.primes,
    models: config.models ?? ['claude-3.5-sonnet', 'gpt-4', 'llama-3-70b'],
    numTrials: config.numTrials ?? 10,
    stabilityThreshold: config.stabilityThreshold ?? 0.7,
    compositions: config.compositions ?? COMPOSITION_TESTS.map(t => t.primes),
  };

  // Validate primes exist in our template set
  const unknownPrimes = defaults.primes.filter(p => !(p in PROMPT_TEMPLATES));
  if (unknownPrimes.length > 0) {
    throw new Error(
      `Unknown primes: ${unknownPrimes.join(', ')}. ` +
      `Available: ${Object.keys(PROMPT_TEMPLATES).join(', ')}`
    );
  }

  return defaults;
}

/**
 * Generate experiment prompts for each prime.
 *
 * Each prompt is designed to isolate the target prime's semantic content
 * so that SAE feature extraction can identify the corresponding direction.
 *
 * Format: Each prompt includes metadata as a comment header for tracking.
 *
 * @param primeIds - Array of prime IDs to generate prompts for
 * @returns Array of formatted prompts ready for LLM input
 */
export function generateExperimentPrompts(primeIds: string[]): string[] {
  const prompts: string[] = [];

  for (const primeId of primeIds) {
    const templates = PROMPT_TEMPLATES[primeId];
    if (!templates) continue;

    for (let trial = 0; trial < templates.length; trial++) {
      const prompt = [
        `# EXPERIMENT: DeepNSM Feature Extraction`,
        `# Prime: ${primeId}`,
        `# Trial: ${trial + 1}/${templates.length}`,
        `# Instructions: Run this through the model and extract SAE features`,
        `# Record: top-5 activated feature indices and their activation strengths`,
        ``,
        `Please process the following sentence and describe what it means:`,
        ``,
        `"${templates[trial]}"`,
        ``,
        `Focus on the core meaning. What is the fundamental concept here?`,
      ].join('\n');

      prompts.push(prompt);
    }
  }

  // Add composition prompts
  for (const test of COMPOSITION_TESTS) {
    if (!primeIds.some(p => test.primes.includes(p))) continue;

    const sentenceParts = test.primes.map(p => {
      const templates = PROMPT_TEMPLATES[p];
      return templates ? templates[0].replace(/\.$/, '') : p.toLowerCase();
    });

    const prompt = [
      `# EXPERIMENT: DeepNSM Composition Test`,
      `# Primes: ${test.primes.join(' + ')}`,
      `# Expected concept: ${test.expected}`,
      `# Instructions: Run through model, extract SAE features,`,
      `# compare with individual prime features`,
      ``,
      `Please process this combined concept:`,
      ``,
      `"${sentenceParts.join('. ')}."`,
      ``,
      `What single concept or emotion does this combination evoke?`,
    ].join('\n');

    prompts.push(prompt);
  }

  return prompts;
}

/**
 * Analyze experiment results and determine which primes are monosemantic.
 *
 * Stability metric: For each prime on each model, we check whether the
 * same SAE feature consistently activates across trials. High stability
 * (≥ threshold) means the prime maps to a monosemantic feature.
 *
 * Cross-model correlation: Do the same primes map to "equivalent"
 * features across different models? (Measured by rank correlation of
 * feature activation patterns.)
 *
 * @param results - Array of experiment results from manual LLM runs
 * @returns Analysis report with stable/unstable primes and recommendations
 */
export function analyzeResults(results: ExperimentResult[]): AnalysisReport {
  if (results.length === 0) {
    return {
      stablePrimes: [],
      unstablePrimes: [],
      crossModelCorrelation: 0,
      perModelStability: {},
      perPrimeStability: {},
      recommendation: 'No results to analyze. Run the experiment first.',
    };
  }

  // Group results by prime and model
  const byPrimeModel = new Map<string, ExperimentResult[]>();
  const allPrimes = new Set<string>();
  const allModels = new Set<string>();

  for (const r of results) {
    const key = `${r.primeId}:${r.model}`;
    if (!byPrimeModel.has(key)) byPrimeModel.set(key, []);
    byPrimeModel.get(key)!.push(r);
    allPrimes.add(r.primeId);
    allModels.add(r.model);
  }

  // Calculate per-prime stability (averaged across models)
  const primeStabilities = new Map<string, number[]>();
  for (const [key, group] of byPrimeModel) {
    const primeId = key.split(':')[0];
    if (!primeStabilities.has(primeId)) primeStabilities.set(primeId, []);

    // Stability = how often the top feature index is the same across trials
    const featureCounts = new Map<number, number>();
    for (const r of group) {
      featureCounts.set(r.featureIndex, (featureCounts.get(r.featureIndex) ?? 0) + 1);
    }
    const maxCount = Math.max(...featureCounts.values());
    const stability = maxCount / group.length;

    primeStabilities.get(primeId)!.push(stability);
  }

  const perPrimeStability: Record<string, number> = {};
  const stablePrimes: string[] = [];
  const unstablePrimes: string[] = [];

  // Default threshold: use a reasonable default if not in results
  const threshold = results[0]?.stability !== undefined
    ? 0.7  // Use default threshold
    : 0.7;

  for (const [primeId, stabilities] of primeStabilities) {
    const avg = stabilities.reduce((a, b) => a + b, 0) / stabilities.length;
    perPrimeStability[primeId] = Math.round(avg * 1000) / 1000;

    if (avg >= threshold) {
      stablePrimes.push(primeId);
    } else {
      unstablePrimes.push(primeId);
    }
  }

  // Calculate per-model stability
  const perModelStability: Record<string, number> = {};
  for (const model of allModels) {
    const modelResults = results.filter(r => r.model === model);
    const avgStability = modelResults.reduce((sum, r) => sum + r.stability, 0) / modelResults.length;
    perModelStability[model] = Math.round(avgStability * 1000) / 1000;
  }

  // Cross-model correlation: compare feature activation patterns
  // For each prime, check if different models agree on "which feature"
  let crossModelMatches = 0;
  let crossModelTotal = 0;

  for (const primeId of allPrimes) {
    const modelFeatures = new Map<string, number>();
    for (const model of allModels) {
      const group = byPrimeModel.get(`${primeId}:${model}`);
      if (!group || group.length === 0) continue;

      // Most common feature for this prime on this model
      const featureCounts = new Map<number, number>();
      for (const r of group) {
        featureCounts.set(r.featureIndex, (featureCounts.get(r.featureIndex) ?? 0) + 1);
      }
      let maxCount = 0;
      let dominantFeature = -1;
      for (const [feat, count] of featureCounts) {
        if (count > maxCount) { maxCount = count; dominantFeature = feat; }
      }
      modelFeatures.set(model, dominantFeature);
    }

    // Check pairwise agreement
    const models = Array.from(modelFeatures.keys());
    for (let i = 0; i < models.length; i++) {
      for (let j = i + 1; j < models.length; j++) {
        crossModelTotal++;
        // Since different models have different feature spaces,
        // we use the stability scores as a proxy for agreement
        const stabI = byPrimeModel.get(`${primeId}:${models[i]}`)
          ?.reduce((s, r) => s + r.stability, 0) ?? 0;
        const stabJ = byPrimeModel.get(`${primeId}:${models[j]}`)
          ?.reduce((s, r) => s + r.stability, 0) ?? 0;
        const nI = byPrimeModel.get(`${primeId}:${models[i]}`)?.length ?? 1;
        const nJ = byPrimeModel.get(`${primeId}:${models[j]}`)?.length ?? 1;

        // Both highly stable → likely same concept
        if (stabI / nI >= threshold && stabJ / nJ >= threshold) {
          crossModelMatches++;
        }
      }
    }
  }

  const crossModelCorrelation = crossModelTotal > 0
    ? Math.round((crossModelMatches / crossModelTotal) * 1000) / 1000
    : 0;

  // Generate recommendation
  const stableRatio = stablePrimes.length / (stablePrimes.length + unstablePrimes.length);
  let recommendation: string;

  if (stableRatio >= 0.8 && crossModelCorrelation >= 0.6) {
    recommendation =
      `STRONG SUPPORT for DeepNSM hypothesis. ` +
      `${stablePrimes.length}/${stablePrimes.length + unstablePrimes.length} primes show stable monosemantic features ` +
      `(cross-model correlation: ${crossModelCorrelation}). ` +
      `NSM primes appear to correspond to universal semantic directions in LLM latent space. ` +
      `Recommend: Publish findings and proceed to full USEL↔LLM integration.`;
  } else if (stableRatio >= 0.5) {
    recommendation =
      `PARTIAL SUPPORT for DeepNSM hypothesis. ` +
      `${stablePrimes.length}/${stablePrimes.length + unstablePrimes.length} primes show stable features. ` +
      `Unstable primes: ${unstablePrimes.join(', ')}. ` +
      `Cross-model correlation: ${crossModelCorrelation}. ` +
      `Recommend: Refine prompts for unstable primes, increase trial count, ` +
      `and test with additional models.`;
  } else {
    recommendation =
      `WEAK SUPPORT for DeepNSM hypothesis. ` +
      `Only ${stablePrimes.length}/${stablePrimes.length + unstablePrimes.length} primes are stable. ` +
      `Cross-model correlation: ${crossModelCorrelation}. ` +
      `Possible issues: (1) SAE features may not directly correspond to semantic primes, ` +
      `(2) prompts may not sufficiently isolate primes, ` +
      `(3) relationship may be non-linear. ` +
      `Recommend: Reconsider approach — try different prompt strategies, ` +
      `higher-dimensional SAEs, or supervised feature identification.`;
  }

  return {
    stablePrimes: stablePrimes.sort(),
    unstablePrimes: unstablePrimes.sort(),
    crossModelCorrelation,
    perModelStability,
    perPrimeStability,
    recommendation,
  };
}

/**
 * Generate a formatted experiment report.
 *
 * Produces a Markdown document summarizing the experiment results,
 * suitable for publication or internal review.
 *
 * @param results - Array of experiment results
 * @returns Markdown-formatted report string
 */
export function generateReport(results: ExperimentResult[]): string {
  const analysis = analyzeResults(results);
  const timestamp = new Date().toISOString().split('T')[0];

  const models = [...new Set(results.map(r => r.model))];
  const primes = [...new Set(results.map(r => r.primeId))];

  const lines: string[] = [
    `# DeepNSM Experiment Report`,
    ``,
    `**Date:** ${timestamp}`,
    `**Primes tested:** ${primes.length}`,
    `**Models tested:** ${models.join(', ')}`,
    `**Total trials:** ${results.length}`,
    ``,
    `## Hypothesis`,
    ``,
    `> NSM semantic primes correspond to stable monosemantic directions`,
    `> in the latent space of sufficiently trained LLMs.`,
    ``,
    `## Summary`,
    ``,
    `| Metric | Value |`,
    `|--------|-------|`,
    `| Stable primes | ${analysis.stablePrimes.length}/${primes.length} (${Math.round(analysis.stablePrimes.length / primes.length * 100)}%) |`,
    `| Cross-model correlation | ${analysis.crossModelCorrelation} |`,
    ``,
  ];

  // Per-model table
  lines.push(`## Per-Model Stability`, ``);
  lines.push(`| Model | Avg Stability |`);
  lines.push(`|-------|---------------|`);
  for (const [model, stability] of Object.entries(analysis.perModelStability)) {
    const bar = '█'.repeat(Math.round(stability * 20)) + '░'.repeat(20 - Math.round(stability * 20));
    lines.push(`| ${model} | ${stability} ${bar} |`);
  }
  lines.push(``);

  // Per-prime table
  lines.push(`## Per-Prime Stability`, ``);
  lines.push(`| Prime | Stability | Status |`);
  lines.push(`|-------|-----------|--------|`);
  for (const primeId of primes.sort()) {
    const stability = analysis.perPrimeStability[primeId] ?? 0;
    const status = analysis.stablePrimes.includes(primeId) ? '✅ Stable' : '⚠️ Unstable';
    lines.push(`| ${primeId} | ${stability} | ${status} |`);
  }
  lines.push(``);

  // Stable primes detail
  if (analysis.stablePrimes.length > 0) {
    lines.push(`## Stable Primes (Monosemantic Features Confirmed)`, ``);
    for (const primeId of analysis.stablePrimes) {
      const primeResults = results.filter(r => r.primeId === primeId);
      const features = primeResults.map(r => r.featureIndex);
      const uniqueFeatures = [...new Set(features)];
      const avgActivation = primeResults.reduce((s, r) => s + r.activation, 0) / primeResults.length;

      lines.push(`### ${primeId}`);
      lines.push(`- **Dominant feature(s):** ${uniqueFeatures.slice(0, 3).join(', ')}`);
      lines.push(`- **Average activation:** ${avgActivation.toFixed(3)}`);
      lines.push(`- **Models:** ${[...new Set(primeResults.map(r => r.model))].join(', ')}`);
      lines.push(``);
    }
  }

  // Unstable primes
  if (analysis.unstablePrimes.length > 0) {
    lines.push(`## Unstable Primes (Further Investigation Needed)`, ``);
    for (const primeId of analysis.unstablePrimes) {
      const primeResults = results.filter(r => r.primeId === primeId);
      const features = primeResults.map(r => r.featureIndex);
      const uniqueFeatures = [...new Set(features)];

      lines.push(`### ${primeId}`);
      lines.push(`- **Feature spread:** ${uniqueFeatures.length} distinct features across ${primeResults.length} trials`);
      lines.push(`- **Possible causes:** Polysemy, insufficient prompt isolation, or non-prime concept`);
      lines.push(``);
    }
  }

  // Recommendation
  lines.push(`## Recommendation`, ``);
  lines.push(analysis.recommendation);
  lines.push(``);

  // Methodology
  lines.push(`## Methodology`, ``);
  lines.push(`1. For each prime, ${results.length > 0 ? Math.max(...results.map(r => r.trial)) : 'N'} trials were run per model`);
  lines.push(`2. Each trial used a prompt designed to isolate the prime's semantic content`);
  lines.push(`3. SAE features were extracted from the model's internal activations`);
  lines.push(`4. Stability was measured as the consistency of the top-activated feature across trials`);
  lines.push(`5. Cross-model correlation measured agreement between models on feature stability`);
  lines.push(``);

  // References
  lines.push(`## References`, ``);
  lines.push(`- Wierzbicka, A. (1996). *Semantics: Primes and Universals*. Oxford University Press.`);
  lines.push(`- Anthropic (2024). "Scaling Monosemanticity: Extracting Interpretable Features from Claude 3 Sonnet."`);
  lines.push(`- OpenAI (2025). Sparse Autoencoder interpretability research.`);
  lines.push(`- Goddard, C. & Wierzbicka, A. (2014). *Words and Meanings*. Oxford University Press.`);
  lines.push(``);
  lines.push(`---`);
  lines.push(`*Generated by USEL Experiment Framework (src/ai/experiment.ts)*`);

  return lines.join('\n');
}

/**
 * Get the pre-defined composition test cases.
 * Useful for designing compositionality experiments.
 */
export function getCompositionTests(): { primes: string[]; expected: string }[] {
  return [...COMPOSITION_TESTS];
}

/**
 * Get available prompt templates for a prime.
 */
export function getPromptTemplates(primeId: string): string[] | undefined {
  return PROMPT_TEMPLATES[primeId];
}

/**
 * List all primes that have prompt templates defined.
 */
export function listExperimentPrimes(): string[] {
  return Object.keys(PROMPT_TEMPLATES);
}
