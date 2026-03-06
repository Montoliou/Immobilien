# Roadmap

## Goal
- Turn the current York Living dashboard into a reusable real-estate presentation system.
- Keep the calculation engine stable while swapping project content, assumptions, visuals, and timelines with minimal code changes.

## Active Issues
- Issue `#1`: PDF-Ausgabe grundlegend überarbeiten und versandfähig machen
  - Link: `https://github.com/Montoliou/Immobilien/issues/1`
  - Ergänzung für die Umsetzung:
    - PDF braucht einen einfach lesbaren jährlichen Tilgungsplan
    - Jahreswerte sollen mit Zins, Tilgung, Steuerwirkung und kumulierter Belastung nachvollziehbar sein

## Current Baseline
- App lives in `dashboard/`.
- UI and calculation logic are still coupled in `dashboard/src/main.ts`.
- Main project data already sits in `dashboard/src/data/calculation-config.json`.
- Current model includes:
  - project timing (`purchaseYear`, `rentStartYear`, `rentStartQuarter`)
  - Denkmal-AfA timing (`afaStartYear`, `afaStartQuarter`)
  - apartment data
  - financing and tax assumptions

## Priority 1: Separate Property Content From Engine
- Move all York-specific text blocks into a dedicated content file.
- Split configuration into:
  - `property-content.json`
  - `calculation-config.json`
  - optional `market-facts.json`
- Extract reusable render functions for:
  - hero
  - apartment cards
  - fact cards
  - liquidity module

## Priority 2: Make New Properties Plug-In Based
- Introduce a `projectId` layer so one app can serve multiple properties.
- Target structure:
  - `dashboard/src/projects/<project-id>/content.json`
  - `dashboard/src/projects/<project-id>/calculation.json`
  - `dashboard/public/projects/<project-id>/...`
- Add a light loader that mounts the selected project configuration into the existing engine.

## Priority 3: Formalize Calculation Inputs
- Define a stable schema for reusable deal inputs:
  - purchase timeline
  - rent start timeline
  - AfA start timeline
  - financing blocks
  - apartment-level opex
  - tax brackets
- Add validation helpers so a new property config fails fast when fields are missing or inconsistent.

## Priority 4: Reduce Main.ts Complexity
- Split `main.ts` into focused modules:
  - `app-shell.ts`
  - `calculation-engine.ts`
  - `liquidity-view.ts`
  - `config-panel.ts`
  - `project-content.ts`
- Target outcome:
  - content changes without touching calculation code
  - calculation changes without touching UI markup

## Priority 5: Property Onboarding Workflow
- Create a repeatable checklist for new properties:
  1. Copy project template folder
  2. Add brochure-derived facts
  3. Add floorplans and hero image
  4. Fill calculation config
  5. Verify rent start and AfA start assumptions
  6. Review result views and PDF export
- Add a short `NEW_PROPERTY_CHECKLIST.md` once the structure is stable.

## Priority 6: Sales Readiness
- Add a share-safe mode without personal scenario data in the URL.
- Add a consultant mode with more detailed financing controls.
- Add optional project disclaimer blocks per property.
- Add export variants:
  - customer PDF summary
  - detailed consultant PDF
- Add a customer delivery funnel optimized for 2-3 inputs:
  - dedicated landing route per property
  - short intro with one CTA
  - preselected apartment option from deep link or campaign URL
  - optional advisor contact handoff after result view

## Priority 7: Media & Location Integration
- Add a reusable media module for each property:
  - exterior renderings
  - interior renderings
  - floorplans
  - location module
- Prefer source-safe location integration:
  - Google Maps Embed or Static Maps instead of ad-hoc screenshots
  - preserve required attribution if Google Maps imagery is used
- Define a content pattern:
  - first emotional image in hero
  - second image near facts or demand narrative
  - compact gallery/lightbox in a later section
  - location card with map, commute note, and district context

## Priority 8: Quality Guardrails
- Add automated checks for:
  - config validation
  - projection sanity tests
  - rendering of positive/negative liquidity states
- Add snapshot tests for core project cards once the structure is modularized.

## Next Concrete Refactor
- Extract York-specific copy from `main.ts`.
- Introduce `dashboard/src/data/property-content.json`.
- Keep all calculations untouched during that refactor.

