# Referenzbeispiel: Denkmal-Immobilie mit Liquiditätsbetrachtung

Dieses Beispiel zeigt die vollständige Berechnungslogik einer
Denkmal-Immobilie mit 3 Darlehen, Denkmal-AfA und Liquiditätsfluss
nach Steuern. Verwende es als Prüfschablone.

## Basisdaten

- Objekt: Denkmal-Immobilie, Baujahr vor 1925, 41,57 m²
- Kaufpreis: 203.472,48 €
- Kaufpreisaufteilung: 5% Grundstück / 23% Altbau / 72% Sanierung
- Eigenkapital: 0 € (100% Finanzierung)
- Bundesland: NRW (6,5% GrESt)
- zvE vor Kauf: 100.000 € (Einzelveranlagung, 0% KiSt)
- Kaltmiete: 11,71 €/m² = 486,78 €/Monat = 5.841,42 €/Jahr
- Mietsteigerung: 0% (konservativ)
- Bezugsfertigkeit: Dezember 2026
- Mietbeginn: Januar 2027

## Erwerbsnebenkosten

| Position | Satz | Betrag | Steuerliche Behandlung |
|----------|------|--------|----------------------|
| GrESt (NRW) | 6,50% | 13.225,71 € | Teil der AK → AfA |
| Notar | 1,30% | 2.645,14 € | Teil der AK → AfA |
| Grundbuch | 0,70% | 1.424,31 € | Sofort WK 2024 |
| **Summe** | **8,50%** | **17.295,16 €** | |

Wichtig: GrESt und Notar sind AfA-fähig (werden auf Gebäudeanteile
verteilt), Grundbuchkosten sind sofort abzugsfähige Werbungskosten.

## Finanzierungsstruktur

| Darlehen | Betrag | Sollzins | Anfangstilg. | Besonderheiten |
|----------|--------|----------|-------------|----------------|
| KfW 261 (Effizienzhaus) | 150.000 € | 2,56% | 4,77% | Tilgungszuschuss 15.000 € |
| KfW 159 (Altersger. Umbauen) | 50.000 € | 3,28% | 4,49% | |
| Annuitätendarlehen | 20.767,64 € | 4,00% | 2,00% | Anschluss 5,00% |
| **Summe** | **220.767,64 €** | | | |

Bereitstellungszinsen: 4.926,88 € (sofort WK, verteilt auf 2025/2026)

## AfA-Berechnung

### Altbausubstanz

```
Kaufpreisanteil Altbau:     46.798,67 €
+ anteilige ENK (23%):       3.650,30 €   ← 23% von (GrESt + Notar)
= Bemessungsgrundlage:     50.448,97 €
× 2,5% p.a. (Baujahr vor 1925)
= AfA pro Jahr:             1.261,22 €
= AfA pro Monat:              105,10 €
```

Methode ENK-Verteilung: Proportional zum Kaufpreisanteil (23% auf
alle AfA-fähigen ENK, NICHT 23/95 auf gebäudebezogene ENK).

### Sanierungskosten (Denkmal-AfA §7i)

```
Kaufpreisanteil Sanierung: 146.500,19 €
+ anteilige ENK:            25.719,73 €   ← 72% von (GrESt + Notar) + sonstige
= Brutto-Bemessung:       172.219,92 €
- KfW Tilgungszuschuss:   -15.000,00 €
= Basis vor Risiko:       157.219,92 €
÷ 1,1 (→ 10% Risikoabschlag)
= Bemessungsgrundlage:    142.927,20 €
  (Risikoabschlag = 14.292,72 €)
```

Denkmal-AfA Staffelung:
```
2026-2033 (8 Jahre): 142.927,20 × 9% = 12.863,45 €/Jahr
2034-2037 (4 Jahre): 142.927,20 × 7% = 10.004,90 €/Jahr
Summe 12 Jahre: 142.927,20 € (= 100% abgeschrieben)
```

### Gesamt-AfA pro Jahr

| Zeitraum | Altbau-AfA | Denkmal-AfA | Gesamt |
|----------|-----------|-------------|--------|
| 2024 (3 Mon.) | 315,31 € | – | 315,31 € |
| 2025 | 1.261,22 € | – | 1.261,22 € |
| 2026-2033 | 1.261,22 € | 12.863,45 € | 14.124,67 € |
| 2034-2037 | 1.261,22 € | 10.004,90 € | 11.266,12 € |
| ab 2038 | 1.261,22 € | – | 1.261,22 € |

## Steuerberechnung

### ESt-Tarif 2024 (§32a EStG)

Bei zvE = 100.000 €:
```
Tarifzone: 66.761 – 277.825 € → 42%
ESt = 0,42 × 100.000 - 10.602,13 = 31.397,87 € (gerundet: 31.397 €)
```

### Solidaritätszuschlag mit Milderungszone

```
ESt = 31.397 €
Freigrenze 2024: 18.130 € (Einzelveranlagung)
31.397 > 18.130 → Soli fällig
Voller Soli: 31.397 × 5,5% = 1.726,84 €
Milderungssoli: (31.397 - 18.130) × 11,9% = 1.578,77 €
→ Milderungssoli < voller Soli → 1.578,77 € wird angesetzt
```

Die Soli-Milderungszone ist ein häufig übersehener Aspekt!
Bei zvE ~100.000 € liegt die ESt noch in der Milderungszone.

### Gesamtsteuer vor Kauf

```
ESt:              31.397,00 €
Soli:              1.578,77 €
KiSt (0%):             0,00 €
Gesamt:           32.975,77 €
```

## Einkünfte aus V+V (Beispieljahr 2027)

```
+ Mieteinnahmen:          5.841,42 €
- Werbungskosten:             0,00 €
- AfA gesamt:            14.124,67 €   ← Altbau + Denkmal
- Steuerl. Nebenkosten:     403,17 €   ← Erhaltung + Verwaltung (anteilig)
- Schuldzinsen:           5.912,06 €   ← NUR Zinsen der 3 Darlehen!
= Einkünfte V+V:       -14.598,49 €
```

KRITISCHE PRÜFPUNKTE:
- Schuldzinsen ≠ Annuität: Nur der Zinsanteil ist abzugsfähig
- Tilgung (2.875,27 €) ist NICHT in den Werbungskosten
- AfA ist steuerlich abzugsfähig, aber KEIN Cashflow-Abfluss

## Liquiditätsrechnung 2027

```
CASHFLOW:
+ Mieteinnahmen:          5.841,42 €
- Nebenkosten gesamt:       559,66 €   ← Erhaltung + Verwaltung (voll)
- Zinsen (alle 3 Darlehen): 5.912,06 €
- Tilgung (alle 3 Darlehen):2.875,27 €
= Cashflow-Belastung:     -3.505,57 €

STEUEREFFEKT:
zvE vor Kauf:            100.000,00 €
+ Einkünfte V+V:        -14.598,49 €
= zvE nach Kauf:         85.401,51 €
ESt nach Kauf:           26.115,18 €
→ Steuerersparnis:        6.860,59 €

LIQUIDITÄT NACH STEUERN:
Cashflow-Belastung:      -3.505,57 €
+ Steuerersparnis:        6.860,59 €
= Liquidität nach Tilg.:  3.355,02 €  (= 279,58 €/Monat)

Alternative Darstellung (wie im PDF):
+ Miete:                  5.841,42 €
+ Steuerersparnis:        6.860,59 €
- Nebenkosten:              559,66 €
- Zinsen:                 5.912,06 €
= Liq. VOR Tilgung:      6.230,29 €  (= 519,19 €/Monat)
- Tilgung:                2.875,27 €  (= 239,61 €/Monat)
= Liq. NACH Tilgung:     3.355,02 €  (= 279,58 €/Monat)
```

## Steuerlicher Wendepunkt

Ab 2038 läuft die Denkmal-AfA aus. Dann:
```
VuV 2038: +909,63 € (positive Einkünfte → Steuermehrbelastung)
→ Steuerersparnis wird zur Steuerlast (-427,46 €)
→ Liquidität nach Steuern verschlechtert sich erheblich
```

Dieser Wendepunkt MUSS dem Kunden transparent dargestellt werden.

## Renditekennzahlen

```
Bruttomietrendite = 5.841,42 / 203.472,48 = 2,87%
Nettomietrendite  = (5.841,42 - 559,66) / (203.472,48 + 17.295,16) = 2,39%
```

## Zusammenfassung der Prüfergebnisse

| Prüfpunkt | Status | Anmerkung |
|-----------|--------|-----------|
| Kaufpreisaufteilung | ✅ | Auf den Cent korrekt |
| ENK (Minden = NRW) | ✅ | 6,5% GrESt korrekt |
| AfA Altbau 2,5% | ✅ | Bemessungsgrundlage korrekt |
| Denkmal-AfA 9%/7% | ✅ | Risikoabschlag und KfW-Zuschuss berücksichtigt |
| ESt nach §32a | ✅ | Rundungsdifferenz < 1€ |
| Soli-Milderungszone | ✅ | Korrekt angewendet |
| Zinsen ≠ Tilgung | ✅ | Sauber getrennt |
| Liquiditätsrechnung | ✅ | Konsistent und vollständig |
| Renditeberechnung | ✅ | Brutto und Netto korrekt |
| Wendepunkt 2038 | ✅ | Transparent dargestellt |
| Denkmal-AfA 2026 voll | 🟡 | Volle AfA trotz Fertigstellung Dez 2026 |
| IRR bei EK=0 | 🟡 | 100% – mathematisch korrekt aber wenig aussagekräftig |
