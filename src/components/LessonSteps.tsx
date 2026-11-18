import { motion, useReducedMotion } from 'motion/react';
import { Fragment, useState } from 'react';
import { lessonKey } from '../content';
import { EASE_OUT } from '../lib/motion';
import type { Lesson, Module } from '../types';
import { Challenge } from './Challenge';
import { CodeBlock } from './CodeBlock';
import { FailureModes } from './FailureModes';
import { FlowDiagram } from './FlowDiagram';
import { SECTIONS, type SectionId } from './lesson-sections';
import { Markdown } from './Markdown';
import { Quiz } from './Quiz';
import { Reveal } from './Reveal';
import { SectionHeader } from './ui';

interface StepProps {
  module: Module;
  lesson: Lesson;
  /** The guided player animates its content in; the long-scroll reader keeps it static. */
  reveal?: boolean;
}

function CodeStep({ lesson, reveal }: Pick<StepProps, 'lesson' | 'reveal'>) {
  const reducedMotion = useReducedMotion();
  const [codeTab, setCodeTab] = useState(0);
  const code = lesson.code[codeTab] ?? lesson.code[0];

  return (
    <div className="space-y-5">
      {lesson.code.length > 1 && (
        <div className="flex flex-wrap gap-2" role="group" aria-label="דוגמאות קוד">
          {lesson.code.map((c, i) => (
            <button
              key={c.title}
              onClick={() => setCodeTab(i)}
              aria-pressed={i === codeTab}
              className={`rounded-lg border px-3.5 py-1.5 text-[13px] transition ${
                i === codeTab ? 'border-brand bg-brand/10 font-semibold text-brand' : 'border-line text-muted hover:text-fg'
              }`}
            >
              {c.title}
            </button>
          ))}
        </div>
      )}
      {code &&
        (reveal && !reducedMotion ? (
          // The editor "prints" top to bottom, so attention follows the code in reading order.
          <motion.div
            key={code.title}
            initial={{ clipPath: 'inset(0 0 100% 0)', opacity: 0.4 }}
            animate={{ clipPath: 'inset(0 0 0% 0)', opacity: 1 }}
            transition={{ duration: 0.75, ease: EASE_OUT }}
          >
            <CodeBlock code={code.code} lang={code.lang} title={code.title} maxHeight={760} />
          </motion.div>
        ) : (
          <CodeBlock key={code.title} code={code.code} lang={code.lang} title={code.title} maxHeight={760} />
        ))}
      <div className="card p-6">
        <Markdown source={lesson.codeNotes} reveal={reveal} />
      </div>
    </div>
  );
}

function TermsStep({ lesson, reveal }: Pick<StepProps, 'lesson' | 'reveal'>) {
  return (
    <dl className="lesson-terms">
      {lesson.keyTerms.map((t, i) => {
        const term = (
          <>
            <dt className="flex flex-wrap items-baseline gap-x-2">
              <span dir="ltr" className="text-[16px] font-bold text-fg">
                {t.term}
              </span>
              {t.he && <span className="text-[13px] text-faint">{t.he}</span>}
            </dt>
            <dd className="mt-2 text-[15px] leading-7 text-muted">{t.def}</dd>
          </>
        );
        return reveal ? <Reveal key={t.term} index={i} className="lesson-term">{term}</Reveal> : <div key={t.term} className="lesson-term">{term}</div>;
      })}
    </dl>
  );
}

export function StepContent({ id, module, lesson, reveal = false }: StepProps & { id: SectionId }) {
  const key = lessonKey(module, lesson);
  switch (id) {
    case 'sec-intro':
      return <Markdown source={lesson.intro} reveal={reveal} />;
    case 'sec-how':
      return (
        <div className="space-y-5">
          {lesson.diagram && <FlowDiagram spec={lesson.diagram} autoPlay={reveal} />}
          <Markdown source={lesson.deepDive} reveal={reveal} />
        </div>
      );
    case 'sec-code':
      return <CodeStep lesson={lesson} reveal={reveal} />;
    case 'sec-mistakes':
      return <FailureModes items={lesson.failureModes} reveal={reveal} />;
    case 'sec-terms':
      return <TermsStep lesson={lesson} reveal={reveal} />;
    case 'sec-exercise':
      return <Challenge key={`challenge-${key}`} lessonId={key} challenge={lesson.challenge} />;
    case 'sec-quiz':
      return <Quiz key={`quiz-${key}`} lessonId={key} questions={lesson.quiz} />;
    default:
      return null;
  }
}

/** All seven steps in one scrolling document: the reader used by Focus Mode. */
export function LessonBody({ module, lesson }: StepProps) {
  return (
    <>
      {SECTIONS.map((section, index) => {
        const Icon = section.icon;
        return (
          <Fragment key={section.id}>
            <SectionHeader id={section.id} step={`שלב ${index + 1}`} title={section.title} subtitle={section.subtitle} icon={<Icon className="h-5 w-5" />} />
            <StepContent id={section.id} module={module} lesson={lesson} />
          </Fragment>
        );
      })}
    </>
  );
}
