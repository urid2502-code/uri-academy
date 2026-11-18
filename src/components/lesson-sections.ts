import { BookA, Bug, Code2, Dumbbell, Lightbulb, ListChecks, Workflow } from 'lucide-react';

export const SECTIONS = [
  { id: 'sec-intro', label: 'מה זה ולמה זה חשוב', title: 'מה זה ולמה זה חשוב', subtitle: 'הרעיון במילים פשוטות, עם אנלוגיה מהחיים', icon: Lightbulb },
  { id: 'sec-how', label: 'איך זה עובד', title: 'איך זה עובד', subtitle: 'צעד אחר צעד, מהבסיס ועד מה שמפתח בכיר יודע', icon: Workflow },
  { id: 'sec-code', label: 'דוגמת קוד', title: 'דוגמת קוד', subtitle: 'קוד אמיתי עם הסבר – אפשר להעתיק ולנסות', icon: Code2 },
  { id: 'sec-mistakes', label: 'טעויות נפוצות', title: 'טעויות נפוצות', subtitle: 'מה בדרך כלל משתבש – ואיך נמנעים מזה', icon: Bug },
  { id: 'sec-terms', label: 'מונחים חשובים', title: 'מונחים חשובים', subtitle: 'כדאי להכיר בעל פה – הם יופיעו שוב ושוב', icon: BookA },
  { id: 'sec-exercise', label: 'תרגיל', title: 'תרגיל', subtitle: 'נסה לבד, השתמש ברמזים, ורק אז תסתכל על הפתרון', icon: Dumbbell },
  { id: 'sec-quiz', label: 'בדוק את עצמך', title: 'בדוק את עצמך', subtitle: '70% ומעלה מסמנים את השיעור כהושלם', icon: ListChecks },
];

export type SectionId = (typeof SECTIONS)[number]['id'];
