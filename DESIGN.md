---
name: "האקדמיה של אורי"
description: "Charcoal-navy course discovery with ice-blue interaction and locally authored technical artwork."
colors:
  night: "oklch(9% 0.022 258)"
  bg: "oklch(11.5% 0.026 256)"
  surface: "oklch(14.8% 0.03 256)"
  surface-2: "oklch(18.4% 0.034 255)"
  line: "oklch(26% 0.04 254)"
  line-strong: "oklch(35% 0.05 252)"
  fg: "oklch(95.5% 0.012 236)"
  muted: "oklch(81% 0.024 238)"
  faint: "oklch(66% 0.03 244)"
  ice: "oklch(85% 0.095 226)"
  brand-fg: "oklch(16% 0.04 256)"
  fjord: "oklch(52% 0.13 252)"
  hero-ground: "#0c171f"
  gallery-slate: "#26353ec9"
  gallery-selected: "#253e4bd9"
  gallery-outline: "#96e5f6"
typography:
  display:
    fontFamily: '"Heebo Variable", "Heebo", "Segoe UI", "Arial Hebrew", Arial, sans-serif'
    fontSize: "clamp(2.5rem, 4.6vw, 4rem)"
    fontWeight: 550
    lineHeight: 1.08
    letterSpacing: "-0.035em"
  headline:
    fontFamily: '"Heebo Variable", "Heebo", "Segoe UI", "Arial Hebrew", Arial, sans-serif'
    fontSize: "28px"
    fontWeight: 650
    lineHeight: 1.2
    letterSpacing: "-0.012em"
  title:
    fontFamily: '"Heebo Variable", "Heebo", "Segoe UI", "Arial Hebrew", Arial, sans-serif'
    fontSize: "25px"
    fontWeight: 550
    lineHeight: 1.25
  body:
    fontFamily: '"Heebo Variable", "Heebo", "Segoe UI", "Arial Hebrew", Arial, sans-serif'
    fontSize: "15px"
    lineHeight: "28px"
  label:
    fontFamily: '"Heebo Variable", "Heebo", "Segoe UI", "Arial Hebrew", Arial, sans-serif'
    fontSize: "14.5px"
    fontWeight: 600
  course-title:
    fontFamily: '"Heebo Variable", "Heebo", "Segoe UI", "Arial Hebrew", Arial, sans-serif'
    fontSize: "36px"
    fontWeight: 650
    lineHeight: 1.35
    letterSpacing: "-0.025em"
  reading-body:
    fontFamily: '"Heebo Variable", "Heebo", "Segoe UI", "Arial Hebrew", Arial, sans-serif'
    fontSize: "16px"
    lineHeight: "32px"
rounded:
  detail: "2px"
  tag: "4px"
  status: "5px"
  catalog-tag: "6px"
  control: "7px"
  nav: "8px"
  card: "12px"
  gallery: "14px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  gutter: "20px"
  gallery-gap: "24px"
  card-inset: "26px"
  desktop-gutter: "32px"
components:
  button-primary:
    backgroundColor: "{colors.ice}"
    textColor: "{colors.brand-fg}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "0.55rem 1rem"
  button-primary-large:
    backgroundColor: "{colors.ice}"
    textColor: "{colors.brand-fg}"
    rounded: "{rounded.control}"
    padding: "0.85rem 1.4rem"
  button-primary-hover:
    backgroundColor: "oklch(91% 0.07 222)"
  button-secondary:
    textColor: "{colors.fg}"
    rounded: "{rounded.control}"
    padding: "0.85rem 1.4rem"
  search:
    backgroundColor: "transparent"
    textColor: "{colors.fg}"
    padding: "8px 28px 8px 0"
  course-card:
    backgroundColor: "oklch(14% 0.025 255)"
    rounded: "{rounded.card}"
    padding: "{spacing.card-inset}"
  gallery-card:
    backgroundColor: "{colors.gallery-slate}"
    rounded: "{rounded.gallery}"
    padding: "10px"
    width: "300px"
  gallery-card-selected:
    backgroundColor: "{colors.gallery-selected}"
  technology-tag:
    textColor: "{colors.muted}"
    rounded: "{rounded.catalog-tag}"
    padding: "4px 8px"
  navigation:
    backgroundColor: "{colors.night}"
    height: "80px"
  learning-header:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.card}"
    padding: "24px 28px"
---

# Design System: האקדמיה של אורי

## Overview

**Creative North Star: "Cinematic Course Gallery"**

Charcoal-navy grounds, ice-blue actions and original technical illustrations give this Hebrew learning platform a serious, cinematic character. Translucent slate belongs to course discovery; quieter opaque cards, fine dividers and readable rows support deeper learning content.

The finished gallery replaces the rejected Night Notebook identity, not the underlying learning tools. Course dashboards, module overviews, lesson readers and upcoming-course previews extend that identity through restrained learning interfaces. Marketing explicitly uses dark mode; learning screens preserve the user's light/dark preference.

**Key Characteristics:**
- Dark tonal layering with selective ice-blue emphasis.
- Self-hosted Heebo, Hebrew RTL and explicit LTR technical content.
- Original local SVG course artwork, reused across gallery and catalog.
- Clear live/coming-soon states and content-derived facts.

## Colors

Cool, near-black neutrals carry the interface; pale glacier blue marks action, focus and selection.

### Primary
- **Glacier Ice** (`ice`): primary buttons, focus outlines, selected controls and progress. The source aliases `brand` to this same value.
- **Deep Action Ink** (`brand-fg`): dark text on filled ice buttons.

### Secondary
- **Fjord Blue** (`fjord`): filled completion boxes and small app state accents.

### Neutral
- **Polar Night** (`night`): marketing shell, navigation and footer ground.
- **App Ground / Surface / Raised Surface** (`bg`, `surface`, `surface-2`): shared app layering.
- **Fine / Strong Outline** (`line`, `line-strong`): card edges, dividers and stronger controls.
- **Snow Text / Cool Muted / Slate Faint** (`fg`, `muted`, `faint`): primary, supporting and metadata text.
- **Hero Charcoal** (`hero-ground`): illustration-backed hero ground.
- **Gallery Slate / Selected Slate / Ice Outline** (`gallery-slate`, `gallery-selected`, `gallery-outline`): translucent card material and active edge.

**The State Before Decoration Rule.** Use ice for actions, focus and selection; course illustrations may also carry luminous blue and pale highlights.

## Typography

**Display Font:** Heebo Variable, with the frontmatter fallback stack.
**Body Font:** The same Heebo stack, self-hosted through `@fontsource-variable/heebo`.
**Code Font:** `"JetBrains Mono", "Cascadia Code", "Fira Code", Consolas, ui-monospace, monospace`; this is a declared stack, not a promise that every face is bundled.

**Character:** Compact Hebrew shapes and medium-to-bold weights replace the old thin/handwritten pairing. Playpen is not part of the finished system.

### Hierarchy
- **Display:** frontmatter hero clamp, balanced wrapping; catalog heading uses (44px / 68px), weight (700), line-height (1.15), tracking (-0.02em).
- **Headline:** course and lesson titles use (36px), reduced to (28px) on phones, weight (650). Learning-section headings use (20–23px), weight (550–600).
- **Title:** gallery title uses the frontmatter role, reduced to (23px) on phones; catalog card titles use (22px), weight (600), line-height (1.375).
- **Body:** catalog cards use the frontmatter body role; learning prose uses (16px / 32px), lesson summaries (17px / 1.9); hero introduction uses (16px / 1.8), reduced to (15px) on phones.
- **Label:** primary button uses the frontmatter label role; gallery status uses (11px), descriptions (13px / 1.7), tags (10px).

**The Language Direction Rule.** Keep Hebrew prose RTL; code, technology tag runs and the physical carousel track are explicitly LTR. Use tabular numerals for progress and counts.

## Layout

- Shared content container: centered (1152px maximum), horizontal gutters (20px), increasing to (32px) at (768px).
- The compact landing contains only the course hero inside the shared navigation/footer shell. Curriculum, quizzes, comparisons, tool ledgers and catalog grids are not repeated below it; their product routes remain separate.
- Catalog grid gaps are (20px); cards stack, become two columns at (768px), then three at (1024px). Catalog content uses the shared container, not the gallery's edge-to-edge treatment.
- Hero copy is centered within (860px), introduction within (600px). These are hero-specific, not global text alignment.
- Gallery viewport spans the full page width (100%), outside the capped copy/container. It starts (16px) below the copy, or (12px) on phones, with vertical inset (24px / 18px), (24px) card gaps and narrow edge masks (2% / 98%). Cards are (300px) wide, or (260px) at viewport widths up to (639px). Overflow stays inside the gallery; touch retains vertical page scrolling.
- Navigation is sticky and (80px) tall. Desktop links appear at (768px); smaller layouts use a labelled expandable menu. The separate header CTA appears from (640px).
- Ruled syllabus rows remain on upcoming-course pages; cinematic discovery does not turn every surface into glass.
- Learning navigation uses an opaque (272px) sidebar from (1024px), a mobile drawer below it, and a (60px minimum) utility bar. Course content is capped at (1200px) with (32px) desktop / (20px) phone gutters.
- Shared course headers pair a cropped original SVG cover (156px high / 116px on phones) with an opaque title/action area. Modules use ruled lesson lists and a contextual outcomes/progress column, stacked below (1200px).
- The dashboard separates curriculum, skill map and learning guide into keyboard-accessible tabs. Three stage filters and expandable modules keep the full curriculum accessible without a long card grid.
- Lessons use a (72ch maximum) article, a sticky (184px) table of contents from (1280px), and an expandable index on smaller screens. Header, terms and section divisions use fine rules, not colorful hero panels.

## Elevation & Depth

Depth combines dark tonal surfaces, illustration gradients, masked edges and restrained translucent material. Gallery cards use backdrop blur (12px), a fine outline, and a raised selected state. Gradients, blur and glow are native here, not prohibited notebook-era exceptions.

### Shadow Vocabulary
- **Selected gallery:** `0 18px 40px -24px #70cfe57a`; a diffuse blue lift under the active card.
- **Shared soft surface:** existing `.shadow-soft` uses paired ambient shadows, with a darker theme override; it is an app utility, not the default marketing-card treatment.

**The Selection Owns Depth Rule.** Gallery previews rest at scale (.91), opacity (.76); the selected card becomes full scale and opacity and rises (-12px). Catalog hover rises (-4px) with an ice border, without inheriting gallery glass.

## Shapes

Soft rectangular cards and clipped artwork use the frontmatter corner vocabulary: image/button corners, opaque catalog cards and larger gallery shells. Smaller radii remain intentional for technology tags, status chips, code and completion boxes. Circular arrow controls and pill-shaped progress indicators are established exceptions, not a reason to round every container.

## Components

### Buttons
Filled ice buttons are compact and confident; the large variant increases type to (16px). Hover brightens and lifts (-2px) over (160ms ease-out). Outlined secondary buttons use a strong border, then an ice border and raised-surface fill on hover. Quiet links retain an underline. Global keyboard focus is an ice outline (2px), offset (3px).

### Chips
Technology tags are small outlined labels, not actions. Catalog tags use the frontmatter variant; gallery tags use (3px 7px) padding and smaller corners. Live status gets a blue-tinted chip in catalog cards; upcoming status remains explicit text. Category filters are underlined text buttons with `aria-pressed`, not filled pills.

### Cards / Containers
Catalog cards use opaque dark fill, (26px) inset, (12px) corners and a fine border. Live cards use a lighter blue-navy ground and stronger edge. Covers use a (1.9) aspect ratio; compact gallery artwork uses (1.85). Gallery titles reserve (60px); descriptions clamp to two lines within (44px). Course art is generated as local SVG data URLs: circuits, AI, architecture, design and data, without runtime image hosts.

### Inputs / Fields
Catalog search is transparent and bottom-bordered, with an inset SVG search icon and a programmatic label. Focus changes the underline to ice. It is not a boxed or glass field; no error style is established by this surface.

### Navigation
Solid polar-night navigation uses muted links that brighten on hover, a small outlined code mark and the primary CTA. Mobile menu links are separated by fine rules; the toggle exposes expanded state.

### Course Gallery
A continuous `position` drives the track; modulo-derived `activeIndex` controls the selected tab, artwork, caption and CTA. Arrows, Left/Right and drag/swipe loop in both directions. Card and pagination selection take the shortest path; Home/End select the first/last course without disabling either arrow. Per-card motion transforms recycle the twelve real cards offscreen, avoiding duplicate tab IDs and a long rewind at the boundary. Tabs use `aria-selected`, roving tab stops and a linked panel; the current course is politely announced.

Artwork crossfades over (650ms ease-out); track centering uses a spring (stiffness 260, damping 32). Card emphasis transitions over (350ms ease-out), pagination over (250ms). Reduced motion makes backdrop/centering changes instant and disables marketing CSS transitions/animations. Selection never implies availability: the live course starts/resumes learning; upcoming courses open their syllabus.

### Learning Screens
Focus Mode removes the sidebar: a (64px) bar carries exit, lesson position, completion and panel toggle; a (2px) reading-progress line sits below it. The (360px) side panel (a drawer below 1024px with an explicit close button) holds Deep Notes and a collapsible Timeline of Mastery; the article remains (72ch). Thought Streams uses a (760px) column, opaque (12px) cards, one-row post-type controls and honest local-only copy. Catalog and gallery cards show only status, title, a two-line description and level/lessons/hours; tag chips and category badges are intentionally omitted.
Course headers use (12px) corners; curriculum lists (10px), small controls (6px), and lesson content panels (8px). Accent belongs to the primary learning action, selected state and completion. Progress summaries, skills and tools are compact ledgers or rows rather than decorative metric cards. Lessons retain code tabs/copy, exercises, hints, model solutions, quizzes, completion and previous/next navigation. Content and `uri-academy:progress:v1` stay unchanged. Table-of-contents scrolling respects reduced motion.

## Do's and Don'ts

### Do:
- **Do** reuse shared dark tokens and the observed corner hierarchy.
- **Do** keep original local course artwork consistent across gallery and catalog.
- **Do** preserve keyboard selection, visible focus, RTL/LTR boundaries and reduced-motion behavior.
- **Do** label upcoming content honestly and derive counts from real curriculum or local progress.

### Don't:
- **Don't** restore the rejected graph-paper notebook or handwritten display treatment.
- **Don't** ban gradients, translucency or soft blue depth that the finished gallery uses.
- **Don't** fabricate ratings, testimonials, enrollments or other proof.
- **Don't** introduce external runtime image or font hosts.
