import { ArrowLeft, ArrowRight, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { LedgerRow, NotebookShell } from '../components/notebook';
import { allLessons } from '../content';
import { CATEGORIES, courses, type Course } from '../content/courses';
import { useProgress } from '../lib/progress-context';
import { href } from '../lib/router';

const container = 'mx-auto max-w-6xl ps-10 pe-5 md:ps-24 md:pe-8';

export function Catalog() {
  const { state } = useProgress();
  const [cat, setCat] = useState<(typeof CATEGORIES)[number]>('הכל');
  const [q, setQ] = useState('');
  const done = allLessons.filter((x) => state.completed.includes(x.key)).length;
  const liveCount = courses.filter((c) => c.status === 'live').length;

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return courses.filter(
      (c) =>
        (cat === 'הכל' || c.category === cat) &&
        (!s || `${c.title} ${c.subtitle} ${c.tags.join(' ')} ${c.description}`.toLowerCase().includes(s)),
    );
  }, [cat, q]);

  return (
    <NotebookShell>
      <main className={`${container} pb-24 pt-14 md:pt-20`}>
        <h1 className="display-thin text-[44px] text-fg md:text-[68px]">קטלוג הקורסים.</h1>
        <p className="mt-5 max-w-xl text-[17px] leading-8 text-muted">
          {courses.length} קורסים במחברת. {liveCount === 1 ? 'אחד פתוח ומלא' : `${liveCount} פתוחים`}, והשאר מתוכננים עם סילבוס ויתווספו בהדרגה.
        </p>

        <div className="mt-12 flex flex-col gap-6 border-b border-line-strong pb-4 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-wrap gap-x-5 gap-y-2" role="group" aria-label="סינון לפי תחום">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                aria-pressed={cat === c}
                className={`border-b-2 pb-1 text-[15px] transition-colors ${cat === c ? 'border-ice text-fg' : 'border-transparent text-faint hover:text-muted'}`}
              >
                {c}
              </button>
            ))}
          </div>
          <label className="relative block w-full md:w-72">
            <span className="sr-only">חיפוש קורס</span>
            <Search className="pointer-events-none absolute start-0 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="חיפוש קורס או טכנולוגיה"
              className="w-full border-0 border-b border-line bg-transparent py-2 ps-7 text-[15px] text-fg placeholder:text-faint focus:border-ice focus:outline-none"
            />
          </label>
        </div>

        <ol>
          {list.map((c) => {
            const live = c.status === 'live';
            const n = courses.indexOf(c) + 1;
            return (
              <li key={c.id}>
                <a
                  href={live ? href.home() : href.course(c.id)}
                  className="group rule-b grid grid-cols-[2rem_minmax(0,1fr)] gap-x-4 gap-y-2 py-6 md:grid-cols-[3rem_minmax(0,1fr)_11rem]"
                >
                  <span className="tabular pt-1 text-[14px] text-faint">{n}</span>
                  <span className="min-w-0">
                    <span className={`block text-[19px] transition-colors group-hover:text-ice ${live ? 'font-medium text-fg' : 'text-fg/85'}`}>{c.title}</span>
                    <span className="mt-1.5 block max-w-2xl text-[15px] leading-7 text-muted">{c.subtitle}</span>
                    <span dir="ltr" className="mt-2 block truncate text-end text-[13px] text-faint">
                      {c.tags.join(' · ')}
                    </span>
                  </span>
                  <span className="col-start-2 text-[13.5px] leading-6 md:col-start-auto md:text-end">
                    <span className={`block ${live ? 'text-ice' : 'text-faint'}`}>
                      {live ? (done > 0 ? `פתוח · ${Math.round((done / allLessons.length) * 100)}% הושלם` : 'פתוח') : 'בקרוב'}
                    </span>
                    <span className="tabular block text-faint">
                      {c.lessons} שיעורים · כ-{c.hours} שעות
                    </span>
                    <span className="block text-faint">{c.level}</span>
                  </span>
                </a>
              </li>
            );
          })}
        </ol>
        {list.length === 0 && <p className="py-10 text-[15px] text-faint">לא נמצא קורס עבור &quot;{q}&quot;.</p>}
      </main>
    </NotebookShell>
  );
}

export function CourseSoon({ course }: { course: Course }) {
  const live = courses.find((c) => c.status === 'live')!;
  return (
    <NotebookShell>
      <main className={`${container} pb-24 pt-10 md:pt-14`}>
        <a href={href.courses()} className="link-quiet inline-flex items-center gap-1.5 text-[14px]">
          <ArrowRight className="h-3.5 w-3.5" /> לכל הקורסים
        </a>
        <h1 className="display-thin mt-8 max-w-3xl text-[40px] text-fg md:text-[60px]">{course.title}</h1>
        <p className="mt-5 max-w-2xl text-[17px] leading-8 text-muted">{course.subtitle}</p>
        <p className="ink mt-4 text-[16px]">הקורס הזה עוד בכתיבה.</p>

        <div className="mt-14 grid gap-y-14 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:gap-x-20">
          <div className="min-w-0">
            <h2 className="h2-note text-[28px] text-fg">על הקורס</h2>
            <p className="mt-4 text-[16.5px] leading-8 text-muted">{course.description}</p>
            <h2 className="h2-note mt-12 text-[28px] text-fg">תוכנית הלימודים</h2>
            <ol className="mt-5 border-t border-line-strong">
              {course.syllabus.map((s, i) => (
                <li key={s} className="rule-b grid grid-cols-[2.5rem_minmax(0,1fr)] items-baseline py-3.5">
                  <span className="tabular text-[14px] text-faint">{i + 1}</span>
                  <span className="text-[16px] text-fg">{s}</span>
                </li>
              ))}
            </ol>
          </div>
          <aside className="min-w-0">
            <div className="border-t border-line-strong">
              <LedgerRow label="שיעורים מתוכננים" value={course.lessons} />
              <LedgerRow label="היקף משוער" value={`כ-${course.hours} שעות`} />
              <LedgerRow label="רמה" value={course.level} />
              <LedgerRow label="תחום" value={course.category} />
            </div>
            <p dir="ltr" className="mt-5 text-end text-[13.5px] text-faint">
              {course.tags.join(' · ')}
            </p>
            <div className="mt-10 border border-line-strong bg-night p-6">
              <p className="text-[16px] font-medium text-fg">בינתיים: {live.title}</p>
              <p className="mt-2 text-[15px] leading-7 text-muted">המסלול הפתוח נותן את הבסיס לכל שאר הקורסים. כדאי להתחיל בו.</p>
              <a href={href.home()} className="btn-ice mt-5">
                למסלול Full Stack <ArrowLeft className="h-4 w-4" />
              </a>
            </div>
          </aside>
        </div>
      </main>
    </NotebookShell>
  );
}
