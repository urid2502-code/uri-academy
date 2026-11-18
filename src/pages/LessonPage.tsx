import { ArrowLeft, ArrowRight, BookA, Bug, CheckCircle2, Circle, Clock, Code2, Dumbbell, Lightbulb, ListChecks, Workflow } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Challenge } from '../components/Challenge';
import { CodeBlock } from '../components/CodeBlock';
import { FailureModes } from '../components/FailureModes';
import { FlowDiagram } from '../components/FlowDiagram';
import { Markdown } from '../components/Markdown';
import { Quiz } from '../components/Quiz';
import { toneSoft, toneText } from '../components/tones';
import { ModuleIcon, Pill, SectionHeader } from '../components/ui';
import { LEVEL_LABEL, lessonKey, neighbours } from '../content';
import { useProgress } from '../lib/progress-context';
import { href } from '../lib/router';
import type { Lesson, Module } from '../types';

const SECTIONS = [
  { id: 'sec-intro', label: 'מה זה ולמה זה חשוב', icon: Lightbulb },
  { id: 'sec-how', label: 'איך זה עובד', icon: Workflow },
  { id: 'sec-code', label: 'דוגמת קוד', icon: Code2 },
  { id: 'sec-mistakes', label: 'טעויות נפוצות', icon: Bug },
  { id: 'sec-terms', label: 'מונחים חשובים', icon: BookA },
  { id: 'sec-exercise', label: 'תרגיל', icon: Dumbbell },
  { id: 'sec-quiz', label: 'בדוק את עצמך', icon: ListChecks },
];

const LEVEL_CLS = {
  basic: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
  intermediate: 'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300',
  advanced: 'border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300',
};

export function LessonPage({ module, lesson }: { module: Module; lesson: Lesson }) {
  const key = lessonKey(module, lesson);
  const { isComplete, setComplete, visit } = useProgress();
  const complete = isComplete(key);
  const { prev, next } = neighbours(module.id, lesson.id);
  const [codeTab, setCodeTab] = useState(0);
  const [activeSec, setActiveSec] = useState(SECTIONS[0].id);
  const lessonIndex = module.lessons.indexOf(lesson);

  useEffect(() => {
    visit(module.id, lesson.id);
  }, [module.id, lesson.id, visit]);

  useEffect(() => {
    const root = document.getElementById('main-scroll');
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveSec(visible[0].target.id);
      },
      { root, rootMargin: '0px 0px -70% 0px' },
    );
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [lesson.id]);

  const jump = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  const code = lesson.code[codeTab] ?? lesson.code[0];

  return (
    <div className="mx-auto flex max-w-[1240px] gap-10 px-5 pb-28 pt-8 lg:px-10">
      <article className="min-w-0 flex-1">
        <nav className="mb-5 flex flex-wrap items-center gap-1.5 text-[13px] text-faint">
          <a href={href.home()} className="hover:text-fg">
            דף הבית
          </a>
          <ArrowLeft className="h-3 w-3" />
          <a href={href.module(module.id)} className={`flex items-center gap-1 font-medium hover:underline ${toneText[module.tone]}`}>
            <ModuleIcon icon={module.icon} className="h-3.5 w-3.5" /> מודול {module.number}: {module.short}
          </a>
          <ArrowLeft className="h-3 w-3" />
          <span>שיעור {lessonIndex + 1}</span>
        </nav>

        <header className={`relative mb-12 overflow-hidden rounded-3xl border p-7 md:p-9 ${toneSoft[module.tone]}`}>
          <div className="bg-dots absolute inset-0 opacity-60" />
          <div className="relative">
            <div className="flex flex-wrap items-center gap-2">
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
            <h1 className="mt-4 text-[30px] font-bold leading-tight tracking-tight text-fg md:text-[36px]">{lesson.title}</h1>
            <p className="mt-3 max-w-3xl text-[17px] leading-8 text-muted">{lesson.summary}</p>
            <button
              onClick={() => setComplete(key, !complete)}
              className={`mt-6 inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-[14px] font-semibold transition ${
                complete ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300' : 'border-line bg-surface text-fg hover:border-brand/50'
              }`}
            >
              {complete ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
              {complete ? 'השיעור הושלם' : 'סמן כהושלם'}
            </button>
          </div>
        </header>

        <SectionHeader id="sec-intro" step="שלב 1" title="מה זה ולמה זה חשוב" icon={<Lightbulb className="h-5 w-5" />} />
        <Markdown source={lesson.intro} />

        <SectionHeader id="sec-how" step="שלב 2" title="איך זה עובד" subtitle="צעד אחר צעד, מהבסיס ועד מה שמפתח בכיר יודע" icon={<Workflow className="h-5 w-5" />} />
        {lesson.diagram && <FlowDiagram spec={lesson.diagram} />}
        <Markdown source={lesson.deepDive} />

        <SectionHeader id="sec-code" step="שלב 3" title="דוגמת קוד" subtitle="קוד אמיתי עם הסבר – אפשר להעתיק ולנסות" icon={<Code2 className="h-5 w-5" />} />
        {lesson.code.length > 1 && (
          <div className="flex flex-wrap gap-2">
            {lesson.code.map((c, i) => (
              <button
                key={c.title}
                onClick={() => setCodeTab(i)}
                className={`rounded-xl border px-3.5 py-1.5 text-[13px] transition ${
                  i === codeTab ? 'border-brand bg-brand/10 font-semibold text-brand' : 'border-line text-muted hover:text-fg'
                }`}
              >
                {c.title}
              </button>
            ))}
          </div>
        )}
        {code && <CodeBlock key={code.title} code={code.code} lang={code.lang} title={code.title} maxHeight={760} />}
        <div className="card p-6">
          <Markdown source={lesson.codeNotes} />
        </div>

        <SectionHeader id="sec-mistakes" step="שלב 4" title="טעויות נפוצות" subtitle="מה בדרך כלל משתבש – ואיך נמנעים מזה" icon={<Bug className="h-5 w-5" />} />
        <FailureModes items={lesson.failureModes} />

        <SectionHeader id="sec-terms" step="שלב 5" title="מונחים חשובים" subtitle="כדאי להכיר בעל פה – הם יופיעו שוב ושוב" icon={<BookA className="h-5 w-5" />} />
        <div className="grid gap-3 sm:grid-cols-2">
          {lesson.keyTerms.map((t) => (
            <a key={t.term} href={href.glossary(t.term)} className="card group p-4 transition hover:border-brand/50">
              <div className="flex flex-wrap items-baseline gap-x-2">
                <span dir="ltr" className="text-[16px] font-bold text-fg group-hover:text-brand">
                  {t.term}
                </span>
                {t.he && <span className="text-[13px] text-faint">{t.he}</span>}
              </div>
              <p className="mt-1 text-[14px] leading-6 text-muted">{t.def}</p>
            </a>
          ))}
        </div>

        <SectionHeader id="sec-exercise" step="שלב 6" title="תרגיל" subtitle="נסה לבד, השתמש ברמזים, ורק אז תסתכל על הפתרון" icon={<Dumbbell className="h-5 w-5" />} />
        <Challenge key={`challenge-${key}`} lessonId={key} challenge={lesson.challenge} />

        <SectionHeader id="sec-quiz" step="שלב 7" title="בדוק את עצמך" subtitle="70% ומעלה מסמנים את השיעור כהושלם" icon={<ListChecks className="h-5 w-5" />} />
        <Quiz key={`quiz-${key}`} lessonId={key} questions={lesson.quiz} />

        <div className="mt-16 grid gap-3 border-t border-line pt-6 sm:grid-cols-2">
          {prev ? (
            <a href={href.lesson(prev.module.id, prev.lesson.id)} className="card group p-4 hover:border-brand/50">
              <div className="flex items-center gap-1.5 text-[12px] text-faint">
                <ArrowRight className="h-3.5 w-3.5" /> השיעור הקודם
              </div>
              <div className="mt-1 text-[14.5px] font-semibold text-fg group-hover:text-brand">{prev.lesson.title}</div>
            </a>
          ) : (
            <span />
          )}
          {next && (
            <a href={href.lesson(next.module.id, next.lesson.id)} className="card group p-4 text-end hover:border-brand/50">
              <div className="flex items-center justify-end gap-1.5 text-[12px] text-faint">
                השיעור הבא <ArrowLeft className="h-3.5 w-3.5" />
              </div>
              <div className="mt-1 text-[14.5px] font-semibold text-fg group-hover:text-brand">{next.lesson.title}</div>
            </a>
          )}
        </div>
      </article>

      <aside className="hidden w-60 shrink-0 xl:block">
        <div className="sticky top-8">
          <div className="mb-3 text-[12px] font-bold text-faint">בשיעור הזה</div>
          <div className="space-y-0.5 border-s-2 border-line">
            {SECTIONS.map((s) => {
              const Icon = s.icon;
              const active = activeSec === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => jump(s.id)}
                  className={`-ms-0.5 flex w-full items-center gap-2 border-s-2 py-1.5 ps-3 text-start text-[13.5px] transition ${
                    active ? 'border-brand font-semibold text-brand' : 'border-transparent text-faint hover:text-fg'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" /> {s.label}
                </button>
              );
            })}
          </div>
          <div className="card mt-6 p-4">
            <div className="text-[12px] font-bold text-faint">למה זה חשוב לתפקיד</div>
            <div className="mt-1.5 text-[13px] leading-6 text-muted">{module.why}</div>
          </div>
        </div>
      </aside>
    </div>
  );
}
