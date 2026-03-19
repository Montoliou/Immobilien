import type { TaxTableMode } from '../types/dashboard'

export function calculateGrundtabelleTax(taxableIncome: number): number {
  const zve = Math.max(taxableIncome, 0)

  if (zve <= 11604) return 0
  if (zve <= 17005) {
    const y = (zve - 11604) / 10000
    return (922.98 * y + 1400) * y
  }
  if (zve <= 66760) {
    const z = (zve - 17005) / 10000
    return (181.19 * z + 2397) * z + 1025.38
  }
  if (zve <= 277825) return 0.42 * zve - 10602.13
  return 0.45 * zve - 18936.88
}

export function calculateAnnualIncomeTax(taxableIncome: number, taxTableMode: TaxTableMode): number {
  const zve = Math.max(taxableIncome, 0)
  if (taxTableMode === 'splitting') {
    return 2 * calculateGrundtabelleTax(zve / 2)
  }
  return calculateGrundtabelleTax(zve)
}

export function calculateMarginalTaxRate(taxableIncome: number, taxTableMode: TaxTableMode): number {
  const base = Math.max(taxableIncome, 0)
  const delta = 1
  const taxBase = calculateAnnualIncomeTax(base, taxTableMode)
  const taxUp = calculateAnnualIncomeTax(base + delta, taxTableMode)
  return Math.max((taxUp - taxBase) / delta, 0)
}

export function getTaxTableLabel(mode: TaxTableMode): string {
  return mode === 'splitting' ? 'Splittingtabelle' : 'Grundtabelle'
}
