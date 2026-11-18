/**
 * Long-form content (prose, code, solutions) lives in `.md` files so it can contain
 * backticks and `${}` freely. Blocks are delimited by lines of the form:
 *
 *   @@ <key> <kind> [lang] [| title]
 *
 * e.g. `@@ m1-l1 code typescript | Idempotent ingestion endpoint`
 */
export interface RawBlock {
  key: string;
  kind: string;
  lang?: string;
  title?: string;
  body: string;
}

export function parseBlocks(source: string): RawBlock[] {
  const blocks: RawBlock[] = [];
  let current: RawBlock | null = null;
  const lines: string[] = [];

  const flush = () => {
    if (current) {
      current.body = lines.join('\n').replace(/^\n+|\s+$/g, '');
      blocks.push(current);
    }
    lines.length = 0;
  };

  for (const line of source.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n').split('\n')) {
    if (line.startsWith('@@ ')) {
      flush();
      const [head, title] = line.slice(3).split(' | ');
      const [key, kind, lang] = head.trim().split(/\s+/);
      current = { key, kind, lang, title: title?.trim(), body: '' };
    } else if (current) {
      lines.push(line);
    }
  }
  flush();
  return blocks;
}

export class BlockStore {
  private blocks: RawBlock[];
  constructor(source: string) {
    this.blocks = parseBlocks(source);
  }

  text(key: string, kind: string): string {
    const b = this.blocks.find((x) => x.key === key && x.kind === kind);
    if (!b) throw new Error(`Missing content block: ${key} ${kind}`);
    return b.body;
  }

  code(key: string, kind = 'code') {
    return this.blocks
      .filter((x) => x.key === key && x.kind === kind)
      .map((b) => ({ title: b.title ?? 'Example', lang: b.lang ?? 'typescript', code: b.body }));
  }

  one(key: string, kind: string) {
    const [first] = this.code(key, kind);
    if (!first) throw new Error(`Missing code block: ${key} ${kind}`);
    return first;
  }
}
