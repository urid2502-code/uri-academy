import { MousePointerClick, Pause, Play, RotateCcw } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { useEffect, useState } from 'react';
import type { DiagramSpec } from '../types';
import { toneHex, toneSoft, toneText } from './tones';

const STEP_MS = 1100;

export function FlowDiagram({ spec, autoPlay = false }: { spec: DiagramSpec; autoPlay?: boolean }) {
  const reducedMotion = useReducedMotion();
  const [active, setActive] = useState<string | null>(null);
  // `stage` is the column the playback has reached; null means the scenario has not started.
  const [stage, setStage] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const columns = spec.columns.length;
  const selected = spec.columns.flatMap((col, ci) => col.map((n, ni) => ({ n, id: `${ci}:${ni}` }))).find((x) => x.id === active)?.n;
  const stageNodes = stage === null ? [] : spec.columns[stage];

  useEffect(() => {
    if (!autoPlay || reducedMotion) return;
    const timer = window.setTimeout(() => setPlaying(true), 700);
    return () => window.clearTimeout(timer);
  }, [autoPlay, reducedMotion]);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setTimeout(
      () => {
        if (stage === null) setStage(0);
        else if (stage < columns - 1) setStage(stage + 1);
        else setPlaying(false);
      },
      stage === null ? 150 : STEP_MS,
    );
    return () => window.clearTimeout(timer);
  }, [playing, stage, columns]);

  const finished = stage === columns - 1 && !playing;
  const toggle = () => {
    if (playing) return setPlaying(false);
    setActive(null);
    if (finished || stage === null) setStage(null);
    setPlaying(true);
  };

  return (
    <div className="card shadow-soft my-6 overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-3">
        <div className="text-[14px] font-semibold text-fg">{spec.title}</div>
        <div className="flex items-center gap-4">
          <span className="hidden items-center gap-1.5 text-[12px] text-faint sm:flex">
            <MousePointerClick className="h-3.5 w-3.5" /> לחץ על רכיב כדי לראות מה הוא עושה
          </span>
          <button onClick={toggle} className="flow-play" aria-label={playing ? 'השהיית התרחיש' : finished ? 'הפעלה חוזרת של התרחיש' : 'הפעלת התרחיש'}>
            {playing ? <Pause className="h-3.5 w-3.5" /> : finished ? <RotateCcw className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            {playing ? 'השהה' : finished ? 'שוב' : 'הפעל תרחיש'}
          </button>
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
                  const lit = stage !== null && ci === stage;
                  const dim = stage !== null && ci > stage;
                  return (
                    <button
                      key={id}
                      onClick={() => {
                        setPlaying(false);
                        setStage(null);
                        setActive(isActive ? null : id);
                      }}
                      className={`w-44 rounded-xl border bg-surface px-3.5 py-3 text-start transition duration-300 hover:-translate-y-0.5 hover:shadow-md ${toneSoft[tone]} ${dim ? 'opacity-45' : ''}`}
                      style={isActive || lit ? { boxShadow: `0 0 0 2px ${toneHex[tone]}` } : undefined}
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
                  <line
                    x1="50"
                    y1="12"
                    x2="8"
                    y2="12"
                    stroke="var(--brand)"
                    strokeOpacity={stage !== null && stage <= ci ? 0.18 : 0.55}
                    strokeWidth="2"
                    className="flow-dash"
                    style={{ transition: 'stroke-opacity 300ms ease-out' }}
                  />
                  <path d="M10 6 L3 12 L10 18" fill="none" stroke="var(--brand)" strokeOpacity={stage !== null && stage <= ci ? 0.25 : 0.85} strokeWidth="2" />
                  {stage === ci + 1 && playing && !reducedMotion && (
                    <motion.circle key={`packet-${stage}`} cy="12" r="4" fill="var(--brand)" initial={{ cx: 50 }} animate={{ cx: 8 }} transition={{ duration: 0.6, ease: 'easeOut' }} />
                  )}
                </svg>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="min-h-[58px] border-t border-line bg-surface-2/60 px-5 py-3.5 text-[14.5px] leading-6" aria-live="polite">
        {stageNodes.length > 0 ? (
          <div key={stage} className="animate-fade-up">
            <span className="tabular me-2 text-[12px] text-faint">
              {stage! + 1}/{columns}
            </span>
            {stageNodes.map((node) => (
              <span key={node.label} className="me-4 inline">
                <span className={`font-semibold ${toneText[node.tone ?? 'violet']}`}>{node.label}: </span>
                <span className="text-muted">{node.detail}</span>
              </span>
            ))}
          </div>
        ) : selected ? (
          <div className="animate-fade-up">
            <span className={`font-semibold ${toneText[selected.tone ?? 'violet']}`}>{selected.label}: </span>
            <span className="text-muted">{selected.detail}</span>
          </div>
        ) : (
          <span className="text-faint">הפעל את התרחיש כדי לראות איך המידע עובר בין הרכיבים, או בחר רכיב לקריאת הסבר קצר.</span>
        )}
      </div>
    </div>
  );
}
