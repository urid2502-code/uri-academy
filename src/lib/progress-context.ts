import { createContext, useContext } from 'react';

export const STORAGE_KEY = 'uri-academy:progress:v1';

export interface QuizResult {
  score: number;
  total: number;
  best: number;
  attempts: number;
  at: string;
}

export interface ProgressState {
  completed: string[];
  quiz: Record<string, QuizResult>;
  notes: Record<string, string>;
  checklists: Record<string, string[]>;
  lessonSteps: Record<string, { index: number; furthest: number }>;
  quizDrafts: Record<string, QuizDraft>;
  lastVisited?: { moduleId: string; lessonId: string };
}

export interface QuizDraft {
  signature: string;
  answers: (number | null)[];
  submitted: boolean;
}

export const empty: ProgressState = { completed: [], quiz: {}, notes: {}, checklists: {}, lessonSteps: {}, quizDrafts: {} };

export function load(): ProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return empty;
    const parsed = JSON.parse(raw) as Partial<ProgressState>;
    return { ...empty, ...parsed, lessonSteps: parsed.lessonSteps ?? {}, quizDrafts: parsed.quizDrafts ?? {} };
  } catch (error) {
    console.error('Unable to load academy progress', error);
    return empty;
  }
}

export interface ProgressApi {
  state: ProgressState;
  isComplete: (lessonId: string) => boolean;
  setComplete: (lessonId: string, done: boolean) => void;
  recordQuiz: (lessonId: string, score: number, total: number) => void;
  setLessonStep: (lessonId: string, index: number) => void;
  setQuizDraft: (lessonId: string, draft: QuizDraft) => void;
  setNote: (key: string, value: string) => void;
  toggleChecklist: (key: string, item: string) => void;
  visit: (moduleId: string, lessonId: string) => void;
  reset: () => void;
}

export const ProgressContext = createContext<ProgressApi | null>(null);

export function useProgress(): ProgressApi {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress must be used inside ProgressProvider');
  return ctx;
}
