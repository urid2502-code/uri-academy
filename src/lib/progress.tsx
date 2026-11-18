import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { empty, load, ProgressContext, STORAGE_KEY, type ProgressApi, type ProgressState, type QuizResult } from './progress-context';

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ProgressState>(load);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage full or disabled: progress stays in-memory */
    }
  }, [state]);

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

  const toggleChecklist = useCallback((key: string, item: string) => {
    setState((s) => {
      const cur = s.checklists[key] ?? [];
      const next = cur.includes(item) ? cur.filter((x) => x !== item) : [...cur, item];
      return { ...s, checklists: { ...s.checklists, [key]: next } };
    });
  }, []);

  const visit = useCallback((moduleId: string, lessonId: string) => {
    setState((s) =>
      s.lastVisited?.lessonId === lessonId ? s : { ...s, lastVisited: { moduleId, lessonId } },
    );
  }, []);

  const reset = useCallback(() => setState(empty), []);

  const api = useMemo<ProgressApi>(
    () => ({
      state,
      isComplete: (id) => state.completed.includes(id),
      setComplete,
      recordQuiz,
      setNote,
      toggleChecklist,
      visit,
      reset,
    }),
    [state, setComplete, recordQuiz, setNote, toggleChecklist, visit, reset],
  );

  return <ProgressContext.Provider value={api}>{children}</ProgressContext.Provider>;
}

