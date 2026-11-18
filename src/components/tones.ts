import type { Tone } from '../types';

/** Text color that reads well on both light and dark surfaces. */
export const toneText: Record<Tone, string> = {
  violet: 'text-violet-600 dark:text-violet-300',
  teal: 'text-teal-600 dark:text-teal-300',
  sky: 'text-sky-600 dark:text-sky-300',
  amber: 'text-amber-600 dark:text-amber-300',
  rose: 'text-rose-600 dark:text-rose-300',
  emerald: 'text-emerald-600 dark:text-emerald-300',
  indigo: 'text-indigo-600 dark:text-indigo-300',
  orange: 'text-orange-600 dark:text-orange-300',
  pink: 'text-pink-600 dark:text-pink-300',
  slate: 'text-slate-600 dark:text-slate-300',
};

/** Soft tinted background + border. */
export const toneSoft: Record<Tone, string> = {
  violet: 'bg-violet-500/10 border-violet-500/25',
  teal: 'bg-teal-500/10 border-teal-500/25',
  sky: 'bg-sky-500/10 border-sky-500/25',
  amber: 'bg-amber-500/10 border-amber-500/25',
  rose: 'bg-rose-500/10 border-rose-500/25',
  emerald: 'bg-emerald-500/10 border-emerald-500/25',
  indigo: 'bg-indigo-500/10 border-indigo-500/25',
  orange: 'bg-orange-500/10 border-orange-500/25',
  pink: 'bg-pink-500/10 border-pink-500/25',
  slate: 'bg-slate-500/10 border-slate-500/25',
};

export const toneSolid: Record<Tone, string> = {
  violet: 'bg-violet-500',
  teal: 'bg-teal-500',
  sky: 'bg-sky-500',
  amber: 'bg-amber-500',
  rose: 'bg-rose-500',
  emerald: 'bg-emerald-500',
  indigo: 'bg-indigo-500',
  orange: 'bg-orange-500',
  pink: 'bg-pink-500',
  slate: 'bg-slate-500',
};

export const toneGradient: Record<Tone, string> = {
  violet: 'from-violet-500 to-fuchsia-500',
  teal: 'from-teal-500 to-cyan-500',
  sky: 'from-sky-500 to-blue-500',
  amber: 'from-amber-500 to-orange-500',
  rose: 'from-rose-500 to-pink-500',
  emerald: 'from-emerald-500 to-teal-500',
  indigo: 'from-indigo-500 to-violet-500',
  orange: 'from-orange-500 to-amber-500',
  pink: 'from-pink-500 to-rose-500',
  slate: 'from-slate-500 to-slate-700',
};

export const toneHex: Record<Tone, string> = {
  violet: '#8b5cf6',
  teal: '#14b8a6',
  sky: '#0ea5e9',
  amber: '#f59e0b',
  rose: '#f43f5e',
  emerald: '#10b981',
  indigo: '#6366f1',
  orange: '#f97316',
  pink: '#ec4899',
  slate: '#64748b',
};
