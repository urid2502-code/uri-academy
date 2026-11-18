import { ArrowUpLeft, Code2, Menu } from 'lucide-react';
import { motion, MotionConfig, useReducedMotion } from 'motion/react';
import { useEffect, useMemo, useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { MotionToggle } from './components/MotionToggle';
import { findLesson, modules } from './content';
import { comparisons } from './content/comparisons';
import { courses } from './content/courses';
import { interviewQA, scenarios } from './content/interview';
import { EASE_OUT } from './lib/motion';
import { useMotionOff } from './lib/motion-pref';
import { usePersistedFlag } from './lib/persisted';
import { ProgressProvider } from './lib/progress';
import { href, useRoute } from './lib/router';
import { Catalog, CourseSoon } from './pages/Catalog';
import { Comparisons } from './pages/Comparisons';
import { Community } from './pages/Community';
import { FocusMode } from './pages/FocusMode';
import { Glossary } from './pages/Glossary';
import { Home } from './pages/Home';
import { Interview } from './pages/Interview';
import { Landing } from './pages/Landing';
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
  const reducedMotion = useReducedMotion();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuHidden, setMenuHidden] = usePersistedFlag('uri-academy:menu-hidden:v1');

  useEffect(() => {
    // Ctrl/Cmd+B hides or shows the main menu on desktop, like a code editor's sidebar.
    const onKey = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'b' && window.matchMedia('(min-width: 1024px)').matches) {
        event.preventDefault();
        setMenuHidden((hidden) => !hidden);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [setMenuHidden]);

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
    case 'landing':
      return <Landing />;
    case 'courses':
      return <Catalog />;
    case 'course': {
      const c = courses.find((x) => x.id === route.courseId && x.status === 'soon');
      if (c) return <CourseSoon key={c.id} course={c} />;
      page = <NotFound />;
      break;
    }
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
    case 'focus': {
      const found = findLesson(route.moduleId, route.lessonId);
      if (found) return <FocusMode key={`${found.module.id}-${found.lesson.id}`} module={found.module} lesson={found.lesson} />;
      page = <NotFound />;
      break;
    }
    case 'community':
      page = <Community />;
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
    <div className="learning-shell flex h-full">
      <motion.div
        className="hidden overflow-hidden lg:block"
        initial={false}
        animate={{ width: menuHidden ? 0 : 272 }}
        transition={{ duration: reducedMotion ? 0 : 0.28, ease: EASE_OUT }}
        inert={menuHidden}
      >
        <Sidebar route={route} searchExtra={searchExtra} onCollapse={() => setMenuHidden(true)} />
      </motion.div>
      {mobileOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <Sidebar route={route} searchExtra={searchExtra} onNavigate={() => setMobileOpen(false)} />
          <button className="flex-1 bg-black/50" aria-label="סגור תפריט" onClick={() => setMobileOpen(false)} />
        </div>
      )}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="learning-topbar">
          <button
            onClick={() => (window.matchMedia('(min-width: 1024px)').matches ? setMenuHidden(false) : setMobileOpen(true))}
            className={`rounded-lg border border-line p-2 text-muted transition hover:text-fg ${menuHidden ? '' : 'lg:hidden'}`}
            aria-label="פתח תפריט"
            aria-expanded={menuHidden ? false : mobileOpen}
            title="פתח תפריט (Ctrl+B)"
          >
            <Menu className="h-5 w-5" />
          </button>
          <Code2 className="hidden h-4 w-4 text-brand sm:block" />
          <a href={href.home()} className="min-w-0 flex-1 truncate text-[13px] font-medium text-muted">מסלול Full Stack</a>
          <a href={href.courses()} className="flex shrink-0 items-center gap-2 text-[12px] text-faint hover:text-fg">כל הקורסים<ArrowUpLeft className="h-3.5 w-3.5" /></a>
          <MotionToggle />
        </header>
        <main id="main-scroll" className="flex-1 overflow-y-auto">
          {page}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  const { userOff } = useMotionOff();
  return (
    <MotionConfig reducedMotion={userOff ? 'always' : 'user'}>
      <ProgressProvider>
        <Shell />
      </ProgressProvider>
    </MotionConfig>
  );
}
