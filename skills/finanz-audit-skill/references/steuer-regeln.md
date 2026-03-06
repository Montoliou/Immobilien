# Steuerliche Berechnungsregeln – Referenz

## Einkommensteuer-Tarif 2024/2025 (§32a EStG)

### Tarifzonen

| Zone | zvE (Einzelveranlagung) | Steuersatz |
|------|------------------------|------------|
| Grundfreibetrag | 0 – 11.784 € (2025) | 0% |
| Progressionszone 1 | 11.785 – 17.005 € | 14% – ~24% (linear steigend) |
| Progressionszone 2 | 17.006 – 66.760 € | ~24% – 42% (linear steigend) |
| Proportionalzone 1 | 66.761 – 277.825 € | 42% |
| Proportionalzone 2 | ab 277.826 € | 45% ("Reichensteuer") |

### Berechnung nach §32a EStG (vereinfachte Prüfformel)

Die exakte Berechnung verwendet Polynome. Für die Prüfung genügt:

**Grenzsteuersatz** (für einen zusätzlichen Euro):
- Relevant für Investmentrechnung, weil die Steuerersparnis sich am
  Grenzsteuersatz bemisst
- Ärzte mit Einkommen 100.000-250.000 €: Grenzsteuersatz = 42%
- Ärzte mit Einkommen > 277.826 €: Grenzsteuersatz = 45%

**Durchschnittssteuersatz**:
- ESt / zvE × 100
- Immer niedriger als Grenzsteuersatz
- NICHT für Investmentrechnung verwenden (häufiger Fehler!)

### Häufige Fehler bei der Implementierung

1. **Grenz- vs. Durchschnittssteuersatz verwechselt**: Die Steuerersparnis
   eines Investments berechnet sich am GRENZSTEUERSATZ, nicht am
   Durchschnittssteuersatz. Fehler führt zu deutlich zu niedriger
   Steuerersparnis.

2. **Progressionswirkung ignoriert**: Wenn negative Einkünfte aus V+V
   das zvE senken, kann sich der Grenzsteuersatz ändern (z.B. von 42%
   auf den Progressionsbereich). Bei großen negativen Einkünften
   relevant.

3. **Splittingtarif falsch angewendet**: Bei Eheleuten wird das
   gemeinsame zvE halbiert, darauf die ESt berechnet, dann verdoppelt.
   Nicht einfach den Steuersatz auf das Gesamteinkommen anwenden.

4. **Grundfreibetrag vergessen**: Die ersten ~11.784 € sind steuerfrei.
   Bei vereinfachter Berechnung mit festem Steuersatz wird das oft
   übersehen.

## Solidaritätszuschlag (ab 2021)

- 5,5% auf die Einkommensteuer
- Freigrenze (2025): 19.950 € ESt (Einzelveranlagung) / 39.900 € (Zusammen)
- Milderungszone: Gleitender Übergang oberhalb der Freigrenze
- Bei typischen Arzt-Einkommen: Soli fällt in voller Höhe an
- Prüfpunkt: Wird der Soli auf die GESAMTE ESt berechnet oder nur
  auf den Anteil über der Freigrenze? (Ersteres ist korrekt ab
  Überschreitung der Milderungszone)

## Kirchensteuer

- Bayern & Baden-Württemberg: 8% der ESt
- Alle anderen Bundesländer: 9% der ESt
- Kirchensteuer ist als Sonderausgabe abzugsfähig (Rückwirkung!)
- Bei der Berechnung: Kirchensteuer mindert die Bemessungsgrundlage
  für sich selbst → iterative Berechnung oder vereinfachter Faktor

### Vereinfachter Kirchensteuerfaktor

Statt iterativer Berechnung kann man verwenden:
- Bei 9% KiSt: Faktor = 9 / (4 + 9) ≈ 0,0826... → effektiv ~8,26% auf ESt
- Bei 8% KiSt: Faktor = 8 / (4 + 8) ≈ 0,0769... → effektiv ~7,69% auf ESt

Prüfe ob die App die vereinfachte oder iterative Methode verwendet und
ob sie korrekt implementiert ist.

## Einkünfte aus Vermietung und Verpachtung (§21 EStG)

### Abzugsfähige Werbungskosten

Steuerlich abzugsfähig:
- AfA (linear und/oder Sonder-AfA)
- Schuldzinsen (NICHT Tilgung!)
- Grundsteuer (sofern nicht auf Mieter umgelegt)
- Hausverwaltungskosten
- Instandhaltungskosten (bei sofortigem Abzug)
- Fahrtkosten zur Immobilie
- Rechts- und Steuerberatungskosten
- Versicherungen (Gebäudeversicherung etc.)
- Abschreibung auf Einbauküche (10 Jahre linear)
- Disagio (bei marktüblicher Gestaltung sofort abzugsfähig)

NICHT abzugsfähig:
- Tilgung des Darlehens
- Eigenkapitalanteil der Anschaffungskosten
- Nicht umlagefähige Kosten die der Mieter trägt
- Aufwendungen für die private Nutzung

### Verlustverrechnung

- Negative Einkünfte aus V+V können mit positiven Einkünften aus
  anderen Einkunftsarten verrechnet werden (horizontaler und
  vertikaler Verlustausgleich)
- Das ist der Kern der "Steuerersparnis" bei Immobilieninvestments
- Prüfpunkt: Wird die Verlustverrechnung korrekt dargestellt?
  Insbesondere bei der Progression?

## Kaufnebenkosten

| Position | Typischer Satz |
|----------|---------------|
| Grunderwerbsteuer | 3,5% – 6,5% je Bundesland |
| Notar & Grundbuch | ~1,5% – 2% |
| Makler | 0% – 7,14% (teilbar) |

Steuerliche Behandlung:
- Grunderwerbsteuer: Teil der Anschaffungskosten → über AfA abschreibbar
- Notar (Kaufvertrag): Teil der Anschaffungskosten
- Notar (Grundschuld): Sofort abzugsfähige Finanzierungskosten
- Makler: Teil der Anschaffungskosten → über AfA abschreibbar

### Grunderwerbsteuer nach Bundesland (Stand 2025)

| Bundesland | Satz |
|-----------|------|
| Bayern | 3,5% |
| Baden-Württemberg | 5,0% |
| Berlin | 6,0% |
| Brandenburg | 6,5% |
| Bremen | 5,0% |
| Hamburg | 5,5% |
| Hessen | 6,0% |
| Mecklenburg-Vorpommern | 6,0% |
| Niedersachsen | 5,0% |
| NRW | 6,5% |
| Rheinland-Pfalz | 5,0% |
| Saarland | 6,5% |
| Sachsen | 5,5% |
| Sachsen-Anhalt | 5,0% |
| Schleswig-Holstein | 6,5% |
| Thüringen | 5,0% |

Prüfe ob die App den korrekten Satz für das jeweilige Bundesland verwendet.
