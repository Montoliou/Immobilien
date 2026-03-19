export function calculateDepotNetReturnRate(
  grossReturnRate: number,
  costRate: number,
  taxRate: number,
): number {
  const afterCostRate = grossReturnRate - costRate
  return afterCostRate > 0 ? afterCostRate * (1 - taxRate) : afterCostRate
}

export function simulateDepotPath(
  startBalance: number,
  yearlyCashflows: number[],
  grossReturnRate: number,
  costRate: number,
  taxRate: number,
): { yearlyPath: number[]; finalBalance: number } {
  const yearlyPath = [startBalance]
  let balance = startBalance

  for (const yearlyCashflow of yearlyCashflows) {
    const investableBalance = Math.max(balance, 0)
    const grossReturnAmount = investableBalance * grossReturnRate
    const costAmount = investableBalance * costRate
    const taxableGain = Math.max(grossReturnAmount - costAmount, 0)
    const capitalGainsTax = taxableGain * taxRate
    const netReturnAmount = grossReturnAmount - costAmount - capitalGainsTax

    balance += netReturnAmount + -yearlyCashflow
    yearlyPath.push(balance)
  }

  return { yearlyPath, finalBalance: balance }
}

export function findRequiredDepotGrossReturnRate(
  targetWealth: number,
  startBalance: number,
  yearlyCashflows: number[],
  costRate: number,
  taxRate: number,
): number | null {
  const lowerBound = -0.2
  const upperBound = 0.4
  let low = lowerBound
  let high = upperBound
  let result: number | null = null

  const wealthForRate = (rate: number): number =>
    simulateDepotPath(startBalance, yearlyCashflows, rate, costRate, taxRate).finalBalance

  if (wealthForRate(high) < targetWealth) {
    return null
  }

  for (let iteration = 0; iteration < 60; iteration += 1) {
    const mid = (low + high) / 2
    const midWealth = wealthForRate(mid)

    if (midWealth >= targetWealth) {
      result = mid
      high = mid
    } else {
      low = mid
    }
  }

  return result
}
