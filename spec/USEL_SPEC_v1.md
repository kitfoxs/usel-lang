# USEL Language Specification

**Version:** 1.0.0
**Status:** Research Preview
**Date:** 2026-04-07
**Authors:** Kit & Ada Marie

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Design Goals](#2-design-goals)
3. [Symbol Definition Format](#3-symbol-definition-format)
4. [Three-Tier Symbol System](#4-three-tier-symbol-system)
5. [Grammar Rules](#5-grammar-rules)
6. [Connection Slot System](#6-connection-slot-system)
7. [Age-Stratified Access Levels](#7-age-stratified-access-levels)
8. [Abstract Syntax Tree (AST) Format](#8-abstract-syntax-tree-ast-format)
9. [USEL Text Notation](#9-usel-text-notation)
10. [Compilation Semantics](#10-compilation-semantics)
11. [Extensibility](#11-extensibility)
12. [Conformance](#12-conformance)
13. [References](#13-references)

---

## 1. Introduction

USEL (Universal Symbolic Executable Language) is a symbolic language built on the 65 empirically verified semantic primes identified by Natural Semantic Metalanguage (NSM) research. It is designed to be:

- **Human-universal** — grounded in concepts shared by all natural languages
- **Child-readable** — progressive disclosure from age 5 upward
- **AI-native** — each symbol maps to a fixed embedding vector
- **Executable** — compiles to JavaScript, Python, WebAssembly, and natural language

This document is the formal specification of USEL version 1.0.0. It defines the symbol format, grammar rules, AST structure, compilation semantics, and extensibility model.

### 1.1 Notation Conventions

- `UPPER_CASE` — refers to a USEL symbol by its canonical name
- `[SYMBOL]` — USEL text notation for a symbol
- `{slot}` — a connection slot type
- `T0`, `T1`, `T2` — shorthand for Tier 0, Tier 1, Tier 2
- **MUST**, **SHOULD**, **MAY** — per RFC 2119

### 1.2 Versioning

USEL follows semantic versioning. Changes to Tier 0 primes require a major version bump. Changes to Tier 1 compute primitives require a minor version bump. Tier 2 molecules are user-extensible and do not affect the version number.

---

## 2. Design Goals

| # | Goal | Rationale |
|---|------|-----------|
| G1 | No syntax errors possible | The editor enforces grammar; users compose, not type |
| G2 | Meaning is unambiguous | Every symbol has exactly one canonical interpretation |
| G3 | Progressive complexity | Age-stratified levels prevent cognitive overload |
| G4 | Multi-target compilation | Same program runs as JS, Python, Wasm, or natural language |
| G5 | Cultural neutrality | No symbol privileges one culture's iconography |
| G6 | AI-readable | Direct vector mapping to LLM embedding space |
| G7 | Empirically grounded | Built on 50+ years of NSM cross-linguistic research |
| G8 | Extensible | New molecules can be added without changing the core |

---

## 3. Symbol Definition Format

Every USEL symbol is defined as a JSON object conforming to the following schema:

### 3.1 JSON Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "USELSymbol",
  "type": "object",
  "required": [
    "id", "name", "tier", "category", "level",
    "glyph", "color", "accepts", "provides",
    "pronunciation", "description"
  ],
  "properties": {
    "id": {
      "type": "string",
      "description": "Unique identifier. Format: PRIME_<NAME> | COMP_<NAME> | MOL_<NAME>",
      "pattern": "^(PRIME|COMP|MOL)_[A-Z][A-Z0-9_]*$"
    },
    "name": {
      "type": "string",
      "description": "Human-readable canonical name in UPPER_CASE"
    },
    "tier": {
      "type": "integer",
      "enum": [0, 1, 2],
      "description": "0 = NSM prime, 1 = compute primitive, 2 = molecule"
    },
    "category": {
      "type": "string",
      "description": "Semantic category within the tier"
    },
    "level": {
      "type": "integer",
      "enum": [1, 2, 3],
      "description": "Minimum access level required (1=child, 2=teen, 3=adult)"
    },
    "glyph": {
      "type": "string",
      "description": "Unicode character(s) used as the symbol's visual representation"
    },
    "color": {
      "type": "string",
      "description": "Hex color code for the symbol's category",
      "pattern": "^#[0-9A-Fa-f]{6}$"
    },
    "svgPath": {
      "type": "string",
      "description": "Path to the SVG file in public/svg/"
    },
    "accepts": {
      "type": "array",
      "items": { "$ref": "#/definitions/ConnectionSlot" },
      "description": "Slot types this symbol can receive as input"
    },
    "provides": {
      "type": "array",
      "items": { "$ref": "#/definitions/ConnectionSlot" },
      "description": "Slot types this symbol provides as output"
    },
    "pronunciation": {
      "type": "object",
      "description": "Map of ISO 639-1 language codes to pronunciations",
      "additionalProperties": { "type": "string" },
      "required": ["en", "es", "zh", "ar"]
    },
    "nsmDefinition": {
      "type": "string",
      "description": "For T0: empty (primes are irreducible). For T1/T2: decomposition in primes"
    },
    "decomposition": {
      "type": "array",
      "items": { "type": "string" },
      "description": "For T2 molecules: ordered list of symbol IDs that compose this molecule"
    },
    "description": {
      "type": "string",
      "description": "One-sentence human-readable description"
    }
  },
  "definitions": {
    "ConnectionSlot": {
      "type": "string",
      "enum": ["subject", "predicate", "object", "modifier", "condition", "value", "operator"]
    }
  }
}
```

### 3.2 Example: Tier 0 Prime

```json
{
  "id": "PRIME_WANT",
  "name": "WANT",
  "tier": 0,
  "category": "mental",
  "level": 1,
  "glyph": "↣",
  "color": "#9B59B6",
  "svgPath": "svg/prime_want.svg",
  "accepts": ["subject"],
  "provides": ["predicate"],
  "pronunciation": {
    "en": "want",
    "es": "querer",
    "zh": "要 (yào)",
    "ar": "يريد (yurīd)"
  },
  "nsmDefinition": "",
  "description": "The mental state of desiring something to happen or to have something."
}
```

### 3.3 Example: Tier 1 Compute Primitive

```json
{
  "id": "COMP_ASSIGN",
  "name": "ASSIGN",
  "tier": 1,
  "category": "data",
  "level": 2,
  "glyph": "⇒",
  "color": "#00ACC1",
  "accepts": ["value", "subject"],
  "provides": ["operator"],
  "pronunciation": {
    "en": "assign",
    "es": "asignar",
    "zh": "赋值 (fùzhí)",
    "ar": "تعيين (taʿyīn)"
  },
  "nsmDefinition": "[SOMETHING][BE_SOMETHING][OTHER][BECAUSE][DO]",
  "description": "Bind a value to a named reference."
}
```

### 3.4 Example: Tier 2 Molecule

```json
{
  "id": "MOL_WATER",
  "name": "WATER",
  "tier": 2,
  "category": "universal",
  "level": 1,
  "glyph": "🌊",
  "color": "#8D6E63",
  "accepts": ["modifier", "condition"],
  "provides": ["subject", "object"],
  "decomposition": ["PRIME_SOMETHING", "PRIME_MOVE", "PRIME_BELOW", "PRIME_TOUCH"],
  "pronunciation": {
    "en": "water",
    "es": "agua",
    "zh": "水 (shuǐ)",
    "ar": "ماء (māʾ)"
  },
  "nsmDefinition": "something that moves, is below, and touches things",
  "description": "Liquid water — a universal substance."
}
```

---

## 4. Three-Tier Symbol System

### 4.1 Tier 0 — Semantic Primes

**Count:** 65
**Source:** NSM (Wierzbicka & Goddard, 2014; 2018 revision)
**Mutability:** FROZEN — changes require a new major version

Tier 0 symbols are the irreducible atoms of human meaning. They cannot be decomposed into simpler USEL symbols. Their `nsmDefinition` field is always empty.

**Categories:**

| Category | Count | Examples |
|----------|-------|---------|
| Substantives | 6 | I, YOU, SOMEONE, SOMETHING, PEOPLE, BODY |
| Relational | 2 | KIND, PART |
| Determiners | 3 | THIS, THE_SAME, OTHER |
| Quantifiers | 5 | ONE, TWO, SOME, ALL, MUCH_MANY |
| Evaluators | 2 | GOOD, BAD |
| Descriptors | 2 | BIG, SMALL |
| Mental | 7 | THINK, KNOW, WANT, NOT_WANT, FEEL, SEE, HEAR |
| Speech | 3 | SAY, WORDS, TRUE |
| Actions | 3 | DO, HAPPEN, MOVE |
| Existence | 4 | THERE_IS, BE_SOMEONE, BE_SOMETHING, HAVE |
| Life | 2 | LIVE, DIE |
| Time | 8 | WHEN_TIME, NOW, BEFORE, AFTER, A_LONG_TIME, A_SHORT_TIME, FOR_SOME_TIME, MOMENT |
| Space | 9 | WHERE_PLACE, HERE, ABOVE, BELOW, FAR, NEAR, SIDE, INSIDE, TOUCH |
| Logical | 5 | NOT, MAYBE, CAN, BECAUSE, IF |
| Intensifier | 2 | VERY, MORE |
| Similarity | 2 | LIKE, WAY |
| **Total** | **65** | |

> 📖 See [`PRIMES_TABLE.md`](PRIMES_TABLE.md) for the complete reference.

### 4.2 Tier 1 — Compute Primitives

**Count:** ~120 (may grow with minor versions)
**Source:** Common programming language constructs
**Mutability:** STABLE — additions allowed, removals require minor version bump

Tier 1 symbols provide the computational scaffolding needed to make USEL executable. They include:

| Category | Examples | Count |
|----------|---------|-------|
| Math | ADD, SUBTRACT, MULTIPLY, DIVIDE, MODULO, POWER | ~15 |
| Data | ASSIGN, VARIABLE, LIST, MAP, STRING, NUMBER, BOOLEAN | ~20 |
| Control | IF_THEN, ELSE, LOOP, WHILE, FOR_EACH, BREAK, RETURN | ~15 |
| Type | TYPE_CHECK, CAST, NULL, UNDEFINED | ~10 |
| Function | DEFINE, CALL, PARAMETER, RESULT | ~10 |
| I/O | INPUT, OUTPUT, PRINT, READ, WRITE | ~10 |
| Compare | EQUALS, NOT_EQUALS, GREATER, LESS, AND, OR | ~15 |
| Event | ON_EVENT, EMIT, LISTEN, TIMER | ~10 |
| Error | TRY, CATCH, THROW, ASSERT | ~8 |
| Concurrency | ASYNC, AWAIT, PARALLEL, SEQUENCE | ~7 |

Every Tier 1 symbol MUST have a `nsmDefinition` that expresses its meaning using only Tier 0 primes and other Tier 1 symbols that are themselves defined in primes.

### 4.3 Tier 2 — Molecules

**Count:** Unlimited (user-extensible)
**Source:** Contributed by users, verified by community
**Mutability:** OPEN — anyone can add molecules

Molecules are composite symbols representing concrete objects, domain concepts, or frequently used patterns. Every molecule MUST have:

1. A `decomposition` — an ordered list of Tier 0/1 symbol IDs
2. An `nsmDefinition` — a natural-language paraphrase using only primes
3. Pronunciations in at least 4 languages
4. An SVG glyph following the design system

**Built-in molecules** (shipped with USEL) cover universal concepts:

| Domain | Examples |
|--------|---------|
| Nature | WATER, FIRE, TREE, EARTH, SKY, SUN, MOON |
| Body | HAND, EYE, HEAD, MOUTH, LEG |
| Objects | FOOD, HOUSE, TOOL, CLOTHES |
| Social | FAMILY, FRIEND, CHILD, PARENT, TEACHER |
| Computing | FILE, SCREEN, NETWORK, DATABASE, API |

---

## 5. Grammar Rules

### 5.1 Statement Structure

A USEL statement is a directed acyclic graph (DAG) of connected symbols. The canonical sentence order is:

```
SUBJECT → PREDICATE → OBJECT → MODIFIER*
```

Where `MODIFIER*` means zero or more modifiers.

### 5.2 Connection Rules

Symbols connect through **slots**. A connection is valid if and only if:

1. The source symbol **provides** a slot type that the target symbol **accepts**
2. Both symbols are available at the current access level
3. The connection does not create a cycle in the DAG

### 5.3 Rule Table

| Rule ID | From (provides) | To (accepts) | Description | Example |
|---------|-----------------|--------------|-------------|---------|
| R1 | `subject` | `predicate` | A subject connects to a predicate | `[I]→[WANT]` |
| R2 | `predicate` | `object` | A predicate connects to an object | `[WANT]→[SOMETHING]` |
| R3 | `predicate` | `predicate` | Predicates can chain | `[WANT]→[SEE]` |
| R4 | `object` | `modifier` | Objects accept modifiers | `[SOMETHING]→[BIG]` |
| R5 | `subject` | `modifier` | Subjects accept modifiers | `[SOMEONE]→[GOOD]` |
| R6 | `condition` | `subject` | Conditions precede statements | `[IF]→[I]` |
| R7 | `operator` | `value` | Operators connect to values | `[ASSIGN]→[42]` |
| R8 | `value` | `operator` | Values feed into operators | `[X]→[ADD]` |

### 5.4 Invalid Connections

The following connections MUST be rejected by the editor:

- `modifier` → `modifier` (modifiers cannot modify modifiers at Level 1)
- `condition` → `condition` (no nested conditions at Level 1)
- Any connection creating a cycle
- Any connection between symbols above the current access level

### 5.5 Statement Termination

A statement is complete when:
1. It contains at least one `subject` and one `predicate`, OR
2. It is a bare expression (Tier 1 compute: `[3][ADD][4]`), OR
3. It is a condition block (`[IF][condition][subject][predicate]`)

### 5.6 Program Structure

A USEL program is an ordered list of statements. Statements execute sequentially unless modified by control flow (Tier 1) symbols.

```
PROGRAM := STATEMENT+
STATEMENT := SUBJECT PREDICATE OBJECT? MODIFIER*
           | CONDITION STATEMENT
           | COMPUTE_EXPR
CONDITION := [IF] STATEMENT
           | [BECAUSE] STATEMENT
COMPUTE_EXPR := VALUE (OPERATOR VALUE)*
```

---

## 6. Connection Slot System

### 6.1 Slot Types

| Slot | Description | Provided by | Accepted by |
|------|-------------|-------------|-------------|
| `subject` | The actor or topic | Substantives, Molecules | Predicates, Modifiers |
| `predicate` | The action or state | Mental, Actions, Speech, Existence | Objects, Predicates |
| `object` | The target or recipient | Substantives, Molecules, Quantifiers | Modifiers |
| `modifier` | Qualifies a subject or object | Evaluators, Descriptors, Intensifiers, Space, Time | (terminal) |
| `condition` | A prerequisite clause | Logical (IF, BECAUSE) | Subjects |
| `value` | A data value (Tier 1) | Numbers, Strings, Variables | Operators |
| `operator` | A computation (Tier 1) | Math, Compare, Data operators | Values |

### 6.2 Slot Compatibility Matrix

| | subject | predicate | object | modifier | condition | value | operator |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **subject** | — | ✅ | — | ✅ | — | — | — |
| **predicate** | — | ✅ | ✅ | — | — | — | — |
| **object** | — | — | — | ✅ | — | — | — |
| **modifier** | — | — | — | ⚠️ L2+ | — | — | — |
| **condition** | ✅ | — | — | — | ⚠️ L3 | — | — |
| **value** | — | — | — | — | — | — | ✅ |
| **operator** | — | — | — | — | — | ✅ | — |

✅ = Always valid | ⚠️ = Valid at indicated level | — = Never valid

### 6.3 Arity Rules

- A `subject` slot can connect to **at most one** `predicate`
- A `predicate` slot can connect to **at most one** `object` and **one** chained predicate
- An `object` slot can accept **zero or more** `modifier` connections
- A `condition` slot can connect to **exactly one** `subject` (the start of the conditioned statement)
- `value` and `operator` slots alternate: `value → operator → value → operator → ...`

---

## 7. Age-Stratified Access Levels

### 7.1 Level 1 — Foundational (Ages 5–8)

**Available:** ~30 Tier 0 primes + basic Tier 2 molecules

| Available Categories | Symbols |
|---------------------|---------|
| Substantives | I, YOU, SOMEONE, SOMETHING, PEOPLE, BODY |
| Evaluators | GOOD, BAD |
| Descriptors | BIG, SMALL |
| Mental | WANT, FEEL, SEE, HEAR |
| Actions | DO, MOVE |
| Speech | SAY |
| Existence | THERE_IS |
| Space | HERE, ABOVE, BELOW, INSIDE |
| Time | NOW, BEFORE, AFTER |
| Logical | NOT |
| Quantifiers | ONE, TWO, SOME, ALL |

**Restrictions:**
- No modifier-to-modifier chains
- No nested conditions
- No Tier 1 compute primitives
- Maximum statement length: 8 symbols

### 7.2 Level 2 — Expressive (Ages 9–14)

**Available:** All 65 Tier 0 primes + ~80 Tier 1 compute primitives + expanded molecules

**Unlocked capabilities:**
- Modifier chains (up to depth 2)
- Conditionals (`IF`, `BECAUSE`)
- Loops (`FOR_EACH`, `WHILE`)
- Functions (`DEFINE`, `CALL`)
- Math operations
- Variables and assignment
- Maximum statement length: 20 symbols

### 7.3 Level 3 — Full (Ages 15+)

**Available:** All tiers, all symbols

**Unlocked capabilities:**
- Nested conditions (unlimited depth)
- Modifier chains (unlimited depth)
- Custom molecule definition
- WebAssembly compilation
- AI integration APIs
- MemPalace bridge
- No statement length limit

---

## 8. Abstract Syntax Tree (AST) Format

### 8.1 Program Node

```typescript
interface USELAST {
  type: 'program';
  statements: USELStatement[];
  metadata: {
    version: string;       // "1.0.0"
    level: 1 | 2 | 3;     // Access level used
    created: string;       // ISO 8601 timestamp
    author?: string;
  };
}
```

### 8.2 Statement Node

```typescript
interface USELStatement {
  type: 'statement';
  nodes: USELNode[];
  condition?: USELStatement;  // Optional IF/BECAUSE clause
}
```

### 8.3 Symbol Node

```typescript
interface USELNode {
  id: string;                  // Unique instance ID (UUID)
  symbol: USELSymbol;         // Reference to the symbol definition
  children: USELNode[];       // Connected nodes (via slots)
  position: { x: number; y: number };  // Visual position in editor
}
```

### 8.4 Example AST

For the statement `[I][WANT][SEE][SOMETHING][BIG]`:

```json
{
  "type": "program",
  "statements": [
    {
      "type": "statement",
      "nodes": [
        {
          "id": "n1",
          "symbol": { "id": "PRIME_I", "name": "I", "tier": 0 },
          "children": [
            {
              "id": "n2",
              "symbol": { "id": "PRIME_WANT", "name": "WANT", "tier": 0 },
              "children": [
                {
                  "id": "n3",
                  "symbol": { "id": "PRIME_SEE", "name": "SEE", "tier": 0 },
                  "children": [
                    {
                      "id": "n4",
                      "symbol": { "id": "PRIME_SOMETHING", "name": "SOMETHING", "tier": 0 },
                      "children": [
                        {
                          "id": "n5",
                          "symbol": { "id": "PRIME_BIG", "name": "BIG", "tier": 0 },
                          "children": [],
                          "position": { "x": 400, "y": 100 }
                        }
                      ],
                      "position": { "x": 300, "y": 100 }
                    }
                  ],
                  "position": { "x": 200, "y": 100 }
                }
              ],
              "position": { "x": 100, "y": 100 }
            }
          ],
          "position": { "x": 0, "y": 100 }
        }
      ]
    }
  ],
  "metadata": {
    "version": "1.0.0",
    "level": 1,
    "created": "2026-04-07T00:00:00Z"
  }
}
```

---

## 9. USEL Text Notation

### 9.1 Format

USEL text notation is a linear serialization of a USEL program. Each symbol is enclosed in square brackets:

```
[SYMBOL_NAME]
```

### 9.2 Syntax

```
program     := statement+
statement   := symbol+ NEWLINE
symbol      := '[' NAME ']'
NAME        := [A-Z][A-Z0-9_]*
```

### 9.3 Conventions

- One statement per line
- Symbols are written left-to-right in connection order
- Conditions precede the conditioned statement on the same line
- Literals are written as `[=value]` (e.g., `[=42]`, `[="hello"]`)
- Comments begin with `;;`

### 9.4 Examples

```usel
;; Simple statement
[I][WANT][SEE][SOMETHING][BIG]

;; Conditional
[IF][SOMEONE][DO][SOMETHING][BAD] [I][SAY][WORDS]

;; Loop (Level 2+)
[FOR_EACH][SOMETHING][INSIDE][LIST] [DO][PRINT][SOMETHING]

;; Function definition (Level 3)
[DEFINE][="greet"][PARAMETER][SOMEONE]
  [SAY][="Hello"][SOMEONE]
[RETURN]

;; Assignment (Level 2+)
[ASSIGN][="x"][=42]
[ASSIGN][="y"][="x"][ADD][=8]
```

### 9.5 Escaping

- Square brackets inside string literals are escaped: `[="\[text\]"]`
- Newlines in strings: `[="\n"]`
- Backslash: `[="\\"]`

---

## 10. Compilation Semantics

### 10.1 Overview

USEL programs compile to multiple targets through a shared AST. The compilation pipeline is:

```
USEL Tiles / Text → Parse → AST → Target Compiler → Output
```

### 10.2 JavaScript Target

| USEL Construct | JavaScript Output |
|----------------|-------------------|
| `[I]` | `agent` (the executing context) |
| `[WANT][X]` | `agent.want(X)` |
| `[SEE][X]` | `actions.see(X)` |
| `[SOMETHING]` | `something` |
| `[BIG]` | `.where(big)` (modifier) |
| `[IF][cond][body]` | `if (cond) { body }` |
| `[FOR_EACH][x][IN][list]` | `for (const x of list)` |
| `[ASSIGN][name][val]` | `let name = val` |
| `[DEFINE][name][params][body]` | `function name(params) { body }` |
| `[ADD]` | `+` |
| `[EQUALS]` | `===` |
| `[SAY][X]` | `console.log(X)` |

### 10.3 Python Target

| USEL Construct | Python Output |
|----------------|--------------|
| `[I]` | `agent` |
| `[WANT][X]` | `agent.want(X)` |
| `[IF][cond][body]` | `if cond:\n    body` |
| `[FOR_EACH][x][IN][list]` | `for x in list:` |
| `[ASSIGN][name][val]` | `name = val` |
| `[DEFINE][name][params][body]` | `def name(params):\n    body` |
| `[SAY][X]` | `print(X)` |

### 10.4 Natural Language Target

The natural language compiler reconstructs a readable sentence from the AST by:

1. Looking up each symbol's pronunciation in the target language
2. Applying the target language's grammar rules (word order, particles, conjugation)
3. Capitalizing and punctuating appropriately

```
[I][WANT][SEE][SOMETHING][BIG]

→ English: "I want to see something big."
→ Spanish: "Quiero ver algo grande."
→ Chinese: "我要看大的东西。"
→ Arabic: "أريد أن أرى شيئاً كبيراً."
```

### 10.5 WebAssembly Target

USEL compiles to WAT (WebAssembly Text Format) and then to binary Wasm:

```wasm
(module
  (func $main (export "main")
    ;; [I][WANT][SEE][SOMETHING][BIG]
    (call $want
      (call $see
        (call $filter
          (i32.const 1)   ;; SOMETHING
          (i32.const 1)   ;; BIG predicate
        )
      )
    )
  )
  (func $want (param $action i32) (result i32)
    ;; Intent registration
    (local.get $action)
  )
  (func $see (param $target i32) (result i32)
    ;; Perception action
    (local.get $target)
  )
  (func $filter (param $what i32) (param $pred i32) (result i32)
    ;; Apply predicate filter
    (local.get $what)
  )
)
```

### 10.6 USEL Text Target

The text target serializes the AST back to USEL text notation (Section 9). This enables round-tripping: `text → AST → text` produces an identical result.

### 10.7 Compilation Guarantees

- **Deterministic:** The same AST always produces the same output for a given target
- **Total:** Every valid AST can be compiled to every target (no partial compilation)
- **Semantic preservation:** The meaning of the program is preserved across targets
- **Round-trip fidelity:** `USEL text → AST → USEL text` is the identity function

---

## 11. Extensibility

### 11.1 Adding Tier 2 Molecules

Any user can define new molecules. A molecule definition MUST include:

1. **Unique ID** matching the pattern `MOL_[A-Z][A-Z0-9_]*`
2. **Decomposition** into existing Tier 0/1 symbols
3. **NSM definition** — a natural-language paraphrase using only prime vocabulary
4. **Pronunciations** in at least 4 languages (en, es, zh, ar)
5. **SVG glyph** at 64×64px viewbox, solid fills only
6. **Description** — one sentence

### 11.2 Molecule Validation

A molecule is valid if:

- [ ] Its decomposition uses only symbols that exist in the current spec
- [ ] Its decomposition is semantically coherent (evaluator review)
- [ ] Its glyph is distinct from all existing glyphs at 16px
- [ ] Its pronunciations are verified by native speakers
- [ ] It compiles correctly to all targets
- [ ] It does not duplicate an existing molecule's semantics

### 11.3 Domain Packs

Molecules can be grouped into **domain packs** for specific use cases:

| Pack | Description | Example Molecules |
|------|-------------|-------------------|
| `nature` | Natural world | WATER, FIRE, TREE, EARTH, MOUNTAIN |
| `body` | Human body | HAND, EYE, HEAD, MOUTH, HEART |
| `computing` | Software concepts | FILE, SCREEN, NETWORK, DATABASE |
| `science` | Scientific concepts | ATOM, ENERGY, FORCE, WAVE |
| `social` | Human relationships | FAMILY, FRIEND, TEACHER, SCHOOL |

Domain packs are optional and do not affect the core language.

### 11.4 Adding Compilation Targets

New compilation targets can be added by implementing the `CompilationTarget` interface:

```typescript
interface CompilationTarget {
  name: string;
  compile(ast: USELAST): CompilationResult;
}
```

The compiler MUST handle all Tier 0 and Tier 1 symbols. Tier 2 molecules are compiled by recursively compiling their decomposition.

---

## 12. Conformance

A USEL implementation is **conformant** if it:

1. Implements all 65 Tier 0 primes exactly as specified
2. Enforces all grammar rules from Section 5
3. Enforces access level restrictions from Section 7
4. Produces a valid AST per Section 8
5. Supports at least one compilation target from Section 10
6. Rejects all invalid connections per Section 6

A **fully conformant** implementation additionally:

7. Supports all five compilation targets
8. Supports Tier 1 compute primitives
9. Supports Tier 2 molecule extensibility
10. Implements USEL text notation parsing and serialization

---

## 13. References

1. Wierzbicka, A. (1972). *Semantic Primitives*. Frankfurt: Athenäum.
2. Wierzbicka, A. (1996). *Semantics: Primes and Universals*. Oxford University Press.
3. Goddard, C. & Wierzbicka, A. (2014). *Words and Meanings: Lexical Semantics Across Domains, Languages and Cultures*. Oxford University Press.
4. Goddard, C. (2018). "Ten Lectures on Natural Semantic Metalanguage." Brill.
5. Leibniz, G. W. (1677). *Dialogue on the Connection between Things and Words*.
6. Neurath, O. (1936). *International Picture Language: The First Rules of Isotype*. Kegan Paul.
7. Bliss, C. K. (1965). *Semantography (Blissymbolics)*. Semantography Publications.
8. W3C (2019). *WebAssembly Core Specification*. https://www.w3.org/TR/wasm-core-1/

---

<div align="center">

**USEL Language Specification v1.0.0**
*Copyright © 2026 Kit & Ada Marie*
*Licensed under MIT*

</div>
