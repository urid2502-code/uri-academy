---
version: 1
slug: "src-pages-landing-tsx"
primary_target: "src/pages/Landing.tsx"
related_targets: ["src/pages/Catalog.tsx"]
---

Scope: landing page (route #/) and the course catalog (#/courses, #/course/:id) of האקדמיה של אורי. Visitor mode: Persuade.
Audience: Uri (Hebrew learner, beginner toward Senior Full Stack), plus friends he shares the link with. Job: feel the platform is serious and professional, then start or resume lesson 1.
Proof on hand: the real curriculum (10 modules, 30 lessons, 7-step lesson ritual, 120 quiz questions, 202 glossary terms, simulator, comparisons, interview prep). No users, testimonials or ratings exist; never invent them.
Constraints: Hebrew RTL; pinned arctic palette (black, dark blue, light blue); in-app routes and progress logic untouched; respects prefers-reduced-motion; works on phone.
User steer: the notebook design was rejected. Keep the compact full-width gallery. Latest refinement: "I WANT THE CAROUSLE WILL NEVER END, RETURN TO FIRST WHEN ON LAST". Loop both directions without changing the chosen visual identity.

## Direction contract

THESIS: A cinematic course discovery hero. The selected learning pathway owns both the centered carousel card and the cross-fading background, while all real learning tools remain intact.

OWN-WORLD: Black and charcoal-navy canvas, cool ice-blue accents, locally authored SVG circuit/AI/data/design artwork. Medium-weight Heebo display, glass-like slate carousel cards with fine outlines and a raised active state; no external image hosts.

STORY: Understand the beginner-to-Senior purpose, explore 12 real courses, start or resume the live Full Stack course, or inspect a clearly labelled upcoming syllabus. Curriculum, quizzes, comparisons and tools remain on their dedicated routes, not repeated below the landing hero.

FIRST VIEWPORT: Compact centered two-line headline and Hebrew proposition over subject artwork. Primary CTA follows the active course. The gallery spans the entire viewport, with multiple smaller previews on each side of the active image card. Arrows, position controls and current-course announcement follow immediately. Landing ends at the shared footer. Phone layout retains swipeable previews without page overflow.

FORM: seed: none (pinned). The user supplied a visual reference and requested a "dynamic hero section with a moveable/interactive course carousel where the background hero imagery updates in real-time". Mouse drag, touch swipe and arrows drive a continuous position; modulo activeIndex synchronizes selection, background and CTA. Recycle real cards offscreen for a one-card boundary transition with no duplicated tab IDs. Card/pagination selection takes the shortest path; Home/End select first/last while arrows remain enabled. Reduced motion uses instant changes.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
