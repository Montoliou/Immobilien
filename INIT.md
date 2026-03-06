# Init Guide

Use this quick init sequence whenever you resume work on this project.

## 1. Load project context
- Read `SKILL.md` (design system requirements).
- Read `PROJECT_MEMORY.md` (project decisions and scope).
- Read `.claude.md` for shared repo skills and collaboration rules.

## 2. Install shared skills
```powershell
.\install-repo-skills.ps1
```

## 3. Prepare app
```powershell
cd dashboard
npm install
```

## 4. Run app
```powershell
..\start-dashboard.ps1
```

Alternative directly from `dashboard`:
```powershell
npm run dev:open
```

## 5. Validate before commit
```powershell
npm run build
```
