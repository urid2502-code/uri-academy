export type Tone = 'violet' | 'teal' | 'sky' | 'amber' | 'rose' | 'emerald' | 'indigo' | 'orange' | 'pink' | 'slate';

export type Level = 'basic' | 'intermediate' | 'advanced';

export type Stage = 1 | 2 | 3;

export interface DiagramNode {
  label: string;
  sub?: string;
  detail: string;
  tone?: Tone;
}

/** Columns are rendered in reading order (right-to-left); arrows connect column N to column N+1. */
export interface DiagramSpec {
  title: string;
  columns: DiagramNode[][];
}

export interface QuizQuestion {
  q: string;
  options: string[];
  answer: number;
  explanation: string;
}

/** A common mistake: what you see, why it happens, how to fix it. */
export interface FailureMode {
  title: string;
  severity: 'critical' | 'high' | 'medium';
  symptom: string;
  rootCause: string;
  mitigation: string;
}

export interface CodeSample {
  title: string;
  lang: string;
  code: string;
}

/** Glossary entry: the term itself in English, an optional Hebrew name, and a Hebrew explanation. */
export interface KeyTerm {
  term: string;
  he?: string;
  def: string;
}

export interface Lesson {
  id: string;
  title: string;
  summary: string;
  minutes: number;
  level: Level;
  tags: string[];
  /** Markdown: what it is and why it matters, with an everyday analogy. */
  intro: string;
  /** Markdown: how it works, step by step. */
  deepDive: string;
  diagram?: DiagramSpec;
  code: CodeSample[];
  /** Markdown: walk-through of the code example. */
  codeNotes: string;
  failureModes: FailureMode[];
  challenge: {
    prompt: string;
    constraints: string[];
    hints: string[];
    solution: string;
  };
  quiz: QuizQuestion[];
  keyTerms: KeyTerm[];
}

export type ModuleIcon = 'globe' | 'code' | 'terminal' | 'server' | 'database' | 'layout' | 'radio' | 'workflow' | 'bot' | 'cloud';

export interface Module {
  id: string;
  number: number;
  stage: Stage;
  title: string;
  short: string;
  tagline: string;
  icon: ModuleIcon;
  tone: Tone;
  /** Why this matters for a full-stack engineer role. */
  why: string;
  outcomes: string[];
  lessons: Lesson[];
}

export interface Comparison {
  id: string;
  title: string;
  moduleId: string;
  context: string;
  junior: CodeSample & { problems: string[] };
  senior: CodeSample & { wins: string[] };
}

export interface InterviewQA {
  q: string;
  a: string;
  topic: string;
}

export interface InterviewScenario {
  id: string;
  title: string;
  difficulty: 'מתחיל' | 'בינוני' | 'מתקדם';
  duration: string;
  prompt: string;
  clarifyingQuestions: string[];
  functional: string[];
  nonFunctional: string[];
  estimates: { label: string; value: string; note: string }[];
  diagram: DiagramSpec;
  solution: string;
  checklist: string[];
  followUps: string[];
}
