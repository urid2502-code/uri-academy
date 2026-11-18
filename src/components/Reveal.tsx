import { motion } from 'motion/react';
import type { ReactNode } from 'react';
import { EASE_OUT } from '../lib/motion';

/** Fade-and-rise for a list of blocks; total stagger is capped so long lessons never feel slow. */
export function Reveal({ index = 0, children, className }: { index?: number; children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE_OUT, delay: Math.min(index * 0.05, 0.45) }}
    >
      {children}
    </motion.div>
  );
}
