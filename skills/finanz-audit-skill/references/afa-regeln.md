# AfA-Berechnungsregeln – Referenz

## Übersicht AfA-Arten bei Immobilien

| AfA-Art | Grundlage | Satz | Dauer | Bemessungsgrundlage |
|---------|-----------|------|-------|---------------------|
| Linear (Neubau ab 2023) | §7 Abs. 4 EStG | 3% | 33 J. | Gebäude-AK/HK |
| Linear (Altbau ab 1925) | §7 Abs. 4 EStG | 2% | 50 J. | Gebäude-AK/HK |
| Linear (Altbau vor 1925) | §7 Abs. 4 EStG | 2,5% | 40 J. | Gebäude-AK/HK |
| Denkmal-AfA Vermieter | §7i EStG | 9%/7% | 12 J. | Sanierungskosten |
| Denkmal-AfA Eigennutzer | §10f EStG | 9% | 10 J. | Sanierungskosten |
| Denkmal-AfA Sanierungsgeb. | §7h EStG | 9%/7% | 12 J. | Modernisierungskosten |
| Sonder-AfA (Mietwohnungen) | §7b EStG | 5% | 4 J. | Herstellungskosten |

## Denkmal-AfA im Detail (§7i EStG)

### Voraussetzungen
- Gebäude muss als Baudenkmal anerkannt sein (Denkmalschutzbehörde)
- Bescheinigung der zuständigen Stelle erforderlich
- Nur Herstellungskosten der SANIERUNG sind begünstigt
- Maßnahmen müssen mit der Denkmalschutzbehörde abgestimmt sein

### Berechnung bei Vermietung (§7i EStG)

```
Sanierungskosten (bescheinigt): z.B. 200.000 €

Jahr 1-8:  200.000 × 9% = 18.000 € p.a.  (Summe: 144.000 €)
Jahr 9-12: 200.000 × 7% = 14.000 € p.a.  (Summe:  56.000 €)
                                    Gesamt: 200.000 €
```

ZUSÄTZLICH zur normalen linearen AfA auf die Altbausubstanz:
```
Gebäude-Anschaffungskosten (ohne Grund): z.B. 150.000 €
Lineare AfA: 150.000 × 2% = 3.000 € p.a. (bei Baujahr nach 1924)
```

### Berechnung bei Eigennutzung (§10f EStG)

```
Sanierungskosten (bescheinigt): z.B. 200.000 €

Jahr 1-10: 200.000 × 9% = 18.000 € p.a. (Summe: 180.000 €)
                                   Gesamt: 180.000 € (!)
```

Achtung: Bei Eigennutzung werden nur 90% der Sanierungskosten
abgeschrieben, nicht 100%! Das ist ein häufiger Fehler.

Bei Eigennutzung: Sonderausgabenabzug, NICHT Werbungskostenabzug.
Keine zusätzliche lineare AfA möglich.

### Häufige Implementierungsfehler

1. **Grundstücksanteil nicht abgezogen**: AfA nur auf Gebäude, nicht
   auf Grundstück. Typisch: 15-30% Grundstücksanteil je nach Lage.
   BMF-Schreiben enthält Richtwerte (Bodenrichtwert × Fläche).

2. **Denkmal-AfA auf Gesamtkosten statt nur Sanierungskosten**:
   Die erhöhte AfA nach §7i gilt NUR für die Sanierungskosten,
   nicht für den Kaufpreis der Altbausubstanz.

3. **Lineare AfA auf Sanierungsanteil**: Auf den Sanierungsanteil
   darf KEINE zusätzliche lineare AfA berechnet werden – nur die
   Denkmal-AfA. Die lineare AfA gilt nur für den Altbauanteil.

4. **Zeitanteilige AfA im ersten Jahr vergessen**: Bei Anschaffung
   im Laufe des Jahres: AfA nur für die verbleibenden vollen Monate.
   Monat der Anschaffung zählt voll mit.

5. **AfA-Ende nicht korrekt**: Nach Ablauf des AfA-Zeitraums:
   - Denkmal-AfA endet nach 12 Jahren (Vermietung) bzw. 10 Jahren
     (Eigennutzung)
   - Lineare AfA auf Altbausubstanz läuft weiter
   - Die Liquidität NACH Steuern ändert sich dann erheblich!
     → Wird das in der Prognose korrekt dargestellt?

6. **§7b und §7i verwechselt**: §7b ist die Sonder-AfA für
   Mietwohnungsneubau (Bauantrag 2023-2029, Baukosten ≤5.200€/m²),
   §7i ist die Denkmal-AfA. Andere Voraussetzungen, andere Sätze.

## Kaufpreisaufteilung

### Gebäude- vs. Grundstücksanteil

Die Aufteilung ist entscheidend für die AfA-Bemessungsgrundlage:

Methoden:
1. **Kaufvertragliche Aufteilung**: Falls im Vertrag aufgeteilt und
   nicht offensichtlich missbräuchlich → verwendbar
2. **BMF-Arbeitshilfe**: Excel-Tool des BMF zur Kaufpreisaufteilung
   (Sachwertverfahren)
3. **Gutachten**: Sachverständigengutachten

Prüfe im Code:
- Ist die Aufteilung als Parameter konfigurierbar?
- Wird der Grundstücksanteil von der AfA-Bemessungsgrundlage abgezogen?
- Ist der verwendete Grundstücksanteil plausibel für die Lage?

## AfA-Wechsel und Besonderheiten

- Wechsel von degressiv zu linear möglich (einmalig)
- Nachträgliche Herstellungskosten: Eigene AfA-Berechnung
- Anschaffungsnahe Herstellungskosten (§6 Abs. 1 Nr. 1a EStG):
  Innerhalb von 3 Jahren nach Kauf, wenn >15% der Gebäude-AK
  → KEINE sofortige Werbungskosten, sondern über AfA abschreiben
