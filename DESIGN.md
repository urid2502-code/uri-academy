# DESIGN.md · מחברת לילה (Night Notebook)

The visual system for האקדמיה של אורי. The landing and catalog are a dark graph-paper notebook; the in-app pages share the same arctic tokens.

## Palette (OKLCH, defined in `src/index.css`)

| Token | Dark | Role |
| --- | --- | --- |
| `--night` | `oklch(9% 0.022 258)` | Notebook sheet (landing, catalog) |
| `--bg` / `--surface` / `--surface-2` | 11.5% / 14.8% / 18.4% L, hue ~256 | App grounds, raised surfaces |
| `--line` / `--line-strong` | 26% / 35% L | Hairlines and ruled rows |
| `--fg` / `--muted` / `--faint` | 95.5% / 81% / 66% L | Text, all ≥ 4.5:1 on `--night` |
| `--ice` (= `--brand`) | `oklch(85% 0.095 226)` | The only accent: primary action, ink, focus |
| `--fjord` | `oklch(52% 0.13 252)` | State fills (ticked boxes, brand mark) |

Light theme keeps the same hues with inverted lightness.

## Type

- **Heebo Variable**: everything. Display at weight 200 (`.display-thin`), section titles at 300 (`.h2-note`).
- **Playpen Sans Hebrew** (`.ink`): only short handwritten annotations (מתחילים כאן, margin notes, quiz feedback). Never body copy.
- Numbers use `.tabular`.

## Rules

- 2px radii, 1px hairlines, flat surfaces. No gradients, glow, glass, blur or neon.
- No eyebrow/kicker above headings. No icon-card grids.
- Lists are ruled rows (`.rule-b`) with three-state boxes (`StateBox`: empty / ticked / starred = 100% on the quiz).
- One authored motion moment: the ink stroke in the hero draws once (respects reduced motion).
- Only real data: every number comes from the course content or the user's own progress.

## Components

`src/components/notebook.tsx`: `NotebookShell`, `SiteNav`, `SiteFooter`, `StateBox`, `LedgerRow`. Buttons: `.btn-ice`, `.btn-ice-lg`, `.link-quiet`.
