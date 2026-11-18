import type { Tone } from '../types';

/** Text color that reads well on both light and dark surfaces. */
export const toneText: Record<Tone, string> = {
  violet: 'text-blue-700 dark:text-sky-300',
  teal: 'text-teal-600 dark:text-teal-300',
  sky: 'text-sky-600 dark:text-sky-300',
  amber: 'text-amber-600 dark:text-amber-300',
  rose: 'text-rose-600 dark:text-rose-300',
  emerald: 'text-emerald-600 dark:text-emerald-300',
  indigo: 'text-cyan-700 dark:text-cyan-300',
  orange: 'text-orange-600 dark:text-orange-300',
  pink: 'text-pink-600 dark:text-pink-300',
  slate: 'text-slate-600 dark:text-slate-300',
};

/** Soft tinted background + border. */
export const toneSoft: Record<Tone, string> = {
  violet: 'bg-blue-500/10 border-blue-500/25',
  teal: 'bg-teal-500/10 border-teal-500/25',
  sky: 'bg-sky-500/10 border-sky-500/25',
  amber: 'bg-amber-500/10 border-amber-500/25',
  rose: 'bg-rose-500/10 border-rose-500/25',
  emerald: 'bg-emerald-500/10 border-emerald-500/25',
  indigo: 'bg-cyan-500/10 border-cyan-500/25',
  orange: 'bg-orange-500/10 border-orange-500/25',
  pink: 'bg-pink-500/10 border-pink-500/25',
  slate: 'bg-slate-500/10 border-slate-500/25',
};

export const toneSolid: Record<Tone, string> = {
  violet: 'bg-blue-500',
  teal: 'bg-teal-500',
  sky: 'bg-sky-500',
  amber: 'bg-amber-500',
  rose: 'bg-rose-500',
  emerald: 'bg-emerald-500',
  indigo: 'bg-cyan-500',
  orange: 'bg-orange-500',
  pink: 'bg-pink-500',
  slate: 'bg-slate-500',
};

export const toneGradient: Record<Tone, string> = {
  violet: 'from-blue-800 to-blue-800',
  teal: 'from-teal-700 to-teal-700',
  sky: 'from-sky-700 to-sky-700',
  amber: 'from-amber-700 to-amber-700',
  rose: 'from-rose-700 to-rose-700',
  emerald: 'from-emerald-700 to-emerald-700',
  indigo: 'from-cyan-800 to-cyan-800',
  orange: 'from-orange-700 to-orange-700',
  pink: 'from-pink-700 to-pink-700',
  slate: 'from-slate-700 to-slate-700',
};

export const toneHex: Record<Tone, string> = {
  violet: '#3b82f6',
  teal: '#14b8a6',
  sky: '#0ea5e9',
  amber: '#f59e0b',
  rose: '#f43f5e',
  emerald: '#10b981',
  indigo: '#06b6d4',
  orange: '#f97316',
  pink: '#ec4899',
  slate: '#64748b',
};
