import { ArrowLeft, Check, Clock3, Play } from 'lucide-react';
import { CourseHeader } from '../components/CourseHeader';
import { moduleVisual } from '../components/course-visuals';
import { ProgressBar } from '../components/ui';
import { LEVEL_LABEL, lessonKey, STAGES } from '../content';
import { useProgress } from '../lib/progress-context';
import { href } from '../lib/router';
import type { Module } from '../types';

export function ModulePage({ module }: { module: Module }) {
  const { isComplete, state } = useProgress();
  const done = module.lessons.filter((l) => isComplete(lessonKey(module, l))).length;
  const minutes = module.lessons.reduce((sum, l) => sum + l.minutes, 0);
  const firstOpen = module.lessons.find((l) => !isComplete(lessonKey(module, l))) ?? module.lessons[0];

  return (
    <div className="course-page">
      <nav className="course-breadcrumb" aria-label="מיקום במסלול"><a href={href.home()}>מסלול Full Stack</a><ArrowLeft className="h-3 w-3" /><span>מודול {module.number}</span></nav>
      <CourseHeader
        title={module.title}
        description={module.tagline}
        image={(motion) => moduleVisual(module, motion)}
        meta={<><span>{STAGES[module.stage].title}</span><span>{module.lessons.length} שיעורים</span><span><Clock3 className="h-4 w-4" />{minutes} דקות</span></>}
        actions={<a className="btn-ice" href={href.lesson(module.id, firstOpen.id)}><Play className="h-4 w-4" />{done === 0 ? 'להתחיל את המודול' : done === module.lessons.length ? 'לחזור על המודול' : 'להמשיך ללמוד'}</a>}
      />
      <div className="course-detail-grid">
        <section>
          <div className="mb-5 flex items-center justify-between gap-4"><h2 className="text-[20px] font-semibold text-fg">השיעורים במודול</h2><span className="tabular text-[12px] text-faint">{done}/{module.lessons.length} הושלמו</span></div>
          <ol className="module-lessons">
            {module.lessons.map((lesson, index) => {
              const key = lessonKey(module, lesson);
              const complete = isComplete(key);
              const quiz = state.quiz[key];
              return <li key={lesson.id}><a href={href.lesson(module.id, lesson.id)}>
                <span className={`curriculum-number ${complete ? 'is-complete' : ''}`}>{complete ? <Check className="h-4 w-4" /> : index + 1}</span>
                <div className="min-w-0 flex-1"><h3>{lesson.title}</h3><p>{lesson.summary}</p><div className="course-meta"><span>{LEVEL_LABEL[lesson.level]}</span><span>{lesson.minutes} דקות</span>{quiz && <span>מבחן: {quiz.best}/{quiz.total}</span>}{complete && <span className="text-brand">הושלם</span>}</div></div>
                <ArrowLeft className="mt-2 h-4 w-4 shrink-0 text-faint" />
              </a></li>;
            })}
          </ol>
        </section>
        <aside className="course-context">
          <section><h2>ההתקדמות שלך</h2><div className="my-3 flex justify-between text-[13px] text-muted"><span>{done} שיעורים הושלמו</span><span className="tabular text-brand">{Math.round(done / module.lessons.length * 100)}%</span></div><ProgressBar value={done / module.lessons.length * 100} /></section>
          <section><h2>מה תדע בסוף</h2><ul>{module.outcomes.map((outcome) => <li key={outcome}><Check className="mt-1 h-3.5 w-3.5 shrink-0 text-brand" /><span>{outcome}</span></li>)}</ul></section>
          <section><h2>למה זה חשוב לתפקיד</h2><p>{module.why}</p></section>
        </aside>
      </div>
    </div>
  );
}
