import { MousePointerClick } from 'lucide-react';
import { useState } from 'react';
import type { DiagramSpec } from '../types';
import { toneHex, toneSoft, toneText } from './tones';

export function FlowDiagram({ spec }: { spec: DiagramSpec }) {
  const [active, setActive] = useState<string | null>(null);
  const selected = spec.columns.flatMap((col, ci) => col.map((n, ni) => ({ n, id: `${ci}:${ni}` }))).find((x) => x.id === active)?.n;

  return (
    <div className="card shadow-soft my-6 overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-5 py-3">
        <div className="text-[14px] font-semibold text-fg">{spec.title}</div>
        <div className="flex items-center gap-1.5 text-[12px] text-faint">
          <MousePointerClick className="h-3.5 w-3.5" /> לחץ על רכיב כדי לראות מה הוא עושה
        </div>
      </div>
      <div className="bg-dots overflow-x-auto p-5">
        <div className="flex min-w-max items-stretch">
          {spec.columns.map((col, ci) => (
            <div key={ci} className="flex items-center">
              <div className="flex flex-col justify-center gap-3">
                {col.map((node, ni) => {
                  const tone = node.tone ?? 'violet';
                  const id = `${ci}:${ni}`;
                  const isActive = active === id;
                  return (
                    <button
                      key={id}
                      onClick={() => setActive(isActive ? null : id)}
                      className={`w-44 rounded-xl border bg-surface px-3.5 py-3 text-start transition hover:-translate-y-0.5 hover:shadow-md ${toneSoft[tone]}`}
                      style={isActive ? { boxShadow: `0 0 0 2px ${toneHex[tone]}` } : undefined}
                    >
                      <div dir="auto" className={`text-[14px] font-semibold ${toneText[tone]}`}>
                        {node.label}
                      </div>
                      {node.sub && <div className="mt-0.5 text-[12px] leading-4 text-muted">{node.sub}</div>}
                    </button>
                  );
                })}
              </div>
              {ci < spec.columns.length - 1 && (
                <svg width="52" height="24" viewBox="0 0 52 24" className="mx-1 shrink-0" aria-hidden>
                  {/* RTL: flow goes right → left */}
                  <line x1="50" y1="12" x2="8" y2="12" stroke="var(--brand)" strokeOpacity="0.55" strokeWidth="2" className="flow-dash" />
                  <path d="M10 6 L3 12 L10 18" fill="none" stroke="var(--brand)" strokeOpacity="0.85" strokeWidth="2" />
                </svg>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="min-h-[58px] border-t border-line bg-surface-2/60 px-5 py-3.5 text-[14.5px] leading-6">
        {selected ? (
          <div className="animate-fade-up">
            <span className={`font-semibold ${toneText[selected.tone ?? 'violet']}`}>{selected.label}: </span>
            <span className="text-muted">{selected.detail}</span>
          </div>
        ) : (
          <span className="text-faint">בחר רכיב בתרשים כדי לקרוא הסבר קצר עליו.</span>
        )}
      </div>
    </div>
  );
}
