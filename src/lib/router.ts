import { useEffect, useState } from 'react';

export type Route =
  | { name: 'home' }
  | { name: 'module'; moduleId: string }
  | { name: 'lesson'; moduleId: string; lessonId: string }
  | { name: 'simulator' }
  | { name: 'comparisons'; id?: string }
  | { name: 'interview'; id?: string }
  | { name: 'glossary'; term?: string };

export function parseHash(hash: string): Route {
  const parts = hash.replace(/^#\/?/, '').split('/').filter(Boolean);
  switch (parts[0]) {
    case 'm':
      if (parts[1] && parts[2]) return { name: 'lesson', moduleId: parts[1], lessonId: parts[2] };
      if (parts[1]) return { name: 'module', moduleId: parts[1] };
      return { name: 'home' };
    case 'simulator':
      return { name: 'simulator' };
    case 'comparisons':
      return { name: 'comparisons', id: parts[1] };
    case 'interview':
      return { name: 'interview', id: parts[1] };
    case 'glossary':
      return { name: 'glossary', term: parts[1] ? decodeURIComponent(parts[1]) : undefined };
    default:
      return { name: 'home' };
  }
}

export const href = {
  home: () => '#/',
  module: (m: string) => `#/m/${m}`,
  lesson: (m: string, l: string) => `#/m/${m}/${l}`,
  simulator: () => '#/simulator',
  comparisons: (id?: string) => (id ? `#/comparisons/${id}` : '#/comparisons'),
  interview: (id?: string) => (id ? `#/interview/${id}` : '#/interview'),
  glossary: (term?: string) => (term ? `#/glossary/${encodeURIComponent(term)}` : '#/glossary'),
};

export function navigate(to: string) {
  window.location.hash = to;
}

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(() => parseHash(window.location.hash));
  useEffect(() => {
    const onChange = () => {
      setRoute(parseHash(window.location.hash));
      document.getElementById('main-scroll')?.scrollTo({ top: 0 });
    };
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return route;
}

export type Theme = 'light' | 'dark';
const THEME_KEY = 'uri-academy:theme';

export function useTheme(): [Theme, () => void] {
  const [theme, setTheme] = useState<Theme>(() => (document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'));
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      /* ignore */
    }
  }, [theme]);
  return [theme, () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))];
}