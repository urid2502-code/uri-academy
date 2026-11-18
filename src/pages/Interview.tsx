import {
  ArrowLeft,
  ArrowRight,
  CheckSquare,
  ChevronDown,
  Clock,
  Eye,
  EyeOff,
  HelpCircle,
  ListChecks,
  MessageCircleQuestion,
  MessageSquareQuote,
  Pause,
  PenLine,
  Play,
  RotateCcw,
  Ruler,
  Square,
  Swords,
  Target,
} from 'lucide-react';
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { FlowDiagram } from '../components/FlowDiagram';
import { Inline, Markdown } from '../components/Markdown';
import { ProgressBar } from '../components/ui';
import { interviewQA, scenarios } from '../content/interview';
import { useProgress } from '../lib/progress-context';
import { href } from '../lib/router';
import type { InterviewScenario } from '../types';

const DIFF_CLS: Record<InterviewScenario['difficulty'], string> = {
  מתחיל: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300',
  בינוני: 'bg-amber-500/15 text-amber-700 dark:text-amber-300',
  מתקדם: 'bg-rose-500/15 text-rose-700 dark:text-rose-300',
};

function Collapsible({ title, icon, children, defaultOpen = false }: { title: string; icon: ReactNode; children: ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="card overflow-hidden">
      <button onClick={() => setOpen((o) => !o)} className="flex w-full items-center gap-2.5 px-5 py-4 text-start hover:bg-surface-2/60">
        <span className="text-brand">{icon}</span>
        <span className="flex-1 text-[15.5px] font-bold text-fg">{title}</span>
        <ChevronDown className={`h-4 w-4 text-faint transition ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="animate-fade-up border-t border-line px-5 py-4">{children}</div>}
    </div>
  );
}

function MockTimer({ minutes }: { minutes: number }) {
  const [left, setLeft] = useState(minutes * 60);
  const [on, setOn] = useState(false);
  const running = on && left > 0;
  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setLeft((l) => Math.max(0, l - 1)), 1000);
    return () => clearInterval(t);
  }, [running]);
  const mm = String(Math.floor(left / 60)).padStart(2, '0');
  const ss = String(left % 60).padStart(2, '0');
  const pct = (left / (minutes * 60)) * 100;
  const phase = pct > 85 ? 'שאלות הבהרה' : pct > 70 ? 'הערכות גודל ו-API' : pct > 30 ? 'ארכיטקטורה וצלילה לעומק' : pct > 10 ? 'תקלות ו-Trade-offs' : 'סיכום';
  return (
    <div className="card border-rose-500/30 p-5">
      <div className="flex items-center justify-between">
        <div className="text-[13px] font-bold text-fg">טיימר ראיון</div>
        <div className="flex gap-1.5">
          <button onClick={() => setOn((o) => !o)} className="rounded-lg border border-line p-1.5 text-muted hover:bg-surface-2" aria-label={running ? 'השהה' : 'התחל'}>
            {running ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
          </button>
          <button
            onClick={() => {
              setOn(false);
              setLeft(minutes * 60);
            }}
            className="rounded-lg border border-line p-1.5 text-muted hover:bg-surface-2"
            aria-label="אפס טיימר"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
      <div dir="ltr" className={`mt-2 text-end font-mono text-[34px] font-bold ${left < 300 ? 'text-rose-500' : 'text-fg'}`}>
        {mm}:{ss}
      </div>
      <ProgressBar value={pct} tone="bg-rose-500" className="mt-2" />
      <div className="mt-2 text-[12.5px] text-muted">
        במה להתמקד עכשיו: <span className="font-semibold text-fg">{phase}</span>
      </div>
    </div>
  );
}

function ScenarioDetail({ s }: { s: InterviewScenario }) {
  const { state, toggleChecklist, setNote } = useProgress();
  const [showSolution, setShowSolution] = useState(false);
  const checked = state.checklists[s.id] ?? [];
  const noteKey = `interview:${s.id}`;
  const next = scenarios[scenarios.indexOf(s) + 1];

  return (
    <div className="mx-auto max-w-[1680px] px-5 pb-24 pt-8 lg:px-10">
      <a href={href.interview('design')} className="inline-flex items-center gap-1.5 text-[13px] text-faint hover:text-fg">
        <ArrowRight className="h-3.5 w-3.5" /> כל התרחישים
      </a>
      <div className="mt-4 grid gap-8 lg:grid-cols-[1fr_290px]">
        <div className="min-w-0 space-y-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className={`rounded-full px-2.5 py-0.5 text-[12px] font-bold ${DIFF_CLS[s.difficulty]}`}>{s.difficulty}</span>
              <span className="flex items-center gap-1 text-[13px] text-faint">
                <Clock className="h-3.5 w-3.5" /> {s.duration}
              </span>
            </div>
            <h1 className="mt-3 text-[28px] font-bold leading-tight tracking-tight text-fg">{s.title}</h1>
          </div>

          <div className="rounded-2xl border border-brand/30 bg-gradient-to-bl from-brand/10 to-transparent p-6">
            <div className="mb-2 flex items-center gap-2 text-[13px] font-bold text-brand">
              <MessageSquareQuote className="h-4 w-4" /> המראיין אומר
            </div>
            <p className="text-[17px] leading-8 text-fg">״{s.prompt}״</p>
          </div>

          <Collapsible title="שאלות הבהרה ששואלים קודם" icon={<HelpCircle className="h-4 w-4" />} defaultOpen>
            <ol className="space-y-2">
              {s.clarifyingQuestions.map((q, i) => (
                <li key={q} className="flex gap-3 text-[14.5px] leading-7 text-muted">
                  <span className="font-bold text-brand">{i + 1}.</span>
                  <Inline text={q} />
                </li>
              ))}
            </ol>
          </Collapsible>

          <Collapsible title="דרישות" icon={<Target className="h-4 w-4" />}>
            <div className="grid gap-5 md:grid-cols-2">
              {(
                [
                  ['דרישות פונקציונליות (מה המערכת עושה)', s.functional],
                  ['דרישות לא-פונקציונליות (כמה טוב)', s.nonFunctional],
                ] as const
              ).map(([label, items]) => (
                <div key={label}>
                  <div className="mb-2 text-[13px] font-bold text-faint">{label}</div>
                  <ul className="space-y-1.5">
                    {items.map((it) => (
                      <li key={it} className="flex gap-2 text-[14.5px] leading-7 text-muted">
                        <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                        <Inline text={it} />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Collapsible>

          <Collapsible title="הערכות גודל (Back-of-envelope)" icon={<Ruler className="h-4 w-4" />}>
            <div className="grid gap-3 sm:grid-cols-2">
              {s.estimates.map((e) => (
                <div key={e.label} className="rounded-xl bg-surface-2 p-4">
                  <div className="text-[12px] font-semibold text-faint">{e.label}</div>
                  <div dir="auto" className="mt-0.5 text-[20px] font-bold text-amber-600 dark:text-amber-300">
                    {e.value}
                  </div>
                  <div className="mt-0.5 text-[13px] text-muted">{e.note}</div>
                </div>
              ))}
            </div>
          </Collapsible>

          <div className="card overflow-hidden">
            <label htmlFor={noteKey} className="flex items-center gap-2 border-b border-line px-5 py-3 text-[14px] font-bold text-fg">
              <PenLine className="h-4 w-4 text-faint" /> התשובה שלך <span className="text-[12px] font-normal text-faint">(נשמר אוטומטית)</span>
            </label>
            <textarea
              id={noteKey}
              value={state.notes[noteKey] ?? ''}
              onChange={(e) => setNote(noteKey, e.target.value)}
              placeholder="כתוב את הרכיבים, איך המידע זורם, איך שומרים נתונים ומה קורה כשמשהו נופל – לפני שאתה מסתכל על הפתרון…"
              className="h-48 w-full resize-y bg-transparent px-5 py-4 text-[15px] leading-7 text-fg placeholder:text-faint focus:outline-none"
            />
          </div>

          <button
            onClick={() => setShowSolution((v) => !v)}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-emerald-500/40 bg-emerald-500/[0.06] px-4 py-3.5 text-[15px] font-bold text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-300"
          >
            {showSolution ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {showSolution ? 'הסתר את הפתרון' : 'הצג פתרון מודרך וארכיטקטורה'}
          </button>

          {showSolution && (
            <div className="animate-fade-up space-y-4">
              <FlowDiagram spec={s.diagram} />
              <div className="card p-6">
                <Markdown source={s.solution} />
              </div>
            </div>
          )}

          <Collapsible title="שאלות המשך שהמראיין עלול לשאול" icon={<Swords className="h-4 w-4" />}>
            <ul className="space-y-2.5">
              {s.followUps.map((f) => (
                <li key={f} className="flex gap-2.5 text-[14.5px] leading-7 text-muted">
                  <ArrowLeft className="mt-1.5 h-4 w-4 shrink-0 text-rose-500" />
                  <Inline text={f} />
                </li>
              ))}
            </ul>
          </Collapsible>

          {next && (
            <a href={href.interview(next.id)} className="card group mt-6 block p-4 text-end hover:border-brand/50">
              <div className="flex items-center justify-end gap-1.5 text-[12px] text-faint">
                התרחיש הבא <ArrowLeft className="h-3.5 w-3.5" />
              </div>
              <div className="mt-1 text-[14.5px] font-semibold text-fg group-hover:text-brand">{next.title}</div>
            </a>
          )}
        </div>

        <aside className="space-y-4 lg:sticky lg:top-8 lg:h-fit">
          <MockTimer key={s.id} minutes={parseInt(s.duration, 10) || 45} />
          <div className="card p-5">
            <div className="mb-1 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[13px] font-bold text-fg">
                <ListChecks className="h-4 w-4" /> רשימת בדיקה
              </div>
              <span className="text-[12px] font-bold text-brand">
                {checked.length}/{s.checklist.length}
              </span>
            </div>
            <p className="mb-3 text-[12px] text-faint">סמן כל נקודה שכיסית בתשובה שלך.</p>
            <ProgressBar value={(checked.length / s.checklist.length) * 100} className="mb-3" tone="bg-emerald-500" />
            <div className="space-y-1">
              {s.checklist.map((c) => {
                const on = checked.includes(c);
                return (
                  <button key={c} onClick={() => toggleChecklist(s.id, c)} className="flex w-full gap-2 rounded-lg px-1.5 py-1.5 text-start text-[13px] leading-5 hover:bg-surface-2">
                    {on ? <CheckSquare className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" /> : <Square className="mt-0.5 h-4 w-4 shrink-0 text-line-strong" />}
                    <span className={on ? 'text-faint line-through' : 'text-muted'}>{c}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function QAList() {
  const topics = useMemo(() => ['הכל', ...new Set(interviewQA.map((q) => q.topic))], []);
  const [topic, setTopic] = useState('הכל');
  const [open, setOpen] = useState<number | null>(null);
  const list = interviewQA.map((q, i) => ({ ...q, i })).filter((q) => topic === 'הכל' || q.topic === topic);

  return (
    <div>
      <div className="mb-5 flex flex-wrap gap-2">
        {topics.map((t) => (
          <button
            key={t}
            onClick={() => setTopic(t)}
            className={`rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition ${topic === t ? 'border-brand bg-brand text-brand-fg' : 'border-line bg-surface text-muted hover:text-fg'}`}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="space-y-3">
        {list.map((q) => {
          const isOpen = open === q.i;
          return (
            <div key={q.i} className="card overflow-hidden">
              <button onClick={() => setOpen(isOpen ? null : q.i)} className="flex w-full items-center gap-3 px-5 py-4 text-start hover:bg-surface-2/60">
                <MessageCircleQuestion className="h-5 w-5 shrink-0 text-brand" />
                <span className="flex-1 text-[15.5px] font-semibold text-fg">
                  <Inline text={q.q} />
                </span>
                <span className="hidden rounded-full bg-surface-2 px-2.5 py-0.5 text-[11.5px] text-faint sm:inline">{q.topic}</span>
                <ChevronDown className={`h-4 w-4 text-faint transition ${isOpen ? 'rotate-180' : ''}`} />
              </button>
              {isOpen && (
                <div className="animate-fade-up border-t border-line px-5 py-4">
                  <Markdown source={q.a} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function Interview({ selectedId }: { selectedId?: string }) {
  const { state } = useProgress();
  const selected = scenarios.find((s) => s.id === selectedId);
  if (selected) return <ScenarioDetail key={selected.id} s={selected} />;
  const tab = selectedId === 'design' ? 'design' : 'qa';

  return (
    <div className="mx-auto max-w-[1680px] px-5 pb-24 pt-8 lg:px-10">
      <header className="mb-6">
        <div className="flex items-center gap-2 text-[13px] font-bold text-rose-600 dark:text-rose-300">
          <Swords className="h-4 w-4" /> הכנה לראיון עבודה
        </div>
        <h1 className="mt-2 text-[32px] font-bold tracking-tight text-fg">להגיע לראיון מוכן</h1>
        <p className="mt-2 text-[16px] leading-7 text-muted">
          שני חלקים: <b className="text-fg">שאלות טכניות נפוצות</b> עם תשובות ברורות, ו-<b className="text-fg">תרגול System Design</b> – תכנון מערכת שלמה
          מול טיימר, עם פתרון מודרך ורשימת בדיקה.
        </p>
      </header>

      <div className="mb-8 inline-flex rounded-2xl border border-line bg-surface p-1">
        <a href={href.interview()} className={`rounded-xl px-5 py-2 text-[14px] font-semibold transition ${tab === 'qa' ? 'bg-brand text-brand-fg' : 'text-muted hover:text-fg'}`}>
          שאלות נפוצות ({interviewQA.length})
        </a>
        <a href={href.interview('design')} className={`rounded-xl px-5 py-2 text-[14px] font-semibold transition ${tab === 'design' ? 'bg-brand text-brand-fg' : 'text-muted hover:text-fg'}`}>
          System Design ({scenarios.length})
        </a>
      </div>

      {tab === 'qa' ? (
        <QAList />
      ) : (
        <>
          <div className="mb-8 grid gap-3 md:grid-cols-4">
            {[
              ['1. להבהיר', 'מי המשתמשים, כמה הם, מה הכי חשוב'],
              ['2. להעריך', 'כמה בקשות בשנייה, כמה מידע'],
              ['3. לתכנן', 'רכיבים, זרימת מידע, API ו-Database'],
              ['4. לבדוק', 'מה קורה כשמשהו נופל? מה ה-Trade-offs?'],
            ].map(([t, d]) => (
              <div key={t} className="card p-4">
                <div className="text-[15px] font-bold text-fg">{t}</div>
                <div className="mt-1 text-[13px] leading-6 text-muted">{d}</div>
              </div>
            ))}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {scenarios.map((s) => {
              const done = (state.checklists[s.id] ?? []).length;
              return (
                <a key={s.id} href={href.interview(s.id)} className="card shadow-soft group flex flex-col p-5 transition hover:-translate-y-0.5 hover:border-brand/40">
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full px-2.5 py-0.5 text-[11.5px] font-bold ${DIFF_CLS[s.difficulty]}`}>{s.difficulty}</span>
                    <span className="flex items-center gap-1 text-[12.5px] text-faint">
                      <Clock className="h-3 w-3" /> {s.duration}
                    </span>
                  </div>
                  <h3 className="mt-3 text-[17px] font-bold leading-snug text-fg group-hover:text-brand">{s.title}</h3>
                  <p className="mt-2 line-clamp-3 flex-1 text-[14px] leading-6 text-muted">{s.prompt}</p>
                  <div className="mt-4 flex items-center gap-3">
                    <ProgressBar value={(done / s.checklist.length) * 100} className="flex-1" tone="bg-emerald-500" />
                    <span className="text-[12px] font-semibold text-faint">
                      {done}/{s.checklist.length}
                    </span>
                  </div>
                </a>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
