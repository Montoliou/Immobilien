# TODO

## GitHub-Issue Intake vom 10.03.2026

## P0: Berater- und Kundenversion sauber zusammenführen
- Issue `#2`: Wahl Berater- und Kundenversion
- Status:
  - teilweise vorbereitet in `codex-vorschlaege` durch `mode=admin`, `mode=customer`, Presets und Kundenvorschau
  - noch nicht sauber gegen `main` zusammengeführt
- Konkrete ToDos:
  - Merge-Strategie für `main` und `codex-vorschlaege` in einen Arbeitsbranch `berater-kundenversion` festziehen
  - Beraterversion auf `mlp-mediziner-beratung.de/YorkLiving` als führenden Admin-Stand definieren
  - Kundenversion auf `montolio.de/YorkLiving` als führenden Customer-Stand definieren
  - Buttontext und Logik auf der Beraterversion einheitlich auf `Kundenlink generieren` setzen
  - komplettes Preset-Modul in der Beraterversion erhalten
  - Kundenversion nur noch über generierten Kundenlink erreichbar machen
  - Vor- und Nachname beim Generieren des Kundenlinks in ein serverseitiges Kundenszenario übernehmen
  - serverseitigen JSON-Snapshot pro Kunde erzeugen und nur noch kurzen Link `?customer=<token>` teilen
  - Nameingabe im Beratungsmodus als Teil des Preset-/Kundenlink-Workflows integrieren
  - lokale Vorschau-URL als Fallback behalten, falls der Schreib-Endpunkt nicht verfügbar ist

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
- Analyse:
  - `3. Prognose` ist typografisch schwächer als der linke Einstieg
  - eine kurze Handlungsanweisung für den Kunden fehlt
- Konkrete ToDos:
  - Überschriftengröße und Gewicht von Schritt 1 und Schritt 3 angleichen
  - kurze Schritt-Erklärung oberhalb oder innerhalb des Prognosebereichs ergänzen
  - prüfen, ob die Ergebnis-Kernaussage bereits nach Wohnung + Einkommen ausreichend früh sichtbar wird

## P1: Parameter-Menü als echten Arbeitsmodus ausbauen
- Issue `#6`: Parameter Menü Layout anpassen
- Analyse:
  - aktuelles Menü ist funktional, aber noch kein vollwertiger Editor
  - gewünschtes Ziel ist bildschirmfüllend, scrollbar, editierfreundlich und visuell ruhiger
- Konkrete ToDos:
  - Menü auf Desktop und Mobile vollflächig als echter Editor öffnen
  - Scrollcontainer auf gesamte Höhe ausdehnen
  - Gruppen, Felder und Aktionen klarer staffeln
  - Namenseingabe für den Kunden direkt im Editor mit aufnehmen
  - Glassmorphism und Animation gezielt einsetzen, ohne Lesbarkeit zu schwächen

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


