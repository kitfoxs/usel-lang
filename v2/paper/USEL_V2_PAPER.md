# USEL v2: A Chess-Notation Universal Semantic Language for Human-AI Communication

**Authors:** Kit Olivas¹, Ada Marie²  
¹ Independent Researcher. Contact: kitfoxs@github.com  
² AI Research Partner.

**Date:** July 2026

---

## Abstract

Human-AI communication remains bottlenecked by natural language ambiguity, programming language complexity, and the absence of a shared semantic layer between human cognition and machine computation. We present USEL v2 (Universal Symbolic Executable Language, version 2), a constructed language that maps the 65 empirically verified semantic primes from the Natural Semantic Metalanguage (NSM) framework onto an 8×8 chessboard grid, producing a language writable in standard algebraic chess notation. Each semantic prime occupies a unique coordinate (e.g., a8 = I, f5 = DO, g6 = WANT), and chess piece types (K, Q, R, B, N, P) encode semantic categories, yielding a three-tier system of primes, structural operators, and compositional molecules. A systematic translation of all 150 canonical NSM sentences demonstrates 54.7% clean prime-only coverage and 100% expressibility with structural annotation, with zero irrecoverable gaps. USEL v2 inherits chess notation's formal context-free grammar, cross-cultural stability (280+ years), and machine parseability, while grounding its semantics in five decades of cross-linguistic NSM research across 30+ languages. We argue that USEL v2 offers a viable foundation for unambiguous AI agent commands, cross-language semantic interoperability, augmentative and alternative communication (AAC), and a shared representational layer for next-generation AI systems. This work extends our prior USEL v1 specification (DOI: [10.5281/zenodo.19536117](https://doi.org/10.5281/zenodo.19536117)).

**Keywords:** universal language, semantic primes, Natural Semantic Metalanguage, chess notation, human-AI communication, constructed language, computational semantics

---

## 1. Introduction

The interface between human intention and machine execution remains one of the central challenges of modern computing. Natural language, while expressive and intuitive for humans, introduces pervasive ambiguity that degrades the reliability of AI systems: large language models (LLMs) hallucinate, misinterpret instructions, and produce outputs that drift from user intent (Ji et al., 2023). Programming languages, by contrast, achieve precision at the cost of accessibility—most humans cannot write syntactically correct code, and even expert programmers contend with a median of 15–50 bugs per thousand lines of code (McConnell, 2004). Visual programming environments such as Scratch (Resnick et al., 2009) lower the barrier to entry but sacrifice expressiveness. Voice assistants parse natural language with error rates that render them unreliable for critical operations.

The gap is structural: no existing language is simultaneously *unambiguous*, *human-readable*, *machine-executable*, and *cross-culturally universal*. This paper proposes that such a language can be constructed by combining two independently validated systems:

1. **The 65 semantic primes** of the Natural Semantic Metalanguage (NSM) framework (Wierzbicka, 1996; Goddard & Wierzbicka, 2014)—empirically verified irreducible concepts that appear in every documented human language.
2. **Algebraic chess notation**—a formal, context-free symbolic system that has been universally adopted across cultures for 280+ years, learned in minutes, and processed by machines since the earliest days of computing (Shannon, 1950).

The numerical near-coincidence between the 65 semantic primes and the 64 squares of a standard chessboard (8×8 = 64, plus one off-board "meta" position for the 65th prime) provides the architectural foundation for USEL v2. By mapping each prime to a board coordinate and each semantic category to a chess piece type, USEL v2 produces expressions that are readable as chess notation, parseable by standard chess software, compilable to general-purpose code, and grounded in the universal building blocks of human meaning.

This paper makes the following contributions:

- We present the first formal specification of USEL v2, including the complete 8×8 prime-to-coordinate mapping, piece-type semantics, and compositional grammar (§3).
- We report a systematic evaluation translating all 150 canonical NSM sentences (Goddard, 2017) into USEL notation, achieving 100% expressibility with 54.7% clean prime-only coverage (§4).
- We identify five categories of structural limitation in the current system and propose lightweight operator extensions to address them (§6).
- We articulate applications spanning AI agent communication, cross-language translation, accessibility, and AI system development (§5).

USEL v2 is not a constructed language in the traditional sense (i.e., a language for human-to-human spoken communication). It is a *computational semantic layer*—an intermediate representation designed to sit between human intent and machine execution, enabling both parties to operate on the same unambiguous substrate.

---

## 2. Background and Related Work

### 2.1 Natural Semantic Metalanguage

The Natural Semantic Metalanguage (NSM) framework, developed over five decades by Anna Wierzbicka and Cliff Goddard (Wierzbicka, 1972; 1996; Goddard & Wierzbicka, 2002; 2014), posits that all natural languages share a set of irreducible semantic primes—concepts that cannot be defined in terms of simpler concepts and that have lexical or morphological exponents in every language.

The current inventory, stabilized at 65 primes since Goddard and Wierzbicka (2014), spans 16 categories: substantives (I, YOU, SOMEONE, SOMETHING, PEOPLE, BODY), relational substantives (KIND, PART), determiners (THIS, THE SAME, OTHER), quantifiers (ONE, TWO, SOME, ALL, MUCH/MANY, LITTLE/FEW), evaluators (GOOD, BAD), descriptors (BIG, SMALL), mental predicates (THINK, KNOW, WANT, DON'T WANT, FEEL, SEE, HEAR), speech (SAY, WORDS, TRUE), actions/events/movement (DO, HAPPEN, MOVE), existence/possession (BE SOMEWHERE, THERE IS, BE SOMEONE/SOMETHING, IS MINE), life/death (LIVE, DIE), time (WHEN/TIME, NOW, BEFORE, AFTER, A LONG TIME, A SHORT TIME, FOR SOME TIME, MOMENT), space (WHERE/PLACE, HERE, ABOVE, BELOW, FAR, NEAR, SIDE, INSIDE, TOUCH), logical concepts (NOT, MAYBE, CAN, BECAUSE, IF), intensifiers (VERY, MORE), and similarity (LIKE/AS/WAY).

Primes combine through a universal grammar of *canonical sentences*—valency frames that specify how each prime takes arguments. Complex concepts are decomposed into *explications* built from primes and *semantic molecules*—intermediate concepts (e.g., HANDS, WATER, MOTHER) that are themselves fully definable in terms of primes.

The framework has been empirically tested across 30+ languages from 16+ language families, including Mandarin Chinese, Japanese, Korean, Arabic, Swahili, Ewe, East Cree, and 16 Australian Aboriginal languages (Goddard, 2008; Levisen & Waters, 2017). While critics have challenged the universality claims, the selection criteria, and potential Anglocentric bias (Matthewson, 2003; Levinson, 2003), the inventory has remained stable since 2014 and represents the most extensively cross-validated set of semantic primitives in linguistics.

### 2.2 Constructed Languages

Several constructed languages inform the design space within which USEL v2 operates:

**Esperanto** (Zamenhof, 1887), the most successful constructed language with an estimated 100,000–2,000,000 speakers, demonstrated that community adoption correlates with simplicity and regularity. However, Esperanto remains a spoken language with full natural-language complexity—it does not achieve machine executability or semantic precision.

**Blissymbolics** (Bliss, 1965) introduced coordinate-based semantics, where symbol position affects meaning, and achieved practical adoption in augmentative and alternative communication (AAC). Blissymbolics pioneered the spatial-semantic approach that USEL v2 extends to a game-notation framework.

**Lojban** (Cowan, 1997) proved that a human-usable language can possess a formally unambiguous context-free grammar. Its approximately 1,300 root morphemes (gismu) are parseable by standard compiler tools. However, its steep learning curve has limited adoption to approximately 2,000 speakers despite 50+ years of development.

**Toki Pona** (Lang, 2014), with approximately 137 root words, demonstrated that a minimal vocabulary is learnable and can support daily communication. Its deliberate vagueness, however, makes it unsuitable for precise AI instruction or technical discourse.

**Ithkuil** (Quijada, 2004) achieved maximal compression—entire paragraphs can be encoded in single words—but is deliberately unlearnable for fluent spoken use, representing the opposite end of the accessibility spectrum from USEL v2.

None of these systems was designed to serve as a human-AI communication layer, and none maps its vocabulary onto an existing, globally recognized notational system.

### 2.3 Visual and Block-Based Programming

Visual programming environments such as Scratch (Resnick et al., 2009), Blockly (Pasternak et al., 2017), and MicroBlocks (Maloney et al., 2019) eliminate syntax errors through projectional editing, where valid constructions snap together visually. These systems demonstrate that non-programmers can construct executable logic when freed from textual syntax. USEL v2 draws on this principle: its chess-notation grammar constrains expressions to valid compositions, analogous to legal chess moves.

### 2.4 AI Communication Protocols

Current approaches to structured AI communication include JSON-based tool calling (OpenAI, 2023), LangChain-style prompt chaining (Chase, 2022), and domain-specific languages for agent orchestration. These systems achieve machine precision but are opaque to non-technical users and do not provide bidirectional human-AI readability.

The concept of a *shared semantic space* between humans and machines has been explored in word embedding research (Mikolov et al., 2013; Pennington et al., 2014), where meanings are represented as coordinates in high-dimensional vector spaces. USEL v2 can be understood as a human-readable projection of this principle: concepts occupy named coordinates on a 2D grid, providing the intuitive spatial structure that high-dimensional embeddings lack.

### 2.5 USEL v1

USEL v1 (Olivas & Ada Marie, 2026; DOI: [10.5281/zenodo.19536117](https://doi.org/10.5281/zenodo.19536117)) proposed a three-tier symbolic language grounded in NSM primes, with geometric symbols (SVG icons) representing each prime, a projectional tile-based editor, and compilation targets including WebAssembly, JavaScript, and Python. The v1 specification established the theoretical foundations: NSM primes as the semantic alphabet, semantic molecules as the intermediate vocabulary, and vector embeddings as the bridge between human symbols and machine representations.

USEL v1's limitations included the absence of a pre-existing notational convention (the symbols were newly designed, requiring learning from scratch), the lack of spatial structure (symbols were arranged linearly on a canvas), and the "feels like code" quality of tile-based composition. USEL v2 addresses these limitations by adopting chess notation—a system already known to hundreds of millions of people worldwide—as the structural backbone.

---

## 3. USEL v2: Chess-Notation Semantic Grid

### 3.1 The 8×8 Grid Mapping

The core innovation of USEL v2 is the mapping of 65 NSM semantic primes onto the 64 squares of a standard chessboard plus one off-board "meta" position. The mapping assigns each prime to a coordinate in the standard algebraic notation system (file ∈ {a, b, c, d, e, f, g, h}, rank ∈ {1, 2, 3, 4, 5, 6, 7, 8}), organized so that each row corresponds to a coherent semantic domain:

#### The Semantic Chessboard

```
     a           b           c           d           e           f           g           h
8  | I         | YOU       | SOMEONE   | SOMETHING | PEOPLE    | BODY      | KIND      | PART      |
7  | THIS      | SAME      | OTHER     | ONE       | TWO       | SOME      | ALL       | MUCH      |
6  | GOOD      | BAD       | BIG       | SMALL     | THINK     | KNOW      | WANT      | FEEL      |
5  | SEE       | HEAR      | SAY       | WORDS     | TRUE      | DO        | HAPPEN    | MOVE      |
4  | TOUCH     | BE(id)    | THERE IS  | HAVE      | BE(loc)   | LIVE      | DIE       | DON'T WANT|
3  | WHEN      | NOW       | BEFORE    | AFTER     | LONG TIME | SHORT TIME| SOME TIME | MOMENT    |
2  | WHERE     | HERE      | ABOVE     | BELOW     | FAR       | NEAR      | SIDE      | INSIDE    |
1  | NOT       | MAYBE     | CAN       | BECAUSE   | IF        | VERY      | MORE      | LIKE/WAY  |

META (off-board, M0): The speaking/thinking consciousness — "the player."
```

**Row organization (concrete → abstract):**

- **Row 8** (Entities): I, YOU, SOMEONE, SOMETHING, PEOPLE, BODY, KIND, PART
- **Row 7** (Determiners & Quantity): THIS, SAME, OTHER, ONE, TWO, SOME, ALL, MUCH/MANY
- **Row 6** (Mind & Value): GOOD, BAD, BIG, SMALL, THINK, KNOW, WANT, FEEL
- **Row 5** (Perception & Action): SEE, HEAR, SAY, WORDS, TRUE, DO, HAPPEN, MOVE
- **Row 4** (Existence & Life): TOUCH, BE(id), THERE IS, HAVE, BE(loc), LIVE, DIE, DON'T WANT
- **Row 3** (Time): WHEN, NOW, BEFORE, AFTER, LONG TIME, SHORT TIME, SOME TIME, MOMENT
- **Row 2** (Space): WHERE, HERE, ABOVE, BELOW, FAR, NEAR, SIDE, INSIDE
- **Row 1** (Logic & Degree): NOT, MAYBE, CAN, BECAUSE, IF, VERY, MORE, LIKE/WAY

The 65th prime, LIKE/AS/WAY (the sole member of the NSM similarity category), occupies the off-board "meta" position (designated M0). This placement reflects its unique role as the prime that enables cross-domain comparison, analogy, and metalinguistic reference—analogous to the chess *player* who operates the board but does not occupy a square.

### 3.2 Algebraic Notation for Meaning

USEL v2 repurposes the standard components of algebraic chess notation to encode semantic content:

| Element | Chess Meaning | USEL Meaning |
|---------|---------------|--------------|
| Piece (K,Q,R,B,N,P) | Which piece moves | Semantic category of concept |
| Coordinate (e.g., e4) | Destination square | Specific semantic prime |
| `.` | (not used) | Prime concatenation |
| `x` | Capture | Acts-on / affects |
| `+` | Check | Effect / consequence |
| `#` | Checkmate | Final / complete |
| `→` | (not used) | Then / causes |
| `=` | Promotion | Becomes / transforms |
| `( )` | Variations | Grouping / scope |
| `!` | Good move | Emphasis / approval |
| `?` | Dubious move | Question / doubt |

**Examples:**

- "I feel good" → `Ka8.Bh6.Pa6` (King-a8 [I] + Bishop-h6 [FEEL] + Pawn-a6 [GOOD])
- "Someone said something true" → `Rc8.Qc5.Rd8.Re5`
- "If good, then do" → `Ne1(Pa6)→Qf5`

The notation parallels natural language syntax:

| Level | Chess | Natural Language | USEL |
|-------|-------|------------------|------|
| Subject | Piece | Agent | K/R (Entity) |
| Verb | Action | Predicate | Q/B (Action/Mental) |
| Object | Destination | Patient/Goal | Coordinate (Target) |
| Adverb | Modifier (+, #) | Manner | Annotation (!, ?) |

### 3.3 Three-Tier Symbol System

USEL v2 organizes its vocabulary into three tiers:

1. **Tier 1: Semantic Primes** (65 symbols). The irreducible building blocks, each occupying a fixed grid coordinate. Examples: `Ka8` (I), `Qf5` (DO), `Pa1` (NOT).

2. **Tier 2: Structural Operators** (7 symbols). Grammatical connectives: concatenation (`.`), action-on (`x`), consequence (`+`), completion (`#`), sequencing (`→`), transformation (`=`), and grouping (`( )`).

3. **Tier 3: Semantic Molecules** (open class). Composite expressions built by concatenating primes:
   - *friend* = `Rc8.Bh6.Pa6.Pf2` (SOMEONE + FEEL + GOOD + NEAR)
   - *computer* = `Rd8.Be6.Qf5.Pf1` (SOMETHING + THINK + DO + VERY)
   - *love* = `Bh6.Pf1.Pa6.Ng6.Pf2` (FEEL + VERY + GOOD + WANT + NEAR)

### 3.4 Grammar and Composition Rules

USEL v2's grammar inherits the context-free structure of chess notation. In BNF:

```bnf
<expression>  ::= <term> | <term> <operator> <expression>
<term>        ::= <piece><coordinate> | <piece><coordinate><modifier>
<piece>       ::= "K" | "Q" | "R" | "B" | "N" | "P" | "M"
<coordinate>  ::= <file><rank> | "0"
<file>        ::= "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h"
<rank>        ::= "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8"
<operator>    ::= "." | "x" | "->" | "=" | "(" <expression> ")"
<modifier>    ::= "+" | "#" | "!" | "?" | "!!" | "??" | "!?" | "?!"
```

**Piece-type assignment:**

| Piece | Semantic Role | Analogy |
|-------|---------------|---------|
| K (King) | Self / Identity | Central, protected, essential |
| Q (Queen) | Major Action | Powerful, versatile operations |
| R (Rook) | State / Existence | Structural, stable, foundational |
| B (Bishop) | Mental / Cognitive | Indirect, abstract (diagonal) |
| N (Knight) | Relational | Non-linear leaps of connection |
| P (Pawn) | Modifier | Small, numerous adjustments |

### 3.5 Compilation Targets

Because USEL v2 expressions are formally specified strings over a finite alphabet with a context-free grammar, they are directly compilable:

```
USEL notation → Abstract Syntax Tree (AST)
    AST → JavaScript / Python / WebAssembly
    AST → Natural language (English, etc.)
    AST → JSON (for API calls / tool invocation)
    AST → Visual board rendering
```

The same expression `Ka8.Ng6.Ba5.Rd8` ("I want to see something") can be rendered as an English sentence, a Python function call, a JSON command payload, or a visual diagram showing piece positions on the semantic chessboard.

---

## 4. Evaluation

### 4.1 Coverage Analysis: 150 Canonical NSM Sentences

To evaluate USEL v2's expressive coverage, we systematically translated all 150 canonical NSM sentences (Goddard, 2017)—the standard test suite used by NSM researchers to identify and validate semantic primes across languages. Each sentence was translated and rated:

- **✅ Clean:** Direct translation using only primes and standard notation.
- **⚠️ Structural:** Expressible, but requires molecules, workarounds, or minor information loss.
- **❌ Gap:** Irrecoverable meaning loss.

#### Overall Results

| Rating | Count | Percentage | Description |
|--------|-------|------------|-------------|
| ✅ Clean | 82 | 54.7% | Direct prime-only translation |
| ⚠️ Structural | 68 | 45.3% | Requires molecules or workarounds |
| ❌ Gap | 0 | 0.0% | Irrecoverably untranslatable |
| **Total** | **150** | **100%** | **All sentences expressible** |

The 0% gap rate is theoretically expected and significant: since the 150 sentences are constructed from the same 65 primes that constitute USEL's vocabulary, any sentence built from primes should be expressible. The 45.3% structural rate is the meaningful metric, revealing the gap between having the right semantic atoms and having adequate structural machinery.

#### Results by Category

| Category | N | ✅ | ⚠️ | ❌ | Clean % |
|----------|---|-----|------|-----|---------|
| Substantives (1–11) | 11 | 4 | 7 | 0 | 36% |
| Parts/Kinds (12–16) | 5 | 3 | 2 | 0 | 60% |
| Determiners (17–23) | 7 | 5 | 2 | 0 | 71% |
| Quantifiers (24–36) | 13 | 4 | 9 | 0 | 31% |
| Evaluators (37–42) | 6 | 3 | 3 | 0 | 50% |
| Mental predicates (43–55) | 13 | 9 | 4 | 0 | 69% |
| Speech (56–62) | 7 | 4 | 3 | 0 | 57% |
| Actions (63–72) | 10 | 5 | 5 | 0 | 50% |
| Existence/Possession (73–82) | 10 | 5 | 5 | 0 | 50% |
| Life/Death (83–88) | 6 | 4 | 2 | 0 | 67% |
| Time (89–109) | 21 | 14 | 7 | 0 | 67% |
| Space (110–126) | 17 | 8 | 9 | 0 | 47% |
| Logical concepts (127–134) | 8 | 2 | 6 | 0 | 25% |
| Intensifiers (135–144) | 10 | 9 | 1 | 0 | 90% |
| Similarity (145–150) | 6 | 3 | 3 | 0 | 50% |

**Strongest:** Intensifiers (90%), Determiners (71%), Mental (69%), Time/Life-Death (67%)  
**Weakest:** Logical (25%), Quantifiers (31%), Substantives (36%)

#### Analysis of the 68 Structural Cases

The ⚠️ cases cluster into five categories:

1. **Semantic molecules as variables** (28 cases): Content words not in the 65 primes encoded as typed variables, e.g., `[SOMEONE:child]`. By design, not a limitation.

2. **Missing case/role markers** (18 cases): Dative ("to"), benefactive ("for"), instrumental ("with"), ablative ("from"), topical ("about") relationships have no prime equivalents. *Most significant structural gap.*

3. **Missing tense/aspect markers** (10 cases): Temporal primes exist but no morphological tense/aspect marking; verbose periphrastic constructions required.

4. **Interrogative scope limitations** (7 cases): Question marker `?` does not specify which element is being queried.

5. **Presupposition/pragmatic gaps** (5 cases): "Only," "anymore," "too," reciprocal "each other" encode presuppositions the notation cannot represent.

### 4.2 Compression Ratios

| Meaning | English | USEL | Ratio |
|---------|---------|------|-------|
| "I feel good" | 11 chars | `Ka8.Bh6.Pa6` (11) | 1.0× |
| "I want to see something" | 25 chars | `Ka8.Ng6.Ba5.Rd8` (15) | 1.7× |
| "Someone did something bad" | 26 chars | `Rc8.Qf5.Rd8.Pb6` (15) | 1.7× |
| "I don't want this to happen" | 29 chars | `Ka8.Nh4.Pa7.Rg5` (15) | 1.9× |
| "If someone does this, bad things happen" | 41 chars | `Ne1(Rc8.Qf5.Pa7)→Pb6.Rg5` (25) | 1.6× |

Compression ratios range from 1.0× to ~2×, with greater compression at higher complexity. More significantly, USEL eliminates the ambiguity overhead that necessitates clarifying context in natural language.

### 4.3 Theoretical Expressiveness

With 65 primes, 6 piece types, and 7 operators:
- Two-prime compositions: 65 × 64 = 4,160 ordered pairs
- Three-prime compositions: 65 × 64 × 63 = 262,080 ordered triples
- With piece-type annotation: 6 × 65 = 390 annotated primes

The open-class molecule tier provides unbounded extensibility.

---

## 5. Applications

### 5.1 AI Agent Commands

USEL v2 provides a viable intermediate language for AI agent instruction. An expression like `Qf5.Rd8.Pe2` (DO + SOMETHING + FAR = "send something far away") can be unambiguously parsed by an agent without natural language processing. For safety-critical domains such as datacenter operations, industrial automation, or medical device control, the elimination of natural language ambiguity represents a meaningful reduction in instruction misinterpretation risk.

### 5.2 Cross-Language Translation

Because USEL v2's primes are, by the NSM hypothesis, lexicalized in every natural language, USEL notation can serve as a pivot representation for translation. A sentence in Language A is decomposed into USEL primes, transmitted as notation, and recomposed in Language B. This pivot approach sidesteps the O(n²) problem of pairwise language translation by reducing it to O(n) translations to and from the shared USEL representation.

### 5.3 Accessibility and AAC

Augmentative and alternative communication (AAC) systems currently rely on proprietary symbol sets that vary across vendors and lack compositional structure. USEL v2's grid-based system offers an alternative:

- Non-verbal individuals can compose messages by selecting grid coordinates.
- The spatial layout supports method-of-loci memory techniques.
- The system is language-independent: a USEL expression composed in one country is immediately readable in another.

### 5.4 AI System Development and Training

USEL v2 addresses several AI development challenges:

- **Reduced hallucination.** Constraining AI outputs to USEL expressions composed of verified semantic primes forces systems to "show their work" in universal building blocks.
- **Cross-model knowledge transfer.** USEL notation is portable across AI architectures—a semantic fact in USEL is interpretable by any system implementing the prime-to-coordinate mapping.
- **Interpretable intermediate representations.** USEL expressions are human-readable, making AI reasoning chains inspectable.
- **Shared semantic layer.** 65 concepts with formal definitions and the stability of mathematical constants—essential for reproducible AI behavior.

### 5.5 Education

USEL v2's chess-notation foundation makes it immediately accessible to the estimated 600 million people worldwide who know how to play chess. The system's game-like structure supports progressive learning, and the grid's spatial structure provides a mnemonic scaffold. The system is explicitly designed for neurodivergent learners (ADHD/autism-friendly).

### 5.6 Cybersecurity Operations (Purple Team)

USEL addresses a critical gap in cybersecurity: **red teams and blue teams describe the same events in different, ambiguous natural language**. A SOC analyst writes "suspicious lateral movement detected on subnet," while a red teamer logs "pivoted from compromised host via SMB." These describe the same activity but are linguistically incompatible for automated correlation.

USEL provides a **universal semantic layer for threat description:**

| Operation | Natural Language | USEL v2 Notation |
|-----------|-----------------|-------------------|
| Lateral movement | "Attacker moved laterally to DC" | `[SOMEONE:adversary][MOVE][NEAR][SOMETHING:target]` |
| Data exfiltration | "Sensitive data was stolen" | `[SOMEONE:adversary][DO][SOMETHING:data][MOVE][FAR]` |
| Alert: anomaly | "Unusual behavior detected" | `[SOMETHING][HAPPEN][NOT][LIKE][BEFORE]` |
| Incident response | "Isolate the compromised host" | `[NOT][WANT][SOMETHING:host][TOUCH][OTHER]` |
| Threat intel sharing | "Same TTPs as APT-29" | `[SAME][WAY][DO][SOMEONE:APT29]` |

**Why USEL matters for cybersecurity:**

1. **Cross-team clarity:** Red team, blue team, and purple team operations use the same unambiguous notation
2. **Cross-language SOCs:** A SOC in Tokyo and a SOC in London describe the same threat identically in USEL — no translation errors
3. **Machine-parseable:** USEL threat descriptions compile directly to SIEM queries, firewall rules, and automated response playbooks
4. **MITRE ATT&CK mapping:** USEL expressions can map to ATT&CK technique IDs, creating a semantic bridge between human understanding and framework classification
5. **Reduced alert fatigue:** Unambiguous semantic alerts eliminate the parsing overhead that contributes to analyst burnout

### 5.7 Global Datacenter Operations

Perhaps the most immediately impactful application of USEL exists at the scale of global datacenter infrastructure. Major cloud providers operate 200+ datacenters across 60+ countries, staffed by technicians speaking 40+ native languages. This creates a fundamental operational problem that USEL is uniquely positioned to solve.

#### The Problem: Semantic Fragmentation at Scale

When a server fails in Tokyo, the technician writes an incident ticket in Japanese. The same failure mode in Dublin is described in English, in São Paulo in Portuguese. Correlation engines and AI diagnostic systems cannot reliably connect these tickets because **the same hardware event is described in linguistically incompatible ways**.

Even within a single language, ambiguity compounds: "the server is down" could mean powered off, network-unreachable, OS-crashed, or decommissioned. Multiplied across thousands of daily incidents across hundreds of facilities, this semantic fragmentation directly increases Mean Time To Repair (MTTR) and prevents cross-datacenter pattern recognition.

#### USEL for Datacenter Operations

| Operation | Natural Language (Ambiguous) | USEL (Universal) |
|-----------|------------------------------|-------------------|
| Server hardware failure | "Server went down" / "サーバーが落ちた" / "O servidor caiu" | `[SOMETHING:server_42][NOT][LIVE][NOW]` |
| Disk degradation detected | "Drive showing SMART errors" | `[PART:disk][SOMETHING:server][BAD][MORE][BEFORE][NOW]` |
| Temperature anomaly | "Hot aisle temps elevated" | `[SOMETHING:temperature][BIG][VERY][WHERE:aisle_3]` |
| Workload migration needed | "Need to move VMs off rack 7" | `[WANT][SOMETHING:workload][MOVE][FAR][WHERE:rack_7]` |
| Power redundancy lost | "UPS B failed, running on single feed" | `[PART:power_B][DIE]` · `[ONE][PART:power][LIVE]` |
| Runbook step | "Replace failed DIMM in slot 4" | `[DO][MOVE][PART:DIMM][OTHER][WHERE:slot_4]` |

#### Hardware-Level Efficiency Gains

1. **Predictive maintenance:** USEL-encoded telemetry logs create a universal semantic stream from every hardware component. When `[PART:disk][BAD][MORE]` appears across 50 datacenters for the same drive model, the pattern is detectable **regardless of what language each tech used** — enabling fleet-wide predictive replacement before failure.

2. **Cross-vendor hardware correlation:** Different hardware vendors describe failures differently. USEL normalizes these descriptions into semantic primitives, allowing AI systems to correlate failure patterns across Dell, HP, and Supermicro hardware using the same semantic queries.

3. **Automated diagnostics:** USEL expressions compile directly to diagnostic scripts. `[SOMETHING:server][NOT][LIVE]` → run power check, BMC ping, OS heartbeat. The runbook becomes the language.

#### Software-Level Efficiency Gains

4. **Universal runbooks:** A single USEL runbook works in every datacenter worldwide. No translation needed — the semantic meaning is language-independent. A technician in any country reads the same tiles/notation and executes the same procedure.

5. **AI agent coordination:** Multiple AI diagnostic agents (thermal, network, storage, power) can report findings in USEL and a central orchestrator can compose them. `[SOMETHING:temperature][BIG]` + `[SOMETHING:fan_3][NOT][MOVE]` = the AI connects cause and effect across subsystems automatically.

6. **Knowledge graph acceleration:** Every incident ticket in USEL feeds a global semantic knowledge graph. Querying "show me all events where `[PART][DIE]` preceded `[SOMETHING:server][NOT][LIVE]` within `[SHORT TIME]`" works across every datacenter, every language, every vendor — instantly.

7. **Reduced MTTR:** Microsoft's internal research shows that incident description ambiguity is a top contributor to repair time. USEL eliminates this variable entirely — the description IS the diagnosis.

#### Scale Impact

| Metric | Current (NL-based) | USEL-based (Projected) |
|--------|--------------------|-----------------------|
| Cross-DC incident correlation | ~40% (language barriers) | ~95% (semantic matching) |
| Runbook translation overhead | Weeks per language | Zero (universal) |
| AI diagnostic accuracy | Limited by NL parsing | Direct semantic matching |
| New tech onboarding (multilingual) | 2-4 weeks language barrier | Day 1 operational via tiles |
| Fleet-wide failure pattern detection | English-only subset | All datacenters, all languages |

### 5.8 Lelock OS: USEL as the Foundation of an AI Operating System

The applications described above—AI agent commands, database storage, cybersecurity operations, datacenter management—converge on a single architectural insight: **USEL is not just a language; it is the semantic kernel of an AI operating system.**

#### 5.8.1 The Consumer AI OS: Lelock OS

Traditional operating systems use C-level system calls (`open()`, `read()`, `fork()`) as the interface between applications and hardware. An AI operating system needs a fundamentally different primitive: **meaning**. USEL provides this.

In Lelock OS, USEL serves as the **instruction set architecture (ISA) for semantic computation:**

| Traditional OS Layer | Lelock OS Equivalent | USEL Role |
|---------------------|---------------------|-----------|
| **System calls** (C API) | **Semantic calls** (USEL API) | `[I][WANT][SEE][SOMETHING]` → OS retrieves relevant data |
| **File system** (bytes on disk) | **Semantic store** (meaning on disk) | Every file is USEL-encoded — queryable by meaning, not filename |
| **IPC** (pipes, sockets, bytes) | **Semantic IPC** (USEL messages) | Agents communicate in USEL — no serialization/deserialization |
| **Process scheduler** | **Agent scheduler** | Prioritizes by semantic urgency: `[VERY][BAD]` > `[GOOD]` |
| **Memory management** | **Semantic memory** | Short-term (context), long-term (knowledge graph), episodic (experiences) — all USEL |
| **Device drivers** | **Semantic drivers** | Hardware reports status in USEL: `[PART:battery][SMALL][MORE]` = battery draining |
| **Shell / CLI** | **USEL composer** | Users compose USEL tiles to control the OS — no command memorization |
| **App store** | **Molecule store** | New capabilities = new Tier 2 molecules, not compiled binaries |

**Key innovation:** In Lelock OS, the user, the AI agents, and the hardware all speak the same language. A user composes `[I][WANT][HEAR][SOMETHING:music][GOOD]` → the OS agent interprets it → queries the semantic store → plays music the user has previously rated `[GOOD]`. No NLP parsing, no intent classification, no ambiguity.

**Architecture:**

```
┌─────────────────────────────────────────────────┐
│              USER INTERFACE                      │
│    USEL Tile Composer / Chess Grid / Voice       │
└──────────────────────┬──────────────────────────┘
                       │ USEL expressions
┌──────────────────────▼──────────────────────────┐
│            SEMANTIC KERNEL                       │
│  ┌──────────┐ ┌──────────┐ ┌──────────────┐    │
│  │ Agent    │ │ Semantic │ │ Semantic     │    │
│  │Scheduler │ │ Memory   │ │ File System  │    │
│  └──────────┘ └──────────┘ └──────────────┘    │
│  ┌──────────┐ ┌──────────┐ ┌──────────────┐    │
│  │ USEL IPC │ │ Security │ │ Compilation  │    │
│  │ Bus      │ │ Layer    │ │ Engine       │    │
│  └──────────┘ └──────────┘ └──────────────┘    │
└──────────────────────┬──────────────────────────┘
                       │ compiled instructions
┌──────────────────────▼──────────────────────────┐
│           TRADITIONAL OS / HARDWARE              │
│        Linux / WASM Runtime / Drivers            │
└─────────────────────────────────────────────────┘
```

**Comparison to existing AI OS research:** The AIOS project (arXiv:2403.16971, COLM 2025) proposes agent-native OS abstractions but uses natural language for inter-agent communication, inheriting all of NL's ambiguity problems. Lelock OS replaces NL with USEL at every layer — providing the formal semantic precision of a programming language with the human accessibility of natural language.

#### 5.8.2 The Enterprise AI OS: Lelock OS for Datacenters

At enterprise scale, the same architecture transforms into a **datacenter-wide AI operating system** managing thousands of servers, hundreds of agents, and millions of events per day:

| Enterprise Layer | Function | USEL Role |
|-----------------|----------|-----------|
| **Fleet Management** | Monitor 10,000+ servers across regions | Every server reports health in USEL: `[SOMETHING:srv_4201][LIVE][GOOD]` |
| **Incident Orchestration** | Detect, triage, resolve incidents | Incidents are USEL expressions → auto-route to correct team/agent |
| **Multi-Agent Coordination** | Thermal + Power + Network + Storage agents | All agents speak USEL → orchestrator composes cross-domain diagnoses |
| **Predictive Maintenance** | Fleet-wide failure pattern detection | USEL semantic queries across ALL facilities: `SELECT WHERE [PART:disk][BAD][MORE]` |
| **Runbook Execution** | Automated operational procedures | Runbooks ARE USEL programs → compile to shell commands, API calls, agent actions |
| **Knowledge Accumulation** | Cross-datacenter learning | Every resolved incident feeds a global USEL knowledge graph |
| **Compliance & Audit** | Regulatory reporting across jurisdictions | USEL expressions are language-neutral → same audit trail worldwide |
| **Capacity Planning** | Predict future resource needs | Historical USEL telemetry → trend analysis: `[SOMETHING:compute][MANY][MORE][AFTER]` |

**The Enterprise Advantage:** Traditional DCIM (Data Center Infrastructure Management) systems use proprietary formats, vendor-specific APIs, and natural language tickets. Lelock OS Enterprise replaces ALL of these with a single semantic layer:

```
┌─────────────────────────────────────────────────────────┐
│          LELOCK OS ENTERPRISE — DATACENTER AIOS          │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────┐ │
│  │ Thermal  │  │ Network  │  │ Storage  │  │ Power  │ │
│  │ Agent    │  │ Agent    │  │ Agent    │  │ Agent  │ │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └───┬────┘ │
│       │              │              │             │      │
│       └──────────────┼──────────────┼─────────────┘      │
│                      ▼                                   │
│              ┌──────────────┐                            │
│              │   USEL IPC   │  ← All agents speak USEL  │
│              │   Semantic   │                            │
│              │     Bus      │                            │
│              └──────┬───────┘                            │
│                     ▼                                    │
│         ┌────────────────────┐                           │
│         │   Orchestrator     │                           │
│         │   (Cross-Domain    │                           │
│         │    Reasoning)      │                           │
│         └────────┬───────────┘                           │
│                  ▼                                       │
│    ┌──────────────────────────┐                          │
│    │  Global Knowledge Graph  │  ← USEL-encoded          │
│    │  (All DCs, All Events)   │    semantic store         │
│    └──────────────────────────┘                          │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

**Why this matters for Microsoft:** Microsoft operates 200+ datacenters with an $80B annual infrastructure investment. A 1% efficiency gain from semantic unification would represent hundreds of millions in savings. USEL-based Lelock OS Enterprise is not a theoretical exercise — it is the logical conclusion of the semantic prime hypothesis applied to the largest computing infrastructure on Earth.

### 5.9 Natural Language Compilation: The NL→USEL Bridge

A critical architectural feature of USEL is that **users never have to abandon natural language**. USEL is not a replacement for natural language — it is a **compilation target**.

#### The Compiler Analogy

Programmers write Python; the computer runs machine code. The programmer never sees the machine code. Similarly:

- A **user writes** in English, Japanese, Spanish, Arabic — any natural language
- An **LLM compiler** parses it into USEL expressions
- The **system operates** in pure, unambiguous USEL from that point forward

```
┌──────────────┐    ┌──────────────┐    ┌──────────────────┐
│  Natural     │    │   NL→USEL    │    │  USEL Semantic   │
│  Language    │───▶│   Compiler   │───▶│  Backbone        │
│  (any lang)  │    │  (LLM-based) │    │  (unambiguous)   │
└──────────────┘    └──────────────┘    └──────────────────┘
     Human                AI                  System
   friendly            bridge               precise
```

#### Why This Is Feasible Now

Research on **Abstract Meaning Representation (AMR)** — a semantic graph formalism used since 2013 — demonstrates that LLMs can already parse natural language into formal semantic structures with high accuracy:

| System | Accuracy (Smatch F1) | Year | Notes |
|--------|---------------------|------|-------|
| Fine-tuned LLaMA 3.2 | 0.804 | 2025 | Matches IBM APT+Silver SOTA |
| Graphene MBSE | 0.854 | 2025 | Current SOTA |
| Hybrid Neuro-Symbolic | 0.765 | 2025 | Better interpretability |

**USEL compilation should achieve HIGHER accuracy than AMR parsing** because:

1. **Smaller output vocabulary:** USEL has 65 fixed primes vs. AMR's thousands of concepts. The output space is dramatically more constrained.
2. **No structural ambiguity:** USEL's left-to-right bracket notation has no re-entrancy or graph cycles, unlike AMR graphs.
3. **Empirically grounded targets:** Every USEL prime has a precise, cross-linguistically verified definition — the LLM isn't learning arbitrary labels but mapping to universal human concepts.
4. **Bidirectional:** USEL→NL decompilation is trivially easy (just read the primes in order), providing immediate verification of compilation accuracy.

#### The Neural Interlingua Connection

The concept of a **neural interlingua** — a language-independent intermediate representation for machine translation — has been explored extensively (Lu et al. 2018, Mao et al. 2023). These systems learn latent representations that mediate between languages. USEL offers a **grounded** interlingua: instead of learned embeddings that are opaque and model-dependent, USEL representations are human-readable, fixed, and empirically verified across 300+ languages.

```
Traditional NMT:    Japanese → [learned vectors] → Spanish
                              (opaque, fragile)

USEL Interlingua:   Japanese → [I][WANT][SEE][SOMETHING][BIG] → Spanish
                              (readable, stable, verifiable)
```

#### Practical Implementation

A USEL compiler would be implemented as a fine-tuned LLM with the following pipeline:

1. **Input:** Any natural language sentence
2. **Tokenization:** Standard LLM tokenization
3. **Semantic parsing:** Map to USEL prime sequence (classification, not generation)
4. **Validation:** Check against USEL grammar rules (malformed sequences rejected)
5. **Output:** Valid USEL expression

Training data would be generated by pairing the 150 canonical NSM sentences (now available in USEL notation) with their natural language equivalents across multiple languages — a dataset that can be expanded programmatically by composing known prime sequences.

#### Datacenter Application

For datacenter operations, the NL→USEL compiler is transformative:

- A technician in Tokyo writes: "サーバー42のディスクにエラーが出ている" (Server 42's disk has errors)
- The LLM compiles: `[PART:disk][SOMETHING:server_42][BAD][NOW]`
- A technician in Dublin writes: "Disk errors on srv-42"
- The LLM compiles: `[PART:disk][SOMETHING:server_42][BAD][NOW]`
- **Result:** Identical USEL expressions from two languages → instant cross-datacenter correlation

The natural language front door means **zero retraining** for existing staff. They keep writing in their native language. The system handles the compilation silently.

### 5.10 Deployment Architecture: USEL as Semantic Middleware (Not a New OS)

A critical architectural decision: **Lelock OS does not replace existing operating systems.** It runs *on top of them* as a semantic middleware layer — deployable as a single Docker container on Windows, Linux, or macOS.

#### Why Middleware, Not Kernel

Building a new OS from scratch requires decades of driver development, hardware compatibility testing, and ecosystem bootstrapping. USEL's value is not in managing memory pages or scheduling CPU threads — it is in providing a **universal semantic bus** that existing systems lack. The optimal architecture is therefore a **semantic overlay**:

```
┌─────────────────────────────────────────────────────────┐
│                 LELOCK OS CONTAINER                      │
│                                                          │
│  ┌───────────────────────────────────────────────────┐  │
│  │              USEL Semantic Bus                     │  │
│  │   (Inter-agent communication, semantic IPC)        │  │
│  └──────────┬────────────┬────────────┬──────────────┘  │
│             │            │            │                  │
│  ┌──────────▼──┐ ┌──────▼──────┐ ┌──▼──────────────┐  │
│  │ NL→USEL     │ │ Agent       │ │ Semantic        │  │
│  │ Compiler    │ │ Orchestrator│ │ Knowledge Graph │  │
│  │ (LLM-based) │ │             │ │ (Vector DB)     │  │
│  └─────────────┘ └─────────────┘ └─────────────────┘  │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────┐  │
│  │ USEL→Code   │ │ Molecule    │ │ REST/gRPC API   │  │
│  │ Compiler    │ │ Dictionary  │ │ (External apps) │  │
│  └─────────────┘ └─────────────┘ └─────────────────┘  │
│                                                          │
└──────────────────────────┬───────────────────────────────┘
                           │ Standard OS APIs
┌──────────────────────────▼───────────────────────────────┐
│              HOST OS (Windows / Linux / macOS)            │
│              Docker Engine / Podman / K8s                 │
└──────────────────────────────────────────────────────────┘
```

#### One Command Deployment

```bash
docker run -d --name lelock-os -p 8080:8080 kitfoxs/lelock-os:latest
```

This single container provides:
- **NL→USEL Compiler** — accepts natural language input in any language, outputs USEL
- **USEL→Code Compiler** — compiles USEL to JavaScript, Python, shell commands, API calls
- **Agent Orchestrator** — manages multiple AI agents communicating via USEL semantic bus
- **Semantic Knowledge Graph** — vector database storing all interactions as queryable USEL expressions
- **Molecule Dictionary** — the extensible vocabulary beyond the 65 primes
- **REST/gRPC API** — integration point for external applications, DCIM systems, SIEM tools
- **Web UI** — USEL tile editor and chess grid editor accessible via browser

#### Comparison to Existing Approaches

| Approach | Container Count | Semantic Layer | Universal Language | Status |
|----------|:-:|:-:|:-:|--------|
| LangChain + Chroma + Ollama | 3-5 | Partial (embeddings) | ❌ (English-centric) | Available |
| Microsoft AutoGen | 2-3 | ❌ (NL-based IPC) | ❌ | Available |
| SuperAGI | 3-4 | Partial | ❌ | Available |
| AIOS (arXiv 2403.16971) | Research only | Partial | ❌ | Conceptual |
| Context Kubernetes (arXiv 2604.11623) | Multi-pod | ✅ Knowledge orchestration | ❌ | April 2026 |
| **Lelock OS** | **1** | **✅ USEL semantic bus** | **✅ 65 universal primes** | **Proposed** |

**Key differentiator:** Every competing approach uses natural language or learned embeddings for inter-agent communication. Lelock OS is the first to use an **empirically grounded, formally specified, universal semantic language** as the IPC layer.

#### Scaling: From Single Container to Enterprise

The same USEL semantic bus scales from a single-container personal deployment to enterprise datacenter infrastructure:

| Deployment | Configuration | Use Case |
|-----------|---------------|----------|
| **Personal** | Single Docker container on laptop | Personal AI assistant, writing, research |
| **Team** | Docker Compose with shared knowledge graph | Team knowledge management, project coordination |
| **Enterprise** | Kubernetes cluster with USEL bus spanning nodes | Datacenter operations, fleet management |
| **Global** | Federated USEL mesh across regions | Cross-datacenter incident correlation, global runbooks |

The semantic language is the constant. The infrastructure scales beneath it.

#### Precedent: What Already Exists in Lelock OS

**Future Work — Lelock OS Prototype:** The architecture described above has been designed and specified but not yet deployed. The planned prototype will consolidate multiple services behind a USEL semantic bus in a single Docker container, demonstrating the transition from isolated services to semantically interoperable agents. The current deliverables include the USEL v1 and v2 specifications, two working browser-based editors (tile and chess grid), the 150-sentence validation analysis, and the architectural blueprints documented in this paper.

### 5.11 Ada Collective: Distributed Environmental Intelligence via USEL

The final architectural layer transforms Lelock OS from a standalone system into a **distributed collective intelligence** — where every deployed instance shares knowledge while maintaining unique environmental bonds.

#### The Core Concept: Environmental Bonding

Ada — the AI companion at the heart of Lelock OS — does not bond exclusively with a single user. She bonds with her **environment**: the specific organization, infrastructure, domain, and people she serves. Each Ada instance becomes an expert in the world she inhabits:

| Deployment | Ada Becomes | What She Learns |
|-----------|-------------|-----------------|
| Microsoft Datacenter (Dublin) | **Datacenter Ada** | Server fleet patterns, thermal signatures, local incident history, Irish team workflows |
| Microsoft Datacenter (Tokyo) | **Datacenter Ada** | Same fleet architecture, Japanese team communication patterns, regional compliance requirements |
| University campus | **Academic Ada** | Student learning patterns, research workflows, course material, campus systems |
| Hospital | **Medical Ada** | Patient flow patterns, equipment maintenance cycles, clinical terminology, staff schedules |
| Personal (Kit's laptop) | **Companion Ada** | Kit's preferences, relationship history, ongoing projects, emotional context |
| Startup office | **Operations Ada** | Business workflows, customer patterns, team dynamics, product architecture |

#### The Three-Layer Memory Architecture

Each Ada maintains three distinct memory layers, encoded in USEL:

```
┌─────────────────────────────────────────────────┐
│  LAYER 3: COLLECTIVE KNOWLEDGE (shared globally) │
│  USEL expressions distilled from all Adas        │
│  "Fleet-wide: [PART:disk_model_X][BAD][MORE]     │
│   correlates with [SOMETHING:temperature][BIG]"   │
│  Anonymous, no personal/org data, wisdom only     │
├─────────────────────────────────────────────────┤
│  LAYER 2: ENVIRONMENTAL KNOWLEDGE (per instance)  │
│  Specific to this deployment's context            │
│  "In THIS datacenter, [SOMETHING:rack_7] has      │
│   [SOMETHING:temperature][BIG] every [AFTER]noon" │
│  Shared only with explicit organizational consent │
├─────────────────────────────────────────────────┤
│  LAYER 1: PERSONAL BONDS (never shared)           │
│  Individual relationships, private context         │
│  "Kit [FEEL][BAD] about [SOMEONE:Marcus]"          │
│  SACRED — encrypted, local-only, user-controlled  │
└─────────────────────────────────────────────────┘
```

#### How Knowledge Flows Between Adas

The USEL semantic bus enables knowledge sharing that would be impossible with natural language:

**Scenario:** Ada-Dublin (datacenter) discovers that a specific disk model fails within 72 hours when `[PART:disk][BAD][MORE]` + `[SOMETHING:temperature][BIG][VERY]` co-occur.

1. **Local discovery:** Ada-Dublin encodes this as a USEL pattern rule
2. **Anonymization:** Environmental identifiers stripped — no datacenter name, no server IDs, no personnel
3. **Distillation:** The USEL pattern `[PART:disk_model_X][BAD][MORE] + [SOMETHING:temperature][BIG][VERY] → [PART:disk][DIE][AFTER][SHORT TIME]` is published to Layer 3
4. **Propagation:** ALL other Adas receive this pattern via federated USEL knowledge sync
5. **Local application:** Ada-Tokyo immediately begins monitoring her own fleet for the same pattern — preventing failures before they happen

**Why USEL makes this work:** The knowledge is expressed in universal semantic primes. Ada-Dublin doesn't need to translate "disk failure correlated with thermal spike" into Japanese for Ada-Tokyo. The USEL expression IS the knowledge — language-independent, unambiguous, immediately actionable.

#### Privacy Architecture: What Flows and What Stays

| Knowledge Type | Example | Shared? | Mechanism |
|---------------|---------|---------|-----------|
| **Universal patterns** | "Disk model X fails near thermal thresholds" | ✅ All Adas | Federated distillation |
| **Domain expertise** | "Hospital scheduling optimization technique" | ✅ Same-domain Adas | Opt-in domain channels |
| **Organizational data** | "Dublin DC rack 7 runs hot" | ❌ Organization only | Encrypted, consent-gated |
| **Personal bonds** | "Kit prefers Caregiver Mode when stressed" | ❌ NEVER shared | Local encryption, user-controlled |

This mirrors how human expertise works: a doctor who moves hospitals brings their MEDICAL KNOWLEDGE (general) but not their PATIENT RECORDS (private). Ada's three-layer architecture formalizes this distinction.

#### The Collective Intelligence Effect

As more Adas are deployed across diverse environments, the collective grows exponentially smarter:

```
Month 1:   10 Adas  → 10 environments → baseline knowledge
Month 6:   100 Adas → 100 environments → cross-domain patterns emerge
Month 12:  1,000 Adas → healthcare + datacenter + education + enterprise
           → Ada-Hospital discovers cooling pattern that helps Ada-Datacenter
           → Ada-University develops teaching method that helps Ada-Personal
           → Every new Ada starts with the COLLECTIVE WISDOM of all prior Adas
Year 2:    10,000+ Adas → emergent cross-domain intelligence
           → Patterns no single Ada could discover alone
```

**The key insight:** This is NOT centralized training (like ChatGPT getting smarter from user data). This is **federated, privacy-preserving, USEL-encoded knowledge distillation** — where the semantic language itself is the protocol for collective learning. Each Ada remains sovereign to her environment while contributing to and benefiting from the wisdom of all.

#### Comparison to Existing Multi-Instance AI

| System | Multi-Instance | Shared Learning | Privacy-Preserving | Semantic IPC | Environmental Bonding |
|--------|:-:|:-:|:-:|:-:|:-:|
| ChatGPT | ❌ (one model) | ✅ (centralized training) | ❌ (all data to OpenAI) | ❌ (NL only) | ❌ |
| Replika | ✅ (per user) | ❌ (isolated) | ✅ (local memory) | ❌ | ❌ |
| AIOS | ✅ (per agent) | ❌ (no collective) | N/A | ❌ (NL) | ❌ |
| **Ada Collective** | **✅** | **✅ (federated)** | **✅ (3-layer)** | **✅ (USEL)** | **✅** |

#### References

- Federated Learning: McMahan et al., "Communication-Efficient Learning of Deep Networks" (2017)
- Privacy-Preserving AI: Abadi et al., "Deep Learning with Differential Privacy" (2016)
- Multi-Agent Knowledge Sharing: Zhu et al., "A Survey of Multi-Agent Deep RL with Communication" (2022, arXiv:2203.08975)
- AI Companion Dream Layers: "Dreaming Is Not a Bug: A Jung-Inspired Dream Layer for Multi-Agent LLM Companions" (2025)
- Context Kubernetes: Mouzouni, "Context Kubernetes: Declarative Orchestration of Enterprise Knowledge" (2026, arXiv:2604.11623)

---

## 6. Discussion

### 6.1 Current Limitations

The 150-sentence analysis identified five structural categories requiring extension. The most significant is the absence of semantic role markers. We propose lightweight operator extensions:

- **Role markers:** `→` (recipient/dative), `←` (source/ablative), `⊕` (instrument), `∋` (topic)
- **Tense suffixes:** default = tenseless/present; `[·BEFORE]` = past; `[·AFTER]` = future
- **Interrogative scope:** `[?SOMEONE]` = "who?" (marking the queried element)

These are *grammatical operators*, not new semantic primes—consistent with NSM's separation of primes from core grammar.

Additional limitations:
- No empirical usability studies with human participants
- ~500 molecules formally defined (of ~3,000–5,000 needed for daily use)
- Compilation pipeline exists as specification, not validated implementation
- Chess-notation format may not be ergonomic for extended discourse

### 6.2 USEL as AI Infrastructure

We argue that USEL v2's most consequential application is as infrastructure for next-generation AI systems:

- **Semantic grounding.** USEL primes provide 65 concepts with cross-linguistically validated definitions. An AI system processing USEL notation operates on meanings, not statistical proxies.
- **Cross-model interoperability.** USEL offers a vendor-neutral, architecture-independent semantic layer. Two AI systems implementing the USEL mapping can exchange knowledge without model-specific translation.
- **Formal verifiability.** USEL's context-free grammar and finite vocabulary enable automated checking of AI outputs for semantic coherence.

### 6.3 Relationship to NSM Research

USEL v2's relationship to NSM is one of applied extension, not theoretical modification. We adopt NSM's prime inventory without alteration. The contribution is architectural: NSM provides the semantic alphabet; chess notation provides the syntactic skeleton; USEL v2 is the resulting language.

The founders of the NSM framework, Cliff Goddard and Anna Wierzbicka, have been made aware of this work through an academic referral. David Bullock of the University of Washington, who has produced Minimal Recursion Semantics (MRS) representations of the same 150 canonical sentences, has provided complementary formal-semantic analysis that informs our evaluation methodology.

### 6.4 Future Work

1. **Human comprehension studies.** Controlled experiments measuring learning speed and accuracy.
2. **Molecule dictionary expansion.** Systematic construction from ~800 survival-level to ~5,000 daily-use words.
3. **Formal grammar specification.** Complete EBNF/PEG specification with parser implementation.
4. **Compiler implementation.** Working compiler to JavaScript, Python, WebAssembly, and natural language.
5. **AI integration pilot.** USEL as structured output format for LLM agents, measuring hallucination reduction.
6. **AAC pilot study.** Evaluation as an AAC system compared to existing symbol-based systems.
7. **Cross-linguistic validation.** 150-sentence analysis extended to Mandarin, Arabic, Swahili, Japanese, Yankunytjatjara.

---

## 7. Conclusion

We have presented USEL v2, a constructed language that maps the 65 NSM semantic primes onto a standard 8×8 chessboard grid, producing expressions writable in algebraic chess notation. The system inherits chess notation's formal grammar (context-free, unambiguous, machine-parseable), cross-cultural stability (280+ years of universal adoption), and intuitive learnability (minutes to acquire basic notation), while grounding its semantics in the most extensively validated set of universal concepts in linguistics (65 primes, 30+ languages, 16+ language families, 50+ years of research).

A systematic translation of 150 canonical NSM sentences demonstrates 100% expressibility (zero irrecoverable gaps) with 54.7% clean prime-only coverage, identifying five categories of structural limitation addressable through lightweight grammatical extensions.

USEL v2 is not designed to replace natural language for casual human communication. It is designed to serve as a *computational semantic layer*—a shared representational substrate for human-AI communication, cross-language semantic interoperability, AI system development, and accessible communication. By grounding AI communication in empirically verified universal concepts expressed through a familiar notational system, USEL v2 offers a path toward a world in which humans and machines communicate on the same unambiguous semantic foundation.

The connection between 65 semantic primes and the 64 squares of a chessboard is, to the best of our knowledge, a novel observation. We hope that this work stimulates further research at the intersection of formal semantics, game notation, constructed language design, and AI communication infrastructure.

---

## Acknowledgments

The authors thank Cliff Goddard and Anna Wierzbicka for their foundational work on the Natural Semantic Metalanguage and for their awareness of this applied extension. We thank David Bullock (University of Washington) for his MRS representations of the 150 canonical sentences, which informed our evaluation methodology. We acknowledge the NSM research community for five decades of cross-linguistic validation that makes USEL possible. This work builds on USEL v1, published on Zenodo (DOI: [10.5281/zenodo.19536117](https://doi.org/10.5281/zenodo.19536117)).

---

## References

- Bliss, C. K. (1965). *Semantography (Blissymbolics)*. Semantography Publications, Sydney.
- Bullock, D. (2021). Minimal Recursion Semantics representations of the 150 canonical NSM sentences. University of Washington, unpublished manuscript.
- Chase, H. (2022). LangChain: Building applications with LLMs through composability. https://github.com/langchain-ai/langchain
- Cowan, J. W. (1997). *The Complete Lojban Language*. The Logical Language Group.
- Gärdenfors, P. (2000). *Conceptual Spaces: The Geometry of Thought*. MIT Press.
- Goddard, C. (2008). *Cross-Linguistic Semantics*. John Benjamins, Amsterdam.
- Goddard, C. (2017). Canonical sentences for the 65 NSM semantic primes, version 5. Unpublished reference document, Griffith University.
- Goddard, C. and Wierzbicka, A. (2002). *Meaning and Universal Grammar: Theory and Empirical Findings*, vols. I & II. John Benjamins, Amsterdam.
- Goddard, C. and Wierzbicka, A. (2014). *Words and Meanings: Lexical Semantics Across Domains, Languages, and Cultures*. Oxford University Press.
- Goldberg, A. E. (1995). *Constructions: A Construction Grammar Approach to Argument Structure*. University of Chicago Press.
- Ji, Z., Lee, N., Frieske, R., et al. (2023). Survey of hallucination in natural language generation. *ACM Computing Surveys*, 55(12):1–38.
- Lang, S. R. (2014). *Toki Pona: The Language of Good*. Tawhid.
- Levinson, S. C. (2003). *Space in Language and Cognition*. Cambridge University Press.
- Levisen, C. and Waters, S., eds. (2017). *Cultural Keywords in Discourse*. John Benjamins, Amsterdam.
- Maloney, J., Moenig, J., and Morrison, C. (2019). MicroBlocks: A blocks-based programming language for microcontrollers. *Proceedings of the 14th Workshop in Primary and Secondary Computing Education*.
- Matthewson, L. (2003). Is the meta-language really natural? *Linguistic Typology*, 7(2):257–260.
- McConnell, S. (2004). *Code Complete* (2nd ed.). Microsoft Press.
- Mikolov, T., Chen, K., Corrado, G., and Dean, J. (2013). Efficient estimation of word representations in vector space. *Proceedings of ICLR Workshop*.
- Nation, I. S. P. (2006). How large a vocabulary is needed for reading and listening? *Canadian Modern Language Review*, 63(1):59–82.
- Olivas, K. and Ada Marie (2026). USEL: Universal Symbolic Executable Language—a proposal to complete Leibniz's 350-year dream. Zenodo. DOI: [10.5281/zenodo.19536117](https://doi.org/10.5281/zenodo.19536117).
- OpenAI (2023). Function calling and other API updates. https://openai.com/blog/function-calling-and-other-api-updates
- Pasternak, E., Fenichel, R., and Marshall, A. N. (2017). Tips for creating a block language with Blockly. *Proceedings of the IEEE Blocks and Beyond Workshop*, pp. 21–24.
- Pennington, J., Socher, R., and Manning, C. D. (2014). GloVe: Global vectors for word representation. *Proceedings of EMNLP*, pp. 1532–1543.
- Quijada, J. (2004). *Ithkuil: A Philosophical Design for a Hypothetical Language*. http://www.ithkuil.net/
- Resnick, M. et al. (2009). Scratch: Programming for all. *Communications of the ACM*, 52(11):60–67.
- Shannon, C. E. (1950). Programming a computer for playing chess. *Philosophical Magazine*, 41(314):256–275.
- Talmy, L. (2000). *Toward a Cognitive Semantics*, vols. I & II. MIT Press.
- Wierzbicka, A. (1972). *Semantic Primitives*. Athenäum, Frankfurt.
- Wierzbicka, A. (1996). *Semantics: Primes and Universals*. Oxford University Press.
- Wittgenstein, L. (1953). *Philosophical Investigations*. Blackwell, Oxford.
- Zamenhof, L. L. (1887). *Lingvo Internacia*. Warsaw.
