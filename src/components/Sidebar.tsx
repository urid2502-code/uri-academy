import { BookA, CheckCircle2, ChevronLeft, Circle, Code2, GitCompareArrows, Home, LayoutGrid, MessagesSquare, Moon, Network, PanelRightClose, Search, Sun, Swords, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { getTrack, lessonKey, search, type TrackId } from '../content';
import { useProgress } from '../lib/progress-context';
import { href, navigate, useTheme, type Route } from '../lib/router';
import type { Stage } from '../types';
import { ModuleIcon, ProgressBar } from './ui';

interface Props {
  track: TrackId;
  route: Route;
  searchExtra: { title: string; subtitle: string; href: string; body: string }[];
  onNavigate?: () => void;
  /** Provided on desktop, where the menu can be hidden entirely. */
  onCollapse?: () => void;
}

export function Sidebar({ track, route, searchExtra, onNavigate, onCollapse }: Props) {
  const { label, lessons: allLessons, modules, stages } = getTrack(track);
  const { state, isComplete } = useProgress();
  const [theme, toggleTheme] = useTheme();
  const [query, setQuery] = useState('');
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const activeModule = route.name === 'lesson' || route.name === 'module' ? route.moduleId : null;
  const [expanded, setExpanded] = useState<string | null>(activeModule);
  const [prevActive, setPrevActive] = useState(activeModule);
  if (activeModule !== prevActive) {
    setPrevActive(activeModule);
    if (activeModule) setExpanded(activeModule);
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const results = useMemo(() => search(query, searchExtra), [query, searchExtra]);
  const total = allLessons.length;
  const done = allLessons.filter((x) => state.completed.includes(x.key)).length;
  const pct = total ? Math.round((done / total) * 100) : 0;

  const go = (to: string) => {
    setQuery('');
    navigate(to);
    onNavigate?.();
  };

  const navItem = (active: boolean) =>
    `flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-[13px] transition ${
      active ? 'bg-brand/10 font-semibold text-brand' : 'text-muted hover:bg-surface-2 hover:text-fg'
    }`;

  return (
    <aside className="learning-sidebar flex h-full w-[272px] max-w-[85vw] shrink-0 flex-col border-e border-line bg-surface">
      <div className="px-5 pb-4 pt-5">
        <div className="flex items-center justify-between">
          <a href={href.landing()} onClick={() => onNavigate?.()} className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-brand/25 bg-brand/10 text-brand">
              <Code2 className="h-4 w-4" />
            </div>
            <div>
              <div className="text-[14px] font-semibold leading-5 text-fg">האקדמיה של אורי</div>
              <div className="text-[12px] text-faint">מסלול {label}</div>
            </div>
          </a>
          <div className="flex items-center">
            <button
              onClick={toggleTheme}
              className="rounded-lg p-2 text-muted transition hover:bg-surface-2 hover:text-fg"
              aria-label={theme === 'dark' ? 'מצב בהיר' : 'מצב כהה'}
              title={theme === 'dark' ? 'מצב בהיר' : 'מצב כהה'}
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            {onCollapse && (
              <button
                onClick={onCollapse}
                className="rounded-lg p-2 text-muted transition hover:bg-surface-2 hover:text-fg"
                aria-label="הסתר את התפריט"
                title="הסתר את התפריט (Ctrl+B)"
              >
                <PanelRightClose className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        <div className="relative mt-4">
          <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setCursor(0);
            }}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') setCursor((c) => Math.min(c + 1, results.length - 1));
              if (e.key === 'ArrowUp') setCursor((c) => Math.max(c - 1, 0));
              if (e.key === 'Enter' && results[cursor]) go(results[cursor].href);
              if (e.key === 'Escape') setQuery('');
            }}
            placeholder="חיפוש שיעור או מונח…"
            className="w-full rounded-lg border border-line bg-bg py-2.5 pe-14 ps-9 text-[13px] text-fg placeholder:text-faint focus:border-brand focus:outline-none"
          />
          {query ? (
            <button onClick={() => setQuery('')} className="absolute end-3 top-1/2 -translate-y-1/2 text-faint hover:text-fg" aria-label="נקה חיפוש">
              <X className="h-4 w-4" />
            </button>
          ) : (
            <kbd dir="ltr" className="pointer-events-none absolute end-2.5 top-1/2 -translate-y-1/2 rounded-md border border-line bg-surface px-1.5 font-mono text-[10px] text-faint">
              Ctrl K
            </kbd>
          )}
          {query && (
            <div className="absolute inset-x-0 top-full z-30 mt-2 max-h-96 overflow-auto rounded-2xl border border-line bg-surface p-1.5 shadow-2xl">
              {results.length === 0 && <div className="px-3 py-5 text-center text-[13px] text-faint">לא נמצאו תוצאות עבור "{query}"</div>}
              {results.map((r, i) => (
                <button
                  key={r.href + r.title}
                  onMouseEnter={() => setCursor(i)}
                  onClick={() => go(r.href)}
                  className={`block w-full rounded-xl px-3 py-2 text-start ${i === cursor ? 'bg-brand/10' : ''}`}
                >
                  <div className="truncate text-[14px] text-fg">{r.title}</div>
                  <div className="truncate text-[12px] text-faint">{r.subtitle}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="mt-5 border-b border-line pb-5">
          <div className="mb-2 flex items-center justify-between text-[12px]">
            <span className="font-semibold text-muted">ההתקדמות שלך</span>
            <span className="font-bold text-brand">
              {done}/{total} · {pct}%
            </span>
          </div>
          <ProgressBar value={pct} />
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-4">
        <a href={href.courses()} onClick={() => onNavigate?.()} className={navItem(false)}>
          <LayoutGrid className="h-4 w-4" /> כל הקורסים
        </a>
        <a href={href.course(track)} onClick={() => onNavigate?.()} className={navItem(route.name === 'home' || (route.name === 'course' && route.courseId === track))}>
          <Home className="h-4 w-4" /> דף הקורס: {label}
        </a>

        {([1, 2, 3] as Stage[]).map((stage) => (
          modules.some((m) => m.stage === stage) && <div key={stage}>
            <div className="mb-1.5 mt-5 px-3 text-[11.5px] font-bold text-faint">{stages[stage].title}</div>
            <div className="space-y-0.5">
              {modules
                .filter((m) => m.stage === stage)
                .map((m) => {
                  const mDone = m.lessons.filter((l) => isComplete(lessonKey(m, l))).length;
                  const isOpen = expanded === m.id;
                  const isActive = activeModule === m.id;
                  return (
                    <div key={m.id}>
                      <button
                        aria-expanded={isOpen}
                        onClick={() => {
                          setExpanded(isOpen ? null : m.id);
                          if (!isOpen) go(href.module(m.id));
                        }}
                        className={`flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-start transition ${isActive ? 'bg-brand/8' : 'hover:bg-surface-2/70'}`}
                      >
                        <ModuleIcon icon={m.icon} className={`h-4 w-4 shrink-0 ${isActive ? 'text-brand' : 'text-faint'}`} />
                        <span className="min-w-0 flex-1 text-[13px] leading-6 text-fg">
                          <span className="me-1.5 text-[12px] font-bold text-faint">{m.number}.</span>
                          {m.short}
                        </span>
                        <span className={`text-[11px] font-semibold ${mDone === m.lessons.length ? 'text-emerald-600 dark:text-emerald-400' : 'text-faint'}`}>
                          {mDone}/{m.lessons.length}
                        </span>
                        <ChevronLeft className={`h-3.5 w-3.5 shrink-0 text-faint transition ${isOpen ? '-rotate-90' : ''}`} />
                      </button>
                      {isOpen && (
                        <div className="ms-[22px] mt-0.5 space-y-0.5 border-s border-line pb-1.5 ps-2.5">
                          {m.lessons.map((l) => {
                            const active = route.name === 'lesson' && route.moduleId === m.id && route.lessonId === l.id;
                            const complete = isComplete(lessonKey(m, l));
                            return (
                              <a
                                key={l.id}
                                href={href.lesson(m.id, l.id)}
                                aria-current={active ? 'page' : undefined}
                                onClick={() => onNavigate?.()}
                                className={`flex items-start gap-2 rounded-lg px-2 py-1.5 text-[13px] leading-5 transition ${
                                  active ? 'bg-brand/10 font-semibold text-brand' : 'text-muted hover:bg-surface-2 hover:text-fg'
                                }`}
                              >
                                {complete ? (
                                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                                ) : (
                                  <Circle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-line-strong" />
                                )}
                                <span>{l.title}</span>
                              </a>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        ))}

        <div className="mb-1.5 mt-6 px-3 text-[11.5px] font-bold text-faint">כלים ותרגול</div>
        <div className="space-y-0.5">
          <a href={href.glossary()} onClick={() => onNavigate?.()} className={navItem(route.name === 'glossary')}>
            <BookA className="h-4 w-4 text-sky-500" /> מילון מונחים
          </a>
          <a href={href.simulator()} onClick={() => onNavigate?.()} className={navItem(route.name === 'simulator')}>
            <Network className="h-4 w-4 text-teal-500" /> סימולטור: מסע של בקשה
          </a>
          <a href={href.comparisons()} onClick={() => onNavigate?.()} className={navItem(route.name === 'comparisons')}>
            <GitCompareArrows className="h-4 w-4 text-amber-500" /> קוד מתחיל מול מקצוען
          </a>
          <a href={href.interview()} onClick={() => onNavigate?.()} className={navItem(route.name === 'interview')}>
            <Swords className="h-4 w-4 text-rose-500" /> הכנה לראיון עבודה
          </a>
          <a href={href.community()} onClick={() => onNavigate?.()} className={navItem(route.name === 'community')}>
            <MessagesSquare className="h-4 w-4 text-brand" /> Thought Streams
          </a>
        </div>
      </nav>
    </aside>
  );
}
