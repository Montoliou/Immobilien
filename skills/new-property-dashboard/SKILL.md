# New Property Dashboard

Verwende diesen Skill, wenn aus einem neuen Exposé und einem Bilderordner ein weiteres Immobilien-Dashboard auf Basis der gemeinsamen Engine erzeugt werden soll.

## Ziel
Erzeuge **kein** blindes Live-Objekt, sondern immer zuerst einen prüfbaren Draft unter:
- `dashboard/properties/<slug>/bundle.json`
- `dashboard/properties/<slug>/media/`
- `dashboard/properties/<slug>/source/extracted.json`
- `dashboard/properties/<slug>/source/overrides.json`
- `dashboard/properties/<slug>/review.md`

## Workflow
1. Arbeite im Repo `D:\AppEntwicklung\Immobilien`.
2. Nutze die gemeinsame Engine. Schreibe keine neuen Objekt-Hardcodes in `dashboard/src/app/bootstrap.ts`.
3. Erzeuge den Draft mit:
   - `python scripts/property_pipeline/new_property_draft.py --slug <slug> --title "<Titel>" --expose <pdf> --images-dir <ordner> [--overrides <json>]`
4. Prüfe danach den Draft immer manuell:
   - Identität / Adresse / Map-URL
   - Hero-Texte und Facts
   - Wohneinheiten / Preise / Größen
   - Förderprofil
   - AfA-/Sonder-AfA-Profil
   - Bildzuordnung
5. Wenn Förder- oder AfA-Logik nicht sicher aus den Unterlagen hervorgeht, bleibt der Draft auf `reviewStatus: draft`.
6. Vor Preview oder Build:
   - `npm run compile:properties` im `dashboard`-Ordner
7. Erst nach Review darf ein Objekt live deployed werden.

## Harte Regeln
- Keine stille Heuristik für `§7i`, `§7h`, KfW-Zuschüsse oder andere Förderlogiken.
- Wenn die Zuordnung nicht sicher ist: Stop + Review-Hinweis statt Annahme.
- Design bleibt innerhalb des bestehenden MLP-Designsystems.
- Medien gehören in `dashboard/properties/<slug>/media/`, nicht in hartcodierte App-Pfade.

## Nützliche Befehle
- Draft erzeugen:
  - `python scripts/property_pipeline/new_property_draft.py --slug objekt-a --title "Objekt A" --expose C:\Pfad\Expose.pdf --images-dir C:\Pfad\Bilder`
- Property-Bundles kompilieren:
  - `cd dashboard && npm run compile:properties`
- Vorschau starten:
  - `cd dashboard && npm run dev:fixed`
