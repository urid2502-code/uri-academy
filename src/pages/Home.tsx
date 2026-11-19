import { ArrowLeft, Check, ChevronDown, Code2, GitCompareArrows, Network, Play, RotateCcw, Swords } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { Reveal } from '../components/Reveal';
import { SlidingTabs, TabPanel } from '../components/Tabs';
import { ProgressBar } from '../components/ui';
import { getTrack, glossary, lessonKey, type TrackId } from '../content';
import { courses } from '../content/courses';
import { EASE_OUT } from '../lib/motion';
import { courseProgress, useProgress } from '../lib/progress-context';
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
  { title: 'קרא את ההסבר', body: 'כל שיעור מתחיל באנלוגיה מהחיים ובונה את הרעיון צעד אחר צעד.' },
  { title: 'הרץ את הקוד', body: 'העתק את הדוגמה, הרץ אצלך ושנה דברים קטנים כדי לראות מה קורה.' },
  { title: 'פתור את התרגיל', body: 'נסה לבד, השתמש ברמזים, ורק בסוף תסתכל על הפתרון.' },
  { title: 'עבור את המבחן', body: '70% ומעלה מסמנים את השיעור כהושלם. אפשר לנסות כמה פעמים.' },
];

const TABS = [
  { id: 'curriculum', label: 'תוכנית הלימודים' },
  { id: 'skills', label: 'מפת הכישורים' },
  { id: 'guide', label: 'מדריך וכלים' },
] as const;
type TabId = typeof TABS[number]['id'];
const TAB_IDS = TABS.map((item) => item.id);

export function Home({ track }: { track: TrackId }) {
  const { state, reset } = useProgress();
  const { modules, stages, lessons } = getTrack(track);
  const course = courses.find((item) => item.id === track)!;
  const java = track === 'java';
  const skills = java ? modules.map((m) => ({ skill: m.title, detail: m.tagline, modules: [m.id] })) : SKILLS;
  const [confirmReset, setConfirmReset] = useState(false);
  const [tab, setTab] = useState<TabId>('curriculum');
  const { done, pct, last, resume } = courseProgress(state, track);
  const quizzes = lessons.flatMap(({ key }) => state.quiz[key] ? [state.quiz[key]] : []);
  const avgQuiz = quizzes.length ? Math.round(quizzes.reduce((sum, q) => sum + q.best / q.total, 0) / quizzes.length * 100) : 0;
  const exercises = lessons.filter(({ key }) => (state.notes[`challenge:${key}`]?.trim().length ?? 0) > 20).length;

  return (
    <div className="course-page course-dashboard">
      <header className="dashboard-heading">
        <h1>{course.title}</h1>
        <p>{course.subtitle}</p>
        <div className="dashboard-meta">{modules.length} מודולים · {lessons.length} שיעורים · כ-{course.hours} שעות · ללא ידע קודם</div>
      </header>

      <section className="dashboard-continue" aria-label="ההתקדמות שלך">
        <div className="dashboard-next">
          <span>{last ? 'ממשיכים מאיפה שעצרת' : resume ? 'השיעור הראשון שלך' : 'כל השיעורים הושלמו'}</span>
          <h2>{resume ? resume.lesson.title : 'אפשר לחזור לכל שיעור ולתרגל שוב.'}</h2>
          <div className="dashboard-progress"><ProgressBar value={pct} /><span className="tabular">{done}/{lessons.length} הושלמו · {pct}%</span></div>
        </div>
        {resume && <a className="btn-ice" href={href.lesson(resume.module.id, resume.lesson.id)}><Play className="h-4 w-4" />{last ? 'להמשיך ללמוד' : 'להתחיל ללמוד'}</a>}
      </section>

      <SlidingTabs mode="tabs" idBase="course" ariaLabel="מידע על המסלול" items={[...TABS]} value={tab} onChange={(id) => { if (TABS.some((item) => item.id === id)) setTab(id as TabId); }} className="course-tabs" />
      <TabPanel idBase="course" value={tab} order={TAB_IDS} className="course-panel">
        {tab === 'curriculum' && <>
          {([1, 2, 3] satisfies Stage[]).filter((stage) => modules.some((m) => m.stage === stage)).map((stage) => <section key={stage} className="dashboard-stage" aria-labelledby={`dashboard-stage-${stage}`}>
          <h2 id={`dashboard-stage-${stage}`}>{stages[stage].title}</h2>
          <p>{stages[stage].subtitle}</p>
          <div key={stage} className="curriculum-list">
            {modules.filter((m) => m.stage === stage).map((m) => {
              const completed = m.lessons.filter((lesson) => state.completed.includes(lessonKey(m, lesson))).length;
              return (
                <details key={m.id} className="curriculum-module" name="course-modules" open={m.id === (resume?.module.id ?? modules[0].id)}>
                  <summary>
                    <span className="curriculum-number">{completed === m.lessons.length ? <Check className="h-4 w-4" /> : m.number}</span>
                    <span className="min-w-0 flex-1"><strong>{m.short}</strong><span className="mt-1 block text-[13px] text-faint">{m.lessons.length} שיעורים · {m.lessons.reduce((sum, l) => sum + l.minutes, 0)} דקות</span></span>
                    <span className="tabular hidden text-[12px] text-faint sm:block">{completed}/{m.lessons.length}</span><ChevronDown className="curriculum-chevron h-4 w-4 shrink-0" />
                  </summary>
                  <div className="curriculum-module-content">
                    <p className="mb-3 text-[14px] leading-7 text-muted">{m.tagline}</p>
                    {m.lessons.map((lesson) => {
                      const complete = state.completed.includes(lessonKey(m, lesson));
                      return <a key={lesson.id} className="curriculum-lesson" href={href.lesson(m.id, lesson.id)}><span className={`lesson-dot ${complete ? 'is-complete' : ''}`}>{complete && <Check className="h-3 w-3" />}</span><span className="min-w-0 flex-1">{lesson.title}</span><span className="tabular shrink-0 text-[12px] text-faint">{lesson.minutes} דק׳</span></a>;
                    })}
                    <a className="course-text-link mt-4" href={href.module(m.id)}>לסקירת המודול<ArrowLeft className="h-3.5 w-3.5" /></a>
                  </div>
                </details>
              );
            })}
          </div>
          </section>)}
        </>}
        {tab === 'skills' && <div className="course-skill-list">{skills.map((skill, skillIndex) => {
          const related = modules.filter((m) => skill.modules.includes(m.id));
          const lessons = related.flatMap((m) => m.lessons.map((l) => lessonKey(m, l)));
          const progress = lessons.filter((key) => state.completed.includes(key)).length / lessons.length * 100;
          return <Reveal key={skill.skill} index={skillIndex}><div className="course-skill-row"><div><h2>{skill.skill}</h2><p>{skill.detail}</p></div><div className="flex flex-wrap gap-3">{related.map((m) => <a className="course-text-link text-[12px]" key={m.id} href={href.module(m.id)}>מודול {m.number}</a>)}</div><ProgressBar value={progress} /></div></Reveal>;
        })}</div>}
        {tab === 'guide' && <>
          <ol className="course-guide">{HOW_TO.map((item, index) => <motion.li key={item.title} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: EASE_OUT, delay: index * 0.06 }}><span className="curriculum-number">{index + 1}</span><div><h2>{item.title}</h2><p>{item.body}</p></div></motion.li>)}</ol>
      <section className="course-tools" aria-label="כלים ותרגול">
        {!java && <><a href={href.simulator()}><Network className="h-4 w-4" /><span>סימולטור המערכת</span><ArrowLeft className="h-3.5 w-3.5" /></a>
        <a href={href.comparisons()}><GitCompareArrows className="h-4 w-4" /><span>קוד מתחיל מול מקצוען</span><ArrowLeft className="h-3.5 w-3.5" /></a>
        <a href={href.interview()}><Swords className="h-4 w-4" /><span>הכנה לראיון</span><ArrowLeft className="h-3.5 w-3.5" /></a></>}
        {java && <a href={href.lesson('java-basics', 'l1')}><Code2 className="h-4 w-4" /><span>התקנת JDK 21 והרצה</span><ArrowLeft className="h-3.5 w-3.5" /></a>}
        <a href={href.glossary()}><Code2 className="h-4 w-4" /><span>{glossary.length} מונחים במילון</span><ArrowLeft className="h-3.5 w-3.5" /></a>
      </section>
      <details className="dashboard-results">
        <summary>הישגים וניהול ההתקדמות<ChevronDown className="h-4 w-4" /></summary>
        <dl><div><dt>ממוצע מבחנים</dt><dd>{quizzes.length ? `${avgQuiz}%` : 'טרם נפתרו מבחנים'}</dd></div><div><dt>תרגילים שפתרת</dt><dd>{exercises}</dd></div></dl>
      <div className="course-reset">
        {confirmReset ? <><span>למחוק את ההתקדמות, הציונים והפתרונות בכל המסלולים?</span><button onClick={() => { reset(); setConfirmReset(false); }} className="text-rose-400">כן, אפס</button><button onClick={() => setConfirmReset(false)}>ביטול</button></> : <button onClick={() => setConfirmReset(true)}><RotateCcw className="h-3.5 w-3.5" />איפוס התקדמות בכל המסלולים</button>}
      </div>
      </details>
      </>}
      </TabPanel>
    </div>
  );
}
