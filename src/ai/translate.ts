/**
 * USEL Natural Language ↔ Symbol Translation
 *
 * Translates between natural language sentences and USEL symbol sequences.
 * MVP uses keyword matching and pattern rules (no LLM dependency).
 *
 * Future roadmap:
 * - Phase 2: LLM-backed translation with SAE feature extraction
 * - Phase 3: True semantic decomposition via learned NSM→feature maps
 *
 * Supports: English (primary), Spanish (basic)
 *
 * @module ai/translate
 */

import type { USELSymbol, PrimeCategory } from '../primes/types';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface TranslationResult {
  symbolIds: string[];
  confidence: number;  // 0–1 estimate of translation quality
  method: 'keyword' | 'pattern' | 'llm';
}

export interface SuggestionResult {
  symbolId: string;
  name: string;
  score: number;       // relevance score 0–1
  reason: string;      // why this was suggested
}

// ─── Keyword Maps ────────────────────────────────────────────────────────────

/**
 * English word → NSM prime ID mapping.
 * Each entry maps one or more surface forms to the underlying prime.
 * Ordered from most specific to most general within each prime.
 */
const EN_KEYWORDS: Record<string, string[]> = {
  // Substantives
  I:          ['i', 'me', 'myself', 'my', 'mine'],
  YOU:        ['you', 'your', 'yourself', 'yours'],
  SOMEONE:    ['someone', 'somebody', 'person', 'anyone', 'anybody'],
  SOMETHING:  ['something', 'thing', 'anything', 'object', 'stuff', 'it'],
  PEOPLE:     ['people', 'everyone', 'everybody', 'humans', 'folks', 'they', 'them'],
  BODY:       ['body', 'flesh', 'physical', 'bodily'],

  // Relational
  KIND:       ['kind', 'type', 'sort', 'category', 'class'],
  PART:       ['part', 'piece', 'portion', 'section', 'component'],

  // Determiners
  THIS:       ['this', 'these', 'that', 'those', 'here_is'],
  THE_SAME:   ['same', 'identical', 'equal', 'equivalent'],
  OTHER:      ['other', 'another', 'different', 'else', 'otherwise'],

  // Quantifiers
  ONE:        ['one', 'single', 'a', 'an'],
  TWO:        ['two', 'pair', 'couple', 'both', 'double'],
  SOME:       ['some', 'several', 'few', 'certain'],
  ALL:        ['all', 'every', 'each', 'everything', 'entire', 'whole'],
  MUCH:       ['much', 'lot', 'plenty', 'lots', 'greatly'],
  MANY:       ['many', 'numerous', 'multiple', 'countless', 'various'],

  // Evaluators
  GOOD:       ['good', 'great', 'nice', 'wonderful', 'excellent', 'fine', 'well', 'right', 'positive', 'happy', 'love'],
  BAD:        ['bad', 'terrible', 'awful', 'horrible', 'wrong', 'evil', 'negative', 'poor'],

  // Descriptors
  BIG:        ['big', 'large', 'huge', 'enormous', 'giant', 'vast', 'tall', 'long'],
  SMALL:      ['small', 'little', 'tiny', 'short', 'brief', 'minor', 'slight'],

  // Mental predicates
  THINK:      ['think', 'thought', 'believe', 'consider', 'suppose', 'imagine', 'wonder', 'reflect'],
  KNOW:       ['know', 'knew', 'known', 'understand', 'realize', 'recognize', 'aware', 'certain'],
  WANT:       ['want', 'desire', 'wish', 'hope', 'need', 'would_like', 'crave'],
  DONT_WANT:  ['dont_want', "don't_want", 'refuse', 'reject', 'deny', 'hate', 'dislike', 'avoid'],
  FEEL:       ['feel', 'felt', 'feeling', 'emotion', 'sense', 'experience'],
  SEE:        ['see', 'saw', 'seen', 'look', 'watch', 'observe', 'notice', 'view', 'visible'],
  HEAR:       ['hear', 'heard', 'listen', 'sound', 'noise', 'audible'],

  // Speech
  SAY:        ['say', 'said', 'tell', 'told', 'speak', 'spoke', 'talk', 'ask', 'state', 'express'],
  WORDS:      ['words', 'word', 'language', 'name', 'term', 'phrase', 'sentence'],
  TRUE:       ['true', 'truth', 'fact', 'correct', 'accurate', 'real', 'indeed'],

  // Actions / events
  DO:         ['do', 'did', 'does', 'done', 'make', 'made', 'act', 'perform', 'create', 'build'],
  HAPPEN:     ['happen', 'happened', 'occurs', 'occurred', 'event', 'take_place'],
  MOVE:       ['move', 'moved', 'go', 'went', 'come', 'came', 'walk', 'run', 'travel', 'carry'],

  // Existence / possession
  EXIST:      ['exist', 'exists', 'is', 'are', 'be', 'being', 'am', 'was', 'were'],
  HAVE:       ['have', 'has', 'had', 'own', 'possess', 'belong', 'hold', 'got'],

  // Life
  LIVE:       ['live', 'alive', 'living', 'life', 'born', 'birth', 'survive'],
  DIE:        ['die', 'died', 'dead', 'death', 'kill', 'end', 'perish'],

  // Time
  WHEN:       ['when', 'whenever', 'while', 'during', 'time'],
  NOW:        ['now', 'currently', 'presently', 'today', 'right_now'],
  BEFORE:     ['before', 'previously', 'earlier', 'ago', 'past', 'already', 'yesterday'],
  AFTER:      ['after', 'later', 'next', 'then', 'subsequently', 'tomorrow', 'future'],
  A_LONG_TIME:   ['long_time', 'forever', 'ages', 'always', 'eternal', 'permanently'],
  A_SHORT_TIME:  ['short_time', 'moment', 'briefly', 'quickly', 'soon', 'instant'],
  FOR_SOME_TIME: ['for_a_while', 'awhile', 'temporarily', 'period'],
  MOMENT:        ['moment', 'instant', 'second', 'suddenly'],

  // Space
  WHERE:      ['where', 'wherever', 'place', 'location', 'position'],
  HERE:       ['here', 'this_place', 'nearby'],
  ABOVE:      ['above', 'over', 'up', 'high', 'top', 'upper', 'higher'],
  BELOW:      ['below', 'under', 'down', 'low', 'bottom', 'lower', 'beneath'],
  FAR:        ['far', 'distant', 'away', 'remote'],
  NEAR:       ['near', 'close', 'nearby', 'beside', 'next_to', 'adjacent'],
  SIDE:       ['side', 'left', 'right', 'beside', 'lateral', 'edge'],
  INSIDE:     ['inside', 'within', 'in', 'into', 'inner', 'internal'],
  TOUCH:      ['touch', 'contact', 'feel', 'grab', 'hold', 'press'],

  // Logical
  NOT:        ['not', "n't", 'no', 'never', 'neither', 'nor', 'none', 'without'],
  MAYBE:      ['maybe', 'perhaps', 'possibly', 'might', 'could', 'uncertain'],
  CAN:        ['can', 'could', 'able', 'capable', 'possible', 'allowed'],
  BECAUSE:    ['because', 'since', 'cause', 'reason', 'therefore', 'so', 'thus', 'why'],
  IF:         ['if', 'whether', 'unless', 'provided', 'assuming', 'suppose'],

  // Intensifier
  VERY:       ['very', 'really', 'extremely', 'incredibly', 'absolutely', 'totally', 'so', 'quite', 'deeply'],
  MORE:       ['more', 'most', 'greater', 'further', 'additional', 'extra', 'better', 'worse'],

  // Similarity
  LIKE_AS:    ['like', 'as', 'similar', 'same_as', 'resembles', 'comparable'],
};

/**
 * Spanish word → NSM prime ID mapping (basic coverage).
 */
const ES_KEYWORDS: Record<string, string[]> = {
  I:          ['yo', 'me', 'mi', 'mío'],
  YOU:        ['tú', 'te', 'tu', 'usted', 'tuyo'],
  SOMEONE:    ['alguien', 'persona'],
  SOMETHING:  ['algo', 'cosa'],
  PEOPLE:     ['gente', 'personas', 'todos', 'ellos'],
  BODY:       ['cuerpo', 'físico'],
  GOOD:       ['bueno', 'buena', 'bien', 'genial', 'excelente'],
  BAD:        ['malo', 'mala', 'mal', 'terrible'],
  BIG:        ['grande', 'enorme', 'alto', 'largo'],
  SMALL:      ['pequeño', 'pequeña', 'poco', 'corto'],
  THINK:      ['pensar', 'pienso', 'creer', 'considerar'],
  KNOW:       ['saber', 'sé', 'conocer', 'entender'],
  WANT:       ['querer', 'quiero', 'desear', 'necesitar'],
  FEEL:       ['sentir', 'siento', 'emoción'],
  SEE:        ['ver', 'veo', 'mirar', 'observar'],
  HEAR:       ['oír', 'oigo', 'escuchar'],
  SAY:        ['decir', 'digo', 'hablar', 'contar'],
  DO:         ['hacer', 'hago', 'crear', 'construir'],
  MOVE:       ['mover', 'ir', 'venir', 'caminar'],
  EXIST:      ['existir', 'ser', 'estar', 'es', 'son', 'está', 'soy'],
  HAVE:       ['tener', 'tengo', 'poseer'],
  LIVE:       ['vivir', 'vivo', 'vida'],
  DIE:        ['morir', 'muerte', 'muerto'],
  NOT:        ['no', 'nunca', 'ningún', 'sin'],
  VERY:       ['muy', 'realmente', 'bastante'],
  MORE:       ['más', 'mayor', 'mejor', 'peor'],
  NOW:        ['ahora', 'hoy', 'actualmente'],
  BEFORE:     ['antes', 'previamente', 'ayer'],
  AFTER:      ['después', 'luego', 'mañana'],
  WHERE:      ['donde', 'dónde', 'lugar'],
  HERE:       ['aquí', 'acá'],
  ABOVE:      ['arriba', 'sobre', 'encima'],
  BELOW:      ['abajo', 'debajo', 'bajo'],
  IF:         ['si', 'acaso'],
  BECAUSE:    ['porque', 'ya_que', 'pues'],
  ALL:        ['todo', 'toda', 'todos', 'todas', 'cada'],
  SOME:       ['algunos', 'algunas', 'unos', 'unas'],
  WHEN:       ['cuando', 'cuándo', 'mientras'],
  TRUE:       ['verdad', 'cierto', 'verdadero'],
  LIKE_AS:    ['como', 'similar', 'igual'],
  CAN:        ['poder', 'puedo', 'puede'],
  MAYBE:      ['quizás', 'tal_vez', 'posiblemente'],
  WORDS:      ['palabras', 'palabra', 'lenguaje'],
};

/** Reverse lookup: keyword → prime ID, built at module load. */
const EN_REVERSE = new Map<string, string>();
const ES_REVERSE = new Map<string, string>();

function buildReverseMaps(): void {
  for (const [primeId, keywords] of Object.entries(EN_KEYWORDS)) {
    for (const kw of keywords) {
      // First match wins (more specific primes listed first)
      if (!EN_REVERSE.has(kw)) EN_REVERSE.set(kw, primeId);
    }
  }
  for (const [primeId, keywords] of Object.entries(ES_KEYWORDS)) {
    for (const kw of keywords) {
      if (!ES_REVERSE.has(kw)) ES_REVERSE.set(kw, primeId);
    }
  }
}

buildReverseMaps();

// ─── Tokenization ────────────────────────────────────────────────────────────

/** Tokenize text into lowercase words, preserving contractions. */
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s'áéíóúüñ-]/g, ' ')  // keep accented chars for Spanish
    .split(/\s+/)
    .filter(t => t.length > 0);
}

// ─── Pattern Rules ───────────────────────────────────────────────────────────

/**
 * SVO (Subject-Verb-Object) pattern detection.
 * Attempts to parse basic sentence structures into ordered primes.
 */
interface PatternMatch {
  primes: string[];
  consumed: number;  // how many tokens this pattern consumed
}

/**
 * Detect negation patterns: "don't want", "can't see", "not good"
 */
function detectNegation(tokens: string[], idx: number, reverseMap: Map<string, string>): PatternMatch | null {
  if (idx >= tokens.length) return null;

  const token = tokens[idx];

  // "don't" / "doesn't" / "can't" + verb
  if (/^(don'?t|doesn'?t|can'?t|won'?t|didn'?t|isn'?t|aren'?t|wasn'?t)$/.test(token)) {
    const nextToken = tokens[idx + 1];
    if (nextToken) {
      const prime = reverseMap.get(nextToken);
      if (prime === 'WANT') return { primes: ['DONT_WANT'], consumed: 2 };
      if (prime) return { primes: ['NOT', prime], consumed: 2 };
    }
    return { primes: ['NOT'], consumed: 1 };
  }

  // "not" + adjective/verb
  if (token === 'not' || token === 'no') {
    const nextToken = tokens[idx + 1];
    if (nextToken) {
      const prime = reverseMap.get(nextToken);
      if (prime === 'WANT') return { primes: ['DONT_WANT'], consumed: 2 };
      if (prime) return { primes: ['NOT', prime], consumed: 2 };
    }
  }

  return null;
}

/**
 * Detect intensifier patterns: "very good", "really big"
 */
function detectIntensifier(tokens: string[], idx: number, reverseMap: Map<string, string>): PatternMatch | null {
  if (idx >= tokens.length) return null;

  const prime = reverseMap.get(tokens[idx]);
  if (prime !== 'VERY' && prime !== 'MORE') return null;

  const nextToken = tokens[idx + 1];
  if (nextToken) {
    const nextPrime = reverseMap.get(nextToken);
    if (nextPrime) return { primes: [prime, nextPrime], consumed: 2 };
  }

  return { primes: [prime], consumed: 1 };
}

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Parse a natural language sentence into USEL symbol IDs.
 *
 * Strategy:
 * 1. Tokenize input
 * 2. Apply pattern rules (negation, intensifiers)
 * 3. Fall back to keyword lookup for remaining tokens
 * 4. Deduplicate adjacent duplicates
 *
 * @param text - Natural language input
 * @param lang - Language code: 'en' (default) or 'es'
 * @returns Array of NSM prime IDs representing the meaning
 */
export function naturalToUSEL(text: string, lang: string = 'en'): string[] {
  const tokens = tokenize(text);
  const reverseMap = lang === 'es' ? ES_REVERSE : EN_REVERSE;
  const result: string[] = [];

  // Skip common function words that don't map to primes
  const stopWords = new Set([
    'the', 'a', 'an', 'to', 'of', 'and', 'but', 'or', 'for',
    'with', 'at', 'from', 'by', 'on', 'about', 'just', 'been',
    // Spanish stop words
    'el', 'la', 'los', 'las', 'un', 'una', 'de', 'del', 'en',
    'y', 'o', 'pero', 'para', 'con', 'por',
  ]);

  let i = 0;
  while (i < tokens.length) {
    const token = tokens[i];

    // Skip stop words
    if (stopWords.has(token)) { i++; continue; }

    // Try pattern: negation
    const negation = detectNegation(tokens, i, reverseMap);
    if (negation) {
      result.push(...negation.primes);
      i += negation.consumed;
      continue;
    }

    // Try pattern: intensifier + modified word
    const intensifier = detectIntensifier(tokens, i, reverseMap);
    if (intensifier) {
      result.push(...intensifier.primes);
      i += intensifier.consumed;
      continue;
    }

    // Direct keyword lookup
    const prime = reverseMap.get(token);
    if (prime) {
      result.push(prime);
      i++;
      continue;
    }

    // No match — skip unknown token
    i++;
  }

  // Deduplicate consecutive identical primes
  return result.filter((prime, idx) => idx === 0 || prime !== result[idx - 1]);
}

/**
 * Convert USEL symbol sequence to natural language.
 *
 * Generates a human-readable gloss of the prime sequence.
 * Uses simple templates for common patterns.
 *
 * @param symbolIds - Array of NSM prime IDs
 * @param lang - Output language: 'en' (default) or 'es'
 * @returns Natural language string
 */
export function uselToNatural(symbolIds: string[], lang: string = 'en'): string {
  if (symbolIds.length === 0) return '';

  const glossMap = lang === 'es' ? ES_GLOSS : EN_GLOSS;
  const parts: string[] = [];

  for (let i = 0; i < symbolIds.length; i++) {
    const id = symbolIds[i];
    const nextId = symbolIds[i + 1];

    // Pattern: NOT + prime → "not X" / "don't X"
    if (id === 'NOT' && nextId) {
      const nextGloss = glossMap[nextId] ?? nextId.toLowerCase();
      const isVerb = ['THINK', 'KNOW', 'WANT', 'FEEL', 'SEE', 'HEAR', 'SAY', 'DO', 'MOVE', 'LIVE', 'EXIST', 'HAVE'].includes(nextId);
      if (lang === 'es') {
        parts.push(`no ${nextGloss}`);
      } else {
        parts.push(isVerb ? `don't ${nextGloss}` : `not ${nextGloss}`);
      }
      i++; // skip the next symbol
      continue;
    }

    // Pattern: DONT_WANT → "don't want" / "no querer"
    if (id === 'DONT_WANT') {
      parts.push(lang === 'es' ? 'no querer' : "don't want");
      continue;
    }

    // Pattern: VERY + descriptor → "very X"
    if (id === 'VERY' && nextId) {
      const nextGloss = glossMap[nextId] ?? nextId.toLowerCase();
      parts.push(lang === 'es' ? `muy ${nextGloss}` : `very ${nextGloss}`);
      i++;
      continue;
    }

    // Pattern: MORE + descriptor → "more X"
    if (id === 'MORE' && nextId) {
      const nextGloss = glossMap[nextId] ?? nextId.toLowerCase();
      parts.push(lang === 'es' ? `más ${nextGloss}` : `more ${nextGloss}`);
      i++;
      continue;
    }

    // Default: use gloss
    const gloss = glossMap[id];
    if (gloss) {
      parts.push(gloss);
    } else {
      parts.push(id.toLowerCase().replace(/_/g, ' '));
    }
  }

  // Capitalize first letter
  const sentence = parts.join(' ');
  return sentence.charAt(0).toUpperCase() + sentence.slice(1);
}

/**
 * Suggest USEL symbols based on partial natural language input.
 *
 * Useful for autocomplete: as the user types, suggest matching primes.
 *
 * @param partialText - Incomplete text input
 * @returns Sorted array of suggestions with relevance scores
 */
export function suggestSymbols(partialText: string): SuggestionResult[] {
  const tokens = tokenize(partialText);
  if (tokens.length === 0) return [];

  const lastToken = tokens[tokens.length - 1];
  const suggestions: SuggestionResult[] = [];
  const seen = new Set<string>();

  // Score each prime by how well its keywords match the last token
  for (const [primeId, keywords] of Object.entries(EN_KEYWORDS)) {
    for (const kw of keywords) {
      if (kw.startsWith(lastToken) || lastToken.startsWith(kw)) {
        if (seen.has(primeId)) continue;
        seen.add(primeId);

        // Score based on match quality
        const exactMatch = kw === lastToken;
        const prefixMatch = kw.startsWith(lastToken);
        const score = exactMatch ? 1.0 : prefixMatch ? 0.7 : 0.4;

        suggestions.push({
          symbolId: primeId,
          name: primeId,
          score,
          reason: exactMatch
            ? `Exact match: "${kw}"`
            : prefixMatch
              ? `Prefix match: "${kw}" starts with "${lastToken}"`
              : `Partial match: "${lastToken}" starts with "${kw}"`,
        });
      }
    }
  }

  // Also check full-text context for earlier tokens
  for (let t = 0; t < tokens.length - 1; t++) {
    const prime = EN_REVERSE.get(tokens[t]);
    if (prime && !seen.has(prime)) {
      seen.add(prime);
      suggestions.push({
        symbolId: prime,
        name: prime,
        score: 0.3,
        reason: `Context: "${tokens[t]}" maps to ${prime}`,
      });
    }
  }

  return suggestions.sort((a, b) => b.score - a.score);
}

// ─── Gloss Maps (prime ID → human word) ──────────────────────────────────────

const EN_GLOSS: Record<string, string> = {
  I: 'I', YOU: 'you', SOMEONE: 'someone', SOMETHING: 'something',
  PEOPLE: 'people', BODY: 'body', KIND: 'kind of', PART: 'part of',
  THIS: 'this', THE_SAME: 'the same', OTHER: 'other',
  ONE: 'one', TWO: 'two', SOME: 'some', ALL: 'all', MUCH: 'much', MANY: 'many',
  GOOD: 'good', BAD: 'bad', BIG: 'big', SMALL: 'small',
  THINK: 'think', KNOW: 'know', WANT: 'want', DONT_WANT: "don't want",
  FEEL: 'feel', SEE: 'see', HEAR: 'hear',
  SAY: 'say', WORDS: 'words', TRUE: 'true',
  DO: 'do', HAPPEN: 'happen', MOVE: 'move',
  EXIST: 'is', HAVE: 'have',
  LIVE: 'live', DIE: 'die',
  WHEN: 'when', NOW: 'now', BEFORE: 'before', AFTER: 'after',
  A_LONG_TIME: 'a long time', A_SHORT_TIME: 'a short time',
  FOR_SOME_TIME: 'for some time', MOMENT: 'a moment',
  WHERE: 'where', HERE: 'here', ABOVE: 'above', BELOW: 'below',
  FAR: 'far', NEAR: 'near', SIDE: 'side', INSIDE: 'inside', TOUCH: 'touch',
  NOT: 'not', MAYBE: 'maybe', CAN: 'can', BECAUSE: 'because', IF: 'if',
  VERY: 'very', MORE: 'more',
  LIKE_AS: 'like',
};

const ES_GLOSS: Record<string, string> = {
  I: 'yo', YOU: 'tú', SOMEONE: 'alguien', SOMETHING: 'algo',
  PEOPLE: 'gente', BODY: 'cuerpo', KIND: 'tipo de', PART: 'parte de',
  THIS: 'esto', THE_SAME: 'lo mismo', OTHER: 'otro',
  ONE: 'uno', TWO: 'dos', SOME: 'algunos', ALL: 'todo', MUCH: 'mucho', MANY: 'muchos',
  GOOD: 'bueno', BAD: 'malo', BIG: 'grande', SMALL: 'pequeño',
  THINK: 'pensar', KNOW: 'saber', WANT: 'querer', DONT_WANT: 'no querer',
  FEEL: 'sentir', SEE: 'ver', HEAR: 'oír',
  SAY: 'decir', WORDS: 'palabras', TRUE: 'verdad',
  DO: 'hacer', HAPPEN: 'pasar', MOVE: 'mover',
  EXIST: 'es', HAVE: 'tener',
  LIVE: 'vivir', DIE: 'morir',
  WHEN: 'cuando', NOW: 'ahora', BEFORE: 'antes', AFTER: 'después',
  A_LONG_TIME: 'mucho tiempo', A_SHORT_TIME: 'poco tiempo',
  FOR_SOME_TIME: 'por un tiempo', MOMENT: 'un momento',
  WHERE: 'donde', HERE: 'aquí', ABOVE: 'arriba', BELOW: 'abajo',
  FAR: 'lejos', NEAR: 'cerca', SIDE: 'lado', INSIDE: 'dentro', TOUCH: 'tocar',
  NOT: 'no', MAYBE: 'quizás', CAN: 'poder', BECAUSE: 'porque', IF: 'si',
  VERY: 'muy', MORE: 'más',
  LIKE_AS: 'como',
};
