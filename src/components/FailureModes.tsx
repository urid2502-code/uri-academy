import { Bug, ChevronDown, Eye, Search, Wrench } from 'lucide-react';
import { useState } from 'react';
import type { FailureMode } from '../types';
import { Inline } from './Markdown';

const SEV = {
  critical: { cls: 'bg-rose-500/15 text-rose-700 dark:text-rose-300', label: 'קריטי' },
  high: { cls: 'bg-amber-500/15 text-amber-700 dark:text-amber-300', label: 'חשוב' },
  medium: { cls: 'bg-sky-500/15 text-sky-700 dark:text-sky-300', label: 'בינוני' },
};

export function FailureModes({ items }: { items: FailureMode[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="space-y-3">
      {items.map((f, i) => {
        const isOpen = open === i;
        return (
          <div key={f.title} className="card overflow-hidden">
            <button onClick={() => setOpen(isOpen ? null : i)} className="flex w-full items-center gap-3 px-5 py-4 text-start hover:bg-surface-2/60">
              <Bug className="h-5 w-5 shrink-0 text-rose-500" />
              <span className="flex-1 text-[15.5px] font-semibold text-fg">
                <Inline text={f.title} />
              </span>
              <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${SEV[f.severity].cls}`}>{SEV[f.severity].label}</span>
              <ChevronDown className={`h-4 w-4 text-faint transition ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
              <div className="animate-fade-up grid gap-4 border-t border-line px-5 py-5 text-[14.5px] leading-7 md:grid-cols-3">
                {[
                  { icon: Eye, label: 'מה רואים', text: f.symptom, cls: 'text-rose-600 dark:text-rose-300' },
                  { icon: Search, label: 'למה זה קורה', text: f.rootCause, cls: 'text-amber-600 dark:text-amber-300' },
                  { icon: Wrench, label: 'איך מתקנים', text: f.mitigation, cls: 'text-emerald-600 dark:text-emerald-300' },
                ].map((c) => (
                  <div key={c.label} className="rounded-xl bg-surface-2/70 p-4">
                    <div className={`mb-1.5 flex items-center gap-1.5 text-[12.5px] font-bold ${c.cls}`}>
                      <c.icon className="h-3.5 w-3.5" /> {c.label}
                    </div>
                    <div className="text-muted">
                      <Inline text={c.text} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
