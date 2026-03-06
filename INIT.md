# Init Guide

Use this quick init sequence whenever you resume work on this project.

## 1. Load project context
- Read `SKILL.md` (design system requirements).
- Read `PROJECT_MEMORY.md` (project decisions and scope).

## 2. Prepare app
```powershell
cd dashboard
npm install
```

## 3. Run app
```powershell
..\start-dashboard.ps1
```

Alternative directly from `dashboard`:
```powershell
npm run dev:open
```

## 4. Validate before commit
```powershell
npm run build
```
