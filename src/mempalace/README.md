# USEL ↔ MemPalace Integration

> Encoding AI memories using NSM Semantic Primes instead of ad-hoc compression

## What This Does

This module provides a **USELEncoder** that converts natural-language memories into
[USEL](../../README.md) symbolic notation — a structured representation built on the
65 **NSM (Natural Semantic Metalanguage) semantic primes** identified by Anna Wierzbicka.

It serves as an alternative (or complement) to MemPalace's existing **AAAK** dialect,
which uses a custom structured summary format.

### Side-by-Side Example

| Format | Encoding |
|--------|----------|
| **Original** | "Met with John yesterday about the project deadline. He seemed worried about the timeline." |
| **AAAK** | `E:John\|D:yesterday\|T:project,deadline\|EM:anx\|K:met_john_project_deadline_seemed_worried_timeline` |
| **USEL** | `[BEFORE+NOW+1+DAY]+[PERSON:John]+[SAY+THINK]+[FEEL+BAD+THINK]+[TOPIC:project deadline]` |

## How USEL Improves on AAAK

| Dimension | AAAK | USEL | Winner |
|-----------|------|------|--------|
| **Foundation** | Custom ad-hoc codes | 65 NSM primes (linguistically universal) | USEL |
| **Cross-language** | English-centric keywords | Language-independent primes | USEL |
| **Composability** | Flat pipe-delimited fields | Nested prime combinations | USEL |
| **Emotion granularity** | ~25 fixed emotion codes | Compositional (FEEL+GOOD+VERY = love) | USEL |
| **Time encoding** | Raw date strings | Relative prime notation (BEFORE+NOW+N+UNIT) | USEL |
| **LLM readability** | Any LLM reads it | Any LLM reads it (both human-readable) | Tie |
| **Compression ratio** | Generally tighter for simple facts | Richer for complex relational memories | Depends |
| **Reconstruction** | Lossy (summary only) | Lossy (prime approximation) | Tie |
| **Extensibility** | Add new codes manually | Compose from existing primes | USEL |

### When to Use Which

- **AAAK**: Best for quick factual summaries, incident logs, and flat entity–date–topic records.
- **USEL**: Best for relational memories, emotional context, cross-cultural archival, and
  memories that need to compose with other USEL-encoded knowledge.

They can coexist — MemPalace drawers can store both formats as metadata.

## Files

| File | Purpose |
|------|---------|
| `usel-encoder.ts` | Full USELEncoder class with encode, decode, validate, and compare |
| `benchmark.ts` | Runs 10 sample memories through both formats with comparison metrics |

## Running the Benchmark

```bash
# From the usel-lang root
cd src/mempalace
npx tsx benchmark.ts
```

### Benchmark Output Format

The benchmark produces four sections:

#### 1. Compression Comparison Table
```
+-----+------------------------+-------+-------+-------+--------+--------+--------+
|   # | Category               |  Orig |  AAAK |  USEL |  AAAK% |  USEL% | Winner |
+-----+------------------------+-------+-------+-------+--------+--------+--------+
|   1 | work-meeting           |    88 |    72 |    85 |    82% |    97% | aaak   |
|   2 | technical-incident     |    95 |    68 |    78 |    72% |    82% | aaak   |
...
```

- **Orig**: Original memory character count
- **AAAK/USEL**: Encoded character count
- **AAAK%/USEL%**: Compression ratio (lower = more compressed)
- **Winner**: Which format achieved better compression

#### 2. Aggregate Statistics
- Average compression ratios for both formats
- Average USEL readability score (0–100)
- Average reconstruction accuracy (word overlap F1 score)

#### 3. Readability & Reconstruction Detail
Per-memory readability scores and reconstruction accuracy percentages.

#### 4. Validation Results
Whether all USEL encodings pass structural validation (bracket pairing,
valid primes, no unknown symbols).

## API Reference

### `USELEncoder`

```typescript
import { USELEncoder } from "./usel-encoder";

const encoder = new USELEncoder();

// Encode a memory
const usel = encoder.encode("John told me about the project yesterday");
// → "[PERSON:John]+[SAY]+[BEFORE+NOW+1+DAY]+[TOPIC:project]"

// Decode back to natural language (lossy)
const text = encoder.decode(usel);
// → "John said yesterday about project."

// Compare formats
const comparison = encoder.compareCompression(memory);
// → { original: { chars, words }, aaak: { chars, tokens, ratio }, usel: { ... }, winner, savings }

// Validate notation
const result = encoder.validate(usel);
// → { valid: true, errors: [], tokenCount: 4, primesCovered: ["SAY", "BEFORE", "NOW", ...] }
```

## Architecture

```
Natural Language Memory
        │
        ▼
┌───────────────────┐
│  Entity Extractor │ → [PERSON:X], [PLACE:X], [THING:X]
├───────────────────┤
│  Time Encoder     │ → [BEFORE+NOW+N+UNIT], [WHEN:YYYY.MM.DD]
├───────────────────┤
│  Action Mapper    │ → Verb → NSM prime combinations
├───────────────────┤
│  Relation Mapper  │ → colleague → [NEAR+DO], parent → [ABOVE+LIVE]
├───────────────────┤
│  Emotion Mapper   │ → happy → [FEEL+GOOD], anxious → [FEEL+BAD+MAYBE]
├───────────────────┤
│  Qualifier Mapper │ → very → [VERY], never → [NOT+LONG_TIME]
└───────────────────┘
        │
        ▼
  USEL Notation String
  [PERSON:John]+[SAY+THINK]+[BEFORE+NOW+1+DAY]+[TOPIC:project]
```

## Contributing to the MemPalace PR

This integration is being developed on a fork:

```
Repository: kitfoxs/mempalace
Branch:     feat/usel-encoding
Upstream:   milla-jovovich/mempalace
```

### To contribute:

1. **Clone the fork:**
   ```bash
   git clone https://github.com/kitfoxs/mempalace.git
   cd mempalace
   git checkout feat/usel-encoding
   ```

2. **Make changes** to the USEL encoder or add test cases.

3. **Run the benchmark** to verify your changes don't regress metrics:
   ```bash
   cd src/mempalace   # or wherever the USEL module lives
   npx tsx benchmark.ts
   ```

4. **Submit a PR** against the `feat/usel-encoding` branch.

### Integration goals for the MemPalace PR:

- [ ] Add USEL as an optional encoding format alongside AAAK
- [ ] Wire `USELEncoder.encode()` into the `mempalace_add_drawer` MCP tool
- [ ] Add `--format usel` flag to the CLI
- [ ] Store USEL notation as drawer metadata for hybrid search
- [ ] Benchmark against MemPalace's existing AAAK on real palace data

## NSM Primes Reference

The 65 semantic primes used as USEL's foundation:

| Category | Primes |
|----------|--------|
| Substantives | I, YOU, SOMEONE, SOMETHING, PEOPLE, BODY |
| Determiners | THIS, SAME, OTHER |
| Quantifiers | ONE, TWO, SOME, ALL, MANY, MUCH |
| Evaluators | GOOD, BAD |
| Descriptors | BIG, SMALL |
| Mental | THINK, KNOW, WANT, FEEL, SEE, HEAR |
| Speech | SAY, WORDS, TRUE |
| Actions | DO, HAPPEN, MOVE, TOUCH |
| Existence | THERE_IS, LIVE, DIE |
| Possession | HAVE |
| Space | WHERE, HERE, ABOVE, BELOW, FAR, NEAR, SIDE, INSIDE |
| Time | WHEN, NOW, BEFORE, AFTER, LONG_TIME, SHORT_TIME, MOMENT |
| Similarity | LIKE, WAY |
| Logic | NOT, MAYBE, CAN, BECAUSE, IF |
| Intensifier | VERY, MORE |
| Taxonomy | KIND, PART |

## License

MIT — Same as MemPalace upstream.
