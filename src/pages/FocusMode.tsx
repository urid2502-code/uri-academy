import { ArrowLeft, ArrowRight, Check, CheckCircle2, ChevronDown, Circle, Milestone, NotebookPen, PanelLeftClose, PanelLeftOpen, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { LessonBody } from '../components/LessonSteps';
import { SlidingTabs, TabPanel } from '../components/Tabs';
import { SECTIONS } from '../components/lesson-sections';
import { allLessons, lessonKey, modules, neighbours } from '../content';
import { useProgress } from '../lib/progress-context';
import { href } from '../lib/router';
import type { Lesson, Module } from '../types';

type PanelTab = 'notes' | 'timeline';

export function FocusMode({ module, lesson }: { module: Module; lesson: Lesson }) {
  const key = lessonKey(module, lesson);
  const { isComplete, setComplete, visit } = useProgress();
  const complete = isComplete(key);
  const { prev, next } = neighbours(module.id, lesson.id);
  const scroller = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(0);
  const [section, setSection] = useState(0);
  const [panelOpen, setPanelOpen] = useState(() => window.matchMedia('(min-width: 1024px)').matches);
  const [tab, setTab] = useState<PanelTab>('notes');
  const lessonNumber = allLessons.findIndex((item) => item.key === key) + 1;

  useEffect(() => {
    visit(module.id, lesson.id);
  }, [module.id, lesson.id, visit]);

  useEffect(() => {
    const root = scroller.current;
    if (!root) return;
    const onScroll = () => {
      const max = root.scrollHeight - root.clientHeight;
      setScrolled(max > 0 ? Math.min(1, Math.max(0, root.scrollTop / max)) : 0);
      // The current step is the last heading above 30% of the viewport; the final step also wins at the end.
      const line = root.getBoundingClientRect().top + root.clientHeight * 0.3;
      let current = 0;
      SECTIONS.forEach((item, index) => {
        const element = document.getElementById(item.id);
        if (element && element.getBoundingClientRect().top <= line) current = index;
      });
      setSection(max > 0 && root.scrollTop >= max - 2 ? SECTIONS.length - 1 : current);
    };
    onScroll();
    root.addEventListener('scroll', onScroll, { passive: true });
    return () => root.removeEventListener('scroll', onScroll);
  }, [lesson.id]);

  useEffect(() => {
    if (!panelOpen || window.matchMedia('(min-width: 1024px)').matches) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setPanelOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [panelOpen]);

  const percent = Math.round(scrolled * 100);

  return (
    <div className="focus-shell">
      <header className="focus-bar">
        <a href={href.lesson(module.id, lesson.id)} className="focus-exit" aria-label="יציאה ממצב מיקוד">
          <X className="h-4 w-4" />
          <span className="hidden sm:inline">יציאה</span>
        </a>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-medium text-fg">{lesson.title}</p>
          <p className="truncate text-[12px] text-faint">
            {module.short} · שיעור {lessonNumber} מתוך {allLessons.length} · קטע {section + 1} מתוך {SECTIONS.length}
          </p>
        </div>
        <button
          onClick={() => setComplete(key, !complete)}
          aria-pressed={complete}
          aria-label={complete ? 'השיעור הושלם' : 'סמן כהושלם'}
          className={`focus-complete ${complete ? 'is-complete' : ''}`}
        >
          {complete ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
          <span className="hidden sm:inline">{complete ? 'הושלם' : 'סמן כהושלם'}</span>
        </button>
        <button
          onClick={() => setPanelOpen((open) => !open)}
          aria-expanded={panelOpen}
          aria-controls="focus-panel"
          aria-label={panelOpen ? 'הסתר את לוח ההערות והציר' : 'הצג את לוח ההערות והציר'}
          className="focus-icon-button"
        >
          {panelOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
        </button>
      </header>
      <div
        className="focus-progress"
        role="progressbar"
        aria-label="התקדמות בשיעור"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
      >
        <span style={{ transform: `scaleX(${scrolled})` }} />
      </div>

      <div className="focus-layout">
        <main id="main-scroll" ref={scroller} className="focus-scroll">
          <article className="focus-article">
            <header className="focus-title">
              <h1>{lesson.title}</h1>
              <p>{lesson.summary}</p>
            </header>
            <LessonBody module={module} lesson={lesson} />
            <nav className="focus-lesson-nav" aria-label="מעבר בין שיעורים">
              {prev ? (
                <a href={href.focus(prev.module.id, prev.lesson.id)}>
                  <span><ArrowRight className="h-3.5 w-3.5" /> השיעור הקודם</span>
                  <strong>{prev.lesson.title}</strong>
                </a>
              ) : (
                <span />
              )}
              {next && (
                <a href={href.focus(next.module.id, next.lesson.id)} className="is-next">
                  <span>השיעור הבא <ArrowLeft className="h-3.5 w-3.5" /></span>
                  <strong>{next.lesson.title}</strong>
                </a>
              )}
            </nav>
          </article>
        </main>

        {panelOpen && <button className="focus-backdrop" aria-label="סגירת הלוח" onClick={() => setPanelOpen(false)} />}
        <aside id="focus-panel" className={`focus-panel ${panelOpen ? 'is-open' : ''}`} aria-label="הערות וציר שליטה">
          <div className="focus-tabs">
            <SlidingTabs
              mode="tabs"
              idBase="focus-side"
              ariaLabel="לוח צד"
              className="focus-tablist"
              value={tab}
              onChange={(id) => setTab(id as PanelTab)}
              items={[
                { id: 'notes', label: 'Deep Notes', icon: <NotebookPen className="h-4 w-4" /> },
                { id: 'timeline', label: 'Timeline of Mastery', icon: <Milestone className="h-4 w-4" /> },
              ]}
            />
            <button className="focus-close" aria-label="סגירת הלוח" onClick={() => setPanelOpen(false)}>
              <X className="h-4 w-4" />
            </button>
          </div>
          <TabPanel idBase="focus-side" value={tab} order={['notes', 'timeline']} className="focus-tabpanel">
            {tab === 'notes' ? <DeepNotes noteKey={`deep:${key}`} /> : <MasteryTimeline currentModule={module} currentLesson={lesson} />}
          </TabPanel>
        </aside>
      </div>
    </div>
  );
}

function DeepNotes({ noteKey }: { noteKey: string }) {
  const { state, setNote } = useProgress();
  const value = state.notes[noteKey] ?? '';
  const words = value.trim() ? value.trim().split(/\s+/).length : 0;
  return (
    <div className="flex h-full flex-col">
      <label htmlFor="deep-notes" className="text-[14px] font-medium text-fg">הערות לשיעור הזה</label>
      <p className="mt-1 text-[12px] leading-6 text-faint">מה הבנת, מה עדיין לא ברור, ומה תרצה לנסות אחר כך. נשמר אוטומטית במכשיר הזה.</p>
      <textarea
        id="deep-notes"
        value={value}
        onChange={(event) => setNote(noteKey, event.target.value)}
        placeholder="כתוב כאן במילים שלך…"
        className="focus-notes"
      />
      <p className="tabular mt-2 text-[12px] text-faint" aria-live="polite">{words} מילים</p>
    </div>
  );
}

function MasteryTimeline({ currentModule, currentLesson }: { currentModule: Module; currentLesson: Lesson }) {
  const { state } = useProgress();
  const [open, setOpen] = useState<Set<string>>(() => new Set([currentModule.id]));
  const toggle = (id: string) =>
    setOpen((previous) => {
      const next = new Set(previous);
      if (!next.delete(id)) next.add(id);
      return next;
    });

  return (
    <ol className="mastery-timeline">
      {modules.map((module) => {
        const finished = module.lessons.filter((item) => state.completed.includes(lessonKey(module, item))).length;
        const expanded = open.has(module.id);
        const done = finished === module.lessons.length;
        return (
          <li key={module.id} className={`mastery-module ${done ? 'is-complete' : ''} ${module.id === currentModule.id ? 'is-current' : ''}`}>
            <button aria-expanded={expanded} aria-controls={`mastery-${module.id}`} onClick={() => toggle(module.id)}>
              <span className="mastery-node">{done ? <Check className="h-3 w-3" strokeWidth={3} /> : module.number}</span>
              <span className="min-w-0 flex-1 text-start">{module.short}</span>
              <span className="tabular text-[12px] text-faint">{finished}/{module.lessons.length}</span>
              <ChevronDown className={`h-4 w-4 shrink-0 text-faint transition-transform ${expanded ? 'rotate-180' : ''}`} />
            </button>
            {expanded && (
              <ol id={`mastery-${module.id}`}>
                {module.lessons.map((item) => {
                  const itemKey = lessonKey(module, item);
                  const complete = state.completed.includes(itemKey);
                  const current = module.id === currentModule.id && item.id === currentLesson.id;
                  return (
                    <li key={item.id}>
                      <a href={href.focus(module.id, item.id)} aria-current={current ? 'step' : undefined} className={current ? 'is-current' : ''}>
                        <span className={`mastery-dot ${complete ? 'is-complete' : ''}`}>{complete && <Check className="h-2.5 w-2.5" strokeWidth={3} />}</span>
                        <span className="min-w-0 flex-1">{item.title}</span>
                      </a>
                    </li>
                  );
                })}
              </ol>
            )}
          </li>
        );
      })}
    </ol>
  );
}
