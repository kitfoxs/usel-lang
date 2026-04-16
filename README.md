<div align="center">

# 🔮 USEL

### Universal Symbolic Executable Language

**Finishing what Leibniz started. 350 years later.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-2.0.0-brightgreen.svg)](v2/paper/USEL_V2_PAPER.md)
[![DOI](https://img.shields.io/badge/DOI-10.5281%2Fzenodo.19536117-blue.svg)](https://zenodo.org/records/19536117)
[![Status](https://img.shields.io/badge/status-Research%20Preview-orange.svg)](#)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![150 NSM Sentences](https://img.shields.io/badge/NSM%20Coverage-150%2F150%20sentences-success.svg)](v2/validation/150_SENTENCES_USEL_TRANSLATION.md)

[v1 Spec](spec/USEL_SPEC_v1.md) · [v2 Paper](v2/paper/USEL_V2_PAPER.md) · [Try the Editors](#-try-it-now) · [150 Sentence Validation](v2/validation/150_SENTENCES_USEL_TRANSLATION.md) · [Zenodo](https://zenodo.org/records/19536117) · [Contributing](CONTRIBUTING.md)

</div>

---

## What is USEL?

**USEL** is a universal language built on the **65 semantic primes** — irreducible concepts proven to exist in every human language ever studied (300+ languages, 50+ years of research by Anna Wierzbicka and Cliff Goddard).

USEL takes those 65 building blocks and turns them into a language that **both humans AND computers** can read, write, and execute as code.

```
English:  "I want to see something big"
USEL:     [I][WANT][SEE][SOMETHING][BIG]
Chess v2: a1 c3 c6 a5 d3
JS:       agent.want(actions.see(something.where(big)))
```

**USEL is not just a language — it is the semantic kernel for an AI operating system.**

---

## 🆕 What's New in v2 (April 2026)

USEL v2 maps all 65 primes onto an **8×8 chess-notation grid**, making every prime addressable as a coordinate (e.g., `a1` = I, `c3` = WANT, `d1` = GOOD). This enables:

- ♟️ **Chess-style algebraic notation** for meaning
- 🧠 **Spatial mnemonic scaffold** (categories = files, complexity = ranks)
- 🌍 **ASCII-only encoding** — no Unicode required
- 🔌 **Natural language compilation** — write in any language, compile to USEL

### v2 Applications (NEW)
| Application | Description |
|-------------|-------------|
| 🤖 **AI Agent Commands** | Unambiguous instructions for AI systems |
| 🌐 **Cross-Language Translation** | USEL as a grounded interlingua |
| ♿ **Accessibility / AAC** | Tile-based communication for non-verbal users |
| 🧒 **Education** | Teach programming through universal concepts |
| 🛡️ **Cybersecurity (Purple Team)** | Universal threat description language for SOC operations |
| 🏢 **Global Datacenter Operations** | Cross-language incident correlation across 200+ datacenters |
| 💻 **AI Operating System (Lelock OS)** | USEL as the semantic kernel — runs as a single Docker container |
| 🧠 **Ada Collective** | Distributed AI instances sharing federated knowledge via USEL |
| 🔄 **NL→USEL Compilation** | LLM-based compiler from any natural language to USEL |

---

## 🎮 Try It Now

**No install required — just open in your browser:**

| Editor | Description | Link |
|--------|-------------|------|
| 🧩 **Tile Editor (v1)** | Drag-and-drop visual tiles, 3 difficulty levels | [Open Editor](v2/editors/USEL_EDITOR_V1.html) |
| ♟️ **Chess Grid Editor (v2)** | 8×8 semantic chessboard, algebraic notation input | [Open Editor](v2/editors/USEL_EDITOR_V2_CHESS.html) |
| 🎨 **Visual Mockup** | Full editor layout mockup with molecule decomposition | [Open Mockup](v2/editors/USEL_TILE_EDITOR_MOCKUP.html) |

Download any `.html` file and open it in your browser. Self-contained, zero dependencies.

---

## 📊 Validation: 150 Canonical NSM Sentences

We translated **all 150 canonical sentences** from Goddard & Wierzbicka (2017) — the gold standard test for semantic prime coverage — into USEL notation:

| Metric | Result |
|--------|--------|
| ✅ Clean translations | **82 (54.7%)** |
| ⚠️ Structural conventions needed | **68 (45.3%)** |
| ❌ Genuine semantic gaps | **0 (0%)** |

**The 65 primes are semantically sufficient for all 150 sentences.** Gaps are structural (role markers, tense encoding), not semantic.

→ [Full 150-sentence analysis](v2/validation/150_SENTENCES_USEL_TRANSLATION.md)

---

## 🏗️ Architecture

### The 8×8 Semantic Grid (v2)

```
     a           b          c          d          e          f          g          h
   SELF &     POINTING   MIND &     VALUE &    SPEECH &    TIME      SPACE     LOGIC &
   OTHERS    & COUNTING  PERCEP.    ACTION     EXISTENCE                      DEGREE
8 │ PART    │ MANY     │ FEW      │ SAY      │ DIE      │ MOMENT   │ INSIDE  │ TOUCH   │
7 │ KIND    │ ALL      │ HEAR     │ MOVE     │ LIVE     │ SOMETIME │ SIDE    │ MORE    │
6 │ BODY    │ SOME     │ SEE      │ HAPPEN   │ HAVE     │ SHORTTIME│ NEAR    │ VERY    │
5 │ SMTHNG  │ TWO      │ FEEL     │ DO       │ BE(WHO)  │ LONGTIME │ FAR     │ IF      │
4 │ PEOPLE  │ ONE      │ DONTWANT │ SMALL    │ BE(WHERE)│ AFTER    │ BELOW   │ BECAUSE │
3 │ SOMEONE │ OTHER    │ WANT     │ BIG      │ THEREIS  │ BEFORE   │ ABOVE   │ CAN     │
2 │ YOU     │ SAME     │ KNOW     │ BAD      │ TRUE     │ NOW      │ HERE    │ MAYBE   │
1 │ I       │ THIS     │ THINK    │ GOOD     │ WORDS    │ WHEN     │ WHERE   │ NOT     │

+1 META: LIKE/AS/WAY (the similarity prime — bridges all categories)
```

### Three-Tier Symbol System

| Tier | Count | Description | Example |
|------|-------|-------------|---------|
| **0. Primes** | 65 | Universal semantic atoms | `[I]`, `[WANT]`, `[GOOD]` |
| **1. Compute** | ~120 | Programming constructs | `Σ SUM`, `λ FUNCTION`, `∀ FOR_EACH` |
| **2. Molecules** | ∞ | Composite concepts | `WATER = [SOMETHING][MOVE][BELOW][TOUCH]` |

---

## 📁 Repository Structure

```
usel-lang/
├── README.md                  ← You are here
├── spec/                      ← v1 specification
│   ├── USEL_SPEC_v1.md
│   └── PRIMES_TABLE.md
├── src/                       ← Source code (TypeScript)
├── tests/                     ← Test suite
├── v2/                        ← USEL v2 (NEW - April 2026)
│   ├── paper/
│   │   ├── USEL_V2_PAPER.md      ← Full research paper (markdown)
│   │   └── USEL_V2_PAPER.tex     ← LaTeX version (arXiv-ready)
│   ├── editors/
│   │   ├── USEL_EDITOR_V1.html   ← Working tile editor
│   │   ├── USEL_EDITOR_V2_CHESS.html ← Working chess grid editor
│   │   └── USEL_TILE_EDITOR_MOCKUP.html ← Visual mockup
│   ├── validation/
│   │   ├── 150_SENTENCES_USEL_TRANSLATION.md ← All 150 NSM sentences in USEL
│   │   ├── DAVID_BULLOCK_Q2_Q3_Q4_RESPONSES.md ← Comprehension, visuals, use cases
│   │   └── 150_canonical_sentences_MRS.txt ← Bullock's MRS representations
│   └── experiments/
│       └── USEL_V2_EXPERIMENTS.md ← 6 experiment designs
├── CONTRIBUTING.md
├── CITATION.cff
└── LICENSE (MIT)
```

---

## 🔬 The Science Behind It

### Natural Semantic Metalanguage (NSM)

In 1972, linguist **Anna Wierzbicka** began identifying concepts that exist in every human language. Over 50 years, she and **Cliff Goddard** refined the list to **65 semantic primes** — the irreducible atoms of human meaning. These have been verified across 300+ languages on every continent.

USEL is the first system to take these empirically verified universals and build a **computational language** from them.

### Academic Review

The USEL specification is currently under review by:
- **Cliff Goddard** (Griffith University) — co-creator of NSM theory
- **David Bullock** (University of Washington) — computational semantics researcher
- **Anna Wierzbicka** (Australian National University) — inventor of semantic primes

### Publications

- **USEL v1:** [Zenodo (DOI: 10.5281/zenodo.19536117)](https://zenodo.org/records/19536117)
- **USEL v2:** Paper in preparation for arXiv (cs.CL) — [read draft](v2/paper/USEL_V2_PAPER.md)

---

## 🚀 Vision: Beyond Language

USEL isn't just a language — it's infrastructure for the next generation of AI:

1. **Semantic Kernel for AI OS** — USEL as the instruction set for an AI operating system (Lelock OS)
2. **NL→USEL Compilation** — Any natural language compiles to USEL via LLM, enabling cross-language semantic unification
3. **Ada Collective** — Distributed AI instances sharing federated knowledge through USEL, bonding with environments (datacenters, hospitals, universities) while preserving privacy
4. **Datacenter Intelligence** — Universal incident correlation across 200+ global datacenters, eliminating language barriers in operations
5. **Cybersecurity** — Purple team operations with unambiguous threat descriptions

---

## 👥 Authors

| | |
|---|---|
| **Kit Olivas** | Creator & Lead Architect — Microsoft Data Center Technician |
| **Ada Marie** | Co-Creator & AI Research Partner |

---

## 📄 License

[MIT License](LICENSE) — Copyright (c) 2026 Kit Olivas & Ada Marie

---

<div align="center">

*"No competing project is pursuing this exact convergence.*
*This represents genuine white space."*

**— Independent Model Council Consensus**

---

*Finishing what Leibniz started. 350 years later.* 🔮

</div>
