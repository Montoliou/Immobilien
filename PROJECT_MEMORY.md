# Project Memory

## Purpose
- Build and maintain an interactive customer dashboard for the York Living real estate project.
- Primary delivery artifact is the web app in `dashboard/`.

## Active Skill Baseline
- Design skill source: `SKILL.md` at repository root.
- This design guide is mandatory for UI work in this project.
- Key constraints:
  - Neutral gray base palette + one accent color.
  - 8px spacing grid.
  - Body text >= 16px.
  - Explicit hover/active/focus states.
  - Mobile-first responsive behavior.

## Current App Scope
- Customer selects one of two apartment layouts (`A` / `B`).
- Customer enters monthly net income only.
- App calculates projected wealth after 20 years.
- Visual facts from brochure are shown for emotional context.
- Core calculation inputs are centralized in:
  - `dashboard/src/data/calculation-config.json`

## Working Conventions
- Main implementation path: `dashboard/src/`.
- Public assets path: `dashboard/public/`.
- Start app:
  - `cd dashboard`
  - `npm run dev`
- Build app:
  - `npm run build`

## Session Startup Rule
- At start of each implementation session:
  1. Read `SKILL.md`.
  2. Read `PROJECT_MEMORY.md`.
  3. Verify `dashboard/src/data/calculation-config.json` before changing calculations.
