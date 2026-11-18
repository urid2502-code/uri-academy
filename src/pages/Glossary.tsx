import { ArrowLeft, BookA, Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { glossary, modules } from '../content';
import { href } from '../lib/router';

export function Glossary({ focus }: { focus?: string }) {
  const [q, setQ] = useState('');
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return glossary;
    return glossary.filter((g) => g.term.toLowerCase().includes(s) || (g.he ?? '').includes(s) || g.def.includes(s));
  }, [q]);

  const groups = useMemo(() => {
    const map = new Map<string, typeof filtered>();
    for (const g of filtered) {
      const letter = /^[a-z]/i.test(g.term) ? g.term[0].toUpperCase() : '#';
      map.set(letter, [...(map.get(letter) ?? []), g]);
    }
    return [...map.entries()];
  }, [filtered]);

  useEffect(() => {
    if (!focus) return;
    const el = document.getElementById(`term-${focus.toLowerCase()}`);
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [focus]);

  return (
    <div className="mx-auto max-w-[1680px] px-5 pb-24 pt-8 lg:px-10">
      <header className="mb-8">
        <div className="flex items-center gap-2 text-[13px] font-bold text-sky-600 dark:text-sky-300">
          <BookA className="h-4 w-4" /> מילון מונחים
        </div>
        <h1 className="mt-2 text-[32px] font-bold tracking-tight text-fg">כל המונחים במקום אחד</h1>
        <p className="mt-2 text-[16px] leading-7 text-muted">
          המונחים המקצועיים כתובים באנגלית – כך תשמע אותם בעבודה ובראיונות – וההסבר בעברית. לחץ על מונח כדי לעבור לשיעור שבו הוא נלמד.
        </p>
        <div className="relative mt-5 max-w-md">
          <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="חפש מונח באנגלית או בעברית…"
            className="w-full rounded-xl border border-line bg-surface py-3 pe-4 ps-9 text-[15px] text-fg placeholder:text-faint focus:border-brand focus:outline-none"
          />
        </div>
        <div dir="ltr" className="mt-4 flex flex-wrap gap-1.5">
          {groups.map(([letter]) => (
            <a key={letter} href={`#/glossary`} onClick={(e) => {
              e.preventDefault();
              document.getElementById(`letter-${letter}`)?.scrollIntoView({ behavior: 'smooth' });
            }} className="flex h-8 w-8 items-center justify-center rounded-lg border border-line bg-surface text-[13px] font-bold text-muted hover:border-brand hover:text-brand">
              {letter}
            </a>
          ))}
        </div>
      </header>

      {filtered.length === 0 && <div className="card p-8 text-center text-faint">לא נמצאו מונחים עבור "{q}"</div>}

      <div className="space-y-8">
        {groups.map(([letter, items]) => (
          <section key={letter} id={`letter-${letter}`} className="scroll-mt-6">
            <div dir="ltr" className="mb-3 text-[22px] font-bold text-brand">
              {letter}
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {items.map((g) => {
                const mod = modules.find((m) => m.id === g.moduleId);
                const isFocus = focus?.toLowerCase() === g.term.toLowerCase();
                return (
                  <div
                    key={g.term}
                    id={`term-${g.term.toLowerCase()}`}
                    className={`card scroll-mt-24 p-5 transition ${isFocus ? 'border-brand ring-2 ring-brand/30' : ''}`}
                  >
                    <div className="flex flex-wrap items-baseline gap-x-2">
                      <span dir="ltr" className="text-[17px] font-bold text-fg">
                        {g.term}
                      </span>
                      {g.he && <span className="text-[14px] text-faint">{g.he}</span>}
                    </div>
                    <p className="mt-1.5 text-[14.5px] leading-7 text-muted">{g.def}</p>
                    <a href={href.lesson(g.moduleId, g.lessonId)} className="mt-2 inline-flex items-center gap-1 text-[12.5px] font-semibold text-brand hover:underline">
                      נלמד במודול {mod?.number}: {g.lessonTitle} <ArrowLeft className="h-3 w-3" />
                    </a>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
