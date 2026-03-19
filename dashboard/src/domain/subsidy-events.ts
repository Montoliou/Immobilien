import type { Assumptions } from '../types/dashboard'

export function getKfwGrantProjectionYear(assumptions: Assumptions): number | null {
  if (assumptions.kfwGrantAmount <= 0 || assumptions.kfwLoanAmount <= 0) {
    return null
  }

  const settlementCalendarYears = [
    assumptions.purchaseYear + 2,
    assumptions.purchaseYear + 4,
    assumptions.purchaseYear + 5,
  ]
  const completionReadyCalendarYear =
    assumptions.rentStartYear + (assumptions.rentStartQuarter >= 3 ? 1 : 0)
  const selectedCalendarYear =
    settlementCalendarYears.find((year) => year >= completionReadyCalendarYear) ??
    settlementCalendarYears[settlementCalendarYears.length - 1]

  return selectedCalendarYear - assumptions.purchaseYear + 1
}
