import type { Lesson, Level } from '../types';

type Workshop = {
  id: string;
  title: string;
  summary: string;
  minutes: number;
  level: Level;
  intro: string;
  steps: [label: string, detail: string][];
  tradeoff: string;
  code: string;
  notes: string;
  pitfalls: [title: string, symptom: string, cause: string, fix: string][];
  terms: [term: string, def: string][];
  exercise: string;
  checks: string[];
  hints: string[];
  solution: string;
  quiz: [question: string, options: string[], answer: number, explanation: string][];
  sample?: { lang: string; title: string };
};

export function workshop(w: Workshop): Lesson {
  return {
    id: w.id, title: w.title, summary: w.summary, minutes: w.minutes, level: w.level,
    tags: w.terms.slice(0, 3).map(([term]) => term),
    intro: w.intro,
    deepDive: `${w.steps.map(([label, detail], i) => `### ${i + 1}. ${label}\n\n${detail}`).join('\n\n')}\n\n> [!tip] ${w.tradeoff}`,
    diagram: { title: w.title, columns: w.steps.map(([label, detail]) => [{ label, detail }]) },
    code: [{ ...(w.sample ?? { lang: 'java', title: 'Main.java' }), code: w.code.trim() }],
    codeNotes: w.notes,
    failureModes: w.pitfalls.map(([title, symptom, rootCause, mitigation]) => ({ title, symptom, rootCause, mitigation, severity: 'medium' })),
    keyTerms: w.terms.map(([term, def]) => ({ term, def })),
    challenge: { prompt: w.exercise, constraints: w.checks, hints: w.hints, solution: w.solution },
    quiz: w.quiz.map(([q, options, answer, explanation]) => ({ q, options, answer, explanation })),
  };
}
