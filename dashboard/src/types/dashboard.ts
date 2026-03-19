export type ApartmentId = 'a' | 'b'

export type ApartmentOption = {
  id: ApartmentId
  label: string
  subtitle: string
  size: number
  purchasePrice: number
  image: string
  monthlyManagement: number
  monthlyMaintenance: number
  monthlyOtherCost: number
}

export type AfaScheduleEntry = {
  startYear: number
  endYear: number
  rate: number
}

export type Assumptions = {
  rentPerSqm: number
  ancillaryCostRate: number
  vacancyRate: number
  monthlyManagementFlat: number
  monthlyMaintenanceFlat: number
  purchaseYear: number
  rentStartYear: number
  rentStartQuarter: number
  afaStartYear: number
  afaStartQuarter: number
  kfwLoanAmount: number
  kfwInterestRate: number
  kfwRepaymentRate: number
  kfwGraceYears: number
  kfwGrantAmount: number
  bankInterestRate: number
  bankRepaymentRate: number
  zinsbindungJahre: number
  refinanceInterestRate: number
  refinanceRepaymentRate: number
  monumentShare: number
  depreciableShare: number
  regularAfaRate: number
  specialAfaBasisCapPerSqm: number
  specialAfaCostCeilingPerSqm: number
  annualGrowthRate: number
  depotCostRate: number
  years: number
  afaSchedule: AfaScheduleEntry[]
}

export type IncomeBounds = {
  min: number
  max: number
  step: number
}

export type EquityModel = {
  incomeMonthsFactor: number
  minEquity: number
  maxTotalInvestmentRatio: number
}

export type TaxModelMode = 'approximate'

export type TaxBracket = {
  maxMonthlyIncome: number
  rate: number
}

export type CalculationConfig = {
  defaultApartmentId: ApartmentId
  defaultAnnualGrossIncome: number
  incomeBounds: IncomeBounds
  equityModel: EquityModel
  assumptions: Assumptions
  taxBrackets: TaxBracket[]
  apartments: ApartmentOption[]
}

export type ConfigFieldOption = {
  value: string
  label: string
}

export type ConfigNumberField = {
  type: 'number'
  id: string
  label: string
  hint: string
  mode: 'number' | 'currency' | 'percent'
  step: number
  min?: number
  max?: number
  get: (config: CalculationConfig) => number
  set: (config: CalculationConfig, value: number) => void
}

export type ConfigSelectField = {
  type: 'select'
  id: string
  label: string
  hint: string
  options: (config: CalculationConfig) => ConfigFieldOption[]
  get: (config: CalculationConfig) => string
  set: (config: CalculationConfig, value: string) => void
}

export type ConfigField = ConfigNumberField | ConfigSelectField

export type ConfigSection = {
  title: string
  copy: string
  open: boolean
  fields: ConfigField[]
}

export type YearlyLiquidityRow = {
  year: number
  calendarYear: number
  propertyValue: number
  grossRent: number
  vacancyCost: number
  managementCost: number
  maintenanceCost: number
  netBeforeDebt: number
  kfwInterest: number
  kfwPrincipal: number
  bankInterest: number
  bankPrincipal: number
  kfwGrantCredit: number
  refinanceInterest: number
  refinancePrincipal: number
  debtService: number
  taxBenefit: number
  cashflow: number
  cumulativeCashflow: number
  remainingDebt: number
  netWealth: number
}

export type ProjectionResult = {
  apartment: ApartmentOption
  taxTableMode: TaxTableMode
  taxModelMode: TaxModelMode
  taxDisclaimer: string
  annualGrossIncome: number
  annualTax: number
  marginalTaxRate: number
  annualGrowthRate: number
  startEquity: number
  initialNetWealth: number
  totalInvestment: number
  ancillaryCosts: number
  initialDebt: number
  projectedValue20: number
  cumulativeCashflow20: number
  wealth20: number
  wealthGain20: number
  constructionPhaseMonthlyLiquidity: number
  afaPhaseOneMonthlyLiquidity: number
  afaPhaseTwoMonthlyLiquidity: number
  afaCombinedMonthlyLiquidity: number
  postAfaMonthlyLiquidity: number
  afaTotalYears: number
  refinanceDebtBase: number
  kfwGrant: number
  kfwGrantProjectionYear: number | null
  grossYield: number
  netYieldBeforeDebt: number
  yearlyWealthPath: number[]
  yearlyLiquidityRows: YearlyLiquidityRow[]
  depotReturnRate: number
  depotNetReturnRate: number
  depotCostRate: number
  depotTaxRate: number
  requiredDepotGrossReturnRate: number | null
  depotWealth20: number
  yearlyDepotPath: number[]
  finalRemainingDebt: number
}

export type LiquidityViewMode = 'afterTaxChart' | 'beforeTaxChart' | 'table'
export type TaxTableMode = 'grund' | 'splitting'

export type HeroSlide = {
  image: string
  alt: string
  caption: string
}

export type AppMode = 'admin' | 'customer'

export type ScenarioDefaults = {
  apartmentId: ApartmentId
  taxTableMode: TaxTableMode
  annualGrossIncome: number
  annualGrowthRatePercent: number
  investedEquity: number
  depotReturnRatePercent: number
}

export type RuntimePreset = {
  propertySlug: string
  id: string
  label: string
  version: string
  updatedAt: string
  calculationConfig: CalculationConfig
  scenarioDefaults: ScenarioDefaults
}

export type CustomerIdentity = {
  firstName: string
  lastName: string
}

export type CustomerScenarioSnapshot = {
  id: string
  createdAt: string
  customer: CustomerIdentity
  preset: RuntimePreset
}

export type PresetManifestEntry = {
  id: string
  label: string
}

export type PresetContext = {
  mode: AppMode
  preset: RuntimePreset
  notice: string | null
  hasExplicitPresetParam: boolean
  customerScenario: CustomerScenarioSnapshot | null
  customerScenarioId: string | null
}
