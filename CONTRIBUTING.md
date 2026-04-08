# Contributing to USEL

Thank you for your interest in the **Universal Symbolic Executable Language**! USEL is an ambitious, interdisciplinary project and we welcome contributions from linguists, designers, developers, educators, and anyone passionate about universal communication.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How to Contribute](#how-to-contribute)
  - [Adding New Molecules (Tier 2)](#adding-new-molecules-tier-2)
  - [Improving Symbol Designs](#improving-symbol-designs)
  - [Adding Language Targets](#adding-language-targets)
  - [Adding Pronunciations](#adding-pronunciations)
  - [Writing Tests](#writing-tests)
  - [Documentation](#documentation)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Pull Request Process](#pull-request-process)
- [Design Principles](#design-principles)
- [Research Contributions](#research-contributions)

---

## Code of Conduct

USEL is a project about universal human communication. We expect all contributors to treat each other with respect, kindness, and good faith. Discrimination, harassment, and exclusionary behavior have no place here.

We are especially committed to:
- **Accessibility** — contributions should never make USEL harder to use
- **Cultural sensitivity** — symbols must work across cultures, not privilege one
- **Neurodiversity awareness** — cognitive load and sensory processing matter

---

## How to Contribute

### Adding New Molecules (Tier 2)

Molecules are composite symbols built from Tier 0 primes and Tier 1 compute primitives. To propose a new molecule:

1. **Check it doesn't already exist** — search `spec/PRIMES_TABLE.md` and the molecules directory
2. **Decompose it** — express the concept using only Tier 0/1 symbols
3. **Create the definition** in JSON format:

```json
{
  "id": "MOL_TREE",
  "name": "TREE",
  "tier": 2,
  "category": "universal",
  "level": 1,
  "glyph": "🌳",
  "color": "#4CAF50",
  "accepts": ["modifier", "condition"],
  "provides": ["subject", "object"],
  "decomposition": ["SOMETHING", "LIVE", "BIG", "PART", "ABOVE", "BELOW"],
  "pronunciation": {
    "en": "tree",
    "es": "árbol",
    "zh": "树",
    "ar": "شجرة"
  },
  "description": "A large living thing with parts above and below ground."
}
```

4. **Design an SVG glyph** — place in `public/svg/` (see [Design Principles](#design-principles))
5. **Add tests** — at minimum, verify it compiles to all four targets
6. **Submit a PR** with the rationale for why this molecule is universal enough

#### Molecule Acceptance Criteria

- [ ] Expressible using existing Tier 0/1 symbols
- [ ] Culturally universal (exists in all major language families)
- [ ] Has a clear, unambiguous decomposition
- [ ] SVG glyph follows the design system
- [ ] Includes pronunciations for at least 4 languages
- [ ] All compilation targets produce correct output
- [ ] Does not duplicate an existing molecule

---

### Improving Symbol Designs

Symbol design is critical to USEL's mission. Good symbols are:

| Property | Description |
|----------|-------------|
| **Iconic** | The symbol visually resembles its meaning |
| **Distinct** | Not easily confused with other symbols |
| **Scalable** | Readable at 16×16px and 256×256px |
| **Culturally neutral** | No single-culture bias |
| **Accessible** | Works for colorblind users (never rely on color alone) |

To propose a symbol redesign:

1. Create the SVG at **64×64px** viewbox
2. Use only **solid fills** (no gradients, no textures)
3. Test at multiple sizes (16px, 32px, 64px, 128px)
4. Include a brief rationale for why the new design is better
5. Run `npm run test:accessibility` to verify contrast ratios

---

### Adding Language Targets

USEL compiles to multiple languages. To add a new compilation target:

1. Create a new compiler in `src/compiler/`:
   ```
   src/compiler/your-target.ts
   ```

2. Implement the `CompilationTarget` interface:
   ```typescript
   import { USELAST, CompilationResult } from '../primes/types';

   export function compile(ast: USELAST): CompilationResult {
     return {
       target: 'your-target',
       code: '...',
       success: true
     };
   }
   ```

3. Add tests in `tests/compiler/your-target.test.ts`
4. Register in `src/compiler/index.ts`

Current targets: JavaScript, Python, Natural Language, WebAssembly, USEL Text

---

### Adding Pronunciations

Every symbol needs pronunciations in as many languages as possible. The minimum is four:

| Code | Language |
|------|----------|
| `en` | English |
| `es` | Spanish |
| `zh` | Mandarin Chinese |
| `ar` | Arabic |

To add more languages:

1. Edit the symbol's pronunciation field in its definition
2. Use IPA transcription in a comment if the romanization is ambiguous
3. Have a native speaker verify if possible
4. Add the language code to `spec/PRIMES_TABLE.md`

---

### Writing Tests

Tests live in `tests/` and follow this structure:

```
tests/
├── primes/          # Tier 0 prime validation
├── molecules/       # Tier 2 molecule decomposition
├── compiler/        # Compilation target tests
├── grammar/         # Connection slot validation
└── integration/     # End-to-end scenarios
```

Run all tests:
```bash
npm test
```

Each test should verify:
- Symbol definitions match the spec
- Grammar rules are enforced (invalid connections rejected)
- Compilation produces correct output for each target
- Round-trip: USEL → target → back to USEL preserves meaning

---

### Documentation

Documentation improvements are always welcome:
- Fix typos or unclear explanations
- Add examples to the spec
- Translate documentation to other languages
- Improve the README or this contributing guide

---

## Development Setup

```bash
# Clone the repository
git clone https://github.com/kit-olivas/usel-lang.git
cd usel-lang

# Install dependencies
npm install

# Run the development server (editor)
npm run dev

# Run tests
npm test

# Build for production
npm run build

# Type-check
npx tsc --noEmit
```

### Prerequisites

- Node.js 18+ and npm
- TypeScript 5+
- A modern browser (for the visual editor)

---

## Project Structure

```
usel-lang/
├── spec/                  # Language specification
│   ├── USEL_SPEC_v1.md   # Formal spec
│   └── PRIMES_TABLE.md   # Complete primes reference
├── src/
│   ├── primes/            # Tier 0 & 1 definitions
│   │   └── types.ts       # Core TypeScript types
│   ├── compiler/          # Compilation targets
│   ├── editor/            # Visual projectional editor
│   ├── ai/                # AI integration layer
│   ├── mempalace/         # MemPalace bridge
│   └── wasm/              # WebAssembly runtime
├── public/
│   └── svg/               # Symbol SVG assets
├── tests/                 # Test suites
├── README.md
├── CONTRIBUTING.md
├── LICENSE
├── package.json
└── tsconfig.json
```

---

## Pull Request Process

1. **Fork** the repository and create a feature branch
2. **Make your changes** following the guidelines above
3. **Run tests** — all tests must pass
4. **Update documentation** if your change affects the spec or API
5. **Write a clear PR description** explaining what and why
6. **Request review** — at least one maintainer must approve

### Commit Message Format

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

Examples:
```
feat(primes): add pronunciation for Hindi
fix(compiler): correct JS output for nested conditions
docs(spec): clarify Tier 2 extensibility rules
```

---

## Design Principles

When contributing to USEL, keep these principles in mind:

1. **Universal over clever** — a symbol understood by everyone beats one that's elegant but obscure
2. **Children first** — if a 5-year-old can't intuit the meaning, reconsider
3. **No syntax errors possible** — the editor, not the user, enforces grammar
4. **Decomposition is truth** — every molecule must reduce to primes
5. **Cultural neutrality** — no symbol should privilege one culture's iconography
6. **Accessibility by default** — color is never the only differentiator
7. **AI-readable** — every symbol must map to a stable embedding vector

---

## Research Contributions

USEL is grounded in academic research. We welcome:

- **NSM linguistics** — refinements to prime decompositions
- **Cognitive science** — usability studies with children and diverse populations
- **AI/ML** — embedding space mapping and optimization
- **HCI** — projectional editor design and interaction patterns
- **Accessibility** — AAC (Augmentative and Alternative Communication) integration

If you're an academic interested in collaboration, please open an issue tagged `research`.

---

## Questions?

Open an issue or start a discussion. We're building something that's never existed before — every question helps us think more clearly.

---

*"No competing project is pursuing this exact convergence. This represents genuine white space."*
— Model Council (GPT-4 + Claude 3 consensus)

**Authors:** Kit & Ada Marie
**License:** MIT
