import { getEmbedding, cosineSimilarity, nearestPrimes, composeEmbeddings, decomposeEmbedding, listPrimeIds } from './src/ai/embeddings.js';
import { naturalToUSEL, uselToNatural, suggestSymbols } from './src/ai/translate.js';
import { createExperiment, generateExperimentPrompts, analyzeResults, generateReport } from './src/ai/experiment.js';

// Test embeddings
const good = getEmbedding('GOOD')!;
const bad = getEmbedding('BAD')!;
const think = getEmbedding('THINK')!;
const know = getEmbedding('KNOW')!;
const big = getEmbedding('BIG')!;

console.log('=== EMBEDDING TESTS ===');
console.log(`GOOD↔BAD (opposites):   ${cosineSimilarity(good, bad).toFixed(3)}`);
console.log(`THINK↔KNOW (related):   ${cosineSimilarity(think, know).toFixed(3)}`);
console.log(`GOOD↔BIG (unrelated):   ${cosineSimilarity(good, big).toFixed(3)}`);
console.log(`Total primes: ${listPrimeIds().length}`);

// Composition
const love = composeEmbeddings([getEmbedding('FEEL')!, getEmbedding('VERY')!, good]);
console.log(`\nComposed FEEL+VERY+GOOD → ${love.symbolId}`);
const nearest = nearestPrimes(love.vector, 3);
console.log(`Nearest primes: ${nearest.map(n => `${n.symbolId}(${n.similarity.toFixed(2)})`).join(', ')}`);

// Decomposition
const decomp = decomposeEmbedding(love.vector, 0.15);
console.log(`Decomposition: ${decomp.join(' + ')}`);

// Translation
console.log('\n=== TRANSLATION TESTS ===');
console.log(`"I want to see something big" → ${naturalToUSEL('I want to see something big').join(' ')}`);
console.log(`"yo quiero ver algo grande" → ${naturalToUSEL('yo quiero ver algo grande', 'es').join(' ')}`);
console.log(`[I, WANT, SEE, SOMETHING, BIG] → "${uselToNatural(['I', 'WANT', 'SEE', 'SOMETHING', 'BIG'])}"`);
console.log(`[I, NOT, KNOW] → "${uselToNatural(['I', 'NOT', 'KNOW'])}"`);
console.log(`"don't want" → ${naturalToUSEL("I don't want this").join(' ')}`);

// Suggestions
const sugg = suggestSymbols('thi');
console.log(`\nSuggestions for "thi": ${sugg.slice(0,3).map(s => s.symbolId).join(', ')}`);

// Experiment
console.log('\n=== EXPERIMENT TESTS ===');
const exp = createExperiment({ primes: ['THINK', 'KNOW', 'WANT'] });
const prompts = generateExperimentPrompts(['THINK']);
console.log(`Experiment: ${exp.primes.length} primes × ${exp.models.length} models`);
console.log(`Generated ${prompts.length} prompts for THINK`);

// Mock results
const mockResults = [
  { primeId: 'THINK', model: 'claude', trial: 1, featureIndex: 42, activation: 0.9, stability: 0.85, isMonosemantic: true },
  { primeId: 'THINK', model: 'claude', trial: 2, featureIndex: 42, activation: 0.87, stability: 0.85, isMonosemantic: true },
  { primeId: 'THINK', model: 'gpt', trial: 1, featureIndex: 108, activation: 0.82, stability: 0.78, isMonosemantic: true },
  { primeId: 'KNOW', model: 'claude', trial: 1, featureIndex: 55, activation: 0.75, stability: 0.6, isMonosemantic: false },
];
const analysis = analyzeResults(mockResults);
console.log(`Stable: ${analysis.stablePrimes.join(', ')}, Unstable: ${analysis.unstablePrimes.join(', ')}`);
console.log(`Cross-model: ${analysis.crossModelCorrelation}`);
