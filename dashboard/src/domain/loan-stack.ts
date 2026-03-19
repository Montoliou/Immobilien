import type { Assumptions } from '../types/dashboard'

export type LoanStackYearInput = {
  year: number
  kfwLoan: number
  bankLoan: number
  assumptions: Assumptions
  remainingKfwDebt: number
  remainingBankDebt: number
  remainingDebt: number
  refinanceDebtBase: number
  refinanceTargetDebtService: number
  kfwGrant: number
  kfwGrantProjectionYear: number | null
}

export type LoanStackYearResult = {
  kfwInterest: number
  kfwPrincipal: number
  bankInterest: number
  bankPrincipal: number
  kfwGrantCredit: number
  refinanceInterest: number
  refinancePrincipal: number
  yearlyDebtService: number
  remainingKfwDebt: number
  remainingBankDebt: number
  remainingDebt: number
  refinanceDebtBase: number
  refinanceTargetDebtService: number
}

export function calculateLoanStackYear(input: LoanStackYearInput): LoanStackYearResult {
  const {
    year,
    kfwLoan,
    bankLoan,
    assumptions,
    kfwGrant,
    kfwGrantProjectionYear,
  } = input

  let {
    remainingKfwDebt,
    remainingBankDebt,
    remainingDebt,
    refinanceDebtBase,
    refinanceTargetDebtService,
  } = input

  const zinsbindungEndProjectionYear = assumptions.zinsbindungJahre + 1
  const kfwTargetDebtService = kfwLoan * (assumptions.kfwInterestRate + assumptions.kfwRepaymentRate)
  const bankTargetDebtService = bankLoan * (assumptions.bankInterestRate + assumptions.bankRepaymentRate)
  const rentShare = getRentShareForProjectionYear(year, assumptions)
  const constructionShare = 1 - rentShare

  let yearlyDebtService = 0
  let kfwInterest = 0
  let kfwPrincipal = 0
  let bankInterest = 0
  let bankPrincipal = 0
  let kfwGrantCredit = 0
  let refinanceInterest = 0
  let refinancePrincipal = 0

  if (year === zinsbindungEndProjectionYear + 1) {
    remainingDebt = remainingKfwDebt + remainingBankDebt
    refinanceDebtBase = remainingDebt
    refinanceTargetDebtService = remainingDebt * (assumptions.refinanceInterestRate + assumptions.refinanceRepaymentRate)
  }

  if (year <= zinsbindungEndProjectionYear) {
    const normalKfwInterest = remainingKfwDebt * assumptions.kfwInterestRate
    const normalKfwPrincipal =
      year <= assumptions.kfwGraceYears
        ? 0
        : Math.min(Math.max(kfwTargetDebtService - normalKfwInterest, 0), remainingKfwDebt)
    const normalBankInterest = remainingBankDebt * assumptions.bankInterestRate
    const normalBankPrincipal = Math.min(
      Math.max(bankTargetDebtService - normalBankInterest, 0),
      remainingBankDebt,
    )
    const constructionKfwInterest = (kfwLoan * 0.5) * assumptions.kfwInterestRate * constructionShare
    const constructionBankInterest = (bankLoan * 0.5) * assumptions.bankInterestRate * constructionShare

    kfwInterest = constructionKfwInterest + normalKfwInterest * rentShare
    kfwPrincipal = normalKfwPrincipal * rentShare
    bankInterest = constructionBankInterest + normalBankInterest * rentShare
    bankPrincipal = normalBankPrincipal * rentShare

    yearlyDebtService = kfwInterest + kfwPrincipal + bankInterest + bankPrincipal
    remainingKfwDebt -= kfwPrincipal
    remainingBankDebt -= bankPrincipal

    if (kfwGrantProjectionYear !== null && year === kfwGrantProjectionYear) {
      kfwGrantCredit = Math.min(kfwGrant, remainingKfwDebt)
      remainingKfwDebt -= kfwGrantCredit
    }

    remainingDebt = remainingKfwDebt + remainingBankDebt
  } else {
    refinanceInterest = remainingDebt * assumptions.refinanceInterestRate
    refinancePrincipal = Math.min(
      Math.max(refinanceTargetDebtService - refinanceInterest, 0),
      remainingDebt,
    )
    yearlyDebtService = refinanceInterest + refinancePrincipal
    remainingDebt -= refinancePrincipal
  }

  return {
    kfwInterest,
    kfwPrincipal,
    bankInterest,
    bankPrincipal,
    kfwGrantCredit,
    refinanceInterest,
    refinancePrincipal,
    yearlyDebtService,
    remainingKfwDebt,
    remainingBankDebt,
    remainingDebt,
    refinanceDebtBase,
    refinanceTargetDebtService,
  }
}

export function getRentShareForProjectionYear(year: number, assumptions: Assumptions): number {
  const calendarYear = assumptions.purchaseYear + year - 1
  if (calendarYear < assumptions.rentStartYear) {
    return 0
  }
  if (calendarYear > assumptions.rentStartYear) {
    return 1
  }
  return (5 - assumptions.rentStartQuarter) / 4
}
