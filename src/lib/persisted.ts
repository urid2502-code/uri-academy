import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';

/** A boolean UI preference remembered in localStorage; storage failures fall back to in-memory state. */
export function usePersistedFlag(key: string, initial = false): [boolean, Dispatch<SetStateAction<boolean>>] {
  const [value, setValue] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored === null ? initial : stored === '1';
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, value ? '1' : '0');
    } catch {
      /* storage disabled: the preference lasts for this visit only */
    }
  }, [key, value]);

  return [value, setValue];
}
