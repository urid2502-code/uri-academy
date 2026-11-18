import { AnimatePresence, motion, type Variants } from 'motion/react';
import { useId, useState, type KeyboardEvent, type ReactNode } from 'react';
import { EASE_OUT } from '../lib/motion';

export interface TabItem {
  id: string;
  label: ReactNode;
  icon?: ReactNode;
  count?: number | string;
}

interface SlidingTabsProps {
  items: TabItem[];
  value: string;
  onChange: (id: string) => void;
  ariaLabel: string;
  /** "tabs" drives a TabPanel; "filter" is a toggle group that narrows a list. */
  mode?: 'tabs' | 'filter';
  /** Prefix for tab and panel ids: `${idBase}-tab-${id}` and `${idBase}-panel`. */
  idBase?: string;
  variant?: 'underline' | 'segmented';
  className?: string;
}

/**
 * One tab language for the whole site: a shared indicator glides to the active tab,
 * arrow keys follow the Hebrew reading direction, and the panel below slides the right way.
 */
export function SlidingTabs({ items, value, onChange, ariaLabel, mode = 'tabs', idBase = 'tabs', variant = 'underline', className = '' }: SlidingTabsProps) {
  const uid = useId();
  const isTabs = mode === 'tabs';
  const index = items.findIndex((item) => item.id === value);

  const onKeyDown = (event: KeyboardEvent) => {
    if (!isTabs) return;
    // Right-to-left: the left arrow moves forward, the right arrow moves back.
    const target =
      event.key === 'ArrowLeft' ? (index + 1) % items.length
      : event.key === 'ArrowRight' ? (index + items.length - 1) % items.length
      : event.key === 'Home' ? 0
      : event.key === 'End' ? items.length - 1
      : -1;
    if (target < 0) return;
    event.preventDefault();
    onChange(items[target].id);
    document.getElementById(`${idBase}-tab-${items[target].id}`)?.focus();
  };

  return (
    <div role={isTabs ? 'tablist' : 'group'} aria-label={ariaLabel} className={`stabs stabs-${variant} ${className}`} onKeyDown={onKeyDown}>
      {items.map((item) => {
        const active = item.id === value;
        return (
          <button
            key={item.id}
            id={`${idBase}-tab-${item.id}`}
            type="button"
            role={isTabs ? 'tab' : undefined}
            aria-selected={isTabs ? active : undefined}
            aria-pressed={isTabs ? undefined : active}
            aria-controls={isTabs ? `${idBase}-panel` : undefined}
            tabIndex={isTabs && !active ? -1 : 0}
            className="stab"
            onClick={() => onChange(item.id)}
          >
            {active && <motion.span layoutId={`${uid}-indicator`} className="stab-indicator" transition={{ type: 'spring', stiffness: 520, damping: 42 }} />}
            {item.icon}
            <span className="stab-label">{item.label}</span>
            {item.count !== undefined && <span className="stab-count tabular">{item.count}</span>}
          </button>
        );
      })}
    </div>
  );
}

// Forward moves toward the left edge in a right-to-left layout.
const panelVariants: Variants = {
  enter: (direction: number) => ({ opacity: 0, x: -direction * 24 }),
  center: { opacity: 1, x: 0, transition: { duration: 0.34, ease: EASE_OUT } },
  exit: (direction: number) => ({ opacity: 0, x: direction * 24, transition: { duration: 0.12 } }),
};

export function TabPanel({ idBase = 'tabs', value, order, children, className = '' }: { idBase?: string; value: string; order: string[]; children: ReactNode; className?: string }) {
  const index = order.indexOf(value);
  // Derive the travel direction from the previous index while rendering (no refs needed).
  const [travel, setTravel] = useState({ index, direction: 1 });
  if (travel.index !== index) setTravel({ index, direction: index > travel.index ? 1 : -1 });
  const direction = travel.direction;

  return (
    <div id={`${idBase}-panel`} role="tabpanel" aria-labelledby={`${idBase}-tab-${value}`} className={className}>
      <AnimatePresence mode="wait" initial={false} custom={direction}>
        <motion.div key={value} custom={direction} variants={panelVariants} initial="enter" animate="center" exit="exit">
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
