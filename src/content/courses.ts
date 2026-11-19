import { allLessons, getTrack, glossary, modules } from './index';
import { comparisons } from './comparisons';
import { interviewQA, scenarios } from './interview';

export type CourseCategory = 'פיתוח' | 'AI ו-Data' | 'תשתיות' | 'קריירה' | 'אבטחה' | 'עיצוב';

export interface Course {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  status: 'live' | 'soon';
  category: CourseCategory;
  level: string;
  hours: number;
  lessons: number;
  icon: 'layers' | 'brain' | 'network' | 'shield' | 'cloud' | 'smartphone' | 'binary' | 'database' | 'palette' | 'bot' | 'terminal' | 'chart';  tags: string[];
  syllabus: string[];
  href?: string;
}

const fullstackHours = Math.round(allLessons.reduce((a, x) => a + x.lesson.minutes, 0) / 60);
const java = getTrack('java');

export const courses: Course[] = [
  {
    id: 'fullstack',
    title: 'Full Stack מהיסוד ועד Senior',
    subtitle: 'המסלול המלא: Web, TypeScript, Node.js, PostgreSQL, React, Real-Time, Queues, AI ו-Cloud',
    description:
      'מסלול שמתחיל מאפס – איך האינטרנט עובד – ומגיע עד הנושאים שמבדילים מפתח בכיר: מערכות בזמן אמת, ארכיטקטורה מבוססת אירועים, שילוב LLM במוצר ו-Kubernetes. כל שיעור עם אנלוגיה, קוד, טעויות נפוצות, תרגיל ומבחן.',
    status: 'live',
    category: 'פיתוח',
    level: 'מתחיל ← Senior',
    hours: fullstackHours,
    lessons: allLessons.length,
    icon: 'layers',    tags: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Kafka', 'LLM', 'Kubernetes'],
    syllabus: modules.map((m) => m.title),
    href: '#/course/fullstack',
  },
  {
    id: 'java',
    title: 'Java מאפס ועד Backend',
    subtitle: 'מ-Hello World ועד שירות ספרייה עם API, בדיקות ומקביליות',
    description: 'מסלול מעשי בעברית עם JDK 21: יסודות השפה, מודלים, Collections, Streams, בדיקות, מקביליות ופרויקט Backend.',
    status: 'live',
    category: 'פיתוח',
    level: 'מתחיל ← מתקדם',
    hours: Math.round(java.lessons.reduce((sum, { lesson }) => sum + lesson.minutes, 0) / 60),
    lessons: java.lessons.length,
    icon: 'terminal',
    tags: ['Java', 'JDK 21', 'JVM', 'Backend', 'HTTP'],
    syllabus: java.modules.map((m) => m.title),
    href: '#/course/java',
  },
  {
    id: 'ai-engineering',
    title: 'AI Engineering: בניית Agents עם LLM',
    subtitle: 'RAG, Tool Calling, Evals ו-Agents שעובדים ב-Production',
    description: 'איך בונים מוצרי AI אמיתיים: Embeddings ו-Vector DB, RAG, Function Calling, Agents מרובי שלבים, Evals, Guardrails ועלויות.',
    status: 'soon',
    category: 'AI ו-Data',
    level: 'ביניים',
    hours: 14,
    lessons: 24,
    icon: 'bot',    tags: ['LLM', 'RAG', 'Embeddings', 'Agents', 'Evals'],
    syllabus: ['איך LLM עובד מבפנים', 'Prompt Engineering מתקדם', 'Embeddings ו-Vector Databases', 'RAG מקצה לקצה', 'Tool Calling ו-Agents', 'Evals, Guardrails ו-Monitoring'],
  },
  {
    id: 'system-design',
    title: 'System Design לראיונות',
    subtitle: 'מ-URL Shortener ועד מערכות בקנה מידה של מיליוני משתמשים',
    description: 'מסגרת עבודה לשאלות System Design: הערכות גודל, Caching, Sharding, Queues, Consistency – עם 20 תרחישים מלאים.',
    status: 'soon',
    category: 'קריירה',
    level: 'ביניים ← מתקדם',
    hours: 12,
    lessons: 20,
    icon: 'network',    tags: ['Scalability', 'Caching', 'Sharding', 'CAP'],
    syllabus: ['מסגרת עבודה לראיון', 'Load Balancing ו-Caching', 'Databases: Replication ו-Sharding', 'Consistency ו-CAP', 'Queues ו-Streams', '20 תרחישים מלאים'],
  },
  {
    id: 'algorithms',
    title: 'אלגוריתמים ומבני נתונים',
    subtitle: 'הכנה לשאלות קוד בראיונות – בשפה פשוטה',
    description: 'Big-O, מערכים ו-Hash Maps, Two Pointers, Trees, Graphs, Dynamic Programming – עם תבניות פתרון שחוזרות בכל ראיון.',
    status: 'soon',
    category: 'קריירה',
    level: 'מתחיל ← ביניים',
    hours: 18,
    lessons: 32,
    icon: 'binary',    tags: ['Big-O', 'Trees', 'Graphs', 'DP'],
    syllabus: ['Big-O בלי פחד', 'Arrays, Strings ו-Hash Maps', 'Two Pointers ו-Sliding Window', 'Trees ו-Recursion', 'Graphs: BFS ו-DFS', 'Dynamic Programming'],
  },
  {
    id: 'python-data',
    title: 'Python ו-Data Science',
    subtitle: 'מ-Python בסיסי ועד ניתוח נתונים ו-Machine Learning',
    description: 'Python מהיסוד, Pandas ו-NumPy, ויזואליזציה, סטטיסטיקה שימושית ומבוא ל-Machine Learning עם scikit-learn.',
    status: 'soon',
    category: 'AI ו-Data',
    level: 'מתחיל',
    hours: 16,
    lessons: 28,
    icon: 'chart',    tags: ['Python', 'Pandas', 'NumPy', 'scikit-learn'],
    syllabus: ['Python מהיסוד', 'Pandas ו-NumPy', 'ויזואליזציה של נתונים', 'סטטיסטיקה שימושית', 'מבוא ל-Machine Learning', 'פרויקט: ניתוח נתונים אמיתי'],
  },
  {
    id: 'cloud-devops',
    title: 'Cloud ו-DevOps מתקדם',
    subtitle: 'AWS, Terraform, CI/CD ו-Kubernetes ב-Production',
    description: 'Infrastructure as Code, Pipelines של CI/CD, Kubernetes מתקדם, Observability ועלויות ענן – איך מריצים מערכות אמיתיות.',
    status: 'soon',
    category: 'תשתיות',
    level: 'ביניים ← מתקדם',
    hours: 15,
    lessons: 26,
    icon: 'cloud',    tags: ['AWS', 'Terraform', 'CI/CD', 'Kubernetes'],
    syllabus: ['יסודות AWS', 'Terraform ו-IaC', 'CI/CD עם GitHub Actions', 'Kubernetes ב-Production', 'Observability ו-SRE', 'ניהול עלויות ענן'],
  },
  {
    id: 'security',
    title: 'Cybersecurity למפתחים',
    subtitle: 'OWASP Top 10, Authentication ו-Secure Coding',
    description: 'איך כותבים ובודקים בקרות הגנה: אימות קלט, שאילתות פרמטריות, ניהול סודות, OAuth ו-Threat Modeling.',
    status: 'soon',
    category: 'אבטחה',
    level: 'ביניים',
    hours: 10,
    lessons: 18,
    icon: 'shield',    tags: ['OWASP', 'OAuth', 'XSS', 'Threat Modeling'],
    syllabus: ['גבולות אמון וסיכוני אפליקציה', 'בקרות הגנה ו-OWASP Top 10', 'Authentication ו-OAuth', 'ניהול סודות והצפנה', 'Secure Code Review', 'Threat Modeling'],
  },
  {
    id: 'react-native',
    title: 'Mobile עם React Native',
    subtitle: 'אפליקציות iOS ו-Android עם הידע שכבר יש לך ב-React',
    description: 'Expo, ניווט, אחסון מקומי, Push Notifications, ביצועים ופרסום לחנויות – מאפליקציה ראשונה ועד App Store.',
    status: 'soon',
    category: 'פיתוח',
    level: 'ביניים',
    hours: 12,
    lessons: 22,
    icon: 'smartphone',    tags: ['React Native', 'Expo', 'iOS', 'Android'],
    syllabus: ['Expo ואפליקציה ראשונה', 'Navigation', 'State ואחסון מקומי', 'עבודה עם API', 'Push Notifications', 'פרסום לחנויות'],
  },
  {
    id: 'data-engineering',
    title: 'SQL ו-Data Engineering',
    subtitle: 'מ-SQL מתקדם ועד Pipelines ו-Data Warehouse',
    description: 'Window Functions, ETL/ELT, dbt, Data Warehouse, Streaming עם Kafka ואיכות נתונים.',
    status: 'soon',
    category: 'AI ו-Data',
    level: 'ביניים',
    hours: 13,
    lessons: 22,
    icon: 'database',    tags: ['SQL', 'dbt', 'ETL', 'Warehouse'],
    syllabus: ['SQL מתקדם ו-Window Functions', 'מידול נתונים לאנליטיקה', 'ETL ו-ELT', 'dbt', 'Streaming Pipelines', 'Data Quality'],
  },
  {
    id: 'linux',
    title: 'Linux ו-Terminal לעומק',
    subtitle: 'להרגיש בבית בשורת הפקודה',
    description: 'Filesystem, הרשאות, Processes, Networking, Bash Scripting ו-SSH – הכלים שכל מפתח ו-DevOps משתמש בהם כל יום.',
    status: 'soon',
    category: 'תשתיות',
    level: 'מתחיל',
    hours: 8,
    lessons: 16,
    icon: 'terminal',    tags: ['Linux', 'Bash', 'SSH', 'Networking'],
    syllabus: ['Filesystem והרשאות', 'Processes ו-Signals', 'Bash Scripting', 'Networking בסיסי', 'SSH ועבודה מרחוק', 'אוטומציה יומיומית'],
  },
  {
    id: 'ml-deep',
    title: 'Deep Learning מעשי',
    subtitle: 'Neural Networks, PyTorch ו-Transformers',
    description: 'איך רשתות נוירונים לומדות, PyTorch מהיסוד, CNN, Transformers ו-Fine-tuning של מודלים קיימים.',
    status: 'soon',
    category: 'AI ו-Data',
    level: 'מתקדם',
    hours: 20,
    lessons: 30,
    icon: 'brain',    tags: ['PyTorch', 'Transformers', 'Fine-tuning'],
    syllabus: ['איך רשת נוירונים לומדת', 'PyTorch מהיסוד', 'CNN ותמונות', 'Transformers מבפנים', 'Fine-tuning', 'הרצה ב-Production'],
  },
  {
    id: 'ui-design',
    title: 'UI/UX Design למפתחים',
    subtitle: 'לעצב ממשקים שנראים מקצועיים – בלי להיות מעצב',
    description: 'עקרונות עיצוב, טיפוגרפיה, צבע, Spacing, Design Systems, נגישות ואנימציות – עם Tailwind ו-Figma.',
    status: 'soon',
    category: 'עיצוב',
    level: 'מתחיל',
    hours: 9,
    lessons: 16,
    icon: 'palette',    tags: ['Figma', 'Tailwind', 'Design Systems', 'A11y'],
    syllabus: ['עקרונות עיצוב בסיסיים', 'טיפוגרפיה וצבע', 'Layout ו-Spacing', 'Design Systems', 'נגישות', 'Micro-interactions ואנימציה'],
  },
];

export const CATEGORIES: ('הכל' | CourseCategory)[] = ['הכל', 'פיתוח', 'AI ו-Data', 'תשתיות', 'קריירה', 'אבטחה', 'עיצוב'];

export const platformStats = {
  lessons: allLessons.length + java.lessons.length,
  modules: modules.length + java.modules.length,
  quizQuestions: [...allLessons, ...java.lessons].reduce((a, x) => a + x.lesson.quiz.length, 0),
  terms: glossary.length,
  exercises: allLessons.length + java.lessons.length,
  comparisons: comparisons.length,
  interview: interviewQA.length + scenarios.length,
  courses: courses.length,
};
