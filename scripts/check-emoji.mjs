#!/usr/bin/env node
/**
 * Emoji guard — enforces the absolute no-emoji rule.
 *
 * Modes:
 *   node scripts/check-emoji.mjs            -> scan git-staged files (pre-commit)
 *   node scripts/check-emoji.mjs --all      -> scan frontend/src + backend sources
 *
 * Exits 1 if any emoji is found. Known legacy violations (pre-overhaul files
 * scheduled for Phase 3 cleanup) are listed in LEGACY_ALLOWED and only warn
 * in --all mode; staged mode blocks them too if re-staged with emoji intact.
 */
import { execSync } from 'node:child_process';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const EMOJI_RE = /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}\u{1F1E6}-\u{1F1FF}\u{2190}-\u{21FF}\u{2700}-\u{27BF}]/u;
const TEXT_EXT = /\.(jsx?|tsx?|css|html|json|md|ya?ml|sql|txt|mjs|cjs)$/i;
const SKIP_DIRS = new Set(['node_modules', 'dist', 'build', '.git', '.vite', 'code_dump', 'docs', 'logs']);

// Pre-overhaul files known to contain emoji; purged in Phase 3.
const LEGACY_ALLOWED = [
    'frontend/src/assets/icons/components/Icon.jsx', // emoji alias map (scheduled for removal)
];

function listFilesRecursive(dir, out = []) {
    for (const name of readdirSync(dir)) {
        if (SKIP_DIRS.has(name)) continue;
        const p = join(dir, name);
        const st = statSync(p);
        if (st.isDirectory()) listFilesRecursive(p, out);
        else if (TEXT_EXT.test(name)) out.push(p);
    }
    return out;
}

function findEmoji(file) {
    let text;
    try { text = readFileSync(file, 'utf8'); } catch { return []; }
    const hits = [];
    text.split('\n').forEach((line, i) => {
        const m = line.match(EMOJI_RE);
        if (m) hits.push({ line: i + 1, sample: m[0], preview: line.trim().slice(0, 80) });
    });
    return hits;
}

const allMode = process.argv.includes('--all');
const root = process.cwd();

let files;
if (allMode) {
    files = [
        ...listFilesRecursive(join(root, 'frontend', 'src')),
        ...listFilesRecursive(join(root, 'backend')),
    ].map((f) => relative(root, f).replaceAll('\\', '/'));
} else {
    try {
        files = execSync('git diff --cached --name-only --diff-filter=ACM', { encoding: 'utf8' })
            .split('\n').filter((f) => f && TEXT_EXT.test(f));
    } catch {
        files = [];
    }
}

let blocking = 0;
let legacy = 0;
for (const file of files) {
    const hits = findEmoji(join(root, file));
    if (!hits.length) continue;
    const isLegacy = allMode && LEGACY_ALLOWED.includes(file);
    for (const h of hits.slice(0, 5)) {
        const tag = isLegacy ? 'LEGACY (Phase 3 cleanup)' : 'BLOCKED';
        console.error(`${tag}  ${file}:${h.line}  ${h.preview}`);
    }
    if (hits.length > 5) console.error(`         ...and ${hits.length - 5} more in ${file}`);
    if (isLegacy) legacy += hits.length; else blocking += hits.length;
}

if (blocking > 0) {
    console.error(`\nEmoji guard: ${blocking} emoji found. The no-emoji rule is absolute — remove them before committing.`);
    process.exit(1);
}
if (legacy > 0) {
    console.error(`\nEmoji guard: ${legacy} legacy emoji remain in allowed pre-overhaul files (Phase 3 purge pending).`);
}
console.log('Emoji guard: clean.');
