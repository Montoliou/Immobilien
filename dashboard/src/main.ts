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
  defaultAnnualGrossIncome: number
  incomeBounds: IncomeBounds
  equityModel: EquityModel
  assumptions: Assumptions
  taxBrackets: TaxBracket[]
  apartments: ApartmentOption[]
}

type ConfigFieldOption = {
  value: string
  label: string
}

type ConfigNumberField = {
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

type ConfigSelectField = {
  type: 'select'
  id: string
  label: string
  hint: string
  options: (config: CalculationConfig) => ConfigFieldOption[]
  get: (config: CalculationConfig) => string
  set: (config: CalculationConfig, value: string) => void
}

type ConfigField = ConfigNumberField | ConfigSelectField

type ConfigSection = {
  title: string
  copy: string
  open: boolean
  fields: ConfigField[]
}

type YearlyLiquidityRow = {
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
  taxTableMode: TaxTableMode
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

type LiquidityViewMode = 'afterTaxChart' | 'beforeTaxChart' | 'table'
type TaxTableMode = 'grund' | 'splitting'

type HeroSlide = {
  image: string
  alt: string
  caption: string
}

const CONFIG_STORAGE_KEY = 'york-living-runtime-config'
const defaultConfig = deepCloneConfig(calculationConfig as CalculationConfig)
const config = loadStoredConfig(defaultConfig)
const configSections = buildConfigSections()
const apartments = config.apartments
const assumptions = config.assumptions
const projectionYears = assumptions.years
const growthBounds = { min: -2, max: 5, step: 0.1 }
const equityBounds = { min: 0, max: 30000, step: 500 }
const refinanceInterestRate = 0.03
const refinanceRepaymentRate = 0.02
const CONSULTATION_EMAIL = 'andreas.peters@mlp.de'
const MAPS_URL = 'https://maps.app.goo.gl/t3fVRBvNyz42xWMp7'
const heroSlides: HeroSlide[] = [
  {
    image: '/project/hero-york-living-tomorrow.png',
    alt: 'York Living morgen',
    caption: 'York Living morgen',
  },
  {
    image: '/project/hero-modern-living.png',
    alt: 'Modern Living',
    caption: 'Modern Living',
  },
  {
    image: '/project/hero-york-today.png',
    alt: 'York Quartier heute',
    caption: 'York Quartier heute',
  },
  {
    image: '/project/hero-bike-city.png',
    alt: 'Münster, die Fahrrad-Stadt',
    caption: 'Münster, die Fahrrad-Stadt',
  },
]

const app = getElementById<HTMLDivElement>('app')

app.innerHTML = `
  <details class="config-menu">
    <summary class="config-toggle">Parameter</summary>
    <div class="config-panel">
      <div class="config-panel-header">
        <div>
          <p class="config-panel-title">Rechenparameter</p>
          <p class="config-panel-copy">
            Zins, Tilgung, Kaufpreis und Steuerannahmen direkt im UI anpassen. Änderungen gelten
            lokal in diesem Browser, bis du sie zurücksetzt.
          </p>
        </div>
      </div>

      <form id="config-form" class="config-form" autocomplete="off">
        <div class="config-section-list">${renderConfigSections(configSections, config)}</div>
      </form>

      <div class="config-actions">
        <button id="apply-config" class="btn btn-primary btn-compact" type="button">Übernehmen</button>
        <button id="reset-config" class="btn btn-secondary btn-compact" type="button">Zurücksetzen</button>
        <button id="copy-config" class="btn btn-secondary btn-compact" type="button">Backup JSON</button>
      </div>

      <p id="config-status" class="config-status" role="status" aria-live="polite"></p>
    </div>
  </details>

  <main class="page">
    <section class="panel hero">
      <div class="hero-visual">
        <div id="hero-slideshow" class="hero-slideshow">
          <img
            id="hero-slide-image"
            src="${resolvePublicAssetPath(heroSlides[0].image)}"
            alt="${heroSlides[0].alt}"
          />
          <div class="hero-slide-overlay">
            <p id="hero-slide-caption" class="hero-slide-caption">${heroSlides[0].caption}</p>
            <div class="hero-slide-controls">
              <button
                id="hero-slide-prev"
                class="hero-slide-nav"
                type="button"
                aria-label="Vorheriges Projektbild"
              >
                ‹
              </button>
              <button
                id="hero-slide-next"
                class="hero-slide-nav"
                type="button"
                aria-label="Nächstes Projektbild"
              >
                ›
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="hero-content">
        <p class="eyebrow">York Living Münster</p>
        <h1>Dein Immobilien-Check in 60 Sekunden</h1>
        <p class="lead">
          Wähle einen Grundriss, gib dein Bruttojahreseinkommen ein und erhalte sofort eine
          transparente ${projectionYears}-Jahres-Prognose für dein mögliches Vermögen.
        </p>
        <div class="hero-actions">
          <a
            class="btn btn-secondary btn-link"
            href="${MAPS_URL}"
            target="_blank"
            rel="noreferrer noopener"
          >
            Lage auf Google Maps
          </a>
          <button id="copy-scenario-link" class="btn btn-primary" type="button">Szenario-Link kopieren</button>
        </div>
        <p id="share-status" class="share-status" role="status" aria-live="polite"></p>
      </div>
    </section>

    <section class="workspace">
      <section class="panel choose-panel">
        <h2>1. Wähle deine Wohnungsoption</h2>
        <div id="apartment-options" class="apartment-options"></div>

        <div class="income-block">
          <h2>2. Dein Bruttojahreseinkommen</h2>
          <div class="income-row">
            <label class="field field-income-compact" for="annual-gross-income">
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

            <fieldset class="field field-tax-mode">
              <legend>Steuertarif</legend>
              <div class="tax-mode-switch" role="radiogroup" aria-label="Steuertarif wählen">
                <label class="tax-mode-option" for="tax-mode-grund">
                  <input id="tax-mode-grund" type="radio" name="tax-table-mode" value="grund" />
                  <span>Grundtabelle</span>
                </label>
                <label class="tax-mode-option" for="tax-mode-splitting">
                  <input id="tax-mode-splitting" type="radio" name="tax-table-mode" value="splitting" />
                  <span>Splitting</span>
                </label>
              </div>
            </fieldset>
          </div>

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
      </section>

      <section class="panel result-panel" aria-live="polite">
        <p class="eyebrow">3. Prognose</p>
        <h2 id="result-headline">Dein mögliches Vermögen nach ${projectionYears} Jahren</h2>
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
          <div class="liquidity-head">
            <p class="assumption-label">Monatliche Liquidität über ${projectionYears} Jahre</p>
            <div class="liquidity-head-actions">
              <button
                id="liquidity-view-toggle"
                class="liquidity-view-toggle"
                type="button"
                aria-label="Zur nächsten Liquiditätsansicht wechseln"
              >
                <span id="liquidity-mode" class="liquidity-mode">Tabelle</span>
              </button>
            </div>
          </div>
          <div id="liquidity-view-content" class="liquidity-view-content"></div>
        </div>

        <div class="progress-wrap">
          <div class="progress-meta">
            <p>Vermögensentwicklung über ${projectionYears} Jahre</p>
            <p id="out-path-end">-</p>
          </div>
          <div id="wealth-path" class="wealth-path"></div>
        </div>

        <div class="assumption-grid">
          <article>
            <p class="assumption-label">Eigenkapital für Nebenkosten</p>
            <p id="out-start-equity">-</p>
          </article>
          <article>
            <p class="assumption-label">Gesamtinvestition inkl. Nebenkosten</p>
            <p id="out-total-investment">-</p>
          </article>
          <article>
            <p id="out-tax-label" class="assumption-label">Steuer laut Grundtabelle</p>
            <p id="out-tax-rate">-</p>
          </article>
          <article>
            <p class="assumption-label">Restschuld bei Refinanzierung (Ende Jahr 12)</p>
            <p id="out-refinance-debt">-</p>
          </article>
        </div>
      </section>
    </section>

    <section class="panel contact-panel" aria-labelledby="contact-title">
      <h2 id="contact-title">Ich bin interessiert!</h2>
      <p class="lead">
        Mit einem Klick können Sie direkt per E-Mail um Rückruf bitten, sofort telefonisch
        Kontakt aufnehmen oder direkt einen Termin buchen.
      </p>
      <div class="contact-actions">
        <a
          id="consultation-mail-link"
          class="btn btn-primary btn-link"
          href="mailto:${CONSULTATION_EMAIL}"
          aria-label="Beratungsgespräch per E-Mail anfordern"
        >
          Beratung per Mail anfordern
        </a>
        <a
          class="btn btn-secondary btn-link"
          href="tel:+4915119690871"
          aria-label="Jetzt anrufen unter 0151 19690871"
        >
          Direkt anrufen: 0151/19690871
        </a>
        <a
          class="btn btn-secondary btn-link"
          href="https://mlp-onlineberatung.flexperto.com/expert?id=782"
          target="_blank"
          rel="noreferrer noopener"
          aria-label="Direkte Terminbuchung in neuem Tab Öffnen"
        >
          Direkte Terminbuchung
        </a>
      </div>
      <p class="small-note">
        Wenn Sie Unterstützung bei den Eingaben wünschen, rufen Sie gern an oder senden Sie
        eine kurze E-Mail.
      </p>
    </section>

    <section class="panel facts-panel">
      <h2>Ein paar schnelle Fakten über Münster.</h2>
      <p class="lead">
        Diese Kennzahlen zeigen vor allem eines: Münster verbindet knappen Wohnraum, hohe Nachfrage
        nach kompakten Apartments und eine Lage mit kurzen Wegen in die
        Innenstadt.
      </p>
      <div class="facts-grid">
        <article class="fact-card">
          <p class="fact-number">30.000</p>
          <p class="fact-title">zusätzliche Wohnungen bis 2040</p>
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
          <p class="fact-copy">Ca. 6,5 km bis Domplatz per Rad oder Auto laut Broschüre.</p>
          <p class="fact-copy">Ein Ort, der Investment und Lebensqualität zusammenbringt.</p>
        </article>
      </div>
    </section>
  </main>

  <div id="liquidity-modal" class="liquidity-modal" aria-hidden="true">
    <div class="liquidity-modal-backdrop" data-liquidity-modal-close="true"></div>
    <section
      class="liquidity-modal-panel"
      role="dialog"
      aria-modal="true"
      aria-labelledby="liquidity-modal-title"
    >
      <header class="liquidity-modal-head">
        <div>
          <p class="eyebrow">Detailansicht</p>
          <h3 id="liquidity-modal-title">Jährliche Einnahmen und Ausgaben</h3>
        </div>
        <div class="liquidity-modal-actions">
          <button
            id="liquidity-modal-cycle"
            type="button"
            class="liquidity-inline-toggle"
            aria-label="Zur nächsten Grafikansicht wechseln"
          >
            Zur Grafik
          </button>
          <button
            id="liquidity-modal-close"
            type="button"
            class="liquidity-view-nav"
            aria-label="Detailansicht schließen"
          >
            ×
          </button>
        </div>
      </header>
      <div id="liquidity-modal-content" class="liquidity-modal-content"></div>
    </section>
  </div>
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
const taxTableInputs = Array.from(
  document.querySelectorAll<HTMLInputElement>('input[name="tax-table-mode"]'),
)
const growthInput = getElementById<HTMLInputElement>('growth-rate')
const equityInput = getElementById<HTMLInputElement>('equity-amount')
const shareStatus = getElementById<HTMLElement>('share-status')
const configForm = getElementById<HTMLFormElement>('config-form')
const configStatus = getElementById<HTMLElement>('config-status')
const liquidityModeLabel = getElementById<HTMLElement>('liquidity-mode')
const liquidityViewToggleButton = getElementById<HTMLButtonElement>('liquidity-view-toggle')
const liquidityViewContent = getElementById<HTMLDivElement>('liquidity-view-content')
const applyConfigButton = getElementById<HTMLButtonElement>('apply-config')
const resetConfigButton = getElementById<HTMLButtonElement>('reset-config')
const copyConfigButton = getElementById<HTMLButtonElement>('copy-config')
const copyScenarioButton = getElementById<HTMLButtonElement>('copy-scenario-link')
const consultationMailLink = getElementById<HTMLAnchorElement>('consultation-mail-link')
const heroSlideshow = getElementById<HTMLDivElement>('hero-slideshow')
const heroSlideImage = getElementById<HTMLImageElement>('hero-slide-image')
const heroSlideCaption = getElementById<HTMLElement>('hero-slide-caption')
const heroSlidePrevButton = getElementById<HTMLButtonElement>('hero-slide-prev')
const heroSlideNextButton = getElementById<HTMLButtonElement>('hero-slide-next')
const liquidityModal = getElementById<HTMLDivElement>('liquidity-modal')
const liquidityModalContent = getElementById<HTMLDivElement>('liquidity-modal-content')
const liquidityModalCloseButton = getElementById<HTMLButtonElement>('liquidity-modal-close')
const liquidityModalCycleButton = getElementById<HTMLButtonElement>('liquidity-modal-cycle')

let selectedApartmentId: ApartmentId = config.defaultApartmentId
let selectedTaxTableMode: TaxTableMode = 'grund'
let annualGrossIncome = config.defaultAnnualGrossIncome
let annualGrowthRatePercent = assumptions.annualGrowthRate * 100
let investedEquity = getDefaultEquityForApartment(selectedApartmentId)
let liquidityViewMode: LiquidityViewMode = 'afterTaxChart'
let heroSlideIndex = 0
let heroSlideIntervalId: number | null = null
let latestProjectionResult: ProjectionResult | null = null
let isLiquidityModalOpen = false

hydrateStateFromUrl()
renderApartmentCards()
renderTaxTableSelection()
writeInputValue(annualGrossIncome)
writeGrowthInputValue(annualGrowthRatePercent)
writeEquityInputValue(investedEquity)
renderHeroSlide()
startHeroAutoplay()
if (hasStoredConfig()) {
  setConfigStatus('Lokale Konfigurationsänderungen sind aktiv.')
}
renderProjection()

incomeInput.addEventListener('input', () => {
  annualGrossIncome = clamp(
    parseNumber(incomeInput.value, annualGrossIncome),
    config.incomeBounds.min,
    config.incomeBounds.max,
  )
  renderProjection()
})

taxTableInputs.forEach((input) => {
  input.addEventListener('change', () => {
    if (!isTaxTableMode(input.value)) {
      return
    }
    selectedTaxTableMode = input.value
    renderTaxTableSelection()
    renderProjection()
  })
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

copyScenarioButton.addEventListener('click', async () => {
  const scenarioUrl = buildScenarioUrl(
    selectedApartmentId,
    selectedTaxTableMode,
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

heroSlidePrevButton.addEventListener('click', () => {
  shiftHeroSlide(-1)
  restartHeroAutoplay()
})

heroSlideNextButton.addEventListener('click', () => {
  shiftHeroSlide(1)
  restartHeroAutoplay()
})

heroSlideshow.addEventListener('mouseenter', stopHeroAutoplay)
heroSlideshow.addEventListener('mouseleave', startHeroAutoplay)
heroSlideshow.addEventListener('focusin', stopHeroAutoplay)
heroSlideshow.addEventListener('focusout', startHeroAutoplay)

liquidityModalCloseButton.addEventListener('click', () => {
  dismissLiquidityTableModal()
})

liquidityModalCycleButton.addEventListener('click', () => {
  cycleLiquidityView()
})

liquidityModal.addEventListener('click', (event) => {
  const target = event.target
  if (!(target instanceof HTMLElement)) {
    return
  }
  const closeTrigger = target.closest<HTMLElement>('[data-liquidity-modal-close="true"]')
  if (!closeTrigger) {
    return
  }
  dismissLiquidityTableModal()
})

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape' || !isLiquidityModalOpen) {
    return
  }
  dismissLiquidityTableModal()
})

liquidityViewToggleButton.addEventListener('click', () => {
  cycleLiquidityView()
})

liquidityViewContent.addEventListener('click', (event) => {
  const target = event.target
  if (!(target instanceof HTMLElement)) {
    return
  }
  const trigger = target.closest<HTMLElement>('[data-liquidity-cycle="true"]')
  if (!trigger) {
    return
  }
  cycleLiquidityView()
})

applyConfigButton.addEventListener('click', () => {
  try {
    const validConfig = buildConfigFromForm(configForm)
    saveStoredConfig(validConfig)
    setConfigStatus('Konfiguration gespeichert. Seite wird neu geladen.')
    window.setTimeout(() => window.location.reload(), 250)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unbekannter Fehler'
    setConfigStatus(`Konfiguration konnte nicht gespeichert werden: ${message}`, true)
  }
})

resetConfigButton.addEventListener('click', () => {
  clearStoredConfig()
  setConfigStatus('Lokale Konfiguration entfernt. Seite wird neu geladen.')
  window.setTimeout(() => window.location.reload(), 250)
})

copyConfigButton.addEventListener('click', async () => {
  try {
    const nextConfig = buildConfigFromForm(configForm)
    const copied = await copyToClipboard(serializeConfig(nextConfig))
    setConfigStatus(
      copied
        ? 'Konfigurations-Backup wurde als JSON kopiert.'
        : 'Backup konnte nicht automatisch kopiert werden.',
      !copied,
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unbekannter Fehler'
    setConfigStatus(`Konfiguration ist noch nicht gültig: ${message}`, true)
  }
})

function renderApartmentCards(): void {
  apartmentContainer.innerHTML = apartments
    .map((apartment) => {
      const activeClass = apartment.id === selectedApartmentId ? ' apartment-card-active' : ''
      const apartmentHint = `
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
            <img src="${resolvePublicAssetPath(apartment.image)}" alt="Grundriss ${apartment.label}" />
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
  const result = calculateProjection(
    apartment,
    annualGrossIncome,
    annualGrowthRate,
    investedEquity,
    selectedTaxTableMode,
  )
  latestProjectionResult = result

  setText('result-headline', `Dein mögliches Vermögen nach ${projectionYears} Jahren mit ${apartment.label}`)
  setText('out-wealth20', formatCurrency(result.wealth20))
  setText(
    'out-wealth-gain',
    `Vermögenszuwachs ggü. Startkapital: ${formatSignedCurrency(result.wealthGain20)}`,
  )
  setText('out-object-value', formatCurrency(result.projectedValue20))
  setText('out-cashflow20', formatSignedCurrency(result.cumulativeCashflow20))
  setText('out-growth-rate', `${formatSignedPercent(result.annualGrowthRate * 100)} % pro Jahr`)
  setText('out-equity-amount', formatCurrency(result.startEquity))
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
  setText('out-tax-label', `Steuer laut ${getTaxTableLabel(result.taxTableMode)}`)
  setText('out-refinance-debt', formatCurrency(result.refinanceDebtBase))
  updateConsultationMailLink(result)

  renderLiquidityView(result)
  renderWealthPath(result.yearlyWealthPath)
  syncUrlState()
}

function calculateProjection(
  apartment: ApartmentOption,
  grossAnnualIncome: number,
  annualGrowthRate: number,
  selectedEquity: number,
  taxTableMode: TaxTableMode,
): ProjectionResult {
  const annualBaseRent = apartment.size * assumptions.rentPerSqm * 12
  const annualManagementCostsFull = assumptions.monthlyManagementFlat * 12
  const annualMaintenanceCostsFull = assumptions.monthlyMaintenanceFlat * 12
  const taxableIncome = grossAnnualIncome * 0.8
  const annualTax = calculateAnnualIncomeTax(taxableIncome, taxTableMode)
  const marginalTaxRate = calculateMarginalTaxRate(taxableIncome, taxTableMode)

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
  const afaPhaseOneEndYear = getProjectionYearForAfaYear(getAfaPhaseOneEndYear())
  const afaEndYear = getAfaEndYear()
  const afaProjectionEndYear = getProjectionYearForAfaYear(afaEndYear)
  const constructionInterestLoad =
    (kfwLoan * 0.5) * assumptions.kfwInterestRate + (bankLoan * 0.5) * assumptions.bankInterestRate
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
    const calendarYear = getCalendarYearForProjectionYear(year)
    const rentShare = getRentShareForProjectionYear(year)
    const constructionShare = 1 - rentShare
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
      const constructionBankInterest =
        (bankLoan * 0.5) * assumptions.bankInterestRate * constructionShare

      kfwInterest = constructionKfwInterest + normalKfwInterest * rentShare
      kfwPrincipal = normalKfwPrincipal * rentShare
      bankInterest = constructionBankInterest + normalBankInterest * rentShare
      bankPrincipal = normalBankPrincipal * rentShare

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

    const fullYearGrossRent = annualBaseRent * Math.pow(1 + annualGrowthRate, year - 1)
    const yearlyGrossRent = fullYearGrossRent * rentShare
    const yearlyVacancyCosts = yearlyGrossRent * assumptions.vacancyRate
    const yearlyOperatingCosts =
      yearlyVacancyCosts +
      annualManagementCostsFull * rentShare +
      annualMaintenanceCostsFull * rentShare
    const yearlyNetBeforeDebt = yearlyGrossRent - yearlyOperatingCosts

    const yearlyAfaRate = getAfaFactorForProjectionYear(year)
    const yearlyTaxBenefit =
      apartment.purchasePrice * assumptions.monumentShare * yearlyAfaRate * marginalTaxRate
    const yearlyCashflow = yearlyNetBeforeDebt - yearlyDebtService + yearlyTaxBenefit

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
    yearlyLiquidityRows.push({
      year,
      calendarYear,
      propertyValue: yearlyValue,
      grossRent: yearlyGrossRent,
      vacancyCost: yearlyVacancyCosts,
      managementCost: annualManagementCostsFull * rentShare,
      maintenanceCost: annualMaintenanceCostsFull * rentShare,
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
    annualBaseRent * assumptions.vacancyRate + annualManagementCostsFull + annualMaintenanceCostsFull
  const netYieldBeforeDebt = ((annualBaseRent - yearOneOperatingCosts) / apartment.purchasePrice) * 100
  const afaPhaseOneMonthlyLiquidity =
    afaPhaseOneYears > 0 ? afaPhaseOneCashflow / (afaPhaseOneYears * 12) : 0
  const afaPhaseTwoMonthlyLiquidity =
    afaPhaseTwoYears > 0 ? afaPhaseTwoCashflow / (afaPhaseTwoYears * 12) : 0
  const postAfaMonthlyLiquidity = postAfaYears > 0 ? postAfaCashflow / (postAfaYears * 12) : 0

  return {
    apartment,
    taxTableMode,
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

function renderLiquidityView(result: ProjectionResult): void {
  liquidityModeLabel.textContent = getLiquidityToggleLabel(liquidityViewMode)
  const nextView = getNextLiquidityView(liquidityViewMode)
  liquidityViewToggleButton.title = `Nächste Ansicht: ${getLiquidityViewLabel(nextView)}`
  liquidityViewToggleButton.setAttribute('aria-label', `Nächste Ansicht: ${getLiquidityViewLabel(nextView)}`)
  const basis = liquidityViewMode === 'afterTaxChart' ? 'afterTax' : 'beforeTax'
  liquidityViewContent.innerHTML = renderLiquidityChart(result, basis)
}

function renderLiquidityChart(
  result: ProjectionResult,
  basis: 'afterTax' | 'beforeTax',
): string {
  const chartRows = result.yearlyLiquidityRows.map((row) => ({
    calendarYear: row.calendarYear,
    monthlyValue:
      basis === 'afterTax' ? row.cashflow / 12 : (row.cashflow - row.taxBenefit) / 12,
  }))
  const values = chartRows.map((row) => row.monthlyValue)
  const maxAbs = Math.max(...values.map((value) => Math.abs(value)), 1)
  const maxValue = Math.max(...values, 0)
  const minValue = Math.min(...values, 0)
  const modeLabel = basis === 'afterTax' ? 'Nach Steuern' : 'Vor Steuern'

  return `
    <button
      class="liquidity-chart-card"
      type="button"
      data-liquidity-cycle="true"
      aria-label="Liquiditätsansicht weiterschalten"
    >
      <div class="liquidity-chart-meta">
        <div>
          <p class="liquidity-chart-title">${modeLabel}</p>
          <p class="liquidity-chart-copy">Klick auf das Diagramm für die nächste Ansicht</p>
        </div>
        <p class="liquidity-chart-range">${formatSignedCurrency(minValue)} bis ${formatSignedCurrency(maxValue)} / Monat</p>
      </div>
      <div class="liquidity-chart" style="--year-count: ${values.length}">
        <div class="liquidity-scale">
          <span>${formatCurrency(maxAbs)}</span>
          <span>0 €</span>
          <span>-${formatCurrency(maxAbs).replace('-', '')}</span>
        </div>
        <div class="liquidity-chart-plot">
          ${chartRows
            .map((row) => {
              const height = row.monthlyValue === 0 ? 0 : Math.max((Math.abs(row.monthlyValue) / maxAbs) * 46, 2)
              const toneClass = row.monthlyValue >= 0 ? 'liquidity-bar-positive' : 'liquidity-bar-negative'
              const yearLabel = String(row.calendarYear).slice(-2)
              return `
                <div class="liquidity-year" title="${row.calendarYear}: ${formatSignedCurrency(row.monthlyValue)} / Monat">
                  <div class="liquidity-year-plot">
                    <span class="liquidity-bar ${toneClass}" style="--bar-size: ${height.toFixed(2)}%"></span>
                  </div>
                  <span class="liquidity-year-label">${yearLabel}</span>
                </div>
              `
            })
            .join('')}
        </div>
      </div>
    </button>
  `
}

function renderLiquidityTable(result: ProjectionResult): string {
  const startYear = result.yearlyLiquidityRows[0]?.calendarYear ?? assumptions.purchaseYear
  const endYear =
    result.yearlyLiquidityRows[result.yearlyLiquidityRows.length - 1]?.calendarYear ??
    assumptions.purchaseYear + projectionYears - 1
  let cumulativeAfterTax = 0

  const rows = result.yearlyLiquidityRows
    .map((row) => {
      const totalInterest = row.kfwInterest + row.bankInterest + row.refinanceInterest
      const totalPrincipal = row.kfwPrincipal + row.bankPrincipal + row.refinancePrincipal
      const totalAncillaryCost = row.vacancyCost + row.managementCost + row.maintenanceCost
      const liquidityBeforeTax = row.cashflow - row.taxBenefit
      const liquidityAfterTax = row.cashflow
      cumulativeAfterTax += liquidityAfterTax

      return `
        <tr>
          <td>${row.calendarYear}</td>
          <td class="${getToneClass(row.grossRent)}">${formatSignedCurrency(row.grossRent)}</td>
          <td class="${getToneClass(-totalInterest)}">${formatSignedCurrency(-totalInterest)}</td>
          <td class="${getToneClass(-totalPrincipal)}">${formatSignedCurrency(-totalPrincipal)}</td>
          <td class="${getToneClass(-totalAncillaryCost)}">${formatSignedCurrency(-totalAncillaryCost)}</td>
          <td class="${getToneClass(row.taxBenefit)}">${formatSignedCurrency(row.taxBenefit)}</td>
          <td class="${getToneClass(liquidityBeforeTax)}">${formatSignedCurrency(liquidityBeforeTax)}</td>
          <td class="${getToneClass(liquidityAfterTax)}">${formatSignedCurrency(liquidityAfterTax)}</td>
          <td class="${getToneClass(cumulativeAfterTax)}">${formatSignedCurrency(cumulativeAfterTax)}</td>
        </tr>
      `
    })
    .join('')

  return `
    <div class="liquidity-table-card liquidity-table-card-modal">
      <div class="liquidity-table-head">
        <div>
          <p class="liquidity-chart-title">Jährliche Liquiditätsdetails</p>
          <p class="liquidity-chart-copy">${startYear} bis ${endYear} mit allen Jahreswerten.</p>
        </div>
      </div>
      <div class="liquidity-table-scroll liquidity-table-scroll-modal">
        <table class="liquidity-detail-table" aria-label="Jährliche Einnahmen Ausgaben Details">
          <thead>
            <tr>
              <th>Jahr</th>
              <th>Miete</th>
              <th>Zins</th>
              <th>Tilgung</th>
              <th>Nebenkosten</th>
              <th>Steuer</th>
              <th>Liqui v. St.</th>
              <th>Liqui n. St.</th>
              <th>Kumuliert</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </div>
  `
}

function openLiquidityModal(result: ProjectionResult): void {
  liquidityModalContent.innerHTML = renderLiquidityTable(result)
  liquidityModalCycleButton.textContent = getLiquidityToggleLabel('table')
  liquidityModalCycleButton.setAttribute('aria-label', 'Zur nächsten Liquiditätsansicht wechseln')

  if (isLiquidityModalOpen) {
    return
  }

  liquidityModal.classList.add('liquidity-modal-open')
  liquidityModal.setAttribute('aria-hidden', 'false')
  document.body.classList.add('body-modal-open')
  isLiquidityModalOpen = true
}

function closeLiquidityModal(): void {
  if (!isLiquidityModalOpen) {
    return
  }

  liquidityModal.classList.remove('liquidity-modal-open')
  liquidityModal.setAttribute('aria-hidden', 'true')
  document.body.classList.remove('body-modal-open')
  isLiquidityModalOpen = false
}

function advanceLiquidityView(): void {
  liquidityViewMode = getNextLiquidityView(liquidityViewMode)
}

function cycleLiquidityView(): void {
  advanceLiquidityView()
  renderProjection()

  if (liquidityViewMode !== 'table') {
    closeLiquidityModal()
    return
  }

  if (!latestProjectionResult) {
    return
  }

  openLiquidityModal(latestProjectionResult)
}

function dismissLiquidityTableModal(): void {
  closeLiquidityModal()

  if (liquidityViewMode !== 'table') {
    return
  }

  liquidityViewMode = 'beforeTaxChart'
  renderProjection()
}

function getNextLiquidityView(viewMode: LiquidityViewMode): LiquidityViewMode {
  if (viewMode === 'afterTaxChart') {
    return 'beforeTaxChart'
  }
  if (viewMode === 'beforeTaxChart') {
    return 'table'
  }
  return 'afterTaxChart'
}

function getLiquidityViewLabel(viewMode: LiquidityViewMode): string {
  if (viewMode === 'afterTaxChart') {
    return 'Nach Steuern'
  }
  if (viewMode === 'beforeTaxChart') {
    return 'Vor Steuern'
  }
  return 'Tabelle'
}

function getLiquidityToggleLabel(viewMode: LiquidityViewMode): string {
  if (viewMode === 'afterTaxChart') {
    return 'Vor Steuern'
  }
  if (viewMode === 'beforeTaxChart') {
    return 'Tabelle'
  }
  return 'Nach Steuern'
}

function syncUrlState(): void {
  const params = new URLSearchParams()
  if (selectedApartmentId !== config.defaultApartmentId) {
    params.set('apartment', selectedApartmentId)
  }
  if (selectedTaxTableMode !== 'grund') {
    params.set('tax', selectedTaxTableMode)
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
  const tax = params.get('tax')
  if (tax && isTaxTableMode(tax)) {
    selectedTaxTableMode = tax
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
  taxTableMode: TaxTableMode,
  grossAnnualIncomeValue: number,
  growthRatePercent: number,
  equityAmount: number,
): string {
  const params = new URLSearchParams()
  params.set('apartment', apartmentId)
  params.set('tax', taxTableMode)
  params.set('gross', String(Math.round(grossAnnualIncomeValue)))
  params.set('growth', String(growthRatePercent))
  params.set('equity', String(Math.round(equityAmount)))
  return `${window.location.origin}${window.location.pathname}?${params.toString()}`
}

function updateConsultationMailLink(result: ProjectionResult): void {
  const scenarioUrl = buildScenarioUrl(
    selectedApartmentId,
    selectedTaxTableMode,
    annualGrossIncome,
    annualGrowthRatePercent,
    investedEquity,
  )
  const subject = 'Beratung zum Immobilieninvestment York Living'
  const bodyLines = [
    'Guten Tag Herr Peters,',
    '',
    'bitte kontaktieren Sie mich zeitnah, um ein Beratungsgespräch zum Immobilieninvestment York Living zu vereinbaren.',
    '',
    'Meine aktuelle Berechnung:',
    `- Wohnungsoption: ${result.apartment.label} (${result.apartment.subtitle})`,
    `- Steuertarif: ${getTaxTableLabel(result.taxTableMode)}`,
    `- Bruttojahreseinkommen: ${formatCurrency(result.annualGrossIncome)}`,
    `- Wertentwicklung p.a.: ${formatSignedPercent(result.annualGrowthRate * 100)} %`,
    `- Eingesetztes Eigenkapital: ${formatCurrency(result.startEquity)}`,
    '',
    `Szenario-Link: ${scenarioUrl}`,
  ]
  const params = new URLSearchParams({
    subject,
    body: bodyLines.join('\n'),
  })
  consultationMailLink.href = `mailto:${CONSULTATION_EMAIL}?${params.toString()}`
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

function renderTaxTableSelection(): void {
  taxTableInputs.forEach((input) => {
    input.checked = input.value === selectedTaxTableMode
  })
}

function renderHeroSlide(): void {
  const slide = heroSlides[heroSlideIndex]
  heroSlideImage.src = resolvePublicAssetPath(slide.image)
  heroSlideImage.alt = slide.alt
  heroSlideCaption.textContent = slide.caption
}

function shiftHeroSlide(step: number): void {
  const slideCount = heroSlides.length
  if (slideCount === 0) {
    return
  }
  heroSlideIndex = (heroSlideIndex + step + slideCount) % slideCount
  renderHeroSlide()
}

function startHeroAutoplay(): void {
  if (heroSlideIntervalId !== null || heroSlides.length < 2) {
    return
  }
  heroSlideIntervalId = window.setInterval(() => {
    shiftHeroSlide(1)
  }, 6000)
}

function stopHeroAutoplay(): void {
  if (heroSlideIntervalId === null) {
    return
  }
  window.clearInterval(heroSlideIntervalId)
  heroSlideIntervalId = null
}

function restartHeroAutoplay(): void {
  stopHeroAutoplay()
  startHeroAutoplay()
}

function getApartment(apartmentId: ApartmentId): ApartmentOption {
  const apartment = apartments.find((entry) => entry.id === apartmentId)
  if (!apartment) {
    throw new Error(`Apartment "${apartmentId}" not found.`)
  }
  return apartment
}

function getAfaFactorForProjectionYear(year: number): number {
  const calendarYear = getCalendarYearForProjectionYear(year)
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

  const startYearShare = calendarYear === assumptions.afaStartYear ? (5 - assumptions.afaStartQuarter) / 4 : 1
  return match.rate * startYearShare
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

function calculateAnnualIncomeTax(taxableIncome: number, taxTableMode: TaxTableMode): number {
  const zve = Math.max(taxableIncome, 0)
  if (taxTableMode === 'splitting') {
    return 2 * calculateGrundtabelleTax(zve / 2)
  }
  return calculateGrundtabelleTax(zve)
}

function calculateMarginalTaxRate(taxableIncome: number, taxTableMode: TaxTableMode): number {
  const base = Math.max(taxableIncome, 0)
  const delta = 1
  const taxBase = calculateAnnualIncomeTax(base, taxTableMode)
  const taxUp = calculateAnnualIncomeTax(base + delta, taxTableMode)
  return Math.max((taxUp - taxBase) / delta, 0)
}

function getTaxTableLabel(mode: TaxTableMode): string {
  return mode === 'splitting' ? 'Splittingtabelle' : 'Grundtabelle'
}

function getDefaultEquityForApartment(apartmentId: ApartmentId): number {
  const apartment = getApartment(apartmentId)
  const ancillaryCosts = apartment.purchasePrice * assumptions.ancillaryCostRate
  return clamp(ancillaryCosts, equityBounds.min, equityBounds.max)
}

function getCalendarYearForProjectionYear(year: number): number {
  return assumptions.purchaseYear + year - 1
}

function getProjectionYearForAfaYear(afaYear: number): number {
  return assumptions.afaStartYear - assumptions.purchaseYear + afaYear
}

function getRentShareForProjectionYear(year: number): number {
  const calendarYear = getCalendarYearForProjectionYear(year)
  if (calendarYear < assumptions.rentStartYear) {
    return 0
  }
  if (calendarYear > assumptions.rentStartYear) {
    return 1
  }
  return (5 - assumptions.rentStartQuarter) / 4
}

function buildConfigSections(): ConfigSection[] {
  return [
    {
      title: 'Finanzierung',
      copy: 'KfW, Bankdarlehen und Tilgungslogik.',
      open: true,
      fields: [
        {
          type: 'number',
          id: 'config-kfw-loan-amount',
          label: 'KfW-Darlehen',
          hint: 'Förderdarlehen für das Objekt.',
          mode: 'currency',
          min: 0,
          step: 500,
          get: (value) => value.assumptions.kfwLoanAmount,
          set: (value, next) => {
            value.assumptions.kfwLoanAmount = next
          },
        },
        {
          type: 'number',
          id: 'config-kfw-interest-rate',
          label: 'KfW-Zins',
          hint: 'Nominalzins für den KfW-Anteil.',
          mode: 'percent',
          min: 0,
          max: 15,
          step: 0.05,
          get: (value) => value.assumptions.kfwInterestRate,
          set: (value, next) => {
            value.assumptions.kfwInterestRate = next
          },
        },
        {
          type: 'number',
          id: 'config-kfw-repayment-rate',
          label: 'KfW-Tilgung',
          hint: 'Reguläre Tilgung nach der Karenz.',
          mode: 'percent',
          min: 0,
          max: 15,
          step: 0.05,
          get: (value) => value.assumptions.kfwRepaymentRate,
          set: (value, next) => {
            value.assumptions.kfwRepaymentRate = next
          },
        },
        {
          type: 'number',
          id: 'config-kfw-grace-years',
          label: 'Karenzjahre',
          hint: 'Jahre mit nur Zinszahlung im KfW-Teil.',
          mode: 'number',
          min: 0,
          max: 10,
          step: 1,
          get: (value) => value.assumptions.kfwGraceYears,
          set: (value, next) => {
            value.assumptions.kfwGraceYears = next
          },
        },
        {
          type: 'number',
          id: 'config-kfw-grant-amount',
          label: 'KfW-Zuschuss',
          hint: 'Tilgungszuschuss aus dem Programm.',
          mode: 'currency',
          min: 0,
          step: 500,
          get: (value) => value.assumptions.kfwGrantAmount,
          set: (value, next) => {
            value.assumptions.kfwGrantAmount = next
          },
        },
        {
          type: 'number',
          id: 'config-bank-interest-rate',
          label: 'Bankzins',
          hint: 'Nominalzins für den Bankanteil.',
          mode: 'percent',
          min: 0,
          max: 15,
          step: 0.05,
          get: (value) => value.assumptions.bankInterestRate,
          set: (value, next) => {
            value.assumptions.bankInterestRate = next
          },
        },
        {
          type: 'number',
          id: 'config-bank-repayment-rate',
          label: 'Banktilgung',
          hint: 'Jährliche Tilgung für das Bankdarlehen.',
          mode: 'percent',
          min: 0,
          max: 15,
          step: 0.05,
          get: (value) => value.assumptions.bankRepaymentRate,
          set: (value, next) => {
            value.assumptions.bankRepaymentRate = next
          },
        },
      ],
    },
    {
      title: 'Markt & Entwicklung',
      copy: 'Mietniveau, Wachstum und laufende Kosten.',
      open: true,
      fields: [
        {
          type: 'number',
          id: 'config-rent-per-sqm',
          label: 'Miete pro m²',
          hint: 'Monatliche Nettokaltmiete je Quadratmeter.',
          mode: 'currency',
          min: 0,
          max: 100,
          step: 0.05,
          get: (value) => value.assumptions.rentPerSqm,
          set: (value, next) => {
            value.assumptions.rentPerSqm = next
          },
        },
        {
          type: 'number',
          id: 'config-annual-growth-rate',
          label: 'Wertentwicklung',
          hint: 'Gemeinsame Entwicklung von Miete und Objektwert pro Jahr.',
          mode: 'percent',
          min: -10,
          max: 15,
          step: 0.1,
          get: (value) => value.assumptions.annualGrowthRate,
          set: (value, next) => {
            value.assumptions.annualGrowthRate = next
          },
        },
        {
          type: 'number',
          id: 'config-purchase-year',
          label: 'Kaufjahr',
          hint: 'Startjahr der Rechnung und des Investments.',
          mode: 'number',
          min: 2020,
          max: 2040,
          step: 1,
          get: (value) => value.assumptions.purchaseYear,
          set: (value, next) => {
            value.assumptions.purchaseYear = next
          },
        },
        {
          type: 'number',
          id: 'config-rent-start-year',
          label: 'Mietstart Jahr',
          hint: 'Erstes Kalenderjahr mit Vermietung.',
          mode: 'number',
          min: 2020,
          max: 2045,
          step: 1,
          get: (value) => value.assumptions.rentStartYear,
          set: (value, next) => {
            value.assumptions.rentStartYear = next
          },
        },
        {
          type: 'number',
          id: 'config-rent-start-quarter',
          label: 'Mietstart Quartal',
          hint: 'Quartal des Vermietungsstarts innerhalb des Startjahres.',
          mode: 'number',
          min: 1,
          max: 4,
          step: 1,
          get: (value) => value.assumptions.rentStartQuarter,
          set: (value, next) => {
            value.assumptions.rentStartQuarter = next
          },
        },
        {
          type: 'number',
          id: 'config-monument-share',
          label: 'Denkmalanteil',
          hint: 'Abschreibungsfähiger Anteil am Kaufpreis.',
          mode: 'percent',
          min: 0,
          max: 100,
          step: 1,
          get: (value) => value.assumptions.monumentShare,
          set: (value, next) => {
            value.assumptions.monumentShare = next
          },
        },
        {
          type: 'number',
          id: 'config-ancillary-cost-rate',
          label: 'Nebenkostenquote',
          hint: 'Zusatzkosten auf den Kaufpreis.',
          mode: 'percent',
          min: 0,
          max: 25,
          step: 0.1,
          get: (value) => value.assumptions.ancillaryCostRate,
          set: (value, next) => {
            value.assumptions.ancillaryCostRate = next
          },
        },
        {
          type: 'number',
          id: 'config-vacancy-rate',
          label: 'Leerstandsquote',
          hint: 'Sicherheitsabschlag für entgangene Miete.',
          mode: 'percent',
          min: 0,
          max: 20,
          step: 0.1,
          get: (value) => value.assumptions.vacancyRate,
          set: (value, next) => {
            value.assumptions.vacancyRate = next
          },
        },
        {
          type: 'number',
          id: 'config-monthly-management-flat',
          label: 'Verwaltung pauschal',
          hint: 'Projektweiter Monatswert in EUR.',
          mode: 'currency',
          min: 0,
          step: 5,
          get: (value) => value.assumptions.monthlyManagementFlat,
          set: (value, next) => {
            value.assumptions.monthlyManagementFlat = next
          },
        },
        {
          type: 'number',
          id: 'config-monthly-maintenance-flat',
          label: 'Rücklage pauschal',
          hint: 'Projektweiter Monatswert in EUR.',
          mode: 'currency',
          min: 0,
          step: 5,
          get: (value) => value.assumptions.monthlyMaintenanceFlat,
          set: (value, next) => {
            value.assumptions.monthlyMaintenanceFlat = next
          },
        },
      ],
    },
    {
      title: 'Wohnung A',
      copy: '1-Zimmer-Apartment aus der Broschüre.',
      open: false,
      fields: [
        {
          type: 'number',
          id: 'config-apartment-a-size',
          label: 'Größe',
          hint: 'Wohnfläche in m².',
          mode: 'number',
          min: 10,
          max: 120,
          step: 1,
          get: (value) => getConfigApartment(value, 'a').size,
          set: (value, next) => {
            getConfigApartment(value, 'a').size = next
          },
        },
        {
          type: 'number',
          id: 'config-apartment-a-purchase-price',
          label: 'Kaufpreis',
          hint: 'Investitionssumme vor Nebenkosten.',
          mode: 'currency',
          min: 0,
          step: 1000,
          get: (value) => getConfigApartment(value, 'a').purchasePrice,
          set: (value, next) => {
            getConfigApartment(value, 'a').purchasePrice = next
          },
        },
        {
          type: 'number',
          id: 'config-apartment-a-management',
          label: 'Verwaltung',
          hint: 'Wohnungsspezifische Kosten pro Monat.',
          mode: 'currency',
          min: 0,
          step: 5,
          get: (value) => getConfigApartment(value, 'a').monthlyManagement,
          set: (value, next) => {
            getConfigApartment(value, 'a').monthlyManagement = next
          },
        },
        {
          type: 'number',
          id: 'config-apartment-a-maintenance',
          label: 'Rücklage',
          hint: 'Wohnungsspezifische Instandhaltung pro Monat.',
          mode: 'currency',
          min: 0,
          step: 5,
          get: (value) => getConfigApartment(value, 'a').monthlyMaintenance,
          set: (value, next) => {
            getConfigApartment(value, 'a').monthlyMaintenance = next
          },
        },
        {
          type: 'number',
          id: 'config-apartment-a-other-cost',
          label: 'Weitere Kosten',
          hint: 'Sonstige Monatskosten für Wohnung A.',
          mode: 'currency',
          min: 0,
          step: 5,
          get: (value) => getConfigApartment(value, 'a').monthlyOtherCost,
          set: (value, next) => {
            getConfigApartment(value, 'a').monthlyOtherCost = next
          },
        },
      ],
    },
    {
      title: 'Wohnung B',
      copy: '2-Zimmer-Apartment aus der Broschüre.',
      open: false,
      fields: [
        {
          type: 'number',
          id: 'config-apartment-b-size',
          label: 'Größe',
          hint: 'Wohnfläche in m².',
          mode: 'number',
          min: 10,
          max: 120,
          step: 1,
          get: (value) => getConfigApartment(value, 'b').size,
          set: (value, next) => {
            getConfigApartment(value, 'b').size = next
          },
        },
        {
          type: 'number',
          id: 'config-apartment-b-purchase-price',
          label: 'Kaufpreis',
          hint: 'Investitionssumme vor Nebenkosten.',
          mode: 'currency',
          min: 0,
          step: 1000,
          get: (value) => getConfigApartment(value, 'b').purchasePrice,
          set: (value, next) => {
            getConfigApartment(value, 'b').purchasePrice = next
          },
        },
        {
          type: 'number',
          id: 'config-apartment-b-management',
          label: 'Verwaltung',
          hint: 'Wohnungsspezifische Kosten pro Monat.',
          mode: 'currency',
          min: 0,
          step: 5,
          get: (value) => getConfigApartment(value, 'b').monthlyManagement,
          set: (value, next) => {
            getConfigApartment(value, 'b').monthlyManagement = next
          },
        },
        {
          type: 'number',
          id: 'config-apartment-b-maintenance',
          label: 'Rücklage',
          hint: 'Wohnungsspezifische Instandhaltung pro Monat.',
          mode: 'currency',
          min: 0,
          step: 5,
          get: (value) => getConfigApartment(value, 'b').monthlyMaintenance,
          set: (value, next) => {
            getConfigApartment(value, 'b').monthlyMaintenance = next
          },
        },
        {
          type: 'number',
          id: 'config-apartment-b-other-cost',
          label: 'Weitere Kosten',
          hint: 'Sonstige Monatskosten für Wohnung B.',
          mode: 'currency',
          min: 0,
          step: 5,
          get: (value) => getConfigApartment(value, 'b').monthlyOtherCost,
          set: (value, next) => {
            getConfigApartment(value, 'b').monthlyOtherCost = next
          },
        },
      ],
    },
    {
      title: 'AfA & Steuer',
      copy: 'Abschreibung und Grenzsteuersätze für die Liquidität.',
      open: false,
      fields: [
        {
          type: 'number',
          id: 'config-projection-years',
          label: 'Projektionsjahre',
          hint: 'Laufzeit der Vermögensprojektion.',
          mode: 'number',
          min: 1,
          max: 40,
          step: 1,
          get: (value) => value.assumptions.years,
          set: (value, next) => {
            value.assumptions.years = next
          },
        },
        {
          type: 'number',
          id: 'config-afa-start-year',
          label: 'AfA Start Jahr',
          hint: 'Jahr des Abschlusses der begünstigten Baumaßnahme.',
          mode: 'number',
          min: 2020,
          max: 2045,
          step: 1,
          get: (value) => value.assumptions.afaStartYear,
          set: (value, next) => {
            value.assumptions.afaStartYear = next
          },
        },
        {
          type: 'number',
          id: 'config-afa-start-quarter',
          label: 'AfA Start Quartal',
          hint: 'Quartal, ab dem die Denkmal-AfA erstmals anläuft.',
          mode: 'number',
          min: 1,
          max: 4,
          step: 1,
          get: (value) => value.assumptions.afaStartQuarter,
          set: (value, next) => {
            value.assumptions.afaStartQuarter = next
          },
        },
        {
          type: 'number',
          id: 'config-afa-rate-1',
          label: 'AfA Satz Phase 1',
          hint: 'Abschreibung in den ersten Jahren.',
          mode: 'percent',
          min: 0,
          max: 20,
          step: 0.1,
          get: (value) => getConfigAfaEntry(value, 0).rate,
          set: (value, next) => {
            const entry = getConfigAfaEntry(value, 0)
            value.assumptions.afaSchedule[0] = { ...entry, rate: next }
          },
        },
        {
          type: 'number',
          id: 'config-afa-end-year-1',
          label: 'AfA Ende Phase 1',
          hint: 'Letztes Jahr der ersten Abschreibungsphase.',
          mode: 'number',
          min: 1,
          max: 30,
          step: 1,
          get: (value) => getConfigAfaEntry(value, 0).endYear,
          set: (value, next) => {
            const entry = getConfigAfaEntry(value, 0)
            value.assumptions.afaSchedule[0] = { ...entry, endYear: next }
          },
        },
        {
          type: 'number',
          id: 'config-afa-rate-2',
          label: 'AfA Satz Phase 2',
          hint: 'Abschreibung in der zweiten Phase.',
          mode: 'percent',
          min: 0,
          max: 20,
          step: 0.1,
          get: (value) => getConfigAfaEntry(value, 1).rate,
          set: (value, next) => {
            const entry = getConfigAfaEntry(value, 1)
            value.assumptions.afaSchedule[1] = { ...entry, rate: next }
          },
        },
        {
          type: 'number',
          id: 'config-afa-end-year-2',
          label: 'AfA Ende Phase 2',
          hint: 'Letztes Jahr der zweiten Abschreibungsphase.',
          mode: 'number',
          min: 1,
          max: 40,
          step: 1,
          get: (value) => getConfigAfaEntry(value, 1).endYear,
          set: (value, next) => {
            const entry = getConfigAfaEntry(value, 1)
            value.assumptions.afaSchedule[1] = { ...entry, endYear: next }
          },
        },
        {
          type: 'number',
          id: 'config-tax-limit-1',
          label: 'Steuergrenze 1',
          hint: 'Monatliches Brutto für Satz 1.',
          mode: 'currency',
          min: 0,
          step: 50,
          get: (value) => getConfigTaxBracket(value, 0).maxMonthlyIncome,
          set: (value, next) => {
            value.taxBrackets[0] = { ...getConfigTaxBracket(value, 0), maxMonthlyIncome: next }
          },
        },
        {
          type: 'number',
          id: 'config-tax-rate-1',
          label: 'Steuersatz 1',
          hint: 'Grenzsteuersatz für die erste Stufe.',
          mode: 'percent',
          min: 0,
          max: 60,
          step: 0.1,
          get: (value) => getConfigTaxBracket(value, 0).rate,
          set: (value, next) => {
            value.taxBrackets[0] = { ...getConfigTaxBracket(value, 0), rate: next }
          },
        },
        {
          type: 'number',
          id: 'config-tax-limit-2',
          label: 'Steuergrenze 2',
          hint: 'Monatliches Brutto für Satz 2.',
          mode: 'currency',
          min: 0,
          step: 50,
          get: (value) => getConfigTaxBracket(value, 1).maxMonthlyIncome,
          set: (value, next) => {
            value.taxBrackets[1] = { ...getConfigTaxBracket(value, 1), maxMonthlyIncome: next }
          },
        },
        {
          type: 'number',
          id: 'config-tax-rate-2',
          label: 'Steuersatz 2',
          hint: 'Grenzsteuersatz für die zweite Stufe.',
          mode: 'percent',
          min: 0,
          max: 60,
          step: 0.1,
          get: (value) => getConfigTaxBracket(value, 1).rate,
          set: (value, next) => {
            value.taxBrackets[1] = { ...getConfigTaxBracket(value, 1), rate: next }
          },
        },
        {
          type: 'number',
          id: 'config-tax-limit-3',
          label: 'Steuergrenze 3',
          hint: 'Monatliches Brutto für Satz 3.',
          mode: 'currency',
          min: 0,
          step: 50,
          get: (value) => getConfigTaxBracket(value, 2).maxMonthlyIncome,
          set: (value, next) => {
            value.taxBrackets[2] = { ...getConfigTaxBracket(value, 2), maxMonthlyIncome: next }
          },
        },
        {
          type: 'number',
          id: 'config-tax-rate-3',
          label: 'Steuersatz 3',
          hint: 'Grenzsteuersatz für die dritte Stufe.',
          mode: 'percent',
          min: 0,
          max: 60,
          step: 0.1,
          get: (value) => getConfigTaxBracket(value, 2).rate,
          set: (value, next) => {
            value.taxBrackets[2] = { ...getConfigTaxBracket(value, 2), rate: next }
          },
        },
        {
          type: 'number',
          id: 'config-tax-limit-4',
          label: 'Steuergrenze 4',
          hint: 'Monatliches Brutto für Satz 4.',
          mode: 'currency',
          min: 0,
          step: 50,
          get: (value) => getConfigTaxBracket(value, 3).maxMonthlyIncome,
          set: (value, next) => {
            value.taxBrackets[3] = { ...getConfigTaxBracket(value, 3), maxMonthlyIncome: next }
          },
        },
        {
          type: 'number',
          id: 'config-tax-rate-4',
          label: 'Steuersatz 4',
          hint: 'Grenzsteuersatz für die vierte Stufe.',
          mode: 'percent',
          min: 0,
          max: 60,
          step: 0.1,
          get: (value) => getConfigTaxBracket(value, 3).rate,
          set: (value, next) => {
            value.taxBrackets[3] = { ...getConfigTaxBracket(value, 3), rate: next }
          },
        },
        {
          type: 'number',
          id: 'config-tax-limit-5',
          label: 'Steuergrenze 5',
          hint: 'Monatliches Brutto für Satz 5.',
          mode: 'currency',
          min: 0,
          step: 50,
          get: (value) => getConfigTaxBracket(value, 4).maxMonthlyIncome,
          set: (value, next) => {
            value.taxBrackets[4] = { ...getConfigTaxBracket(value, 4), maxMonthlyIncome: next }
          },
        },
        {
          type: 'number',
          id: 'config-tax-rate-5',
          label: 'Steuersatz 5',
          hint: 'Grenzsteuersatz für die letzte Stufe.',
          mode: 'percent',
          min: 0,
          max: 60,
          step: 0.1,
          get: (value) => getConfigTaxBracket(value, 4).rate,
          set: (value, next) => {
            value.taxBrackets[4] = { ...getConfigTaxBracket(value, 4), rate: next }
          },
        },
      ],
    },
    {
      title: 'Standards & Grenzen',
      copy: 'Vorgaben für den Rechner und die UI-Schieberegler.',
      open: false,
      fields: [
        {
          type: 'select',
          id: 'config-default-apartment',
          label: 'Startwohnung',
          hint: 'Welche Wohnung zuerst ausgewählt sein soll.',
          options: (value) =>
            value.apartments.map((entry) => ({
              value: entry.id,
              label: entry.label,
            })),
          get: (value) => value.defaultApartmentId,
          set: (value, next) => {
            if (!isApartmentId(next)) {
              throw new Error('Startwohnung ist ungültig.')
            }
            value.defaultApartmentId = next
          },
        },
        {
          type: 'number',
          id: 'config-default-income',
          label: 'Standard-Einkommen',
          hint: 'Ausgangswert beim ersten Laden der Seite.',
          mode: 'currency',
          min: 0,
          step: 1000,
          get: (value) => value.defaultAnnualGrossIncome,
          set: (value, next) => {
            value.defaultAnnualGrossIncome = next
          },
        },
        {
          type: 'number',
          id: 'config-income-min',
          label: 'Einkommen Minimum',
          hint: 'Untergrenze für das Eingabefeld.',
          mode: 'currency',
          min: 0,
          step: 100,
          get: (value) => value.incomeBounds.min,
          set: (value, next) => {
            value.incomeBounds.min = next
          },
        },
        {
          type: 'number',
          id: 'config-income-max',
          label: 'Einkommen Maximum',
          hint: 'Obergrenze für das Eingabefeld.',
          mode: 'currency',
          min: 1000,
          step: 100,
          get: (value) => value.incomeBounds.max,
          set: (value, next) => {
            value.incomeBounds.max = next
          },
        },
        {
          type: 'number',
          id: 'config-income-step',
          label: 'Einkommen Schritt',
          hint: 'Schrittweite im Eingabefeld.',
          mode: 'currency',
          min: 1,
          step: 1,
          get: (value) => value.incomeBounds.step,
          set: (value, next) => {
            value.incomeBounds.step = next
          },
        },
        {
          type: 'number',
          id: 'config-income-months-factor',
          label: 'EK-Monatsfaktor',
          hint: 'Ableitung des Standard-Eigenkapitals aus dem Einkommen.',
          mode: 'number',
          min: 0,
          max: 24,
          step: 0.5,
          get: (value) => value.equityModel.incomeMonthsFactor,
          set: (value, next) => {
            value.equityModel.incomeMonthsFactor = next
          },
        },
        {
          type: 'number',
          id: 'config-min-equity',
          label: 'Mindest-Eigenkapital',
          hint: 'Untergrenze für das Eigenkapital im Rechner.',
          mode: 'currency',
          min: 0,
          step: 500,
          get: (value) => value.equityModel.minEquity,
          set: (value, next) => {
            value.equityModel.minEquity = next
          },
        },
        {
          type: 'number',
          id: 'config-max-investment-ratio',
          label: 'Max. Investitionsquote',
          hint: 'Deckel für das eingesetzte Eigenkapital relativ zum Investment.',
          mode: 'percent',
          min: 0,
          max: 100,
          step: 1,
          get: (value) => value.equityModel.maxTotalInvestmentRatio,
          set: (value, next) => {
            value.equityModel.maxTotalInvestmentRatio = next
          },
        },
      ],
    },
  ]
}

function renderConfigSections(sections: ConfigSection[], sourceConfig: CalculationConfig): string {
  return sections
    .map((section) => {
      const openAttribute = section.open ? ' open' : ''
      return `
        <details class="config-group"${openAttribute}>
          <summary class="config-group-toggle">
            <span>${section.title}</span>
            <small>${section.copy}</small>
          </summary>
          <div class="config-grid">
            ${section.fields.map((field) => renderConfigField(field, sourceConfig)).join('')}
          </div>
        </details>
      `
    })
    .join('')
}

function renderConfigField(field: ConfigField, sourceConfig: CalculationConfig): string {
  if (field.type === 'select') {
    return `
      <label class="config-field" for="${field.id}">
        <span class="config-field-label">${field.label}</span>
        <span class="config-field-hint">${field.hint}</span>
        <span class="config-input-wrap">
          <select id="${field.id}" class="config-select">
            ${field.options(sourceConfig)
              .map((option) => {
                const selected = option.value === field.get(sourceConfig) ? ' selected' : ''
                return `<option value="${option.value}"${selected}>${option.label}</option>`
              })
              .join('')}
          </select>
        </span>
      </label>
    `
  }

  const minAttribute = field.min !== undefined ? ` min="${field.min}"` : ''
  const maxAttribute = field.max !== undefined ? ` max="${field.max}"` : ''
  return `
    <label class="config-field" for="${field.id}">
      <span class="config-field-label">${field.label}</span>
      <span class="config-field-hint">${field.hint}</span>
      <span class="config-input-wrap">
        <input
          id="${field.id}"
          class="config-input"
          type="number"
          step="${field.step}"
          inputmode="decimal"
          value="${formatConfigInputValue(field.get(sourceConfig), field.mode)}"${minAttribute}${maxAttribute}
        />
        <span class="config-input-unit">${getConfigFieldUnit(field.mode)}</span>
      </span>
    </label>
  `
}

function buildConfigFromForm(form: HTMLFormElement): CalculationConfig {
  const nextConfig = deepCloneConfig(config)
  for (const section of configSections) {
    for (const field of section.fields) {
      if (field.type === 'select') {
        const input = getFormElement<HTMLSelectElement>(form, field.id)
        field.set(nextConfig, input.value)
        continue
      }

      const rawValue = readNumberInput(form, field.id)
      const normalizedValue = field.mode === 'percent' ? rawValue / 100 : rawValue
      field.set(nextConfig, normalizedValue)
    }
  }

  normalizeDerivedConfigValues(nextConfig)
  return validateConfig(nextConfig)
}

function normalizeDerivedConfigValues(nextConfig: CalculationConfig): void {
  const apartmentA = getConfigApartment(nextConfig, 'a')
  const apartmentB = getConfigApartment(nextConfig, 'b')
  apartmentA.subtitle = buildApartmentSubtitle('a', apartmentA.size)
  apartmentB.subtitle = buildApartmentSubtitle('b', apartmentB.size)

  const incomeMax = Math.max(nextConfig.incomeBounds.min, nextConfig.incomeBounds.max)
  nextConfig.incomeBounds.max = incomeMax
  nextConfig.incomeBounds.min = Math.min(nextConfig.incomeBounds.min, incomeMax)
  nextConfig.incomeBounds.step = Math.max(1, nextConfig.incomeBounds.step)
  nextConfig.assumptions.purchaseYear = Math.round(nextConfig.assumptions.purchaseYear)
  nextConfig.assumptions.rentStartYear = Math.max(
    nextConfig.assumptions.purchaseYear,
    Math.round(nextConfig.assumptions.rentStartYear),
  )
  nextConfig.assumptions.rentStartQuarter = clamp(
    Math.round(nextConfig.assumptions.rentStartQuarter),
    1,
    4,
  )
  nextConfig.assumptions.afaStartYear = Math.max(
    nextConfig.assumptions.purchaseYear,
    Math.round(nextConfig.assumptions.afaStartYear),
  )
  nextConfig.assumptions.afaStartQuarter = clamp(
    Math.round(nextConfig.assumptions.afaStartQuarter),
    1,
    4,
  )

  const afaEntryOne = getConfigAfaEntry(nextConfig, 0)
  const afaEntryTwo = getConfigAfaEntry(nextConfig, 1)
  nextConfig.assumptions.afaSchedule[0] = {
    ...afaEntryOne,
    startYear: 1,
    endYear: Math.max(1, Math.round(afaEntryOne.endYear)),
  }
  nextConfig.assumptions.afaSchedule[1] = {
    ...afaEntryTwo,
    startYear: nextConfig.assumptions.afaSchedule[0].endYear + 1,
    endYear: Math.max(nextConfig.assumptions.afaSchedule[0].endYear + 1, Math.round(afaEntryTwo.endYear)),
  }

  nextConfig.taxBrackets = nextConfig.taxBrackets
    .map((entry) => ({
      maxMonthlyIncome: Math.max(0, entry.maxMonthlyIncome),
      rate: Math.max(0, entry.rate),
    }))
    .sort((left, right) => left.maxMonthlyIncome - right.maxMonthlyIncome)
}

function serializeConfig(value: CalculationConfig): string {
  return JSON.stringify(value, null, 2)
}

function loadStoredConfig(fallback: CalculationConfig): CalculationConfig {
  try {
    const rawValue = window.localStorage.getItem(CONFIG_STORAGE_KEY)
    if (!rawValue) {
      return deepCloneConfig(fallback)
    }
    return validateConfig(JSON.parse(rawValue) as unknown)
  } catch {
    window.localStorage.removeItem(CONFIG_STORAGE_KEY)
    return deepCloneConfig(fallback)
  }
}

function saveStoredConfig(value: CalculationConfig): void {
  window.localStorage.setItem(CONFIG_STORAGE_KEY, serializeConfig(value))
}

function clearStoredConfig(): void {
  window.localStorage.removeItem(CONFIG_STORAGE_KEY)
}

function hasStoredConfig(): boolean {
  return window.localStorage.getItem(CONFIG_STORAGE_KEY) !== null
}

function validateConfig(candidate: unknown): CalculationConfig {
  if (!isRecord(candidate)) {
    throw new Error('Root muss ein JSON-Objekt sein.')
  }

  const defaultApartmentIdValue = String(candidate.defaultApartmentId)
  const defaultAnnualGrossIncome = candidate.defaultAnnualGrossIncome
  const incomeBounds = candidate.incomeBounds
  const equityModel = candidate.equityModel
  const assumptionsCandidate = candidate.assumptions
  const apartmentsCandidate = candidate.apartments
  const taxBracketsCandidate = candidate.taxBrackets

  if (!isApartmentId(defaultApartmentIdValue)) {
    throw new Error('defaultApartmentId muss "a" oder "b" sein.')
  }
  const defaultApartmentId: ApartmentId = defaultApartmentIdValue

  if (typeof defaultAnnualGrossIncome !== 'number') {
    throw new Error('defaultAnnualGrossIncome muss eine Zahl sein.')
  }

  if (!isRecord(incomeBounds)) {
    throw new Error('incomeBounds fehlt oder ist ungültig.')
  }

  if (!isRecord(equityModel)) {
    throw new Error('equityModel fehlt oder ist ungültig.')
  }

  if (!isRecord(assumptionsCandidate)) {
    throw new Error('assumptions fehlt oder ist ungültig.')
  }

  if (!Array.isArray(apartmentsCandidate) || apartmentsCandidate.length === 0) {
    throw new Error('apartments muss ein nicht-leeres Array sein.')
  }

  if (!Array.isArray(taxBracketsCandidate)) {
    throw new Error('taxBrackets muss ein Array sein.')
  }

  const apartments = apartmentsCandidate.map((entry) => {
    if (!isRecord(entry)) {
      throw new Error('Jedes apartment muss ein Objekt sein.')
    }

    const apartmentIdValue = String(entry.id)
    if (!isApartmentId(apartmentIdValue)) {
      throw new Error('Jedes apartment braucht eine gültige id ("a" oder "b").')
    }
    const apartmentId: ApartmentId = apartmentIdValue

    return {
      id: apartmentId,
      label: asString(entry.label, 'apartment.label'),
      subtitle: asString(entry.subtitle, 'apartment.subtitle'),
      size: asNumber(entry.size, 'apartment.size'),
      purchasePrice: asNumber(entry.purchasePrice, 'apartment.purchasePrice'),
      image: asString(entry.image, 'apartment.image'),
      monthlyManagement: asNumber(entry.monthlyManagement, 'apartment.monthlyManagement'),
      monthlyMaintenance: asNumber(entry.monthlyMaintenance, 'apartment.monthlyMaintenance'),
      monthlyOtherCost: asNumber(entry.monthlyOtherCost, 'apartment.monthlyOtherCost'),
    } satisfies ApartmentOption
  })

  if (!apartments.some((entry) => entry.id === defaultApartmentId)) {
    throw new Error('defaultApartmentId muss in apartments enthalten sein.')
  }

  const assumptions = {
    rentPerSqm: asNumber(assumptionsCandidate.rentPerSqm, 'assumptions.rentPerSqm'),
    ancillaryCostRate: asNumber(assumptionsCandidate.ancillaryCostRate, 'assumptions.ancillaryCostRate'),
    vacancyRate: asNumber(assumptionsCandidate.vacancyRate, 'assumptions.vacancyRate'),
    monthlyManagementFlat: asNumber(
      assumptionsCandidate.monthlyManagementFlat,
      'assumptions.monthlyManagementFlat',
    ),
    monthlyMaintenanceFlat: asNumber(
      assumptionsCandidate.monthlyMaintenanceFlat,
      'assumptions.monthlyMaintenanceFlat',
    ),
    purchaseYear: asNumber(assumptionsCandidate.purchaseYear, 'assumptions.purchaseYear'),
    rentStartYear: asNumber(assumptionsCandidate.rentStartYear, 'assumptions.rentStartYear'),
    rentStartQuarter: asNumber(
      assumptionsCandidate.rentStartQuarter,
      'assumptions.rentStartQuarter',
    ),
    afaStartYear: asNumber(assumptionsCandidate.afaStartYear, 'assumptions.afaStartYear'),
    afaStartQuarter: asNumber(
      assumptionsCandidate.afaStartQuarter,
      'assumptions.afaStartQuarter',
    ),
    kfwLoanAmount: asNumber(assumptionsCandidate.kfwLoanAmount, 'assumptions.kfwLoanAmount'),
    kfwInterestRate: asNumber(assumptionsCandidate.kfwInterestRate, 'assumptions.kfwInterestRate'),
    kfwRepaymentRate: asNumber(
      assumptionsCandidate.kfwRepaymentRate,
      'assumptions.kfwRepaymentRate',
    ),
    kfwGraceYears: asNumber(assumptionsCandidate.kfwGraceYears, 'assumptions.kfwGraceYears'),
    kfwGrantAmount: asNumber(assumptionsCandidate.kfwGrantAmount, 'assumptions.kfwGrantAmount'),
    bankInterestRate: asNumber(assumptionsCandidate.bankInterestRate, 'assumptions.bankInterestRate'),
    bankRepaymentRate: asNumber(
      assumptionsCandidate.bankRepaymentRate,
      'assumptions.bankRepaymentRate',
    ),
    monumentShare: asNumber(assumptionsCandidate.monumentShare, 'assumptions.monumentShare'),
    annualGrowthRate: asNumber(
      assumptionsCandidate.annualGrowthRate,
      'assumptions.annualGrowthRate',
    ),
    years: asNumber(assumptionsCandidate.years, 'assumptions.years'),
    afaSchedule: Array.isArray(assumptionsCandidate.afaSchedule)
      ? assumptionsCandidate.afaSchedule.map((entry, index) => {
          if (!isRecord(entry)) {
            throw new Error(`assumptions.afaSchedule[${index}] ist ungültig.`)
          }
          return {
            startYear: asNumber(entry.startYear, `assumptions.afaSchedule[${index}].startYear`),
            endYear: asNumber(entry.endYear, `assumptions.afaSchedule[${index}].endYear`),
            rate: asNumber(entry.rate, `assumptions.afaSchedule[${index}].rate`),
          } satisfies AfaScheduleEntry
        })
      : (() => {
          throw new Error('assumptions.afaSchedule muss ein Array sein.')
        })(),
  } satisfies Assumptions

  const taxBrackets = taxBracketsCandidate.map((entry, index) => {
    if (!isRecord(entry)) {
      throw new Error(`taxBrackets[${index}] ist ungültig.`)
    }
    return {
      maxMonthlyIncome: asNumber(entry.maxMonthlyIncome, `taxBrackets[${index}].maxMonthlyIncome`),
      rate: asNumber(entry.rate, `taxBrackets[${index}].rate`),
    } satisfies TaxBracket
  })

  return {
    defaultApartmentId,
    defaultAnnualGrossIncome,
    incomeBounds: {
      min: asNumber(incomeBounds.min, 'incomeBounds.min'),
      max: asNumber(incomeBounds.max, 'incomeBounds.max'),
      step: asNumber(incomeBounds.step, 'incomeBounds.step'),
    },
    equityModel: {
      incomeMonthsFactor: asNumber(equityModel.incomeMonthsFactor, 'equityModel.incomeMonthsFactor'),
      minEquity: asNumber(equityModel.minEquity, 'equityModel.minEquity'),
      maxTotalInvestmentRatio: asNumber(
        equityModel.maxTotalInvestmentRatio,
        'equityModel.maxTotalInvestmentRatio',
      ),
    },
    assumptions,
    taxBrackets,
    apartments,
  }
}

function deepCloneConfig<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
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

function isTaxTableMode(value: string): value is TaxTableMode {
  return value === 'grund' || value === 'splitting'
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

function getToneClass(value: number): string {
  if (value > 0) {
    return 'tone-positive'
  }
  if (value < 0) {
    return 'tone-negative'
  }
  return ''
}

function formatConfigInputValue(value: number, mode: ConfigNumberField['mode']): string {
  const normalizedValue = mode === 'percent' ? value * 100 : value
  return String(Number(normalizedValue.toFixed(4)))
}

function getConfigFieldUnit(mode: ConfigNumberField['mode']): string {
  if (mode === 'percent') {
    return '%'
  }
  if (mode === 'currency') {
    return 'EUR'
  }
  return ''
}

function readNumberInput(form: HTMLFormElement, id: string): number {
  const input = getFormElement<HTMLInputElement>(form, id)
  return parseRequiredNumber(input.value, id)
}

function parseRequiredNumber(rawValue: string, id: string): number {
  const normalized = rawValue.replace(',', '.').trim()
  if (!normalized.length) {
    throw new Error(`"${id}" darf nicht leer sein.`)
  }
  const parsed = Number.parseFloat(normalized)
  if (!Number.isFinite(parsed)) {
    throw new Error(`"${id}" ist keine gültige Zahl.`)
  }
  return parsed
}

function getFormElement<T extends HTMLElement>(form: HTMLFormElement, id: string): T {
  const element = form.querySelector<T>(`#${id}`)
  if (!element) {
    throw new Error(`Feld "${id}" wurde nicht gefunden.`)
  }
  return element
}

function getConfigApartment(sourceConfig: CalculationConfig, apartmentId: ApartmentId): ApartmentOption {
  const apartment = sourceConfig.apartments.find((entry) => entry.id === apartmentId)
  if (!apartment) {
    throw new Error(`Konfigurationsdaten für Wohnung "${apartmentId}" fehlen.`)
  }
  return apartment
}

function getConfigAfaEntry(sourceConfig: CalculationConfig, index: number): AfaScheduleEntry {
  return (
    sourceConfig.assumptions.afaSchedule[index] ??
    defaultConfig.assumptions.afaSchedule[index] ?? {
      startYear: index === 0 ? 1 : getConfigAfaEntry(sourceConfig, index - 1).endYear + 1,
      endYear: index === 0 ? 8 : 12,
      rate: 0,
    }
  )
}

function getConfigTaxBracket(sourceConfig: CalculationConfig, index: number): TaxBracket {
  return (
    sourceConfig.taxBrackets[index] ??
    defaultConfig.taxBrackets[index] ?? {
      maxMonthlyIncome: 999999,
      rate: 0,
    }
  )
}

function buildApartmentSubtitle(apartmentId: ApartmentId, size: number): string {
  const rooms = apartmentId === 'a' ? '1-Zimmer' : '2-Zimmer'
  return `${rooms}, ca. ${Math.round(size)} m²`
}

function setConfigStatus(message: string, isError = false): void {
  configStatus.textContent = message
  configStatus.classList.toggle('config-status-error', isError)
}

function asNumber(value: unknown, path: string): number {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    throw new Error(`${path} muss eine Zahl sein.`)
  }
  return value
}

function asString(value: unknown, path: string): string {
  if (typeof value !== 'string' || value.length === 0) {
    throw new Error(`${path} muss ein String sein.`)
  }
  return value
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
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

function resolvePublicAssetPath(path: string): string {
  if (/^https?:\/\//.test(path)) {
    return path
  }
  const base = import.meta.env.BASE_URL || '/'
  const normalizedBase = base.endsWith('/') ? base : `${base}/`
  const normalizedPath = path.startsWith('/') ? path.slice(1) : path
  return `${normalizedBase}${normalizedPath}`
}

