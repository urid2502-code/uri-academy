import { ArrowLeft, Award, BookA, BookOpen, Brain, CheckCircle2, Code2, GitCompareArrows, Lightbulb, Network, PlayCircle, RotateCcw, Sparkles, Swords, Target } from 'lucide-react';
import { useState } from 'react';
import { toneGradient, toneText } from '../components/tones';
import { ModuleIcon, ProgressBar, ProgressRing } from '../components/ui';
import { allLessons, findLesson, glossary, lessonKey, modules, STAGES } from '../content';
import { useProgress } from '../lib/progress-context';
import { href } from '../lib/router';
import type { Stage } from '../types';

const SKILLS = [
  { skill: 'TypeScript ו-Node.js', detail: 'שפה, Server ו-API Design', modules: ['m2', 'm4'] },
  { skill: 'Web Fundamentals', detail: 'HTTP, Browser, Client-Server', modules: ['m1'] },
  { skill: 'PostgreSQL ו-Data Modeling', detail: 'SQL, Index, Transaction', modules: ['m5'] },
  { skill: 'React', detail: 'Components, State, Data Fetching', modules: ['m6'] },
  { skill: 'Real-Time Systems', detail: 'WebSockets, Streaming, Live Pipelines', modules: ['m7'] },
  { skill: 'Event-Driven Microservices', detail: 'Queues, Pub/Sub, Async Workers, Contracts', modules: ['m8'] },
  { skill: 'AI ו-LLM Integration', detail: 'Prompts, Structured Output, Guardrails', modules: ['m9'] },
  { skill: 'Kubernetes ו-Observability', detail: 'Docker, K8s, Logs/Metrics/Traces', modules: ['m10'] },
  { skill: 'Developer Workflow', detail: 'Terminal, Git, Testing, Debugging', modules: ['m3'] },
];

const HOW_TO = [
  { icon: BookOpen, title: 'קרא את ההסבר', body: 'כל שיעור מתחיל באנלוגיה מהחיים ובונה את הרעיון צעד אחר צעד.' },
  { icon: Code2, title: 'הרץ את הקוד', body: 'העתק את הדוגמה, הרץ אצלך ושנה דברים קטנים כדי לראות מה קורה.' },
  { icon: Brain, title: 'פתור את התרגיל', body: 'נסה לבד, השתמש ברמזים, ורק בסוף תסתכל על הפתרון.' },
  { icon: Award, title: 'עבור את המבחן', body: '70% ומעלה מסמנים את השיעור כהושלם. אפשר לנסות כמה פעמים.' },
];

export function Home() {
  const { state, reset } = useProgress();
  const [confirmReset, setConfirmReset] = useState(false);
  const total = allLessons.length;
  const done = allLessons.filter((x) => state.completed.includes(x.key)).length;
  const pct = total ? Math.round((done / total) * 100) : 0;
  const quizzes = Object.values(state.quiz);
  const avgQuiz = quizzes.length ? Math.round((quizzes.reduce((a, q) => a + q.best / q.total, 0) / quizzes.length) * 100) : 0;
  const exercises = Object.entries(state.notes).filter(([k, v]) => k.startsWith('challenge:') && v.trim().length > 20).length;
  const last = state.lastVisited ? findLesson(state.lastVisited.moduleId, state.lastVisited.lessonId) : null;
  const nextUp = allLessons.find((x) => !state.completed.includes(x.key));
  const resume = last ?? (nextUp ? { module: nextUp.module, lesson: nextUp.lesson } : null);
  const [greeting] = useState(() => {
    const hour = new Date().getHours();
    return hour < 12 ? 'בוקר טוב' : hour < 18 ? 'צהריים טובים' : 'ערב טוב';
  });

  return (
    <div className="mx-auto max-w-6xl px-5 pb-24 pt-8 lg:px-10">
      <section className="brand-gradient relative overflow-hidden rounded-[2rem] p-8 text-white shadow-soft md:p-11">
        <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(white_1px,transparent_1px)] [background-size:22px_22px]" />
        <div className="absolute -start-16 -top-24 h-72 w-72 rounded-full bg-white/15 blur-3xl" />
        <div className="relative grid items-center gap-8 md:grid-cols-[1fr_auto]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-[13px] font-medium backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" /> {greeting}, אורי
            </div>
            <h1 className="mt-5 text-[34px] font-bold leading-[1.2] md:text-[44px]">
              מהיסוד ועד מפתח Full Stack בכיר
            </h1>
            <p className="mt-4 max-w-2xl text-[17px] leading-8 opacity-95">
              המקום שלך ללמוד ולתרגל את כל הכישורים של מפתח Full Stack: איך הרשת עובדת, TypeScript, Server ו-Database, React, מערכות Real-Time, Queues,
              AI ו-Cloud. בלי ידע קודם – צעד אחר צעד.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              {resume && (
                <a
                  href={href.lesson(resume.module.id, resume.lesson.id)}
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-[15px] font-bold text-slate-900 shadow-lg transition hover:-translate-y-0.5"
                >
                  <PlayCircle className="h-5 w-5" /> {last ? 'להמשיך' : 'להתחיל'}: {resume.lesson.title}
                </a>
              )}
              <a href={href.glossary()} className="inline-flex items-center gap-2 rounded-xl bg-white/20 px-5 py-3 text-[15px] font-semibold backdrop-blur transition hover:bg-white/30">
                <BookA className="h-5 w-5" /> מילון מונחים
              </a>
            </div>
          </div>
          <div className="relative mx-auto flex h-40 w-40 items-center justify-center rounded-full bg-white/15 backdrop-blur">
            <div className="absolute inset-0 flex items-center justify-center">
              <ProgressRing value={pct} size={150} stroke={11} />
            </div>
            <div className="text-center">
              <div className="text-[34px] font-bold leading-none">{pct}%</div>
              <div className="mt-1 text-[12px] opacity-90">מהמסלול</div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: 'שיעורים שהושלמו', value: `${done}/${total}`, icon: CheckCircle2, cls: 'text-emerald-500' },
          { label: 'ממוצע מבחנים', value: quizzes.length ? `${avgQuiz}%` : '—', icon: Award, cls: 'text-amber-500' },
          { label: 'תרגילים שפתרת', value: `${exercises}`, icon: Brain, cls: 'text-sky-500' },
          { label: 'מונחים במילון', value: `${glossary.length}`, icon: BookA, cls: 'text-sky-500' },
        ].map((s) => (
          <div key={s.label} className="card shadow-soft p-5">
            <s.icon className={`h-6 w-6 ${s.cls}`} />
            <div className="mt-3 text-[26px] font-bold text-fg">{s.value}</div>
            <div className="text-[13px] text-faint">{s.label}</div>
          </div>
        ))}
      </section>

      <section className="mt-12">
        <h2 className="flex items-center gap-2 text-[22px] font-bold text-fg">
          <Lightbulb className="h-5 w-5 text-amber-500" /> איך ללמוד כאן
        </h2>
        <div className="mt-4 grid gap-3 md:grid-cols-4">
          {HOW_TO.map((h, i) => (
            <div key={h.title} className="card relative p-5">
              <span className="absolute end-4 top-4 text-[28px] font-bold text-line-strong">{i + 1}</span>
              <h.icon className="h-6 w-6 text-brand" />
              <div className="mt-3 font-bold text-fg">{h.title}</div>
              <p className="mt-1 text-[13.5px] leading-6 text-muted">{h.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-[22px] font-bold text-fg">מפת הדרכים</h2>
        <p className="mt-1 text-[14.5px] text-faint">שלושה שלבים, עשרה מודולים. מומלץ ללכת לפי הסדר – כל שלב נבנה על הקודם.</p>
        <div className="mt-6 space-y-10">
          {([1, 2, 3] as Stage[]).map((stage) => (
            <div key={stage}>
              <div className="mb-4 flex items-center gap-3">
                <span className="brand-gradient flex h-9 w-9 items-center justify-center rounded-xl text-[16px] font-bold text-white">{stage}</span>
                <div>
                  <div className="text-[17px] font-bold text-fg">{STAGES[stage].title.replace(/^שלב \d · /, '')}</div>
                  <div className="text-[13px] text-faint">{STAGES[stage].subtitle}</div>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {modules
                  .filter((m) => m.stage === stage)
                  .map((m) => {
                    const mDone = m.lessons.filter((l) => state.completed.includes(lessonKey(m, l))).length;
                    const full = mDone === m.lessons.length;
                    return (
                      <a key={m.id} href={href.module(m.id)} className="card shadow-soft group flex flex-col overflow-hidden transition hover:-translate-y-1 hover:border-brand/40">
                        <div className={`h-1.5 bg-gradient-to-l ${toneGradient[m.tone]}`} />
                        <div className="flex flex-1 flex-col p-5">
                          <div className="flex items-center justify-between">
                            <div className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-bl text-white ${toneGradient[m.tone]}`}>
                              <ModuleIcon icon={m.icon} className="h-5 w-5" />
                            </div>
                            <span className="text-[12px] font-bold text-faint">מודול {m.number}</span>
                          </div>
                          <h3 className="mt-4 text-[17px] font-bold leading-snug text-fg group-hover:text-brand">{m.title}</h3>
                          <p className="mt-2 flex-1 text-[13.5px] leading-6 text-muted">{m.tagline}</p>
                          <div className="mt-4 flex items-center gap-3">
                            <ProgressBar value={(mDone / m.lessons.length) * 100} className="flex-1" tone={full ? 'bg-emerald-500' : 'bg-brand'} />
                            <span className="text-[12px] font-semibold text-faint">
                              {mDone}/{m.lessons.length}
                            </span>
                          </div>
                        </div>
                      </a>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-14 grid gap-4 md:grid-cols-3">
        {[
          { to: href.simulator(), icon: Network, cls: 'text-teal-500', title: 'סימולטור: מסע של בקשה', body: 'שלח בקשה דרך Browser ← Server ← Queue ← AI ← Database ← Dashboard, הכנס תקלות וראה איך מערכת טובה מתמודדת.' },
          { to: href.comparisons(), icon: GitCompareArrows, cls: 'text-amber-500', title: 'קוד מתחיל מול מקצוען', body: 'אותה משימה בשתי גרסאות – ומה בדיוק נשבר בגרסה התמימה. הדרך המהירה ללמוד הרגלים טובים.' },
          { to: href.interview(), icon: Swords, cls: 'text-rose-500', title: 'הכנה לראיון עבודה', body: 'שאלות טכניות נפוצות עם תשובות, ותרחישי System Design עם טיימר ופתרון מודרך.' },
        ].map((c) => (
          <a key={c.title} href={c.to} className="card shadow-soft group p-6 transition hover:-translate-y-0.5 hover:border-brand/40">
            <c.icon className={`h-7 w-7 ${c.cls}`} />
            <h3 className="mt-3 text-[17px] font-bold text-fg">{c.title}</h3>
            <p className="mt-1.5 text-[14px] leading-6 text-muted">{c.body}</p>
            <div className="mt-3 flex items-center gap-1 text-[13px] font-semibold text-brand">
              פתח <ArrowLeft className="h-3.5 w-3.5 transition group-hover:-translate-x-1" />
            </div>
          </a>
        ))}
      </section>

      <section className="mt-14">
        <h2 className="flex items-center gap-2 text-[22px] font-bold text-fg">
          <Target className="h-5 w-5 text-brand" /> מפת הכישורים של מפתח Full Stack בכיר
        </h2>
        <p className="mt-1 text-[14.5px] text-faint">הכישורים שמחפשים בתפקיד, ואיפה לומדים כל אחד מהם.</p>
        <div className="card mt-4 overflow-hidden">
          {SKILLS.map((r, i) => {
            const mods = r.modules.map((id) => modules.find((m) => m.id === id)).filter((m) => m !== undefined);
            const keys = mods.flatMap((m) => m.lessons.map((l) => lessonKey(m, l)));
            const p = keys.length ? (keys.filter((k) => state.completed.includes(k)).length / keys.length) * 100 : 0;
            return (
              <div key={r.skill} className={`grid items-center gap-3 px-5 py-4 md:grid-cols-[1fr_auto_160px] ${i ? 'border-t border-line' : ''}`}>
                <div>
                  <div className="text-[15px] font-semibold text-fg">{r.skill}</div>
                  <div dir="auto" className="text-[13px] text-faint">
                    {r.detail}
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {mods.map((m) => (
                    <a key={m.id} href={href.module(m.id)} className={`rounded-full border border-line px-2.5 py-0.5 text-[12px] font-semibold hover:border-brand/50 ${toneText[m.tone]}`}>
                      מודול {m.number}
                    </a>
                  ))}
                </div>
                <ProgressBar value={p} tone={p === 100 ? 'bg-emerald-500' : 'bg-brand'} />
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-10 flex items-center justify-end gap-2 text-[13px] text-faint">
        {confirmReset ? (
          <>
            <span>למחוק את כל ההתקדמות, הציונים והפתרונות?</span>
            <button
              onClick={() => {
                reset();
                setConfirmReset(false);
              }}
              className="rounded-lg border border-rose-500/50 px-3 py-1 text-rose-600 hover:bg-rose-500/10 dark:text-rose-300"
            >
              כן, אפס
            </button>
            <button onClick={() => setConfirmReset(false)} className="rounded-lg border border-line px-3 py-1 hover:text-fg">
              ביטול
            </button>
          </>
        ) : (
          <button onClick={() => setConfirmReset(true)} className="flex items-center gap-1.5 hover:text-fg">
            <RotateCcw className="h-3.5 w-3.5" /> איפוס התקדמות
          </button>
        )}
      </section>
    </div>
  );
}
