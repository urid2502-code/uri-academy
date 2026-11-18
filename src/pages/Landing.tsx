import { ArrowLeft, Bookmark, X as XIcon } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { useMemo, useState, type ReactNode } from 'react';
import { LedgerRow, NotebookShell, StateBox, type BoxState } from '../components/notebook';
import { allLessons, findLesson, glossary, modules, STAGES } from '../content';
import { comparisons } from '../content/comparisons';
import { courses, platformStats } from '../content/courses';
import { tokenize } from '../lib/highlight';
import { useProgress } from '../lib/progress-context';
import { href } from '../lib/router';
import type { Stage } from '../types';

const RITUAL: { name: string; what: string }[] = [
  { name: 'מה זה ולמה זה חשוב', what: 'אנלוגיה מהחיים, לפני שורת קוד אחת.' },
  { name: 'איך זה עובד', what: 'צעד אחר צעד, עם דיאגרמה כשצריך לראות את התמונה.' },
  { name: 'דוגמת קוד', what: 'קוד אמיתי עם הסבר. אפשר להעתיק ולהריץ.' },
  { name: 'טעויות נפוצות', what: 'מה משתבש בפועל, למה זה קורה, ואיך נמנעים.' },
  { name: 'מונחים חשובים', what: 'המונח באנגלית, ההסבר בעברית.' },
  { name: 'תרגיל', what: 'משימה קטנה עם רמזים ופתרון מלא.' },
  { name: 'בדוק את עצמך', what: 'מבחן קצר. 70% ומעלה מסמנים את השיעור כהושלם.' },
];

const container = 'mx-auto max-w-6xl ps-10 pe-5 md:ps-24 md:pe-8';

function useBoxState() {
  const { state } = useProgress();
  return (key: string): BoxState => {
    if (!state.completed.includes(key)) return 'empty';
    const q = state.quiz[key];
    return q && q.best === q.total ? 'starred' : 'ticked';
  };
}

/** Renders `inline code` spans inside short Hebrew sentences. */
function InlineCode({ text }: { text: string }) {
  return (
    <>
      {text.split(/(`[^`]+`)/g).map((part, i) =>
        part.startsWith('`') ? (
          <code key={i} dir="ltr" className="rounded-[2px] bg-surface-2 px-1 py-px font-mono text-[0.86em] text-fg">
            {part.slice(1, -1)}
          </code>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}

function SectionHead({ title, children }: { title: ReactNode; children?: ReactNode }) {
  return (
    <div className="max-w-2xl">
      <h2 className="h2-note text-[32px] text-fg md:text-[44px]">{title}</h2>
      {children && <p className="mt-4 text-[16.5px] leading-8 text-muted">{children}</p>}
    </div>
  );
}

/* ------------------------------------------------------------------ */

function Hero() {
  const { state } = useProgress();
  const boxOf = useBoxState();
  const reduce = useReducedMotion();
  const [note, setNote] = useState<string | null>(null);

  const done = allLessons.filter((x) => state.completed.includes(x.key)).length;
  const last = state.lastVisited ? findLesson(state.lastVisited.moduleId, state.lastVisited.lessonId) : null;
  const lastKey = last ? `${last.module.id}-${last.lesson.id}` : null;
  const firstOpen = allLessons.find((x) => !state.completed.includes(x.key));
  const resuming = !!last && lastKey !== null && !state.completed.includes(lastKey);
  const target = resuming ? allLessons.find((x) => x.key === lastKey)! : firstOpen;
  const stage: Stage = target?.module.stage ?? 1;
  const lines = allLessons.filter((x) => x.module.stage === stage);
  const stageDone = lines.filter((x) => state.completed.includes(x.key)).length;

  const cta = target
    ? resuming
      ? { label: `להמשיך: ${target.lesson.title}`, to: href.lesson(target.module.id, target.lesson.id) }
      : done === 0
        ? { label: 'להתחיל את שיעור 1', to: href.lesson('m1', 'l1') }
        : { label: `לשיעור הבא: ${target.lesson.title}`, to: href.lesson(target.module.id, target.lesson.id) }
    : { label: 'לחזור למחברת', to: href.home() };

  return (
    <section className={`${container} grid items-center gap-y-14 pb-20 pt-14 md:pt-20 lg:min-h-[calc(100svh-4rem)] lg:grid-cols-[minmax(0,1.12fr)_minmax(0,1fr)] lg:gap-x-24 lg:py-16`}>
      <div className="min-w-0">
        <h1 className="display-thin text-[40px] text-fg sm:text-[58px] lg:text-[64px]">
          ללמוד{' '}
          <span dir="ltr" className="whitespace-nowrap font-light">
            Full Stack
          </span>
          <br />
          מהשורה הראשונה.
        </h1>
        <p className="mt-7 max-w-[34rem] text-[17.5px] leading-8 text-muted">
          מחברת לימוד אישית ב-{platformStats.lessons} שיעורים: מאיך האינטרנט עובד ועד מערכות AI ו-Kubernetes. כל שיעור בנוי אותו דבר – הסבר, קוד, טעויות, תרגיל ומבחן – והמונחים נשארים באנגלית, כמו בעבודה.
        </p>
        <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
          <a href={cta.to} className="btn-ice btn-ice-lg max-w-full">
            <span className="truncate">{cta.label}</span>
            <ArrowLeft className="h-4 w-4 shrink-0" />
          </a>
          <a href={href.courses()} className="link-quiet text-[15.5px]">
            כל הקורסים
          </a>
        </div>
        <p className="tabular mt-8 text-[14px] text-faint">
          {done > 0
            ? `השלמת ${done} מתוך ${allLessons.length} שיעורים · ${Math.round((done / allLessons.length) * 100)}%`
            : `${allLessons.length} שיעורים · כ-${courses[0].hours} שעות · בלי הרשמה, ההתקדמות נשמרת אצלך`}
        </p>
      </div>

      <div className="min-w-0">
        <div className="flex items-baseline justify-between gap-4 border-b border-line-strong pb-3">
          <h2 className="text-[15px] font-medium text-fg">{STAGES[stage].title}</h2>
          <span className="tabular text-[13.5px] text-faint">
            {stageDone}/{lines.length}
          </span>
        </div>
        <ol>
          {lines.map(({ module, lesson, key }) => {
            const isTarget = target?.key === key;
            const isLast = lastKey === key;
            return (
              <li key={key} className="relative">
                {isTarget && (
                  <>
                    <svg
                      aria-hidden
                      viewBox="0 0 96 64"
                      className="pointer-events-none absolute end-full me-2 hidden h-[54px] w-20 lg:block"
                      style={{ top: 'calc(50% - 47px)' }}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.6}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <motion.path
                        className="text-ice"
                        d="M92 5 C 78 8, 64 30, 42 44 S 14 56, 5 55"
                        initial={reduce ? false : { pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1.1, delay: 0.35, ease: [0.65, 0, 0.35, 1] }}
                      />
                      <motion.path
                        className="text-ice"
                        d="M14 49 L5 55 L14 60"
                        initial={reduce ? false : { pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.25, delay: 1.4, ease: 'easeOut' }}
                      />
                    </svg>
                    <motion.span
                      aria-hidden
                      className="ink pointer-events-none absolute end-full me-4 hidden whitespace-nowrap text-[16px] lg:block"
                      style={{ top: 'calc(50% - 76px)' }}
                      initial={reduce ? false : { opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4, delay: 1.45 }}
                    >
                      {resuming ? 'ממשיכים כאן' : 'מתחילים כאן'}
                    </motion.span>
                  </>
                )}
                <a
                  href={href.lesson(module.id, lesson.id)}
                  onMouseEnter={() => setNote(key)}
                  onMouseLeave={() => setNote(null)}
                  onFocus={() => setNote(key)}
                  onBlur={() => setNote(null)}
                  className={`group rule-b flex items-center gap-3.5 py-3 transition-colors ${isTarget ? 'text-fg' : 'text-muted hover:text-fg'}`}
                >
                  <StateBox state={boxOf(key)} />
                  <span className="tabular w-8 shrink-0 text-[13.5px] text-faint">
                    {module.number}.{module.lessons.indexOf(lesson) + 1}
                  </span>
                  <span className="min-w-0 flex-1 text-[15.5px] leading-6">{lesson.title}</span>
                  {isTarget && <span className="ink shrink-0 text-[13px] lg:hidden">{resuming ? 'ממשיכים כאן' : 'מתחילים כאן'}</span>}
                  {isLast && (
                    <span className="flex shrink-0 items-center text-ice" title="כאן עצרת">
                      <Bookmark className="h-4 w-4 fill-current" />
                      <span className="sr-only">כאן עצרת</span>
                    </span>
                  )}
                  <span className="tabular hidden shrink-0 text-[13px] text-faint sm:inline">{lesson.minutes} דק׳</span>
                </a>
              </li>
            );
          })}
        </ol>
        <div className="mt-4 min-h-[4.5rem]" aria-live="polite">
          {note ? (
            <p className="ink text-[15px] leading-7">{allLessons.find((x) => x.key === note)?.lesson.summary}</p>
          ) : (
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-faint">
              <span className="flex items-center gap-2">
                <StateBox state="empty" decorative /> עוד לא
              </span>
              <span className="flex items-center gap-2">
                <StateBox state="ticked" decorative /> הושלם
              </span>
              <span className="flex items-center gap-2">
                <StateBox state="starred" decorative /> 100% במבחן
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function Ritual() {
  return (
    <section className={`${container} py-20 md:py-28`}>
      <SectionHead title="כל שיעור נבנה באותו סדר.">
        שבעה חלקים, תמיד באותו סדר. אחרי שיעור או שניים כבר יודעים איפה כל דבר נמצא, וכל האנרגיה הולכת לחומר עצמו.
      </SectionHead>
      <ol className="mt-12 border-t border-line-strong">
        {RITUAL.map((r, i) => (
          <li key={r.name} className="rule-b grid grid-cols-[2rem_minmax(0,1fr)] gap-x-4 gap-y-1 py-4 md:grid-cols-[3rem_16rem_minmax(0,1fr)] md:items-baseline">
            <span className="tabular text-[14px] text-faint">{i + 1}</span>
            <span className="text-[16.5px] font-medium text-fg">{r.name}</span>
            <span className="col-start-2 text-[15.5px] leading-7 text-muted md:col-start-auto">{r.what}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function StageTabs() {
  const { state } = useProgress();
  const [active, setActive] = useState<Stage>(1);
  const stages: Stage[] = [1, 2, 3];
  const list = modules.filter((m) => m.stage === active);

  return (
    <section className={`${container} py-20 md:py-28`}>
      <SectionHead title="שלושה שלבים, מהיסוד ועד Senior.">
        כל שלב נשען על הקודם. אפשר לקפוץ קדימה, אבל המסלול נבנה כך שאף שיעור לא מניח ידע שעוד לא הוסבר.
      </SectionHead>
      <div role="tablist" aria-label="שלבי המסלול" className="mt-12 flex overflow-x-auto border-b border-line-strong">
        {stages.map((s) => {
          const [num, name] = STAGES[s].title.split(' · ');
          const selected = s === active;
          return (
            <button
              key={s}
              role="tab"
              id={`stage-tab-${s}`}
              aria-selected={selected}
              aria-controls={`stage-panel-${s}`}
              onClick={() => setActive(s)}
              className={`-mb-px shrink-0 rounded-t-[2px] border border-b-0 px-5 py-3 text-start transition-colors ${
                selected ? 'border-line-strong bg-night text-fg' : 'border-transparent text-faint hover:text-muted'
              }`}
            >
              <span className="block text-[12.5px]">{num}</span>
              <span className="block text-[15.5px] font-medium">{name}</span>
            </button>
          );
        })}
      </div>
      <div role="tabpanel" id={`stage-panel-${active}`} aria-labelledby={`stage-tab-${active}`} className="border-x border-b border-line-strong bg-night px-5 py-2 md:px-8">
        <p className="rule-b py-4 text-[15px] text-muted">{STAGES[active].subtitle}</p>
        <ul>
          {list.map((m) => {
            const doneHere = m.lessons.filter((l) => state.completed.includes(`${m.id}-${l.id}`)).length;
            return (
              <li key={m.id} className="rule-b last:border-b-0">
                <a href={href.module(m.id)} className="group grid gap-x-6 gap-y-1 py-5 md:grid-cols-[6rem_minmax(0,1fr)_7rem] md:items-baseline">
                  <span className="tabular text-[13.5px] text-faint">מודול {m.number}</span>
                  <span className="min-w-0">
                    <span className="block text-[18px] font-medium text-fg transition-colors group-hover:text-ice">{m.title}</span>
                    <span className="mt-1 block text-[15px] leading-7 text-muted">{m.tagline}</span>
                  </span>
                  <span className="tabular text-[13.5px] text-faint md:text-end">
                    {doneHere}/{m.lessons.length} שיעורים
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function SampleQuiz() {
  const first = allLessons[0];
  const questions = first.lesson.quiz;
  const [qi, setQi] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const q = questions[qi];
  const answered = picked !== null;
  const right = picked === q.answer;

  return (
    <section className={`${container} grid gap-y-10 py-20 md:py-28 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-x-20`}>
      <div>
        <SectionHead title="שאלה אמיתית, מהשיעור הראשון.">
          ככה נראה &quot;בדוק את עצמך&quot; בסוף כל שיעור. כל תשובה מגיעה עם הסבר – גם כשצדקת.
        </SectionHead>
        <p className="mt-6 text-[14px] text-faint">
          מתוך: <a className="link-quiet" href={href.lesson(first.module.id, first.lesson.id)}>{first.lesson.title}</a>
        </p>
      </div>
      <div className="min-w-0">
        <div className="flex items-baseline justify-between gap-4 border-b border-line-strong pb-3">
          <p className="text-[18px] font-medium leading-8 text-fg">
            <InlineCode text={q.q} />
          </p>
          <span className="tabular shrink-0 text-[13.5px] text-faint">
            {qi + 1}/{questions.length}
          </span>
        </div>
        <ul>
          {q.options.map((opt, i) => {
            const isAnswer = answered && i === q.answer;
            const isWrongPick = answered && i === picked && !right;
            return (
              <li key={opt}>
                <button
                  disabled={answered}
                  onClick={() => setPicked(i)}
                  className={`rule-b flex w-full items-start gap-3.5 py-3.5 text-start text-[15.5px] leading-7 transition-colors ${
                    isAnswer ? 'text-fg' : isWrongPick ? 'text-[oklch(78%_0.12_25)]' : answered ? 'text-faint' : 'text-muted hover:text-fg'
                  }`}
                >
                  {isWrongPick ? (
                    <span aria-hidden className="mt-[5px] inline-flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[2px] border border-[oklch(70%_0.14_25)]">
                      <XIcon className="h-3.5 w-3.5" strokeWidth={3} />
                    </span>
                  ) : (
                    <StateBox state={isAnswer ? 'ticked' : 'empty'} className="mt-[5px]" decorative />
                  )}
                  <span className="min-w-0">
                    <InlineCode text={opt} />
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
        <div className="mt-5 min-h-[6rem]" aria-live="polite">
          {answered ? (
            <>
              <p className="ink text-[17px]">{right ? 'נכון.' : 'לא בדיוק.'}</p>
              <p className="mt-2 text-[15.5px] leading-7 text-muted">
                <InlineCode text={q.explanation} />
              </p>
              <button
                onClick={() => {
                  setPicked(null);
                  setQi((qi + 1) % questions.length);
                }}
                className="link-quiet mt-4 text-[15px]"
              >
                לשאלה הבאה
              </button>
            </>
          ) : (
            <p className="text-[14px] text-faint">התשובה כאן לא נשמרת בהתקדמות שלך.</p>
          )}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function CodeExcerpt() {
  const cmp = comparisons[0];
  const [side, setSide] = useState<'junior' | 'senior'>('junior');
  const sample = cmp[side];
  const tokens = useMemo(() => tokenize(sample.code, sample.lang), [sample.code, sample.lang]);
  const points = side === 'junior' ? cmp.junior.problems : cmp.senior.wins;

  return (
    <section className={`${container} py-20 md:py-28`}>
      <SectionHead title="אותה משימה, פעמיים.">
        {cmp.context}
      </SectionHead>
      <div className="mt-10 flex gap-6 border-b border-line-strong" role="tablist" aria-label="גרסת הקוד">
        {(['junior', 'senior'] as const).map((s) => (
          <button
            key={s}
            role="tab"
            aria-selected={side === s}
            onClick={() => setSide(s)}
            className={`-mb-px border-b-2 pb-3 text-[15.5px] transition-colors ${side === s ? 'border-ice text-fg' : 'border-transparent text-faint hover:text-muted'}`}
          >
            {s === 'junior' ? 'הגרסה של מתחיל' : 'הגרסה המקצועית'}
          </button>
        ))}
      </div>
      <div className="mt-8 grid gap-y-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:gap-x-14">
        <div className="code-surface min-w-0 overflow-hidden rounded-[2px] border border-line">
          <div className="flex items-center justify-between border-b border-line px-4 py-2.5 text-[12.5px] text-faint">
            <span className="truncate">{sample.title}</span>
            <span dir="ltr" className="font-mono uppercase">
              {sample.lang}
            </span>
          </div>
          <pre dir="ltr" className="max-h-[380px] overflow-auto p-4 text-left font-mono text-[12.5px] leading-[1.75]">
            <code>
              {tokens.map((t, i) =>
                t.cls ? (
                  <span key={i} className={t.cls}>
                    {t.text}
                  </span>
                ) : (
                  t.text
                ),
              )}
            </code>
          </pre>
        </div>
        <div className="min-w-0">
          <h3 className="text-[15px] font-medium text-fg">{side === 'junior' ? 'מה לא בסדר כאן' : 'מה השתפר'}</h3>
          <ul className="mt-3">
            {points.map((p) => (
              <li key={p} className="rule-b py-3 text-[15px] leading-7 text-muted">
                <InlineCode text={p} />
              </li>
            ))}
          </ul>
          <a href={href.comparisons()} className="link-quiet mt-6 inline-block text-[15px]">
            עוד {comparisons.length - 1} השוואות כאלה
          </a>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function CatalogContents() {
  return (
    <section className={`${container} py-20 md:py-28`}>
      <SectionHead title="תוכן העניינים.">
        מסלול אחד פתוח ומלא. השאר כבר מתוכננים, עם סילבוס – ויתווספו בהדרגה.
      </SectionHead>
      <ol className="mt-12 border-t border-line-strong">
        {courses.map((c, i) => {
          const live = c.status === 'live';
          return (
            <li key={c.id}>
              <a
                href={live ? href.home() : href.course(c.id)}
                className="group rule-b grid grid-cols-[2rem_minmax(0,1fr)_auto] items-baseline gap-x-4 py-4 md:grid-cols-[3rem_minmax(0,1fr)_9rem_6rem]"
              >
                <span className="tabular text-[14px] text-faint">{i + 1}</span>
                <span className="min-w-0">
                  <span className={`block text-[16.5px] leading-7 transition-colors group-hover:text-ice ${live ? 'font-medium text-fg' : 'text-muted'}`}>{c.title}</span>
                  <span className="mt-0.5 block text-[13.5px] text-faint">{c.category} · {c.level}</span>
                </span>
                <span className="tabular hidden text-[13.5px] text-faint md:block">{c.lessons} שיעורים</span>
                <span className={`text-[13.5px] md:text-end ${live ? 'text-ice' : 'text-faint'}`}>{live ? 'פתוח' : 'בקרוב'}</span>
              </a>
            </li>
          );
        })}
      </ol>
      <a href={href.courses()} className="link-quiet mt-6 inline-block text-[15px]">
        לקטלוג המלא, עם חיפוש
      </a>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function LedgerAndClose() {
  const { state } = useProgress();
  const done = allLessons.filter((x) => state.completed.includes(x.key)).length;
  return (
    <section className={`${container} grid gap-y-16 py-20 md:py-28 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-x-24`}>
      <div>
        <SectionHead title="מה יש במחברת." />
        <div className="mt-8 border-t border-line-strong">
          <LedgerRow label="שיעורים" value={platformStats.lessons} hrefTo={href.home()} />
          <LedgerRow label="מודולים" value={platformStats.modules} hrefTo={href.home()} />
          <LedgerRow label="שאלות במבחנים" value={platformStats.quizQuestions} />
          <LedgerRow label="מונחים במילון" value={glossary.length} hrefTo={href.glossary()} />
          <LedgerRow label="השוואות מתחיל מול מקצועי" value={platformStats.comparisons} hrefTo={href.comparisons()} />
          <LedgerRow label="שאלות ותרחישי ראיון" value={platformStats.interview} hrefTo={href.interview()} />
          <LedgerRow label="סימולטור זרימת מערכת" value="1" hrefTo={href.simulator()} />
        </div>
      </div>
      <div className="flex flex-col justify-end">
        <p className="display-thin text-[38px] text-fg md:text-[52px]">{done > 0 ? 'הדף הבא כבר פתוח.' : 'הדף הראשון כבר פתוח.'}</p>
        <p className="mt-5 max-w-md text-[16.5px] leading-8 text-muted">
          {done > 0
            ? `${done} שיעורים מאחוריך. ממשיכים בדיוק מאיפה שעצרת.`
            : `השיעור הראשון לוקח כ-${allLessons[0].lesson.minutes} דקות, ולא דורש שום ידע מוקדם.`}
        </p>
        <div className="mt-8">
          <a href={done > 0 ? href.home() : href.lesson('m1', 'l1')} className="btn-ice btn-ice-lg">
            {done > 0 ? 'לפתוח את המחברת' : 'להתחיל את שיעור 1'}
            <ArrowLeft className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

export function Landing() {
  return (
    <NotebookShell>
      <main>
        <Hero />
        <Ritual />
        <StageTabs />
        <SampleQuiz />
        <CodeExcerpt />
        <CatalogContents />
        <LedgerAndClose />
      </main>
    </NotebookShell>
  );
}
