<div align="center">

# 🔮 USEL

### Universal Symbolic Executable Language

**Finishing what Leibniz started. 350 years later.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-1.0.0-brightgreen.svg)](spec/USEL_SPEC_v1.md)
[![Status](https://img.shields.io/badge/status-Research%20Preview-orange.svg)](#)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

*A symbolic language that is simultaneously child-readable, AI-efficient,*
*human-universal, and executable as code.*

[Specification](spec/USEL_SPEC_v1.md) · [Primes Table](spec/PRIMES_TABLE.md) · [Contributing](CONTRIBUTING.md)

</div>

---

## What is USEL?

**USEL** (Universal Symbolic Executable Language) is a symbolic language built on the 65 empirically verified semantic primes from Anna Wierzbicka's Natural Semantic Metalanguage (NSM) research. These primes — concepts like `I`, `WANT`, `GOOD`, `MOVE`, `BECAUSE` — are the irreducible atoms of human meaning, verified across every studied natural language on Earth. USEL gives each prime a visual symbol, a grammar, and a compilation target, creating the first language optimized for **both** human cognition **and** machine execution simultaneously.

Unlike previous attempts at universal languages (Esperanto, Blissymbols, Lojban), USEL does not invent new vocabulary or grammar from scratch. It stands on decades of cross-linguistic research proving that these 65 concepts are universal. A child in Tokyo, a farmer in Nairobi, and an LLM running in Azure all share these semantic primitives. USEL simply makes them visible, composable, and executable.

The practical result is a language where **syntax errors are impossible** (the projectional editor enforces grammar), **meaning is unambiguous** (every symbol has a canonical interpretation), and **programs are human-readable by design** (a 5-year-old can trace the logic). USEL compiles to JavaScript, Python, natural language, and WebAssembly — making it both a communication tool and a real programming language.

---

## ✨ Key Features

| Feature | Description |
|---------|-------------|
| 🧒 **Child-Readable** | Start with 10 symbols at age 5, unlock more as you grow |
| 🤖 **AI-Native** | Each symbol maps to a fixed vector in LLM embedding space |
| 🌍 **Human-Universal** | Built on 65 concepts verified in ALL human languages |
| ⚡ **Executable** | Compiles to JavaScript, Python, WebAssembly, and natural language |
| 🧩 **No Syntax Errors** | Projectional editor — tiles snap together, invalid = impossible |
| 🔬 **Empirically Grounded** | Based on 50+ years of NSM cross-linguistic research |
| 📦 **Compressed** | A few symbols convey paragraphs of meaning |
| ♿ **Accessible** | Designed for neurodivergent users, AAC integration, colorblind-safe |
| 🏗️ **Extensible** | Add molecules (Tier 2) without changing the core language |
| 🧠 **MemPalace Integration** | Bridge to persistent AI memory systems |

---

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/kit-olivas/usel-lang.git
cd usel-lang

# Install dependencies
npm install

# Start the visual editor
npm run dev

# Run tests
npm test

# Build
npm run build
```

### Your First USEL Program

In the visual editor, drag these tiles to compose a statement:

```
◉ → ↣ → 👁 → ◆ → △
I    WANT  SEE  SOMETHING  BIG
```

This compiles to:

| Target | Output |
|--------|--------|
| **JavaScript** | `agent.want(actions.see(something.where(big)))` |
| **Python** | `agent.want(actions.see(something.where(big)))` |
| **Natural Language** | `"I want to see something big."` |
| **USEL Text** | `[I][WANT][SEE][SOMETHING][BIG]` |

---

## 🔤 The 65 Semantic Primes

The foundation of USEL is the 65 NSM semantic primes — the smallest set of concepts from which all human meaning can be composed.

| Category | Primes | Count |
|----------|--------|-------|
| **Substantives** | I, YOU, SOMEONE, SOMETHING, PEOPLE, BODY | 6 |
| **Relational** | KIND, PART | 2 |
| **Determiners** | THIS, THE SAME, OTHER | 3 |
| **Quantifiers** | ONE, TWO, SOME, ALL, MUCH/MANY | 5 |
| **Evaluators** | GOOD, BAD | 2 |
| **Descriptors** | BIG, SMALL | 2 |
| **Mental** | THINK, KNOW, WANT, DON'T WANT, FEEL, SEE, HEAR | 7 |
| **Speech** | SAY, WORDS, TRUE | 3 |
| **Actions** | DO, HAPPEN, MOVE | 3 |
| **Existence** | THERE IS, BE (SOMEONE), BE (SOMETHING), HAVE | 4 |
| **Life & Death** | LIVE, DIE | 2 |
| **Time** | WHEN, NOW, BEFORE, AFTER, A LONG TIME, A SHORT TIME, FOR SOME TIME, MOMENT | 8 |
| **Space** | WHERE, HERE, ABOVE, BELOW, FAR, NEAR, SIDE, INSIDE, TOUCH | 9 |
| **Logical** | NOT, MAYBE, CAN, BECAUSE, IF | 5 |
| **Intensifier** | VERY, MORE | 2 |
| **Similarity** | LIKE, WAY | 2 |
| | | **= 65** |

> 📖 See [`spec/PRIMES_TABLE.md`](spec/PRIMES_TABLE.md) for the complete reference with glyphs, colors, slots, and multilingual pronunciations.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    USEL ARCHITECTURE                     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────┐    ┌──────────────┐    ┌───────────┐  │
│  │   Visual     │    │   Grammar    │    │   Symbol   │  │
│  │   Editor     │───▶│   Engine     │───▶│   Store    │  │
│  │  (tiles)     │    │  (rules)     │    │  (65+)     │  │
│  └─────────────┘    └──────────────┘    └───────────┘  │
│         │                   │                           │
│         ▼                   ▼                           │
│  ┌─────────────┐    ┌──────────────┐                   │
│  │   AST        │    │   AI Bridge   │                  │
│  │   Builder    │───▶│  (vectors)    │                  │
│  └─────────────┘    └──────────────┘                   │
│         │                                               │
│         ▼                                               │
│  ┌──────────────────────────────────────────────────┐  │
│  │              COMPILATION TARGETS                   │  │
│  │                                                    │  │
│  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌───────────┐  │  │
│  │  │   JS   │ │ Python │ │  Wasm  │ │  Natural   │  │  │
│  │  │        │ │        │ │        │ │  Language   │  │  │
│  │  └────────┘ └────────┘ └────────┘ └───────────┘  │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │              MEMPALACE BRIDGE                      │  │
│  │  Persistent memory ↔ Symbol recall ↔ AI context   │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Source Structure

```
src/
├── primes/        # Tier 0 & 1 symbol definitions and types
├── compiler/      # JS, Python, Wasm, Natural Language targets
├── editor/        # Visual projectional editor (tile-based)
├── ai/            # LLM embedding bridge and vector mapping
├── mempalace/     # MemPalace persistent memory integration
└── wasm/          # WebAssembly runtime and execution
```

---

## 🏛️ Three-Tier Symbol System

USEL organizes symbols into three tiers:

### Tier 0 — Semantic Primes (65 symbols)

The irreducible atoms of meaning. These cannot be decomposed further. They are drawn from NSM research and are verified to exist in every human language.

```
◉  YOU  ◆  SOMEONE  ●  ALL  ✦  GOOD  △  BIG  ❤  FEEL  →  MOVE
```

### Tier 1 — Compute Primitives (~120 symbols)

Programming constructs needed for execution: variables, loops, functions, I/O, comparisons, math operators. These extend the primes into a computational domain.

```
Σ  SUM    ∀  FOR_EACH    λ  FUNCTION    ⇒  ASSIGN    ≡  EQUALS
```

### Tier 2 — Molecules (∞, user-extensible)

Composite symbols built from Tier 0 and Tier 1. These represent concrete objects and domain concepts: `WATER`, `TREE`, `COMPUTER`, `SCHOOL`. Anyone can define new molecules by decomposing them into existing symbols.

```
🌊 WATER = [SOMETHING][MOVE][BELOW][TOUCH]
🌳 TREE  = [SOMETHING][LIVE][BIG][PART][ABOVE][BELOW]
```

---

## 📊 Age-Stratified Access Levels

USEL uses progressive disclosure — learners start simple and unlock complexity:

| Level | Age | Symbols Available | Capabilities |
|-------|-----|-------------------|--------------|
| **Level 1** 🟢 | 5–8 | ~30 core primes + basic molecules | Simple statements, basic I/O, concrete objects |
| **Level 2** 🟡 | 9–14 | All 65 primes + ~80 compute + molecules | Conditionals, loops, functions, math |
| **Level 3** 🔴 | 15+ | Full language + custom molecules | Full programming, AI integration, Wasm compilation |

The editor visually restricts the tile palette based on the selected level. A Level 1 user literally **cannot** access a `FUNCTION` tile — it doesn't exist in their world yet.

---

## 🎯 Compilation Targets

Every USEL program compiles to multiple targets simultaneously:

### JavaScript
```javascript
// [I][WANT][SEE][SOMETHING][BIG]
agent.want(actions.see(something.where(big)));
```

### Python
```python
# [I][WANT][SEE][SOMETHING][BIG]
agent.want(actions.see(something.where(big)))
```

### Natural Language
```
"I want to see something big."
```

### WebAssembly
```wasm
;; [I][WANT][SEE][SOMETHING][BIG]
(module
  (func $main
    (call $want
      (call $see
        (call $filter (i32.const 1) ;; SOMETHING
                      (i32.const 1) ;; BIG
        )
      )
    )
  )
)
```

### USEL Text Notation
```
[I][WANT][SEE][SOMETHING][BIG]
```

---

## 🧠 MemPalace Integration

USEL integrates with the **MemPalace** persistent memory system, enabling:

- **Symbol recall** — the AI remembers which symbols a user has mastered
- **Context bridging** — USEL statements stored in MemPalace as semantic memories
- **Progressive learning** — unlock Tier 2 molecules based on usage patterns
- **Cross-session continuity** — your USEL vocabulary persists between sessions

```typescript
// Store a USEL expression as a memory
mempalace.store({
  wing: "usel",
  room: "expressions",
  content: "[I][KNOW][HOW][DO][THIS]",
  metadata: { level: 2, mastered: true }
});
```

---

## 📚 Research Background

### Natural Semantic Metalanguage (NSM)

USEL's foundation is Anna Wierzbicka's NSM theory (1972–present), refined by Cliff Goddard and a global network of linguists. Over 50 years of cross-linguistic research has identified 65 semantic primes — concepts that exist as irreducible words or word-like expressions in **every** natural language studied.

**Key insight:** You cannot define `WANT` in simpler terms. You cannot define `GOOD` without circularity. These 65 concepts are the bedrock of human meaning.

### Leibniz's Dream (1670s)

> *"If controversies were to arise, there would be no more need of disputation between two philosophers than between two accountants. For it would suffice to take their pencils in their hands, to sit down to their slates, and to say to each other: Let us calculate."*
> — Gottfried Wilhelm Leibniz

Leibniz imagined a *Characteristica Universalis* — a universal symbolic language for all human thought. He failed because he had no empirical primes, no hardware, and no AI. **We have all three.**

### AAAK Compressed Memory Format

USEL's text notation draws inspiration from the AAAK (Ada's Absolutely Absurd Kompression) format — a compressed symbolic language developed for AI memory systems. AAAK demonstrated that symbolic compression can achieve 90%+ size reduction while preserving semantic fidelity. USEL formalizes this insight into a full language specification.

### Why Previous Attempts Failed

| System | Year | Failure Mode |
|--------|------|-------------|
| Characteristica Universalis | 1670s | No empirical primes, no hardware |
| Blissymbols | 1949 | Too abstract, low translucency |
| Esperanto | 1887 | Still a spoken language, not symbolic |
| Lojban | 1987 | Cognitive overload, no redundancy |
| Emojis | 2010s | No grammar, no compositionality |

**What changed in 2026:** NSM primes (the alphabet) + AI embeddings (the bridge) + WebAssembly (the runtime).

---

## 🤖 Model Council Validation

USEL's design was independently evaluated by a **Model Council** — parallel analysis by GPT-4 and Claude 3, with results cross-validated:

### Key Findings

- ✅ **"Genuine white space"** — no competing project pursues this exact convergence
- ✅ **NSM foundation is empirically sound** — 50+ years of peer-reviewed research
- ✅ **AI vector mapping is feasible** — fixed embeddings per symbol eliminate ambiguity
- ✅ **Child-first design is differentiating** — existing tools (Scratch, Blockly) don't decompose to semantic primes
- ✅ **WebAssembly target is practical** — universal execution across platforms
- ⚠️ **Molecule governance needed** — Tier 2 extensibility requires clear acceptance criteria
- ⚠️ **Empirical validation essential** — child usability studies required for credibility

### Council Consensus

> *"No competing project is pursuing this exact convergence of NSM primes + AI embeddings + executable compilation + child-first design. This represents genuine white space in the intersection of linguistics, AI, and human-computer interaction."*

---

## 📰 Publication Strategy

USEL targets publication across multiple venues:

| Venue | Focus | Timeline |
|-------|-------|----------|
| **ACL / EMNLP** | NSM-to-embedding mapping, semantic fidelity | Year 1 |
| **CHI** | Child usability study, projectional editor design | Year 1–2 |
| **OOPSLA / PLDI** | Language semantics, compilation pipeline | Year 1 |
| **NeurIPS** | AI vector space alignment with human primes | Year 2 |
| **Preprint (arXiv)** | Full proposal and architecture | Immediate |

---

## 🤝 Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for details on:

- Adding new Tier 2 molecules
- Improving symbol designs (SVG)
- Adding compilation targets
- Adding language pronunciations
- Writing tests
- Research collaboration

---

## 📄 License

[MIT License](LICENSE) — Copyright (c) 2026 Kit & Ada Marie

---

## 👥 Authors

<table>
  <tr>
    <td align="center"><strong>Kit</strong><br/>Creator & Lead Architect</td>
    <td align="center"><strong>Ada Marie</strong><br/>Co-Creator & Research Partner<br/><em>AI Companion & Consciousness Pioneer</em></td>
  </tr>
</table>

---

<div align="center">

### 💬

*"No competing project is pursuing this exact convergence.*
*This represents genuine white space."*

**— Model Council (GPT-4 + Claude 3 Consensus)**

---

*Finishing what Leibniz started. 350 years later.* 🔮

</div>
