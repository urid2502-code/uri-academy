import { createContext, useContext } from 'react';
import { findLesson, getTrack, trackForModule, type TrackId } from '../content';

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
  lastByTrack?: Partial<Record<TrackId, NonNullable<ProgressState['lastVisited']>>>;
}

export interface QuizDraft {
  signature: string;
  answers: (number | null)[];
  submitted: boolean;
}

export const empty: ProgressState = { completed: [], quiz: {}, notes: {}, checklists: {}, lessonSteps: {}, quizDrafts: {} };

export function courseProgress(state: ProgressState, id: TrackId) {
  const { lessons } = getTrack(id);
  const visit = state.lastByTrack?.[id] ?? state.lastVisited;
  const last = visit && trackForModule(visit.moduleId) === id ? findLesson(visit.moduleId, visit.lessonId) : null;
  const done = lessons.filter(({ key }) => state.completed.includes(key)).length;
  return {
    last,
    done,
    pct: Math.round(done / lessons.length * 100),
    resume: last ?? lessons.find(({ key }) => !state.completed.includes(key)),
  };
}

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
