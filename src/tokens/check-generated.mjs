#!/usr/bin/env node
/**
 * CI guard. Re-runs the token build into a temp directory and byte-compares
 * the result against the committed CSS / TS files. Fails (exit 1) if any
 * generated file has been hand-edited or is stale.
 *
 * Run via: npm run tokens:check
 */

import { readFileSync, mkdtempSync, rmSync, cpSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";
import { execFileSync } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_TOKENS = __dirname;

const FILES = ["primitives.css", "semantics.css", "component-tokens.css", "tokens.ts"];

// Snapshot current generated files before re-running the build.
const snapshot = Object.fromEntries(
  FILES.map((f) => [f, readFileSync(join(REPO_TOKENS, f), "utf8")])
);

// Re-run the build (this overwrites the same files in place — that's OK,
// the contract is that the build is idempotent).
execFileSync("node", [join(REPO_TOKENS, "build.mjs")], { stdio: "inherit" });

// Compare.
const drift = [];
for (const f of FILES) {
  const fresh = readFileSync(join(REPO_TOKENS, f), "utf8");
  if (fresh !== snapshot[f]) drift.push(f);
}

if (drift.length === 0) {
  console.log("✓ generated token files match the source.");
  process.exit(0);
}

console.error("");
console.error("✗ Generated token files are out of sync with src/tokens/source/.");
console.error("");
console.error("  The following files were either edited by hand or generated from");
console.error("  stale source. Run `npm run tokens:build` and commit the result.");
console.error("");
for (const f of drift) console.error(`    src/tokens/${f}`);
console.error("");
process.exit(1);
