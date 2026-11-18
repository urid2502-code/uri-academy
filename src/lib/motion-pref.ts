import { useReducedMotion } from 'motion/react';
import { useSyncExternalStore } from 'react';

const KEY = 'uri-academy:motion-off:v1';
const listeners = new Set<() => void>();
let off = false;
try {
  off = localStorage.getItem(KEY) === '1';
} catch {
  /* storage unavailable: animations stay on */
}

const apply = () => {
  if (typeof document !== 'undefined') document.documentElement.dataset.motion = off ? 'off' : 'on';
};
apply();

export function toggleMotion() {
  off = !off;
  try {
    localStorage.setItem(KEY, off ? '1' : '0');
  } catch {
    /* the choice lasts for this visit only */
  }
  apply();
  listeners.forEach((listener) => listener());
}

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

/** The site-wide animation preference: the visitor's toggle plus the operating system's reduced-motion setting. */
export function useMotionOff() {
  const userOff = useSyncExternalStore(subscribe, () => off, () => false);
  const system = useReducedMotion();
  return { userOff, paused: userOff || !!system, toggle: toggleMotion };
}
