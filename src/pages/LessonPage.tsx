import { ArrowLeft, CheckCircle2, Circle, Clock, Focus } from 'lucide-react';
import { useEffect } from 'react';
import { LessonPlayer } from '../components/LessonPlayer';
import { Pill } from '../components/ui';
import { LEVEL_LABEL, lessonKey } from '../content';
import { useProgress } from '../lib/progress-context';
import { href } from '../lib/router';
import type { Lesson, Module } from '../types';

const LEVEL_CLS = {
  basic: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
  intermediate: 'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300',
  advanced: 'border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300',
};

export function LessonPage({ module, lesson }: { module: Module; lesson: Lesson }) {
  const key = lessonKey(module, lesson);
  const { isComplete, setComplete, visit } = useProgress();
  const complete = isComplete(key);
  const lessonIndex = module.lessons.indexOf(lesson);

  useEffect(() => {
    visit(module.id, lesson.id);
  }, [module.id, lesson.id, visit]);

  return (
    <div className="course-page lesson-page">
      <nav className="course-breadcrumb" aria-label="מיקום בשיעור">
        <a href={href.home()} className="hover:text-fg">
          מסלול Full Stack
        </a>
        <ArrowLeft className="h-3 w-3" />
        <a href={href.module(module.id)} className="hover:text-fg">
          {module.short}
        </a>
        <ArrowLeft className="h-3 w-3" />
        <span>שיעור {lessonIndex + 1}</span>
      </nav>

      <header className="lesson-header">
        <div className="min-w-0">
          <h1>{lesson.title}</h1>
          <p>{lesson.summary}</p>
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className={`rounded-full border px-2.5 py-0.5 text-[12px] font-bold ${LEVEL_CLS[lesson.level]}`}>רמה: {LEVEL_LABEL[lesson.level]}</span>
            <Pill>
              <Clock className="h-3 w-3" /> {lesson.minutes} דק׳
            </Pill>
            {lesson.tags.map((t) => (
              <Pill key={t}>
                <span dir="auto">{t}</span>
              </Pill>
            ))}
          </div>
        </div>
        <div className="lesson-header-actions">
          <button
            onClick={() => setComplete(key, !complete)}
            aria-pressed={complete}
            className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border px-4 text-[14px] font-medium transition ${
              complete ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300' : 'border-line bg-surface text-fg hover:border-brand/50'
            }`}
          >
            {complete ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
            {complete ? 'השיעור הושלם' : 'סמן כהושלם'}
          </button>
          <a href={href.focus(module.id, lesson.id)} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-3 text-[14px] text-muted transition hover:text-brand">
            <Focus className="h-4 w-4" /> מצב מיקוד
          </a>
        </div>
      </header>

      <LessonPlayer module={module} lesson={lesson} />
    </div>
  );
}
