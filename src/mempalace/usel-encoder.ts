/**
 * USELEncoder — Encodes natural language memories into USEL symbolic notation
 * using the 65 NSM (Natural Semantic Metalanguage) semantic primes as the foundation.
 *
 * This is an alternative/enhancement to MemPalace's AAAK compression format.
 *
 * AAAK example: E1|John|colleague|MEETING|2024-03-15|discussed_project_alpha
 * USEL example: [PERSON:John]+[NEAR+WORK]+[SAY]+[BEFORE+NOW+5+DAY]+[TOPIC:alpha]
 *
 * NSM Primes used (Wierzbicka's universal set):
 *   Substantives: I, YOU, SOMEONE, SOMETHING, PEOPLE, BODY
 *   Determiners:  THIS, THE SAME, OTHER
 *   Quantifiers:  ONE, TWO, SOME, ALL, MANY, MUCH
 *   Evaluators:   GOOD, BAD
 *   Descriptors:  BIG, SMALL
 *   Mental:       THINK, KNOW, WANT, FEEL, SEE, HEAR
 *   Speech:       SAY, WORDS, TRUE
 *   Actions:      DO, HAPPEN, MOVE, TOUCH
 *   Existence:    THERE IS, LIVE, DIE
 *   Possession:   HAVE
 *   Spatial:      WHERE, HERE, ABOVE, BELOW, FAR, NEAR, SIDE, INSIDE
 *   Temporal:     WHEN, NOW, BEFORE, AFTER, A LONG TIME, A SHORT TIME, MOMENT
 *   Similarity:   LIKE (AS), WAY (MANNER)
 *   Logical:      NOT, MAYBE, CAN, BECAUSE, IF
 *   Intensifier:  VERY, MORE
 *   Taxonomy:     KIND, PART
 */

// ─── NSM Semantic Primes ────────────────────────────────────────────────────

export const NSM_PRIMES = {
  // Substantives
  I: "I",
  YOU: "YOU",
  SOMEONE: "SOMEONE",
  SOMETHING: "SOMETHING",
  PEOPLE: "PEOPLE",
  BODY: "BODY",

  // Determiners
  THIS: "THIS",
  SAME: "SAME",
  OTHER: "OTHER",

  // Quantifiers
  ONE: "ONE",
  TWO: "TWO",
  SOME: "SOME",
  ALL: "ALL",
  MANY: "MANY",
  MUCH: "MUCH",

  // Evaluators
  GOOD: "GOOD",
  BAD: "BAD",

  // Descriptors
  BIG: "BIG",
  SMALL: "SMALL",

  // Mental predicates
  THINK: "THINK",
  KNOW: "KNOW",
  WANT: "WANT",
  FEEL: "FEEL",
  SEE: "SEE",
  HEAR: "HEAR",

  // Speech
  SAY: "SAY",
  WORDS: "WORDS",
  TRUE: "TRUE",

  // Actions & events
  DO: "DO",
  HAPPEN: "HAPPEN",
  MOVE: "MOVE",
  TOUCH: "TOUCH",

  // Existence & life
  THERE_IS: "THERE_IS",
  LIVE: "LIVE",
  DIE: "DIE",

  // Possession
  HAVE: "HAVE",

  // Space
  WHERE: "WHERE",
  HERE: "HERE",
  ABOVE: "ABOVE",
  BELOW: "BELOW",
  FAR: "FAR",
  NEAR: "NEAR",
  SIDE: "SIDE",
  INSIDE: "INSIDE",

  // Time
  WHEN: "WHEN",
  NOW: "NOW",
  BEFORE: "BEFORE",
  AFTER: "AFTER",
  LONG_TIME: "LONG_TIME",
  SHORT_TIME: "SHORT_TIME",
  MOMENT: "MOMENT",

  // Similarity
  LIKE: "LIKE",
  WAY: "WAY",

  // Logic
  NOT: "NOT",
  MAYBE: "MAYBE",
  CAN: "CAN",
  BECAUSE: "BECAUSE",
  IF: "IF",

  // Intensifier
  VERY: "VERY",
  MORE: "MORE",

  // Taxonomy
  KIND: "KIND",
  PART: "PART",
} as const;

export type NSMPrime = (typeof NSM_PRIMES)[keyof typeof NSM_PRIMES];

// ─── USEL Token Types ───────────────────────────────────────────────────────

export interface USELToken {
  type: "entity" | "relation" | "action" | "time" | "emotion" | "qualifier" | "topic";
  primes: NSMPrime[];
  value?: string;
}

export interface EncoderResult {
  notation: string;
  tokens: USELToken[];
  primeCount: number;
  charCount: number;
}

export interface CompressionComparison {
  original: { chars: number; words: number };
  aaak: { chars: number; tokens: number; ratio: number };
  usel: { chars: number; tokens: number; ratio: number };
  winner: "aaak" | "usel" | "tie";
  savings: number; // percentage improvement of winner over loser
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  tokenCount: number;
  primesCovered: NSMPrime[];
}

// ─── Pattern Dictionaries ───────────────────────────────────────────────────

const VERB_TO_PRIME: Record<string, NSMPrime[]> = {
  // Speech acts
  said: ["SAY"],
  told: ["SAY"],
  asked: ["SAY", "WANT", "KNOW"],
  discussed: ["SAY", "THINK"],
  mentioned: ["SAY"],
  explained: ["SAY", "KNOW"],
  announced: ["SAY", "ALL"],
  argued: ["SAY", "NOT", "SAME"],
  agreed: ["SAY", "SAME", "GOOD"],
  denied: ["SAY", "NOT", "TRUE"],
  suggested: ["SAY", "MAYBE"],
  promised: ["SAY", "WANT", "DO"],
  // Movement
  went: ["MOVE"],
  came: ["MOVE", "HERE"],
  left: ["MOVE", "FAR"],
  arrived: ["MOVE", "HERE"],
  returned: ["MOVE", "HERE", "BEFORE"],
  traveled: ["MOVE", "FAR"],
  walked: ["MOVE"],
  ran: ["MOVE", "VERY"],
  // Actions
  made: ["DO"],
  built: ["DO", "SOMETHING"],
  created: ["DO", "THERE_IS"],
  fixed: ["DO", "GOOD"],
  broke: ["DO", "BAD"],
  started: ["DO", "BEFORE"],
  finished: ["DO", "AFTER"],
  helped: ["DO", "GOOD", "SOMEONE"],
  tried: ["WANT", "DO"],
  used: ["DO", "HAVE"],
  wrote: ["DO", "WORDS"],
  read: ["SEE", "WORDS"],
  // Mental
  thought: ["THINK"],
  believed: ["THINK", "TRUE"],
  knew: ["KNOW"],
  learned: ["KNOW", "BEFORE", "NOT"],
  understood: ["KNOW", "GOOD"],
  forgot: ["KNOW", "NOT", "NOW"],
  remembered: ["KNOW", "BEFORE"],
  decided: ["THINK", "WANT", "DO"],
  wondered: ["THINK", "MAYBE"],
  realized: ["KNOW", "NOW"],
  // Perception
  saw: ["SEE"],
  heard: ["HEAR"],
  felt: ["FEEL"],
  noticed: ["SEE", "THINK"],
  watched: ["SEE", "LONG_TIME"],
  // Existence & possession
  had: ["HAVE"],
  got: ["HAVE", "NOW"],
  lost: ["HAVE", "NOT"],
  found: ["SEE", "HAVE"],
  gave: ["HAVE", "NOT", "SOMEONE"],
  received: ["HAVE", "SOMEONE"],
  lived: ["LIVE"],
  died: ["DIE"],
  was: ["THERE_IS"],
  is: ["THERE_IS"],
  became: ["THERE_IS", "OTHER"],
  // Emotional
  loved: ["FEEL", "GOOD", "VERY"],
  hated: ["FEEL", "BAD", "VERY"],
  enjoyed: ["FEEL", "GOOD"],
  feared: ["FEEL", "BAD", "MAYBE"],
  hoped: ["FEEL", "GOOD", "MAYBE"],
  worried: ["FEEL", "BAD", "THINK"],
  missed: ["FEEL", "WANT", "FAR"],
  liked: ["FEEL", "GOOD"],
};

const RELATION_TO_PRIME: Record<string, NSMPrime[]> = {
  colleague: ["NEAR", "DO"],
  friend: ["NEAR", "GOOD", "FEEL"],
  partner: ["NEAR", "SAME", "DO"],
  boss: ["ABOVE"],
  manager: ["ABOVE"],
  employee: ["BELOW"],
  parent: ["ABOVE", "LIVE"],
  child: ["BELOW", "LIVE"],
  sibling: ["SIDE", "LIVE"],
  neighbor: ["NEAR", "LIVE"],
  teacher: ["ABOVE", "KNOW"],
  student: ["BELOW", "KNOW"],
  member: ["PART"],
  owner: ["HAVE"],
  creator: ["DO", "THERE_IS"],
};

const EMOTION_TO_PRIME: Record<string, NSMPrime[]> = {
  happy: ["FEEL", "GOOD"],
  sad: ["FEEL", "BAD"],
  angry: ["FEEL", "BAD", "VERY"],
  excited: ["FEEL", "GOOD", "VERY"],
  anxious: ["FEEL", "BAD", "MAYBE"],
  grateful: ["FEEL", "GOOD", "SOMEONE"],
  frustrated: ["FEEL", "BAD", "WANT"],
  hopeful: ["FEEL", "GOOD", "MAYBE"],
  scared: ["FEEL", "BAD", "MAYBE", "VERY"],
  proud: ["FEEL", "GOOD", "I", "DO"],
  confused: ["THINK", "NOT", "KNOW"],
  relieved: ["FEEL", "GOOD", "AFTER", "BAD"],
  lonely: ["FEEL", "BAD", "NOT", "NEAR"],
  content: ["FEEL", "GOOD", "NOW"],
  surprised: ["FEEL", "NOT", "THINK"],
  disappointed: ["FEEL", "BAD", "WANT", "NOT"],
};

const TIME_PATTERNS: Array<{
  pattern: RegExp;
  encode: (match: RegExpMatchArray) => string;
}> = [
  {
    pattern: /(\d{4})-(\d{2})-(\d{2})/,
    encode: (m) => `[WHEN:${m[1]}.${m[2]}.${m[3]}]`,
  },
  {
    pattern: /(\d+)\s+(day|week|month|year)s?\s+ago/i,
    encode: (m) => `[BEFORE+NOW+${m[1]}+${m[2].toUpperCase()}]`,
  },
  {
    pattern: /in\s+(\d+)\s+(day|week|month|year)s?/i,
    encode: (m) => `[AFTER+NOW+${m[1]}+${m[2].toUpperCase()}]`,
  },
  {
    pattern: /yesterday/i,
    encode: () => `[BEFORE+NOW+1+DAY]`,
  },
  {
    pattern: /today/i,
    encode: () => `[NOW]`,
  },
  {
    pattern: /tomorrow/i,
    encode: () => `[AFTER+NOW+1+DAY]`,
  },
  {
    pattern: /last\s+(week|month|year)/i,
    encode: (m) => `[BEFORE+NOW+1+${m[1].toUpperCase()}]`,
  },
  {
    pattern: /next\s+(week|month|year)/i,
    encode: (m) => `[AFTER+NOW+1+${m[1].toUpperCase()}]`,
  },
  {
    pattern: /this\s+(morning|afternoon|evening)/i,
    encode: (m) => `[NOW+${m[1].toUpperCase()}]`,
  },
  {
    pattern: /a\s+long\s+time\s+ago/i,
    encode: () => `[BEFORE+LONG_TIME]`,
  },
  {
    pattern: /recently/i,
    encode: () => `[BEFORE+NOW+SHORT_TIME]`,
  },
  {
    pattern: /just\s+now/i,
    encode: () => `[BEFORE+NOW+MOMENT]`,
  },
];

// ─── AAAK Encoder (simplified for comparison) ───────────────────────────────

function encodeAAK(memory: string): string {
  const words = memory.split(/\s+/);
  const entities: string[] = [];
  const topics: string[] = [];
  const emotions: string[] = [];
  let dateStr = "";

  // Extract capitalized words as entities
  for (const word of words) {
    const clean = word.replace(/[^a-zA-Z0-9'-]/g, "");
    if (!clean) continue;
    if (/^\d{4}-\d{2}-\d{2}$/.test(clean)) {
      dateStr = clean;
    } else if (/^[A-Z][a-z]+/.test(clean) && words.indexOf(word) > 0) {
      entities.push(clean);
    }
  }

  // Extract emotion signals
  const emotionKeywords: Record<string, string> = {
    happy: "joy",
    sad: "grief",
    angry: "rage",
    excited: "excite",
    frustrated: "frust",
    worried: "anx",
    loved: "love",
    feared: "fear",
    grateful: "grat",
    hopeful: "hope",
    confused: "confuse",
    surprised: "surprise",
  };

  const lower = memory.toLowerCase();
  for (const [keyword, code] of Object.entries(emotionKeywords)) {
    if (lower.includes(keyword)) {
      emotions.push(code);
    }
  }

  // Extract topic words (nouns after common prepositions/verbs)
  const topicPatterns = /(?:about|regarding|concerning|on|for|with)\s+(\w+)/gi;
  let topicMatch: RegExpExecArray | null;
  while ((topicMatch = topicPatterns.exec(memory)) !== null) {
    topics.push(topicMatch[1].toLowerCase());
  }

  // Build AAAK string
  const parts: string[] = [];
  if (entities.length) parts.push(`E:${entities.join(",")}`);
  if (dateStr) parts.push(`D:${dateStr}`);
  if (topics.length) parts.push(`T:${topics.join(",")}`);
  if (emotions.length) parts.push(`EM:${emotions.join(",")}`);

  // Add a summary of remaining content
  const summaryWords = words
    .filter((w) => {
      const c = w.replace(/[^a-zA-Z]/g, "").toLowerCase();
      return c.length > 3 && !["this", "that", "with", "from", "they", "were", "have", "been"].includes(c);
    })
    .slice(0, 8);
  if (summaryWords.length) parts.push(`K:${summaryWords.join("_").toLowerCase()}`);

  return parts.join("|") || memory.substring(0, 60);
}

// ─── USELEncoder Class ──────────────────────────────────────────────────────

export class USELEncoder {
  /**
   * Encode a natural language memory into USEL symbolic notation.
   *
   * Process:
   *  1. Extract entities (people, places, things)
   *  2. Map relationships via NSM primes
   *  3. Map actions/verbs to prime combinations
   *  4. Encode temporal references
   *  5. Map emotions/evaluations
   *  6. Compose final USEL notation string
   */
  encode(memory: string): string {
    const tokens = this.tokenize(memory);
    return tokens.map((t) => this.tokenToNotation(t)).join("+");
  }

  /**
   * Decode USEL notation back to approximate natural language.
   * Note: Like AAAK, USEL is lossy — this produces a readable approximation.
   */
  decode(uselNotation: string): string {
    const tokenStrings = this.splitNotation(uselNotation);
    const parts: string[] = [];

    for (const tokenStr of tokenStrings) {
      const decoded = this.decodeToken(tokenStr);
      if (decoded) parts.push(decoded);
    }

    // Assemble into a sentence
    let sentence = parts.join(" ");
    sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1);
    if (!/[.!?]$/.test(sentence)) sentence += ".";
    return sentence;
  }

  /**
   * Compare compression ratio: AAAK vs USEL for a given memory.
   */
  compareCompression(memory: string): CompressionComparison {
    const aaak = encodeAAK(memory);
    const usel = this.encode(memory);

    const originalChars = memory.length;
    const originalWords = memory.split(/\s+/).length;

    const aaakChars = aaak.length;
    const aaakTokens = aaak.split("|").length;
    const aaakRatio = aaakChars / originalChars;

    const uselChars = usel.length;
    const uselTokens = usel.split("+").length;
    const uselRatio = uselChars / originalChars;

    let winner: "aaak" | "usel" | "tie";
    let savings: number;

    if (aaakRatio < uselRatio - 0.01) {
      winner = "aaak";
      savings = ((uselRatio - aaakRatio) / uselRatio) * 100;
    } else if (uselRatio < aaakRatio - 0.01) {
      winner = "usel";
      savings = ((aaakRatio - uselRatio) / aaakRatio) * 100;
    } else {
      winner = "tie";
      savings = 0;
    }

    return {
      original: { chars: originalChars, words: originalWords },
      aaak: { chars: aaakChars, tokens: aaakTokens, ratio: Math.round(aaakRatio * 100) / 100 },
      usel: { chars: uselChars, tokens: uselTokens, ratio: Math.round(uselRatio * 100) / 100 },
      winner,
      savings: Math.round(savings * 10) / 10,
    };
  }

  /**
   * Validate USEL notation for correctness.
   */
  validate(notation: string): ValidationResult {
    const errors: string[] = [];
    const primesCovered: NSMPrime[] = [];
    let tokenCount = 0;

    if (!notation || notation.trim().length === 0) {
      return { valid: false, errors: ["Empty notation"], tokenCount: 0, primesCovered: [] };
    }

    const tokenStrings = this.splitNotation(notation);

    for (const tokenStr of tokenStrings) {
      if (!tokenStr) {
        errors.push("Empty token found (double '+' separator)");
        continue;
      }

      tokenCount++;

      // Check bracket format: [CONTENT] or [CONTENT:value]
      if (!/^\[.+\]$/.test(tokenStr)) {
        errors.push(`Token "${tokenStr}" is not wrapped in brackets`);
        continue;
      }

      const inner = tokenStr.slice(1, -1);
      const segments = inner.split("+");

      for (const segment of segments) {
        // Check if it's a prime or PRIME:value pair
        const primePart = segment.split(":")[0];
        const allPrimes = Object.values(NSM_PRIMES) as string[];
        const validExtensions = [
          "PERSON",
          "PLACE",
          "THING",
          "TOPIC",
          "WHEN",
          "DAY",
          "WEEK",
          "MONTH",
          "YEAR",
          "MORNING",
          "AFTERNOON",
          "EVENING",
        ];

        if (
          allPrimes.includes(primePart) ||
          validExtensions.includes(primePart) ||
          /^\d+$/.test(primePart) ||
          /^\d{4}\.\d{2}\.\d{2}$/.test(primePart)
        ) {
          if (allPrimes.includes(primePart)) {
            primesCovered.push(primePart as NSMPrime);
          }
        } else {
          errors.push(`Unknown prime or extension: "${primePart}" in token "${tokenStr}"`);
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      tokenCount,
      primesCovered: [...new Set(primesCovered)],
    };
  }

  // ─── Internal Methods ──────────────────────────────────────────────────

  /**
   * Split a USEL notation string into individual bracket-wrapped tokens.
   * Handles `[A+B]+[C+D]` correctly — only splits on `]+[` boundaries.
   */
  private splitNotation(notation: string): string[] {
    // Split on "]+[" then restore the brackets
    const raw = notation.split("]+[");
    return raw.map((part, i) => {
      let token = part.trim();
      if (i === 0 && !token.startsWith("[")) token = "[" + token;
      if (i === 0 && raw.length > 1 && !token.endsWith("]")) token = token + "]";
      if (i > 0 && !token.startsWith("[")) token = "[" + token;
      if (i < raw.length - 1 && !token.endsWith("]")) token = token + "]";
      if (i === raw.length - 1 && !token.endsWith("]")) token = token + "]";
      // Ensure brackets on both ends
      if (!token.startsWith("[")) token = "[" + token;
      if (!token.endsWith("]")) token = token + "]";
      return token;
    });
  }

  private tokenize(memory: string): USELToken[] {
    const tokens: USELToken[] = [];
    let remaining = memory;

    // 1. Extract time references first (they have clear patterns)
    for (const tp of TIME_PATTERNS) {
      const match = remaining.match(tp.pattern);
      if (match) {
        const encoded = tp.encode(match);
        const primes = this.extractPrimesFromNotation(encoded);
        tokens.push({ type: "time", primes, value: encoded });
        remaining = remaining.replace(match[0], " ").trim();
      }
    }

    // 2. Extract entities (capitalized words not at sentence start)
    const entityPattern = /(?:^|\.\s+)?\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\b/g;
    const sentences = remaining.split(/[.!?]+/);
    const entities: string[] = [];

    for (const sentence of sentences) {
      const trimmed = sentence.trim();
      if (!trimmed) continue;
      const words = trimmed.split(/\s+/);
      // Skip first word of each sentence (capitalized by grammar, not by being a name)
      for (let i = 1; i < words.length; i++) {
        const word = words[i].replace(/[^a-zA-Z'-]/g, "");
        if (/^[A-Z][a-z]/.test(word) && !this.isCommonWord(word)) {
          // Collect multi-word names
          let name = word;
          while (i + 1 < words.length) {
            const next = words[i + 1].replace(/[^a-zA-Z'-]/g, "");
            if (/^[A-Z][a-z]/.test(next) && !this.isCommonWord(next)) {
              name += " " + next;
              i++;
            } else {
              break;
            }
          }
          entities.push(name);
        }
      }
    }

    for (const entity of [...new Set(entities)]) {
      tokens.push({
        type: "entity",
        primes: ["SOMEONE"],
        value: entity,
      });
    }

    // 3. Extract relationships
    const lower = remaining.toLowerCase();
    for (const [rel, primes] of Object.entries(RELATION_TO_PRIME)) {
      if (lower.includes(rel)) {
        tokens.push({ type: "relation", primes });
      }
    }

    // 4. Extract actions (verbs → prime combinations)
    const words = lower.split(/\s+/).map((w) => w.replace(/[^a-z'-]/g, ""));
    for (const word of words) {
      if (VERB_TO_PRIME[word]) {
        tokens.push({ type: "action", primes: VERB_TO_PRIME[word] });
      }
    }

    // 5. Extract emotions
    for (const [emotionWord, primes] of Object.entries(EMOTION_TO_PRIME)) {
      if (lower.includes(emotionWord)) {
        tokens.push({ type: "emotion", primes });
      }
    }

    // 6. Extract topic words (significant nouns)
    const topicPattern = /(?:about|regarding|on|for)\s+(?:the\s+)?(\w+(?:\s+\w+)?)/gi;
    let topicMatch: RegExpExecArray | null;
    while ((topicMatch = topicPattern.exec(remaining)) !== null) {
      const topic = topicMatch[1].replace(/[^a-zA-Z0-9\s]/g, "").trim();
      if (topic && topic.length > 2) {
        tokens.push({ type: "topic", primes: ["SOMETHING"], value: topic });
      }
    }

    // 7. Extract qualifiers (very, not, maybe, etc.)
    const qualifierMap: Record<string, NSMPrime[]> = {
      very: ["VERY"],
      extremely: ["VERY", "VERY"],
      not: ["NOT"],
      never: ["NOT", "LONG_TIME"],
      always: ["ALL", "WHEN"],
      maybe: ["MAYBE"],
      perhaps: ["MAYBE"],
      possibly: ["MAYBE"],
      definitely: ["TRUE"],
      certainly: ["TRUE", "VERY"],
      probably: ["MAYBE", "MORE"],
      important: ["GOOD", "BIG"],
      urgent: ["WANT", "NOW"],
    };

    for (const [qualifier, primes] of Object.entries(qualifierMap)) {
      if (lower.includes(qualifier)) {
        tokens.push({ type: "qualifier", primes });
      }
    }

    // Deduplicate tokens with same notation
    return this.deduplicateTokens(tokens);
  }

  private tokenToNotation(token: USELToken): string {
    switch (token.type) {
      case "entity":
        return `[PERSON:${token.value}]`;
      case "time":
        return token.value || `[NOW]`;
      case "topic":
        return `[TOPIC:${token.value}]`;
      case "relation":
      case "action":
      case "emotion":
      case "qualifier":
        return `[${token.primes.join("+")}]`;
      default:
        return `[${token.primes.join("+")}]`;
    }
  }

  private decodeToken(tokenStr: string): string | null {
    if (!/^\[.+\]$/.test(tokenStr)) return tokenStr;
    const inner = tokenStr.slice(1, -1);

    // Handle typed tokens: [PERSON:John], [TOPIC:chess], [WHEN:2024.03.15]
    if (inner.startsWith("PERSON:")) return inner.split(":")[1];
    if (inner.startsWith("TOPIC:")) return `about ${inner.split(":")[1]}`;
    if (inner.startsWith("WHEN:")) {
      const date = inner.split(":")[1].replace(/\./g, "-");
      return `on ${date}`;
    }

    // Decode prime combinations back to natural language
    const primes = inner.split("+");
    return this.primesToNaturalLanguage(primes);
  }

  private primesToNaturalLanguage(primes: string[]): string | null {
    const key = primes.join("+");

    // Action mappings (reverse of VERB_TO_PRIME)
    const actionDecoder: Record<string, string> = {
      SAY: "said",
      "SAY+THINK": "discussed",
      "SAY+WANT+KNOW": "asked",
      "SAY+KNOW": "explained",
      "SAY+SAME+GOOD": "agreed",
      "SAY+NOT+TRUE": "denied",
      "SAY+MAYBE": "suggested",
      MOVE: "went",
      "MOVE+HERE": "came",
      "MOVE+FAR": "left",
      "MOVE+HERE+BEFORE": "returned",
      DO: "did",
      "DO+SOMETHING": "built",
      "DO+THERE_IS": "created",
      "DO+GOOD": "fixed",
      "DO+BAD": "broke",
      "DO+WORDS": "wrote",
      THINK: "thought",
      "THINK+TRUE": "believed",
      "THINK+WANT+DO": "decided",
      "THINK+MAYBE": "wondered",
      KNOW: "knew",
      "KNOW+NOW": "realized",
      "KNOW+BEFORE+NOT": "learned",
      "KNOW+GOOD": "understood",
      SEE: "saw",
      HEAR: "heard",
      FEEL: "felt",
      "SEE+WORDS": "read",
      "SEE+THINK": "noticed",
      HAVE: "had",
      "HAVE+NOW": "got",
      "HAVE+NOT": "lost",
      "FEEL+GOOD": "was happy",
      "FEEL+BAD": "was sad",
      "FEEL+GOOD+VERY": "loved",
      "FEEL+BAD+VERY": "was angry",
      "FEEL+BAD+MAYBE": "was anxious",
      "FEEL+GOOD+SOMEONE": "was grateful",
    };

    // Relation mappings
    const relationDecoder: Record<string, string> = {
      "NEAR+DO": "colleague",
      "NEAR+GOOD+FEEL": "friend",
      "NEAR+SAME+DO": "partner",
      ABOVE: "boss",
      BELOW: "employee",
      "ABOVE+LIVE": "parent",
      "BELOW+LIVE": "child",
      "SIDE+LIVE": "sibling",
      "ABOVE+KNOW": "teacher",
      "BELOW+KNOW": "student",
      PART: "member",
    };

    // Time decode
    const timeDecoder: Record<string, string> = {
      NOW: "now",
      "BEFORE+NOW+1+DAY": "yesterday",
      "AFTER+NOW+1+DAY": "tomorrow",
      "BEFORE+LONG_TIME": "a long time ago",
      "BEFORE+NOW+SHORT_TIME": "recently",
      "BEFORE+NOW+MOMENT": "just now",
    };

    // Qualifier decode
    const qualifierDecoder: Record<string, string> = {
      VERY: "very",
      "VERY+VERY": "extremely",
      NOT: "not",
      "NOT+LONG_TIME": "never",
      "ALL+WHEN": "always",
      MAYBE: "maybe",
      TRUE: "definitely",
      "TRUE+VERY": "certainly",
      "GOOD+BIG": "importantly",
      "WANT+NOW": "urgently",
    };

    if (actionDecoder[key]) return actionDecoder[key];
    if (relationDecoder[key]) return `(${relationDecoder[key]})`;
    if (timeDecoder[key]) return timeDecoder[key];
    if (qualifierDecoder[key]) return qualifierDecoder[key];

    // Time with numbers: BEFORE+NOW+N+UNIT or AFTER+NOW+N+UNIT
    const timeNumPattern = /^(BEFORE|AFTER)\+NOW\+(\d+)\+(\w+)$/;
    const timeMatch = key.match(timeNumPattern);
    if (timeMatch) {
      const direction = timeMatch[1] === "BEFORE" ? "ago" : "from now";
      return `${timeMatch[2]} ${timeMatch[3].toLowerCase()}s ${direction}`;
    }

    // Fallback: just join primes with spaces
    return primes.map((p) => p.toLowerCase()).join(" ");
  }

  private extractPrimesFromNotation(notation: string): NSMPrime[] {
    const inner = notation.replace(/^\[|\]$/g, "");
    const segments = inner.split("+");
    const allPrimes = Object.values(NSM_PRIMES) as string[];
    return segments.filter((s) => allPrimes.includes(s.split(":")[0])) as NSMPrime[];
  }

  private isCommonWord(word: string): boolean {
    const common = new Set([
      "The",
      "This",
      "That",
      "These",
      "Those",
      "There",
      "Then",
      "They",
      "When",
      "Where",
      "What",
      "Which",
      "While",
      "With",
      "Would",
      "Could",
      "Should",
      "About",
      "After",
      "Before",
      "During",
      "Since",
      "Until",
      "From",
      "Into",
      "Upon",
      "Also",
      "Some",
      "Many",
      "Much",
      "More",
      "Most",
      "Very",
      "Just",
      "Only",
      "Even",
      "Still",
      "Already",
      "However",
      "Although",
      "Because",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ]);
    return common.has(word);
  }

  private deduplicateTokens(tokens: USELToken[]): USELToken[] {
    const seen = new Set<string>();
    return tokens.filter((token) => {
      const key = `${token.type}:${token.primes.join("+")}:${token.value || ""}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }
}

// ─── Default Export ─────────────────────────────────────────────────────────

export default USELEncoder;
