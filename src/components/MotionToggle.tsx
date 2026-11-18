import { Pause } from 'lucide-react';
import { useMotionOff } from '../lib/motion-pref';

/** Site-wide switch for decorative animation; the label stays fixed and aria-pressed carries the state. */
export function MotionToggle({ className = '' }: { className?: string }) {
  const { userOff, toggle } = useMotionOff();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={userOff}
      aria-label="השבתת אנימציות"
      title={userOff ? 'האנימציות כבויות — לחיצה להפעלה' : 'השבתת אנימציות'}
      className={`motion-toggle ${className}`}
    >
      <Pause className="h-4 w-4" />
      <span>אנימציות</span>
    </button>
  );
}
