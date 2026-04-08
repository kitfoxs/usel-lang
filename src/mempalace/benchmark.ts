#!/usr/bin/env npx tsx
/**
 * USEL ↔ AAAK Benchmark
 *
 * Encodes 10 sample memories in both AAAK and USEL formats, then compares:
 *  - Compression ratio (encoded chars / original chars)
 *  - Token count
 *  - Readability score (heuristic: decodability + prime coverage)
 *  - Reconstruction accuracy (decoded text similarity to original)
 *
 * Usage:
 *   npx tsx benchmark.ts
 *   # or
 *   node --loader ts-node/esm benchmark.ts
 */

import { USELEncoder, type CompressionComparison } from "./usel-encoder.js";

// ─── Sample Memories ────────────────────────────────────────────────────────

const SAMPLE_MEMORIES: Array<{ id: number; text: string; category: string }> = [
  {
    id: 1,
    text: "Met with John yesterday about the project deadline. He seemed worried about the timeline.",
    category: "work-meeting",
  },
  {
    id: 2,
    text: "Sarah mentioned that the new database migration failed last week. We need to fix it urgently.",
    category: "technical-incident",
  },
  {
    id: 3,
    text: "Had a wonderful dinner with Mom and Dad. They told me about their travel plans for next year.",
    category: "family-event",
  },
  {
    id: 4,
    text: "The team decided to use Kubernetes for the deployment. Marcus agreed it was the best approach.",
    category: "technical-decision",
  },
  {
    id: 5,
    text: "Felt very frustrated today because the build kept breaking. Finally fixed it after 3 hours.",
    category: "emotional-technical",
  },
  {
    id: 6,
    text: "Kit learned about the new Azure AI services at the conference. She was extremely excited about the possibilities.",
    category: "learning-event",
  },
  {
    id: 7,
    text: "David helped me move the servers to the new rack. He is always very helpful and kind.",
    category: "work-collaboration",
  },
  {
    id: 8,
    text: "Read an important article about quantum computing yesterday. The implications for cryptography are huge.",
    category: "knowledge-acquisition",
  },
  {
    id: 9,
    text: "Tina called today to say she found an old photo of us from 2013. I felt happy and a little sad remembering those times.",
    category: "relationship-memory",
  },
  {
    id: 10,
    text: "The datacenter experienced a power outage 2 days ago. All critical systems recovered within 30 minutes.",
    category: "incident-report",
  },
];

// ─── Readability Scorer ─────────────────────────────────────────────────────

function scoreReadability(encoded: string, format: "aaak" | "usel"): number {
  let score = 0;
  const maxScore = 100;

  if (format === "usel") {
    const tokens = encoded.split("+").map((t) => t.trim());

    // Criterion 1: Bracket consistency (0-20)
    const bracketedTokens = tokens.filter((t) => /^\[.+\]$/.test(t));
    score += (bracketedTokens.length / Math.max(tokens.length, 1)) * 20;

    // Criterion 2: Named entity preservation (0-20)
    const namedEntities = tokens.filter((t) => /\[PERSON:/.test(t) || /\[TOPIC:/.test(t));
    score += Math.min(namedEntities.length * 5, 20);

    // Criterion 3: Temporal grounding (0-20)
    const temporalTokens = tokens.filter(
      (t) => /BEFORE|AFTER|NOW|WHEN/.test(t)
    );
    score += Math.min(temporalTokens.length * 10, 20);

    // Criterion 4: Action presence (0-20)
    const actionPrimes = ["SAY", "DO", "MOVE", "THINK", "KNOW", "SEE", "HEAR", "FEEL"];
    const hasAction = tokens.some((t) => actionPrimes.some((a) => t.includes(a)));
    score += hasAction ? 20 : 0;

    // Criterion 5: Conciseness — penalize if longer than original (0-20)
    score += Math.min(20, Math.max(0, 20 - tokens.length));
  } else {
    // AAAK readability
    const parts = encoded.split("|");

    // Criterion 1: Has entity section (0-20)
    score += parts.some((p) => p.startsWith("E:")) ? 20 : 0;

    // Criterion 2: Has date section (0-20)
    score += parts.some((p) => p.startsWith("D:")) ? 20 : 0;

    // Criterion 3: Has topic section (0-20)
    score += parts.some((p) => p.startsWith("T:")) ? 20 : 0;

    // Criterion 4: Has emotion section (0-15)
    score += parts.some((p) => p.startsWith("EM:")) ? 15 : 0;

    // Criterion 5: Has keyword summary (0-25)
    score += parts.some((p) => p.startsWith("K:")) ? 25 : 5;
  }

  return Math.min(Math.round(score), maxScore);
}

// ─── Reconstruction Accuracy ────────────────────────────────────────────────

function wordOverlap(original: string, reconstructed: string): number {
  const origWords = new Set(
    original
      .toLowerCase()
      .split(/\s+/)
      .map((w) => w.replace(/[^a-z0-9]/g, ""))
      .filter((w) => w.length > 2)
  );
  const reconWords = new Set(
    reconstructed
      .toLowerCase()
      .split(/\s+/)
      .map((w) => w.replace(/[^a-z0-9]/g, ""))
      .filter((w) => w.length > 2)
  );

  if (origWords.size === 0) return 0;

  let matches = 0;
  for (const word of reconWords) {
    if (origWords.has(word)) matches++;
  }

  const precision = reconWords.size > 0 ? matches / reconWords.size : 0;
  const recall = matches / origWords.size;

  // F1 score
  if (precision + recall === 0) return 0;
  return (2 * precision * recall) / (precision + recall);
}

// ─── Table Renderer ─────────────────────────────────────────────────────────

function padRight(str: string, len: number): string {
  return str.length >= len ? str.substring(0, len) : str + " ".repeat(len - str.length);
}

function padLeft(str: string, len: number): string {
  return str.length >= len ? str.substring(0, len) : " ".repeat(len - str.length) + str;
}

function printSeparator(widths: number[]): void {
  console.log("+" + widths.map((w) => "-".repeat(w + 2)).join("+") + "+");
}

function printRow(cells: string[], widths: number[], align: ("left" | "right")[] = []): void {
  const formatted = cells.map((cell, i) => {
    const a = align[i] || "left";
    return a === "right" ? padLeft(cell, widths[i]) : padRight(cell, widths[i]);
  });
  console.log("| " + formatted.join(" | ") + " |");
}

// ─── Main Benchmark ─────────────────────────────────────────────────────────

function runBenchmark(): void {
  const encoder = new USELEncoder();

  console.log("╔══════════════════════════════════════════════════════════════╗");
  console.log("║        USEL ↔ AAAK Memory Encoding Benchmark               ║");
  console.log("║        Using NSM Semantic Primes as Foundation              ║");
  console.log("╚══════════════════════════════════════════════════════════════╝");
  console.log();

  // ── Per-Memory Results ─────────────────────────────────────────────────

  const headers = ["#", "Category", "Orig", "AAAK", "USEL", "AAAK%", "USEL%", "Winner"];
  const widths = [3, 22, 5, 5, 5, 6, 6, 6];
  const aligns: ("left" | "right")[] = ["right", "left", "right", "right", "right", "right", "right", "left"];

  console.log("┌─ Compression Comparison ─────────────────────────────────────┐");
  console.log();
  printSeparator(widths);
  printRow(headers, widths, aligns);
  printSeparator(widths);

  const results: Array<{
    id: number;
    category: string;
    comparison: CompressionComparison;
    readabilityAAK: number;
    readabilityUSEL: number;
    accuracyUSEL: number;
    uselNotation: string;
    decoded: string;
  }> = [];

  for (const sample of SAMPLE_MEMORIES) {
    const comparison = encoder.compareCompression(sample.text);
    const uselNotation = encoder.encode(sample.text);
    const decoded = encoder.decode(uselNotation);

    const readabilityAAK = scoreReadability(
      // Re-encode AAAK inline for scoring
      comparison.aaak.chars.toString(),
      "aaak"
    );
    const readabilityUSELScore = scoreReadability(uselNotation, "usel");
    const accuracyUSEL = Math.round(wordOverlap(sample.text, decoded) * 100);

    results.push({
      id: sample.id,
      category: sample.category,
      comparison,
      readabilityAAK: readabilityAAK,
      readabilityUSEL: readabilityUSELScore,
      accuracyUSEL,
      uselNotation,
      decoded,
    });

    printRow(
      [
        String(sample.id),
        sample.category,
        String(comparison.original.chars),
        String(comparison.aaak.chars),
        String(comparison.usel.chars),
        `${Math.round(comparison.aaak.ratio * 100)}%`,
        `${Math.round(comparison.usel.ratio * 100)}%`,
        comparison.winner,
      ],
      widths,
      aligns
    );
  }

  printSeparator(widths);

  // ── Aggregated Stats ──────────────────────────────────────────────────

  console.log();
  console.log("┌─ Aggregate Statistics ───────────────────────────────────────┐");
  console.log();

  const avgAAKRatio =
    results.reduce((sum, r) => sum + r.comparison.aaak.ratio, 0) / results.length;
  const avgUSELRatio =
    results.reduce((sum, r) => sum + r.comparison.usel.ratio, 0) / results.length;
  const avgReadUSEL =
    results.reduce((sum, r) => sum + r.readabilityUSEL, 0) / results.length;
  const avgAccuracyUSEL =
    results.reduce((sum, r) => sum + r.accuracyUSEL, 0) / results.length;

  const aaakWins = results.filter((r) => r.comparison.winner === "aaak").length;
  const uselWins = results.filter((r) => r.comparison.winner === "usel").length;
  const ties = results.filter((r) => r.comparison.winner === "tie").length;

  console.log(`  Average AAAK compression ratio:  ${Math.round(avgAAKRatio * 100)}%`);
  console.log(`  Average USEL compression ratio:  ${Math.round(avgUSELRatio * 100)}%`);
  console.log(`  Average USEL readability score:   ${Math.round(avgReadUSEL)}/100`);
  console.log(`  Average USEL reconstruction:      ${Math.round(avgAccuracyUSEL)}%`);
  console.log(`  Compression wins: AAAK=${aaakWins}  USEL=${uselWins}  Tie=${ties}`);
  console.log();

  // ── Readability & Accuracy Detail ─────────────────────────────────────

  console.log("┌─ USEL Readability & Reconstruction ──────────────────────────┐");
  console.log();

  const detailHeaders = ["#", "Readability", "Accuracy", "USEL Notation (truncated)"];
  const detailWidths = [3, 11, 8, 50];
  const detailAligns: ("left" | "right")[] = ["right", "right", "right", "left"];

  printSeparator(detailWidths);
  printRow(detailHeaders, detailWidths, detailAligns);
  printSeparator(detailWidths);

  for (const r of results) {
    const notation =
      r.uselNotation.length > 50 ? r.uselNotation.substring(0, 47) + "..." : r.uselNotation;

    printRow(
      [String(r.id), `${r.readabilityUSEL}/100`, `${r.accuracyUSEL}%`, notation],
      detailWidths,
      detailAligns
    );
  }

  printSeparator(detailWidths);

  // ── Sample Encode/Decode Pairs ────────────────────────────────────────

  console.log();
  console.log("┌─ Sample Encode → Decode Round-Trips ────────────────────────┐");
  console.log();

  for (const r of results.slice(0, 3)) {
    const sample = SAMPLE_MEMORIES.find((s) => s.id === r.id)!;
    console.log(`  Memory #${r.id} [${r.category}]:`);
    console.log(`    Original:  ${sample.text}`);
    console.log(`    USEL:      ${r.uselNotation}`);
    console.log(`    Decoded:   ${r.decoded}`);
    console.log();
  }

  // ── Validation Check ──────────────────────────────────────────────────

  console.log("┌─ Validation Results ─────────────────────────────────────────┐");
  console.log();

  let allValid = true;
  for (const r of results) {
    const validation = encoder.validate(r.uselNotation);
    if (!validation.valid) {
      allValid = false;
      console.log(`  ✗ Memory #${r.id}: ${validation.errors.length} error(s)`);
      for (const err of validation.errors) {
        console.log(`      - ${err}`);
      }
    }
  }

  if (allValid) {
    console.log("  ✓ All 10 encodings pass USEL validation");
  }

  console.log();
  console.log("╔══════════════════════════════════════════════════════════════╗");
  console.log("║  Benchmark complete. See README.md for interpretation.      ║");
  console.log("╚══════════════════════════════════════════════════════════════╝");
}

// ─── Run ────────────────────────────────────────────────────────────────────

runBenchmark();
