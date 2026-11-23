// Entry for make.fun bounty post-x-promote-make-your-own-bounty-01 (Node 22, standard library only).
// The entry is a single post on X that quotes or links make.fun's make-your-own-bounty post
// (https://x.com/makefunai/status/2124915864336236646), with a photo of its own and the
// entrant's play code in its text. This program only copies POST.json from the repository
// root into the output directory, where the house reads it and scores the post's replies,
// reposts and quotes. Nothing this program writes about the post is scored.
//
// Outside the grader's container, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR stand in for
// /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const BOT_DIR = resolve(process.env.MAKEFUN_BOT_DIR ?? '/bot');
const OUTPUT_DIR = resolve(process.env.MAKEFUN_OUTPUT_DIR ?? '/output');
const SOURCE = join(BOT_DIR, 'POST.json');
const TARGET = join(OUTPUT_DIR, 'POST.json');

function fail(message: string): never {
  console.error(`main.ts: ${message}`);
  process.exit(1);
}

// Fail fast on a malformed POST.json instead of copying a file the gate cannot read.
let parsed: unknown;
try {
  parsed = JSON.parse(readFileSync(SOURCE, 'utf8'));
} catch (err) {
  fail(`could not read ${SOURCE}: ${(err as Error).message}`);
}
if (typeof parsed !== 'object' || parsed === null || typeof (parsed as { url?: unknown }).url !== 'string') {
  fail(`${SOURCE} must be a JSON object with a string "url" field`);
}

mkdirSync(OUTPUT_DIR, { recursive: true });
try {
  copyFileSync(SOURCE, TARGET);
} catch (err) {
  fail(`could not copy ${SOURCE} to ${TARGET}: ${(err as Error).message}`);
}

// Confirm the copy is byte-identical, so a silent partial write can never pass.
if (!readFileSync(SOURCE).equals(readFileSync(TARGET))) {
  fail(`${TARGET} does not match ${SOURCE} after copying`);
}
