import { ChevronDown, Eye, EyeOff, Lightbulb, ListChecks, PenLine, Target } from 'lucide-react';
import { useState } from 'react';
import { useProgress } from '../lib/progress-context';
import type { Lesson } from '../types';
import { Inline, Markdown } from './Markdown';

export function Challenge({ lessonId, challenge }: { lessonId: string; challenge: Lesson['challenge'] }) {
  const { state, setNote } = useProgress();
  const [hintsShown, setHintsShown] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const noteKey = `challenge:${lessonId}`;

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-brand/30 bg-gradient-to-bl from-brand/10 to-transparent p-6">
        <div className="mb-2 flex items-center gap-2 text-[13px] font-bold text-brand">
          <Target className="h-4 w-4" /> התרגיל שלך
        </div>
        <p className="text-[16px] leading-8 text-fg">
          <Inline text={challenge.prompt} />
        </p>
        <div className="mt-4 flex items-center gap-1.5 text-[12px] font-semibold text-faint">
          <ListChecks className="h-3.5 w-3.5" /> מה לכלול
        </div>
        <ul className="mt-2 grid gap-2 sm:grid-cols-2">
          {challenge.constraints.map((c) => (
            <li key={c} className="flex gap-2 rounded-lg bg-surface/70 px-3 py-2 text-[14px] leading-6 text-muted">
              <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
              <span>
                <Inline text={c} />
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="card overflow-hidden">
        <label htmlFor={noteKey} className="flex items-center gap-2 border-b border-line px-5 py-3 text-[14px] font-semibold text-fg">
          <PenLine className="h-4 w-4 text-faint" /> הפתרון שלך
          <span className="text-[12px] font-normal text-faint">(נשמר אוטומטית בדפדפן)</span>
        </label>
        <textarea
          id={noteKey}
          value={state.notes[noteKey] ?? ''}
          onChange={(e) => setNote(noteKey, e.target.value)}
          placeholder="נסה לפתור לבד לפני שאתה מסתכל על הפתרון. אפשר לכתוב כאן קוד, רשימת שלבים או הסבר במילים…"
          className="h-40 w-full resize-y bg-transparent px-5 py-4 text-[15px] leading-7 text-fg placeholder:text-faint focus:outline-none"
        />
      </div>

      <div className="space-y-2">
        {challenge.hints.slice(0, hintsShown).map((h, i) => (
          <div key={i} className="animate-fade-up flex gap-2.5 rounded-xl border border-amber-500/30 bg-amber-500/[0.08] px-4 py-3 text-[14.5px] leading-6 text-muted">
            <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
            <span>
              <span className="font-bold text-amber-700 dark:text-amber-300">רמז {i + 1}: </span>
              <Inline text={h} />
            </span>
          </div>
        ))}
        <div className="flex flex-wrap gap-2">
          {hintsShown < challenge.hints.length && (
            <button
              onClick={() => setHintsShown((n) => n + 1)}
              className="flex items-center gap-1.5 rounded-xl border border-amber-500/40 px-4 py-2 text-[14px] text-amber-700 hover:bg-amber-500/10 dark:text-amber-300"
            >
              <Lightbulb className="h-4 w-4" /> תן לי רמז ({hintsShown}/{challenge.hints.length})
            </button>
          )}
          <button
            onClick={() => setShowSolution((s) => !s)}
            className="flex items-center gap-1.5 rounded-xl border border-emerald-500/40 px-4 py-2 text-[14px] text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-300"
          >
            {showSolution ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {showSolution ? 'הסתר פתרון' : 'הצג פתרון לדוגמה'}
            <ChevronDown className={`h-4 w-4 transition ${showSolution ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {showSolution && (
        <div className="animate-fade-up rounded-2xl border border-emerald-500/30 bg-emerald-500/[0.04] p-6">
          <Markdown source={challenge.solution} />
        </div>
      )}
    </div>
  );
}
