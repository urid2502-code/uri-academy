export interface Token {
  text: string;
  cls?: string;
}

type Rule = [cls: string, re: RegExp];

const TS_KEYWORDS =
  'abstract|as|async|await|break|case|catch|class|const|continue|declare|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|infer|instanceof|interface|is|keyof|let|namespace|new|of|private|protected|public|readonly|return|satisfies|set|static|super|switch|throw|try|type|typeof|unique|var|void|while|with|yield|using';
const TS_CONSTS = 'true|false|null|undefined|this|NaN|Infinity';
const TS_TYPES = 'string|number|boolean|unknown|never|any|bigint|symbol|object|void';

const tsRules: Rule[] = [
  ['tok-comment', /\/\/[^\n]*|\/\*[\s\S]*?\*\//y],
  ['tok-string', /`(?:\\[\s\S]|[^\\`])*`|'(?:\\.|[^\\'\n])*'|"(?:\\.|[^\\"\n])*"/y],
  ['tok-keyword', new RegExp(`\\b(?:${TS_KEYWORDS})\\b`, 'y')],
  ['tok-const', new RegExp(`\\b(?:${TS_CONSTS})\\b`, 'y')],
  ['tok-type', new RegExp(`\\b(?:${TS_TYPES})\\b`, 'y')],
  ['tok-number', /\b(?:0x[\da-fA-F_]+|\d[\d_]*(?:\.\d+)?(?:e[+-]?\d+)?n?)\b/y],
  ['tok-type', /\b[A-Z][A-Za-z0-9_]*\b/y],
  ['tok-fn', /\b[a-zA-Z_$][\w$]*(?=\s*(?:<[^<>()]*>)?\()/y],
  ['tok-prop', /(?<=\.)[a-zA-Z_$][\w$]*/y],
  ['tok-punct', /=>|[{}()[\];,.<>:?!|&=+\-*/%]/y],
];

const javaRules: Rule[] = [
  tsRules[0],
  ['tok-string', /"(?:\\.|[^\\"\n])*"|'(?:\\.|[^\\'\n])*'/y],
  ['tok-keyword', /\b(?:abstract|assert|break|case|catch|class|continue|default|do|else|enum|extends|final|finally|for|if|implements|import|instanceof|interface|new|package|private|protected|public|record|return|sealed|static|super|switch|synchronized|this|throw|throws|try|var|while|yield)\b/y],
  ['tok-type', /\b(?:boolean|byte|char|double|float|int|long|short|void)\b/y],
  ['tok-const', /\b(?:true|false|null)\b/y],
  ['tok-number', /\b\d[\d_]*(?:\.\d+)?[lLfFdD]?\b/y],
  ...tsRules.slice(6),
];

const SQL_KEYWORDS =
  'select|from|where|and|or|not|insert|into|values|update|set|delete|create|table|index|unique|on|primary|key|references|foreign|constraint|default|null|is|in|as|join|left|right|inner|outer|group|by|order|having|limit|offset|returning|conflict|do|nothing|begin|commit|rollback|transaction|isolation|level|serializable|repeatable|read|committed|for|skip|locked|nowait|partition|range|list|hash|of|with|using|gin|btree|brin|gist|include|concurrently|if|exists|explain|analyze|buffers|alter|add|column|check|generated|always|identity|cascade|case|when|then|else|end|over|desc|asc|distinct|interval|lateral|exclude|between|like|ilike|row|level|security|policy|enable|to|grant|function|returns|language|trigger|execute|procedure|before|after|each|new|old|declare|vacuum|cluster|nulls|first|last|filter|coalesce|count|sum|avg|max|min|now|true|false';
const SQL_TYPES =
  'uuid|text|varchar|int|integer|bigint|smallint|numeric|decimal|boolean|bool|timestamptz|timestamp|date|jsonb|json|bytea|serial|bigserial|real|double|precision|inet|char';

const sqlRules: Rule[] = [
  ['tok-comment', /--[^\n]*|\/\*[\s\S]*?\*\//y],
  ['tok-string', /'(?:''|[^'])*'/y],
  ['tok-number', /\b\d+(?:\.\d+)?\b/y],
  ['tok-type', new RegExp(`\\b(?:${SQL_TYPES})\\b`, 'iy')],
  ['tok-keyword', new RegExp(`\\b(?:${SQL_KEYWORDS})\\b`, 'iy')],
  ['tok-fn', /\b[a-zA-Z_][\w]*(?=\()/y],
  ['tok-const', /\$\d+/y],
  ['tok-punct', /->>|->|@>|::|[(),;.=<>*+\-|]/y],
];

const yamlRules: Rule[] = [
  ['tok-comment', /#[^\n]*/y],
  ['tok-prop', /[\w.\-/]+(?=\s*:(?:\s|$))/y],
  ['tok-string', /"(?:\\.|[^"\\])*"|'(?:''|[^'])*'/y],
  ['tok-number', /\b\d+(?:\.\d+)?(?:m|Mi|Gi|s|ms)?\b/y],
  ['tok-const', /\b(?:true|false|null)\b/y],
  ['tok-punct', /[:\-[\]{}|>]/y],
];

const bashRules: Rule[] = [
  ['tok-comment', /#[^\n]*/y],
  ['tok-string', /"(?:\\.|[^"\\])*"|'[^']*'/y],
  ['tok-keyword', /\b(?:if|then|else|fi|for|do|done|while|case|esac|exec|export|FROM|RUN|COPY|WORKDIR|ENV|USER|EXPOSE|CMD|ENTRYPOINT|ARG|AS|HEALTHCHECK)\b/y],
  ['tok-const', /\$\{?[\w]+\}?/y],
  ['tok-prop', /--?[\w-]+/y],
  ['tok-number', /\b\d+\b/y],
];

const jsonRules: Rule[] = [
  ['tok-prop', /"(?:\\.|[^"\\])*"(?=\s*:)/y],
  ['tok-string', /"(?:\\.|[^"\\])*"/y],
  ['tok-number', /-?\b\d+(?:\.\d+)?(?:e[+-]?\d+)?\b/y],
  ['tok-const', /\b(?:true|false|null)\b/y],
  ['tok-punct', /[{}[\],:]/y],
];

const protoRules: Rule[] = [
  ['tok-comment', /\/\/[^\n]*/y],
  ['tok-string', /"(?:\\.|[^"\\])*"/y],
  ['tok-keyword', /\b(?:syntax|package|message|enum|repeated|optional|reserved|import|service|rpc|returns|oneof|map|option)\b/y],
  ['tok-type', /\b(?:string|int32|int64|uint32|uint64|bool|double|float|bytes|[A-Z]\w*)\b/y],
  ['tok-number', /\b\d+\b/y],
  ['tok-punct', /[{}=;<>,]/y],
];

const htmlRules: Rule[] = [
  ['tok-comment', /<!--[\s\S]*?-->/y],
  ['tok-keyword', /<\/?[a-zA-Z][\w-]*|\/?>|<!doctype/iy],
  ['tok-prop', /\b[a-zA-Z-:@]+(?==)/y],
  ['tok-string', /"[^"]*"|'[^']*'/y],
];

const cssRules: Rule[] = [
  ['tok-comment', /\/\*[\s\S]*?\*\//y],
  ['tok-string', /"[^"]*"|'[^']*'/y],
  ['tok-prop', /[a-z-]+(?=\s*:[^:])/y],
  ['tok-number', /#[\da-fA-F]{3,8}\b|-?\d+(?:\.\d+)?(?:px|rem|em|%|vh|vw|s|ms)?/y],
  ['tok-keyword', /@[a-z-]+/y],
  ['tok-type', /[.#][a-zA-Z][\w-]*/y],
  ['tok-punct', /[{}:;,()]/y],
];

const LANGS: Record<string, Rule[]> = {
  html: htmlRules,
  css: cssRules,
  powershell: bashRules,
  typescript: tsRules,
  ts: tsRules,
  tsx: tsRules,
  javascript: tsRules,
  js: tsRules,
  java: javaRules,
  sql: sqlRules,
  yaml: yamlRules,
  yml: yamlRules,
  bash: bashRules,
  shell: bashRules,
  dockerfile: bashRules,
  json: jsonRules,
  proto: protoRules,
  protobuf: protoRules,
};

export function tokenize(code: string, lang: string): Token[] {
  const rules = LANGS[lang.toLowerCase()];
  if (!rules) return [{ text: code }];
  const out: Token[] = [];
  let plain = '';
  let i = 0;
  const n = code.length;
  outer: while (i < n) {
    for (const [cls, re] of rules) {
      re.lastIndex = i;
      const m = re.exec(code);
      if (m && m[0].length > 0) {
        if (plain) {
          out.push({ text: plain });
          plain = '';
        }
        out.push({ text: m[0], cls });
        i += m[0].length;
        continue outer;
      }
    }
    // Consume a whole identifier at once so keyword rules don't match mid-word.
    const word = /[\w$]+/y;
    word.lastIndex = i;
    const w = word.exec(code);
    if (w) {
      plain += w[0];
      i += w[0].length;
    } else {
      plain += code[i];
      i += 1;
    }
  }
  if (plain) out.push({ text: plain });
  return out;
}
