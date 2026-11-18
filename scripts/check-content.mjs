// Usage: node scripts/check-content.mjs m3 [m4 ...]
// Verifies that every block referenced from src/content/<id>.ts exists in src/content/<id>.md.
import { readFileSync } from 'node:fs';

const ids = process.argv.slice(2);
if (!ids.length) {
  console.error('usage: node scripts/check-content.mjs <module-file-id> ...');
  process.exit(2);
}

let failed = false;
for (const id of ids) {
  const ts = readFileSync(new URL(`../src/content/${id}.ts`, import.meta.url), 'utf8');
  const md = readFileSync(new URL(`../src/content/${id}.md`, import.meta.url), 'utf8').replace(/^\uFEFF/, '').replace(/\r\n/g, '\n');

  const blocks = md
    .split('\n')
    .filter((l) => l.startsWith('@@ '))
    .map((l) => {
      const [head] = l.slice(3).split(' | ');
      const [key, kind] = head.trim().split(/\s+/);
      return { key, kind };
    });
  const has = (key, kind) => blocks.some((b) => b.key === key && b.kind === kind);

  const problems = [];
  for (const m of ts.matchAll(/b\.text\('([^']+)',\s*'([^']+)'\)/g)) if (!has(m[1], m[2])) problems.push(`missing block: ${m[1]} ${m[2]}`);
  for (const m of ts.matchAll(/b\.code\('([^']+)'\)/g)) if (!has(m[1], 'code')) problems.push(`missing code block: ${m[1]}`);
  for (const m of ts.matchAll(/b\.one\('([^']+)',\s*'([^']+)'\)/g)) if (!has(m[1], m[2])) problems.push(`missing block: ${m[1]} ${m[2]}`);

  const quizCount = (ts.match(/\banswer:\s*\d/g) ?? []).length;
  console.log(`${id}: ${blocks.length} blocks, ${quizCount} quiz questions, ${problems.length} problems`);
  for (const p of problems) console.log('  - ' + p);
  if (problems.length) failed = true;
}
process.exit(failed ? 1 : 0);
