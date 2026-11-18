import { Check, Menu, Star, X } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { href } from '../lib/router';

const LINKS = [
  { label: 'קורסים', to: href.courses() },
  { label: 'המסלול המלא', to: href.home() },
  { label: 'סימולטור', to: href.simulator() },
  { label: 'הכנה לראיון', to: href.interview() },
];

/** Full-page dark notebook sheet used by the landing and catalog pages. It is also the scroll container. */
export function NotebookShell({ children }: { children: ReactNode }) {
  return (
    <div id="main-scroll" data-theme="dark" className="nb-sheet relative h-full overflow-y-auto overflow-x-hidden">
      <div className="nb-margin relative min-h-full">
        <SiteNav />
        {children}
        <SiteFooter />
      </div>
    </div>
  );
}

export function Wordmark() {
  return (
    <a href={href.landing()} className="flex items-baseline gap-2 text-fg">
      <span className="text-[17px] font-semibold tracking-tight">האקדמיה של אורי</span>
      <span className="ink hidden text-[13px] sm:inline">מחברת לימוד</span>
    </a>
  );
}

export function SiteNav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-night/95">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 ps-10 pe-5 md:ps-24 md:pe-8">
        <Wordmark />
        <div className="hidden items-center gap-7 md:flex">
          {LINKS.map((l) => (
            <a key={l.label} href={l.to} className="text-[14.5px] text-muted transition-colors hover:text-fg">
              {l.label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <a href={href.home()} className="btn-ice hidden sm:inline-flex">
            לפתוח את המחברת
          </a>
          <button
            onClick={() => setOpen((o) => !o)}
            className="rounded-[2px] border border-line p-2 text-fg md:hidden"
            aria-label="תפריט"
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>
      {open && (
        <div className="border-t border-line bg-night md:hidden">
          {[...LINKS, { label: 'לפתוח את המחברת', to: href.home() }].map((l) => (
            <a key={l.label} href={l.to} onClick={() => setOpen(false)} className="rule-b block ps-10 pe-5 py-3.5 text-[15.5px] text-muted hover:text-fg">
              {l.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="rule-t mt-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 ps-10 pe-5 py-10 text-[13.5px] text-faint sm:flex-row sm:items-center sm:justify-between md:ps-24 md:pe-8">
        <span>האקדמיה של אורי · נבנתה כדי ללמוד, לתרגל ולהגיע מוכן.</span>
        <span>ההתקדמות נשמרת רק בדפדפן הזה.</span>
      </div>
    </footer>
  );
}

export type BoxState = 'empty' | 'ticked' | 'starred';

/** The notebook's three-state box: not started, completed, or completed with a perfect quiz. */
export function StateBox({ state, className = '', decorative = false }: { state: BoxState; className?: string; decorative?: boolean }) {
  const label = state === 'starred' ? 'הושלם, 100% במבחן' : state === 'ticked' ? 'הושלם' : 'עוד לא הושלם';
  return (
    <span
      {...(decorative ? { 'aria-hidden': true } : { role: 'img', 'aria-label': label })}
      className={`inline-flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[2px] border ${
        state === 'empty' ? 'border-line-strong' : 'border-fjord bg-fjord text-ice'
      } ${className}`}
    >
      {state === 'ticked' && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
      {state === 'starred' && <Star className="h-3 w-3 fill-current" strokeWidth={2.5} />}
    </span>
  );
}

/** One ledger row: label, dotted leader, value. */
export function LedgerRow({ label, value, hrefTo }: { label: string; value: ReactNode; hrefTo?: string }) {
  const body = (
    <>
      <span className="text-muted">{label}</span>
      <span aria-hidden className="mx-3 h-px flex-1 translate-y-[-0.3em] border-b border-dotted border-line-strong" />
      <span className="tabular text-fg">{value}</span>
    </>
  );
  return hrefTo ? (
    <a href={hrefTo} className="rule-b flex items-baseline py-3 text-[15.5px] transition-colors hover:text-fg [&:hover>span:first-child]:text-fg">
      {body}
    </a>
  ) : (
    <div className="rule-b flex items-baseline py-3 text-[15.5px]">{body}</div>
  );
}
