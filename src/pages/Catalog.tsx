import { ArrowLeft, ArrowRight, BookOpen, Clock3, LockKeyhole, Search } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useMemo, useState } from 'react';
import { LedgerRow, MarketingShell } from '../components/MarketingShell';
import { CourseCard } from '../components/CourseCard';
import { CourseHeader } from '../components/CourseHeader';
import { courseVisual } from '../components/course-visuals';
import { SlidingTabs } from '../components/Tabs';
import { allLessons } from '../content';
import { CATEGORIES, courses, type Course } from '../content/courses';
import { EASE_OUT } from '../lib/motion';
import { useProgress } from '../lib/progress-context';
import { href } from '../lib/router';

const container = 'mx-auto max-w-[1680px] px-5 md:px-8';

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
    <MarketingShell>
      <main className={`${container} pb-24 pt-14 md:pt-20`}>
        <h1 className="display-thin text-[44px] text-fg md:text-[68px]">קטלוג הקורסים.</h1>
        <p className="mt-5 text-[17px] leading-8 text-muted">
          {courses.length} קורסים במקום אחד. {liveCount === 1 ? 'אחד פתוח ומלא' : `${liveCount} פתוחים`}, והשאר מתוכננים עם סילבוס ויתווספו בהדרגה.
        </p>

        <div className="mt-12 flex flex-col gap-6 border-b border-line-strong pb-0 md:flex-row md:items-end md:justify-between">
          <SlidingTabs
            mode="filter"
            idBase="catalog"
            ariaLabel="סינון לפי תחום"
            className="catalog-filters"
            value={cat}
            onChange={(id) => setCat(id as (typeof CATEGORIES)[number])}
            items={CATEGORIES.map((c) => ({ id: c, label: c }))}
          />
          <label className="relative mb-3 block w-full md:w-72">
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

        <motion.div layout className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence mode="popLayout" initial>
            {list.map((course, index) => (
              <motion.div
                key={course.id}
                layout
                className="h-full [&>.course-card]:h-full"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.4, ease: EASE_OUT, delay: Math.min(index * 0.04, 0.32) }}
              >
                <CourseCard course={course} progress={course.status === 'live' ? Math.round(done / allLessons.length * 100) : 0} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        {list.length === 0 && <p className="py-10 text-[15px] text-faint">לא נמצא קורס עבור &quot;{q}&quot;.</p>}
      </main>
    </MarketingShell>
  );
}

export function CourseSoon({ course }: { course: Course }) {
  const live = courses.find((c) => c.status === 'live')!;
  return (
    <MarketingShell>
      <main className="course-page course-preview">
        <a href={href.courses()} className="course-breadcrumb">
          <ArrowRight className="h-3.5 w-3.5" /> לכל הקורסים
        </a>
        <CourseHeader
          title={course.title}
          description={course.subtitle}
          image={(motion) => courseVisual(course, motion)}
          meta={<><span><BookOpen className="h-4 w-4" />{course.lessons} שיעורים מתוכננים</span><span><Clock3 className="h-4 w-4" />כ-{course.hours} שעות</span><span>{course.level}</span></>}
          actions={<span className="course-preview-status"><LockKeyhole className="h-3.5 w-3.5" />בקרוב — הקורס עוד בכתיבה</span>}
        />

        <div className="course-detail-grid">
          <div className="min-w-0">
            <h2 className="text-[20px] font-semibold text-fg">על הקורס</h2>
            <p className="mb-9 mt-3 text-[16px] leading-8 text-muted">{course.description}</p>
            <h2 className="text-[20px] font-semibold text-fg">תוכנית הלימודים המתוכננת</h2>
            <ol className="preview-syllabus mt-5 border-t border-line">
              {course.syllabus.map((s, i) => (
                <li key={s}>
                  <span className="curriculum-number">{i + 1}</span>
                  <span className="min-w-0 flex-1 text-[15px] leading-7 text-fg">{s}</span>
                  <LockKeyhole className="h-3.5 w-3.5 shrink-0 text-faint" aria-label="עדיין לא זמין" />
                </li>
              ))}
            </ol>
          </div>
          <aside className="course-context">
            <section>
              <h2>פרטי הקורס</h2>
              <LedgerRow label="שיעורים מתוכננים" value={course.lessons} />
              <LedgerRow label="היקף משוער" value={`כ-${course.hours} שעות`} />
              <LedgerRow label="רמה" value={course.level} />
              <LedgerRow label="תחום" value={course.category} />
            <p dir="ltr" className="mt-5 text-end text-[13px] leading-7 text-faint">
              {course.tags.join(' · ')}
            </p>
            </section>
            <section>
              <h2>בינתיים, אפשר להתחיל כאן</h2>
              <a className="mt-3 block text-[16px] font-semibold text-fg hover:text-brand" href={href.home()}>{live.title}</a>
              <p className="mt-2 text-[15px] leading-7 text-muted">המסלול הפתוח נותן את הבסיס לכל שאר הקורסים. כדאי להתחיל בו.</p>
              <a href={href.home()} className="btn-ice mt-5">
                למסלול Full Stack <ArrowLeft className="h-4 w-4" />
              </a>
            </section>
          </aside>
        </div>
      </main>
    </MarketingShell>
  );
}
