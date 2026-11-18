import { Check, Copy, FileCode2 } from 'lucide-react';
import { memo, useMemo, useState } from 'react';
import { tokenize } from '../lib/highlight';

interface Props {
  code: string;
  lang: string;
  title?: string;
  maxHeight?: number;
}

const LANG_LABEL: Record<string, string> = {
  typescript: 'TypeScript',
  ts: 'TypeScript',
  tsx: 'TSX',
  javascript: 'JavaScript',
  js: 'JavaScript',
  sql: 'SQL',
  yaml: 'YAML',
  bash: 'Terminal',
  shell: 'Terminal',
  powershell: 'PowerShell',
  dockerfile: 'Dockerfile',
  json: 'JSON',
  proto: 'Protobuf',
  html: 'HTML',
  css: 'CSS',
  text: 'Text',
};

export const CodeBlock = memo(function CodeBlock({ code, lang, title, maxHeight }: Props) {
  const [copied, setCopied] = useState(false);
  const tokens = useMemo(() => tokenize(code, lang), [code, lang]);
  const lineCount = useMemo(() => code.split('\n').length, [code]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = code;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="code-surface my-5 overflow-hidden rounded-2xl border border-black/10 shadow-soft dark:border-white/10">
      <div className="flex items-center justify-between gap-3 border-b border-white/10 bg-white/[0.03] px-4 py-2.5">
        <div className="flex min-w-0 items-center gap-2 text-xs text-[#b5b1d6]">
          <span className="flex gap-1.5" aria-hidden>
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          </span>
          <FileCode2 className="ms-2 h-3.5 w-3.5 shrink-0 text-violet-300" />
          <span className="truncate font-medium text-[#e5e3f5]">{title ?? 'קוד'}</span>
          <span className="rounded-md bg-white/10 px-1.5 py-px font-mono text-[10px] uppercase tracking-wide text-[#b5b1d6]">
            {LANG_LABEL[lang] ?? lang}
          </span>
        </div>
        <button
          onClick={copy}
          className="flex shrink-0 items-center gap-1.5 rounded-lg bg-white/10 px-2.5 py-1 text-[11px] text-[#e5e3f5] transition hover:bg-white/20"
          aria-label="העתק קוד"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? 'הועתק' : 'העתק'}
        </button>
      </div>
      <div dir="ltr" className="overflow-auto text-left" style={{ maxHeight: maxHeight ?? 620 }}>
        <div className="flex min-w-max">
          <div aria-hidden className="select-none border-r border-white/5 py-4 pl-4 pr-3 text-right font-mono text-[12px] leading-[1.75] text-[#5d5980]">
            {Array.from({ length: lineCount }, (_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>
          <pre className="flex-1 py-4 pl-4 pr-6 font-mono text-[12.5px] leading-[1.75]">
            <code>
              {tokens.map((t, i) =>
                t.cls ? (
                  <span key={i} className={t.cls}>
                    {t.text}
                  </span>
                ) : (
                  t.text
                ),
              )}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
});
