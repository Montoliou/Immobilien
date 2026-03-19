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

## Tax Positioning
- The current tax output is an approximate model, not a full tax engine.
- Customer-facing release rule: communicate the app as an investment scenario calculator with a modeled tax effect.
- Current model disclaimer: approximated taxable income, no Solidaritätszuschlag, no Kirchensteuer.
- To consider for a later V2:
  - true before/after tax engine
  - optional Soli and Kirchensteuer
  - more accurate Denkmal-AfA split for Altbau, Sanierung, and ancillary costs
- Reminder for future sessions:
  - raise the Phase-2 tax-engine question again before broader customer rollouts or stronger tax-related marketing claims.

## Live Deployment Topology
- Two live variants exist at the same time.
- `main` branch is currently live on `mlp-mediziner-beratung.de/YorkLiving`.
- `codex-vorschlaege` was the previous Montolio test branch on `montolio.de/YorkLiving`.
- `berater-kundenversion` is the current Montolio test branch on `montolio.de/YorkLiving` until superseded.
- Do not mix these targets during deploys. Always confirm which branch/domain pairing is intended before publishing.
- Runtime mode is link-driven:
  - `mlp-mediziner-beratung.de/YorkLiving` opens the advisor mode by default
  - `montolio.de/YorkLiving` also opens the advisor mode by default
  - customer mode is entered only via generated customer links (`?customer=<token>`) or explicit preview links with `mode=customer`

## Learned Workflow Patterns
- AfA profiles must be property-specific and explicit. Do not silently reuse Denkmal logic for Neubau cases.
- Denkmal / Sanierungsgebiet:
  - model the begünstigter Sanierungsanteil separately from the non-depreciable land share.
  - `§ 7i` / `§ 7h` enhanced AfA is a special AfA layer on the eligible modernization/restoration basis.
- Neubau mit `§ 7b`:
  - model regular building AfA separately from the `§ 7b` special AfA.
  - `§ 7b` is not a Denkmal profile and must never be approximated through `monumentShare`.
  - the model needs an explicit AfA-fähiger Anteil, a regular building-AfA rate, and the `§ 7b` capped basis/eligibility checks.
  - final release requires review of purchase-price allocation, Bauantrag / eligibility timing, and any current statutory caps.
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
