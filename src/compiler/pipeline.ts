/**
 * USEL Compilation Pipeline
 *
 * Central orchestrator that validates a USEL AST and routes it to the
 * requested target compiler (JavaScript, Python, Natural Language, or
 * USEL Text notation).
 *
 * Usage:
 *   import { compile } from './pipeline.js';
 *   const result = compile(ast, 'javascript');
 *   if (result.success) console.log(result.code);
 */

import type { USELAST, CompilationResult } from '../primes/types.js';
import { compileToJS }       from './to-javascript.js';
import { compileToPython }   from './to-python.js';
import { compileToNatural }  from './to-natural.js';
import { compileToUSELText } from './to-usel-text.js';

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export type CompileTarget = CompilationResult['target'];

/**
 * Compile a USEL AST to the specified target.
 *
 * @param ast    – A well-formed USEL program AST.
 * @param target – One of: 'javascript', 'python', 'natural', 'usel-text', 'wasm'.
 * @param opts   – Extra options forwarded to the target compiler.
 *                 `lang` (string)  – language code for the 'natural' target.
 * @returns A CompilationResult with the generated code or error details.
 */
export function compile(
  ast: USELAST,
  target: CompileTarget,
  opts: { lang?: string } = {},
): CompilationResult {
  // ---- Validate ----
  const errors = validateAST(ast);
  if (errors.length > 0) {
    return { target, code: '', success: false, errors };
  }

  // ---- Route to target compiler ----
  try {
    const code = routeToCompiler(ast, target, opts);
    return { target, code, success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { target, code: '', success: false, errors: [message] };
  }
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

/**
 * Perform structural validation on the AST.
 * Returns an array of human-readable error strings (empty = valid).
 */
function validateAST(ast: USELAST): string[] {
  const errors: string[] = [];

  if (!ast) {
    errors.push('AST is null or undefined.');
    return errors;
  }

  if (ast.type !== 'program') {
    errors.push(`Expected AST type "program", got "${ast.type}".`);
  }

  if (!ast.metadata) {
    errors.push('AST is missing metadata.');
  } else {
    if (!ast.metadata.version) errors.push('Metadata is missing "version".');
    if (!ast.metadata.level)   errors.push('Metadata is missing "level".');
  }

  if (!Array.isArray(ast.statements)) {
    errors.push('AST.statements is not an array.');
    return errors;
  }

  for (let i = 0; i < ast.statements.length; i++) {
    const stmt = ast.statements[i];

    if (stmt.type !== 'statement') {
      errors.push(`Statement ${i}: expected type "statement", got "${stmt.type}".`);
    }

    if (!Array.isArray(stmt.nodes)) {
      errors.push(`Statement ${i}: "nodes" is not an array.`);
      continue;
    }

    for (let j = 0; j < stmt.nodes.length; j++) {
      const node = stmt.nodes[j];
      if (!node.symbol) {
        errors.push(`Statement ${i}, node ${j}: missing "symbol".`);
      } else if (!node.symbol.name) {
        errors.push(`Statement ${i}, node ${j}: symbol is missing "name".`);
      }
    }
  }

  return errors;
}

// ---------------------------------------------------------------------------
// Routing
// ---------------------------------------------------------------------------

function routeToCompiler(
  ast: USELAST,
  target: CompileTarget,
  opts: { lang?: string },
): string {
  switch (target) {
    case 'javascript':
      return compileToJS(ast);

    case 'python':
      return compileToPython(ast);

    case 'natural':
      return compileToNatural(ast, opts.lang ?? 'en');

    case 'usel-text':
      return compileToUSELText(ast);

    case 'wasm':
      throw new Error(
        'WASM compilation target is not yet implemented. ' +
        'Use "javascript" target and run through a bundler for now.',
      );

    default:
      throw new Error(`Unknown compilation target: "${target}".`);
  }
}
