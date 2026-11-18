import { ArrowLeft, CheckCircle2, Circle, Clock, Target } from 'lucide-react';
import { toneGradient, toneText } from '../components/tones';
import { ModuleIcon, Pill, ProgressBar } from '../components/ui';
import { LEVEL_LABEL, lessonKey, STAGES } from '../content';
import { useProgress } from '../lib/progress-context';
import { href } from '../lib/router';
import type { Module } from '../types';

export function ModulePage({ module }: { module: Module }) {
  const { isComplete, state } = useProgress();
  const done = module.lessons.filter((l) => isComplete(lessonKey(module, l))).length;
  const minutes = module.lessons.reduce((a, l) => a + l.minutes, 0);
  const firstOpen = module.lessons.find((l) => !isComplete(lessonKey(module, l))) ?? module.lessons[0];

  return (
    <div className="mx-auto max-w-5xl px-5 pb-24 pt-8 lg:px-10">
      <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-bl p-8 text-white shadow-soft md:p-10 ${toneGradient[module.tone]}`}>
        <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(white_1px,transparent_1px)] [background-size:22px_22px]" />
        <div className="relative">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur">
              <ModuleIcon icon={module.icon} className="h-6 w-6" />
            </div>
            <div className="text-[13px] font-semibold opacity-90">
              מודול {module.number} · {STAGES[module.stage].title}
            </div>
          </div>
          <h1 className="mt-5 max-w-3xl text-[32px] font-bold leading-tight md:text-[38px]">{module.title}</h1>
          <p className="mt-3 max-w-2xl text-[17px] leading-8 opacity-95">{module.tagline}</p>
          <div className="mt-5 flex flex-wrap items-center gap-2 text-[13px]">
            <span className="flex items-center gap-1 rounded-full bg-white/20 px-3 py-1">
              <Clock className="h-3.5 w-3.5" /> {minutes} דק׳
            </span>
            <span className="rounded-full bg-white/20 px-3 py-1">{module.lessons.length} שיעורים</span>
            <span className="rounded-full bg-white/20 px-3 py-1">
              {done}/{module.lessons.length} הושלמו
            </span>
          </div>
          <a
            href={href.lesson(module.id, firstOpen.id)}
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-[15px] font-bold text-slate-900 shadow-lg transition hover:-translate-y-0.5"
          >
            {done === 0 ? 'בוא נתחיל' : done === module.lessons.length ? 'חזרה על המודול' : 'להמשיך מאיפה שעצרתי'} <ArrowLeft className="h-4 w-4" />
          </a>
        </div>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_300px]">
        <div>
          <h2 className="mb-4 text-[18px] font-bold text-fg">השיעורים במודול</h2>
          <div className="relative space-y-4">
            <div className="absolute bottom-6 start-[19px] top-6 w-0.5 bg-line" aria-hidden />
            {module.lessons.map((l, i) => {
              const k = lessonKey(module, l);
              const complete = isComplete(k);
              const q = state.quiz[k];
              return (
                <a key={l.id} href={href.lesson(module.id, l.id)} className="group relative flex gap-4">
                  <div
                    className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 text-[15px] font-bold ${
                      complete ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-line-strong bg-surface text-muted'
                    }`}
                  >
                    {complete ? <CheckCircle2 className="h-5 w-5" /> : i + 1}
                  </div>
                  <div className="card shadow-soft flex-1 p-5 transition group-hover:-translate-y-0.5 group-hover:border-brand/50">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-[16.5px] font-bold text-fg group-hover:text-brand">{l.title}</h3>
                      {complete ? <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" /> : <Circle className="h-5 w-5 shrink-0 text-line-strong" />}
                    </div>
                    <p className="mt-1 text-[14.5px] leading-7 text-muted">{l.summary}</p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      <Pill>{LEVEL_LABEL[l.level]}</Pill>
                      <Pill>
                        <Clock className="h-3 w-3" /> {l.minutes} דק׳
                      </Pill>
                      {q && (
                        <Pill className="border-amber-500/40 text-amber-700 dark:text-amber-300">
                          מבחן: {q.best}/{q.total}
                        </Pill>
                      )}
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
        <div className="space-y-4">
          <div className="card p-5">
            <div className="mb-3 flex items-center gap-2 text-[14px] font-bold text-fg">
              <Target className={`h-4 w-4 ${toneText[module.tone]}`} /> מה תדע בסוף המודול
            </div>
            <ul className="space-y-3">
              {module.outcomes.map((o) => (
                <li key={o} className="flex gap-2.5 text-[14px] leading-6 text-muted">
                  <CheckCircle2 className={`mt-1 h-4 w-4 shrink-0 ${toneText[module.tone]}`} />
                  {o}
                </li>
              ))}
            </ul>
          </div>
          <div className="card p-5">
            <div className="text-[14px] font-bold text-fg">למה זה חשוב לתפקיד</div>
            <p className="mt-2 text-[14px] leading-7 text-muted">{module.why}</p>
          </div>
          <div className="card p-5">
            <div className="mb-2 flex justify-between text-[13px] text-muted">
              <span>התקדמות במודול</span>
              <span className="font-bold text-brand">{Math.round((done / module.lessons.length) * 100)}%</span>
            </div>
            <ProgressBar value={(done / module.lessons.length) * 100} />
          </div>
        </div>
      </div>
    </div>
  );
}
