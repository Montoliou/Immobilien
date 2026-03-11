# TODO

## GitHub-Issue Intake vom 10.03.2026

## P0: Berater- und Kundenversion sauber zusammenführen
- Issue `#2`: Wahl Berater- und Kundenversion
- Status:
  - im Branch `berater-kundenversion` fachlich und technisch weitgehend umgesetzt
  - noch nicht nach `main` gemerged und noch nicht auf die Beratungsdomain ausgerollt
- Erledigt:
  - Beraterversion und Kundenversion sind getrennt angelegt
  - `mlp-mediziner-beratung.de` und `montolio.de` erzwingen jeweils den passenden Standardmodus
  - Button und Flow laufen auf `Kundenlink generieren`
  - komplettes Preset-Modul bleibt in der Beraterversion erhalten
  - Vor- und Nachname werden beim Generieren erfasst
  - serverseitiger JSON-Snapshot pro Kunde mit kurzem Link `?customer=<token>` ist integriert
  - lokale Vorschau bleibt als Fallback für den lokalen Betrieb erhalten
- Offener Rest:
  - Branch gegen `main` zusammenführen
  - Beraterversion auf `mlp-mediziner-beratung.de/YorkLiving` ausrollen
  - finalen Review von Berater- und Kundenversion auf den Live-Domains abschließen

## P0: Finanzmodell für Eigenkapital und Startvermögen korrigieren
- Issue `#3`: Eigenkapital sichtbar machen
- Status:
  - im Branch `berater-kundenversion` umgesetzt
  - noch nicht in `main`
- Erledigt:
  - Startvermögen als `EK-Einsatz - Nebenkosten` definiert
  - Vermögenszuwachs bezieht sich auf `Startvermögen`
  - Vermögensdiagramm startet bei `0` und zeigt damit den Erwerbseffekt sichtbar
  - Zusammensetzung unter dem Diagramm folgt Hover/Fokus und springt sonst auf das Endjahr zurück
- Offener Rest:
  - fachliche Gegenprüfung nach Merge in `main`

## P1: Detailtabelle fachlich vervollständigen
- Issue `#4`: Jährliche Einnahmen und Ausgaben anpassen
- Status:
  - im Branch `berater-kundenversion` weitgehend umgesetzt
  - noch nicht in `main`
- Erledigt:
  - `Restschuld` ergänzt
  - `Immobilienwert` ergänzt
  - sticky Zeile `Summe` ergänzt
  - kompaktere Header und vereinheitlichte Spaltenbreiten umgesetzt
- Offener Rest:
  - prüfen, ob zusätzlich `Nettovermögen` als letzte Spalte sinnvoll ist
  - prüfen, ob Summenzeile mobil noch kompakter werden soll

## P1: Prognosebereich verständlicher machen
- Issue `#5`: Prognose deutlicher machen
- Status:
  - im Branch `berater-kundenversion` umgesetzt
  - noch nicht in `main`
- Erledigt:
  - `3. Prognose` ist jetzt eine echte Hauptüberschrift im rechten Panel
  - klare Leseanweisung im Prognosekopf ergänzt
  - Drei-Schritt-Leiste unter dem Hero führt den Nutzer durch den Ablauf
  - Ergebnis-Kernaussage sitzt direkt im Anschluss an die Sektionsüberschrift
- Offener Rest:
  - Feinschliff nach visuellem Review auf der Live-Domain

## P1: Parameter-Menü als echten Arbeitsmodus ausbauen
- Issue `#6`: Parameter Menü Layout anpassen
- Status:
  - im Branch `berater-kundenversion` umgesetzt
  - noch nicht in `main`
- Erledigt:
  - Menü öffnet als vollflächiger Editor über die gesamte Höhe
  - Preset-Bereich, Status und Aktionen sind in einer separaten Seitenleiste gebündelt
  - Parametergruppen bleiben scrollbar und für Desktop wie Mobile erreichbar
  - Glassmorphism-Overlay und weiche Ein-/Ausblendung sind integriert
- Offener Rest:
  - Feinschliff nach Live-Review auf der Beratungsdomain

## P2: PDF-Ausgabe neu aufsetzen
- Issue `#1`: PDF-Ausgabe grundlegend überarbeiten und versandfähig machen
- Analyse:
  - in der Roadmap schon enthalten, aber operativ noch nicht zerlegt
  - hängt fachlich an der Tabelle und strukturell an der Modularisierung
- Konkrete ToDos:
  - separates PDF-Rendering statt Screen-HTML ableiten
  - A4-Layoutsystem definieren
  - lesbaren Tilgungsplan mit Jahresrate, Zins, Tilgung, Restschuld, kumulierter Belastung liefern
  - Kunden- und Berater-PDF trennen

## P2: Version 2.0 modularisieren
- Issue `#7`: Version 2.0 modularer Aufbau für das einfache Arbeiten neuer Immobilien
- Analyse:
  - Roadmap enthält schon die Richtung
  - Presets sind ein erster Schritt, aber `main.ts` bleibt der Engpass
- Konkrete ToDos:
  - Projektinhalt, Rechenlogik und Medien sauber entkoppeln
  - neue Immobilien über Projektordner plus Preset onboarden
  - Intake-Workflow für `Expose rein, Objektstruktur raus` definieren
  - später KI-gestützte Projektanlage auf stabile Dateischemata stützen

## Festgelegte Entscheidungen vom 10.03.2026
- Namens-Personalisierung aus Issue `#2` wird im Kundenlink mitgegeben.
- Für Issue `#3` gilt: Wenn `Nebenkosten < EK-Einsatz`, startet das Vermögen mit `EK-Einsatz - Nebenkosten`.
- Für Issue `#6` wird das Parameter-Menü auf Desktop und Mobile vollflächig umgesetzt; dort wird auch der Kundenname vorbereitet.


