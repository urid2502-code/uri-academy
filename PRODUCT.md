# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Primarily Uri himself: a Hebrew-speaking learner growing from beginner toward a Senior Full Stack Engineer role (TypeScript/Node.js, real-time systems, event-driven microservices, PostgreSQL, React, LLM integration, Kubernetes/observability). He studies on desktop and on his phone (installed as a home-screen web app). Secondary: friends and colleagues he shares the link with.

## Product Purpose
"האקדמיה של אורי" is a personal Hebrew learning and practice platform. It turns a demanding senior-engineering skill set into a step-by-step path that starts from zero. Success: the visitor feels the site is serious and professional and starts (or resumes) the first lesson.

## Positioning
A Hebrew, RTL, beginner-to-senior curriculum where key technical terms stay in English and explanations are in Hebrew; every lesson follows the same 7-step structure (analogy intro, how it works with an interactive diagram, real code, common mistakes, key terms, exercise with hints, quiz), backed by interactive tools: a request-journey simulator with failure injection, beginner-vs-pro code comparisons, interview prep with timed System Design scenarios, and a glossary.

## Operating Context
Static site (Vite + React 19 + TypeScript + Tailwind v4 + motion) deployed to GitHub Pages at https://urid2502-code.github.io/uri-academy/, hash routing. Progress, quiz scores, notes and theme persist in the browser's localStorage per device. Must work fully offline-capable from bundled assets (no runtime CDNs). Installed as a PWA-style home-screen app on mobile.

## Capabilities and Constraints
- Live course: "Full Stack מהיסוד ועד Senior" – 10 modules, 30 lessons, 3 stages (יסודות / בניית מוצר Full Stack / רמת Senior).
- Catalog of 12 courses; 11 are "בקרוב" (coming soon) with syllabus previews only.
- Existing routes, lesson URLs, quiz/progress logic, simulator, glossary, comparisons and interview pages must keep working unchanged.
- Hebrew RTL throughout; code and English terms rendered LTR.

## Brand Commitments
- Name: "האקדמיה של אורי".
- Language rule: key technical terms in English, explanations in Hebrew.
- Binding visual constraint from the user: arctic palette – black, dark blue and light blue.

## Evidence on Hand
Real, countable facts only: number of courses, lessons, quiz questions, glossary terms, comparisons, interview questions/scenarios (derived from `src/content`). There are no users, testimonials, ratings, enrollments or press – never fabricate them.

## Product Principles
1. Honesty over hype: show only real numbers and real content.
2. Start from zero, reach senior: every surface should make the first step obvious and the path visible.
3. Serious and professional: the platform should feel like a real engineering school, not a toy.
4. Learning works everywhere: phone and desktop are both first-class.

## Accessibility & Inclusion
Respect prefers-reduced-motion; maintain readable contrast on dark surfaces; full keyboard access for interactive elements.
