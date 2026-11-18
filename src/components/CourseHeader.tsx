import type { ReactNode } from 'react';
import { useMotionOff } from '../lib/motion-pref';

export function CourseHeader({ title, description, image, meta, actions }: {
  title: string;
  description: string;
  /** Resolves the artwork; the looping variant is requested only while animation is allowed. */
  image: (motion: boolean) => string;
  meta?: ReactNode;
  actions?: ReactNode;
}) {
  const { paused } = useMotionOff();
  return (
    <header className="course-header">
      <div className="course-header-art" aria-hidden="true">
        <img src={image(!paused)} alt="" width="1000" height="640" decoding="async" />
      </div>
      <div className="course-header-body">
        <h1>{title}</h1>
        <p>{description}</p>
        {meta && <div className="course-meta">{meta}</div>}
        {actions && <div className="course-header-actions">{actions}</div>}
      </div>
    </header>
  );
}
