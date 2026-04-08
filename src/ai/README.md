# USEL AI Integration Layer — DeepNSM

> **Status:** Research phase — hypothesis untested  
> **Risk level:** High (novel research, no prior work)  
> **Potential impact:** Foundational (universal semantic↔computational bridge)

## The DeepNSM Hypothesis

**Claim:** The 65 NSM (Natural Semantic Metalanguage) semantic primes correspond to stable, monosemantic directions in the latent space of any sufficiently trained large language model.

In other words: the atoms of human meaning (Wierzbicka 1996) are the same atoms that LLMs discover through training on human language. They're not arbitrary — they're *universal semantic features* that any intelligence (biological or artificial) converges on.

If true, this means USEL isn't just a programming language — it's a **Rosetta Stone** between human meaning, formal computation, and AI internal representations.

### Why We Think This

1. **NSM primes are empirically universal.** 50+ years of cross-linguistic research shows these 65 concepts exist in every human language. They can't be further decomposed.

2. **LLMs discover monosemantic features.** Anthropic's "Scaling Monosemanticity" (2024) showed that sparse autoencoders (SAEs) extract stable, interpretable feature directions from LLM activations — including concepts like "Golden Gate Bridge" or "deception."

3. **The overlap is suspicious.** NSM primes include THINK, KNOW, WANT, FEEL, GOOD, BAD, SEE, HEAR — exactly the kind of fundamental concepts that appear as stable SAE features. If LLMs trained on human language converge on the same atomic meanings that linguists identified empirically... that's not a coincidence.

4. **No one has tested this directly.** As of 2026, no published work has systematically checked whether NSM primes map 1:1 to SAE features. We are first.

## Module Architecture

```
src/ai/
├── embeddings.ts   — Vector space for USEL symbols
├── translate.ts    — Natural language ↔ USEL translation
├── experiment.ts   — Research validation framework
└── README.md       — This file
```

### `embeddings.ts` — Symbol Vector Space

Maps each of the 65 NSM primes to a 64-dimensional vector embedding. The embeddings encode semantic relationships:

| Relationship | Cosine Similarity |
|---|---|
| Same category (THINK, KNOW) | ~0.3 to 0.6 (moderate positive) |
| Opposite concepts (GOOD, BAD) | ~-0.3 to -0.6 (negative) |
| Related concepts (SEE, HEAR) | ~0.2 to 0.4 (mild positive) |
| Unrelated concepts (THINK, BIG) | ~-0.1 to 0.1 (near zero) |

**Key functions:**
- `generateEmbedding(symbol)` — Get/create embedding for any USEL symbol
- `cosineSimilarity(a, b)` — Measure semantic distance
- `nearestPrimes(vector, k)` — Find closest primes to arbitrary vector
- `composeEmbeddings(list)` — Combine primes into complex meaning
- `decomposeEmbedding(vector)` — Break vector into component primes

**Current implementation:** Deterministic pseudo-embeddings generated from category angles + seeded PRNG + semantic relationship corrections. These are *placeholders* — the real embeddings will come from SAE feature extraction on actual LLMs.

### `translate.ts` — Natural Language ↔ USEL

Translates between natural language and USEL symbol sequences using keyword matching.

**Key functions:**
- `naturalToUSEL(text, lang?)` — English/Spanish → prime IDs
- `uselToNatural(symbolIds, lang?)` — Prime IDs → English/Spanish
- `suggestSymbols(partialText)` — Autocomplete suggestions

**Supported patterns:**
- Direct keyword mapping (500+ English words, 100+ Spanish words)
- Negation detection ("don't want" → DONT_WANT)
- Intensifier patterns ("very good" → VERY + GOOD)
- Stop word filtering (articles, prepositions)

**Limitations (MVP):**
- No grammar analysis (treats input as bag-of-words with patterns)
- No disambiguation (polysemous words get first match)
- Spanish support is basic
- No context-dependent translation

### `experiment.ts` — Research Validation

Framework for testing the DeepNSM hypothesis. Does NOT call LLMs — generates prompts and analyzes results from manual runs.

**Workflow:**

```
1. createExperiment(config)        → Define what to test
2. generateExperimentPrompts(ids)  → Get prompts for LLM runs
3. [MANUAL] Run prompts through LLMs with SAE extraction
4. [MANUAL] Record feature indices and activation strengths
5. analyzeResults(results)         → Statistical analysis
6. generateReport(results)         → Markdown report
```

## How to Run Validation Experiments

### Prerequisites

- Access to LLM internals (SAE feature extraction)
- Recommended: Anthropic API with feature extraction, or local model with TransformerLens
- At least 2 different LLM families for cross-model validation

### Step 1: Generate Prompts

```typescript
import { createExperiment, generateExperimentPrompts } from './experiment';

const config = createExperiment({
  primes: ['THINK', 'KNOW', 'WANT', 'FEEL', 'GOOD', 'BAD'],
  models: ['claude-3.5-sonnet', 'gpt-4', 'llama-3-70b'],
  numTrials: 10,
  stabilityThreshold: 0.7,
});

const prompts = generateExperimentPrompts(config.primes);
// → Array of formatted prompts, ready for LLM input
```

### Step 2: Run Through LLMs (Manual)

For each prompt:
1. Send to LLM with SAE feature extraction enabled
2. Record the top-5 activated feature indices
3. Record activation strengths (0–1 normalized)
4. Note which feature was #1 (most activated)

Tools for SAE extraction:
- **Anthropic:** Use the interpretability API (if available)
- **Local models:** Use [TransformerLens](https://github.com/neelnanda-io/TransformerLens) + SAE training
- **OpenAI:** Use their sparse autoencoder research tools (if published)

### Step 3: Record Results

```typescript
import type { ExperimentResult } from './experiment';

const results: ExperimentResult[] = [
  {
    primeId: 'THINK',
    model: 'claude-3.5-sonnet',
    trial: 1,
    featureIndex: 4821,
    activation: 0.87,
    stability: 0.91,    // filled in after all trials
    isMonosemantic: true // filled in after analysis
  },
  // ... more results
];
```

### Step 4: Analyze

```typescript
import { analyzeResults, generateReport } from './experiment';

const analysis = analyzeResults(results);
console.log(analysis.recommendation);

const report = generateReport(results);
// → Full Markdown report with tables and charts
```

### What We're Looking For

| Outcome | Meaning |
|---|---|
| **≥80% stable, cross-model corr ≥0.6** | STRONG support — NSM primes ARE monosemantic features |
| **50–80% stable** | PARTIAL support — some primes are universal, some aren't |
| **<50% stable** | WEAK support — reconsider approach |

## Current Status

- [x] Embedding space defined (placeholder vectors)
- [x] Natural language translation (keyword-based MVP)
- [x] Experiment framework complete
- [ ] **SAE feature extraction on real LLMs** ← NEXT STEP
- [ ] Cross-model validation
- [ ] Compositionality testing
- [ ] Replace placeholder embeddings with real SAE-derived vectors
- [ ] LLM-backed translation (Phase 2)
- [ ] Publish findings

## References

1. **Wierzbicka, A.** (1996). *Semantics: Primes and Universals*. Oxford University Press.
   - The foundational NSM work defining semantic primes.

2. **Anthropic** (2024). "Scaling Monosemanticity: Extracting Interpretable Features from Claude 3 Sonnet."
   - Key finding: SAEs extract stable, interpretable feature directions from LLM activations.
   - [https://transformer-circuits.pub/2024/scaling-monosemanticity/](https://transformer-circuits.pub/2024/scaling-monosemanticity/)

3. **OpenAI** (2025). Sparse autoencoder interpretability research.
   - Complementary work on feature extraction from GPT-family models.

4. **Goddard, C. & Wierzbicka, A.** (2014). *Words and Meanings: Lexical Semantics Across Domains, Languages, and Cultures*. Oxford University Press.
   - Extended NSM framework with molecules and semantic templates.

5. **Elhage, N. et al.** (2022). "Toy Models of Superposition." Anthropic.
   - Theoretical foundation for why features are superposed in neural networks.

6. **Bricken, T. et al.** (2023). "Towards Monosemanticity: Decomposing Language Models With Dictionary Learning." Anthropic.
   - Initial SAE work showing monosemantic feature extraction is feasible.

---

*This is the most novel aspect of USEL. No one has mapped NSM primes to LLM features before. We are first. — Model Council, 2026*
