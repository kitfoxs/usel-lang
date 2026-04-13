<div align="center">

# 🔮 USEL

### Universal Symbolic Executable Language

**Finishing what Leibniz started. 350 years later.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-1.0.0-brightgreen.svg)](spec/USEL_SPEC_v1.md)
[![DOI](https://img.shields.io/badge/DOI-10.5281%2Fzenodo.19536117-blue.svg)](https://zenodo.org/records/19536117)
[![Status](https://img.shields.io/badge/status-Research%20Preview-orange.svg)](#)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

[Specification](spec/USEL_SPEC_v1.md) · [Primes Table](spec/PRIMES_TABLE.md) · [Paper (Zenodo)](https://zenodo.org/records/19536117) · [Contributing](CONTRIBUTING.md)

</div>

---

## Wait, what IS this? (The Simple Version)

Imagine every language on Earth — English, Spanish, Mandarin, Arabic, Swahili, all 7,000+ of them — is built from the same tiny set of building blocks. Like LEGO.

Sounds crazy, right? But linguists spent **50 years** proving it's actually true.

They found **65 words** that exist in **every single language ever studied** (300+ languages tested). Words like:

> **I, YOU, WANT, KNOW, GOOD, BAD, BIG, SMALL, BEFORE, AFTER, BECAUSE, FEEL, SEE, HEAR, SAY, MOVE, LIVE, DIE**

These are called **semantic primes** — the atoms of human meaning. You literally cannot define them using simpler words. Try defining "WANT" without using "want" or a synonym. You can't. These 65 concepts are the absolute bedrock of what it means to think and communicate as a human being.

**USEL takes those 65 building blocks and turns them into a language that both humans AND computers can read, write, and run as actual code.**

### A Real Example

Instead of writing this:

> *"Kit met with Rossetta on Tuesday to discuss the Ada Marie project and it went really well"*

USEL compresses it to:

```
[SOMEONE:Kit]+[BE+NEAR]+[SOMEONE:Rossetta]+[SAY]+[SOMETHING:Ada_Marie]+[BEFORE+NOW]+[GOOD+VERY]
```

And that same USEL expression can compile to JavaScript, Python, WebAssembly, or translate back to plain English — or Spanish, or Japanese, or any language. Because the building blocks are universal.

### Why Should You Care?

- **If you're a regular person:** Imagine a world where a 5-year-old in Tokyo and a grandma in Brazil can both read the same code. That's USEL.
- **If you're a developer:** It's a programming language where syntax errors are literally impossible (the editor won't let you make them), and every program is human-readable by default.
- **If you're in AI:** Each of the 65 symbols maps to a fixed point in LLM embedding space. No ambiguity. No hallucination about what a word means. The AI and the human are speaking the exact same language for the first time ever.
- **If you're neurodivergent:** This was designed by neurodivergent people, for neurodivergent people. Visual tiles, no walls of text, progressive disclosure (start with 10 symbols, unlock more as you grow).

### Why Did Previous Universal Languages Fail?

| System | Year | What Went Wrong |
|--------|------|----------------|
| Leibniz's Universal Language | 1670s | Great idea, but no empirical data and no computers |
| Esperanto | 1887 | Just another spoken language — still has grammar to memorize |
| Blissymbols | 1949 | Too abstract, nobody could read them intuitively |
| Lojban | 1987 | So logical it melted your brain trying to use it |
| Emojis | 2010s | No grammar — 🍕💀🔥 could mean anything |

**What changed in 2026:** We finally have all three ingredients — the empirical primes (discovered by linguists), the AI bridge (LLMs that understand symbols), and the hardware (WebAssembly runs everywhere). USEL is what happens when you combine all three.

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
| ♿ **Accessible** | Designed by neurodivergent creators, AAC integration, colorblind-safe |
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

## 📚 The Science Behind It (For the Curious)

### "But how do you KNOW these 65 words are universal?"

Great question. A linguist named **Anna Wierzbicka** started this research in 1972. Over the next 50+ years, she and her colleague **Cliff Goddard** — along with researchers on every continent — tested hundreds of languages. They kept asking: *"What are the simplest concepts that every language has?"*

They started with about 14. Then they refined it to 60. Then 65. Every time they tested a new language — from Aboriginal Australian languages to Mandarin to Yoruba to Polish — the same 65 concepts showed up. Not similar concepts. The **exact same** ones.

This isn't a theory anymore. It's one of the most well-tested findings in linguistics. The research is called **Natural Semantic Metalanguage (NSM)**, and there are hundreds of peer-reviewed papers backing it up.

**Our paper:** [USEL on Zenodo (DOI: 10.5281/zenodo.19536117)](https://zenodo.org/records/19536117)

### The Leibniz Connection

In 1670, a German philosopher named **Gottfried Leibniz** dreamed of creating a universal language for all human thought. He called it the *Characteristica Universalis*. He imagined that if two people disagreed, they could just sit down, write their arguments in this language, and "calculate" who was right.

He failed — because he had no empirical data about what the universal building blocks actually were, and he had no computers.

**350 years later, we have both.** USEL is what Leibniz would have built if he'd had NSM research and a MacBook.

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
