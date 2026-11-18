import { CheckCircle2, RotateCcw, Trophy, XCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { useProgress } from '../lib/progress-context';
import { EASE_OUT } from '../lib/motion';
import type { QuizQuestion } from '../types';
import { Inline } from './Markdown';

const LETTERS = ['א', 'ב', 'ג', 'ד', 'ה', 'ו'];

function ScoreRing({ pct }: { pct: number }) {
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  return (
    <svg width="52" height="52" viewBox="0 0 52 52" className="-rotate-90 shrink-0" aria-hidden>
      <circle cx="26" cy="26" r={radius} fill="none" stroke="var(--line)" strokeWidth="4" />
      <motion.circle
        cx="26"
        cy="26"
        r={radius}
        fill="none"
        stroke={pct >= 70 ? 'var(--brand)' : 'oklch(78% 0.15 75)'}
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: circumference * (1 - pct / 100) }}
        transition={{ duration: 0.9, ease: EASE_OUT, delay: 0.1 }}
      />
    </svg>
  );
}

export function Quiz({ lessonId, questions }: { lessonId: string; questions: QuizQuestion[] }) {
  const { state, recordQuiz, setQuizDraft } = useProgress();
  const signature = JSON.stringify(questions);
  const saved = state.quizDrafts[lessonId];
  const draft = saved?.signature === signature ? saved : {
    signature, answers: questions.map(() => null), submitted: false,
  };
  const { answers, submitted } = draft;
  const prior = state.quiz[lessonId];

  const score = answers.reduce<number>((acc, a, i) => acc + (a === questions[i].answer ? 1 : 0), 0);
  const answered = answers.filter((a) => a !== null).length;
  const pct = Math.round((score / questions.length) * 100);

  const submit = () => {
    setQuizDraft(lessonId, { ...draft, submitted: true });
    recordQuiz(lessonId, score, questions.length);
  };

  const retry = () => {
    setQuizDraft(lessonId, { signature, answers: questions.map(() => null), submitted: false });
  };

  return (
    <div className="space-y-4">
      {prior && !submitted && (
        <div className="flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2.5 text-[13px] text-muted">
          <Trophy className="h-4 w-4 text-amber-500" />
          הציון הכי טוב שלך: <span className="font-bold text-fg">
            {prior.best}/{prior.total}
          </span>{' '}
          · {prior.attempts} ניסיונות
        </div>
      )}
      {questions.map((q, qi) => {
        const chosen = answers[qi];
        return (
          <div key={qi} className="card p-5">
            <div className="mb-4 flex gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand text-[13px] font-bold text-brand-fg">{qi + 1}</span>
              <div className="pt-0.5 text-[16px] font-semibold leading-7 text-fg">
                <Inline text={q.q} />
              </div>
            </div>
            <div className="grid gap-2">
              {q.options.map((opt, oi) => {
                const isChosen = chosen === oi;
                const isCorrect = oi === q.answer;
                let cls = 'border-line hover:border-brand/50 hover:bg-brand/5';
                if (!submitted && isChosen) cls = 'border-brand bg-brand/10';
                if (submitted && isCorrect) cls = 'border-emerald-500 bg-emerald-500/10';
                if (submitted && isChosen && !isCorrect) cls = 'border-rose-500 bg-rose-500/10';
                if (submitted && !isChosen && !isCorrect) cls = 'border-line opacity-55';
                return (
                  <motion.button
                    key={oi}
                    disabled={submitted}
                    whileTap={{ scale: 0.985 }}
                    onClick={() => setQuizDraft(lessonId, { ...draft, answers: answers.map((v, i) => (i === qi ? oi : v)) })}
                    aria-pressed={isChosen}
                    className={`flex items-start gap-3 rounded-xl border-2 px-4 py-3 text-start text-[15px] leading-6 text-muted transition ${cls}`}
                  >
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[12px] font-bold ${
                        isChosen && !submitted ? 'bg-brand text-brand-fg' : 'bg-surface-2 text-muted'
                      }`}
                    >
                      {LETTERS[oi]}
                    </span>
                    <span className="flex-1">
                      <Inline text={opt} />
                    </span>
                    {submitted && isCorrect && <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />}
                    {submitted && isChosen && !isCorrect && <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-500" />}
                  </motion.button>
                );
              })}
            </div>
            {submitted && (
              <div className="animate-fade-up mt-4 rounded-xl bg-surface-2 px-4 py-3 text-[14.5px] leading-6 text-muted">
                <span className="font-bold text-fg">הסבר: </span>
                <Inline text={q.explanation} />
              </div>
            )}
          </div>
        );
      })}
      <div className="flex flex-wrap items-center gap-3">
        {!submitted ? (
          <>
            <button
              onClick={submit}
              disabled={answered < questions.length}
              className="rounded-xl bg-brand px-5 py-2.5 text-[15px] font-semibold text-brand-fg shadow-soft transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              בדוק תשובות
            </button>
            <span className="text-[13px] text-faint">
              ענית על {answered} מתוך {questions.length}
            </span>
          </>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: EASE_OUT }}
              className={`flex items-center gap-4 rounded-xl px-4 py-3 text-[15px] font-semibold ${
                pct >= 70 ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300' : 'bg-amber-500/15 text-amber-700 dark:text-amber-300'
              }`}
            >
              <ScoreRing pct={pct} />
              <span>
                {score}/{questions.length} נכונות ({pct}%) — {pct >= 70 ? 'כל הכבוד! השיעור סומן כהושלם' : 'צריך 70% כדי להשלים את השיעור. נסה שוב!'}
              </span>
            </motion.div>
            <button onClick={retry} className="flex items-center gap-1.5 rounded-xl border border-line px-4 py-2.5 text-[14px] text-muted hover:border-brand/50">
              <RotateCcw className="h-4 w-4" /> נסה שוב
            </button>
          </>
        )}
      </div>
    </div>
  );
}
