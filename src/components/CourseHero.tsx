import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { AnimatePresence, animate, motion, useMotionValue, useReducedMotion, useTransform, type MotionValue, type PanInfo } from 'motion/react';
import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { isTrackId } from '../content';
import { courses } from '../content/courses';
import { courseProgress, useProgress } from '../lib/progress-context';
import { href } from '../lib/router';
import { courseVisual } from './course-visuals';

// Start the live course in the middle so wide screens have previews on both sides.
const galleryCourses = [...courses.slice(-5), ...courses.slice(0, -5)];
const GAP = 24;
const INITIAL_COURSE = galleryCourses.findIndex((course) => course.status === 'live');
const wrap = (index: number) => ((index % galleryCourses.length) + galleryCourses.length) % galleryCourses.length;

function LoopSlot({ index, offset, center, step, children }: {
  index: number;
  offset: MotionValue<number>;
  center: number;
  step: number;
  children: ReactNode;
}) {
  // Recycle each real card only when it is on the far side of the loop, offscreen.
  const x = useTransform(offset, (value) => Math.round(((center - value) / step - index) / galleryCourses.length) * galleryCourses.length * step);
  return <motion.div className="shrink-0" style={{ x }}>{children}</motion.div>;
}

export function CourseHero() {
  const { state } = useProgress();
  const reducedMotion = useReducedMotion();
  const [position, setPosition] = useState(INITIAL_COURSE);
  const activeIndex = wrap(position);
  const [geometry, setGeometry] = useState({ width: 0, cardWidth: 300 });
  const viewportRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const suppressClickUntil = useRef(0);
  const x = useMotionValue(0);
  const course = galleryCourses[activeIndex];
  const step = geometry.cardWidth + GAP;
  const center = (geometry.width - geometry.cardWidth) / 2;
  const selectedOffset = center - position * step;
  const progress = isTrackId(course.id) ? courseProgress(state, course.id) : null;
  const target = progress?.resume;
  const actionHref = target ? href.lesson(target.module.id, target.lesson.id) : href.course(course.id);

  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    const card = cardRefs.current[0];
    if (!viewport || !card) return;
    const measure = () => setGeometry({ width: viewport.clientWidth, cardWidth: card.offsetWidth });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(viewport);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const controls = animate(x, selectedOffset, reducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 260, damping: 32 });
    return () => controls.stop();
  }, [x, selectedOffset, reducedMotion]);

  function select(index: number, focus = false) {
    const next = wrap(index);
    setPosition((current) => {
      const distance = next - wrap(current);
      return current + (distance > galleryCourses.length / 2 ? distance - galleryCourses.length
        : distance < -galleryCourses.length / 2 ? distance + galleryCourses.length : distance);
    });
    if (focus) cardRefs.current[next]?.focus({ preventScroll: true });
  }

  function move(delta: number, focus = false) {
    setPosition((current) => current + delta);
    if (focus) cardRefs.current[wrap(position + delta)]?.focus({ preventScroll: true });
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      move(event.key === 'ArrowRight' ? 1 : -1, true);
      return;
    }
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? galleryCourses.length - 1 : null;
    if (next === null) return;
    event.preventDefault();
    select(next, true);
  }

  function onDragEnd(_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) {
    suppressClickUntil.current = performance.now() + 300;
    const distance = info.offset.x;
    const intent = Math.abs(distance) > 40 ? distance : Math.abs(info.velocity.x) > 400 ? info.velocity.x / 5 : 0;
    if (intent === 0) {
      animate(x, selectedOffset, reducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 260, damping: 32 });
    } else {
      move(-Math.sign(intent) * Math.max(1, Math.round(Math.abs(distance) / step)));
    }
  }

  return (
    <section className="course-hero" aria-label="גילוי מסלולי הלימוד">
      <div className="hero-backdrops" aria-hidden="true">
        <AnimatePresence initial={false}>
          <motion.img
            key={course.id}
            src={courseVisual(course, !reducedMotion)}
            alt=""
            className="hero-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.36 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.65, ease: 'easeOut' }}
          />
        </AnimatePresence>
        <span className="hero-aurora" />
      </div>
      <div className="hero-copy">
        <h1 className="hero-title">הכישורים של מחר.<br />מתחילים כאן.</h1>
        <p>ללמוד. לבנות. להבין לעומק.<br className="sm:hidden" /> מסלולי לימוד בעברית, מהיסודות ועד הקוד שבאמת עובד.</p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-4">
          <a className="btn-ice btn-ice-lg" href={actionHref}>
            {progress ? progress.last || progress.done ? 'להמשיך ללמוד' : 'מתחילים ללמוד' : 'לצפייה בסילבוס'}
            <ArrowLeft className="h-4 w-4" />
          </a>
          <a href={href.courses()} className="hero-catalog-link">כל הקורסים</a>
        </div>
        <p className="hero-assurance"><Check className="h-3.5 w-3.5" />בלי הרשמה. בקצב שלך.</p>
      </div>

      <div className="gallery-viewport" ref={viewportRef}>
        <motion.div
          className="gallery-track"
          style={{ x }}
          dir="ltr"
          role="tablist"
          aria-label="בחירת קורס — ניתן לגרור או להשתמש במקשי החצים"
          onKeyDown={onKeyDown}
          drag="x"
          dragMomentum={false}
          onDragStart={() => { x.stop(); suppressClickUntil.current = Infinity; }}
          onDragEnd={onDragEnd}
        >
          {galleryCourses.map((item, index) => {
            const active = index === activeIndex;
            return (
              <LoopSlot key={item.id} index={index} offset={x} center={center} step={step}>
              <button
                ref={(el) => { cardRefs.current[index] = el; }}
                id={`gallery-tab-${item.id}`}
                role="tab"
                aria-selected={active}
                aria-controls="gallery-course-details"
                tabIndex={active ? 0 : -1}
                className={`gallery-card ${active ? 'is-active' : ''}`}
                dir="rtl"
                onClick={() => { if (performance.now() >= suppressClickUntil.current) select(index); }}
              >
                <span className="gallery-image">
                  <img src={courseVisual(item)} alt="" width="1000" height="640" draggable={false} loading={Math.abs(index - activeIndex) < 2 ? 'eager' : 'lazy'} decoding="async" />
                </span>
                <span className="gallery-card-body">
                  <span className={`gallery-status ${item.status === 'live' ? 'is-live' : ''}`}>{item.status === 'live' ? 'זמין ללמידה' : 'בקרוב · סילבוס פתוח'}</span>
                  <span className="gallery-title">{item.title}</span>
                  <span className="gallery-description">{item.subtitle}</span>
                </span>
              </button>
              </LoopSlot>
            );
          })}
        </motion.div>
      </div>

      <div className="gallery-controls" dir="ltr">
        <button className="gallery-arrow" onClick={() => move(-1)} aria-label="הקורס הקודם"><ArrowLeft className="h-4 w-4" /></button>
        <div className="gallery-pagination" aria-label="מעבר לקורס">
          {galleryCourses.map((item, i) => <button key={item.id} onClick={() => select(i)} aria-label={`בחירת ${item.title}`} aria-current={i === activeIndex ? 'true' : undefined}><span /></button>)}
        </div>
        <button className="gallery-arrow" onClick={() => move(1)} aria-label="הקורס הבא"><ArrowRight className="h-4 w-4" /></button>
      </div>
      <div id="gallery-course-details" role="tabpanel" aria-labelledby={`gallery-tab-${course.id}`} className="gallery-caption">
        <p aria-live="polite">{course.title} <span>· {activeIndex + 1} / {galleryCourses.length}</span></p>
      </div>
    </section>
  );
}
