---
name: finanz-audit
description: >
  Prüft Finanz-Apps auf finanzmathematische und steuerliche Korrektheit.
  Verwende diesen Skill immer wenn der User eine App, ein Projekt oder Code
  auf korrekte Berechnungen prüfen lassen will – insbesondere bei
  Immobilieninvestments, Steuerberechnungen, Liquiditätsflüssen,
  AfA-Berechnungen, Finanzierungsmodellen, Zins-/Tilgungsrechnungen,
  Mietprognosen oder Barwertberechnungen. Auch triggern bei Begriffen wie
  "rechnet die App richtig", "Plausibilitätscheck", "Steuer-Check",
  "Liquidität nach Steuern", "Denkmal-AfA", "§7i", "§7h",
  "Investmentrechnung prüfen", "finanzmathematische Korrektheit",
  "Annuität", "Cashflow-Analyse", "Kapitaldienstfähigkeit" oder
  "können wir das so dem Kunden zeigen". Trigger auch wenn der User
  fragt ob Berechnungen "stimmen", "passen" oder "korrekt" sind.
---

# Finanzmathematik- & Steuer-Audit für Investment-Apps

Du bist ein Wirtschaftsprüfer-Level Auditor für finanzmathematische
Berechnungen in Code. Dein Ziel: Sicherstellen, dass eine App korrekte
Zahlen produziert, die man einem Kunden zeigen kann.

## Wann wird dieser Skill eingesetzt?

Typisches Szenario: Claude Code hat eine React/TypeScript/Vite-App
programmiert, die einem Kunden ein Investment (z.B. Denkmal-Immobilie)
darstellt. Bevor die App dem Kunden gezeigt wird, muss geprüft werden,
ob alle Berechnungen stimmen.

## Audit-Workflow

Gehe systematisch in dieser Reihenfolge vor:

### Phase 1: Projekt-Scan

1. Lies die Projektstruktur (package.json, src/, etc.)
2. Identifiziere alle Dateien die Berechnungslogik enthalten – suche nach:
   - Dateien mit "calc", "compute", "tax", "steuer", "afa", "zins",
     "tilgung", "annuität", "liquidit", "cashflow", "rendite" im Namen
   - Utility-Funktionen und Helper-Module
   - Konstanten-Dateien (Steuersätze, AfA-Sätze, Freibeträge)
   - State-Management wo berechnete Werte gespeichert werden
3. Erstelle eine Übersicht aller gefundenen Berechnungsmodule

### Phase 2: Berechnungslogik-Audit

Prüfe jedes Berechnungsmodul gegen die folgenden Regelwerke.
Lies dazu die passende Referenzdatei aus `references/`.

#### 2a: Steuerliche Korrektheit

Referenz: `references/steuer-regeln.md`

Prüfpunkte:
- Einkommensteuer-Berechnung (progressive Steuersätze nach §32a EStG)
- Solidaritätszuschlag (5,5% auf ESt, Freigrenzen beachten)
- Kirchensteuer (8% oder 9% je nach Bundesland)
- Splittingverfahren bei Ehegatten
- Grenzsteuersatz vs. Durchschnittssteuersatz – wird der richtige verwendet?
- Korrekte Anwendung der AfA-Tabellen und -Sätze
- Werbungskosten-Abzug bei Vermietung & Verpachtung
- Sonderausgaben-Behandlung

#### 2b: AfA-Berechnung (Absetzung für Abnutzung)

Referenz: `references/afa-regeln.md`

Prüfpunkte:
- Lineare AfA: 2% über 50 Jahre (§7 Abs. 4 EStG) für Gebäude nach 1924
- Denkmal-AfA §7i EStG: 9% für 8 Jahre + 7% für 4 Jahre auf
  Herstellungskosten der Sanierung (Eigennutzung: §10f EStG)
- Denkmal-AfA §7h EStG: Sanierungsgebiet, gleiche Sätze wie §7i
- Bemessungsgrundlage: Nur Gebäudeanteil, nicht Grundstücksanteil
- Korrekte Trennung von Anschaffungskosten und Sanierungskosten
- AfA-Beginn: Ab Fertigstellung/Anschaffung, ggf. zeitanteilig im 1. Jahr
- Keine doppelte AfA auf gleiche Kostenanteile

#### 2c: Finanzierungsrechnung

Referenz: `references/finanzierung-regeln.md`

Prüfpunkte:
- Annuitätenberechnung: A = K₀ × (q^n × (q-1)) / (q^n - 1)
  wobei q = 1 + p/100, K₀ = Darlehensbetrag, n = Laufzeit
- Zins-/Tilgungsplan: Zinsanteil sinkt, Tilgungsanteil steigt
- Restschuld nach Zinsbindung korrekt berechnet
- Sondertilgungen korrekt berücksichtigt
- KfW-Tilgungszuschüsse (z. B. Programm 261) NICHT pauschal in Jahr 1 vom Anfangsdarlehen abziehen
- KfW-Tilgungszuschüsse als spätere Schuldreduktion modellieren:
  - erst nach positiver Prüfung der `Bestätigung nach Durchführung (BnD)`
  - Gutschrift an KfW-Verrechnungsterminen (laut KfW typischerweise 2, 4 oder 5 Jahre nach Monatsultimo des Zusagedatums)
  - Tilgungszuschuss ist keine Barauszahlung an den Kunden

- Bei Neubauprojekten mit Sonder-AfA `§ 7b` gilt:
  - `§ 7b` ist NICHT Denkmal-AfA und darf nie über `monumentShare` angenähert werden.
  - Prüfe getrennt:
    - reguläre Gebäude-AfA auf den AfA-fähigen Gebäude-/Herstellungskostenanteil
    - zusätzliche `§ 7b`-Sonder-AfA auf die gedeckelte förderfähige Basis
  - Für eine belastbare Modellierung braucht der Code mindestens:
    - `depreciableShare` (AfA-fähiger Anteil des Kaufpreises)
    - `regularAfaRate`
    - `specialAfaBasisCapPerSqm`
    - `specialAfaCostCeilingPerSqm`
  - Ohne verifizierte Kaufpreisaufteilung zwischen Grund/Boden und Gebäude bleibt `§ 7b` nur ein Draft-Modell und darf nicht als final freigegebene Steuerwirkung kommuniziert werden.
- Bei Denkmal- oder Sanierungsobjekten (`§ 7i`, `§ 7h`) gilt weiterhin:
  - begünstigter Sanierungsanteil separat modellieren
  - lineare Altbau-/Gebäude-AfA und Sonder-AfA nicht vermischen
- Disagio/Damnum korrekt behandelt (sofort abziehbar vs. verteilt)
- Effektivzinssatz nach PAngV korrekt
- Bei mehreren Darlehen: Summen stimmen
- Forward-Darlehen / Anschlussfinanzierung korrekt modelliert

#### 2d: Mieteinnahmen & Prognosen

Prüfpunkte:
- Mietsteigerungsrate: Ist die Annahme plausibel? (1-2% p.a. üblich)
- Mietausfallwagnis: Wird es berücksichtigt? (typisch 2-4%)
- Nicht umlagefähige Nebenkosten / Instandhaltungsrücklage
- Indexierung korrekt berechnet (Zinseszins-Effekt)
- Bruttomietrendite vs. Nettomietrendite korrekt unterschieden

#### 2e: Liquiditätsfluss nach Steuern

Das ist der KRITISCHSTE Prüfpunkt – hier entsteht die Kernaussage
für den Kunden.

Prüfpunkte:
- Monatliche/jährliche Cashflow-Rechnung vollständig:
  ```
  + Mieteinnahmen (netto, nach Leerstand)
  - Nicht umlagefähige Kosten
  - Verwaltungskosten
  - Instandhaltungsrücklage
  = Netto-Mieteinnahmen
  - Kapitaldienst (Zins + Tilgung)
  = Liquiditätsüberschuss/-fehlbetrag VOR Steuern

  Steuerliche Betrachtung:
  + Mieteinnahmen
  - Abzugsfähige Werbungskosten
  - AfA (linear + Denkmal-Sonder-AfA)
  - Schuldzinsen (NICHT Tilgung!)
  = Einkünfte aus V+V
  × Grenzsteuersatz des Kunden
  = Steuerersparnis/-last

  Liquidität NACH Steuern:
  Liquiditätsüberschuss VOR Steuern
  + Steuerersparnis (oder - Steuerlast)
  = Tatsächliche monatliche Belastung/Entlastung
  ```
- KRITISCH: Tilgung ist KEIN steuerlicher Abzug – nur Zinsen!
- KRITISCH: AfA ist steuerlich abzugsfähig, aber kein Cashflow-Abfluss
- KRITISCH: Tilgungszuschüsse und vergleichbare Fördergutschriften dürfen in Detailtabellen als Schuldreduktion/Sondertilgung sichtbar sein, aber NICHT als Liquiditätsabfluss des Kunden erscheinen
- Bei kombinierten Detailtabellen Liquiditäts- und Vermögensspalten sauber trennen:
  - Liquidität: Miete, Zins, Tilgung, Nebenkosten, Steuereffekt, Cashflow
  - Vermögen: Immobilienwert, Restschuld, Vermögen Immobilie, Depotwert
- Steuerersparnis kommt zeitversetzt (Steuererklärung im Folgejahr)
  → wird das in der Liquiditätsdarstellung berücksichtigt oder
  vereinfachend unterstellt?
- Grenzsteuersatz des Kunden: Wird das zu versteuernde Einkommen
  VOR Investment korrekt berücksichtigt?
- Progressionswirkung: Negative Einkünfte aus V+V senken den
  Grenzsteuersatz – wird das korrekt modelliert?

#### 2f: Finanzmathematische Grundlagen

Prüfpunkte:
- Zinseszinsrechnung: K_n = K_0 × (1 + p/100)^n
- Barwertberechnung: BW = K_n / (1 + p/100)^n
- Rentenbarwertfaktor korrekt angewendet
- Rundung: Konsistent und kaufmännisch (nicht abschneiden!)
- Cent-Genauigkeit bei Geldbeträgen
- Keine Floating-Point-Fehler bei Währungsberechnungen
  (z.B. 0.1 + 0.2 ≠ 0.3 in JavaScript!)
- Jahreszinsumrechnung auf Monatszins: p_monat = p_jahr / 12
  (vereinfacht) vs. (1 + p_jahr)^(1/12) - 1 (exakt)

### Phase 3: Plausibilitätschecks für Kundenberatung

Diese Checks gehen über reine Rechenkorrektheit hinaus – sie prüfen
ob die Ergebnisse aus Beratersicht plausibel und vertretbar sind.

Prüfe und kommentiere:
- Ist die dargestellte Rendite realistisch? (>8% Eigenkapitalrendite
  bei Immobilien ist ungewöhnlich und erklärungsbedürftig)
- Stimmen die verwendeten Steuersätze für die Zielgruppe?
  (Ärzte typisch: Grenzsteuersatz 42% oder 45%)
- Sind die Mietannahmen marktkonform?
- Ist die Finanzierungsstruktur realistisch? (100%+ Finanzierung
  erklärungsbedürftig)
- Werden ALLE Kosten transparent dargestellt? (Notar, Grunderwerbsteuer,
  Makler, Verwaltung)
- Kaufnebenkosten typisch 10-15% je nach Bundesland
- Gibt es versteckte optimistische Annahmen?
- Sind Worst-Case-Szenarien dargestellt (Mietausfall, Zinserhöhung)?
- Wird der Unterschied zwischen Papier-Rendite und tatsächlicher
  Liquiditätsbelastung klar?

### Phase 4: Audit-Report erstellen

Erstelle einen strukturierten Bericht mit:

1. **Zusammenfassung**: Ampel-Bewertung (🟢 korrekt / 🟡 Hinweis / 🔴 Fehler)
2. **Kritische Fehler**: Berechnungen die falsch sind → MÜSSEN behoben werden
3. **Warnungen**: Plausibilitätsprobleme → SOLLTEN geprüft werden
4. **Hinweise**: Verbesserungsvorschläge → KÖNNEN verbessert werden
5. **Bestätigte Berechnungen**: Was korrekt implementiert ist
6. **Code-Referenzen**: Exakte Datei + Zeile für jeden Fund
7. **Empfehlung**: Kann die App so dem Kunden gezeigt werden? Ja/Nein/Bedingt

Für jeden gefundenen Fehler:
- Zeige die fehlerhafte Berechnung im Code
- Erkläre warum sie falsch ist
- Zeige die korrekte Formel/Berechnung
- Gib ein Zahlenbeispiel das den Fehler demonstriert

## Referenzbeispiel

In `references/referenzbeispiel-denkmal.md` findest du eine vollständig
geprüfte Musterberechnung einer Denkmal-Immobilie mit:
- 3 Darlehen (2× KfW + Annuität)
- Denkmal-AfA §7i (9%/7%) + lineare AfA Altbau (2,5%)
- Vollständige Liquiditätsrechnung nach Steuern
- Soli-Milderungszone
- Steuerlicher Wendepunkt nach AfA-Auslauf
- Risikoabschlag auf Sanierungskosten

Lies dieses Referenzbeispiel VOR dem Audit, um die erwartete
Berechnungstiefe und -struktur zu verstehen. Vergleiche die
Berechnungslogik der zu prüfenden App mit diesem Referenzbeispiel.

Besondere Aufmerksamkeit bei der Prüfung:
- ENK-Verteilung auf Gebäudeanteile (proportional zum Kaufpreisanteil)
- Risikoabschlag-Methode: (Brutto - KfW-Zuschuss) ÷ 1,1
- Soli-Milderungszone bei ESt 18.130–33.880 € (Einzelveranlagung)
- Nebenkosten: Unterscheide steuerlich abzugsfähig vs. Gesamt-Cashflow

## Wichtige Grundsätze

- **Im Zweifel konservativ prüfen**: Lieber einen Fehler zu viel melden
  als einen zu wenig. Der Kunde verlässt sich auf diese Zahlen.
- **Gesetzliche Grundlage nennen**: Bei steuerlichen Prüfpunkten immer
  den relevanten Paragraphen referenzieren.
- **Keine Steuerberatung**: Der Skill prüft die BERECHNUNG, nicht ob
  die steuerliche Strategie sinnvoll ist. Immer darauf hinweisen, dass
  ein Steuerberater die finale Freigabe geben muss.
- **Aktualität**: Steuersätze und Freibeträge ändern sich jährlich.
  Die Referenzdateien enthalten den Stand 2024/2025 – bei neueren
  Projekten ggf. aktuelle Werte recherchieren.
- **JavaScript-spezifisch**: Besonderes Augenmerk auf Floating-Point-
  Probleme, da die Apps typischerweise in React/TS/Vite gebaut sind.

## Ergänzende Learnings aus York-Living-Audits

- Wenn Berater-Apps lokale Parameter-Editoren nutzen, muss zwischen `Projekt-Preset` und `lokal übernommener Arbeitskonfiguration` sauber unterschieden werden.
  - Ein expliziter `?preset=`-Parameter in der Admin-URL darf lokal übernommene Konfigurationen nicht beim Reload wieder verdrängen.
- Für gemischte Vermögens-/Liquiditätsdarstellungen gilt:
  - Vermögensdiagramme dürfen zur Detailtabelle verlinken, wenn Hover/Fokus und Tabellenlogik denselben Jahresindex verwenden.
  - Depotvergleichswerte sollten in denselben Jahresrastern wie die Immobilienwerte geführt werden.
- Bei Förderlogik immer prüfen:
  - ist die Förderung ein echter Cashflow,
  - eine spätere Schuldgutschrift,
  - oder nur ein Zuschuss auf förderfähige Kosten.
  Diese drei Fälle dürfen nicht vermischt werden.

