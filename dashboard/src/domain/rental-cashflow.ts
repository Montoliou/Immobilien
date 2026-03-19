import type { ApartmentOption, Assumptions } from '../types/dashboard'
import { getRentShareForProjectionYear } from './loan-stack'

export type RentalYearResult = {
  yearlyGrossRent: number
  yearlyVacancyCosts: number
  yearlyOperatingCosts: number
  yearlyNetBeforeDebt: number
  annualBaseRent: number
  annualManagementCostsFull: number
  annualMaintenanceCostsFull: number
  rentShare: number
}

export function calculateRentalYear(
  apartment: ApartmentOption,
  annualGrowthRate: number,
  year: number,
  assumptions: Assumptions,
): RentalYearResult {
  const annualBaseRent = apartment.size * assumptions.rentPerSqm * 12
  const annualManagementCostsFull = (apartment.monthlyManagement + apartment.monthlyOtherCost) * 12
  const annualMaintenanceCostsFull = apartment.monthlyMaintenance * 12
  const rentShare = getRentShareForProjectionYear(year, assumptions)
  const fullYearGrossRent = annualBaseRent * Math.pow(1 + annualGrowthRate, year - 1)
  const yearlyGrossRent = fullYearGrossRent * rentShare
  const yearlyVacancyCosts = yearlyGrossRent * assumptions.vacancyRate
  const yearlyOperatingCosts =
    yearlyVacancyCosts +
    annualManagementCostsFull * rentShare +
    annualMaintenanceCostsFull * rentShare
  const yearlyNetBeforeDebt = yearlyGrossRent - yearlyOperatingCosts

  return {
    yearlyGrossRent,
    yearlyVacancyCosts,
    yearlyOperatingCosts,
    yearlyNetBeforeDebt,
    annualBaseRent,
    annualManagementCostsFull,
    annualMaintenanceCostsFull,
    rentShare,
  }
}
