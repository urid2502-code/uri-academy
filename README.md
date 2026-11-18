# האקדמיה של אורי

אתר לימוד ותרגול אינטראקטיבי בעברית: מסלול מהיסוד ועד רמת **Senior Full Stack Engineer**.
המונחים המקצועיים כתובים באנגלית, וההסברים בעברית.

## הרצה

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # בדיקת טיפוסים + בנייה ל-dist/
```

## מה יש באתר

| חלק | תוכן |
|---|---|
| **10 מודולים × 3 שיעורים** | שלב 1 יסודות (Web, JS/TS, כלים) · שלב 2 Full Stack (Node.js, PostgreSQL, React) · שלב 3 Senior (Real-Time, Queues, AI/LLM, Docker/K8s/Observability) |
| **כל שיעור** | מה זה ולמה זה חשוב (עם אנלוגיה) · איך זה עובד + תרשים אינטראקטיבי · דוגמת קוד עם הסבר · טעויות נפוצות · מונחים חשובים · תרגיל עם רמזים ופתרון · מבחן |
| **מילון מונחים** | כל המונחים מכל השיעורים, עם קישור לשיעור שבו הם נלמדים |
| **סימולטור** | המסע של בקשה: Browser ← Server ← Queue ← AI ← Database ← Dashboard, עם הכנסת תקלות ובדיקת עומס |
| **מתחיל מול מקצוען** | 9 השוואות קוד: מה נשבר בגרסה התמימה ולמה הגרסה המקצועית עובדת |
| **הכנה לראיון** | 24 שאלות טכניות עם תשובות + 5 תרחישי System Design עם טיימר, פתרון ורשימת בדיקה |

ההתקדמות, ציוני המבחנים, הפתרונות שלך ומצב בהיר/כהה נשמרים ב-`localStorage` של הדפדפן.

## מבנה הקוד

```
src/content/   התוכן: mN.ts (מבנה, מבחנים, טעויות, מונחים) + mN.md (הסברים, קוד ופתרונות)
src/components/ CodeBlock, Markdown, FlowDiagram, Quiz, Challenge, Sidebar…
src/pages/     Home, ModulePage, LessonPage, Glossary, Simulator, Comparisons, Interview
src/lib/       ניתוב, שמירת התקדמות, מפרק התוכן, הדגשת קוד
```

להוספה או עריכה של תוכן ראו [CONTENT_GUIDE.md](./CONTENT_GUIDE.md). לבדיקת קובצי תוכן:
`node scripts/check-content.mjs m1 m2`.

Stack: React 19, TypeScript, Tailwind CSS v4, Lucide, Vite, גופן Rubik מקומי – בלי תלות באינטרנט.
