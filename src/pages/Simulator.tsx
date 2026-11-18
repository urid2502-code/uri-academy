import {
  Activity,
  AlertTriangle,
  BarChart3,
  Bot,
  CheckCircle2,
  Database,
  Gauge,
  Info,
  Layers,
  LayoutDashboard,
  MonitorSmartphone,
  Pause,
  Play,
  RotateCcw,
  Server,
  Terminal,
  Timer,
  XCircle,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { CodeBlock } from '../components/CodeBlock';

type StageId = 'client' | 'api' | 'queue' | 'worker' | 'db' | 'live';
type FailureId = 'queueLag' | 'llmTimeout' | 'dbFailover' | 'wsDrop' | 'poison';
type Status = 'idle' | 'active' | 'ok' | 'degraded' | 'failed' | 'skipped';
type Level = 'info' | 'warn' | 'error' | 'ok';

interface StageDef {
  id: StageId;
  label: string;
  tech: string;
  icon: typeof Server;
  role: string;
  narration: string;
}

const STAGES: StageDef[] = [
  {
    id: 'client',
    label: 'Browser',
    tech: 'React · fetch',
    icon: MonitorSmartphone,
    role: 'ה-Client: המשתמש לוחץ על כפתור, והדפדפן שולח Request עם JSON.',
    narration: 'המשתמש לחץ על כפתור. קוד React בונה אובייקט JSON ושולח אותו ב-HTTP POST לשרת, יחד עם Idempotency-Key כדי שניסיון חוזר לא ייצור כפילות.',
  },
  {
    id: 'api',
    label: 'API Server',
    tech: 'Node.js · Zod',
    icon: Server,
    role: 'בודק מי המשתמש (Authentication), מאמת את הנתונים (Validation) ומכניס משימה לתור.',
    narration: 'השרת מוודא שהמשתמש מחובר, בודק עם Zod שה-JSON תקין, ובמקום לעשות את כל העבודה הכבדה עכשיו – הוא שם הודעה ב-Queue ומחזיר מיד 202 Accepted.',
  },
  {
    id: 'queue',
    label: 'Queue',
    tech: 'Kafka · Topic',
    icon: Layers,
    role: 'תור הודעות עמיד: שומר את ההודעה עד שמישהו יעבד אותה, גם אם שרתים נופלים.',
    narration: 'ההודעה נשמרת ב-Topic בתוך Kafka. היא לא תאבד גם אם ה-Worker כרגע עסוק או נפל – היא מחכה בתור עד שמישהו יטפל בה.',
  },
  {
    id: 'worker',
    label: 'Worker + AI',
    tech: 'Consumer · LLM',
    icon: Bot,
    role: 'ה-Consumer שולף הודעה, מריץ בדיקות מהירות (Rules) ואז שואל מודל AI.',
    narration: 'ה-Worker מושך את ההודעה מהתור. קודם הוא מריץ Rules מהירים (מילישניות), ואז שולח את המידע ל-LLM לניתוח עמוק יותר – עם Timeout, כדי שלא יחכה לנצח.',
  },
  {
    id: 'db',
    label: 'Database',
    tech: 'PostgreSQL',
    icon: Database,
    role: 'שומר את התוצאה בתוך Transaction אחת, כך שאין מצב של "חצי שמירה".',
    narration: 'התוצאה נשמרת ב-PostgreSQL בתוך Transaction: או שהכל נשמר, או ששום דבר. ה-UPSERT מבטיח שאם אותה הודעה תגיע פעמיים – לא תיווצר כפילות.',
  },
  {
    id: 'live',
    label: 'Live Dashboard',
    tech: 'WebSocket · React',
    icon: LayoutDashboard,
    role: 'דוחף את התוצאה למסך בזמן אמת דרך WebSocket – בלי שהמשתמש ירענן.',
    narration: 'השרת דוחף את התוצאה דרך WebSocket למסך הפתוח. React מעדכן רק את החלק שהשתנה, והסבר ה-AI מופיע מילה אחרי מילה (Streaming).',
  },
];

const FAILURES: { id: FailureId; label: string; stage: StageId; desc: string }[] = [
  { id: 'queueLag', label: 'עומס בתור (Queue Lag)', stage: 'queue', desc: 'יותר מדי הודעות בבת אחת – ה-Consumers מפגרים מאחור.' },
  { id: 'llmTimeout', label: 'ה-AI לא עונה (Timeout)', stage: 'worker', desc: 'ספק ה-LLM תקוע. אחרי 800ms עוברים לגיבוי מבוסס Rules.' },
  { id: 'dbFailover', label: 'ה-Database מתחלף (Failover)', stage: 'db', desc: 'השרת הראשי נפל; כתיבה מנסה שוב (Retry) מול השרת החדש.' },
  { id: 'wsDrop', label: 'חיבור ה-WebSocket נפל', stage: 'live', desc: 'Heartbeat מזהה את הניתוק, וה-Client מתחבר מחדש וממשיך מאיפה שעצר.' },
  { id: 'poison', label: 'הודעה פגומה (Poison Message)', stage: 'worker', desc: 'הודעה שתמיד מפילה את הקוד ← 3 ניסיונות ← Dead Letter Queue.' },
];

interface Scenario {
  id: string;
  name: string;
  summary: string;
  payload: string;
  ruleScore: number;
  aiScore: number;
  verdict: string;
  verdictTone: 'good' | 'warn' | 'bad';
  aiText: string;
}

const SCENARIOS: Scenario[] = [
  {
    id: 'suspicious',
    name: 'תשלום חשוד',
    summary: 'העברה של ₪8,400 למוטב חדש בזמן שיחת טלפון',
    payload: `{\n  "type": "payment.created",\n  "amount": 840000,\n  "currency": "ILS",\n  "payeeIsNew": true,\n  "activeCall": true\n}`,
    ruleScore: 0.82,
    aiScore: 0.94,
    verdict: 'עיכוב התשלום ובדיקה',
    verdictTone: 'bad',
    aiText:
      'המשתמש מעביר סכום גבוה למוטב שמעולם לא שילם לו, תוך כדי שיחת טלפון פעילה. זה דפוס נפוץ של הונאה שבה מישהו מנחה את הקורבן בטלפון. ההמלצה: לעכב את התשלום, להציג אזהרה ברורה ולבקש מנציג לחזור ללקוח.',
  },
  {
    id: 'chat',
    name: 'הודעת צ׳אט עם סיכום AI',
    summary: 'הודעה חדשה בקבוצה – ה-AI מסכם את השיחה',
    payload: `{\n  "type": "message.created",\n  "chatId": "team-42",\n  "text": "סיימתי את ה-PR, אפשר לעבור?",\n  "author": "uri"\n}`,
    ruleScore: 0.02,
    aiScore: 0.03,
    verdict: 'נשמר ונשלח לכולם',
    verdictTone: 'good',
    aiText:
      'סיכום השיחה: אורי סיים את ה-Pull Request ומבקש Code Review. כדאי שמישהו מהצוות יעבור עליו היום כדי לא לעכב את השחרור.',
  },
  {
    id: 'order',
    name: 'הזמנה בחנות אונליין',
    summary: 'לקוח הזמין 2 מוצרים – בדיקת מלאי והמלצה',
    payload: `{\n  "type": "order.created",\n  "orderId": 1543,\n  "items": [{ "sku": "KB-01", "qty": 2 }],\n  "total": 49800\n}`,
    ruleScore: 0.08,
    aiScore: 0.11,
    verdict: 'ההזמנה אושרה',
    verdictTone: 'good',
    aiText:
      'ההזמנה תקינה והמלאי מספיק. לקוחות שקנו את המקלדת הזו קנו לעתים קרובות גם משטח עכבר – אפשר להציע אותו במייל האישור.',
  },
  {
    id: 'unusual',
    name: 'התחברות ממדינה חדשה',
    summary: 'כניסה לחשבון ממכשיר ומיקום שלא נראו קודם',
    payload: `{\n  "type": "login.succeeded",\n  "country": "BR",\n  "newDevice": true,\n  "userId": "u_77"\n}`,
    ruleScore: 0.55,
    aiScore: 0.61,
    verdict: 'בקשת אימות נוסף',
    verdictTone: 'warn',
    aiText:
      'ההתחברות הגיעה ממכשיר חדש וממדינה שהמשתמש מעולם לא התחבר ממנה. זה לא בהכרח מסוכן (אולי הוא בחופשה), ולכן ההמלצה היא לבקש אימות נוסף ב-SMS במקום לחסום.',
  },
];

interface StepPlan {
  stage: StageId;
  latency: number;
  status: Exclude<Status, 'idle' | 'active'>;
  logs: { level: Level; msg: string; offset: number }[];
}

interface Plan {
  steps: StepPlan[];
  total: number;
  outcome: 'decided' | 'dlq';
  score: number;
  degraded: boolean;
}

const jitter = (base: number, spread: number) => Math.max(1, Math.round(base + (Math.random() * 2 - 1) * spread));

function buildPlan(sc: Scenario, f: Record<FailureId, boolean>): Plan {
  const steps: StepPlan[] = [];
  const id = `req_${Math.random().toString(36).slice(2, 7)}`;

  const c = jitter(14, 5);
  steps.push({
    stage: 'client',
    latency: c,
    status: 'ok',
    logs: [
      { level: 'info', msg: `המשתמש לחץ – נבנה JSON (${sc.name})`, offset: 0 },
      { level: 'info', msg: `POST /api/events · Idempotency-Key=${id}`, offset: c },
    ],
  });

  const g = jitter(10, 4);
  steps.push({
    stage: 'api',
    latency: g,
    status: 'ok',
    logs: [
      { level: 'info', msg: 'Authentication ✓ – המשתמש מזוהה', offset: 2 },
      { level: 'info', msg: 'Validation ✓ – Zod אישר את מבנה ה-JSON', offset: 5 },
      { level: 'ok', msg: 'נשלח ל-Queue · תשובה ללקוח: 202 Accepted', offset: g },
    ],
  });

  const k = f.queueLag ? jitter(1250, 300) : jitter(6, 3);
  steps.push({
    stage: 'queue',
    latency: k,
    status: f.queueLag ? 'degraded' : 'ok',
    logs: f.queueLag
      ? [
          { level: 'warn', msg: 'Consumer Lag: 18,412 הודעות מחכות בתור', offset: 20 },
          { level: 'warn', msg: 'Autoscaling: מוסיפים Consumers (6 ← 12)', offset: 400 },
          { level: 'info', msg: `ההודעה נשלפה אחרי ${k}ms של המתנה`, offset: k },
        ]
      : [{ level: 'info', msg: 'ההודעה נשלפה מהתור מיד (Lag=3)', offset: k }],
  });

  if (f.poison) {
    const total = 12 + 100 + 12 + 200 + 12 + 400 + 12;
    steps.push({
      stage: 'worker',
      latency: total,
      status: 'failed',
      logs: [
        { level: 'error', msg: 'TypeError: cannot read properties of undefined – ניסיון 1/3', offset: 12 },
        { level: 'warn', msg: 'Retry בעוד 100ms (Exponential Backoff)', offset: 14 },
        { level: 'error', msg: 'ניסיון 2/3 נכשל – אותה שגיאה בדיוק', offset: 124 },
        { level: 'error', msg: 'ניסיון 3/3 נכשל – זו הודעה פגומה, אין טעם לנסות שוב', offset: 336 },
        { level: 'warn', msg: 'ההודעה הועברה ל-Dead Letter Queue · שאר התור ממשיך לזרום', offset: total - 2 },
        { level: 'error', msg: 'Alert נשלח למפתח התורן לבדיקה', offset: total },
      ],
    });
    steps.push({ stage: 'db', latency: 0, status: 'skipped', logs: [] });
    steps.push({ stage: 'live', latency: 0, status: 'skipped', logs: [] });
    return { steps, total: steps.reduce((a, s) => a + s.latency, 0), outcome: 'dlq', score: 0, degraded: true };
  }

  const rules = jitter(15, 4);
  const llm = f.llmTimeout ? 800 : jitter(360, 120);
  const fb = f.llmTimeout ? jitter(18, 5) : 0;
  const a = rules + llm + fb;
  const score = f.llmTimeout ? sc.ruleScore : sc.aiScore;
  steps.push({
    stage: 'worker',
    latency: a,
    status: f.llmTimeout ? 'degraded' : 'ok',
    logs: [
      { level: 'info', msg: `Rules מהירים: ציון ראשוני ${sc.ruleScore.toFixed(2)} (תוך ${rules}ms)`, offset: rules },
      ...(f.llmTimeout
        ? [
            { level: 'warn' as Level, msg: 'LLM: אין תשובה אחרי 600ms…', offset: rules + 600 },
            { level: 'error' as Level, msg: 'Timeout של 800ms ← Circuit Breaker נפתח', offset: rules + 800 },
            { level: 'warn' as Level, msg: `Fallback: ממשיכים עם ציון ה-Rules (${score.toFixed(2)}) ומסמנים לבדיקת אדם`, offset: a },
          ]
        : [
            { level: 'info' as Level, msg: 'LLM: התשובה התחילה לזרום אחרי 140ms', offset: rules + 140 },
            { level: 'ok' as Level, msg: `LLM החזיר JSON תקין (נבדק עם Zod) · ציון ${score.toFixed(2)}`, offset: a },
          ]),
    ],
  });

  const p = f.dbFailover ? 30 + jitter(50, 10) + 30 + jitter(110, 25) + jitter(9, 3) : jitter(8, 3);
  steps.push({
    stage: 'db',
    latency: p,
    status: f.dbFailover ? 'degraded' : 'ok',
    logs: f.dbFailover
      ? [
          { level: 'error', msg: 'הכתיבה נכשלה: החיבור ל-Database נותק', offset: 30 },
          { level: 'warn', msg: 'Retry 1 בעוד ~50ms', offset: 32 },
          { level: 'error', msg: 'נכשל שוב: השרת הישן במצב Read-Only', offset: 110 },
          { level: 'warn', msg: 'Retry 2 בעוד ~110ms – מול השרת הראשי החדש', offset: 112 },
          { level: 'ok', msg: 'COMMIT הצליח: UPSERT ב-Transaction אחת', offset: p },
        ]
      : [{ level: 'ok', msg: 'COMMIT: התוצאה נשמרה (UPSERT ב-Transaction אחת)', offset: p }],
  });

  const w = f.wsDrop ? jitter(24, 8) + 300 + jitter(220, 60) + jitter(18, 5) : jitter(24, 8);
  steps.push({
    stage: 'live',
    latency: w,
    status: f.wsDrop ? 'degraded' : 'ok',
    logs: f.wsDrop
      ? [
          { level: 'warn', msg: 'Heartbeat: לא התקבל Pong – החיבור מת', offset: 300 },
          { level: 'info', msg: 'ה-Client מתחבר מחדש (Backoff + Jitter) עם lastEventId', offset: 520 },
          { level: 'ok', msg: 'ההודעה שפוספסה נשלחה שוב · המסך עודכן', offset: w },
        ]
      : [{ level: 'ok', msg: 'נדחף ב-WebSocket · המסך עודכן בזמן אמת', offset: w }],
  });

  return { steps, total: steps.reduce((acc, s) => acc + s.latency, 0), outcome: 'decided', score, degraded: steps.some((s) => s.status === 'degraded') };
}

interface LogLine {
  t: number;
  level: Level;
  stage: StageId;
  msg: string;
}

const SLO_MS = 1000;

const levelCls: Record<Level, string> = {
  info: 'text-[#b5b1d6]',
  ok: 'text-emerald-300',
  warn: 'text-amber-300',
  error: 'text-rose-300',
};

const statusRing: Record<Status, string> = {
  idle: 'border-line bg-surface',
  active: 'border-brand bg-brand/10 glow-active',
  ok: 'border-emerald-500/60 bg-emerald-500/10',
  degraded: 'border-amber-500/70 bg-amber-500/10',
  failed: 'border-rose-500 bg-rose-500/10 glow-fail',
  skipped: 'border-line bg-surface-2 opacity-40',
};

const iconCls: Record<Status, string> = {
  idle: 'text-faint',
  active: 'text-brand',
  ok: 'text-emerald-500',
  degraded: 'text-amber-500',
  failed: 'text-rose-500',
  skipped: 'text-faint',
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const idleStatuses = () => Object.fromEntries(STAGES.map((s) => [s.id, 'idle'])) as Record<StageId, Status>;

function percentile(sorted: number[], p: number) {
  if (!sorted.length) return 0;
  const idx = Math.min(sorted.length - 1, Math.ceil((p / 100) * sorted.length) - 1);
  return sorted[Math.max(0, idx)];
}

export function Simulator() {
  const [scenarioId, setScenarioId] = useState(SCENARIOS[0].id);
  const [failures, setFailures] = useState<Record<FailureId, boolean>>({ queueLag: false, llmTimeout: false, dbFailover: false, wsDrop: false, poison: false });
  const [speed, setSpeed] = useState(1);
  const [running, setRunning] = useState(false);
  const [statuses, setStatuses] = useState<Record<StageId, Status>>(idleStatuses);
  const [latencies, setLatencies] = useState<Partial<Record<StageId, number>>>({});
  const [current, setCurrent] = useState<number | null>(null);
  const [logs, setLogs] = useState<LogLine[]>([]);
  const [result, setResult] = useState<Plan | null>(null);
  const [streamed, setStreamed] = useState('');
  const [load, setLoad] = useState<{ p50: number; p95: number; p99: number; within: number; dlq: number; degraded: number; n: number; hist: number[] } | null>(null);
  const runRef = useRef(0);
  const logRef = useRef<HTMLDivElement>(null);
  const scenario = SCENARIOS.find((s) => s.id === scenarioId) ?? SCENARIOS[0];

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: 'smooth' });
  }, [logs]);

  useEffect(
    () => () => {
      runRef.current++;
    },
    [],
  );

  const resetView = useCallback(() => {
    runRef.current++;
    setRunning(false);
    setStatuses(idleStatuses());
    setLatencies({});
    setCurrent(null);
    setLogs([]);
    setResult(null);
    setStreamed('');
  }, []);

  const run = async () => {
    resetView();
    const myRun = ++runRef.current;
    setRunning(true);
    const plan = buildPlan(scenario, failures);
    let clock = 0;
    const alive = () => runRef.current === myRun;
    const visual = (ms: number) => Math.min(3000, Math.max(900, ms * 1.6)) / speed;

    for (let i = 0; i < plan.steps.length; i++) {
      const step = plan.steps[i];
      if (!alive()) return;
      if (step.status === 'skipped') {
        setStatuses((s) => ({ ...s, [step.stage]: 'skipped' }));
        continue;
      }
      const dur = visual(step.latency);
      setStatuses((s) => ({ ...s, [step.stage]: 'active' }));
      setCurrent(i);
      let elapsed = 0;
      for (const l of [...step.logs].sort((x, y) => x.offset - y.offset)) {
        const at = (l.offset / Math.max(step.latency, 1)) * dur;
        await sleep(Math.max(0, at - elapsed));
        elapsed = Math.max(elapsed, at);
        if (!alive()) return;
        const entry: LogLine = { t: clock + l.offset, level: l.level, stage: step.stage, msg: l.msg };
        setLogs((ls) => [...ls, entry]);
      }
      await sleep(Math.max(0, dur - elapsed));
      if (!alive()) return;
      clock += step.latency;
      setStatuses((s) => ({ ...s, [step.stage]: step.status }));
      setLatencies((l) => ({ ...l, [step.stage]: step.latency }));
    }

    setCurrent(null);
    setResult(plan);
    setRunning(false);
    if (plan.outcome === 'decided') {
      let out = failures.llmTimeout ? '[מצב גיבוי – ההחלטה התקבלה לפי Rules וממתינה לבדיקת אדם] ' : '';
      for (const word of scenario.aiText.split(' ')) {
        if (!alive()) return;
        out += word + ' ';
        setStreamed(out);
        await sleep(35 / speed);
      }
    }
  };

  const runLoad = () => {
    const N = 500;
    const totals: number[] = [];
    let dlq = 0;
    let degraded = 0;
    for (let i = 0; i < N; i++) {
      const f: Record<FailureId, boolean> = {
        queueLag: failures.queueLag && Math.random() < 0.6,
        llmTimeout: failures.llmTimeout && Math.random() < 0.35,
        dbFailover: failures.dbFailover && Math.random() < 0.08,
        wsDrop: failures.wsDrop && Math.random() < 0.1,
        poison: failures.poison && Math.random() < 0.01,
      };
      const p = buildPlan(SCENARIOS[i % SCENARIOS.length], f);
      if (p.outcome === 'dlq') dlq++;
      else totals.push(p.total);
      if (p.degraded) degraded++;
    }
    totals.sort((a, b) => a - b);
    const buckets = [200, 400, 600, 800, 1000, 1500, 2000, Infinity];
    const hist = buckets.map((b, i) => totals.filter((t) => t <= b && t > (i ? buckets[i - 1] : 0)).length);
    setLoad({ p50: percentile(totals, 50), p95: percentile(totals, 95), p99: percentile(totals, 99), within: totals.filter((t) => t <= SLO_MS).length / N, dlq, degraded, n: N, hist });
  };

  const total = Object.values(latencies).reduce((a, b) => a + (b ?? 0), 0);
  const maxLatency = Math.max(1, ...Object.values(latencies).map((x) => x ?? 0));
  const activeStage = current !== null ? STAGES[current] : null;
  const verdictCls =
    result?.outcome === 'dlq' || scenario.verdictTone === 'bad'
      ? 'text-rose-600 dark:text-rose-300'
      : scenario.verdictTone === 'warn'
        ? 'text-amber-600 dark:text-amber-300'
        : 'text-emerald-600 dark:text-emerald-300';

  return (
    <div className="mx-auto max-w-[1320px] px-5 pb-24 pt-8 lg:px-10">
      <header className="mb-6">
        <div className="flex items-center gap-2 text-[13px] font-bold text-teal-600 dark:text-teal-300">
          <Activity className="h-4 w-4" /> מעבדה אינטראקטיבית
        </div>
        <h1 className="mt-2 text-[32px] font-bold tracking-tight text-fg">סימולטור: המסע של בקשה במערכת אמיתית</h1>
        <p className="mt-2 max-w-3xl text-[16px] leading-7 text-muted">
          בחר תרחיש ולחץ "שלח בקשה". תראה איך Request עובר בין כל חלקי המערכת – Browser, Server, Queue, AI, Database ו-Dashboard – עם הסבר לכל שלב. אחר
          כך הפעל תקלות ותראה איך מערכת שבנויה נכון ממשיכה לעבוד גם כשמשהו נשבר.
        </p>
      </header>

      <div className="grid gap-5 xl:grid-cols-[330px_1fr]">
        <div className="space-y-4">
          <div className="card p-4">
            <div className="mb-3 text-[13px] font-bold text-fg">1 · בחר תרחיש</div>
            <div className="space-y-2">
              {SCENARIOS.map((s) => (
                <button
                  key={s.id}
                  disabled={running}
                  onClick={() => setScenarioId(s.id)}
                  className={`w-full rounded-xl border-2 px-3.5 py-2.5 text-start transition disabled:opacity-50 ${
                    s.id === scenarioId ? 'border-brand bg-brand/10' : 'border-line hover:border-line-strong'
                  }`}
                >
                  <div className="text-[14px] font-semibold text-fg">{s.name}</div>
                  <div className="text-[12px] text-faint">{s.summary}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="card p-4">
            <div className="mb-1 text-[13px] font-bold text-fg">2 · הכנס תקלות (לא חובה)</div>
            <p className="mb-3 text-[12px] text-faint">במערכות אמיתיות דברים נשברים כל הזמן. מה קורה אז?</p>
            <div className="space-y-2">
              {FAILURES.map((f) => (
                <label
                  key={f.id}
                  className={`flex cursor-pointer gap-3 rounded-xl border px-3 py-2.5 transition ${
                    failures[f.id] ? 'border-rose-500/50 bg-rose-500/[0.07]' : 'border-line hover:bg-surface-2'
                  } ${running ? 'pointer-events-none opacity-50' : ''}`}
                >
                  <input type="checkbox" className="sr-only" checked={failures[f.id]} onChange={(e) => setFailures((s) => ({ ...s, [f.id]: e.target.checked }))} />
                  <span className={`mt-0.5 flex h-5 w-9 shrink-0 items-center rounded-full p-0.5 transition ${failures[f.id] ? 'bg-rose-500' : 'bg-line-strong'}`}>
                    <span className={`h-4 w-4 rounded-full bg-white shadow transition ${failures[f.id] ? '-translate-x-4' : ''}`} />
                  </span>
                  <span>
                    <span className="block text-[13.5px] font-semibold text-fg">{f.label}</span>
                    <span className="block text-[12px] leading-5 text-faint">{f.desc}</span>
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="card p-4">
            <div className="mb-2 flex items-center justify-between text-[13px] font-bold text-fg">
              <span>3 · מהירות הצגה</span>
              <span dir="ltr" className="text-brand">
                {speed}×
              </span>
            </div>
            <input type="range" min={0.5} max={3} step={0.5} value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="w-full accent-[var(--brand)]" />
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                onClick={running ? resetView : run}
                className={`flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-[14px] font-bold transition ${
                  running ? 'border border-line text-fg hover:bg-surface-2' : 'bg-brand text-brand-fg shadow-soft hover:opacity-90'
                }`}
              >
                {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                {running ? 'עצור' : 'שלח בקשה'}
              </button>
              <button onClick={resetView} className="flex items-center justify-center gap-2 rounded-xl border border-line px-3 py-3 text-[14px] text-muted hover:bg-surface-2">
                <RotateCcw className="h-4 w-4" /> איפוס
              </button>
            </div>
            <button
              onClick={runLoad}
              disabled={running}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-indigo-500/40 px-3 py-2.5 text-[13.5px] text-indigo-600 hover:bg-indigo-500/10 disabled:opacity-50 dark:text-indigo-300"
            >
              <BarChart3 className="h-4 w-4" /> בדיקת עומס: 500 בקשות
            </button>
          </div>
        </div>

        <div className="min-w-0 space-y-5">
          <div className="card shadow-soft overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-5 py-3 text-[13px]">
              <span className="font-bold text-fg">המסלול של הבקשה</span>
              <span className="flex items-center gap-3 text-faint">
                <span className="flex items-center gap-1">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> תקין
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> עבד עם קושי
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-500" /> נכשל
                </span>
              </span>
            </div>
            <div className="bg-dots overflow-x-auto px-5 pb-6 pt-8">
              <div className="relative min-w-[860px]">
                <div className="absolute inset-x-[8.33%] top-[40px] h-0.5 bg-gradient-to-l from-violet-400/50 via-sky-400/50 to-teal-400/50" />
                {current !== null && (
                  <div
                    className="absolute top-[33px] z-10 h-4 w-4 rounded-full bg-brand shadow-[0_0_18px_6px_color-mix(in_oklab,var(--brand)_55%,transparent)]"
                    style={{ right: `${((current + 0.5) / STAGES.length) * 100}%`, transform: 'translateX(50%)', transition: 'right 450ms cubic-bezier(.4,0,.2,1)' }}
                  />
                )}
                <div className="relative grid grid-cols-6 gap-3">
                  {STAGES.map((s) => {
                    const st = statuses[s.id];
                    const Icon = s.icon;
                    const injected = FAILURES.filter((f) => f.stage === s.id && failures[f.id]);
                    return (
                      <div key={s.id} className="flex flex-col items-center text-center">
                        <div className={`relative flex h-[80px] w-[80px] items-center justify-center rounded-3xl border-2 transition-all duration-300 ${statusRing[st]}`}>
                          <Icon className={`h-8 w-8 ${iconCls[st]}`} />
                          {st === 'active' && <span className="absolute inset-0 animate-ping rounded-3xl border-2 border-brand/40" />}
                          {injected.length > 0 && (
                            <span className="absolute -end-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-rose-500 text-white" title={injected.map((x) => x.label).join(', ')}>
                              <AlertTriangle className="h-3.5 w-3.5" />
                            </span>
                          )}
                        </div>
                        <div dir="ltr" className="mt-3 text-[14px] font-bold text-fg">
                          {s.label}
                        </div>
                        <div dir="ltr" className="text-[11px] text-faint">
                          {s.tech}
                        </div>
                        <div className={`mt-2 rounded-full px-2.5 py-0.5 text-[12px] font-semibold ${latencies[s.id] !== undefined ? 'bg-surface-2 text-fg' : 'text-faint'}`}>
                          {st === 'skipped' ? 'דולג' : latencies[s.id] !== undefined ? `${latencies[s.id]}ms` : '—'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="border-t border-line bg-brand/[0.05] px-5 py-4">
              <div className="flex gap-3">
                <Info className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
                <div className="text-[14.5px] leading-7 text-muted">
                  {activeStage ? (
                    <>
                      <span className="font-bold text-fg">עכשיו ב-{activeStage.label}: </span>
                      {activeStage.narration}
                    </>
                  ) : result ? (
                    result.outcome === 'dlq' ? (
                      'ההודעה הפגומה הועברה ל-Dead Letter Queue. שימו לב: שאר ההודעות בתור המשיכו לזרום – הודעה אחת לא תוקעת את כל המערכת.'
                    ) : (
                      `הבקשה עברה את כל המסלול ב-${total}ms. ${result.degraded ? 'למרות התקלות, המערכת המשיכה לעבוד – זה מה שנקרא Graceful Degradation.' : 'הכל עבד חלק.'}`
                    )
                  ) : (
                    'לחץ "שלח בקשה" כדי לראות את המסע. בכל שלב יופיע כאן הסבר פשוט של מה שקורה.'
                  )}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 border-t border-line md:grid-cols-4">
              {[
                { label: 'זמן כולל', value: total ? `${total}ms` : '—', icon: Timer, cls: total > SLO_MS ? 'text-rose-600 dark:text-rose-300' : total ? 'text-emerald-600 dark:text-emerald-300' : 'text-faint', note: `יעד: עד ${SLO_MS}ms` },
                { label: 'ציון סיכון', value: result?.outcome === 'decided' ? result.score.toFixed(2) : result ? '—' : '—', icon: Gauge, cls: verdictCls, note: result?.degraded ? 'מצב גיבוי' : '0 = רגיל, 1 = חשוד מאוד' },
                { label: 'תוצאה', value: result ? (result.outcome === 'dlq' ? 'הועבר ל-DLQ' : scenario.verdict) : running ? 'מעבד…' : '—', icon: CheckCircle2, cls: verdictCls, note: 'מה המערכת החליטה' },
                { label: 'יומן', value: `${logs.length} שורות`, icon: Terminal, cls: 'text-fg', note: 'Logs לאורך המסלול' },
              ].map((m, i) => (
                <div key={m.label} className={`px-4 py-3 ${i ? 'border-s border-line' : ''}`}>
                  <div className="flex items-center gap-1.5 text-[12px] text-faint">
                    <m.icon className="h-3.5 w-3.5" /> {m.label}
                  </div>
                  <div className={`mt-1 truncate text-[17px] font-bold ${m.cls}`}>{m.value}</div>
                  <div className="text-[11px] text-faint">{m.note}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <div className="code-surface flex flex-col overflow-hidden rounded-2xl border border-black/10 dark:border-white/10">
              <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5 text-[13px] font-semibold text-[#e5e3f5]">
                <Terminal className="h-4 w-4" /> Logs – מה כל שרת כותב ביומן
              </div>
              <div ref={logRef} className="h-[320px] overflow-y-auto px-4 py-3 text-[12.5px] leading-[1.8]">
                {logs.length === 0 && <div className="text-[#7f7aa3]">היומן ריק. לחץ "שלח בקשה"…</div>}
                {logs.map((l, i) => (
                  <div key={i} className="animate-fade-up flex gap-2">
                    <span dir="ltr" className="w-[58px] shrink-0 font-mono text-[#7f7aa3]">
                      +{l.t}ms
                    </span>
                    <span dir="ltr" className="w-[70px] shrink-0 font-mono text-violet-300">
                      {STAGES.find((s) => s.id === l.stage)?.label}
                    </span>
                    <span className={levelCls[l.level]}>{l.msg}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card flex flex-col overflow-hidden">
              <div className="flex items-center gap-2 border-b border-line px-4 py-2.5 text-[13px] font-semibold text-fg">
                <LayoutDashboard className="h-4 w-4 text-brand" /> מה המשתמש רואה ב-Dashboard
              </div>
              <div className="h-[320px] space-y-3 overflow-y-auto p-4">
                <div>
                  <div className="mb-1 text-[12px] font-semibold text-faint">ה-JSON שנשלח:</div>
                  <pre dir="ltr" className="code-surface rounded-xl p-3 text-left font-mono text-[12px] leading-5">
                    {scenario.payload}
                  </pre>
                </div>
                {result?.outcome === 'dlq' && (
                  <div className="flex gap-2 rounded-xl border border-rose-500/40 bg-rose-500/10 p-3 text-[13.5px] leading-6 text-rose-700 dark:text-rose-200">
                    <XCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    לא התקבלה תוצאה עבור הבקשה הזו. ההודעה נשמרה ב-Dead Letter Queue כדי שמפתח יבדוק ויתקן – שום מידע לא אבד.
                  </div>
                )}
                {streamed && (
                  <div className="rounded-xl border border-brand/30 bg-brand/[0.06] p-3.5">
                    <div className="mb-1 flex items-center gap-1.5 text-[12px] font-bold text-brand">
                      <Bot className="h-3.5 w-3.5" /> הסבר ה-AI (Streaming)
                      {result?.degraded && <span className="ms-auto rounded-full bg-amber-500/20 px-2 text-amber-700 dark:text-amber-300">ממתין לבדיקת אדם</span>}
                    </div>
                    <p className="text-[14px] leading-7 text-fg">
                      {streamed}
                      <span className="ms-0.5 inline-block h-4 w-1.5 animate-pulse bg-brand align-middle" />
                    </p>
                  </div>
                )}
                {!result && !running && <div className="text-[13px] text-faint">התוצאה והסבר ה-AI יופיעו כאן כשהבקשה תגיע ל-Dashboard.</div>}
              </div>
            </div>
          </div>

          {(total > 0 || load) && (
            <div className="grid gap-5 lg:grid-cols-2">
              {total > 0 && (
                <div className="card p-5">
                  <div className="mb-3 text-[14px] font-bold text-fg">כמה זמן לקח כל שלב (Latency)</div>
                  <div className="space-y-2.5">
                    {STAGES.map((s) => {
                      const v = latencies[s.id];
                      if (v === undefined) return null;
                      return (
                        <div key={s.id} className="grid grid-cols-[110px_1fr_64px] items-center gap-3 text-[13px]">
                          <span dir="ltr" className="truncate text-end text-muted">
                            {s.label}
                          </span>
                          <div className="h-2.5 overflow-hidden rounded-full bg-surface-2">
                            <div
                              className={`h-full rounded-full ${statuses[s.id] === 'degraded' ? 'bg-amber-500' : statuses[s.id] === 'failed' ? 'bg-rose-500' : 'brand-gradient'}`}
                              style={{ width: `${(v / maxLatency) * 100}%` }}
                            />
                          </div>
                          <span dir="ltr" className="text-end font-mono text-fg">
                            {v}ms
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  <p className="mt-3 text-[13px] leading-6 text-faint">
                    שים לב: ה-AI הוא השלב האיטי ביותר. לכן מערכות אמיתיות מריצות קודם Rules מהירים שנותנים תשובה ראשונית תוך מילישניות, והניתוח של ה-AI מגיע
                    אחריו.
                  </p>
                </div>
              )}
              {load && (
                <div className="card border-indigo-500/30 p-5">
                  <div className="mb-3 flex items-center justify-between text-[14px] font-bold text-fg">
                    <span>בדיקת עומס · {load.n} בקשות</span>
                    <button onClick={() => setLoad(null)} className="text-[12px] font-normal text-faint hover:text-fg">
                      נקה
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      ['p50', load.p50, 'חצי מהבקשות מהירות מזה'],
                      ['p95', load.p95, '95% מהבקשות מהירות מזה'],
                      ['p99', load.p99, 'כמעט כולן מהירות מזה'],
                    ].map(([k, v, note]) => (
                      <div key={k as string} className="rounded-xl bg-surface-2 px-3 py-2">
                        <div dir="ltr" className="text-end text-[11px] font-bold text-faint">
                          {k}
                        </div>
                        <div dir="ltr" className={`text-end text-[16px] font-bold ${Number(v) > SLO_MS ? 'text-rose-600 dark:text-rose-300' : 'text-emerald-600 dark:text-emerald-300'}`}>
                          {v}ms
                        </div>
                        <div className="text-[10.5px] leading-4 text-faint">{note}</div>
                      </div>
                    ))}
                  </div>
                  <div dir="ltr" className="mt-4 flex h-20 items-end gap-1">
                    {load.hist.map((h, i) => {
                      const max = Math.max(...load.hist, 1);
                      const labels = ['≤200', '≤400', '≤600', '≤800', '≤1s', '≤1.5s', '≤2s', '>2s'];
                      return (
                        <div key={i} className="flex flex-1 flex-col items-center gap-1">
                          <div className={`w-full rounded-t ${i >= 5 ? 'bg-rose-400/80' : 'bg-indigo-400/80'}`} style={{ height: `${(h / max) * 64}px` }} title={`${h} בקשות`} />
                          <span className="text-[9.5px] text-faint">{labels[i]}</span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-muted">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> {(load.within * 100).toFixed(1)}% עמדו ביעד
                    </span>
                    <span>עבדו עם קושי: {load.degraded}</span>
                    <span>DLQ: {load.dlq}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="grid gap-3 md:grid-cols-3">
            {STAGES.map((s) => (
              <div key={s.id} className="card p-4">
                <div className="flex items-center gap-2 text-[14px] font-bold text-fg">
                  <s.icon className="h-4 w-4 text-brand" /> <span dir="ltr">{s.label}</span>
                </div>
                <p className="mt-1 text-[13px] leading-6 text-muted">{s.role}</p>
              </div>
            ))}
          </div>

          <div>
            <div className="mb-1 text-[14px] font-bold text-fg">איך זה נראה בקוד? (גרסה מקוצרת של ה-API Server)</div>
            <CodeBlock
              lang="typescript"
              title="server.ts – מקבל בקשה, מאמת ושולח לתור"
              code={`app.post('/api/events', async (req, reply) => {
  // 1) Authentication: מי המשתמש?
  const user = await requireUser(req);

  // 2) Validation: האם ה-JSON תקין?
  const parsed = EventSchema.safeParse(req.body);
  if (!parsed.success) return reply.code(422).send(parsed.error.issues);

  // 3) Idempotency: אם כבר קיבלנו את הבקשה הזו – לא מעבדים פעמיים
  const key = req.headers['idempotency-key'];
  if (await alreadySeen(user.id, key)) return reply.code(200).send({ duplicate: true });

  // 4) שולחים לתור ומחזירים תשובה מיד – העבודה הכבדה תיעשה ב-Worker
  await queue.publish('events', { userId: user.id, ...parsed.data });
  return reply.code(202).send({ accepted: true });
});`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
