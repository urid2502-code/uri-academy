import { ArrowLeft, ArrowRight, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion, type Variants } from 'motion/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { lessonKey, neighbours, trackForModule } from '../content';
import { EASE_OUT } from '../lib/motion';
import { usePersistedFlag } from '../lib/persisted';
import { useProgress } from '../lib/progress-context';
import { href } from '../lib/router';
import type { Lesson, Module } from '../types';
import { SECTIONS } from './lesson-sections';
import { StepContent } from './LessonSteps';

// Reading direction is right-to-left, so "forward" travels leftwards: new content arrives from the left.
const stageVariants: Variants = {
  enter: (direction: number) => ({ opacity: 0, x: -direction * 20 }),
  center: { opacity: 1, x: 0, transition: { duration: 0.4, ease: EASE_OUT } },
  exit: (direction: number) => ({ opacity: 0, x: direction * 20, transition: { duration: 0.15 } }),
};

function isEditable(target: EventTarget | null) {
  const element = target as HTMLElement | null;
  return !!element && (element.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(element.tagName));
}

function LessonComplete({ module, lesson }: { module: Module; lesson: Lesson }) {
  const { next } = neighbours(module.id, lesson.id);
  return (
    <motion.div
      className="lp-complete"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE_OUT }}
    >
      <svg width="56" height="56" viewBox="0 0 56 56" fill="none" aria-hidden className="shrink-0">
        <motion.circle
          cx="28"
          cy="28"
          r="25"
          stroke="var(--brand)"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, ease: EASE_OUT }}
        />
        <motion.path
          d="M18 29.5l7 7 13-15"
          stroke="var(--brand)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.45, ease: EASE_OUT, delay: 0.55 }}
        />
      </svg>
      <div className="min-w-0 flex-1">
        <h3>השיעור הושלם</h3>
        <p>{next ? `ממשיכים ל: ${next.lesson.title}` : 'סיימת את כל השיעורים במסלול.'}</p>
      </div>
      {next ? (
        <a className="btn-ice" href={href.lesson(next.module.id, next.lesson.id)}>
          לשיעור הבא <ArrowLeft className="h-4 w-4" />
        </a>
      ) : (
        <a className="btn-ice" href={href.course(trackForModule(module.id))}>לדף המסלול</a>
      )}
    </motion.div>
  );
}

export function LessonPlayer({ module, lesson }: { module: Module; lesson: Lesson }) {
  const key = lessonKey(module, lesson);
  const { state, isComplete, setLessonStep } = useProgress();
  const complete = isComplete(key);
  const reducedMotion = useReducedMotion();
  const { prev, next } = neighbours(module.id, lesson.id);
  const [direction, setDirection] = useState(1);
  const [minimized, setMinimized] = usePersistedFlag('uri-academy:lesson-stepper-min:v1');
  const stageRef = useRef<HTMLElement>(null);
  const last = SECTIONS.length - 1;
  const saved = state.lessonSteps[key];
  const index = Math.max(0, Math.min(last, saved?.index ?? 0));
  const furthest = Math.max(index, Math.min(last, saved?.furthest ?? 0));
  const section = SECTIONS[index];
  const Icon = section.icon;
  const progress = complete ? 1 : furthest / last;

  const go = useCallback(
    (target: number) => {
      const clamped = Math.max(0, Math.min(last, target));
      if (clamped === index) return;
      setDirection(clamped > index ? 1 : -1);
      setLessonStep(key, clamped);
      // Bring the stage back into view when the reader has scrolled past its top.
      requestAnimationFrame(() => {
        const stage = stageRef.current;
        const root = document.getElementById('main-scroll');
        if (!stage || !root) return;
        const offset = 24;
        // The pinned stepper covers the top of the viewport, so the stage lands just below it.
        const pinned = document.querySelector('.lp-stepper')?.getBoundingClientRect().height ?? 0;
        const top = stage.getBoundingClientRect().top - root.getBoundingClientRect().top;
        if (top < pinned + offset) root.scrollTo({ top: root.scrollTop + top - pinned - offset, behavior: reducedMotion ? 'auto' : 'smooth' });
      });
    },
    [index, last, reducedMotion, key, setLessonStep],
  );

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey || isEditable(event.target)) return;
      // Hebrew reading order: the left arrow moves forward.
      if (event.key === 'ArrowLeft') go(index + 1);
      if (event.key === 'ArrowRight') go(index - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go, index]);

  return (
    <div className="lp">
      <nav className={`lp-stepper ${minimized ? 'is-min' : ''}`} aria-label="שלבי השיעור">
        <div className="lp-stepper-bar">
          <button
            className="lp-stepper-toggle"
            onClick={() => setMinimized((value) => !value)}
            aria-expanded={!minimized}
            aria-label={minimized ? 'הרחבת שלבי השיעור' : 'צמצום שלבי השיעור'}
            title={minimized ? 'הרחבת שלבי השיעור' : 'צמצום שלבי השיעור'}
          >
            {minimized ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          </button>

          <div className="lp-stepper-full">
            <ol className="lp-steps">
              <span className="lp-line" aria-hidden="true">
                <motion.span className="lp-line-fill" initial={false} animate={{ scaleX: progress }} transition={{ duration: 0.5, ease: EASE_OUT }} />
              </span>
              {SECTIONS.map((item, i) => {
                const StepIcon = item.icon;
                const current = i === index;
                const seen = complete || i < furthest || (i === furthest && !current);
                return (
                  <li key={item.id}>
                    <button className={`lp-step ${current ? 'is-current' : ''}`} aria-current={current ? 'step' : undefined} onClick={() => go(i)}>
                      <span className={`lp-node ${seen && !current ? 'is-seen' : ''}`}>
                        {seen && !current ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : <StepIcon className="h-3.5 w-3.5" />}
                      </span>
                      <span className="lp-step-label">{item.label}</span>
                      {current && <motion.span layoutId="lp-step-underline" className="lp-step-underline" transition={{ type: 'spring', stiffness: 420, damping: 38 }} />}
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>

          <div className="lp-stepper-compact">
            <div className="lp-segments-bar">
              {SECTIONS.map((item, i) => (
                <button
                  key={item.id}
                  aria-label={`שלב ${i + 1}: ${item.label}`}
                  aria-current={i === index ? 'step' : undefined}
                  className={complete || i <= furthest ? 'is-seen' : ''}
                  onClick={() => go(i)}
                >
                  <span />
                </button>
              ))}
            </div>
            <p>
              שלב <span className="tabular">{index + 1}</span> מתוך {SECTIONS.length} · {section.label}
            </p>
          </div>
        </div>
      </nav>

      <section ref={stageRef} className="lp-stage" aria-labelledby="lesson-step-title">
        <p className="sr-only" aria-live="polite">
          שלב {index + 1} מתוך {SECTIONS.length}: {section.label}
        </p>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div key={section.id} custom={direction} variants={stageVariants} initial="enter" animate="center" exit="exit">
            <header id={section.id} className="lp-step-head">
              <span className="lp-step-icon" aria-hidden="true">
                <Icon className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <h2 id="lesson-step-title">{section.title}</h2>
                <p>{section.subtitle}</p>
              </div>
            </header>
            <StepContent id={section.id} module={module} lesson={lesson} reveal />
            {section.id === 'sec-intro' && (
              <p className="lp-why">
                <strong>למה זה חשוב לתפקיד: </strong>
                {module.why}
              </p>
            )}
            {section.id === 'sec-quiz' && complete && <LessonComplete module={module} lesson={lesson} />}
          </motion.div>
        </AnimatePresence>

        <nav className="lp-nav" aria-label="מעבר בין שלבי השיעור">
          {index > 0 ? (
            <button className="lp-nav-link" onClick={() => go(index - 1)}>
              <ArrowRight className="h-4 w-4" />
              <span>
                <small>הקודם</small>
                {SECTIONS[index - 1].label}
              </span>
            </button>
          ) : prev ? (
            <a className="lp-nav-link" href={href.lesson(prev.module.id, prev.lesson.id)}>
              <ArrowRight className="h-4 w-4" />
              <span>
                <small>השיעור הקודם</small>
                {prev.lesson.title}
              </span>
            </a>
          ) : (
            <span />
          )}
          {index < last ? (
            <button className="btn-ice lp-next" onClick={() => go(index + 1)}>
              <span>
                <small>הבא</small>
                {SECTIONS[index + 1].label}
              </span>
              <ArrowLeft className="h-4 w-4" />
            </button>
          ) : next ? (
            <a className="btn-ice lp-next" href={href.lesson(next.module.id, next.lesson.id)}>
              <span>
                <small>השיעור הבא</small>
                {next.lesson.title}
              </span>
              <ArrowLeft className="h-4 w-4" />
            </a>
          ) : (
            <a className="btn-ice lp-next" href={href.module(module.id)}>
              <span>סיום המודול</span>
              <ArrowLeft className="h-4 w-4" />
            </a>
          )}
        </nav>
      </section>
    </div>
  );
}
