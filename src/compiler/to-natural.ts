/**
 * USEL → Natural Language Compiler
 *
 * Converts a USEL AST into human-readable sentences in multiple languages.
 *
 * Supported languages:
 *   en — English        es — Spanish       zh — Mandarin Chinese
 *   ar — Arabic         fr — French        ja — Japanese
 *
 * Each USEL prime carries a `pronunciation` map keyed by language code.
 * This compiler looks up the correct word for each node, then reorders
 * the words according to the target language's grammar:
 *
 *   SVO  — English, Spanish, French, Mandarin (default)
 *   VSO  — Arabic
 *   SOV  — Japanese
 *
 * Examples for [I, WANT, SEE, SOMETHING, BIG]:
 *   EN: "I want to see something big"
 *   ES: "Quiero ver algo grande"
 *   ZH: "我想看到大的东西"
 *   AR: "أريد أن أرى شيئاً كبيراً"
 *   FR: "Je veux voir quelque chose de grand"
 *   JA: "私は大きい何かを見たい"
 */

import type { USELAST, USELNode, USELStatement } from '../primes/types.js';
import {
  analyseStatement,
  classifyNode,
  getPronunciation,
  isConditional,
  splitConditional,
  type AnalysedStatement,
} from './utils.js';

// ---------------------------------------------------------------------------
// Language configuration
// ---------------------------------------------------------------------------

type WordOrder = 'SVO' | 'SOV' | 'VSO';

interface LangConfig {
  order: WordOrder;
  /** Connector between predicate chains (e.g. "to" in English). */
  verbConnector: string;
  /** Conditional keyword. */
  ifWord: string;
  /** "then" or equivalent separator between condition and body. */
  thenWord: string;
  /** RTL script flag. */
  rtl: boolean;
}

const LANG_CONFIGS: Record<string, LangConfig> = {
  en: { order: 'SVO', verbConnector: 'to',  ifWord: 'if',    thenWord: 'then', rtl: false },
  es: { order: 'SVO', verbConnector: '',     ifWord: 'si',    thenWord: '',     rtl: false },
  fr: { order: 'SVO', verbConnector: '',     ifWord: 'si',    thenWord: 'alors',rtl: false },
  zh: { order: 'SVO', verbConnector: '',     ifWord: '如果',  thenWord: '就',   rtl: false },
  ar: { order: 'VSO', verbConnector: 'أن',  ifWord: 'إذا',   thenWord: '',     rtl: true  },
  ja: { order: 'SOV', verbConnector: '',     ifWord: 'もし',  thenWord: 'なら', rtl: false },
};

const DEFAULT_LANG = 'en';

function getLangConfig(lang: string): LangConfig {
  return LANG_CONFIGS[lang] ?? LANG_CONFIGS[DEFAULT_LANG];
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Compile a USEL AST to natural language text.
 *
 * @param ast  – The USEL program AST.
 * @param lang – ISO 639-1 language code (en, es, zh, ar, fr, ja).
 */
export function compileToNatural(ast: USELAST, lang: string = 'en'): string {
  if (!ast.statements.length) return '';

  const sentences = ast.statements.map(s => compileStatementNL(s, lang));
  return sentences.join(' ');
}

// ---------------------------------------------------------------------------
// Statement-level compilation
// ---------------------------------------------------------------------------

function compileStatementNL(stmt: USELStatement, lang: string): string {
  if (stmt.nodes.length === 0) return '';

  const cfg = getLangConfig(lang);

  // Conditional path
  if (isConditional(stmt)) {
    return compileConditionalNL(stmt, lang, cfg);
  }

  if (stmt.condition) {
    const cond = compileStatementNL(stmt.condition, lang);
    const body = compileBodyNL(stmt, lang, cfg);
    return formatConditional(cond, body, cfg);
  }

  return capitalise(compileBodyNL(stmt, lang, cfg), lang) + '.';
}

// ---------------------------------------------------------------------------
// Conditional
// ---------------------------------------------------------------------------

function compileConditionalNL(
  stmt: USELStatement, lang: string, cfg: LangConfig,
): string {
  const { conditionNodes, bodyNodes } = splitConditional(stmt);

  const condPhrase = conditionNodes.length
    ? compileFragmentNL(conditionNodes, lang, cfg)
    : '';
  const bodyPhrase = bodyNodes.length
    ? compileFragmentNL(bodyNodes, lang, cfg)
    : '';

  return capitalise(formatConditional(condPhrase, bodyPhrase, cfg), lang);
}

function formatConditional(cond: string, body: string, cfg: LangConfig): string {
  const parts: string[] = [cfg.ifWord, cond];
  if (cfg.thenWord) parts.push(cfg.thenWord);
  if (body) parts.push(body);
  return parts.filter(Boolean).join(' ') + '.';
}

// ---------------------------------------------------------------------------
// Body / fragment builders
// ---------------------------------------------------------------------------

function compileBodyNL(
  stmt: USELStatement, lang: string, cfg: LangConfig,
): string {
  const analysis = analyseStatement(stmt);
  return assemblePhrase(analysis, lang, cfg);
}

function compileFragmentNL(
  nodes: USELNode[], lang: string, cfg: LangConfig,
): string {
  const fakeStmt: USELStatement = { type: 'statement', nodes };
  const analysis = analyseStatement(fakeStmt);
  return assemblePhrase(analysis, lang, cfg);
}

// ---------------------------------------------------------------------------
// Phrase assembly — applies word-order rules
// ---------------------------------------------------------------------------

function assemblePhrase(a: AnalysedStatement, lang: string, cfg: LangConfig): string {
  const subjectWord = a.subject ? wordForNode(a.subject, lang) : '';

  // Build predicate chain with connectors
  const verbWords = a.predicates.map(p => wordForNode(p, lang));
  const verbPhrase = verbWords.length > 1
    ? verbWords.join(cfg.verbConnector ? ` ${cfg.verbConnector} ` : ' ')
    : verbWords[0] ?? '';

  // Object words with their modifiers
  const objectParts = a.objects.map(o => {
    const objWord = wordForNode(o, lang);
    const mods = (a.modifierMap.get(o.id) ?? []).map(m => wordForNode(m, lang));
    return buildModifiedNoun(objWord, mods, lang, cfg);
  });
  const objectPhrase = objectParts.join(', ');

  // Orphan modifiers not attached to any object
  const attachedIds = new Set<string>();
  for (const [, mods] of a.modifierMap) {
    for (const m of mods) attachedIds.add(m.id);
  }
  const orphanMods = a.modifiers
    .filter(m => !attachedIds.has(m.id))
    .map(m => wordForNode(m, lang));

  // Temporal / spatial adverbs
  const adverbs = [
    ...a.temporals.map(n => wordForNode(n, lang)),
    ...a.spatials.map(n => wordForNode(n, lang)),
  ];

  // Assemble according to word order
  const parts: string[] = [];

  switch (cfg.order) {
    case 'SVO':
      if (subjectWord)   parts.push(subjectWord);
      if (orphanMods.length) parts.push(...orphanMods);
      if (verbPhrase)    parts.push(verbPhrase);
      if (objectPhrase)  parts.push(objectPhrase);
      break;

    case 'VSO':
      if (verbPhrase)    parts.push(verbPhrase);
      if (subjectWord)   parts.push(subjectWord);
      if (objectPhrase)  parts.push(objectPhrase);
      if (orphanMods.length) parts.push(...orphanMods);
      break;

    case 'SOV':
      if (subjectWord)   parts.push(subjectWord);
      if (objectPhrase)  parts.push(objectPhrase);
      if (orphanMods.length) parts.push(...orphanMods);
      if (verbPhrase)    parts.push(verbPhrase);
      break;
  }

  if (adverbs.length) parts.push(...adverbs);

  return parts.filter(Boolean).join(' ');
}

// ---------------------------------------------------------------------------
// Noun + modifier ordering
// ---------------------------------------------------------------------------

/**
 * Combine a noun with its modifiers according to language rules.
 *
 * English / Mandarin / Japanese: modifier BEFORE noun  ("big thing")
 * Spanish / French / Arabic:     modifier AFTER noun    ("cosa grande")
 */
function buildModifiedNoun(
  noun: string, modifiers: string[], lang: string, _cfg: LangConfig,
): string {
  if (modifiers.length === 0) return noun;

  const modsStr = modifiers.join(' ');

  // Languages with post-nominal adjectives
  if (['es', 'fr', 'ar'].includes(lang)) {
    return `${noun} ${modsStr}`;
  }

  // Default: pre-nominal (en, zh, ja)
  return `${modsStr} ${noun}`;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function wordForNode(node: USELNode, lang: string): string {
  return getPronunciation(node, lang);
}

function capitalise(text: string, lang: string): string {
  if (!text) return text;
  // Arabic and CJK don't capitalise
  if (['ar', 'zh', 'ja'].includes(lang)) return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
}
