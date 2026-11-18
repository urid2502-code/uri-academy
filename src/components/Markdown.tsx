import { AlertTriangle, Info, Lightbulb, ShieldAlert, Sparkles } from 'lucide-react';
import { Fragment, memo, useMemo, type ReactNode } from 'react';
import { CodeBlock } from './CodeBlock';

/**
 * Minimal, dependency-free Markdown renderer for the curriculum:
 * headings, paragraphs, lists, fenced code, tables, callouts (`> [!tip]` …) and inline **bold**, *italic*, `code`.
 */

type Block =
  | { t: 'h'; level: number; text: string }
  | { t: 'p'; text: string }
  | { t: 'ul' | 'ol'; items: string[] }
  | { t: 'code'; lang: string; title?: string; code: string }
  | { t: 'table'; head: string[]; rows: string[][] }
  | { t: 'callout'; kind: string; text: string }
  | { t: 'hr' };

function parse(src: string): Block[] {
  const lines = src.replace(/\r\n/g, '\n').split('\n');
  const blocks: Block[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) {
      i++;
      continue;
    }
    const fence = line.match(/^```(\w+)?(?:\s+(.*))?$/);
    if (fence) {
      const buf: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) buf.push(lines[i++]);
      i++;
      blocks.push({ t: 'code', lang: fence[1] ?? 'text', title: fence[2], code: buf.join('\n') });
      continue;
    }
    const h = line.match(/^(#{2,4})\s+(.*)$/);
    if (h) {
      blocks.push({ t: 'h', level: h[1].length, text: h[2] });
      i++;
      continue;
    }
    if (/^---+\s*$/.test(line)) {
      blocks.push({ t: 'hr' });
      i++;
      continue;
    }
    if (line.startsWith('>')) {
      const buf: string[] = [];
      while (i < lines.length && lines[i].startsWith('>')) buf.push(lines[i++].replace(/^>\s?/, ''));
      const first = buf[0]?.match(/^\[!(\w+)\]\s*(.*)$/);
      const kind = first ? first[1].toLowerCase() : 'note';
      if (first) buf[0] = first[2];
      blocks.push({ t: 'callout', kind, text: buf.join('\n').trim() });
      continue;
    }
    if (line.startsWith('|')) {
      const rows: string[][] = [];
      while (i < lines.length && lines[i].startsWith('|')) {
        const cells = lines[i]
          .trim()
          .replace(/^\||\|$/g, '')
          .split(/(?<!\\)\|/)
          .map((c) => c.trim().replace(/\\\|/g, '|'));
        if (!cells.every((c) => /^:?-+:?$/.test(c))) rows.push(cells);
        i++;
      }
      blocks.push({ t: 'table', head: rows[0] ?? [], rows: rows.slice(1) });
      continue;
    }
    if (/^\s*[-*]\s+/.test(line) || /^\s*\d+\.\s+/.test(line)) {
      const ordered = /^\s*\d+\./.test(line);
      const items: string[] = [];
      while (i < lines.length && (ordered ? /^\s*\d+\.\s+/ : /^\s*[-*]\s+/).test(lines[i])) {
        let item = lines[i].replace(/^\s*(?:[-*]|\d+\.)\s+/, '');
        i++;
        while (i < lines.length && /^\s{2,}\S/.test(lines[i])) {
          item += '\n' + lines[i].trim();
          i++;
        }
        items.push(item);
      }
      blocks.push({ t: ordered ? 'ol' : 'ul', items });
      continue;
    }
    const buf: string[] = [];
    while (i < lines.length && lines[i].trim() && !/^(#{2,4}\s|```|>|\||\s*[-*]\s+|\s*\d+\.\s+)/.test(lines[i])) buf.push(lines[i++]);
    blocks.push({ t: 'p', text: buf.join(' ') });
  }
  return blocks;
}

export function Inline({ text }: { text: string }) {
  const parts: ReactNode[] = [];
  const re = /(`[^`]+`|\*\*(?:`[^`]+`|[^*`])+\*\*|\*[^*\s`][^*`]*\*)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let k = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    const tok = m[0];
    if (tok.startsWith('`'))
      parts.push(
        <code key={k++} dir="ltr" className="rounded-md border border-line bg-surface-2 px-1.5 py-0.5 font-mono text-[0.85em] text-blue-800 dark:text-sky-200">
          {tok.slice(1, -1)}
        </code>,
      );
    else if (tok.startsWith('**'))
      parts.push(
        <strong key={k++} className="font-semibold text-fg">
          <Inline text={tok.slice(2, -2)} />
        </strong>,
      );
    else parts.push(<em key={k++}>{tok.slice(1, -1)}</em>);
    last = m.index + tok.length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts.map((p, i) => (typeof p === 'string' ? <Fragment key={`s${i}`}>{p}</Fragment> : p))}</>;
}

/** List items may contain nested sub-items on continuation lines that start with "- ". */
function ListItemBody({ text }: { text: string }) {
  const [first, ...rest] = text.split('\n');
  const sub = rest.filter((l) => /^[-*]\s+/.test(l)).map((l) => l.replace(/^[-*]\s+/, ''));
  const extra = rest.filter((l) => !/^[-*]\s+/.test(l)).join(' ');
  return (
    <span>
      <Inline text={extra ? `${first} ${extra}` : first} />
      {sub.length > 0 && (
        <ul className="mt-1.5 space-y-1">
          {sub.map((s, i) => (
            <li key={i} className="flex gap-2.5 text-[15px]">
              <span className="mt-[10px] h-1 w-1 shrink-0 rounded-full bg-faint" />
              <span>
                <Inline text={s} />
              </span>
            </li>
          ))}
        </ul>
      )}
    </span>
  );
}

const CALLOUTS: Record<string, { icon: typeof Info; cls: string; label: string }> = {
  tip: { icon: Lightbulb, cls: 'border-emerald-500/30 bg-emerald-500/[0.07] text-emerald-700 dark:text-emerald-300', label: 'טיפ של מקצוענים' },
  warn: { icon: AlertTriangle, cls: 'border-amber-500/35 bg-amber-500/[0.08] text-amber-700 dark:text-amber-300', label: 'זהירות' },
  danger: { icon: ShieldAlert, cls: 'border-rose-500/35 bg-rose-500/[0.07] text-rose-700 dark:text-rose-300', label: 'סכנה' },
  example: { icon: Sparkles, cls: 'border-sky-500/30 bg-sky-500/[0.07] text-sky-800 dark:text-sky-300', label: 'דוגמה מהחיים' },
  fintech: { icon: Sparkles, cls: 'border-sky-500/30 bg-sky-500/[0.07] text-sky-800 dark:text-sky-300', label: 'דוגמה מהחיים' },
  note: { icon: Info, cls: 'border-sky-500/30 bg-sky-500/[0.07] text-sky-700 dark:text-sky-300', label: 'שים לב' },
};

export const Markdown = memo(function Markdown({ source }: { source: string }) {
  const blocks = useMemo(() => parse(source), [source]);
  return (
    <div className="space-y-4 text-[16px] leading-8 text-muted">
      {blocks.map((b, i) => {
        switch (b.t) {
          case 'h':
            if (b.level === 2)
              return (
                <h2 key={i} className="pt-5 text-[22px] font-bold tracking-tight text-fg">
                  <Inline text={b.text} />
                </h2>
              );
            if (b.level === 3)
              return (
                <h3 key={i} className="pt-3 text-[18px] font-semibold text-fg">
                  <Inline text={b.text} />
                </h3>
              );
            return (
              <h4 key={i} className="pt-2 text-[15px] font-semibold text-fg">
                <Inline text={b.text} />
              </h4>
            );
          case 'p':
            return (
              <p key={i}>
                <Inline text={b.text} />
              </p>
            );
          case 'ul':
            return (
              <ul key={i} className="space-y-2">
                {b.items.map((it, j) => (
                  <li key={j} className="flex gap-3">
                    <span className="mt-[13px] h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                    <ListItemBody text={it} />
                  </li>
                ))}
              </ul>
            );
          case 'ol':
            return (
              <ol key={i} className="space-y-2.5">
                {b.items.map((it, j) => (
                  <li key={j} className="flex gap-3">
                    <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand/12 text-[12px] font-bold text-brand">
                      {j + 1}
                    </span>
                    <ListItemBody text={it} />
                  </li>
                ))}
              </ol>
            );
          case 'code':
            return <CodeBlock key={i} code={b.code} lang={b.lang} title={b.title} />;
          case 'hr':
            return <hr key={i} className="border-line" />;
          case 'table':
            return (
              <div key={i} className="overflow-x-auto rounded-2xl border border-line bg-surface">
                <table className="w-full text-start text-[14.5px] leading-6">
                  <thead className="bg-surface-2 text-[13px] text-fg">
                    <tr>
                      {b.head.map((h, j) => (
                        <th key={j} className="px-4 py-3 text-start font-semibold">
                          <Inline text={h} />
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {b.rows.map((r, j) => (
                      <tr key={j}>
                        {r.map((c, k) => (
                          <td key={k} className={`px-4 py-3 align-top ${k === 0 ? 'font-medium text-fg' : ''}`}>
                            <Inline text={c} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          case 'callout': {
            const c = CALLOUTS[b.kind] ?? CALLOUTS.note;
            const Icon = c.icon;
            return (
              <div key={i} className={`rounded-2xl border px-5 py-4 ${c.cls}`}>
                <div className="mb-1.5 flex items-center gap-2 text-[13px] font-bold">
                  <Icon className="h-4 w-4" />
                  {c.label}
                </div>
                <div className="text-[15px] leading-7 text-muted">
                  {b.text.split(/\n\s*\n/).map((para, j) => (
                    <p key={j} className={j ? 'mt-2' : ''}>
                      <Inline text={para.replace(/\n/g, ' ')} />
                    </p>
                  ))}
                </div>
              </div>
            );
          }
        }
      })}
    </div>
  );
});
