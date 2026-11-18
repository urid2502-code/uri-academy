# מדריך כתיבת תוכן – "האקדמיה של אורי"

Project: C:\Users\uride\Uri_SkillSet (Vite + React 19 + TypeScript + Tailwind v4). Hebrew, RTL learning site.
Audience: **Uri, a beginner** who wants to become a Senior Full Stack engineer (TypeScript/Node.js, real-time systems,
event-driven microservices, PostgreSQL, React, LLM integration, Kubernetes/observability). Teach from zero, then build up.

## Language rules (VERY IMPORTANT – user requirement)
- **Key technical terms in English**: Client, Server, Request, Response, Status Code, Function, Variable, Array, Object,
  Promise, Component, Props, State, Hook, Query, Table, Index, Transaction, Queue, Consumer, Producer, Topic, Container,
  Pod, Token, Prompt, Endpoint, Middleware, Schema, etc. On first use you may add the Hebrew in parentheses: `**State** (מצב)`.
- **Explanations in Hebrew**: all prose, intros, analogies, quiz questions/answers, failure-mode texts, hints, solutions.
- Code is English (identifiers), comments in code may be in short Hebrew.
- Tone: friendly, clear, encouraging, concrete. Short paragraphs. Every lesson starts with an everyday **analogy**.
- Start from basics (assume no prior knowledge of the topic), then go deeper; end each lesson with "what a senior knows"
  (a `> [!tip]` or a short section) so it scales to senior level.
- No company names (do NOT mention Charm or any real company as the employer). Examples can use generic domains:
  online shop, chat app, tasks app, payments/suspicious-transaction detection, notifications.

## File format
Each module = two files in `src/content/`: `mN.ts` (structured data) + `mN.md` (long-form text and code).
Study the reference files `src/content/m1.ts` and `src/content/m1.md` **carefully and copy their structure exactly**.
Types are in `src/types.ts` (Module, Lesson, FailureMode, QuizQuestion, KeyTerm, DiagramSpec, Tone, ModuleIcon, Level).

`mN.md` is split into blocks by lines starting with `@@ ` (nothing else may start a line with `@@ `):
```
@@ mN-lK intro                      -> markdown: what it is + why it matters + analogy
@@ mN-lK deepDive                   -> markdown: how it works step by step (tables, callouts, small code fences ok)
@@ mN-lK code <lang> | <title>      -> raw code (NOT fenced). 1–2 code blocks per lesson. lang: typescript|tsx|sql|bash|json|yaml|dockerfile|proto|html|css|text
@@ mN-lK codeNotes                  -> markdown: line-by-line explanation of the code
@@ mN-lK solution                   -> markdown: model solution for the exercise (challenge)
```
In `mN.ts`: `const b = new BlockStore(src);` then `b.text('mN-lK','intro')`, `b.text(...,'deepDive')`, `b.code('mN-lK')`,
`b.text(...,'codeNotes')`, `b.text(...,'solution')`. Every referenced block MUST exist (missing block throws at load).

Markdown supported: `##`/`###`/`####` headings, paragraphs, `-` lists, `1.` lists, tables (`|`; escape a literal pipe inside a
cell as `\|`), fenced code ```lang optional-title, `**bold**`, `*italic*`, `` `code` ``, `---`, and callouts:
`> [!tip]` (טיפ של מקצוענים), `> [!note]` (שים לב), `> [!warn]` (זהירות), `> [!danger]` (סכנה), `> [!example]` (דוגמה מהחיים).
A callout is consecutive lines starting with `>`; first line `> [!kind] text...`.

## Per lesson (each module has exactly 3 lessons, ids l1,l2,l3)
- `title` (Hebrew with English terms), `summary` (1 sentence), `minutes` (15–35), `level`: 'basic' | 'intermediate' | 'advanced'
  (stage 1 modules mostly basic; stage 2 basic→intermediate; stage 3 intermediate→advanced), `tags` (2–3, English terms ok).
- `intro` ~150–300 words, `deepDive` ~500–1100 words (steps, tables, callouts), code 20–60 lines with Hebrew comments,
  `codeNotes` ~120–300 words.
- `diagram`: 3–5 columns, nodes {label (English term), sub, detail (Hebrew sentence), tone}. Tones: 'violet'|'teal'|'sky'|'amber'|'rose'|'emerald'|'indigo'|'orange'|'pink'|'slate'.
- `failureModes`: 3 common mistakes {title, severity 'critical'|'high'|'medium', symptom, rootCause, mitigation} – Hebrew, beginner-relatable.
- `challenge`: {prompt, constraints (3–4 short strings), hints (3), solution: b.text(...,'solution')} – a practical exercise Uri can actually do.
- `quiz`: exactly 4 questions, 4 options each, `answer` = 0-based index, `explanation`. Vary the correct index (not always 1).
- `keyTerms`: 5–7 entries `{ term: 'English term', he: 'Hebrew name', def: 'Hebrew one-sentence definition' }`.

Module fields: id 'mN', number N, stage (1|2|3), title, short (≤ 4 words), tagline, icon, tone, why (why this matters for the job,
1–2 Hebrew sentences), outcomes (4 bullets), lessons. Export name: `export const moduleN: Module = {...}`.

Write files with the file-creation tool (UTF-8, no BOM). Never re-save content with PowerShell `Set-Content` (it adds a BOM / breaks Hebrew).
Use single quotes in TS; escape apostrophes inside strings (`\'`) or use typographic quotes. Hebrew geresh (׳) is fine.

## Validation (do this before finishing)
Run in PowerShell (Node is installed; refresh PATH first):
```
$env:Path = [Environment]::GetEnvironmentVariable('Path','Machine') + ';' + [Environment]::GetEnvironmentVariable('Path','User')
cd C:\Users\uride\Uri_SkillSet
npx tsc -p tsconfig.app.json --noEmit 2>&1 | Select-String "src/content/mN"     # only YOUR files must be error-free
node scripts/check-content.mjs mN                                                # verifies every b.text/b.code block exists
```
Other agents are writing other modules at the same time – ignore errors in files that are not yours and do not edit other files.

## Curriculum map (for cross-references – "נלמד במודול N")
Stage 1 (יסודות): m1 איך האינטרנט עובד · m2 JavaScript ו-TypeScript מהיסוד · m3 כלי העבודה של מפתח (Terminal, npm, Git, Testing)
Stage 2 (Full Stack): m4 Server ו-API עם Node.js · m5 Databases ו-PostgreSQL · m6 React מהיסוד
Stage 3 (Senior): m7 Real-Time Systems · m8 Event-Driven ו-Queues · m9 AI ו-LLM במוצר · m10 Docker, Kubernetes ו-Observability