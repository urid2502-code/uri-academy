import { ArrowLeft, CheckCircle2, Columns2, GitCompareArrows, ShieldCheck, TriangleAlert, XCircle } from 'lucide-react';
import { useState } from 'react';
import { CodeBlock } from '../components/CodeBlock';
import { Inline } from '../components/Markdown';
import { toneText } from '../components/tones';
import { modules } from '../content';
import { comparisons } from '../content/comparisons';
import { href } from '../lib/router';

type Tab = 'junior' | 'senior' | 'split';

function PointList({ items, good }: { items: string[]; good: boolean }) {
  const Icon = good ? CheckCircle2 : XCircle;
  return (
    <ul className="space-y-2.5">
      {items.map((p) => (
        <li key={p} className="flex gap-2.5 text-[14.5px] leading-6 text-muted">
          <Icon className={`mt-1 h-4 w-4 shrink-0 ${good ? 'text-emerald-500' : 'text-rose-500'}`} />
          <span>
            <Inline text={p} />
          </span>
        </li>
      ))}
    </ul>
  );
}

export function Comparisons({ selectedId }: { selectedId?: string }) {
  const current = comparisons.find((c) => c.id === selectedId) ?? comparisons[0];
  const [tab, setTab] = useState<Tab>('junior');
  const mod = modules.find((m) => m.id === current.moduleId);

  const tabs: { id: Tab; label: string; icon: typeof XCircle; cls: string }[] = [
    { id: 'junior', label: 'גרסת מתחיל', icon: TriangleAlert, cls: 'border-rose-500 bg-rose-500/10 text-rose-700 dark:text-rose-300' },
    { id: 'senior', label: 'גרסת מקצוען', icon: ShieldCheck, cls: 'border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300' },
    { id: 'split', label: 'זו לצד זו', icon: Columns2, cls: 'border-brand bg-brand/10 text-brand' },
  ];

  const problems = (
    <div className="rounded-2xl border border-rose-500/30 bg-rose-500/[0.05] p-5">
      <div className="mb-3 text-[13px] font-bold text-rose-600 dark:text-rose-300">מה נשבר כאן</div>
      <PointList items={current.junior.problems} good={false} />
    </div>
  );
  const wins = (
    <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/[0.05] p-5">
      <div className="mb-3 text-[13px] font-bold text-emerald-600 dark:text-emerald-300">למה זה עובד טוב יותר</div>
      <PointList items={current.senior.wins} good />
    </div>
  );

  return (
    <div className="mx-auto max-w-[1680px] px-5 pb-24 pt-8 lg:px-10">
      <header className="mb-6">
        <div className="flex items-center gap-2 text-[13px] font-bold text-amber-600 dark:text-amber-300">
          <GitCompareArrows className="h-4 w-4" /> קוד מתחיל מול קוד מקצוען
        </div>
        <h1 className="mt-2 text-[32px] font-bold tracking-tight text-fg">אותה משימה, שתי גרסאות</h1>
        <p className="mt-2 text-[16px] leading-7 text-muted">
          הגרסה של המתחיל "עובדת" בהדגמה – אבל נשברת בעולם האמיתי: כשיש שגיאות, משתמשים רבים, רשת לא יציבה או מישהו זדוני. נסה קודם למצוא בעצמך מה הבעיה
          בגרסת המתחיל, ורק אז תסתכל על ההסבר.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[270px_1fr]">
        <nav className="space-y-2">
          {comparisons.map((c) => {
            const m = modules.find((x) => x.id === c.moduleId);
            const active = c.id === current.id;
            return (
              <a
                key={c.id}
                href={href.comparisons(c.id)}
                className={`block rounded-xl border-2 px-4 py-3 transition ${active ? 'border-amber-500 bg-amber-500/[0.08]' : 'border-line bg-surface hover:border-line-strong'}`}
              >
                <div className="text-[14px] font-semibold text-fg">{c.title}</div>
                {m && <div className={`mt-0.5 text-[12px] font-medium ${toneText[m.tone]}`}>מודול {m.number} · {m.short}</div>}
              </a>
            );
          })}
        </nav>

        <div className="min-w-0">
          <div className="card p-6">
            <h2 className="text-[22px] font-bold text-fg">{current.title}</h2>
            <p className="mt-2 text-[15px] leading-7 text-muted">
              <Inline text={current.context} />
            </p>
            {mod && (
              <a href={href.module(mod.id)} className={`mt-3 inline-flex items-center gap-1 text-[13px] font-semibold hover:underline ${toneText[mod.tone]}`}>
                ללמוד את הנושא במודול {mod.number} <ArrowLeft className="h-3.5 w-3.5" />
              </a>
            )}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-1.5 rounded-xl border-2 px-4 py-2 text-[14px] font-semibold transition ${tab === t.id ? t.cls : 'border-line text-muted hover:text-fg'}`}
              >
                <t.icon className="h-4 w-4" /> {t.label}
              </button>
            ))}
          </div>

          {tab === 'split' ? (
            <div className="mt-2 grid gap-4 2xl:grid-cols-2">
              <div className="min-w-0">
                <CodeBlock code={current.junior.code} lang={current.junior.lang} title={current.junior.title} maxHeight={600} />
                {problems}
              </div>
              <div className="min-w-0">
                <CodeBlock code={current.senior.code} lang={current.senior.lang} title={current.senior.title} maxHeight={600} />
                {wins}
              </div>
            </div>
          ) : (
            <div className="mt-2 grid gap-4 xl:grid-cols-[1fr_330px]">
              <div className="min-w-0">
                {tab === 'junior' ? (
                  <CodeBlock key="j" code={current.junior.code} lang={current.junior.lang} title={current.junior.title} />
                ) : (
                  <CodeBlock key="s" code={current.senior.code} lang={current.senior.lang} title={current.senior.title} />
                )}
              </div>
              <div className="my-5 h-fit">{tab === 'junior' ? problems : wins}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
