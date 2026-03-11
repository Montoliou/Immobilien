---
name: yorkliving-delivery-playbook
description: Use when working on YorkLiving delivery flows, advisor/customer mode splits, preset snapshots, customer links, branch-to-domain deployment rules, or live rollout decisions for `mlp-mediziner-beratung.de/YorkLiving` and `montolio.de/YorkLiving`.
---

# YorkLiving Delivery Playbook

Use this skill when changing the YorkLiving app's delivery model, presets, customer link generation, or branch/domain rollout.

## Core invariants
- Work only in `D:\AppEntwicklung\Immobilien`.
- Never use or modify `D:\AppEntwicklung\KundenPräsentationYorkQuartier`.
- Keep the live mapping explicit:
  - `main` -> `mlp-mediziner-beratung.de/YorkLiving`
  - `berater-kundenversion` -> `montolio.de/YorkLiving`
- Do not mix deployment targets.

## Delivery model
- Advisor version lives on `mlp-mediziner-beratung.de`.
- Customer version lives on `montolio.de`.
- The advisor app keeps the full preset/editor workflow.
- The customer app is reduced and should only be reached via generated customer links.

## Customer link rules
- Do not serialize full customer scenarios into long URLs.
- Generate server-side JSON snapshots and share only `?customer=<token>`.
- Customer changes at home stay local and must never overwrite the stored snapshot.
- If the server write endpoint is unavailable locally, keep a preview fallback only for development.

## Before changing code
1. Read `PROJECT_MEMORY.md`.
2. Read `ROADMAP.md`.
3. Verify current branch with `git status --branch --short`.
4. Check whether the requested change affects advisor mode, customer mode, or both.
5. If the change touches financial outputs, review `skills/finanz-audit-skill/SKILL.md` too.

## Before deploying
1. Confirm the branch/domain pair.
2. Run `npm run build` in `dashboard/`.
3. Deploy only to the intended target:
   - advisor/main target must stay separate from Montolio test/customer target
4. Verify the live URL after deploy.

## Useful files
- `dashboard/src/main.ts`
- `dashboard/src/style.css`
- `dashboard/public/api/create-customer-scenario.php`
- `PROJECT_MEMORY.md`
- `ROADMAP.md`
- `TODO.md`
- `scripts/deploy_yorkliving.py`
