import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { empty, load, ProgressContext, STORAGE_KEY, type ProgressApi, type ProgressState, type QuizResult, type QuizDraft } from './progress-context';

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ProgressState>(load);
  const [storageError, setStorageError] = useState(false);
  const [saveAttempt, setSaveAttempt] = useState(0);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      // oxlint-disable-next-line -- Reflect the external storage write result; this only changes on failure or recovery.
      setStorageError(false);
    } catch (error) {
      console.error('Unable to save academy progress', error);
      setStorageError(true);
    }
  }, [state, saveAttempt]);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setState(load());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const setComplete = useCallback((lessonId: string, done: boolean) => {
    setState((s) => {
      const has = s.completed.includes(lessonId);
      if (done === has) return s;
      return { ...s, completed: done ? [...s.completed, lessonId] : s.completed.filter((x) => x !== lessonId) };
    });
  }, []);

  const recordQuiz = useCallback((lessonId: string, score: number, total: number) => {
    setState((s) => {
      const prev = s.quiz[lessonId];
      const result: QuizResult = {
        score,
        total,
        best: Math.max(prev?.best ?? 0, score),
        attempts: (prev?.attempts ?? 0) + 1,
        at: new Date().toISOString(),
      };
      const passed = score / total >= 0.7;
      const completed = passed && !s.completed.includes(lessonId) ? [...s.completed, lessonId] : s.completed;
      return { ...s, quiz: { ...s.quiz, [lessonId]: result }, completed };
    });
  }, []);

  const setNote = useCallback((key: string, value: string) => {
    setState((s) => ({ ...s, notes: { ...s.notes, [key]: value } }));
  }, []);

  const setLessonStep = useCallback((lessonId: string, index: number) => {
    setState((s) => ({
      ...s,
      lessonSteps: {
        ...s.lessonSteps,
        [lessonId]: { index, furthest: Math.max(s.lessonSteps[lessonId]?.furthest ?? 0, index) },
      },
    }));
  }, []);

  const setQuizDraft = useCallback((lessonId: string, draft: QuizDraft) => {
    setState((s) => ({ ...s, quizDrafts: { ...s.quizDrafts, [lessonId]: draft } }));
  }, []);

  const toggleChecklist = useCallback((key: string, item: string) => {
    setState((s) => {
      const cur = s.checklists[key] ?? [];
      const next = cur.includes(item) ? cur.filter((x) => x !== item) : [...cur, item];
      return { ...s, checklists: { ...s.checklists, [key]: next } };
    });
  }, []);

  const visit = useCallback((moduleId: string, lessonId: string) => {
    setState((s) =>
      s.lastVisited?.moduleId === moduleId && s.lastVisited.lessonId === lessonId ? s : { ...s, lastVisited: { moduleId, lessonId } },
    );
  }, []);

  const reset = useCallback(() => setState(empty), []);

  const api = useMemo<ProgressApi>(
    () => ({
      state,
      isComplete: (id) => state.completed.includes(id),
      setComplete,
      recordQuiz,
      setLessonStep,
      setQuizDraft,
      setNote,
      toggleChecklist,
      visit,
      reset,
    }),
    [state, setComplete, recordQuiz, setLessonStep, setQuizDraft, setNote, toggleChecklist, visit, reset],
  );

  return <ProgressContext.Provider value={api}>
    {children}
    {storageError && <div role="alert" className="fixed inset-x-4 bottom-4 z-50 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-rose-500 bg-surface p-4 text-[14px] text-fg shadow-lg">
      <p>לא ניתן לשמור את ההתקדמות בדפדפן. היא זמינה כרגע רק כל עוד הדף פתוח. אפשר אחסון מקומי או פנה מקום ונסה שוב.</p>
      <button className="underline underline-offset-4" onClick={() => setSaveAttempt((value) => value + 1)}>נסה לשמור שוב</button>
    </div>}
  </ProgressContext.Provider>;
}

