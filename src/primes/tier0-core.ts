// ============================================================================
// USEL Tier 0 — Natural Semantic Metalanguage (NSM) Core Primes
// 65 universal semantic primes from Anna Wierzbicka's NSM theory
// These are the irreducible atoms of meaning found in ALL human languages.
// ============================================================================

import { USELSymbol, CATEGORY_COLORS } from './types';

// ---------------------------------------------------------------------------
// Substantives — The anchors of reference (6 primes)
// ---------------------------------------------------------------------------

const SUBSTANTIVES: USELSymbol[] = [
  {
    id: 'PRIME_I',
    name: 'I',
    tier: 0,
    category: 'substantive',
    level: 1,
    glyph: '◉',
    color: CATEGORY_COLORS.substantive,
    accepts: [],
    provides: ['subject', 'object'],
    pronunciation: { en: 'I', es: 'yo', zh: 'wǒ (我)', ar: 'anā (أنا)' },
    description: 'The speaker; the self-referential anchor of every utterance.',
  },
  {
    id: 'PRIME_YOU',
    name: 'YOU',
    tier: 0,
    category: 'substantive',
    level: 1,
    glyph: '◎',
    color: CATEGORY_COLORS.substantive,
    accepts: [],
    provides: ['subject', 'object'],
    pronunciation: { en: 'you', es: 'tú', zh: 'nǐ (你)', ar: 'anta (أنت)' },
    description: 'The addressee; the person being spoken to.',
  },
  {
    id: 'PRIME_SOMEONE',
    name: 'SOMEONE',
    tier: 0,
    category: 'substantive',
    level: 1,
    glyph: '👤',
    color: CATEGORY_COLORS.substantive,
    accepts: [],
    provides: ['subject', 'object'],
    pronunciation: {
      en: 'someone',
      es: 'alguien',
      zh: 'yǒu rén (有人)',
      ar: 'shakhṣ mā (شخص ما)',
    },
    description: 'An unspecified person; any human being.',
  },
  {
    id: 'PRIME_SOMETHING',
    name: 'SOMETHING',
    tier: 0,
    category: 'substantive',
    level: 1,
    glyph: '◆',
    color: CATEGORY_COLORS.substantive,
    accepts: [],
    provides: ['subject', 'object'],
    pronunciation: {
      en: 'something',
      es: 'algo',
      zh: 'mǒu shì (某事)',
      ar: 'shayʾ mā (شيء ما)',
    },
    description: 'An unspecified thing; the most general referent.',
  },
  {
    id: 'PRIME_PEOPLE',
    name: 'PEOPLE',
    tier: 0,
    category: 'substantive',
    level: 1,
    glyph: '👥',
    color: CATEGORY_COLORS.substantive,
    accepts: [],
    provides: ['subject', 'object'],
    pronunciation: {
      en: 'people',
      es: 'gente',
      zh: 'rén (人)',
      ar: 'nās (ناس)',
    },
    description: 'Human beings collectively; a group of persons.',
  },
  {
    id: 'PRIME_BODY',
    name: 'BODY',
    tier: 0,
    category: 'substantive',
    level: 1,
    glyph: '🦴',
    color: CATEGORY_COLORS.substantive,
    accepts: [],
    provides: ['subject', 'object'],
    pronunciation: {
      en: 'body',
      es: 'cuerpo',
      zh: 'shēntǐ (身体)',
      ar: 'jism (جسم)',
    },
    description: 'The physical form of a person; the material self.',
  },
];

// ---------------------------------------------------------------------------
// Relational — Structure and composition (2 primes)
// ---------------------------------------------------------------------------

const RELATIONAL: USELSymbol[] = [
  {
    id: 'PRIME_KIND',
    name: 'KIND',
    tier: 0,
    category: 'relational',
    level: 2,
    glyph: '🏷',
    color: CATEGORY_COLORS.relational,
    accepts: ['object'],
    provides: ['modifier'],
    pronunciation: {
      en: 'kind (of)',
      es: 'tipo (de)',
      zh: 'zhǒng (种)',
      ar: 'nawʿ (نوع)',
    },
    description: 'A type or category; classification of things.',
  },
  {
    id: 'PRIME_PART',
    name: 'PART',
    tier: 0,
    category: 'relational',
    level: 2,
    glyph: '🧩',
    color: CATEGORY_COLORS.relational,
    accepts: ['object'],
    provides: ['modifier'],
    pronunciation: {
      en: 'part (of)',
      es: 'parte (de)',
      zh: 'bùfen (部分)',
      ar: 'juzʾ (جزء)',
    },
    description: 'A component or piece of a whole.',
  },
];

// ---------------------------------------------------------------------------
// Determiners — Pointing and identity (3 primes)
// ---------------------------------------------------------------------------

const DETERMINERS: USELSymbol[] = [
  {
    id: 'PRIME_THIS',
    name: 'THIS',
    tier: 0,
    category: 'determiner',
    level: 1,
    glyph: '👇',
    color: CATEGORY_COLORS.determiner,
    accepts: [],
    provides: ['modifier'],
    pronunciation: {
      en: 'this',
      es: 'esto',
      zh: 'zhè (这)',
      ar: 'hādhā (هذا)',
    },
    description: 'Indicates the specific thing being referred to.',
  },
  {
    id: 'PRIME_THE_SAME',
    name: 'THE SAME',
    tier: 0,
    category: 'determiner',
    level: 2,
    glyph: '≡',
    color: CATEGORY_COLORS.determiner,
    accepts: [],
    provides: ['modifier'],
    pronunciation: {
      en: 'the same',
      es: 'lo mismo',
      zh: 'yīyàng (一样)',
      ar: 'nafs (نفس)',
    },
    description: 'Identity; indicates two references pick out the same entity.',
  },
  {
    id: 'PRIME_OTHER',
    name: 'OTHER',
    tier: 0,
    category: 'determiner',
    level: 2,
    glyph: '⊖',
    color: CATEGORY_COLORS.determiner,
    accepts: [],
    provides: ['modifier'],
    pronunciation: {
      en: 'other',
      es: 'otro',
      zh: 'qítā (其他)',
      ar: 'ākhar (آخر)',
    },
    description: 'Something different; not the one already mentioned.',
  },
];

// ---------------------------------------------------------------------------
// Quantifiers — Counting and magnitude (5 primes)
// ---------------------------------------------------------------------------

const QUANTIFIERS: USELSymbol[] = [
  {
    id: 'PRIME_ONE',
    name: 'ONE',
    tier: 0,
    category: 'quantifier',
    level: 1,
    glyph: '①',
    color: CATEGORY_COLORS.quantifier,
    accepts: [],
    provides: ['modifier'],
    pronunciation: {
      en: 'one',
      es: 'uno',
      zh: 'yī (一)',
      ar: 'wāḥid (واحد)',
    },
    description: 'The smallest counting number; singularity.',
  },
  {
    id: 'PRIME_TWO',
    name: 'TWO',
    tier: 0,
    category: 'quantifier',
    level: 1,
    glyph: '②',
    color: CATEGORY_COLORS.quantifier,
    accepts: [],
    provides: ['modifier'],
    pronunciation: {
      en: 'two',
      es: 'dos',
      zh: 'èr (二)',
      ar: 'ithnān (اثنان)',
    },
    description: 'A pair; the basis of duality and comparison.',
  },
  {
    id: 'PRIME_SOME',
    name: 'SOME',
    tier: 0,
    category: 'quantifier',
    level: 1,
    glyph: '◐',
    color: CATEGORY_COLORS.quantifier,
    accepts: [],
    provides: ['modifier'],
    pronunciation: {
      en: 'some',
      es: 'algunos',
      zh: 'yīxiē (一些)',
      ar: 'baʿḍ (بعض)',
    },
    description: 'An indefinite partial quantity; not none and not all.',
  },
  {
    id: 'PRIME_ALL',
    name: 'ALL',
    tier: 0,
    category: 'quantifier',
    level: 1,
    glyph: '∀',
    color: CATEGORY_COLORS.quantifier,
    accepts: [],
    provides: ['modifier'],
    pronunciation: {
      en: 'all',
      es: 'todos',
      zh: 'suǒyǒu (所有)',
      ar: 'kull (كل)',
    },
    description: 'The complete totality; every member without exception.',
  },
  {
    id: 'PRIME_MUCH_MANY',
    name: 'MUCH/MANY',
    tier: 0,
    category: 'quantifier',
    level: 2,
    glyph: '⊞',
    color: CATEGORY_COLORS.quantifier,
    accepts: [],
    provides: ['modifier'],
    pronunciation: {
      en: 'much/many',
      es: 'mucho/muchos',
      zh: 'duō (多)',
      ar: 'kathīr (كثير)',
    },
    description: 'A large quantity or degree; abundance.',
  },
];

// ---------------------------------------------------------------------------
// Evaluators — Value judgments (2 primes)
// ---------------------------------------------------------------------------

const EVALUATORS: USELSymbol[] = [
  {
    id: 'PRIME_GOOD',
    name: 'GOOD',
    tier: 0,
    category: 'evaluator',
    level: 1,
    glyph: '✦',
    color: CATEGORY_COLORS.evaluator,
    accepts: ['object', 'modifier'],
    provides: ['modifier'],
    pronunciation: {
      en: 'good',
      es: 'bueno',
      zh: 'hǎo (好)',
      ar: 'jayyid (جيد)',
    },
    description: 'Positive evaluation; something desirable or proper.',
  },
  {
    id: 'PRIME_BAD',
    name: 'BAD',
    tier: 0,
    category: 'evaluator',
    level: 1,
    glyph: '✘',
    color: CATEGORY_COLORS.evaluator,
    accepts: ['object', 'modifier'],
    provides: ['modifier'],
    pronunciation: {
      en: 'bad',
      es: 'malo',
      zh: 'huài (坏)',
      ar: 'sayyiʾ (سيء)',
    },
    description: 'Negative evaluation; something undesirable or improper.',
  },
];

// ---------------------------------------------------------------------------
// Descriptors — Physical scale (2 primes)
// ---------------------------------------------------------------------------

const DESCRIPTORS: USELSymbol[] = [
  {
    id: 'PRIME_BIG',
    name: 'BIG',
    tier: 0,
    category: 'descriptor',
    level: 1,
    glyph: '△',
    color: CATEGORY_COLORS.descriptor,
    accepts: ['object', 'modifier'],
    provides: ['modifier'],
    pronunciation: {
      en: 'big',
      es: 'grande',
      zh: 'dà (大)',
      ar: 'kabīr (كبير)',
    },
    description: 'Large in size, extent, or degree.',
  },
  {
    id: 'PRIME_SMALL',
    name: 'SMALL',
    tier: 0,
    category: 'descriptor',
    level: 1,
    glyph: '▽',
    color: CATEGORY_COLORS.descriptor,
    accepts: ['object', 'modifier'],
    provides: ['modifier'],
    pronunciation: {
      en: 'small',
      es: 'pequeño',
      zh: 'xiǎo (小)',
      ar: 'ṣaghīr (صغير)',
    },
    description: 'Little in size, extent, or degree.',
  },
];

// ---------------------------------------------------------------------------
// Mental predicates — Inner life (7 primes)
// ---------------------------------------------------------------------------

const MENTAL: USELSymbol[] = [
  {
    id: 'PRIME_THINK',
    name: 'THINK',
    tier: 0,
    category: 'mental',
    level: 2,
    glyph: '💭',
    color: CATEGORY_COLORS.mental,
    accepts: ['subject'],
    provides: ['predicate'],
    pronunciation: {
      en: 'think',
      es: 'pensar',
      zh: 'xiǎng (想)',
      ar: 'yufakkir (يفكر)',
    },
    description: 'Cognitive activity; forming thoughts or opinions.',
  },
  {
    id: 'PRIME_KNOW',
    name: 'KNOW',
    tier: 0,
    category: 'mental',
    level: 2,
    glyph: '🔑',
    color: CATEGORY_COLORS.mental,
    accepts: ['subject'],
    provides: ['predicate'],
    pronunciation: {
      en: 'know',
      es: 'saber',
      zh: 'zhīdào (知道)',
      ar: 'yaʿrif (يعرف)',
    },
    description: 'Having certain knowledge; epistemic certainty.',
  },
  {
    id: 'PRIME_WANT',
    name: 'WANT',
    tier: 0,
    category: 'mental',
    level: 1,
    glyph: '♡',
    color: CATEGORY_COLORS.mental,
    accepts: ['subject'],
    provides: ['predicate'],
    pronunciation: {
      en: 'want',
      es: 'querer',
      zh: 'yào (要)',
      ar: 'yurīd (يريد)',
    },
    description: 'Desire; wishing for something to be the case.',
  },
  {
    id: 'PRIME_DONT_WANT',
    name: "DON'T WANT",
    tier: 0,
    category: 'mental',
    level: 2,
    glyph: '⊘',
    color: CATEGORY_COLORS.mental,
    accepts: ['subject'],
    provides: ['predicate'],
    pronunciation: {
      en: "don't want",
      es: 'no querer',
      zh: 'bù yào (不要)',
      ar: 'lā yurīd (لا يريد)',
    },
    description: 'Aversion; wishing for something not to be the case.',
  },
  {
    id: 'PRIME_FEEL',
    name: 'FEEL',
    tier: 0,
    category: 'mental',
    level: 2,
    glyph: '💫',
    color: CATEGORY_COLORS.mental,
    accepts: ['subject'],
    provides: ['predicate'],
    pronunciation: {
      en: 'feel',
      es: 'sentir',
      zh: 'gǎnjué (感觉)',
      ar: 'yashʿur (يشعر)',
    },
    description: 'Subjective experience; emotion or sensation.',
  },
  {
    id: 'PRIME_SEE',
    name: 'SEE',
    tier: 0,
    category: 'mental',
    level: 1,
    glyph: '👁',
    color: CATEGORY_COLORS.mental,
    accepts: ['subject'],
    provides: ['predicate'],
    pronunciation: {
      en: 'see',
      es: 'ver',
      zh: 'kàn (看)',
      ar: 'yarā (يرى)',
    },
    description: 'Visual perception; taking in through sight.',
  },
  {
    id: 'PRIME_HEAR',
    name: 'HEAR',
    tier: 0,
    category: 'mental',
    level: 1,
    glyph: '👂',
    color: CATEGORY_COLORS.mental,
    accepts: ['subject'],
    provides: ['predicate'],
    pronunciation: {
      en: 'hear',
      es: 'oír',
      zh: 'tīng (听)',
      ar: 'yasmaʿ (يسمع)',
    },
    description: 'Auditory perception; taking in through hearing.',
  },
];

// ---------------------------------------------------------------------------
// Speech — Communication (3 primes)
// ---------------------------------------------------------------------------

const SPEECH: USELSymbol[] = [
  {
    id: 'PRIME_SAY',
    name: 'SAY',
    tier: 0,
    category: 'speech',
    level: 2,
    glyph: '💬',
    color: CATEGORY_COLORS.speech,
    accepts: ['subject'],
    provides: ['predicate'],
    pronunciation: {
      en: 'say',
      es: 'decir',
      zh: 'shuō (说)',
      ar: 'yaqūl (يقول)',
    },
    description: 'Verbal expression; producing words for another to hear.',
  },
  {
    id: 'PRIME_WORDS',
    name: 'WORDS',
    tier: 0,
    category: 'speech',
    level: 3,
    glyph: '📝',
    color: CATEGORY_COLORS.speech,
    accepts: [],
    provides: ['object'],
    pronunciation: {
      en: 'words',
      es: 'palabras',
      zh: 'cí (词)',
      ar: 'kalimāt (كلمات)',
    },
    description: 'Units of language; the medium of saying.',
  },
  {
    id: 'PRIME_TRUE',
    name: 'TRUE',
    tier: 0,
    category: 'speech',
    level: 3,
    glyph: '✓',
    color: CATEGORY_COLORS.speech,
    accepts: ['object', 'modifier'],
    provides: ['modifier'],
    pronunciation: {
      en: 'true',
      es: 'verdadero',
      zh: 'zhēn (真)',
      ar: 'ṣaḥīḥ (صحيح)',
    },
    description: 'Correspondence with reality; not false.',
  },
];

// ---------------------------------------------------------------------------
// Actions — Doing and change (3 primes)
// ---------------------------------------------------------------------------

const ACTIONS: USELSymbol[] = [
  {
    id: 'PRIME_DO',
    name: 'DO',
    tier: 0,
    category: 'action',
    level: 1,
    glyph: '⚡',
    color: CATEGORY_COLORS.action,
    accepts: ['subject'],
    provides: ['predicate'],
    pronunciation: {
      en: 'do',
      es: 'hacer',
      zh: 'zuò (做)',
      ar: 'yafʿal (يفعل)',
    },
    description: 'Volitional action; an agent causing something.',
  },
  {
    id: 'PRIME_HAPPEN',
    name: 'HAPPEN',
    tier: 0,
    category: 'action',
    level: 2,
    glyph: '🎯',
    color: CATEGORY_COLORS.action,
    accepts: ['subject'],
    provides: ['predicate'],
    pronunciation: {
      en: 'happen',
      es: 'pasar',
      zh: 'fāshēng (发生)',
      ar: 'yaḥduth (يحدث)',
    },
    description: 'An event occurring; something coming to pass without an agent.',
  },
  {
    id: 'PRIME_MOVE',
    name: 'MOVE',
    tier: 0,
    category: 'action',
    level: 1,
    glyph: '→',
    color: CATEGORY_COLORS.action,
    accepts: ['subject'],
    provides: ['predicate'],
    pronunciation: {
      en: 'move',
      es: 'mover',
      zh: 'dòng (动)',
      ar: 'yataḥarrak (يتحرك)',
    },
    description: 'Change of position in space; physical displacement.',
  },
];

// ---------------------------------------------------------------------------
// Existence — Being and possession (3 primes)
// ---------------------------------------------------------------------------

const EXISTENCE: USELSymbol[] = [
  {
    id: 'PRIME_THERE_IS',
    name: 'THERE IS',
    tier: 0,
    category: 'existence',
    level: 2,
    glyph: '∃',
    color: CATEGORY_COLORS.existence,
    accepts: [],
    provides: ['predicate'],
    pronunciation: {
      en: 'there is',
      es: 'hay',
      zh: 'yǒu (有)',
      ar: 'yūjad (يوجد)',
    },
    description: 'Existential assertion; declaring that something exists.',
  },
  {
    id: 'PRIME_BE',
    name: 'BE',
    tier: 0,
    category: 'existence',
    level: 2,
    glyph: '≋',
    color: CATEGORY_COLORS.existence,
    accepts: ['subject'],
    provides: ['predicate'],
    pronunciation: {
      en: 'be (is)',
      es: 'ser/estar',
      zh: 'shì (是)',
      ar: 'yakūn (يكون)',
    },
    description: 'The copula; linking a subject to a state or identity.',
  },
  {
    id: 'PRIME_HAVE',
    name: 'HAVE',
    tier: 0,
    category: 'existence',
    level: 3,
    glyph: '⊃',
    color: CATEGORY_COLORS.existence,
    accepts: ['subject'],
    provides: ['predicate'],
    pronunciation: {
      en: 'have',
      es: 'tener',
      zh: 'yǒu (有)',
      ar: 'yamluk (يملك)',
    },
    description: 'Possession or association; something belongs to or is part of someone.',
  },
];

// ---------------------------------------------------------------------------
// Life and death (2 primes)
// ---------------------------------------------------------------------------

const LIFE: USELSymbol[] = [
  {
    id: 'PRIME_LIVE',
    name: 'LIVE',
    tier: 0,
    category: 'life',
    level: 1,
    glyph: '🌱',
    color: CATEGORY_COLORS.life,
    accepts: ['subject'],
    provides: ['predicate'],
    pronunciation: {
      en: 'live',
      es: 'vivir',
      zh: 'huó (活)',
      ar: 'yaʿīsh (يعيش)',
    },
    description: 'Being alive; the state of biological and experiential existence.',
  },
  {
    id: 'PRIME_DIE',
    name: 'DIE',
    tier: 0,
    category: 'life',
    level: 3,
    glyph: '🍂',
    color: CATEGORY_COLORS.life,
    accepts: ['subject'],
    provides: ['predicate'],
    pronunciation: {
      en: 'die',
      es: 'morir',
      zh: 'sǐ (死)',
      ar: 'yamūt (يموت)',
    },
    description: 'Cessation of life; the irreversible end of living.',
  },
];

// ---------------------------------------------------------------------------
// Time — Temporal anchoring and duration (8 primes)
// ---------------------------------------------------------------------------

const TIME: USELSymbol[] = [
  {
    id: 'PRIME_WHEN_TIME',
    name: 'WHEN/TIME',
    tier: 0,
    category: 'time',
    level: 2,
    glyph: '⏰',
    color: CATEGORY_COLORS.time,
    accepts: [],
    provides: ['modifier'],
    pronunciation: {
      en: 'when/time',
      es: 'cuándo/tiempo',
      zh: 'shíhou (时候)',
      ar: 'matā/waqt (متى/وقت)',
    },
    description: 'Temporal reference; the concept of time or a point in it.',
  },
  {
    id: 'PRIME_NOW',
    name: 'NOW',
    tier: 0,
    category: 'time',
    level: 1,
    glyph: '⊙',
    color: CATEGORY_COLORS.time,
    accepts: [],
    provides: ['modifier'],
    pronunciation: {
      en: 'now',
      es: 'ahora',
      zh: 'xiànzài (现在)',
      ar: 'al-ān (الآن)',
    },
    description: 'The present moment; the time of speaking.',
  },
  {
    id: 'PRIME_BEFORE',
    name: 'BEFORE',
    tier: 0,
    category: 'time',
    level: 1,
    glyph: '◄',
    color: CATEGORY_COLORS.time,
    accepts: [],
    provides: ['modifier'],
    pronunciation: {
      en: 'before',
      es: 'antes',
      zh: 'zhīqián (之前)',
      ar: 'qabl (قبل)',
    },
    description: 'Earlier in time; preceding a reference point.',
  },
  {
    id: 'PRIME_AFTER',
    name: 'AFTER',
    tier: 0,
    category: 'time',
    level: 1,
    glyph: '►',
    color: CATEGORY_COLORS.time,
    accepts: [],
    provides: ['modifier'],
    pronunciation: {
      en: 'after',
      es: 'después',
      zh: 'zhīhòu (之后)',
      ar: 'baʿd (بعد)',
    },
    description: 'Later in time; following a reference point.',
  },
  {
    id: 'PRIME_A_LONG_TIME',
    name: 'A LONG TIME',
    tier: 0,
    category: 'time',
    level: 3,
    glyph: '⏳',
    color: CATEGORY_COLORS.time,
    accepts: [],
    provides: ['modifier'],
    pronunciation: {
      en: 'a long time',
      es: 'mucho tiempo',
      zh: 'hěn jiǔ (很久)',
      ar: 'waqt ṭawīl (وقت طويل)',
    },
    description: 'An extended duration; a large stretch of time.',
  },
  {
    id: 'PRIME_A_SHORT_TIME',
    name: 'A SHORT TIME',
    tier: 0,
    category: 'time',
    level: 3,
    glyph: '⏱',
    color: CATEGORY_COLORS.time,
    accepts: [],
    provides: ['modifier'],
    pronunciation: {
      en: 'a short time',
      es: 'poco tiempo',
      zh: 'duǎn shíjiān (短时间)',
      ar: 'waqt qaṣīr (وقت قصير)',
    },
    description: 'A brief duration; a small stretch of time.',
  },
  {
    id: 'PRIME_FOR_SOME_TIME',
    name: 'FOR SOME TIME',
    tier: 0,
    category: 'time',
    level: 3,
    glyph: '⌛',
    color: CATEGORY_COLORS.time,
    accepts: [],
    provides: ['modifier'],
    pronunciation: {
      en: 'for some time',
      es: 'por un tiempo',
      zh: 'yīduàn shíjiān (一段时间)',
      ar: 'li-fatrah (لفترة)',
    },
    description: 'An indefinite duration; a period whose length is unspecified.',
  },
  {
    id: 'PRIME_MOMENT',
    name: 'MOMENT',
    tier: 0,
    category: 'time',
    level: 3,
    glyph: '✧',
    color: CATEGORY_COLORS.time,
    accepts: [],
    provides: ['modifier'],
    pronunciation: {
      en: 'moment',
      es: 'momento',
      zh: 'shùnjiān (瞬间)',
      ar: 'laḥẓah (لحظة)',
    },
    description: 'An instant; the smallest experiential unit of time.',
  },
];

// ---------------------------------------------------------------------------
// Space — Spatial anchoring and topology (9 primes)
// ---------------------------------------------------------------------------

const SPACE: USELSymbol[] = [
  {
    id: 'PRIME_WHERE_PLACE',
    name: 'WHERE/PLACE',
    tier: 0,
    category: 'space',
    level: 2,
    glyph: '📍',
    color: CATEGORY_COLORS.space,
    accepts: [],
    provides: ['modifier'],
    pronunciation: {
      en: 'where/place',
      es: 'dónde/lugar',
      zh: 'nǎlǐ/dìfāng (哪里/地方)',
      ar: 'ayna/makān (أين/مكان)',
    },
    description: 'Spatial reference; the concept of location or a point in space.',
  },
  {
    id: 'PRIME_HERE',
    name: 'HERE',
    tier: 0,
    category: 'space',
    level: 1,
    glyph: '⊗',
    color: CATEGORY_COLORS.space,
    accepts: [],
    provides: ['modifier'],
    pronunciation: {
      en: 'here',
      es: 'aquí',
      zh: 'zhèlǐ (这里)',
      ar: 'hunā (هنا)',
    },
    description: 'The location of the speaker; spatial deixis.',
  },
  {
    id: 'PRIME_ABOVE',
    name: 'ABOVE',
    tier: 0,
    category: 'space',
    level: 1,
    glyph: '⬆',
    color: CATEGORY_COLORS.space,
    accepts: [],
    provides: ['modifier'],
    pronunciation: {
      en: 'above',
      es: 'arriba',
      zh: 'shàng (上)',
      ar: 'fawq (فوق)',
    },
    description: 'Higher in vertical space; over a reference point.',
  },
  {
    id: 'PRIME_BELOW',
    name: 'BELOW',
    tier: 0,
    category: 'space',
    level: 1,
    glyph: '⬇',
    color: CATEGORY_COLORS.space,
    accepts: [],
    provides: ['modifier'],
    pronunciation: {
      en: 'below',
      es: 'abajo',
      zh: 'xià (下)',
      ar: 'taḥt (تحت)',
    },
    description: 'Lower in vertical space; under a reference point.',
  },
  {
    id: 'PRIME_FAR',
    name: 'FAR',
    tier: 0,
    category: 'space',
    level: 2,
    glyph: '⇥',
    color: CATEGORY_COLORS.space,
    accepts: [],
    provides: ['modifier'],
    pronunciation: {
      en: 'far',
      es: 'lejos',
      zh: 'yuǎn (远)',
      ar: 'baʿīd (بعيد)',
    },
    description: 'At a great distance; not close.',
  },
  {
    id: 'PRIME_NEAR',
    name: 'NEAR',
    tier: 0,
    category: 'space',
    level: 2,
    glyph: '⇤',
    color: CATEGORY_COLORS.space,
    accepts: [],
    provides: ['modifier'],
    pronunciation: {
      en: 'near',
      es: 'cerca',
      zh: 'jìn (近)',
      ar: 'qarīb (قريب)',
    },
    description: 'At a small distance; close to a reference point.',
  },
  {
    id: 'PRIME_SIDE',
    name: 'SIDE',
    tier: 0,
    category: 'space',
    level: 3,
    glyph: '∥',
    color: CATEGORY_COLORS.space,
    accepts: [],
    provides: ['modifier'],
    pronunciation: {
      en: 'side',
      es: 'lado',
      zh: 'cè (侧)',
      ar: 'jānib (جانب)',
    },
    description: 'A lateral surface or region; beside something.',
  },
  {
    id: 'PRIME_INSIDE',
    name: 'INSIDE',
    tier: 0,
    category: 'space',
    level: 3,
    glyph: '⊂',
    color: CATEGORY_COLORS.space,
    accepts: [],
    provides: ['modifier'],
    pronunciation: {
      en: 'inside',
      es: 'dentro',
      zh: 'lǐmiàn (里面)',
      ar: 'dākhil (داخل)',
    },
    description: 'Within the boundaries of something; contained.',
  },
  {
    id: 'PRIME_TOUCH',
    name: 'TOUCH',
    tier: 0,
    category: 'space',
    level: 3,
    glyph: '✋',
    color: CATEGORY_COLORS.space,
    accepts: [],
    provides: ['modifier'],
    pronunciation: {
      en: 'touch',
      es: 'tocar',
      zh: 'chù (触)',
      ar: 'yalmus (يلمس)',
    },
    description: 'Physical contact; being in direct spatial adjacency.',
  },
];

// ---------------------------------------------------------------------------
// Logical — Reasoning and conditions (5 primes)
// ---------------------------------------------------------------------------

const LOGICAL: USELSymbol[] = [
  {
    id: 'PRIME_NOT',
    name: 'NOT',
    tier: 0,
    category: 'logical',
    level: 1,
    glyph: '¬',
    color: CATEGORY_COLORS.logical,
    accepts: [],
    provides: ['condition'],
    pronunciation: {
      en: 'not',
      es: 'no',
      zh: 'bù (不)',
      ar: 'lā (لا)',
    },
    description: 'Negation; the reversal of a truth value.',
  },
  {
    id: 'PRIME_MAYBE',
    name: 'MAYBE',
    tier: 0,
    category: 'logical',
    level: 3,
    glyph: '≈',
    color: CATEGORY_COLORS.logical,
    accepts: [],
    provides: ['condition'],
    pronunciation: {
      en: 'maybe',
      es: 'quizás',
      zh: 'yěxǔ (也许)',
      ar: 'rubbamā (ربما)',
    },
    description: 'Epistemic possibility; something may or may not be the case.',
  },
  {
    id: 'PRIME_CAN',
    name: 'CAN',
    tier: 0,
    category: 'logical',
    level: 3,
    glyph: '⚙',
    color: CATEGORY_COLORS.logical,
    accepts: [],
    provides: ['condition'],
    pronunciation: {
      en: 'can',
      es: 'poder',
      zh: 'néng (能)',
      ar: 'yastaṭīʿ (يستطيع)',
    },
    description: 'Ability or possibility; something is within capacity.',
  },
  {
    id: 'PRIME_BECAUSE',
    name: 'BECAUSE',
    tier: 0,
    category: 'logical',
    level: 2,
    glyph: '∵',
    color: CATEGORY_COLORS.logical,
    accepts: [],
    provides: ['condition'],
    pronunciation: {
      en: 'because',
      es: 'porque',
      zh: 'yīnwèi (因为)',
      ar: 'li-anna (لأن)',
    },
    description: 'Causal link; one thing is the reason for another.',
  },
  {
    id: 'PRIME_IF',
    name: 'IF',
    tier: 0,
    category: 'logical',
    level: 2,
    glyph: '⟹',
    color: CATEGORY_COLORS.logical,
    accepts: [],
    provides: ['condition'],
    pronunciation: {
      en: 'if',
      es: 'si',
      zh: 'rúguǒ (如果)',
      ar: 'idhā (إذا)',
    },
    description: 'Conditional; establishes a hypothetical scenario.',
  },
];

// ---------------------------------------------------------------------------
// Intensifiers — Degree and comparison (2 primes)
// ---------------------------------------------------------------------------

const INTENSIFIERS: USELSymbol[] = [
  {
    id: 'PRIME_VERY',
    name: 'VERY',
    tier: 0,
    category: 'intensifier',
    level: 1,
    glyph: '⇑',
    color: CATEGORY_COLORS.intensifier,
    accepts: [],
    provides: ['modifier'],
    pronunciation: {
      en: 'very',
      es: 'muy',
      zh: 'hěn (很)',
      ar: 'jiddan (جداً)',
    },
    description: 'High degree; amplifies the intensity of a quality.',
  },
  {
    id: 'PRIME_MORE',
    name: 'MORE',
    tier: 0,
    category: 'intensifier',
    level: 2,
    glyph: '⊕',
    color: CATEGORY_COLORS.intensifier,
    accepts: [],
    provides: ['modifier'],
    pronunciation: {
      en: 'more',
      es: 'más',
      zh: 'gèng (更)',
      ar: 'akthar (أكثر)',
    },
    description: 'Greater degree or quantity relative to a reference.',
  },
];

// ---------------------------------------------------------------------------
// Similarity — Manner and likeness (1 prime)
// ---------------------------------------------------------------------------

const SIMILARITY: USELSymbol[] = [
  {
    id: 'PRIME_LIKE_WAY',
    name: 'LIKE/WAY',
    tier: 0,
    category: 'similarity',
    level: 3,
    glyph: '∼',
    color: CATEGORY_COLORS.similarity,
    accepts: [],
    provides: ['modifier'],
    pronunciation: {
      en: 'like/way',
      es: 'como/manera',
      zh: 'xiàng/fāngshì (像/方式)',
      ar: 'mithl/ṭarīqah (مثل/طريقة)',
    },
    description: 'Resemblance or manner; the way something is done or how things compare.',
  },
];

// ============================================================================
// Assembled exports
// ============================================================================

/** All 65 Tier 0 NSM semantic primes. */
export const TIER0_PRIMES: USELSymbol[] = [
  ...SUBSTANTIVES,
  ...RELATIONAL,
  ...DETERMINERS,
  ...QUANTIFIERS,
  ...EVALUATORS,
  ...DESCRIPTORS,
  ...MENTAL,
  ...SPEECH,
  ...ACTIONS,
  ...EXISTENCE,
  ...LIFE,
  ...TIME,
  ...SPACE,
  ...LOGICAL,
  ...INTENSIFIERS,
  ...SIMILARITY,
];

/** Lookup any prime by its id (e.g. "PRIME_WANT"). */
export const PRIME_BY_ID: Record<string, USELSymbol> = Object.fromEntries(
  TIER0_PRIMES.map((p) => [p.id, p]),
);
