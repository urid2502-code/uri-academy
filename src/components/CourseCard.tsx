import { ArrowLeft, BookOpen, Clock3, Gauge } from 'lucide-react';
import type { Course } from '../content/courses';
import { href } from '../lib/router';
import { courseVisual } from './course-visuals';

export function CourseCard({ course, progress = 0 }: { course: Course; progress?: number }) {
  const live = course.status === 'live';
  return (
    <a href={live ? href.home() : href.course(course.id)} className={`course-card group ${live ? 'course-card-live' : ''}`}>
      <img className="course-cover" src={courseVisual(course)} alt="" width="1000" height="640" loading="lazy" decoding="async" />
      <p className={`self-start text-[13px] ${live ? 'course-status' : 'text-faint'}`}>{live ? 'זמין ללמידה' : 'בקרוב'}</p>
      <h3 className="mt-3 text-[20px] font-semibold leading-snug text-fg transition-colors group-hover:text-ice">{course.title}</h3>
      <p className="course-card-subtitle">{course.subtitle}</p>
      <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 pt-5 text-[13px] text-faint">
        <span className="flex items-center gap-1.5"><Gauge className="h-3.5 w-3.5" />{course.level}</span>
        <span className="flex items-center gap-1.5"><BookOpen className="h-3.5 w-3.5" />{course.lessons} שיעורים</span>
        <span className="flex items-center gap-1.5"><Clock3 className="h-3.5 w-3.5" />כ-{course.hours} שעות</span>
        <ArrowLeft className="ms-auto h-4 w-4 text-ice transition-transform group-hover:-translate-x-1" />
      </div>
      {live && progress > 0 && (
        <div className="mt-4">
          <div className="h-1 overflow-hidden rounded-full bg-line"><div className="h-full bg-ice" style={{ width: `${progress}%` }} /></div>
          <span className="sr-only">התקדמות {progress}%</span>
        </div>
      )}
    </a>
  );
}
