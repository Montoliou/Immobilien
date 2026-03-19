import type {
  ApartmentOption,
  Assumptions,
  ProjectionResult,
  TaxTableMode,
  YearlyLiquidityRow,
} from '../types/dashboard'
import type { DepreciationProfile } from '../types/property'
import { calculateYearlyAfaAmount, getAfaEndYear, getAfaPhaseOneEndYear, getCalendarYearForProjectionYear, getProjectionYearForAfaYear } from './depreciation-engine'
import { calculateLoanStackYear } from './loan-stack'
import { calculateRentalYear } from './rental-cashflow'
import { getKfwGrantProjectionYear } from './subsidy-events'
import { calculateAnnualIncomeTax, calculateMarginalTaxRate } from './tax-effect-model'
import { calculateDepotNetReturnRate, findRequiredDepotGrossReturnRate, simulateDepotPath } from './wealth-comparison'

export type ProjectionEnvironment = {
  assumptions: Assumptions
  equityBounds: {
    min: number
    max: number
  }
  depotCostRateDefault: number
  depotTaxRate: number
  taxModelDisclaimer: string
  depreciationProfile: DepreciationProfile
}

export function calculateProjection(
  apartment: ApartmentOption,
  grossAnnualIncome: number,
  annualGrowthRate: number,
  selectedEquity: number,
  taxTableMode: TaxTableMode,
  depotReturnRate: number,
  env: ProjectionEnvironment,
): ProjectionResult {
  const { assumptions, equityBounds, depotTaxRate, taxModelDisclaimer, depreciationProfile } = env
  const taxableIncome = grossAnnualIncome * 0.8
  const annualTax = calculateAnnualIncomeTax(taxableIncome, taxTableMode)
  const marginalTaxRate = calculateMarginalTaxRate(taxableIncome, taxTableMode)
  const taxDisclaimer = taxModelDisclaimer

  const ancillaryCosts = apartment.purchasePrice * assumptions.ancillaryCostRate
  const totalInvestment = apartment.purchasePrice + ancillaryCosts
  const startEquity = clamp(selectedEquity, equityBounds.min, Math.min(equityBounds.max, totalInvestment))
  const initialNetWealth = startEquity - ancillaryCosts
  const debtNeeded = Math.max(totalInvestment - startEquity, 0)
  const kfwLoan = Math.min(debtNeeded, assumptions.kfwLoanAmount)
  const bankLoan = Math.max(debtNeeded - kfwLoan, 0)
  const kfwGrant = kfwLoan > 0 ? Math.min(assumptions.kfwGrantAmount, kfwLoan) : 0
  const kfwGrantProjectionYear = kfwGrant > 0 ? getKfwGrantProjectionYear(assumptions) : null
  const initialKfwDebt = kfwLoan
  const initialBankDebt = bankLoan
  const initialDebt = initialKfwDebt + initialBankDebt

  const afaPhaseOneEndYear = getProjectionYearForAfaYear(getAfaPhaseOneEndYear(assumptions.afaSchedule), assumptions)
  const afaEndYear = getAfaEndYear(assumptions.afaSchedule)
  const afaProjectionEndYear = getProjectionYearForAfaYear(afaEndYear, assumptions)
  const constructionInterestLoad =
    (kfwLoan * 0.5) * assumptions.kfwInterestRate + (bankLoan * 0.5) * assumptions.bankInterestRate
  const constructionPhaseMonthlyLiquidity = -(constructionInterestLoad / 12)

  let remainingKfwDebt = initialKfwDebt
  let remainingBankDebt = initialBankDebt
  let remainingDebt = initialDebt
  let refinanceDebtBase = 0
  let refinanceTargetDebtService = 0
  let cumulativeCashflow20 = 0
  let afaPhaseOneCashflow = 0
  let afaPhaseTwoCashflow = 0
  let postAfaCashflow = 0
  let afaPhaseOneYears = 0
  let afaPhaseTwoYears = 0
  let postAfaYears = 0
  const yearlyWealthPath: number[] = [initialNetWealth]
  const yearlyLiquidityRows: YearlyLiquidityRow[] = []
  const yearlyCashflows: number[] = []

  for (let year = 1; year <= assumptions.years; year += 1) {
    const calendarYear = getCalendarYearForProjectionYear(year, assumptions)
    const loanYear = calculateLoanStackYear({
      year,
      kfwLoan,
      bankLoan,
      assumptions,
      remainingKfwDebt,
      remainingBankDebt,
      remainingDebt,
      refinanceDebtBase,
      refinanceTargetDebtService,
      kfwGrant,
      kfwGrantProjectionYear,
    })

    remainingKfwDebt = loanYear.remainingKfwDebt
    remainingBankDebt = loanYear.remainingBankDebt
    remainingDebt = loanYear.remainingDebt
    refinanceDebtBase = loanYear.refinanceDebtBase
    refinanceTargetDebtService = loanYear.refinanceTargetDebtService

    const rentalYear = calculateRentalYear(apartment, annualGrowthRate, year, assumptions)
    const yearlyAfaAmount = calculateYearlyAfaAmount(
      apartment,
      year,
      assumptions,
      depreciationProfile,
    )
    const yearlyTotalInterest = loanYear.kfwInterest + loanYear.bankInterest + loanYear.refinanceInterest
    const vuvEinkuenfte = rentalYear.yearlyNetBeforeDebt - yearlyTotalInterest - yearlyAfaAmount
    const yearlyTaxBenefit = -vuvEinkuenfte * marginalTaxRate
    const yearlyCashflow = rentalYear.yearlyNetBeforeDebt - loanYear.yearlyDebtService + yearlyTaxBenefit

    cumulativeCashflow20 += yearlyCashflow
    if (year <= afaPhaseOneEndYear) {
      afaPhaseOneCashflow += yearlyCashflow
      afaPhaseOneYears += 1
    } else if (year <= afaProjectionEndYear) {
      afaPhaseTwoCashflow += yearlyCashflow
      afaPhaseTwoYears += 1
    } else {
      postAfaCashflow += yearlyCashflow
      postAfaYears += 1
    }

    const yearlyValue = apartment.purchasePrice * Math.pow(1 + annualGrowthRate, year)
    const yearlyNetWealth = yearlyValue - remainingDebt + cumulativeCashflow20
    yearlyWealthPath.push(yearlyNetWealth)
    yearlyCashflows.push(yearlyCashflow)

    yearlyLiquidityRows.push({
      year,
      calendarYear,
      propertyValue: yearlyValue,
      grossRent: rentalYear.yearlyGrossRent,
      vacancyCost: rentalYear.yearlyVacancyCosts,
      managementCost: rentalYear.annualManagementCostsFull * rentalYear.rentShare,
      maintenanceCost: rentalYear.annualMaintenanceCostsFull * rentalYear.rentShare,
      netBeforeDebt: rentalYear.yearlyNetBeforeDebt,
      kfwInterest: loanYear.kfwInterest,
      kfwPrincipal: loanYear.kfwPrincipal,
      bankInterest: loanYear.bankInterest,
      bankPrincipal: loanYear.bankPrincipal,
      kfwGrantCredit: loanYear.kfwGrantCredit,
      refinanceInterest: loanYear.refinanceInterest,
      refinancePrincipal: loanYear.refinancePrincipal,
      debtService: loanYear.yearlyDebtService,
      taxBenefit: yearlyTaxBenefit,
      cashflow: yearlyCashflow,
      cumulativeCashflow: cumulativeCashflow20,
      remainingDebt,
      netWealth: yearlyNetWealth,
    })
  }

  const annualBaseRent = apartment.size * assumptions.rentPerSqm * 12
  const annualManagementCostsFull = (apartment.monthlyManagement + apartment.monthlyOtherCost) * 12
  const annualMaintenanceCostsFull = apartment.monthlyMaintenance * 12
  const projectedValue20 = apartment.purchasePrice * Math.pow(1 + annualGrowthRate, assumptions.years)
  const wealth20 = projectedValue20 - remainingDebt + cumulativeCashflow20
  const wealthGain20 = wealth20 - initialNetWealth
  const grossYield = (annualBaseRent / apartment.purchasePrice) * 100
  const yearOneOperatingCosts =
    annualBaseRent * assumptions.vacancyRate + annualManagementCostsFull + annualMaintenanceCostsFull
  const netYieldBeforeDebt = ((annualBaseRent - yearOneOperatingCosts) / apartment.purchasePrice) * 100
  const afaPhaseOneMonthlyLiquidity = afaPhaseOneYears > 0 ? afaPhaseOneCashflow / (afaPhaseOneYears * 12) : 0
  const afaPhaseTwoMonthlyLiquidity = afaPhaseTwoYears > 0 ? afaPhaseTwoCashflow / (afaPhaseTwoYears * 12) : 0
  const postAfaMonthlyLiquidity = postAfaYears > 0 ? postAfaCashflow / (postAfaYears * 12) : 0
  const afaTotalYears = afaPhaseOneYears + afaPhaseTwoYears
  const afaCombinedMonthlyLiquidity = afaTotalYears > 0 ? (afaPhaseOneCashflow + afaPhaseTwoCashflow) / (afaTotalYears * 12) : 0
  const depotCostRate = assumptions.depotCostRate
  const { yearlyPath: yearlyDepotPath, finalBalance: depotBalance } = simulateDepotPath(
    startEquity,
    yearlyCashflows,
    depotReturnRate,
    depotCostRate,
    depotTaxRate,
  )
  const depotNetReturnRate = calculateDepotNetReturnRate(depotReturnRate, depotCostRate, depotTaxRate)
  const requiredDepotGrossReturnRate = findRequiredDepotGrossReturnRate(
    wealth20,
    startEquity,
    yearlyCashflows,
    depotCostRate,
    depotTaxRate,
  )

  return {
    apartment,
    taxTableMode,
    taxModelMode: 'approximate',
    taxDisclaimer,
    annualGrossIncome: grossAnnualIncome,
    annualTax,
    marginalTaxRate,
    annualGrowthRate,
    startEquity,
    initialNetWealth,
    totalInvestment,
    ancillaryCosts,
    initialDebt,
    projectedValue20,
    cumulativeCashflow20,
    wealth20,
    wealthGain20,
    constructionPhaseMonthlyLiquidity,
    afaPhaseOneMonthlyLiquidity,
    afaPhaseTwoMonthlyLiquidity,
    afaCombinedMonthlyLiquidity,
    postAfaMonthlyLiquidity,
    afaTotalYears,
    refinanceDebtBase,
    kfwGrant,
    kfwGrantProjectionYear,
    grossYield,
    netYieldBeforeDebt,
    yearlyWealthPath,
    yearlyLiquidityRows,
    depotReturnRate,
    depotNetReturnRate,
    depotCostRate,
    depotTaxRate,
    requiredDepotGrossReturnRate,
    depotWealth20: depotBalance,
    yearlyDepotPath,
    finalRemainingDebt: remainingDebt,
  }
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}
