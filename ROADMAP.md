# Roadmap

## Goal
- Turn the current York Living dashboard into a reusable real-estate presentation system.
- Keep the calculation engine stable while swapping project content, assumptions, visuals, and timelines with minimal code changes.

## Priority 0: Live-Fähige Trennung von Berater- und Kundenversion
- Status im Branch `berater-kundenversion`: technisch weitgehend umgesetzt; Montolio dient als Review-Stand, Merge nach `main` und Live-Rollout auf die Beratungsdomain stehen noch aus.
- Stabilen Merge-Pfad zwischen `main` und `codex-vorschlaege` definieren.
- Zielbild:
  - `main` bleibt Beraterversion auf `mlp-mediziner-beratung.de/YorkLiving`
  - `montolio.de/YorkLiving` startet ebenfalls die Beraterversion als Review-Stand
  - Kundenversionen öffnen nur noch über personalisierte Snapshot- oder Vorschau-Links
- Vorgaben aus Issue `#2` umsetzen:
  - Preset-Modul bleibt in der Beraterversion erhalten
  - Kundenlink wird aus der Beraterversion erzeugt
  - Kundenversion bleibt minimiert und nicht frei konfigurierbar
  - Vor- und Nachname werden im Beratungsmodus erfasst und im Kundenszenario gespeichert
  - kompletter Preset-Snapshot wird serverseitig pro Kunde als JSON eingefroren
  - Kundenlink bleibt kurz und lädt nur noch `?customer=<token>`
  - Kundenänderungen zu Hause bleiben rein lokal und überschreiben niemals das gespeicherte Ausgangsszenario

## Priority 0A: Finanzielle Startlogik korrigieren
- Status im Branch `berater-kundenversion`: umgesetzt und auf Montolio testbar.
- Startvermögen, Nebenkosten und eingesetztes Eigenkapital auf eine konsistente Definition bringen.
- Kaufpreis bleibt Objektwertbasis, Nebenkosten werden als separater Vermögenseffekt modelliert.
- Feste Regel: Wenn `Nebenkosten < EK-Einsatz`, startet das Vermögen mit `EK-Einsatz - Nebenkosten`.
- Vermögenspfad, Ergebniskennzahlen und Detailtabelle müssen denselben fachlichen Startpunkt nutzen.
- Aktueller Stand:
  - Vermögenszuwachs bezieht sich auf `Startvermögen` statt `Startkapital`.
  - Das Vermögensdiagramm zeigt einen Startpunkt `0` mit Nebenkosten-Effekt.
  - Die Vermögenszusammensetzung reagiert auf Hover/Fokus im Diagramm.
  - Beim Wechsel der Wohnung springt `Eigenkapital` standardmäßig auf die Nebenkosten der gewählten Einheit und bleibt danach manuell überschreibbar.

## Priority 0B: Tax Communication Safety
- Status im Branch `berater-kundenversion`: Phase 1 als Kommunikations- und Freigabeschritt offen.
- Ziel: Die App darf nach außen nur als Investment-Szenario-Rechner mit modelliertem Steuereffekt auftreten.
- Phase 1 Release-Gate vor Kundenausgabe:
  - UI-Terminologie auf `Steuermodell`, `Steuereffekt`, `Mit Steuereffekt`, `Ohne Steuereffekt` umstellen
  - sichtbare Hinweise ergänzen: angenähertes zvE, ohne Soli/Kirchensteuer
  - missverständliche Tabellen- und Ergebnislabels entschärfen
  - keine Scheingenauigkeit in Mail- oder Ergebnistexten
- To consider für V2:
  - echte Vorher-/Nachher-Steuerrechnung
  - Soli und Kirchensteuer optional modellieren
  - Denkmal-AfA fachlich sauber in Altbau-/Sanierungsanteil und ENK-Aufteilung trennen
- Reminder:
  - Vor größeren Kundenausrollungen erneut prüfen, ob Phase 2 notwendig wird.

## Active Issues
- Issue `#1`: PDF-Ausgabe grundlegend überarbeiten und versandfähig machen
  - Link: `https://github.com/Montoliou/Immobilien/issues/1`
  - Roadmap-Mapping: `Priority 2`
  - Ergänzung für die Umsetzung:
    - PDF braucht einen einfach lesbaren jährlichen Tilgungsplan
    - Jahreswerte sollen mit Zins, Tilgung, Steuerwirkung und kumulierter Belastung nachvollziehbar sein
- Issue `#2`: Wahl Berater- und Kundenversion
  - Link: `https://github.com/Montoliou/Immobilien/issues/2`
  - Roadmap-Mapping: `Priority 0`
  - Kritischer Punkt: Branch- und Domain-Trennung muss ohne Funktionsverlust zusammengeführt werden
- Issue `#3`: Eigenkapital sichtbar machen
  - Link: `https://github.com/Montoliou/Immobilien/issues/3`
  - Roadmap-Mapping: `Priority 0A`
  - Kritischer Punkt: fachliche Korrektheit von Startvermögen, Nebenkosten und Vermögenspfad
- Issue `#4`: Jährliche Einnahmen und Ausgaben anpassen
  - Link: `https://github.com/Montoliou/Immobilien/issues/4`
  - Roadmap-Mapping: `Priority 1A`
- Issue `#5`: Prognose deutlicher machen
  - Link: `https://github.com/Montoliou/Immobilien/issues/5`
  - Roadmap-Mapping: `Priority 1B`
- Issue `#6`: Parameter Menü Layout anpassen
  - Link: `https://github.com/Montoliou/Immobilien/issues/6`
  - Roadmap-Mapping: `Priority 1C`
- Issue `#7`: Version 2.0 modularer Aufbau für das einfache Arbeiten neuer Immobilien
  - Link: `https://github.com/Montoliou/Immobilien/issues/7`
  - Roadmap-Mapping: `Priority 2A`
  - Strategischer Punkt: Intake- und Projektstruktur für neue Immobilien vorbereiten

## Issue Intake 2026-03-10
- Die Issues teilen sich in drei Gruppen:
  - Betriebs- und Live-Struktur: `#2`
  - Fachliche/UX-Klarheit im bestehenden Rechner: `#3`, `#4`, `#5`, `#6`
  - Langfristige Produktisierung: `#1`, `#7`
- Empfohlene Abarbeitungsreihenfolge:
  1. `#2` Berater-/Kundenversion stabil zusammenführen
  2. `#3` Eigenkapital- und Startvermögenslogik fachlich korrigieren
  3. `#4` Tabelle fachlich vervollständigen
  4. `#5` Prognosebereich klarer führen
  5. `#6` Parameter-Menü zum echten Editor ausbauen
  6. `#7` Modularisierung für neue Immobilien absichern
  7. `#1` PDF auf dem modulareren Unterbau neu aufsetzen
- Aktuelle Abhängigkeiten:
  - `#2` ist Voraussetzung für klare Live-Verantwortung von Berater- und Kundenversion
  - `#3` sollte vor größeren Kommunikations- und PDF-Ausgaben geklärt werden
  - `#4` unterstützt direkt `#1`
  - `#7` reduziert den Umbauaufwand für `#1` und künftige Immobilien
- Festgelegte Entscheidungen vom 10.03.2026:
  - Namens-Personalisierung aus `#2` wird im Kundenszenario pro Kunde gespeichert
  - Kundenszenarien werden nicht als Voll-URL serialisiert, sondern als serverseitige JSON-Snapshots mit kurzem Token-Link ausgeliefert
  - Startvermögen aus `#3` folgt der Regel `EK-Einsatz - Nebenkosten`, wenn mehr als die Nebenkosten eingebracht werden
  - Parameter-Menü aus `#6` wird auf allen Breakpoints vollflächig umgesetzt, inklusive Namensvorbereitung

## Current Baseline
- App lives in `dashboard/`.
- UI and calculation logic are still coupled in `dashboard/src/main.ts`.
- Main project data already sits in `dashboard/src/data/calculation-config.json`.
- Current model includes:
  - project timing (`purchaseYear`, `rentStartYear`, `rentStartQuarter`)
  - Denkmal-AfA timing (`afaStartYear`, `afaStartQuarter`)
  - apartment data
  - financing and tax assumptions

## Priority 1A: Detailtabelle fachlich vervollständigen
- Status im Branch `berater-kundenversion`: weitgehend umgesetzt.
- Ergänze unter `Jährliche Einnahmen und Ausgaben` eine Summenzeile für alle Geldspalten.
- Ergänze mindestens zwei neue Vermögensspalten:
  - `Immobilienwert`
  - `Restschuld`
- Prüfe zusätzlich eine Spalte `Nettovermögen`, wenn dies die Lesbarkeit erhöht.
- Aktueller Stand:
  - Tabelle enthält `Restschuld` und `Immobilienwert`.
  - Eine Abschlusszeile `Summe` ist sticky und unterscheidet Summen von Endständen.
  - Header sind visuell verdichtet und Spaltenbreiten vereinheitlicht.

## Priority 1B: Prognosebereich klarer führen
- Status im Branch `berater-kundenversion`: umgesetzt und lokal reviewbar.
- `3. Prognose` typografisch auf das Niveau von Schritt 1 bringen.
- Kurz erklären, was der Kunde nacheinander tun soll und wann sich die rechte Seite aktualisiert.
- Ergebnis-Kernaussage früher und verständlicher im Blick halten.
- Aktueller Stand:
  - Drei-Schritt-Leiste unter dem Hero ergänzt.
  - Prognosebereich beginnt mit eigener Hauptüberschrift und klarer Leseanweisung.
  - Dynamische Kernaussage bleibt direkt unter der Sektionsüberschrift sichtbar.

## Priority 1C: Parameter-Menü zum echten Editor ausbauen
- Status im Branch `berater-kundenversion`: umgesetzt und auf Montolio reviewbar.
- Menü auf Desktop und Mobile vollflächig über die gesamte Höhe aufziehen.
- Layout für schnelles Arbeiten im Beratungsmodus optimieren.
- Kundenname als Teil des Beratungs-Workflows direkt im Editor vorbereiten.
- Glassmorphism und Animation gezielt, aber nicht zulasten der Lesbarkeit einsetzen.
- Aktueller Stand:
  - Vollflächiger Berater-Editor mit einer konsolidierten `Preset-Verwaltung` und scrollbarer Parameterfläche.
  - Projekt-Presets und JSON-Import landen im selben Laufzeitpfad ohne Seiten-Reload.
  - Header enthält nur noch Editor-Aktionen plus kompakten Zuschnitt; Statusmeldungen sitzen inline in der Preset-Verwaltung.
  - Dirty-State mit Bestätigungsdialog schützt vor versehentlichem Überschreiben ungespeicherter Änderungen.

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

## Operational Asset: Delivery Skill
- Repo-local skill added: `skills/yorkliving-delivery-playbook/SKILL.md`.
- Purpose:
  - keep advisor/customer delivery rules stable
  - preserve branch/domain mapping during deploys
  - document the customer snapshot workflow and rollout checks
- `install-repo-skills.ps1` now syncs this skill into the local Codex skill directory for collaborators.

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
- Add a preset and share-link contract for customer scenarios:
  - consultant preset IDs for advisor-defined defaults
  - all customer-facing inputs must be reproducible from a customer snapshot plus optional local URL overrides
  - consultant-only config must not leak into generic customer links
  - exact rule: one customer changing values at home must never affect another customer
  - keep browser-local config isolated via local storage only, never via shared remote state
  - customer links should prefer short tokens over long query strings

## Priority 6A: Preset Architecture For Advisor And Customer Mode
- Introduce a preset file as the single source of truth for distributable customer setups.
- Proposed file shape:
  - `id`, `label`, `version`, `updatedAt`
  - `contact`
  - `hero`
  - `marketFacts`
  - `calculationConfig`
  - `scenarioDefaults`
  - `customerControls`
- Keep consultant-only configuration out of the generic customer URL.
- Use immutable preset files instead of overwriting one live config file.

## Priority 6B: Delivery Modes
- Split the app into two explicit modes:
  - `mode=admin`: full parameter menu, preset editing, export/save actions
  - `mode=customer`: only the approved dashboard controls, no scenario-link UI, no raw parameter editing
- Customer mode should load exactly one preset as its base state.
- Advisor mode should be able to preview the customer version before sharing.

## Priority 6C: Preset Delivery Phases
- Phase A: Static preset delivery
  - store preset JSON files in `dashboard/public/presets/`
  - load them via `?preset=<id>`
  - export/update preset JSON from advisor mode
  - deploy preset files together with the app
- Phase B: Server-backed preset save
  - add a protected write endpoint for saving preset JSON from the UI
  - keep versioning and validation server-side
  - never allow customer-side writes back into shared presets
  - create per-customer scenario snapshots on the server and return short links


## Priority 6E: Serverseitige Kundenszenarien
- Beraterversion erzeugt aus aktuellem Preset, Name und Szenario ein serverseitiges JSON.
- Zielstruktur:
  - `customer-scenarios/<token>.json`
  - Linkform: `/YorkLiving/?customer=<token>`
- Snapshot-Inhalt:
  - `id`
  - `createdAt`
  - `customer.firstName`
  - `customer.lastName`
  - kompletter `preset`-Snapshot inklusive `calculationConfig` und `scenarioDefaults`
- Technische Leitplanken:
  - Schreiben nur über einen Server-Endpunkt
  - Kundenansicht lädt Snapshots nur lesend
  - keine Überschreibung bestehender Snapshots
  - Tokens nicht erratbar, keine fortlaufenden IDs
  - lokale Entwicklung darf mit Vorschau-URLs arbeiten, falls der Endpunkt nicht verfügbar ist
## Priority 6D: Customer-Facing UX Rules
- In customer mode:
  - remove the scenario-link button
  - keep only the approved dashboard inputs
  - move Google Maps out of the main hero action area
  - enlarge the hero image area
  - place the main headline above the hero visual
- Keep contact handoff prominent and friction-light.

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





## Latest Update 2026-03-14
- `codex-vorschlaege`: Kundenversion-Hero neu gewichtet.
  - Bilder stehen jetzt vor dem Content-Block.
  - Fünf Projektkacheln verdichten die Exposé-Argumente direkt im Hero.
  - Standort-CTA ist als klarer Button integriert.
  - Die dunkle Caption-Leiste unter den Bildern ist in der Kundenversion entfernt.
- Depotvergleich fachlich geschärft.
  - `0,8 %` laufende Depotkosten p.a. auf den Bestand.
  - Positive Depoterträge werden mit modellierter Abgeltungssteuer inkl. Soli (`26,375 %`) belastet.
  - Vergleich zeigt Netto-Rendite nach Kosten und Steuern.
  - Vergleich zeigt zusätzlich die erforderliche Brutto-Marktrendite als Break-even zur Immobilie.
