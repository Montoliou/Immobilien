import './style.css'
import calculationConfig from './data/calculation-config.json'

type ApartmentId = 'a' | 'b'

type ApartmentOption = {
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

type AfaScheduleEntry = {
  startYear: number
  endYear: number
  rate: number
}

type Assumptions = {
  rentPerSqm: number
  ancillaryCostRate: number
  vacancyRate: number
  interestRate: number
  repaymentRate: number
  kfwMaxLoan: number
  kfwGrantRate: number
  monumentShare: number
  annualGrowthRate: number
  years: number
  afaSchedule: AfaScheduleEntry[]
}

type IncomeBounds = {
  min: number
  max: number
  step: number
}

type EquityModel = {
  incomeMonthsFactor: number
  minEquity: number
  maxTotalInvestmentRatio: number
}

type TaxBracket = {
  maxMonthlyIncome: number
  rate: number
}

type CalculationConfig = {
  defaultApartmentId: ApartmentId
  defaultMonthlyIncome: number
  incomeBounds: IncomeBounds
  equityModel: EquityModel
  assumptions: Assumptions
  taxBrackets: TaxBracket[]
  apartments: ApartmentOption[]
}

type ProjectionResult = {
  apartment: ApartmentOption
  monthlyIncome: number
  estimatedTaxRate: number
  startEquity: number
  totalInvestment: number
  ancillaryCosts: number
  initialDebt: number
  projectedValue20: number
  remainingDebt20: number
  cumulativeCashflow20: number
  wealth20: number
  wealthGain20: number
  monthlyCashflowYear1: number
  monthlyOutOfPocketYear1: number
  incomeLoadYear1: number
  grossYield: number
  netYieldBeforeDebt: number
  yearlyWealthPath: number[]
}

const config = calculationConfig as CalculationConfig
const apartments = config.apartments
const assumptions = config.assumptions
const projectionYears = assumptions.years

const app = getElementById<HTMLDivElement>('app')

app.innerHTML = `
  <main class="page">
    <section class="panel hero">
      <div class="hero-visual">
        <img src="/project/york-living-hero.png" alt="Visualisierung York Living in Muenster" />
      </div>
      <div class="hero-content">
        <p class="eyebrow">York Living Muenster</p>
        <h1>Dein Immobilien-Check in 60 Sekunden</h1>
        <p class="lead">
          Waehle einen Grundriss, gib dein monatliches Netto-Einkommen ein und erhalte sofort eine
          transparente ${projectionYears}-Jahres-Prognose fuer dein moegliches Vermoegen.
        </p>
        <div class="hero-actions">
          <button id="copy-dashboard-link" class="btn btn-secondary" type="button">Neutralen Link kopieren</button>
          <button id="copy-scenario-link" class="btn btn-primary" type="button">Szenario-Link kopieren</button>
        </div>
        <p id="share-status" class="share-status" role="status" aria-live="polite"></p>
      </div>
    </section>

    <section class="workspace">
      <section class="panel choose-panel">
        <h2>1. Waehle deine Wohnungsoption</h2>
        <div id="apartment-options" class="apartment-options"></div>

        <div class="income-block">
          <h2>2. Dein monatliches Netto-Einkommen</h2>
          <label class="field" for="monthly-income">
            <span>Netto-Haushaltseinkommen pro Monat (EUR)</span>
            <input
              id="monthly-income"
              type="number"
              min="${config.incomeBounds.min}"
              max="${config.incomeBounds.max}"
              step="${config.incomeBounds.step}"
              inputmode="decimal"
            />
          </label>
        </div>

        <p class="small-note">
          Alle zentralen Rechenparameter werden aus <code>src/data/calculation-config.json</code> geladen.
        </p>
      </section>

      <section class="panel result-panel" aria-live="polite">
        <p class="eyebrow">3. Prognose</p>
        <h2 id="result-headline">Dein moegliches Vermoegen nach ${projectionYears} Jahren</h2>
        <p id="out-wealth20" class="wealth-value">-</p>
        <p id="out-wealth-gain" class="wealth-subvalue">-</p>

        <div class="metric-grid">
          <article class="metric-card">
            <p class="metric-label">Objektwert in ${projectionYears} Jahren</p>
            <p id="out-object-value" class="metric-value">-</p>
          </article>
          <article class="metric-card">
            <p class="metric-label">Restschuld in ${projectionYears} Jahren</p>
            <p id="out-remaining-debt" class="metric-value">-</p>
          </article>
          <article class="metric-card">
            <p class="metric-label">Kumulierter Cashflow (${projectionYears} Jahre)</p>
            <p id="out-cashflow20" class="metric-value">-</p>
          </article>
          <article class="metric-card">
            <p class="metric-label">Monatlicher Cashflow im Jahr 1</p>
            <p id="out-cashflow-year1" class="metric-value">-</p>
          </article>
          <article class="metric-card">
            <p class="metric-label">Monatliche Eigenbelastung im Jahr 1</p>
            <p id="out-out-of-pocket" class="metric-value">-</p>
          </article>
          <article class="metric-card">
            <p class="metric-label">Belastung vom Einkommen</p>
            <p id="out-income-load" class="metric-value">-</p>
          </article>
        </div>

        <div class="progress-wrap">
          <div class="progress-meta">
            <p>Vermoegensentwicklung ueber ${projectionYears} Jahre</p>
            <p id="out-path-end">-</p>
          </div>
          <div id="wealth-path" class="wealth-path"></div>
        </div>

        <div class="assumption-grid">
          <article>
            <p class="assumption-label">Automatisches Start-Eigenkapital</p>
            <p id="out-start-equity">-</p>
          </article>
          <article>
            <p class="assumption-label">Gesamtinvestition inkl. Nebenkosten</p>
            <p id="out-total-investment">-</p>
          </article>
          <article>
            <p class="assumption-label">Geschaetzter Steuerfaktor</p>
            <p id="out-tax-rate">-</p>
          </article>
          <article>
            <p class="assumption-label">Renditeannahme aus Broschuere</p>
            <p id="out-yields">-</p>
          </article>
        </div>
      </section>
    </section>

    <section class="panel facts-panel">
      <h2>Warum das Objekt fuer viele Kunden emotional greifbar ist</h2>
      <p class="lead">
        Die Broschuere verbindet klare Investment-Argumente mit einem alltagsnahen Wohnbild: kompakte
        Grundrisse, starke Nachfrage und kurze Wege in Muenster.
      </p>
      <div class="facts-grid">
        <article class="fact-card">
          <p class="fact-number">30.000</p>
          <p class="fact-title">zusaetzliche Wohnungen bis 2040</p>
          <div class="fact-bar">
            <div class="fact-fill fact-fill-demand" style="width: 18%"></div>
          </div>
          <p class="fact-copy">Das entspricht rund 18 % des Bestands von 2022.</p>
        </article>

        <article class="fact-card">
          <p class="fact-number">55,3 %</p>
          <p class="fact-title">Einpersonen-Haushalte (2024)</p>
          <div class="compare-row">
            <span>2011: 53,0 %</span>
            <span>2024: 55,3 %</span>
          </div>
          <div class="fact-bar">
            <div class="fact-fill fact-fill-single" style="width: 55.3%"></div>
          </div>
        </article>

        <article class="fact-card">
          <p class="fact-number">1,1 %</p>
          <p class="fact-title">Leerstand aktuell</p>
          <div class="compare-row">
            <span>Ist: 1,1 %</span>
            <span>Soll: 3,0 %</span>
          </div>
          <div class="dual-bars">
            <div class="dual-bar">
              <span style="width: 36.7%"></span>
            </div>
            <div class="dual-bar dual-bar-target">
              <span style="width: 100%"></span>
            </div>
          </div>
        </article>

        <article class="fact-card">
          <p class="fact-number">15-20 min</p>
          <p class="fact-title">Fahrzeit zur Innenstadt</p>
          <p class="fact-copy">Ca. 6,5 km bis Domplatz per Rad oder Auto laut Broschuere.</p>
          <p class="fact-copy">Ein Ort, der Investment und Lebensqualitaet zusammenbringt.</p>
        </article>
      </div>
    </section>
  </main>
`

const currency = new Intl.NumberFormat('de-DE', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
})

const percent = new Intl.NumberFormat('de-DE', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
})

const apartmentContainer = getElementById<HTMLDivElement>('apartment-options')
const incomeInput = getElementById<HTMLInputElement>('monthly-income')
const shareStatus = getElementById<HTMLElement>('share-status')
const copyDashboardButton = getElementById<HTMLButtonElement>('copy-dashboard-link')
const copyScenarioButton = getElementById<HTMLButtonElement>('copy-scenario-link')

let selectedApartmentId: ApartmentId = config.defaultApartmentId
let monthlyIncome = config.defaultMonthlyIncome

hydrateStateFromUrl()
renderApartmentCards()
writeInputValue(monthlyIncome)
renderProjection()

incomeInput.addEventListener('input', () => {
  monthlyIncome = clamp(
    parseNumber(incomeInput.value, monthlyIncome),
    config.incomeBounds.min,
    config.incomeBounds.max,
  )
  renderProjection()
})

copyDashboardButton.addEventListener('click', async () => {
  const plainUrl = `${window.location.origin}${window.location.pathname}`
  const copied = await copyToClipboard(plainUrl)
  setStatus(
    copied
      ? 'Neutraler Link ohne persoenliche Angaben wurde kopiert.'
      : 'Kopieren fehlgeschlagen. Bitte URL manuell kopieren.',
  )
})

copyScenarioButton.addEventListener('click', async () => {
  const scenarioUrl = buildScenarioUrl(selectedApartmentId, monthlyIncome)
  const copied = await copyToClipboard(scenarioUrl)
  setStatus(
    copied
      ? 'Szenario-Link mit Wohnungswahl und Einkommen wurde kopiert.'
      : 'Szenario-Link konnte nicht automatisch kopiert werden.',
  )
})

function renderApartmentCards(): void {
  apartmentContainer.innerHTML = apartments
    .map((apartment) => {
      const activeClass = apartment.id === selectedApartmentId ? ' apartment-card-active' : ''
      return `
        <button
          type="button"
          class="apartment-card${activeClass}"
          data-apartment="${apartment.id}"
          aria-pressed="${apartment.id === selectedApartmentId}"
        >
          <div class="apartment-image-wrap">
            <img src="${apartment.image}" alt="Grundriss ${apartment.label}" />
          </div>
          <div class="apartment-info">
            <p class="apartment-title">${apartment.label}</p>
            <p class="apartment-subtitle">${apartment.subtitle}</p>
            <p class="apartment-price">${formatCurrency(apartment.purchasePrice)}</p>
          </div>
        </button>
      `
    })
    .join('')

  apartmentContainer.querySelectorAll<HTMLButtonElement>('.apartment-card').forEach((button) => {
    button.addEventListener('click', () => {
      const apartmentId = button.dataset.apartment
      if (!apartmentId || !isApartmentId(apartmentId)) {
        return
      }
      selectedApartmentId = apartmentId
      renderApartmentCards()
      renderProjection()
    })
  })
}

function renderProjection(): void {
  const apartment = getApartment(selectedApartmentId)
  const result = calculateProjection(apartment, monthlyIncome)

  setText('result-headline', `Dein moegliches Vermoegen nach ${projectionYears} Jahren mit ${apartment.label}`)
  setText('out-wealth20', formatCurrency(result.wealth20))
  setText(
    'out-wealth-gain',
    `Vermoegenszuwachs ggü. Startkapital: ${formatSignedCurrency(result.wealthGain20)}`,
  )
  setText('out-object-value', formatCurrency(result.projectedValue20))
  setText('out-remaining-debt', formatCurrency(result.remainingDebt20))
  setText('out-cashflow20', formatSignedCurrency(result.cumulativeCashflow20))
  setToneValue('out-cashflow-year1', result.monthlyCashflowYear1)
  setText('out-out-of-pocket', formatCurrency(result.monthlyOutOfPocketYear1))
  setText('out-income-load', `${formatPercent(result.incomeLoadYear1)} % vom Netto`)
  setText('out-path-end', formatCurrency(result.wealth20))
  setText('out-start-equity', formatCurrency(result.startEquity))
  setText(
    'out-total-investment',
    `${formatCurrency(result.totalInvestment)} (inkl. ${formatCurrency(result.ancillaryCosts)} Nebenkosten)`,
  )
  setText(
    'out-tax-rate',
    `${formatPercent(result.estimatedTaxRate * 100)} % (geschaetzt aus Einkommen)`,
  )
  setText(
    'out-yields',
    `Brutto ${formatPercent(result.grossYield)} % | Netto vor Finanzierung ${formatPercent(result.netYieldBeforeDebt)} %`,
  )

  renderWealthPath(result.yearlyWealthPath)
  syncUrlState()
}

function calculateProjection(apartment: ApartmentOption, income: number): ProjectionResult {
  const annualGrossRent = apartment.size * assumptions.rentPerSqm * 12
  const annualOperatingCosts =
    annualGrossRent * assumptions.vacancyRate +
    (apartment.monthlyManagement + apartment.monthlyMaintenance + apartment.monthlyOtherCost) * 12
  const annualNetBeforeDebt = annualGrossRent - annualOperatingCosts

  const ancillaryCosts = apartment.purchasePrice * assumptions.ancillaryCostRate
  const totalInvestment = apartment.purchasePrice + ancillaryCosts

  const startEquity = clamp(
    income * config.equityModel.incomeMonthsFactor,
    config.equityModel.minEquity,
    totalInvestment * config.equityModel.maxTotalInvestmentRatio,
  )

  const debtNeeded = Math.max(totalInvestment - startEquity, 0)
  const kfwLoan = Math.min(debtNeeded, assumptions.kfwMaxLoan)
  const kfwGrant = kfwLoan * assumptions.kfwGrantRate
  const initialDebt = Math.max(debtNeeded - kfwGrant, 0)

  const yearlyTargetDebtService = initialDebt * (assumptions.interestRate + assumptions.repaymentRate)
  const estimatedTaxRate = estimateTaxRate(income)

  let remainingDebt = initialDebt
  let cumulativeCashflow20 = 0
  let monthlyCashflowYear1 = 0
  const yearlyWealthPath: number[] = []

  for (let year = 1; year <= assumptions.years; year += 1) {
    const yearlyInterest = remainingDebt * assumptions.interestRate
    const yearlyPrincipal = Math.min(Math.max(yearlyTargetDebtService - yearlyInterest, 0), remainingDebt)
    const yearlyDebtService = yearlyInterest + yearlyPrincipal
    remainingDebt -= yearlyPrincipal

    const yearlyAfaRate = getAfaRateForYear(year)
    const yearlyTaxBenefit =
      apartment.purchasePrice * assumptions.monumentShare * yearlyAfaRate * estimatedTaxRate
    const yearlyCashflow = annualNetBeforeDebt - yearlyDebtService + yearlyTaxBenefit

    cumulativeCashflow20 += yearlyCashflow
    if (year === 1) {
      monthlyCashflowYear1 = yearlyCashflow / 12
    }

    const yearlyValue = apartment.purchasePrice * Math.pow(1 + assumptions.annualGrowthRate, year)
    const yearlyNetWealth = yearlyValue - remainingDebt + cumulativeCashflow20
    yearlyWealthPath.push(yearlyNetWealth)
  }

  const projectedValue20 =
    apartment.purchasePrice * Math.pow(1 + assumptions.annualGrowthRate, assumptions.years)
  const remainingDebt20 = remainingDebt
  const wealth20 = projectedValue20 - remainingDebt20 + cumulativeCashflow20
  const wealthGain20 = wealth20 - startEquity
  const monthlyOutOfPocketYear1 = Math.max(-monthlyCashflowYear1, 0)
  const incomeLoadYear1 = income > 0 ? (monthlyOutOfPocketYear1 / income) * 100 : 0
  const grossYield = (annualGrossRent / apartment.purchasePrice) * 100
  const netYieldBeforeDebt = (annualNetBeforeDebt / apartment.purchasePrice) * 100

  return {
    apartment,
    monthlyIncome: income,
    estimatedTaxRate,
    startEquity,
    totalInvestment,
    ancillaryCosts,
    initialDebt,
    projectedValue20,
    remainingDebt20,
    cumulativeCashflow20,
    wealth20,
    wealthGain20,
    monthlyCashflowYear1,
    monthlyOutOfPocketYear1,
    incomeLoadYear1,
    grossYield,
    netYieldBeforeDebt,
    yearlyWealthPath,
  }
}

function renderWealthPath(values: number[]): void {
  const pathElement = getElementById<HTMLDivElement>('wealth-path')
  const maxAbs = Math.max(...values.map((value) => Math.abs(value)), 1)
  pathElement.style.setProperty('--year-count', String(values.length))

  pathElement.innerHTML = values
    .map((value, index) => {
      const height = Math.max((Math.abs(value) / maxAbs) * 100, 3)
      const toneClass = value >= 0 ? 'path-bar-positive' : 'path-bar-negative'
      return `
        <div class="path-col" title="Jahr ${index + 1}: ${formatCurrency(value)}">
          <span class="path-bar-wrap">
            <span class="path-bar ${toneClass}" style="height: ${height.toFixed(2)}%"></span>
          </span>
          <span class="path-year">${index + 1}</span>
        </div>
      `
    })
    .join('')
}

function syncUrlState(): void {
  const params = new URLSearchParams()
  if (selectedApartmentId !== config.defaultApartmentId) {
    params.set('apartment', selectedApartmentId)
  }
  if (monthlyIncome !== config.defaultMonthlyIncome) {
    params.set('income', String(Math.round(monthlyIncome)))
  }

  const query = params.toString()
  const nextUrl = query ? `${window.location.pathname}?${query}` : window.location.pathname
  window.history.replaceState(null, '', nextUrl)
}

function hydrateStateFromUrl(): void {
  const params = new URLSearchParams(window.location.search)

  const apartment = params.get('apartment')
  if (apartment && isApartmentId(apartment) && apartments.some((entry) => entry.id === apartment)) {
    selectedApartmentId = apartment
  }

  const income = params.get('income')
  if (income) {
    monthlyIncome = clamp(
      parseNumber(income, monthlyIncome),
      config.incomeBounds.min,
      config.incomeBounds.max,
    )
  }
}

function buildScenarioUrl(apartmentId: ApartmentId, income: number): string {
  const params = new URLSearchParams()
  params.set('apartment', apartmentId)
  params.set('income', String(Math.round(income)))
  return `${window.location.origin}${window.location.pathname}?${params.toString()}`
}

function setToneValue(targetId: string, value: number): void {
  const element = getElementById<HTMLElement>(targetId)
  element.textContent = formatSignedCurrency(value)
  element.classList.remove('tone-positive', 'tone-negative')

  if (value > 0) {
    element.classList.add('tone-positive')
  } else if (value < 0) {
    element.classList.add('tone-negative')
  }
}

function setText(targetId: string, value: string): void {
  getElementById<HTMLElement>(targetId).textContent = value
}

function writeInputValue(value: number): void {
  incomeInput.value = String(Math.round(value))
}

function setStatus(message: string): void {
  shareStatus.textContent = message
}

function getApartment(apartmentId: ApartmentId): ApartmentOption {
  const apartment = apartments.find((entry) => entry.id === apartmentId)
  if (!apartment) {
    throw new Error(`Apartment "${apartmentId}" not found.`)
  }
  return apartment
}

function getAfaRateForYear(year: number): number {
  const match = assumptions.afaSchedule.find(
    (entry) => year >= entry.startYear && year <= entry.endYear,
  )
  return match ? match.rate : 0
}

function estimateTaxRate(monthlyIncome: number): number {
  const matchingBracket = config.taxBrackets.find(
    (bracket) => monthlyIncome <= bracket.maxMonthlyIncome,
  )
  if (matchingBracket) {
    return matchingBracket.rate
  }
  const fallbackRate = config.taxBrackets[config.taxBrackets.length - 1]
  return fallbackRate ? fallbackRate.rate : 0.42
}

function parseNumber(rawValue: string, fallback: number): number {
  const parsed = Number.parseFloat(rawValue.replace(',', '.'))
  return Number.isFinite(parsed) ? parsed : fallback
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

function isApartmentId(value: string): value is ApartmentId {
  return value === 'a' || value === 'b'
}

function formatCurrency(value: number): string {
  return currency.format(value)
}

function formatSignedCurrency(value: number): string {
  if (value > 0) {
    return `+${formatCurrency(value)}`
  }
  return formatCurrency(value)
}

function formatPercent(value: number): string {
  return percent.format(value)
}

async function copyToClipboard(text: string): Promise<boolean> {
  if (!navigator.clipboard?.writeText) {
    return false
  }
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

function getElementById<T extends HTMLElement>(id: string): T {
  const element = document.getElementById(id)
  if (!element) {
    throw new Error(`Missing element "${id}".`)
  }
  return element as T
}
