import type { ApartmentOption, AfaScheduleEntry, Assumptions } from '../types/dashboard'
import type { DepreciationProfile } from '../types/property'

export function getCalendarYearForProjectionYear(year: number, assumptions: Assumptions): number {
  return assumptions.purchaseYear + year - 1
}

export function getProjectionYearForAfaYear(afaYear: number, assumptions: Assumptions): number {
  return assumptions.afaStartYear - assumptions.purchaseYear + afaYear
}

export function getAfaFactorForProjectionYear(year: number, assumptions: Assumptions): number {
  const calendarYear = getCalendarYearForProjectionYear(year, assumptions)
  if (calendarYear < assumptions.afaStartYear) {
    return 0
  }

  const relativeAfaYear = calendarYear - assumptions.afaStartYear + 1
  const match = assumptions.afaSchedule.find(
    (entry) => relativeAfaYear >= entry.startYear && relativeAfaYear <= entry.endYear,
  )
  if (!match) {
    return 0
  }
  return match.rate
}

export function calculateYearlyAfaAmount(
  apartment: ApartmentOption,
  year: number,
  assumptions: Assumptions,
  depreciationProfile: DepreciationProfile,
): number {
  return (
    calculateRegularAfaAmount(apartment, year, assumptions, depreciationProfile) +
    calculateSpecialAfaAmount(apartment, year, assumptions, depreciationProfile)
  )
}

function calculateRegularAfaAmount(
  apartment: ApartmentOption,
  year: number,
  assumptions: Assumptions,
  depreciationProfile: DepreciationProfile,
): number {
  if (!['linear', 'combined', 'special-7b'].includes(depreciationProfile.type)) {
    return 0
  }

  const regularRate = Math.max(assumptions.regularAfaRate, 0)
  const depreciableBasis = apartment.purchasePrice * Math.max(assumptions.depreciableShare, 0)
  if (regularRate <= 0 || depreciableBasis <= 0) {
    return 0
  }

  const regularFactor = getRegularAfaFactorForProjectionYear(year, assumptions)
  return depreciableBasis * regularRate * regularFactor
}

function calculateSpecialAfaAmount(
  apartment: ApartmentOption,
  year: number,
  assumptions: Assumptions,
  depreciationProfile: DepreciationProfile,
): number {
  const yearlyAfaRate = getAfaFactorForProjectionYear(year, assumptions)
  if (yearlyAfaRate <= 0) {
    return 0
  }

  switch (depreciationProfile.type) {
    case 'monument-7i':
    case 'sanierungsgebiet-7h':
    case 'combined':
      return apartment.purchasePrice * Math.max(assumptions.monumentShare, 0) * yearlyAfaRate
    case 'special-7b': {
      const depreciableBasis = apartment.purchasePrice * Math.max(assumptions.depreciableShare, 0)
      if (apartment.size <= 0 || depreciableBasis <= 0) {
        return 0
      }

      const costPerSqm = depreciableBasis / apartment.size
      if (costPerSqm > assumptions.specialAfaCostCeilingPerSqm) {
        return 0
      }

      const basisCap = assumptions.specialAfaBasisCapPerSqm * apartment.size
      const eligibleBasis = Math.min(depreciableBasis, basisCap)
      return eligibleBasis * yearlyAfaRate
    }
    case 'linear':
    default:
      return 0
  }
}

function getRegularAfaFactorForProjectionYear(year: number, assumptions: Assumptions): number {
  const calendarYear = getCalendarYearForProjectionYear(year, assumptions)
  if (calendarYear < assumptions.afaStartYear) {
    return 0
  }
  if (calendarYear > assumptions.afaStartYear) {
    return 1
  }
  return Math.min(Math.max(5 - Math.round(assumptions.afaStartQuarter), 1), 4) / 4
}

export function getAfaPhaseOneEndYear(afaSchedule: AfaScheduleEntry[]): number {
  const sortedSchedule = [...afaSchedule]
    .filter((entry) => entry.rate > 0)
    .sort((left, right) => left.startYear - right.startYear)
  const firstPhase = sortedSchedule[0]
  return firstPhase ? firstPhase.endYear : 0
}

export function getAfaEndYear(afaSchedule: AfaScheduleEntry[]): number {
  return afaSchedule
    .filter((entry) => entry.rate > 0)
    .reduce((maxYear, entry) => Math.max(maxYear, entry.endYear), 0)
}
