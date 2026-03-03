import './style.css'
import calculationConfig from './data/calculation-config.json'
import { jsPDF } from 'jspdf'

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
  monthlyManagementFlat: number
  monthlyMaintenanceFlat: number
  kfwLoanAmount: number
  kfwInterestRate: number
  kfwRepaymentRate: number
  kfwGraceYears: number
  kfwGrantAmount: number
  bankInterestRate: number
  bankRepaymentRate: number
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

type CalculationConfig = {
  defaultApartmentId: ApartmentId
  defaultAnnualGrossIncome: number
  incomeBounds: IncomeBounds
  assumptions: Assumptions
  apartments: ApartmentOption[]
}

type YearlyLiquidityRow = {
  year: number
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
  refinanceInterest: number
  refinancePrincipal: number
  debtService: number
  taxBenefit: number
  cashflow: number
  cumulativeCashflow: number
  remainingDebt: number
  netWealth: number
}

type ProjectionResult = {
  apartment: ApartmentOption
  annualGrossIncome: number
  annualTax: number
  marginalTaxRate: number
  annualGrowthRate: number
  startEquity: number
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
  postAfaMonthlyLiquidity: number
  refinanceDebtBase: number
  grossYield: number
  netYieldBeforeDebt: number
  yearlyWealthPath: number[]
  yearlyLiquidityRows: YearlyLiquidityRow[]
}

const config = calculationConfig as CalculationConfig
const apartments = config.apartments
const assumptions = config.assumptions
const projectionYears = assumptions.years
const growthBounds = { min: -2, max: 5, step: 0.1 }
const equityBounds = { min: 0, max: 30000, step: 500 }
const refinanceInterestRate = 0.03
const refinanceRepaymentRate = 0.02

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
          <h2>2. Dein Bruttojahreseinkommen</h2>
          <label class="field" for="annual-gross-income">
            <span>Bruttojahreseinkommen (EUR)</span>
            <input
              id="annual-gross-income"
              type="number"
              min="${config.incomeBounds.min}"
              max="${config.incomeBounds.max}"
              step="${config.incomeBounds.step}"
              inputmode="decimal"
            />
          </label>

          <label class="field" for="growth-rate">
            <span>Gemeinsame Wertentwicklung Objektwert + Miete (pro Jahr)</span>
            <input
              id="growth-rate"
              type="range"
              min="${growthBounds.min}"
              max="${growthBounds.max}"
              step="${growthBounds.step}"
            />
            <strong id="out-growth-rate" class="slider-value">-</strong>
          </label>

          <label class="field" for="equity-amount">
            <span>Eingesetztes Eigenkapital</span>
            <input
              id="equity-amount"
              type="range"
              min="${equityBounds.min}"
              max="${equityBounds.max}"
              step="${equityBounds.step}"
            />
            <strong id="out-equity-amount" class="slider-value">-</strong>
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
            <p class="metric-label">Kumulierter Cashflow (${projectionYears} Jahre)</p>
            <p id="out-cashflow20" class="metric-value">-</p>
          </article>
        </div>

        <div class="liquidity-block">
          <p class="assumption-label">Liquiditaet nach Projektphase (monatlich)</p>
          <table class="liquidity-table" aria-label="Liquiditaet nach Bauphase, Afa-Phasen und Folgefinanzierung">
            <thead>
              <tr>
                <th>Phase</th>
                <th>Monatliche Liquiditaet</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Bauphase</td>
                <td id="out-liquidity-construction">-</td>
              </tr>
              <tr>
                <td>Denkmal-AfA (Jahr 1-8)</td>
                <td id="out-liquidity-afa-1-8">-</td>
              </tr>
              <tr>
                <td>Denkmal-AfA (Jahr 9-12)</td>
                <td id="out-liquidity-afa-9-12">-</td>
              </tr>
              <tr>
                <td>Nach Denkmal-AfA (ab Jahr 13, Refinanzierung 3,0 % Zins + 2,0 % Tilgung)</td>
                <td id="out-liquidity-post-afa">-</td>
              </tr>
            </tbody>
          </table>
          <button id="download-liquidity-pdf" class="btn btn-secondary" type="button">
            Liquiditaetsrechnung als PDF herunterladen
          </button>
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
            <p class="assumption-label">Eigenkapital fuer Nebenkosten</p>
            <p id="out-start-equity">-</p>
          </article>
          <article>
            <p class="assumption-label">Gesamtinvestition inkl. Nebenkosten</p>
            <p id="out-total-investment">-</p>
          </article>
          <article>
            <p class="assumption-label">Steuer laut Grundtabelle</p>
            <p id="out-tax-rate">-</p>
          </article>
          <article>
            <p class="assumption-label">Restschuld bei Refinanzierung (Ende Jahr 12)</p>
            <p id="out-refinance-debt">-</p>
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
const incomeInput = getElementById<HTMLInputElement>('annual-gross-income')
const growthInput = getElementById<HTMLInputElement>('growth-rate')
const equityInput = getElementById<HTMLInputElement>('equity-amount')
const shareStatus = getElementById<HTMLElement>('share-status')
const copyDashboardButton = getElementById<HTMLButtonElement>('copy-dashboard-link')
const copyScenarioButton = getElementById<HTMLButtonElement>('copy-scenario-link')
const downloadLiquidityPdfButton = getElementById<HTMLButtonElement>('download-liquidity-pdf')

let selectedApartmentId: ApartmentId = config.defaultApartmentId
let annualGrossIncome = config.defaultAnnualGrossIncome
let annualGrowthRatePercent = assumptions.annualGrowthRate * 100
let investedEquity = getDefaultEquityForApartment(selectedApartmentId)

hydrateStateFromUrl()
renderApartmentCards()
writeInputValue(annualGrossIncome)
writeGrowthInputValue(annualGrowthRatePercent)
writeEquityInputValue(investedEquity)
renderProjection()

incomeInput.addEventListener('input', () => {
  annualGrossIncome = clamp(
    parseNumber(incomeInput.value, annualGrossIncome),
    config.incomeBounds.min,
    config.incomeBounds.max,
  )
  renderProjection()
})

growthInput.addEventListener('input', () => {
  annualGrowthRatePercent = clamp(
    parseNumber(growthInput.value, annualGrowthRatePercent),
    growthBounds.min,
    growthBounds.max,
  )
  renderProjection()
})

equityInput.addEventListener('input', () => {
  investedEquity = clamp(
    parseNumber(equityInput.value, investedEquity),
    equityBounds.min,
    equityBounds.max,
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
  const scenarioUrl = buildScenarioUrl(
    selectedApartmentId,
    annualGrossIncome,
    annualGrowthRatePercent,
    investedEquity,
  )
  const copied = await copyToClipboard(scenarioUrl)
  setStatus(
    copied
      ? 'Szenario-Link mit Wohnungswahl und Einkommen wurde kopiert.'
      : 'Szenario-Link konnte nicht automatisch kopiert werden.',
  )
})

downloadLiquidityPdfButton.addEventListener('click', () => {
  const apartment = getApartment(selectedApartmentId)
  const annualGrowthRate = annualGrowthRatePercent / 100
  const result = calculateProjection(apartment, annualGrossIncome, annualGrowthRate, investedEquity)
  downloadLiquidityPdf(result)
})

function renderApartmentCards(): void {
  apartmentContainer.innerHTML = apartments
    .map((apartment) => {
      const activeClass = apartment.id === selectedApartmentId ? ' apartment-card-active' : ''
      const apartmentHint =
        apartment.id === 'a'
          ? ''
          : `
            <p class="apartment-title">${apartment.label}</p>
            <p class="apartment-subtitle">${apartment.subtitle}</p>
          `
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
            ${apartmentHint}
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
  const annualGrowthRate = annualGrowthRatePercent / 100
  const result = calculateProjection(apartment, annualGrossIncome, annualGrowthRate, investedEquity)

  setText('result-headline', `Dein moegliches Vermoegen nach ${projectionYears} Jahren mit ${apartment.label}`)
  setText('out-wealth20', formatCurrency(result.wealth20))
  setText(
    'out-wealth-gain',
    `Vermoegenszuwachs ggü. Startkapital: ${formatSignedCurrency(result.wealthGain20)}`,
  )
  setText('out-object-value', formatCurrency(result.projectedValue20))
  setText('out-cashflow20', formatSignedCurrency(result.cumulativeCashflow20))
  setText('out-growth-rate', `${formatSignedPercent(result.annualGrowthRate * 100)} % pro Jahr`)
  setText('out-equity-amount', formatCurrency(result.startEquity))
  setText(
    'out-liquidity-construction',
    formatSignedCurrency(result.constructionPhaseMonthlyLiquidity),
  )
  setText('out-liquidity-afa-1-8', formatSignedCurrency(result.afaPhaseOneMonthlyLiquidity))
  setText('out-liquidity-afa-9-12', formatSignedCurrency(result.afaPhaseTwoMonthlyLiquidity))
  setText('out-liquidity-post-afa', formatSignedCurrency(result.postAfaMonthlyLiquidity))
  setText('out-path-end', formatCurrency(result.wealth20))
  setText('out-start-equity', formatCurrency(result.startEquity))
  setText(
    'out-total-investment',
    `${formatCurrency(result.totalInvestment)} (inkl. ${formatCurrency(result.ancillaryCosts)} Nebenkosten = ${formatPercent(
      assumptions.ancillaryCostRate * 100,
    )} %)`,
  )
  setText(
    'out-tax-rate',
    `${formatCurrency(result.annualTax)} p.a. | Grenzsteuersatz ${formatPercent(result.marginalTaxRate * 100)} %`,
  )
  setText('out-refinance-debt', formatCurrency(result.refinanceDebtBase))

  renderWealthPath(result.yearlyWealthPath)
  syncUrlState()
}

function calculateProjection(
  apartment: ApartmentOption,
  grossAnnualIncome: number,
  annualGrowthRate: number,
  selectedEquity: number,
): ProjectionResult {
  const annualBaseRent = apartment.size * assumptions.rentPerSqm * 12
  const annualManagementCosts = assumptions.monthlyManagementFlat * 12
  const annualMaintenanceCosts = assumptions.monthlyMaintenanceFlat * 12
  const taxableIncome = grossAnnualIncome * 0.8
  const annualTax = calculateGrundtabelleTax(taxableIncome)
  const marginalTaxRate = calculateMarginalTaxRate(taxableIncome)

  const ancillaryCosts = apartment.purchasePrice * assumptions.ancillaryCostRate
  const totalInvestment = apartment.purchasePrice + ancillaryCosts

  const startEquity = clamp(selectedEquity, equityBounds.min, Math.min(equityBounds.max, totalInvestment))
  const debtNeeded = Math.max(totalInvestment - startEquity, 0)
  const kfwLoan = Math.min(debtNeeded, assumptions.kfwLoanAmount)
  const bankLoan = Math.max(debtNeeded - kfwLoan, 0)
  const kfwGrant = kfwLoan > 0 ? Math.min(assumptions.kfwGrantAmount, kfwLoan) : 0
  const initialKfwDebt = Math.max(kfwLoan - kfwGrant, 0)
  const initialBankDebt = bankLoan
  const initialDebt = initialKfwDebt + initialBankDebt

  const kfwTargetDebtService = initialKfwDebt * (assumptions.kfwInterestRate + assumptions.kfwRepaymentRate)
  const bankTargetDebtService = initialBankDebt * (assumptions.bankInterestRate + assumptions.bankRepaymentRate)
  const afaPhaseOneEndYear = getAfaPhaseOneEndYear()
  const afaEndYear = getAfaEndYear()
  const constructionInterestLoad = kfwLoan * assumptions.kfwInterestRate + bankLoan * assumptions.bankInterestRate
  const constructionPhaseMonthlyLiquidity = -(constructionInterestLoad / 12)

  let remainingKfwDebt = initialKfwDebt
  let remainingBankDebt = initialBankDebt
  let remainingDebt = initialDebt
  let refinanceDebtBase = 0
  let postAfaTargetDebtService = 0
  let cumulativeCashflow20 = 0
  let afaPhaseOneCashflow = 0
  let afaPhaseTwoCashflow = 0
  let postAfaCashflow = 0
  let afaPhaseOneYears = 0
  let afaPhaseTwoYears = 0
  let postAfaYears = 0
  const yearlyWealthPath: number[] = []
  const yearlyLiquidityRows: YearlyLiquidityRow[] = []

  for (let year = 1; year <= assumptions.years; year += 1) {
    let yearlyDebtService = 0
    let kfwInterest = 0
    let kfwPrincipal = 0
    let bankInterest = 0
    let bankPrincipal = 0
    let refinanceInterest = 0
    let refinancePrincipal = 0

    if (year === afaEndYear + 1) {
      remainingDebt = remainingKfwDebt + remainingBankDebt
      refinanceDebtBase = remainingDebt
      postAfaTargetDebtService = remainingDebt * (refinanceInterestRate + refinanceRepaymentRate)
    }

    if (year <= afaEndYear) {
      kfwInterest = remainingKfwDebt * assumptions.kfwInterestRate
      kfwPrincipal =
        year <= assumptions.kfwGraceYears
          ? 0
          : Math.min(Math.max(kfwTargetDebtService - kfwInterest, 0), remainingKfwDebt)
      bankInterest = remainingBankDebt * assumptions.bankInterestRate
      bankPrincipal = Math.min(Math.max(bankTargetDebtService - bankInterest, 0), remainingBankDebt)

      yearlyDebtService = kfwInterest + kfwPrincipal + bankInterest + bankPrincipal
      remainingKfwDebt -= kfwPrincipal
      remainingBankDebt -= bankPrincipal
      remainingDebt = remainingKfwDebt + remainingBankDebt
    } else {
      refinanceInterest = remainingDebt * refinanceInterestRate
      refinancePrincipal = Math.min(
        Math.max(postAfaTargetDebtService - refinanceInterest, 0),
        remainingDebt,
      )
      yearlyDebtService = refinanceInterest + refinancePrincipal
      remainingDebt -= refinancePrincipal
    }

    const yearlyGrossRent = annualBaseRent * Math.pow(1 + annualGrowthRate, year - 1)
    const yearlyVacancyCosts = yearlyGrossRent * assumptions.vacancyRate
    const yearlyOperatingCosts = yearlyVacancyCosts + annualManagementCosts + annualMaintenanceCosts
    const yearlyNetBeforeDebt = yearlyGrossRent - yearlyOperatingCosts

    const yearlyAfaRate = getAfaRateForYear(year)
    const yearlyTaxBenefit =
      apartment.purchasePrice * assumptions.monumentShare * yearlyAfaRate * marginalTaxRate
    const yearlyCashflow = yearlyNetBeforeDebt - yearlyDebtService + yearlyTaxBenefit

    cumulativeCashflow20 += yearlyCashflow
    if (year <= afaPhaseOneEndYear) {
      afaPhaseOneCashflow += yearlyCashflow
      afaPhaseOneYears += 1
    } else if (year <= afaEndYear) {
      afaPhaseTwoCashflow += yearlyCashflow
      afaPhaseTwoYears += 1
    } else {
      postAfaCashflow += yearlyCashflow
      postAfaYears += 1
    }

    const yearlyValue = apartment.purchasePrice * Math.pow(1 + annualGrowthRate, year)
    const yearlyNetWealth = yearlyValue - remainingDebt + cumulativeCashflow20
    yearlyWealthPath.push(yearlyNetWealth)
    yearlyLiquidityRows.push({
      year,
      propertyValue: yearlyValue,
      grossRent: yearlyGrossRent,
      vacancyCost: yearlyVacancyCosts,
      managementCost: annualManagementCosts,
      maintenanceCost: annualMaintenanceCosts,
      netBeforeDebt: yearlyNetBeforeDebt,
      kfwInterest,
      kfwPrincipal,
      bankInterest,
      bankPrincipal,
      refinanceInterest,
      refinancePrincipal,
      debtService: yearlyDebtService,
      taxBenefit: yearlyTaxBenefit,
      cashflow: yearlyCashflow,
      cumulativeCashflow: cumulativeCashflow20,
      remainingDebt,
      netWealth: yearlyNetWealth,
    })
  }

  const projectedValue20 = apartment.purchasePrice * Math.pow(1 + annualGrowthRate, assumptions.years)
  const wealth20 = projectedValue20 - remainingDebt + cumulativeCashflow20
  const wealthGain20 = wealth20 - startEquity
  const grossYield = (annualBaseRent / apartment.purchasePrice) * 100
  const yearOneOperatingCosts =
    annualBaseRent * assumptions.vacancyRate + annualManagementCosts + annualMaintenanceCosts
  const netYieldBeforeDebt = ((annualBaseRent - yearOneOperatingCosts) / apartment.purchasePrice) * 100
  const afaPhaseOneMonthlyLiquidity =
    afaPhaseOneYears > 0 ? afaPhaseOneCashflow / (afaPhaseOneYears * 12) : 0
  const afaPhaseTwoMonthlyLiquidity =
    afaPhaseTwoYears > 0 ? afaPhaseTwoCashflow / (afaPhaseTwoYears * 12) : 0
  const postAfaMonthlyLiquidity = postAfaYears > 0 ? postAfaCashflow / (postAfaYears * 12) : 0

  return {
    apartment,
    annualGrossIncome: grossAnnualIncome,
    annualTax,
    marginalTaxRate,
    annualGrowthRate,
    startEquity,
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
    postAfaMonthlyLiquidity,
    refinanceDebtBase,
    grossYield,
    netYieldBeforeDebt,
    yearlyWealthPath,
    yearlyLiquidityRows,
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
  if (annualGrossIncome !== config.defaultAnnualGrossIncome) {
    params.set('gross', String(Math.round(annualGrossIncome)))
  }
  if (annualGrowthRatePercent !== assumptions.annualGrowthRate * 100) {
    params.set('growth', String(annualGrowthRatePercent))
  }
  if (investedEquity !== getDefaultEquityForApartment(selectedApartmentId)) {
    params.set('equity', String(Math.round(investedEquity)))
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
  investedEquity = getDefaultEquityForApartment(selectedApartmentId)

  const gross = params.get('gross') ?? params.get('income')
  if (gross) {
    annualGrossIncome = clamp(
      parseNumber(gross, annualGrossIncome),
      config.incomeBounds.min,
      config.incomeBounds.max,
    )
  }

  const growth = params.get('growth')
  if (growth) {
    annualGrowthRatePercent = clamp(
      parseNumber(growth, annualGrowthRatePercent),
      growthBounds.min,
      growthBounds.max,
    )
  }

  const equity = params.get('equity')
  if (equity) {
    investedEquity = clamp(
      parseNumber(equity, investedEquity),
      equityBounds.min,
      equityBounds.max,
    )
  }
}

function buildScenarioUrl(
  apartmentId: ApartmentId,
  grossAnnualIncomeValue: number,
  growthRatePercent: number,
  equityAmount: number,
): string {
  const params = new URLSearchParams()
  params.set('apartment', apartmentId)
  params.set('gross', String(Math.round(grossAnnualIncomeValue)))
  params.set('growth', String(growthRatePercent))
  params.set('equity', String(Math.round(equityAmount)))
  return `${window.location.origin}${window.location.pathname}?${params.toString()}`
}

function setText(targetId: string, value: string): void {
  getElementById<HTMLElement>(targetId).textContent = value
}

function writeInputValue(value: number): void {
  incomeInput.value = String(Math.round(value))
}

function writeGrowthInputValue(value: number): void {
  growthInput.value = String(value)
}

function writeEquityInputValue(value: number): void {
  equityInput.value = String(Math.round(value))
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

function getAfaPhaseOneEndYear(): number {
  const sortedSchedule = [...assumptions.afaSchedule].sort((left, right) => left.startYear - right.startYear)
  const firstPhase = sortedSchedule[0]
  return firstPhase ? firstPhase.endYear : 8
}

function getAfaEndYear(): number {
  return assumptions.afaSchedule.reduce((maxYear, entry) => Math.max(maxYear, entry.endYear), 0)
}

function calculateGrundtabelleTax(taxableIncome: number): number {
  const zve = Math.max(taxableIncome, 0)

  if (zve <= 11604) {
    return 0
  }

  if (zve <= 17005) {
    const y = (zve - 11604) / 10000
    return (922.98 * y + 1400) * y
  }

  if (zve <= 66760) {
    const z = (zve - 17005) / 10000
    return (181.19 * z + 2397) * z + 1025.38
  }

  if (zve <= 277825) {
    return 0.42 * zve - 10602.13
  }

  return 0.45 * zve - 18936.88
}

function calculateMarginalTaxRate(taxableIncome: number): number {
  const base = Math.max(taxableIncome, 0)
  const delta = 1
  const taxBase = calculateGrundtabelleTax(base)
  const taxUp = calculateGrundtabelleTax(base + delta)
  return Math.max((taxUp - taxBase) / delta, 0)
}

function getDefaultEquityForApartment(apartmentId: ApartmentId): number {
  const apartment = getApartment(apartmentId)
  const ancillaryCosts = apartment.purchasePrice * assumptions.ancillaryCostRate
  return clamp(ancillaryCosts, equityBounds.min, equityBounds.max)
}

function downloadLiquidityPdf(result: ProjectionResult): void {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' })
  let y = 40
  const left = 40
  const lineHeight = 14

  doc.setFontSize(14)
  doc.text('Liquiditaetsrechnung', left, y)
  y += 20

  doc.setFontSize(10)
  doc.text(`Objekt: ${result.apartment.label}`, left, y)
  y += lineHeight
  doc.text(`Bruttojahreseinkommen: ${formatCurrency(result.annualGrossIncome)}`, left, y)
  y += lineHeight
  doc.text(
    `Steuer (Grundtabelle): ${formatCurrency(result.annualTax)} | Grenzsteuersatz ${formatPercent(result.marginalTaxRate * 100)} %`,
    left,
    y,
  )
  y += lineHeight + 6

  for (const row of result.yearlyLiquidityRows) {
    if (y > 760) {
      doc.addPage()
      y = 40
    }

    doc.setFontSize(11)
    doc.text(`Jahr ${row.year}`, left, y)
    y += lineHeight

    doc.setFontSize(9)
    const lines = [
      `Objektwert: ${formatCurrency(row.propertyValue)} | Restschuld: ${formatCurrency(row.remainingDebt)} | Nettovermoegen: ${formatCurrency(row.netWealth)}`,
      `Miete brutto: ${formatCurrency(row.grossRent)} | Leerstand: ${formatCurrency(row.vacancyCost)} | Verwaltung: ${formatCurrency(row.managementCost)} | Instandhaltung: ${formatCurrency(row.maintenanceCost)}`,
      `NOI vor Finanzierung: ${formatCurrency(row.netBeforeDebt)} | Steuerentlastung: ${formatCurrency(row.taxBenefit)}`,
      `KfW Zins/Tilgung: ${formatCurrency(row.kfwInterest)} / ${formatCurrency(row.kfwPrincipal)} | Bank Zins/Tilgung: ${formatCurrency(row.bankInterest)} / ${formatCurrency(row.bankPrincipal)}`,
      `Refi Zins/Tilgung: ${formatCurrency(row.refinanceInterest)} / ${formatCurrency(row.refinancePrincipal)} | Kapitaldienst gesamt: ${formatCurrency(row.debtService)}`,
      `Jahres-Cashflow: ${formatSignedCurrency(row.cashflow)} | Kumulierter Cashflow: ${formatSignedCurrency(row.cumulativeCashflow)}`,
    ]

    for (const line of lines) {
      const wrapped = doc.splitTextToSize(line, 515)
      for (const wrappedLine of wrapped) {
        if (y > 780) {
          doc.addPage()
          y = 40
        }
        doc.text(wrappedLine, left, y)
        y += lineHeight
      }
    }

    y += 8
  }

  doc.save(`liquiditaetsrechnung-${result.apartment.id}.pdf`)
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

function formatSignedPercent(value: number): string {
  if (value > 0) {
    return `+${formatPercent(value)}`
  }
  return formatPercent(value)
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
