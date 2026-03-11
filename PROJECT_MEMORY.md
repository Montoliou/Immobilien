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
- Current project timing defaults:
  - Purchase year `2027`
  - Rent start `Q4 2028`
  - Denkmal-AfA start `Q4 2028`

## Live Deployment Topology
- Two live variants exist at the same time.
- `main` branch is currently live on `mlp-mediziner-beratung.de/YorkLiving`.
- `codex-vorschlaege` was the previous Montolio test branch on `montolio.de/YorkLiving`.
- `berater-kundenversion` is the current Montolio test branch on `montolio.de/YorkLiving` until superseded.
- Do not mix these targets during deploys. Always confirm which branch/domain pairing is intended before publishing.
- Runtime mode is domain-bound:
  - `mlp-mediziner-beratung.de` must open the advisor mode
  - `montolio.de` must open the customer mode

## Learned Workflow Patterns
- Customer links are generated from the advisor version only.
- Customer scenarios should be persisted as server-side JSON snapshots, not long query-string payloads.
- Full-screen parameter editing works better than a corner drawer for advisor preparation.
- Always state the local dev URL explicitly after changes; the fixed local target is `http://127.0.0.1:5174/`.
- Repo-local reusable skill created: `skills/yorkliving-delivery-playbook/SKILL.md`.

## Working Conventions
- Main implementation path: `dashboard/src/`.
- Public assets path: `dashboard/public/`.
- Absolute workspace guardrail: only use `D:\AppEntwicklung\Immobilien`.
- Forbidden workspace: `D:\AppEntwicklung\KundenPräsentationYorkQuartier` is out of scope and must never be opened or edited.
- Start app:
  - `cd dashboard`
  - `npm run dev`
- Build app:
  - `npm run build`
- Deploy app:
  - `.\deploy.ps1` (build + deploy)
  - `.\deploy.ps1 -SkipBuild` (deploy only)

## Session Startup Rule
- At start of each implementation session:
  1. Read `SKILL.md`.
  2. Read `PROJECT_MEMORY.md`.
  3. Verify `dashboard/src/data/calculation-config.json` before changing calculations.
  4. Review `ROADMAP.md` if the task affects architecture or reusability.
