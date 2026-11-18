import { GraduationCap, Menu } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { findLesson, modules } from './content';
import { comparisons } from './content/comparisons';
import { interviewQA, scenarios } from './content/interview';
import { ProgressProvider } from './lib/progress';
import { href, useRoute } from './lib/router';
import { Comparisons } from './pages/Comparisons';
import { Glossary } from './pages/Glossary';
import { Home } from './pages/Home';
import { Interview } from './pages/Interview';
import { LessonPage } from './pages/LessonPage';
import { ModulePage } from './pages/ModulePage';
import { Simulator } from './pages/Simulator';

function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-6 py-24 text-center">
      <h1 className="text-[26px] font-bold text-fg">הדף לא נמצא</h1>
      <a href={href.home()} className="mt-4 inline-block font-semibold text-brand hover:underline">
        חזרה לדף הבית
      </a>
    </div>
  );
}

function Shell() {
  const route = useRoute();
  const [mobileOpen, setMobileOpen] = useState(false);

  const searchExtra = useMemo(
    () => [
      {
        title: 'סימולטור: המסע של בקשה',
        subtitle: 'מעבדה אינטראקטיבית',
        href: href.simulator(),
        body: 'simulator request queue kafka worker ai database websocket failure retry dlq timeout latency סימולטור תקלות',
      },
      ...comparisons.map((c) => ({
        title: `מתחיל מול מקצוען: ${c.title}`,
        subtitle: 'השוואת קוד',
        href: href.comparisons(c.id),
        body: `${c.context} ${c.junior.problems.join(' ')} ${c.senior.wins.join(' ')}`,
      })),
      ...scenarios.map((s) => ({
        title: s.title,
        subtitle: 'תרחיש System Design',
        href: href.interview(s.id),
        body: `${s.prompt} ${s.checklist.join(' ')}`,
      })),
      ...interviewQA.map((q) => ({
        title: q.q,
        subtitle: `שאלת ראיון · ${q.topic}`,
        href: href.interview(),
        body: q.a,
      })),
    ],
    [],
  );

  let page;
  switch (route.name) {
    case 'home':
      page = <Home />;
      break;
    case 'module': {
      const m = modules.find((x) => x.id === route.moduleId);
      page = m ? <ModulePage module={m} /> : <NotFound />;
      break;
    }
    case 'lesson': {
      const found = findLesson(route.moduleId, route.lessonId);
      page = found ? <LessonPage key={`${found.module.id}-${found.lesson.id}`} module={found.module} lesson={found.lesson} /> : <NotFound />;
      break;
    }
    case 'simulator':
      page = <Simulator />;
      break;
    case 'comparisons':
      page = <Comparisons key={route.id ?? 'default'} selectedId={route.id} />;
      break;
    case 'interview':
      page = <Interview selectedId={route.id} />;
      break;
    case 'glossary':
      page = <Glossary focus={route.term} />;
      break;
  }

  return (
    <div className="flex h-full">
      <div className="hidden lg:block">
        <Sidebar route={route} searchExtra={searchExtra} />
      </div>
      {mobileOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <Sidebar route={route} searchExtra={searchExtra} onNavigate={() => setMobileOpen(false)} />
          <button className="flex-1 bg-black/50" aria-label="סגור תפריט" onClick={() => setMobileOpen(false)} />
        </div>
      )}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-3 border-b border-line bg-surface px-4 py-3 lg:hidden">
          <button onClick={() => setMobileOpen(true)} className="rounded-xl border border-line p-1.5 text-muted" aria-label="פתח תפריט">
            <Menu className="h-5 w-5" />
          </button>
          <GraduationCap className="h-5 w-5 text-brand" />
          <span className="text-[15px] font-bold text-fg">האקדמיה של אורי</span>
        </header>
        <main id="main-scroll" className="flex-1 overflow-y-auto">
          {page}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ProgressProvider>
      <Shell />
    </ProgressProvider>
  );
}
