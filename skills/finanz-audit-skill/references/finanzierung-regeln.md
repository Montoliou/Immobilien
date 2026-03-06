# Finanzierungsberechnungen – Referenz

## Annuitätendarlehen

### Grundformel

```
Annuität = K₀ × (q^n × (q - 1)) / (q^n - 1)

wobei:
  K₀ = Darlehensbetrag (Nennbetrag)
  q  = 1 + p/100 (bei Jahreszins) bzw. 1 + p/(100×12) (bei Monatszins)
  n  = Anzahl Perioden (Jahre bzw. Monate)
  p  = Nominalzins in Prozent
```

### Monatliche vs. jährliche Berechnung

**Vereinfachte Methode** (häufig in Beratungspraxis):
```
Monatszins = Jahreszins / 12
Monatsrate = K₀ × (q_m^n_m × (q_m - 1)) / (q_m^n_m - 1)
wobei q_m = 1 + Jahreszins / (12 × 100), n_m = Laufzeit in Monaten
```

**Exakte Methode** (finanzmathematisch korrekt):
```
Monatszins = (1 + Jahreszins/100)^(1/12) - 1
```

Die Differenz ist bei üblichen Zinssätzen gering, aber prüfe welche
Methode verwendet wird und ob sie konsistent angewendet wird.

### Zins-/Tilgungsplan-Berechnung

Für jeden Monat (oder jede Periode):
```
Zinsanteil   = Restschuld_vorher × Zinssatz_pro_Periode
Tilgung      = Rate - Zinsanteil
Restschuld   = Restschuld_vorher - Tilgung
```

Prüfpunkte:
- Summe aller Tilgungen = Darlehensbetrag (bei voller Tilgung)
- Restschuld nach letzter Rate = 0 (bei Volltilgung)
- Restschuld nach Zinsbindungsende korrekt für Anschlussfinanzierung
- Zinsanteil im ersten Monat = Darlehensbetrag × Monatszins

### Häufige Implementierungsfehler

1. **Tilgung vs. Anfangstilgung verwechselt**: Der Kunde gibt oft
   "2% Anfangstilgung" an. Die TATSÄCHLICHE Tilgung steigt über die
   Laufzeit (da der Zinsanteil sinkt). Prüfe ob die App korrekt mit
   der Anfangstilgung die Annuität berechnet:
   ```
   Annuität = K₀ × (Zins + Anfangstilgung) / 100
   Monatsrate = Annuität / 12
   ```

2. **Zinsberechnung 30/360 vs. actual/actual**: Deutsche Banken
   verwenden oft 30/360 (jeder Monat = 30 Tage). Prüfe welche
   Methode verwendet wird.

3. **Auszahlungskurs ≠ 100%**: Bei Disagio:
   ```
   Auszahlungsbetrag = Nennbetrag × Auszahlungskurs / 100
   Zinsberechnung auf: Nennbetrag (nicht Auszahlungsbetrag!)
   ```

4. **Bereitstellungszinsen vergessen**: Bei Neubau/Sanierung werden
   Darlehen oft in Tranchen abgerufen. Auf nicht abgerufene Beträge
   fallen Bereitstellungszinsen an (typisch 0,25% p.m.).

## Effektivzinsberechnung (nach PAngV)

Der Effektivzins berücksichtigt alle Kreditkosten:
- Nominalzins
- Disagio
- Bearbeitungsgebühren
- Tilgungsverrechnung (monatlich vs. jährlich)

Prüfe ob die App den Effektivzins nach AIBD-Methode berechnet
(iteratives Verfahren, Barwertgleichung).

## KfW-Darlehen Besonderheiten

Bei Denkmal-Immobilien kommen oft KfW-Darlehen zum Einsatz:

- Tilgungsfreie Anlaufzeit (z.B. 1-5 Jahre): In dieser Zeit nur
  Zinszahlung, keine Tilgung → Restschuld bleibt gleich
- Tilgungszuschuss: Reduziert die Restschuld → korrekt verbuchen
- Zinsbindung oft kürzer als Gesamtlaufzeit

Prüfe ob die tilgungsfreie Zeit korrekt implementiert ist und ob
der Tilgungszuschuss korrekt berücksichtigt wird.

## Finanzierungsstruktur

### Eigenkapitaleinsatz
```
Kaufpreis + Kaufnebenkosten = Gesamtinvestition
Gesamtinvestition - Fremdkapital = Eigenkapitaleinsatz
```

### Mehrere Darlehen
Häufig bei Denkmal-Immobilien:
- Bankdarlehen für Kaufpreis
- KfW-Darlehen für Sanierung
- Ggf. Nachrangdarlehen

Prüfe:
- Summe aller Darlehen + EK = Gesamtinvestition
- Jedes Darlehen hat eigene Konditionen (Zins, Tilgung, Laufzeit)
- Gesamtkapitaldienst = Summe aller Einzelraten
- Schuldzinsen für Steuer = Summe aller Zinsanteile (NICHT Raten!)

## Steuerliche Behandlung der Finanzierungskosten

Abzugsfähig als Werbungskosten:
- Schuldzinsen (laufend)
- Disagio (bei marktüblicher Gestaltung sofort, sonst verteilt)
- Bearbeitungsgebühren
- Bereitstellungszinsen
- Gutachterkosten für Bank
- Notar für Grundschuld

NICHT abzugsfähig:
- Tilgung (Vermögensumschichtung, kein Aufwand)
- Eigenkapital

### Kritischer Prüfpunkt: Schuldzinsen vs. Tilgung

Dies ist der häufigste und schwerwiegendste Fehler in
Investment-Apps:

```
Monatsrate        = 1.500 €  ← Cashflow-relevant (Liquidität)
davon Zinsen      =   800 €  ← steuerlich abzugsfähig
davon Tilgung     =   700 €  ← NICHT steuerlich abzugsfähig

FALSCH: Steuerersparnis = 1.500 × 42% = 630 €
RICHTIG: Steuerersparnis = 800 × 42% = 336 €
Differenz: 294 € pro Monat → 3.528 € pro Jahr!
```

Bei einem 300.000 € Darlehen kann dieser Fehler die dargestellte
Liquidität des Kunden um mehrere tausend Euro pro Jahr verfälschen.
