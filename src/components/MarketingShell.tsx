import { Check, Code2, Menu, Star, X } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { href } from '../lib/router';
import { MotionToggle } from './MotionToggle';

const LINKS = [
  { label: 'קורסים', to: href.courses() },
  { label: 'המסלול המלא', to: href.home() },
  { label: 'סימולטור', to: href.simulator() },
  { label: 'קהילה', to: href.community() },
  { label: 'הכנה לראיון', to: href.interview() },
];

export function MarketingShell({ children }: { children: ReactNode }) {
  return (
    <div id="main-scroll" data-theme="dark" className="academy-site relative h-full overflow-y-auto overflow-x-hidden">
      <div className="relative min-h-full">
        <SiteNav />
        {children}
        <SiteFooter />
      </div>
    </div>
  );
}

export function Wordmark() {
  return (
    <a href={href.landing()} className="flex items-center gap-3 text-fg">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-ice/25 bg-ice/10 text-ice"><Code2 className="h-5 w-5" /></span>
      <span className="whitespace-nowrap text-[15px] font-semibold tracking-tight sm:text-[17px]">האקדמיה של אורי</span>
    </a>
  );
}

export function SiteNav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-night">
      <nav className="mx-auto flex h-20 max-w-[1680px] items-center justify-between gap-4 px-5 md:px-8">
        <Wordmark />
        <div className="hidden items-center gap-5 md:flex lg:gap-7">
          {LINKS.map((l) => (
            <a key={l.label} href={l.to} className="whitespace-nowrap text-[14.5px] text-muted transition-colors hover:text-fg">
              {l.label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <MotionToggle className="hidden sm:inline-flex" />
          <div className="hidden lg:block">
            <a href={href.home()} className="btn-ice">להמשיך ללמוד</a>
          </div>
          <button
            onClick={() => setOpen((o) => !o)}
            className="rounded-lg border border-line p-2 text-fg md:hidden"
            aria-label="תפריט"
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>
      {open && (
        <div id="mobile-menu" className="border-t border-line bg-night md:hidden">
          {[...LINKS, { label: 'להמשיך ללמוד', to: href.home() }].map((l) => (
            <a key={l.label} href={l.to} onClick={() => setOpen(false)} className="rule-b block px-5 py-3.5 text-[15.5px] text-muted hover:text-fg">
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
      <div className="mx-auto flex max-w-[1680px] flex-col gap-3 px-5 py-10 text-[13.5px] text-faint sm:flex-row sm:items-center sm:justify-between md:px-8">
        <span>האקדמיה של אורי · נבנתה כדי ללמוד, לתרגל ולהגיע מוכן.</span>
        <span>ההתקדמות נשמרת רק בדפדפן הזה.</span>
      </div>
    </footer>
  );
}

export type BoxState = 'empty' | 'ticked' | 'starred';

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

export function LedgerRow({ label, value, hrefTo }: { label: string; value: ReactNode; hrefTo?: string }) {
  const body = (
    <>
      <span className="text-muted">{label}</span>
      <span aria-hidden className="mx-3 flex-1" />
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
