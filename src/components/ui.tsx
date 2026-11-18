import { Bot, Cloud, Code2, Database, Globe, LayoutDashboard, Radio, Server, SquareTerminal, Workflow } from 'lucide-react';
import type { ReactNode } from 'react';
import type { ModuleIcon as ModuleIconName } from '../types';

const MODULE_ICONS: Record<ModuleIconName, typeof Globe> = {
  globe: Globe,
  code: Code2,
  terminal: SquareTerminal,
  server: Server,
  database: Database,
  layout: LayoutDashboard,
  radio: Radio,
  workflow: Workflow,
  bot: Bot,
  cloud: Cloud,
};

export function ModuleIcon({ icon, className }: { icon: ModuleIconName; className?: string }) {
  const Icon = MODULE_ICONS[icon];
  return <Icon className={className} />;
}

export function ProgressBar({ value, tone = 'bg-brand', className = '' }: { value: number; tone?: string; className?: string }) {
  return (
    <div className={`h-2 overflow-hidden rounded-full bg-surface-2 ${className}`}>
      <div className={`h-full rounded-full ${tone} transition-all duration-500`} style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  );
}

export function ProgressRing({ value, size = 44, stroke = 5 }: { value: number; size?: number; stroke?: number }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} className="-rotate-90" aria-hidden>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--surface-2)" strokeWidth={stroke} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="url(#ring-grad)"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - Math.max(0, Math.min(100, value)) / 100)}
        style={{ transition: 'stroke-dashoffset 600ms ease' }}
      />
      <defs>
        <linearGradient id="ring-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#7c5cff" />
          <stop offset="1" stopColor="#14b8a6" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function SectionHeader({ step, title, subtitle, id, icon }: { step: string; title: string; subtitle?: string; id: string; icon: ReactNode }) {
  return (
    <div id={id} className="mb-5 mt-16 scroll-mt-6 first:mt-0">
      <div className="flex items-center gap-3">
        <span className="brand-gradient flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-soft">{icon}</span>
        <div>
          <div className="text-[12px] font-semibold text-faint">{step}</div>
          <h2 className="text-[24px] font-bold leading-tight tracking-tight text-fg">{title}</h2>
        </div>
      </div>
      {subtitle && <p className="ms-[52px] mt-1 text-[14px] text-faint">{subtitle}</p>}
    </div>
  );
}

export function Pill({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border border-line bg-surface px-2.5 py-0.5 text-[12px] font-medium text-muted ${className}`}>
      {children}
    </span>
  );
}
