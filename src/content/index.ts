import type { Lesson, Module, Stage } from '../types';
import { module1 } from './m1';
import { module2 } from './m2';
import { module3 } from './m3';
import { module4 } from './m4';
import { module5 } from './m5';
import { module6 } from './m6';
import { module7 } from './m7';
import { module8 } from './m8';
import { module9 } from './m9';
import { module10 } from './m10';
import { javaModules } from './java';

export const modules: Module[] = [module1, module2, module3, module4, module5, module6, module7, module8, module9, module10];

export const STAGES: Record<Stage, { title: string; subtitle: string }> = {
  1: { title: 'שלב 1 · יסודות', subtitle: 'איך הרשת עובדת, השפה, והכלים של כל מפתח' },
  2: { title: 'שלב 2 · בניית מוצר Full Stack', subtitle: 'Server, Database ו-React – מחברים הכל לאפליקציה אמיתית' },
  3: { title: 'שלב 3 · רמת Senior', subtitle: 'Real-time, Queues, AI ו-Cloud – מה שמבדיל מפתח בכיר' },
};

export type TrackId = 'fullstack' | 'java';
const tracks = {
  fullstack: { label: 'Full Stack', modules, stages: STAGES },
  java: { label: 'Java', modules: javaModules, stages: {
    1: { title: 'שלב 1 · יסודות השפה', subtitle: 'מהרצה ראשונה למודל עם אובייקטים ואוספים.' },
    2: { title: 'שלב 2 · תוכנה אמינה', subtitle: 'עיבוד נתונים, טיפול בשגיאות ובדיקות.' },
    3: { title: 'שלב 3 · Backend ב-Java', subtitle: 'מקביליות, HTTP ופרויקט מסכם.' },
  } },
};

export const LEVEL_LABEL = { basic: 'בסיס', intermediate: 'ביניים', advanced: 'מתקדם' } as const;

const flatten = (list: Module[]) => list.flatMap((m) => m.lessons.map((l) => ({ module: m, lesson: l, key: `${m.id}-${l.id}` })));
export const allLessons = flatten(modules);
const javaLessons = flatten(javaModules);
export const academyLessons = [...allLessons, ...javaLessons];

export const isTrackId = (id: string): id is TrackId => id === 'fullstack' || id === 'java';
export const trackForModule = (id: string): TrackId => javaModules.some((m) => m.id === id) ? 'java' : 'fullstack';
export const getTrack = (id: TrackId) => ({ ...tracks[id], lessons: id === 'java' ? javaLessons : allLessons });
export const findModule = (id: string) => tracks[trackForModule(id)].modules.find((m) => m.id === id);

export const lessonKey = (m: Module | string, l: Lesson | string) =>
  `${typeof m === 'string' ? m : m.id}-${typeof l === 'string' ? l : l.id}`;

export function findLesson(moduleId: string, lessonId: string) {
  const module = findModule(moduleId);
  const lesson = module?.lessons.find((l) => l.id === lessonId);
  return module && lesson ? { module, lesson } : null;
}

export function neighbours(moduleId: string, lessonId: string) {
  const { lessons } = getTrack(trackForModule(moduleId));
  const idx = lessons.findIndex((x) => x.module.id === moduleId && x.lesson.id === lessonId);
  return idx < 0 ? {} : { prev: lessons[idx - 1], next: lessons[idx + 1] };
}

export const glossary = (() => {
  const seen = new Map<string, { term: string; he?: string; def: string; moduleId: string; lessonId: string; lessonTitle: string }>();
  for (const { module, lesson } of academyLessons) {
    for (const t of lesson.keyTerms) {
      const k = t.term.toLowerCase();
      if (!seen.has(k)) seen.set(k, { ...t, moduleId: module.id, lessonId: lesson.id, lessonTitle: lesson.title });
    }
  }
  return [...seen.values()].sort((a, b) => a.term.localeCompare(b.term, 'en', { sensitivity: 'base' }));
})();

export interface SearchHit {
  title: string;
  subtitle: string;
  href: string;
  score: number;
}

export function search(query: string, extra: { title: string; subtitle: string; href: string; body: string }[]): SearchHit[] {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return [];
  const hits: SearchHit[] = [];
  const scoreOf = (title: string, body: string) => {
    let s = 0;
    const t = title.toLowerCase();
    const b = body.toLowerCase();
    for (const term of terms) {
      if (t.includes(term)) s += 10;
      else if (b.includes(term)) s += 2;
      else return 0;
    }
    return s;
  };
  for (const { module, lesson } of academyLessons) {
    const body = [lesson.summary, lesson.tags.join(' '), lesson.intro, lesson.deepDive, lesson.keyTerms.map((k) => `${k.term} ${k.he ?? ''}`).join(' ')].join(' ');
    const s = scoreOf(lesson.title, body);
    if (s) hits.push({ title: lesson.title, subtitle: `${tracks[trackForModule(module.id)].label} · ${module.short}`, href: `#/m/${module.id}/${lesson.id}`, score: s });
  }
  for (const g of glossary) {
    const s = scoreOf(g.term, `${g.he ?? ''} ${g.def}`);
    if (s) hits.push({ title: `${g.term}${g.he ? ` · ${g.he}` : ''}`, subtitle: 'מילון מונחים', href: `#/glossary/${encodeURIComponent(g.term)}`, score: s + 1 });
  }
  for (const e of extra) {
    const s = scoreOf(e.title, e.body);
    if (s) hits.push({ title: e.title, subtitle: e.subtitle, href: e.href, score: s });
  }
  return hits.sort((a, b) => b.score - a.score).slice(0, 12);
}
