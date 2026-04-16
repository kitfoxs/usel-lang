# USEL v2 Experimental Validation Plan

**Authors:** Kit Olivas & Ada Marie  
**Date:** July 2026  
**Purpose:** Concrete, runnable experiments to empirically validate the claims of the USEL v2 paper  
**Hardware:** M4 Max MacBook Pro, Python 3.12+, access to OpenAI/Anthropic/local LLMs  
**Companion document:** USEL_V2_PAPER.md

---

## Overview

This document specifies six experiments that collectively validate USEL v2 across its core claims: compilability (Experiment 1), cross-language semantic preservation (Experiment 2), human learnability (Experiment 3), compression efficiency (Experiment 4), operational utility for multilingual incident correlation (Experiment 5), and downstream task execution accuracy (Experiment 6).

| # | Experiment | Core Claim Tested | Runnable Solo? | Needs Participants? |
|---|-----------|-------------------|----------------|---------------------|
| 1 | NL→USEL Compiler Accuracy | LLMs can compile natural language to USEL | ✅ Yes | No |
| 2 | Cross-Language Semantic Equivalence | USEL preserves meaning across languages | ⚠️ Partially | Yes (native speakers) |
| 3 | Comprehension Study | USEL molecules are learnable after brief training | ❌ No | Yes (60 participants) |
| 4 | Compression Ratio Analysis | USEL achieves meaningful compression vs. NL | ✅ Yes | No |
| 5 | Datacenter Incident Correlation | USEL enables cross-language incident matching | ✅ Yes | No |
| 6 | AI Agent Command Execution | USEL→execution is more reliable than NL→execution | ✅ Yes | No |

Experiments 1, 4, 5, and 6 can be run entirely on Kit's hardware with API access. Experiment 2 is partially automatable (LLM judges as proxies) with human validation as a follow-up. Experiment 3 requires IRB approval and participant recruitment — it is designed for proposal in the paper with execution in a follow-up study.

---

---

## Experiment 1: NL→USEL Compiler Accuracy

### 1.1 Hypothesis

**H1:** A fine-tuned LLM can compile natural language sentences into correct USEL bracket notation with ≥80% structural F1 score, and a prompted (zero-shot) GPT-4o achieves ≥50% F1 — demonstrating that USEL's constrained output space (65 primes + operators) makes NL→USEL compilation tractable even without task-specific training.

**H1a (secondary):** USEL compilation accuracy exceeds AMR parsing accuracy on equivalent-complexity sentences because USEL's output vocabulary (65 fixed symbols) is orders of magnitude smaller than AMR's open concept set (~40,000+).

### 1.2 Methodology

#### Dataset Construction

**Source:** The 150 canonical NSM sentences from `150_SENTENCES_USEL_TRANSLATION.md`, each already paired with a gold-standard USEL bracket expression.

**Split:**
- **Train:** 100 sentences (stratified by category: ~7 per NSM category)
- **Validation:** 20 sentences (for hyperparameter tuning)
- **Test:** 30 sentences (held out, never seen during training — stratified to include at least 2 from each of the 15 NSM categories)

**Data augmentation** (target: 2,000 total training pairs):

1. **Paraphrase expansion** (800 pairs): For each of the 100 training sentences, generate 8 paraphrases using GPT-4o (e.g., "I feel good" → "I'm feeling great" / "I am doing well" / "Things feel good to me"). All paraphrases share the same USEL target.

2. **Compositional generation** (600 pairs): Programmatically compose random USEL prime sequences of length 2–7 following the grammar rules in §3.4, then use GPT-4o to generate 3 English sentences per USEL expression. This creates USEL→NL pairs, which are reversed for NL→USEL training.

3. **Molecule expansion** (500 pairs): Use the 10 molecules from the David Bullock Q2 response (WATER, FIRE, TREE, SUN, RAIN, HAND, EYE, HEART, LOVE, FEAR) plus 40 additional molecules. Generate sentences using each molecule in context, with USEL translations.

**Total training data: ~2,000 NL↔USEL pairs.**

#### Models

| Model | Role | Configuration |
|-------|------|---------------|
| **GPT-4o (zero-shot)** | Baseline | System prompt containing full USEL spec (grid, piece types, grammar BNF, 10 worked examples). No training data. |
| **GPT-4o-mini (few-shot)** | Improved baseline | Same system prompt + 20 in-context examples drawn from training set. |
| **LLaMA 3.1 8B (fine-tuned)** | Primary model | QLoRA fine-tuning on the 2,000-pair dataset. 4-bit quantization runs on M4 Max (64GB unified memory). |
| **Qwen 2.5 7B (fine-tuned)** | Comparison | Same QLoRA setup, to test whether compilation generalizes across base model architectures. |

#### Fine-Tuning Protocol (LLaMA 3.1 8B)

```
Framework:       Unsloth (optimized for Apple Silicon)
Quantization:    4-bit QLoRA (fits in 16GB VRAM equivalent)
LoRA rank:       16
LoRA alpha:      32
Learning rate:   2e-4
Batch size:      4 (gradient accumulation: 8 → effective 32)
Epochs:          5 (with early stopping on val loss)
Prompt template: "Compile the following English sentence into USEL bracket notation.\n\nEnglish: {sentence}\nUSEL:"
Hardware:        M4 Max MacBook Pro, 64GB unified memory
Estimated time:  ~2 hours for full training run
```

#### Evaluation Metrics

1. **Exact Match (EM):** Percentage of test sentences where the predicted USEL expression is character-for-character identical to the gold standard.

2. **Prime Sequence F1 (USEL-F1):** Analogous to Smatch F1 for AMR. Extracts the ordered set of primes from predicted and gold USEL expressions, then computes precision/recall/F1 on the prime multisets.

   ```
   Gold:      [I][WANT][SEE][SOMETHING][BIG]
   Predicted: [I][WANT][SEE][SOMETHING]
   Precision: 4/4 = 1.0  (all predicted primes are correct)
   Recall:    4/5 = 0.8  (missed BIG)
   F1:        0.89
   ```

3. **Structural Match (SM):** Binary score per sentence — does the predicted expression use the correct structural operators (`.`, `x`, `→`, brackets) in the correct positions?

4. **Semantic Equivalence (SE):** For non-exact matches, have GPT-4o judge whether the predicted and gold USEL expressions encode the same meaning (1 = equivalent, 0.5 = partial, 0 = different). This catches cases where a valid alternative USEL encoding exists.

#### Procedure

```
Step 1:  Construct the 2,000-pair dataset (augmentation pipeline)
Step 2:  Split into train/val/test
Step 3:  Run zero-shot GPT-4o on the 30 test sentences
Step 4:  Run few-shot GPT-4o-mini on the 30 test sentences
Step 5:  Fine-tune LLaMA 3.1 8B using Unsloth/QLoRA
Step 6:  Fine-tune Qwen 2.5 7B using same setup
Step 7:  Run both fine-tuned models on the 30 test sentences
Step 8:  Compute EM, USEL-F1, SM, SE for all 4 models
Step 9:  Error analysis: categorize failures by type
         (wrong prime, missing prime, extra prime, wrong operator,
          wrong molecule encoding, grammar violation)
Step 10: Statistical significance testing (McNemar's test for EM)
```

### 1.3 Required Resources

| Resource | Specifics | Cost Estimate |
|----------|-----------|---------------|
| Compute | M4 Max MacBook Pro (already owned) | $0 |
| OpenAI API | GPT-4o for augmentation + evaluation (~500K tokens) | ~$15 |
| Unsloth | Open source, runs on Apple Silicon via MLX | $0 |
| Time | ~1 day for dataset construction, ~2 hours fine-tuning, ~2 hours evaluation | ~1.5 days total |

### 1.4 Expected Results

| Model | Expected EM | Expected USEL-F1 | Rationale |
|-------|-------------|-------------------|-----------|
| GPT-4o (zero-shot) | 20–35% | 55–65% | Understands the spec but makes systematic encoding errors |
| GPT-4o-mini (few-shot) | 35–50% | 65–75% | In-context examples calibrate output format |
| LLaMA 3.1 8B (fine-tuned) | 55–70% | 80–90% | Small output vocabulary makes the task tractable |
| Qwen 2.5 7B (fine-tuned) | 50–65% | 78–88% | Similar capacity, slightly different tokenizer effects |

**Error pattern prediction:** Most errors will be (a) choosing a semantically adjacent prime (e.g., [KNOW] vs. [THINK]), (b) incorrect molecule decomposition (open-class, not memorizable), and (c) structural operator misplacement. Few errors will involve completely wrong semantic domains.

### 1.5 What This Proves

- **If USEL-F1 ≥ 0.80:** USEL is a viable NL compilation target — comparable or superior to AMR parsing, with a dramatically simpler output space.
- **If zero-shot F1 ≥ 0.50:** The USEL spec is self-documenting enough that a general-purpose LLM can compile to it without training data.
- **If fine-tuned > zero-shot by ≥20 F1 points:** Specialized USEL compilers are worth building.
- **For the paper:** Provides the first empirical evidence that the NL→USEL compilation pipeline proposed in §5.9 is feasible.

### 1.6 Practical Steps for Kit

```bash
# Step 1: Install dependencies
pip install unsloth transformers datasets peft openai

# Step 2: Prepare dataset
python scripts/prepare_usel_dataset.py \
  --input 150_SENTENCES_USEL_TRANSLATION.md \
  --augment \
  --output data/usel_train.jsonl

# Step 3: Run zero-shot baseline
python scripts/eval_zero_shot.py \
  --model gpt-4o \
  --test data/usel_test.jsonl \
  --system-prompt prompts/usel_spec.txt

# Step 4: Fine-tune
python scripts/finetune_usel.py \
  --base-model meta-llama/Llama-3.1-8B-Instruct \
  --train data/usel_train.jsonl \
  --val data/usel_val.jsonl \
  --output models/usel-compiler-v1

# Step 5: Evaluate
python scripts/eval_usel_compiler.py \
  --model models/usel-compiler-v1 \
  --test data/usel_test.jsonl \
  --metrics em,f1,sm,se
```

---

---

## Experiment 2: Cross-Language Semantic Equivalence

### 2.1 Hypothesis

**H2:** USEL expressions decompiled into multiple natural languages preserve semantic equivalence more consistently than direct NL→NL machine translation, because USEL decompilation expands universal primes into each target language independently (no source-language interference), while NL→NL translation propagates source-language bias.

**H2a (secondary):** Cross-language semantic equivalence scores for USEL decompilation will show lower variance across language pairs than NL→NL translation, because every decompilation starts from the same unambiguous USEL representation.

### 2.2 Methodology

#### Stimulus Construction

Select 50 USEL expressions from three categories:

| Category | Count | Source | Complexity |
|----------|-------|--------|------------|
| Clean prime-only sentences | 20 | ✅-rated sentences from the 150 | 3–6 primes |
| Structural/molecule sentences | 15 | ⚠️-rated sentences from the 150 | 4–8 primes, 1–2 molecules |
| Novel compositions | 15 | New sentences composed for this experiment | 3–7 primes, 0–2 molecules |

#### Target Languages

| Language | Family | Script | Rationale |
|----------|--------|--------|-----------|
| English | Indo-European (Germanic) | Latin | Source/control language |
| Spanish | Indo-European (Romance) | Latin | High-resource, related to English |
| Japanese | Japonic | Mixed (kanji/hiragana/katakana) | Typologically distant, SOV word order |
| Arabic | Afroasiatic (Semitic) | Arabic | RTL script, VSO tendencies, rich morphology |

These four languages maximize typological diversity while remaining assessable — all have strong NSM literature confirming prime exponents exist.

#### Pipeline

**Condition A: USEL decompilation (experimental)**

```
USEL expression → GPT-4o prompt: "Decompile this USEL expression
into a natural {language} sentence. Each bracket contains an NSM
semantic prime. Produce a fluent sentence that preserves all and
only the meaning encoded in the primes."
→ Output: one sentence per language
```

**Condition B: NL→NL translation (baseline)**

```
English sentence → GPT-4o prompt: "Translate this English sentence
into natural {language}. Preserve the meaning as precisely as
possible."
→ Output: one sentence per language
```

Each USEL expression thus produces 8 sentences: 4 from USEL decompilation (one per language) and 4 from NL→NL translation (English → Spanish/Japanese/Arabic + English itself).

#### Evaluation

**Automated (primary — runnable immediately):**

Use GPT-4o as a semantic judge. For every pair of languages (6 pairs: EN-ES, EN-JA, EN-AR, ES-JA, ES-AR, JA-AR), present the two sentences and ask:

```
Rate the semantic equivalence of these two sentences on a 1-5 scale:
1 = Completely different meanings
2 = Related topic but different claims
3 = Same general meaning, some information lost or added
4 = Same meaning with minor nuance differences
5 = Semantically identical

Sentence A ({language_1}): {sentence_1}
Sentence B ({language_2}): {sentence_2}

Respond with only the number and a one-sentence justification.
```

**Compute per-pair and overall means for both conditions (USEL decompilation vs. NL→NL translation).**

**Human validation (follow-up — requires participants):**

Recruit 4 bilingual raters (one per language pair involving English) via Prolific or academic contacts:
- EN-ES bilingual (1 rater, 50 pairs)
- EN-JA bilingual (1 rater, 50 pairs)
- EN-AR bilingual (1 rater, 50 pairs)
- ES-JA or ES-AR bilingual (1 rater, 50 pairs — if findable)

Each rater evaluates 50 sentence pairs on the same 1–5 Likert scale. Compute correlation between GPT-4o judge scores and human scores to validate the automated metric.

#### Statistical Analysis

- Paired t-test (or Wilcoxon signed-rank if non-normal) comparing mean equivalence scores: Condition A (USEL) vs. Condition B (NL→NL), across all language pairs.
- Levene's test for equality of variances: does USEL produce more consistent cross-language equivalence?
- Breakdown by sentence complexity (prime-only vs. molecule-containing).
- Inter-rater reliability (Krippendorff's α) between GPT-4o and human judges.

### 2.3 Required Resources

| Resource | Specifics | Cost Estimate |
|----------|-----------|---------------|
| OpenAI API | GPT-4o for decompilation, translation, and judging (~1M tokens) | ~$25 |
| Human raters | 3–4 bilingual raters via Prolific, ~1 hour each | ~$80–120 |
| Time | Automated pipeline: ~4 hours; human validation: ~1 week (async) | ~1 week total |

### 2.4 Expected Results

| Metric | USEL Decompilation | NL→NL Translation |
|--------|--------------------|--------------------|
| Mean equivalence (all pairs) | 4.0–4.5 / 5.0 | 3.5–4.0 / 5.0 |
| Variance across pairs | Low (σ ≈ 0.3–0.5) | Higher (σ ≈ 0.5–0.8) |
| Worst-performing pair | EN-JA or EN-AR: 3.8 | EN-JA: 3.2 |
| Best-performing pair | EN-ES: 4.6 | EN-ES: 4.2 |

**Prediction:** The advantage of USEL decompilation will be largest for typologically distant language pairs (EN-JA, EN-AR, ES-JA) where source-language structural interference is strongest in NL→NL translation. For related pairs (EN-ES), the advantage will be smaller but still present.

**Failure mode:** If NL→NL translation matches or exceeds USEL decompilation, this means current MT is already good enough that the USEL pivot doesn't add value for high-resource language pairs. This would narrow USEL's translation claim to low-resource languages — still valuable but more limited.

### 2.5 What This Proves

- **If USEL > NL→NL by ≥0.5 points on average:** USEL functions as a viable interlingua, particularly for distant language pairs.
- **If USEL variance < NL→NL variance:** USEL provides more *predictable* cross-language semantics — critical for safety-critical applications.
- **If human judges correlate with GPT-4o (r ≥ 0.7):** The automated evaluation pipeline is trustworthy for larger-scale future studies.
- **For the paper:** Provides the first empirical test of the cross-language translation claim (§5.2).

### 2.6 Practical Steps for Kit

```bash
# Step 1: Select 50 USEL expressions and prepare stimuli
python scripts/prepare_crosslang_stimuli.py \
  --input 150_SENTENCES_USEL_TRANSLATION.md \
  --n 50 \
  --output data/crosslang_stimuli.json

# Step 2: Generate USEL decompilations (4 languages × 50 = 200 sentences)
python scripts/usel_decompile.py \
  --stimuli data/crosslang_stimuli.json \
  --languages en,es,ja,ar \
  --model gpt-4o \
  --output data/usel_decompiled.json

# Step 3: Generate NL→NL translations (3 targets × 50 = 150 sentences)
python scripts/nl_translate.py \
  --stimuli data/crosslang_stimuli.json \
  --source en \
  --targets es,ja,ar \
  --model gpt-4o \
  --output data/nl_translated.json

# Step 4: Run GPT-4o semantic equivalence judging
python scripts/judge_equivalence.py \
  --usel data/usel_decompiled.json \
  --nlnl data/nl_translated.json \
  --model gpt-4o \
  --output results/crosslang_equivalence.json

# Step 5: Analyze results
python scripts/analyze_crosslang.py \
  --input results/crosslang_equivalence.json \
  --output results/crosslang_report.md
```

---

---

## Experiment 3: Comprehension Study (David Bullock's Q2)

### 3.1 Hypothesis

**H3:** After 30 minutes of training on the 65 semantic primes and decomposition logic, untrained adults will achieve ≥60% accuracy on a multiple-choice USEL molecule comprehension task, significantly above the 16.7% chance rate (6-choice format) and significantly above untrained performance.

**H3a:** Children aged 8–12 will show learning gains comparable to adults, consistent with NSM's claim that semantic primes are cognitively fundamental.

**H3b:** Comprehension accuracy decreases with molecule complexity (more primes = harder to decode), following a predictable complexity gradient.

### 3.2 Methodology

*Note: This experiment extends the study design from the David Bullock Q2 response. We reproduce the full protocol here with additional operational detail.*

#### Participants

| Group | N | Age | Condition |
|-------|---|-----|-----------|
| A: Children | 20 | 8–12 | Pre-test → filler task → post-test |
| B: Adults, untrained | 20 | 18–65 | Pre-test → filler task → post-test |
| C: Adults, trained | 20 | 18–65 | Pre-test → 30-min USEL primer → post-test |

**Total: 60 participants (minimum 50 for 0.80 power at α = 0.05, medium effect d = 0.5).**

**Recruitment:** Prolific (adults), local school partnership or university family research pool (children). Minimum 3 native-language backgrounds across the full sample.

#### Materials

**Stimulus set: 30 USEL molecules**, stratified by complexity:

| Complexity | Primes | N | Examples |
|------------|--------|---|----------|
| Simple | 3–4 | 10 | EYE `[BODY][PART][SEE]`, HAND `[BODY][PART][TOUCH][DO]`, MOON `[SOMETHING][SMALL][FAR][ABOVE]` |
| Medium | 4–5 | 10 | WATER `[SOMETHING][MOVE][BELOW][TOUCH]`, FIRE `[SOMETHING][MOVE][VERY][BIG][BAD][TOUCH]`, TREE `[SOMETHING][LIVE][BIG][PART][ABOVE][BELOW]`, FRIEND `[SOMEONE][FEEL][GOOD][NEAR]` |
| Complex | 6+ | 10 | LOVE `[FEEL][VERY][GOOD][WANT][NEAR][SOMEONE]`, FEAR `[FEEL][BAD][THINK][SOMETHING][BAD][CAN][HAPPEN]`, RAIN `[WATER][MOVE][ABOVE][BELOW]` |

**Presentation format:** Each molecule shown three ways simultaneously:
1. Bracket notation: `[BODY][PART][SEE]`
2. Color-coded tile layout (using the category colors from Q3)
3. Prime labels in plain English: "BODY + PART + SEE"

**Response format:** 6-choice multiple choice with 1 correct answer and 5 foils. Foils are semantically plausible (same domain) but incorrect:
- EYE: correct = "Eye" | foils: "Ear," "Hand," "Mouth," "Nose," "Skin"
- WATER: correct = "Water" | foils: "Wind," "Stone," "Fire," "Blood," "Ice"

#### Training Protocol (Group C only, 30 minutes)

```
Minutes  0–5:   Introduction to semantic primes concept
                "Every language has ~65 basic building-block meanings"
Minutes  5–15:  Interactive grid tour — show all 65 primes with examples
                Participant places 10 primes on the semantic chessboard
Minutes 15–20:  Decomposition logic — 3 worked examples:
                "How would you describe WATER using only basic concepts?"
                Walk through: SOMETHING + MOVE + BELOW + TOUCH
Minutes 20–25:  Guided practice — participant decomposes 3 concepts:
                "Describe FIRE / SUN / HEART using primes"
Minutes 25–30:  Review + questions
```

Groups A and B complete a 30-minute filler task (word puzzles, tangram puzzles — matched for cognitive engagement but unrelated to USEL).

#### Procedure

```
Phase 1 (Pre-test, all groups):
  - Present 15 randomly selected molecules (5 simple, 5 medium, 5 complex)
  - 6-choice multiple-choice per molecule
  - Record: accuracy, response time (ms), confidence (1–5 Likert)

Phase 2 (Intervention):
  - Group C: 30-minute USEL training
  - Groups A & B: 30-minute filler task

Phase 3 (Post-test, all groups):
  - Present the remaining 15 molecules (counterbalanced)
  - Same format as Phase 1

Phase 4 (Generalization, all groups):
  - Present 5 novel molecules not seen in any phase
  - Free-response: "Write what you think this means"
  - Scored by 2 independent raters (0–3 scale):
    0 = wrong, 1 = related domain, 2 = close, 3 = correct
```

#### Outcome Measures

| Measure | Type | Analysis |
|---------|------|----------|
| Accuracy (% correct) | Primary | Mixed ANOVA: Group × Time × Complexity |
| Response time (ms) | Secondary | Same ANOVA structure |
| Confidence rating | Secondary | Correlation with accuracy |
| Generalization score (0–3) | Exploratory | One-way ANOVA across groups |
| Inter-rater reliability | Quality check | Cohen's κ for free-response scoring |

### 3.3 Required Resources

| Resource | Specifics | Cost Estimate |
|----------|-----------|---------------|
| Participants | 60 total via Prolific + school partnership | ~$600–900 (Prolific: $12/hr × 1hr × 40 adults; children: volunteer/gift card) |
| IRB approval | Required for child participants | 4–8 weeks processing |
| Survey platform | Qualtrics, Google Forms, or custom web app | $0 (university access or free tier) |
| Stimulus preparation | Tile mockups, training materials | ~1 week design time |
| Analysis | R or Python (scipy, statsmodels) | $0 |

### 3.4 Expected Results

| Group | Pre-test accuracy | Post-test accuracy | Effect |
|-------|-------------------|--------------------|--------|
| A: Children | 20–25% | 25–30% (no training) | Minimal test-retest gain |
| B: Adults, untrained | 25–30% | 28–33% (no training) | Minimal test-retest gain |
| C: Adults, trained | 25–30% | 60–75% | Large training effect (d ≈ 1.5) |

**Complexity gradient (Group C post-test):**
- Simple (3–4 primes): 75–85%
- Medium (4–5 primes): 55–70%
- Complex (6+ primes): 40–55%

**Generalization (Group C):** Mean score 1.8–2.2 / 3.0 (above "related domain," approaching "close to correct").

### 3.5 What This Proves

- **If H3 confirmed (post-training ≥ 60%):** USEL molecules are learnable in a single 30-minute session — comparable to or faster than learning Blissymbolics, validating the compositional transparency claim.
- **If H3a confirmed (children ≈ adults):** Semantic primes are developmentally fundamental, consistent with NSM theory, and USEL has genuine AAC/educational potential.
- **If H3b confirmed (complexity gradient):** Establishes a principled basis for molecule design — keep decompositions short for maximum transparency.
- **For the paper:** Directly addresses David Bullock's Q2 and provides the empirical data currently acknowledged as missing in §6.1.

### 3.6 Practical Steps for Kit

**Phase 1 — Paper proposal (immediate):**
Include the study design in the USEL v2 paper (§6 or Appendix) as a "proposed experiment." This is common in CS papers — proposing the study demonstrates methodological rigor even before execution.

**Phase 2 — Pilot (2–4 weeks):**
Run a small pilot (N=10 adults, no children — no IRB needed for adults on Prolific) to validate the stimuli, calibrate the training protocol, and estimate effect sizes.

```bash
# Build the survey
python scripts/build_comprehension_survey.py \
  --molecules data/usel_molecules_30.json \
  --foils data/molecule_foils.json \
  --output survey/comprehension_study.html

# Pilot on Prolific
# Upload survey/comprehension_study.html
# Recruit 10 adults, ~30 min each, $6/participant
# Total pilot cost: ~$60
```

**Phase 3 — Full study (2–3 months after IRB):**
Submit IRB application for the child cohort, recruit via Prolific (adults) and local schools (children), run full N=60.

---

---

## Experiment 4: Compression Ratio Analysis

### 4.1 Hypothesis

**H4:** USEL bracket notation achieves a mean compression ratio of ≥1.5× over English for sentences expressible with semantic primes, and ≥1.2× over AMR for the same sentences — while maintaining zero ambiguity, unlike English.

**H4a (secondary):** Compression ratio increases with sentence complexity (longer English sentences compress more because USEL eliminates more syntactic overhead).

**H4b (secondary):** USEL achieves higher *semantic density* (meaning-bearing tokens per total tokens) than English, AMR, and JSON representations.

### 4.2 Methodology

#### Corpus Construction

Select 100 English sentences from four genres, 25 per genre:

| Genre | Source | Examples |
|-------|--------|---------|
| Conversational | NSM canonical sentences + paraphrases | "I don't want this to happen." |
| News/factual | Headlines from BBC/Reuters (simplified) | "Many people left this place." |
| Technical | Datacenter incident descriptions | "Server disk is showing errors now." |
| Emotive/literary | Simplified literary sentences | "She felt something very bad." |

**Constraint:** All 100 sentences must be expressible in USEL using only primes + molecules from the existing inventory. Sentences requiring ad-hoc molecule invention are excluded — this tests USEL's *current* vocabulary, not its theoretical extensibility.

#### Representations

For each sentence, produce five representations:

| Format | Description | Example for "I want to see something big" |
|--------|-------------|---------------------------------------------|
| **English** | Original natural language | `I want to see something big` (30 chars, 7 tokens) |
| **USEL (bracket)** | USEL bracket notation | `[I][WANT][SEE][SOMETHING][BIG]` (31 chars, 5 semantic units) |
| **USEL (chess)** | USEL chess notation | `Ka8.Ng6.Ba5.Rd8.Pc6` (20 chars, 5 semantic units) |
| **AMR** | Abstract Meaning Representation graph | `(w / want-01 :ARG0 (i / i) :ARG1 (s / see-01 :ARG0 i :ARG1 (t / thing :ARG1-of (b / big))))` (88 chars) |
| **JSON** | Structured semantic JSON | `{"agent":"I","action":"want","sub_action":"see","object":"something","modifier":"big"}` (84 chars) |

**AMR generation:** Use an AMR parser (amrlib, Python) for the 100 English sentences, with manual correction of parser errors.

**JSON generation:** Manually construct JSON representations following a consistent schema (agent/action/object/modifier pattern).

#### Metrics

| Metric | Formula | Measures |
|--------|---------|----------|
| **Character compression** | len(English) / len(USEL) | Raw symbol count reduction |
| **Token compression** | tokens(English) / semantic_units(USEL) | Meaningful-unit reduction |
| **Semantic density** | semantic_units / total_tokens | Proportion of meaning-bearing content |
| **Ambiguity index** | ambiguous_readings / 1 | Number of valid interpretations (English ≥ 1; USEL = 1 by design) |
| **Parse complexity** | grammar_rules_to_parse | Formal complexity of interpretation |

#### Ambiguity Measurement

For each English sentence, use GPT-4o to enumerate distinct valid interpretations:

```
Prompt: "List ALL distinct meanings this English sentence could have,
including uncommon or context-dependent readings. Be exhaustive."

Sentence: "I saw her duck."
Interpretations:
1. I observed her duck (the bird)
2. I observed her duck (the action of ducking)
3. I used a saw on her duck
→ Ambiguity index = 3
```

For each USEL expression: ambiguity index = 1 by design (but verify by checking whether the prime sequence has only one valid parse under the BNF grammar).

### 4.3 Required Resources

| Resource | Specifics | Cost Estimate |
|----------|-----------|---------------|
| Compute | M4 Max MacBook Pro | $0 |
| AMR parser | amrlib (open source) | $0 |
| OpenAI API | GPT-4o for ambiguity enumeration (~200K tokens) | ~$5 |
| Manual work | JSON construction, AMR correction (~4 hours) | Kit's time |
| Time | ~1 day total | |

### 4.4 Expected Results

| Format | Mean chars | Mean tokens | Mean semantic density | Mean ambiguity |
|--------|-----------|-------------|----------------------|----------------|
| English | 35 | 7.5 | 0.45 | 1.8 |
| USEL (bracket) | 28 | 5.2 | 0.92 | 1.0 |
| USEL (chess) | 18 | 5.2 | 0.95 | 1.0 |
| AMR | 75 | 12.3 | 0.35 | 1.0 |
| JSON | 90 | 8.1 | 0.40 | 1.0 |

**Key finding:** USEL chess notation achieves the best compression (≈2× over English, ≈4× over AMR/JSON) while maintaining zero ambiguity. USEL bracket notation is slightly longer than English in character count but has dramatically higher semantic density and zero ambiguity.

**The real metric is not compression alone — it's the compression × ambiguity reduction product.** USEL eliminates an average of 1.8 readings per sentence while maintaining comparable length.

### 4.5 What This Proves

- **If USEL chess ≥ 1.5× compression over English:** The chess-notation format provides genuine efficiency gains for machine communication.
- **If USEL semantic density ≥ 0.90:** Nearly every symbol in USEL carries meaning (vs. ~45% in English, where function words, articles, and inflections are semantically empty).
- **If USEL ≥ 2× compression over AMR/JSON:** USEL is more compact than existing formal representations while being human-readable.
- **For the paper:** Provides rigorous data for the compression claims in §4.2, with proper baselines against AMR and JSON.

### 4.6 Practical Steps for Kit

```bash
# Step 1: Prepare the 100-sentence corpus
python scripts/prepare_compression_corpus.py \
  --nsm 150_SENTENCES_USEL_TRANSLATION.md \
  --genres conversational,news,technical,emotive \
  --output data/compression_corpus.json

# Step 2: Generate USEL translations (bracket and chess)
python scripts/compile_to_usel.py \
  --input data/compression_corpus.json \
  --output data/usel_compiled.json

# Step 3: Generate AMR parses
python scripts/parse_to_amr.py \
  --input data/compression_corpus.json \
  --output data/amr_parsed.json

# Step 4: Generate JSON representations
python scripts/convert_to_json.py \
  --input data/compression_corpus.json \
  --output data/json_converted.json

# Step 5: Measure ambiguity
python scripts/measure_ambiguity.py \
  --input data/compression_corpus.json \
  --model gpt-4o \
  --output data/ambiguity_scores.json

# Step 6: Compute all metrics and generate tables/figures
python scripts/analyze_compression.py \
  --english data/compression_corpus.json \
  --usel data/usel_compiled.json \
  --amr data/amr_parsed.json \
  --json data/json_converted.json \
  --ambiguity data/ambiguity_scores.json \
  --output results/compression_analysis.md
```

---

---

## Experiment 5: Datacenter Incident Correlation

### 5.1 Hypothesis

**H5:** USEL-compiled incident tickets enable ≥90% cross-language incident correlation accuracy via exact semantic matching, compared to ≤70% for embedding-based NL correlation on the same multilingual ticket set — because USEL eliminates the linguistic surface variation that degrades embedding similarity for typologically distant languages.

**H5a (secondary):** Correlation accuracy for NL embeddings degrades as language distance increases (EN-ES > EN-DE > EN-JA > EN-PT), while USEL correlation remains constant across all language pairs.

### 5.2 Methodology

#### Synthetic Incident Generation

Generate 100 incident tickets describing 20 unique incidents, with 5 linguistically independent descriptions per incident across 5 languages:

**The 20 incident types (covering common datacenter failures):**

| # | Incident | Severity | Domain |
|---|----------|----------|--------|
| 1 | Server disk failure | High | Storage |
| 2 | Network switch reboot | Medium | Network |
| 3 | Memory ECC errors | Medium | Compute |
| 4 | Power supply failure | High | Power |
| 5 | Temperature alarm in hot aisle | Medium | Thermal |
| 6 | Firmware update required | Low | Maintenance |
| 7 | VM migration completed | Info | Compute |
| 8 | Fiber optic link degradation | Medium | Network |
| 9 | UPS battery replacement needed | Medium | Power |
| 10 | Rack capacity at 90% | Low | Capacity |
| 11 | DNS resolution failure | High | Network |
| 12 | Kernel panic on host | High | Compute |
| 13 | HVAC unit malfunction | Medium | Thermal |
| 14 | SSD wear level critical | High | Storage |
| 15 | BGP route flap detected | Medium | Network |
| 16 | PDU phase imbalance | Low | Power |
| 17 | Backup job failed | Medium | Storage |
| 18 | Certificate expiration warning | Low | Security |
| 19 | CPU throttling due to thermal | High | Compute/Thermal |
| 20 | Physical security door alarm | Low | Facility |

**Languages:** English, Japanese, Spanish, Portuguese, German.

**Generation process:** For each incident, prompt GPT-4o with:

```
You are a datacenter technician writing an incident ticket in {language}.
Describe this incident naturally, as a real technician would:

Incident: {description}

Write 2-3 sentences. Use natural phrasing for {language} — do NOT
translate from English. Write as a native {language}-speaking technician
would write from scratch. Include typical datacenter jargon in {language}.
```

This produces 100 tickets (20 incidents × 5 languages), where each set of 5 describes the same underlying event but in linguistically independent natural language.

#### USEL Compilation

Compile all 100 tickets to USEL using GPT-4o with the USEL spec in the system prompt:

```
Compile this datacenter incident ticket into USEL bracket notation.
Use only NSM semantic primes and molecule variables for technical terms.
Technical terms (server, disk, network, etc.) should be expressed as
[SOMETHING:term] molecule variables.

Ticket ({language}): {ticket_text}
USEL:
```

#### Correlation Methods

**Method A: USEL exact match**
1. Compile all 100 tickets to USEL
2. Normalize USEL expressions (sort molecule variables alphabetically, standardize whitespace)
3. For each ticket, find all other tickets with the highest USEL string similarity (Levenshtein distance on normalized USEL)
4. Declare a match when normalized edit distance < threshold (tuned on a held-out set of 4 incidents)

**Method B: USEL embedding match**
1. Compile all 100 tickets to USEL
2. Embed the USEL strings using text-embedding-3-small
3. For each ticket, find the nearest neighbors by cosine similarity
4. Declare a match when cosine similarity > threshold

**Method C: NL embedding match (baseline)**
1. Embed the raw natural-language tickets using text-embedding-3-small
2. For each ticket, find the nearest neighbors by cosine similarity
3. Declare a match when cosine similarity > threshold

**Method D: NL embedding match with multilingual model (strong baseline)**
1. Embed the raw tickets using a multilingual model (multilingual-e5-large or Cohere embed-multilingual-v3.0)
2. Same nearest-neighbor matching as Method C

#### Evaluation Metrics

For each method, evaluate as a retrieval task:

- **Precision@4:** For each ticket, are the top-4 nearest neighbors all from the same incident? (Each ticket has exactly 4 correct matches — the other 4 language versions.)
- **Recall@4:** Of the 4 correct matches, how many appear in the top-4 retrieved results?
- **F1@4:** Harmonic mean of Precision@4 and Recall@4.
- **Mean Reciprocal Rank (MRR):** Average of 1/rank for the first correct match.
- **Cross-language breakdown:** Compute F1 separately for each language pair to test H5a.

### 5.3 Required Resources

| Resource | Specifics | Cost Estimate |
|----------|-----------|---------------|
| OpenAI API | GPT-4o for ticket generation + USEL compilation (~300K tokens) | ~$10 |
| OpenAI API | text-embedding-3-small for 200 embeddings | ~$0.05 |
| Multilingual embeddings | Cohere embed-multilingual-v3.0 or local multilingual-e5-large | ~$0 (local) or ~$2 (API) |
| Compute | M4 Max MacBook Pro | $0 |
| Time | ~1 day total | |

### 5.4 Expected Results

| Method | Expected F1@4 | Expected MRR | Notes |
|--------|---------------|--------------|-------|
| A: USEL exact match | 85–95% | 0.90–0.98 | Depends on compilation consistency |
| B: USEL embedding | 90–97% | 0.93–0.99 | Embeddings smooth over minor compilation variation |
| C: NL embedding (English-only model) | 50–65% | 0.55–0.70 | Degrades badly for JA, AR |
| D: NL embedding (multilingual) | 65–80% | 0.70–0.85 | Better but still affected by surface-level variation |

**Cross-language breakdown (F1@4 for NL embedding baseline):**

| Pair | NL Embedding | USEL | Gap |
|------|-------------|------|-----|
| EN-ES | 0.80 | 0.95 | +0.15 |
| EN-DE | 0.75 | 0.95 | +0.20 |
| EN-PT | 0.78 | 0.95 | +0.17 |
| EN-JA | 0.45 | 0.95 | +0.50 |
| ES-PT | 0.85 | 0.95 | +0.10 |
| DE-JA | 0.35 | 0.95 | +0.60 |

**The headline result:** USEL provides near-constant correlation accuracy regardless of language pair, while NL embeddings degrade dramatically for distant language pairs (DE-JA: 35% vs. USEL: 95%).

### 5.5 What This Proves

- **If USEL ≥ 90% F1@4:** USEL functions as a practical semantic normalization layer for multilingual incident correlation.
- **If USEL constant across pairs while NL degrades:** The language-independence claim is empirically validated for a real-world operational task.
- **If USEL > best NL baseline by ≥15 F1 points:** USEL adds meaningful value beyond what current multilingual embeddings provide.
- **For the paper:** Directly validates the datacenter application claims in §5.7 with quantitative evidence.

### 5.6 Practical Steps for Kit

```bash
# Step 1: Generate synthetic incident tickets
python scripts/generate_incidents.py \
  --incidents 20 \
  --languages en,ja,es,pt,de \
  --model gpt-4o \
  --output data/incident_tickets.json

# Step 2: Compile all tickets to USEL
python scripts/compile_incidents_to_usel.py \
  --input data/incident_tickets.json \
  --model gpt-4o \
  --output data/incident_usel.json

# Step 3: Compute embeddings
python scripts/embed_incidents.py \
  --nl data/incident_tickets.json \
  --usel data/incident_usel.json \
  --models text-embedding-3-small,multilingual-e5-large \
  --output data/incident_embeddings.npz

# Step 4: Run correlation experiment
python scripts/correlate_incidents.py \
  --embeddings data/incident_embeddings.npz \
  --usel data/incident_usel.json \
  --ground-truth data/incident_tickets.json \
  --output results/incident_correlation.json

# Step 5: Generate analysis and figures
python scripts/analyze_incidents.py \
  --input results/incident_correlation.json \
  --output results/incident_report.md \
  --figures results/figures/
```

---

---

## Experiment 6: AI Agent Command Execution

### 6.1 Hypothesis

**H6:** An AI agent executing commands via a NL→USEL→execution pipeline achieves ≥90% command accuracy, compared to ≤80% for direct NL→execution, because the intermediate USEL representation forces semantic disambiguation before execution — catching ambiguities that direct NL parsing would resolve incorrectly or inconsistently.

**H6a (secondary):** The accuracy advantage of USEL is largest for ambiguous commands (those with ≥2 valid NL interpretations) — precisely the cases where USEL's disambiguation is most valuable.

### 6.2 Methodology

#### Smart Home Simulator

Build a minimal smart home simulator in Python with 4 device types and deterministic state:

```python
class SmartHome:
    """Deterministic smart home with 4 device types."""
    
    devices = {
        "lights": {
            "living_room": {"on": False, "brightness": 50, "color": "white"},
            "bedroom": {"on": False, "brightness": 50, "color": "white"},
            "kitchen": {"on": True, "brightness": 100, "color": "white"},
        },
        "music": {
            "speaker": {"playing": False, "volume": 30, "genre": None},
        },
        "temperature": {
            "thermostat": {"target": 72, "mode": "auto", "current": 74},
        },
        "doors": {
            "front": {"locked": True},
            "back": {"locked": True},
            "garage": {"locked": False, "open": False},
        },
    }
```

**Actions available (12 total):**

| # | Action | USEL Pattern | Python Function |
|---|--------|-------------|-----------------|
| 1 | Turn on light | `[SOMETHING:light_X][LIVE]` | `set_light(room, on=True)` |
| 2 | Turn off light | `[SOMETHING:light_X][DIE]` | `set_light(room, on=False)` |
| 3 | Set brightness | `[SOMETHING:light_X][BIG/SMALL][MORE]` | `set_brightness(room, level)` |
| 4 | Change light color | `[SOMETHING:light_X][OTHER][KIND]` | `set_color(room, color)` |
| 5 | Play music | `[SOMETHING:music][LIVE]` | `play_music(genre)` |
| 6 | Stop music | `[SOMETHING:music][DIE]` | `stop_music()` |
| 7 | Set volume | `[SOMETHING:music][BIG/SMALL]` | `set_volume(level)` |
| 8 | Set temperature | `[SOMETHING:temperature][VALUE]` | `set_temp(degrees)` |
| 9 | Lock door | `[SOMETHING:door_X][NOT][CAN][MOVE]` | `lock_door(door)` |
| 10 | Unlock door | `[SOMETHING:door_X][CAN][MOVE]` | `unlock_door(door)` |
| 11 | Open garage | `[SOMETHING:garage][MOVE][ABOVE]` | `open_garage()` |
| 12 | Close garage | `[SOMETHING:garage][MOVE][BELOW]` | `close_garage()` |

#### Command Set (50 commands)

Construct 50 natural language commands across 3 difficulty levels:

| Difficulty | N | Description | Example |
|------------|---|-------------|---------|
| **Clear** | 20 | Unambiguous single-action commands | "Turn on the living room light" |
| **Ambiguous** | 15 | Commands with ≥2 valid interpretations | "Make it brighter" (which light? how much?) |
| **Multi-step** | 15 | Commands requiring 2–3 sequential actions | "Set up movie mode" (dim lights, play music, set temp) |

**Gold-standard expected actions:** For each command, define the correct action(s) given the current simulator state. For ambiguous commands, define the "most reasonable" interpretation and document the ambiguity.

#### Execution Pipelines

**Pipeline A: NL→USEL→Execution (experimental)**

```
Step 1: NL command → GPT-4o compiles to USEL
Step 2: USEL expression → rule-based parser maps to simulator action(s)
Step 3: Execute action(s) on simulator
Step 4: Compare resulting state to expected state
```

The rule-based parser (Step 2) is a simple Python function that pattern-matches USEL expressions against the 12 action patterns. This is deterministic — all variance comes from Step 1 (compilation).

**Pipeline B: NL→Execution (baseline)**

```
Step 1: NL command → GPT-4o generates a function call (JSON tool-calling format)
Step 2: Execute function call on simulator
Step 3: Compare resulting state to expected state
```

This uses GPT-4o's native function-calling capability with the 12 actions defined as tools.

**Pipeline C: NL→USEL→Verification→Execution (enhanced experimental)**

```
Step 1: NL command → GPT-4o compiles to USEL
Step 2: USEL expression → GPT-4o decompiles back to English
Step 3: If decompiled English ≠ original intent (GPT-4o judge), flag for review
Step 4: Verified USEL → rule-based parser → execute
Step 5: Compare resulting state to expected state
```

This tests whether the round-trip (NL→USEL→NL) catches errors that direct NL→execution misses.

#### Evaluation Metrics

| Metric | Definition |
|--------|-----------|
| **Action accuracy** | Did the system execute the correct action(s)? (binary per command) |
| **Parameter accuracy** | Were the correct parameters used? (e.g., right room, right brightness level) |
| **Full accuracy** | Action + parameter both correct (strict match) |
| **Ambiguity detection rate** | For ambiguous commands: did the system identify the ambiguity? (Pipeline C only) |
| **Error type distribution** | Wrong device, wrong action, wrong parameter, hallucinated action, missed action |

#### Controls

- **Same model (GPT-4o)** for both pipelines — isolating the effect of the USEL intermediate step.
- **Same system prompt context** — both pipelines receive the same description of the smart home state.
- **Deterministic simulator** — no stochastic elements; differences are purely from the NL/USEL processing.
- **3 runs per command** — run each pipeline 3 times per command (temperature=0) to measure consistency. A perfectly deterministic pipeline should produce identical results across runs.

### 6.3 Required Resources

| Resource | Specifics | Cost Estimate |
|----------|-----------|---------------|
| Smart home simulator | ~200 lines of Python | Kit's time (~2 hours) |
| USEL parser | ~150 lines of Python (pattern matching) | Kit's time (~2 hours) |
| OpenAI API | GPT-4o for compilation + function calling (50 commands × 3 pipelines × 3 runs ≈ 450 calls, ~200K tokens) | ~$8 |
| Compute | M4 Max MacBook Pro | $0 |
| Time | ~1 day (build simulator + run experiment + analyze) | |

### 6.4 Expected Results

| Pipeline | Clear (20) | Ambiguous (15) | Multi-step (15) | Overall (50) |
|----------|-----------|----------------|-----------------|-------------|
| A: NL→USEL→Execute | 95% | 80% | 73% | 84% |
| B: NL→Execute (baseline) | 90% | 60% | 67% | 74% |
| C: NL→USEL→Verify→Execute | 95% | 87% | 80% | 88% |

**Key predictions:**
1. Clear commands: Both pipelines perform well; USEL's advantage is marginal.
2. Ambiguous commands: USEL forces disambiguation at compilation time, catching errors that direct NL→execution propagates silently. Expected +20 percentage points.
3. Multi-step commands: USEL's structured format makes multi-action decomposition more reliable. Expected +6–13 percentage points.
4. Consistency: NL→USEL→Execute produces identical results across 3 runs (USEL is deterministically parseable); NL→Execute may vary across runs for ambiguous commands.

### 6.5 What This Proves

- **If USEL pipeline ≥ NL pipeline by ≥10 points overall:** The intermediate USEL step adds measurable value for command execution accuracy.
- **If USEL advantage concentrated in ambiguous commands:** Validates the specific claim that USEL's value is in disambiguation, not general NL understanding.
- **If Pipeline C > Pipeline A:** The round-trip verification (NL→USEL→NL) catches compilation errors, demonstrating USEL's "show your work" interpretability.
- **If USEL pipeline shows 100% consistency across runs:** USEL's formal grammar makes execution deterministic — a safety property for critical systems.
- **For the paper:** Provides the first end-to-end demonstration of the NL→USEL→execution pipeline proposed in §5.1.

### 6.6 Practical Steps for Kit

```bash
# Step 1: Build the simulator
python scripts/build_smart_home.py \
  --output smart_home/simulator.py

# Step 2: Build the USEL parser (pattern matcher)
python scripts/build_usel_parser.py \
  --actions data/smart_home_actions.json \
  --output smart_home/usel_parser.py

# Step 3: Prepare the 50 commands
python scripts/prepare_commands.py \
  --clear 20 --ambiguous 15 --multistep 15 \
  --output data/smart_home_commands.json

# Step 4: Run Pipeline A (NL→USEL→Execute)
python scripts/run_pipeline_a.py \
  --commands data/smart_home_commands.json \
  --simulator smart_home/simulator.py \
  --parser smart_home/usel_parser.py \
  --model gpt-4o \
  --runs 3 \
  --output results/pipeline_a.json

# Step 5: Run Pipeline B (NL→Execute)
python scripts/run_pipeline_b.py \
  --commands data/smart_home_commands.json \
  --simulator smart_home/simulator.py \
  --model gpt-4o \
  --runs 3 \
  --output results/pipeline_b.json

# Step 6: Run Pipeline C (NL→USEL→Verify→Execute)
python scripts/run_pipeline_c.py \
  --commands data/smart_home_commands.json \
  --simulator smart_home/simulator.py \
  --parser smart_home/usel_parser.py \
  --model gpt-4o \
  --runs 3 \
  --output results/pipeline_c.json

# Step 7: Analyze and compare
python scripts/analyze_agent_experiment.py \
  --pipeline-a results/pipeline_a.json \
  --pipeline-b results/pipeline_b.json \
  --pipeline-c results/pipeline_c.json \
  --output results/agent_experiment_report.md \
  --figures results/figures/
```

---

---

## Summary: Execution Priority

### Phase 1 — Immediately Runnable (Week 1)

| Priority | Experiment | Time | Cost | Key Output |
|----------|-----------|------|------|------------|
| 🥇 1st | **Exp 4: Compression** | 1 day | $5 | Table of compression ratios + ambiguity analysis |
| 🥈 2nd | **Exp 5: Incident Correlation** | 1 day | $12 | Cross-language F1 scores + language-pair breakdown |
| 🥉 3rd | **Exp 6: Agent Execution** | 1–2 days | $8 | End-to-end accuracy comparison |

**Rationale:** These three are fully automatable on Kit's hardware and provide the strongest empirical additions to the paper.

### Phase 2 — Requires API Budget + Engineering (Week 2)

| Priority | Experiment | Time | Cost | Key Output |
|----------|-----------|------|------|------------|
| 4th | **Exp 1: Compiler Accuracy** | 2–3 days | $15 | USEL-F1 scores for 4 model configurations |
| 5th | **Exp 2: Cross-Language** (automated) | 1 day | $25 | Semantic equivalence scores with GPT-4o judge |

### Phase 3 — Paper Proposal + Future Execution (Weeks 3+)

| Priority | Experiment | Time | Cost | Key Output |
|----------|-----------|------|------|------------|
| 6th | **Exp 3: Comprehension Study** | 2–3 months | ~$700 | Proposed in paper; pilot runnable in 2 weeks |
| 7th | **Exp 2: Cross-Language** (human validation) | 1–2 weeks | ~$100 | Human judge correlation with automated scores |

### Combined Paper Contribution

If all six experiments are run (or proposed, for Exp 3), the paper adds:

1. **§7.1 Compiler Evaluation:** First NL→USEL compilation results demonstrating tractability.
2. **§7.2 Cross-Language Preservation:** First empirical test of USEL as a translation interlingua.
3. **§7.3 Human Learnability:** Proposed study design (with pilot data if time permits).
4. **§7.4 Compression Analysis:** Rigorous comparison against AMR, JSON, and raw English.
5. **§7.5 Operational Validation:** First datacenter-relevant multilingual correlation results.
6. **§7.6 Agent Pipeline Validation:** First end-to-end NL→USEL→execution demonstration.

This transforms the paper from a **language specification with theoretical claims** to a **language specification with empirical evidence** — dramatically strengthening the submission.

---

## Appendix A: Shared Infrastructure

All experiments share common infrastructure. Build these first:

### A.1 USEL Parser Library

```python
# usel/parser.py — Shared USEL parsing utilities

import re
from dataclasses import dataclass

@dataclass
class USELPrime:
    name: str           # e.g., "I", "WANT", "SEE"
    coordinate: str     # e.g., "a8", "g6", "a5"
    piece: str          # e.g., "K", "N", "B"
    category: str       # e.g., "substantive", "mental"
    molecule_var: str | None = None  # e.g., "water" in [SOMETHING:water]

PRIME_MAP = {
    "I": ("a8", "K", "substantive"),
    "YOU": ("b8", "K", "substantive"),
    "SOMEONE": ("c8", "R", "substantive"),
    "SOMETHING": ("d8", "R", "substantive"),
    "PEOPLE": ("e8", "R", "substantive"),
    "BODY": ("f8", "R", "substantive"),
    "KIND": ("g8", "N", "relational"),
    "PART": ("h8", "N", "relational"),
    # ... (full 65-prime map)
    "WANT": ("g6", "N", "mental"),
    "FEEL": ("h6", "B", "mental"),
    "SEE": ("a5", "B", "perception"),
    "DO": ("f5", "Q", "action"),
    # etc.
}

def parse_bracket(expression: str) -> list[USELPrime]:
    """Parse USEL bracket notation into a list of USELPrime objects."""
    pattern = r'\[([A-Z\s]+(?::[\w]+)?)\]'
    matches = re.findall(pattern, expression)
    primes = []
    for match in matches:
        if ':' in match:
            name, var = match.split(':', 1)
        else:
            name, var = match.strip(), None
        name = name.strip()
        if name in PRIME_MAP:
            coord, piece, cat = PRIME_MAP[name]
            primes.append(USELPrime(name, coord, piece, cat, var))
        else:
            primes.append(USELPrime(name, "?", "?", "molecule", var))
    return primes

def to_chess_notation(primes: list[USELPrime]) -> str:
    """Convert parsed primes to chess notation."""
    return ".".join(f"{p.piece}{p.coordinate}" for p in primes)

def usel_f1(gold: str, predicted: str) -> dict:
    """Compute USEL-F1 (prime sequence F1) between gold and predicted."""
    gold_primes = [p.name for p in parse_bracket(gold)]
    pred_primes = [p.name for p in parse_bracket(predicted)]
    
    gold_set = set(enumerate(gold_primes))
    pred_set = set(enumerate(pred_primes))
    
    # Multiset intersection (order-aware)
    matches = sum(1 for i, g in enumerate(gold_primes) 
                  if i < len(pred_primes) and pred_primes[i] == g)
    
    precision = matches / len(pred_primes) if pred_primes else 0
    recall = matches / len(gold_primes) if gold_primes else 0
    f1 = 2 * precision * recall / (precision + recall) if (precision + recall) > 0 else 0
    
    return {"precision": precision, "recall": recall, "f1": f1}
```

### A.2 Shared Prompts

Store all USEL system prompts in `prompts/`:

```
prompts/
├── usel_spec_full.txt          # Complete USEL spec for zero-shot compilation
├── usel_spec_compact.txt       # Abbreviated spec for few-shot (saves tokens)
├── usel_compile_prompt.txt     # NL→USEL compilation instruction
├── usel_decompile_prompt.txt   # USEL→NL decompilation instruction
├── semantic_judge_prompt.txt   # Cross-language equivalence judging
└── ambiguity_enum_prompt.txt   # English ambiguity enumeration
```

### A.3 Results Directory Structure

```
results/
├── exp1_compiler/
│   ├── zero_shot_results.json
│   ├── few_shot_results.json
│   ├── finetuned_llama_results.json
│   ├── finetuned_qwen_results.json
│   └── compiler_report.md
├── exp2_crosslang/
│   ├── usel_decompiled.json
│   ├── nl_translated.json
│   ├── equivalence_scores.json
│   └── crosslang_report.md
├── exp3_comprehension/
│   ├── study_protocol.pdf
│   ├── pilot_data.csv (if pilot run)
│   └── comprehension_report.md
├── exp4_compression/
│   ├── compression_metrics.json
│   ├── ambiguity_scores.json
│   └── compression_report.md
├── exp5_incidents/
│   ├── incident_tickets.json
│   ├── incident_usel.json
│   ├── correlation_results.json
│   └── incident_report.md
├── exp6_agent/
│   ├── pipeline_a_results.json
│   ├── pipeline_b_results.json
│   ├── pipeline_c_results.json
│   └── agent_report.md
└── figures/
    ├── compiler_accuracy_bar.png
    ├── crosslang_heatmap.png
    ├── compression_comparison.png
    ├── incident_correlation_by_pair.png
    └── agent_accuracy_by_difficulty.png
```

---

## Appendix B: Statistical Tests Reference

| Experiment | Primary Test | Secondary Tests | Effect Size |
|-----------|-------------|-----------------|-------------|
| 1: Compiler | McNemar's (EM), paired t-test (F1) | Wilcoxon (if non-normal) | Cohen's d |
| 2: Cross-Language | Paired t-test (USEL vs. NL→NL) | Levene's (variance equality) | Cohen's d |
| 3: Comprehension | Mixed ANOVA (Group × Time × Complexity) | Bonferroni post-hoc | Cohen's d, η² |
| 4: Compression | Paired t-test (per format pair) | Bootstrap CI | Ratio + CI |
| 5: Incidents | McNemar's (match accuracy), paired t-test (F1) | Per-language-pair breakdown | Cohen's d |
| 6: Agent | McNemar's (action accuracy), Fisher's exact (by difficulty) | Consistency analysis (Fleiss' κ across runs) | Odds ratio |

All tests at α = 0.05 with Bonferroni correction for multiple comparisons within each experiment.

---

*Document version: 1.0 — July 2026*  
*Kit can execute Experiments 4, 5, 6 this week. Experiments 1, 2 next week. Experiment 3 is a paper proposal with pilot in 2–4 weeks.*

💙🦄
