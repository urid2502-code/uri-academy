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
User steer: the previous neon/gradient landing "looks AI generated"; draw inspiration (not copy) from the Impeccable project's restraint.

## Direction contract

THESIS: The landing is the first page of a night notebook: the real 30-lesson path is written as ruled lines you tick off. It refuses the dark-SaaS hero (glow gradients, floating code window, centred headline over a row of course cards).

OWN-WORLD: Polar-night graph paper ground with a hairline ice grid aligned to the content columns and one ice-blue margin rule on the start edge. Glacier blue is the only accent (ink, ticks, primary fill); deep fjord blue marks state. Heebo thin for display, Heebo for body, Playpen Sans Hebrew only for short ink annotations. 2px radii, hairlines, flat surfaces; no glow, glass or gradients.

STORY: The visitor sees a structured path, finds lesson 1 already marked "מתחילים כאן", sees exactly what every lesson contains, answers a real quiz question in place, and starts or resumes.

FIRST VIEWPORT: One notebook sheet. Start half: thin display headline, one-line lede, flat glacier primary "להתחיל את שיעור 1" and quiet secondary to the catalog. End half: ruled index of the stage-1 lessons with three-state boxes; an ink stroke draws from the headline to the first unticked line, annotated in ink. Grid and margin rule run edge to edge.

FORM: assigned direction, position 6 of 7, seed:b531f0f993ef85a7. Raises: one continuous ink line as wayfinding (from Illuminated Initial); three lesson states named beyond colour (from Step Row); resume bookmark on the exact line (from HyperCard). Signature interaction: hovering a lesson line writes its summary as a margin note; the ink line draws once on load.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
