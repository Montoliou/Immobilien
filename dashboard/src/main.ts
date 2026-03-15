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
  zinsbindungJahre: number
  refinanceInterestRate: number
  refinanceRepaymentRate: number
  monumentShare: number
  annualGrowthRate: number
  depotCostRate: number
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

type TaxModelMode = 'approximate'

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

type LiquidityViewMode = 'afterTaxChart' | 'beforeTaxChart' | 'table'
type TaxTableMode = 'grund' | 'splitting'

type HeroSlide = {
  image: string
  alt: string
  caption: string
}

type AppMode = 'admin' | 'customer'

type ScenarioDefaults = {
  apartmentId: ApartmentId
  taxTableMode: TaxTableMode
  annualGrossIncome: number
  annualGrowthRatePercent: number
  investedEquity: number
  depotReturnRatePercent: number
}

type RuntimePreset = {
  id: string
  label: string
  version: string
  updatedAt: string
  calculationConfig: CalculationConfig
  scenarioDefaults: ScenarioDefaults
}

type CustomerIdentity = {
  firstName: string
  lastName: string
}

type CustomerScenarioSnapshot = {
  id: string
  createdAt: string
  customer: CustomerIdentity
  preset: RuntimePreset
}

type PresetManifestEntry = {
  id: string
  label: string
}

type PresetContext = {
  mode: AppMode
  preset: RuntimePreset
  notice: string | null
  hasExplicitPresetParam: boolean
  customerScenario: CustomerScenarioSnapshot | null
  customerScenarioId: string | null
}

const CONFIG_STORAGE_KEY = 'york-living-runtime-config'
const PREVIEW_PRESET_STORAGE_KEY = 'york-living-preview-preset'
const PREVIEW_PRESET_QUERY_KEY = 'previewPreset'
const DEFAULT_PRESET_ID = 'york-living-default'
const growthBounds = { min: -2, max: 5, step: 0.1 }
const equityBounds = { min: 0, max: 30000, step: 500 }
const depotBounds = { min: 0, max: 12, step: 0.1 }
const CONSULTATION_EMAIL = 'andreas.peters@mlp.de'
const CONSULTATION_PHONE_LABEL = 'Direkt anrufen: 0151/19690871'
const CONSULTATION_PHONE_LINK = 'tel:+4915119690871'
const BOOKING_URL = 'https://mlp-onlineberatung.flexperto.com/expert?id=782'
const MAPS_URL = 'https://maps.app.goo.gl/t3fVRBvNyz42xWMp7'
const ADVISOR_APP_ORIGIN = 'https://mlp-mediziner-beratung.de'
const CUSTOMER_APP_ORIGIN = 'https://montolio.de'
const CUSTOMER_SCENARIO_QUERY_KEY = 'customer'
const CUSTOMER_FIRST_NAME_QUERY_KEY = 'first'
const CUSTOMER_LAST_NAME_QUERY_KEY = 'last'
const CUSTOMER_SCENARIO_DATA_ROOT = '/YorkLiving-data/customer-scenarios'
const CUSTOMER_SCENARIO_API_PATH = '/api/create-customer-scenario.php'
const LOCAL_APP_HOSTNAMES = new Set(['127.0.0.1', 'localhost'])
const TAX_MODEL_DISCLAIMER =
  'Steuerliche Wirkung modellhaft: Grundlage ist ein angenähertes zvE; Soli und Kirchensteuer sind nicht berücksichtigt.'
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
const customerHeroHighlights = [
  {
    label: 'Wohnungsmix',
    value: 'ca. 150 Apartments',
    detail: '1 bis 2 Zimmer mit Einbauküche, 27 bis 35 m²',
  },
  {
    label: 'Mieterzielgruppe',
    value: 'breit vermietbar',
    detail: 'Studenten, Auszubildende, Senioren und Wochenendpendler',
  },
  {
    label: 'Steuerpotenzial',
    value: 'Denkmal-AfA ca. 72 %',
    detail: 'modellhaft bezogen auf den Kaufpreis',
  },
  {
    label: 'Förderung',
    value: 'KfW 261 mit Zuschuss',
    detail: 'bis 150.000 € Darlehen und 10 % Tilgungszuschuss',
  },
  {
    label: 'Zeitplan',
    value: 'Bezug ab Q4 2028',
    detail: 'Baubeginn geplant im Q2 2027',
  },
] as const
const DEFAULT_DEPOT_COST_RATE = 0.008
const DEPOT_CAPITAL_GAINS_TAX_RATE = 0.26375
const defaultConfigSource = deepCloneConfig(calculationConfig as CalculationConfig)
const embeddedDefaultPreset = buildEmbeddedDefaultPreset(defaultConfigSource)
const presetContext = await loadPresetContext(embeddedDefaultPreset)
const activePreset = presetContext.preset
const activePresetId = activePreset.id
const activeCustomerScenario = presetContext.customerScenario
const activeCustomerScenarioId = presetContext.customerScenarioId
const presetManifest = await loadPresetManifest(activePreset)
const appMode = presetContext.mode
const defaultConfig = deepCloneConfig(activePreset.calculationConfig)
const shouldUseStoredConfig = appMode === 'admin' && !presetContext.hasExplicitPresetParam
const config = shouldUseStoredConfig ? loadStoredConfig(defaultConfig) : deepCloneConfig(defaultConfig)
const configSections = buildConfigSections()
const apartments = config.apartments
const assumptions = config.assumptions
const projectionYears = assumptions.years
const scenarioDefaults = normalizeScenarioDefaults(activePreset.scenarioDefaults, config)
const initialCustomerIdentity = mergeCustomerIdentity(
  readCustomerIdentityFromParams(new URLSearchParams(window.location.search)),
  activeCustomerScenario?.customer ?? null,
)
const initialEditorSourcePreset = cloneRuntimePreset(activePreset)
const initialLoadedProjectPresetId = presetManifest.some((entry) => entry.id === activePreset.id)
  ? activePreset.id
  : null

const app = getElementById<HTMLDivElement>('app')

app.innerHTML = `
  <button id="open-config-editor" class="config-toggle" type="button"${appMode === 'customer' ? ' hidden' : ''}>Parameter-Editor</button>

  <div id="config-editor" class="config-editor" aria-hidden="true"${appMode === 'customer' ? ' hidden' : ''}>
    <div class="config-editor-backdrop" data-config-editor-close="true"></div>
    <section
      class="config-editor-shell"
      role="dialog"
      aria-modal="true"
      aria-labelledby="config-editor-title"
    >
      <header class="config-editor-head">
        <div class="config-editor-intro">
          <p class="eyebrow">Parameter-Editor</p>
          <h2 id="config-editor-title">Preset, Finanzierung und Steuermodell</h2>
          <p class="config-panel-copy">
            Dieser Editor steuert die Beraterversion und die daraus erzeugte Kundenversion. Änderungen gelten lokal,
            bis Sie sie bewusst exportieren oder übernehmen.
          </p>
        </div>
        <div class="config-editor-head-side">
          <div class="config-editor-action-bar">
            <button id="apply-config" class="btn btn-primary btn-compact" type="button">Übernehmen</button>
            <button id="reset-config" class="btn btn-secondary btn-compact" type="button">Zurücksetzen</button>
            <button id="config-editor-close" class="btn btn-secondary btn-compact" type="button">Schließen</button>
          </div>
          <div class="config-head-summary" aria-label="Aktueller Zuschnitt">
            <div class="config-head-summary-item">
              <span class="config-head-summary-title">Preset</span>
              <strong id="config-summary-preset" class="config-head-summary-value">-</strong>
            </div>
            <div class="config-head-summary-item">
              <span class="config-head-summary-title">Kundenszenario</span>
              <strong id="config-summary-scenario" class="config-head-summary-value">-</strong>
            </div>
            <div class="config-head-summary-item">
              <span class="config-head-summary-title">Zeitachse</span>
              <strong id="config-summary-timing" class="config-head-summary-value">-</strong>
            </div>
          </div>
        </div>
      </header>

      <div class="config-editor-layout">
        <aside class="config-sidebar">
          <section class="config-sidebar-card">
            <div>
              <p class="config-panel-title">Preset-Verwaltung</p>
            </div>

            <div class="config-sidebar-block">
              <div>
                <p class="config-panel-subtitle">Metadaten</p>
              </div>
              <div class="config-grid config-grid-compact">
                <label class="config-field">
                  <span class="config-field-label">Preset-ID</span>
                  <span class="config-field-hint">
                    Wird als Dateiname und URL-Parameter genutzt, z. B. york-living-aerzte-01.
                  </span>
                  <div class="config-input-wrap">
                    <input
                      id="preset-id"
                      class="config-input"
                      type="text"
                      inputmode="text"
                      spellcheck="false"
                      autocomplete="off"
                      placeholder="york-living-aerzte-01"
                    />
                  </div>
                </label>
                <label class="config-field">
                  <span class="config-field-label">Preset-Name</span>
                  <span class="config-field-hint">Interne Bezeichnung für diese Kundenversion.</span>
                  <div class="config-input-wrap">
                    <input
                      id="preset-label"
                      class="config-input"
                      type="text"
                      autocomplete="off"
                      placeholder="York Living Ärzte 01"
                    />
                  </div>
                </label>
              </div>
            </div>

            <div class="config-sidebar-block">
              <div>
                <p class="config-panel-subtitle">Preset öffnen</p>
              </div>
              <label class="config-field config-field-grow">
                <span class="config-field-label">Aus Projekt öffnen</span>
                <span class="config-field-hint">Lädt eine vorhandene Preset-Datei aus public/presets.</span>
                <select id="preset-selector" class="config-select">${renderPresetManifestOptions(presetManifest, activePresetId)}</select>
              </label>
              <div class="config-toolbar-actions config-toolbar-actions-split">
                <button id="load-preset" class="btn btn-secondary btn-compact" type="button">Aus Projekt öffnen</button>
                <button id="import-preset" class="btn btn-secondary btn-compact" type="button">Aus JSON öffnen</button>
              </div>
              <input id="import-preset-file" type="file" accept="application/json,.json" hidden />
            </div>

            <div class="config-sidebar-block">
              <div>
                <p class="config-panel-subtitle">Aus aktuellem Stand</p>
                <p class="config-field-hint">
                  Vorschau und Export nutzen immer die aktuellen Werte im Editor, nicht nur die Projekt-Auswahl.
                </p>
              </div>
              <div class="config-toolbar-actions config-toolbar-actions-split">
                <button id="preview-preset" class="btn btn-secondary btn-compact" type="button">Kundenvorschau</button>
                <button id="copy-config" class="btn btn-secondary btn-compact" type="button">Als JSON speichern</button>
              </div>
            </div>

            <p id="config-status" class="config-status config-status-inline" role="status" aria-live="polite"></p>
          </section>
        </aside>

        <form id="config-form" class="config-form" autocomplete="off">
          <div class="config-section-list">${renderConfigSections(configSections, config)}</div>
        </form>
      </div>
    </section>
  </div>

  <main class="page">
    <section class="panel hero${appMode === 'customer' ? ' hero-customer' : ''}">
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
      <div class="hero-content${appMode === 'customer' ? ' hero-content-customer' : ''}"${appMode === 'customer' ? ` style="--hero-content-bg: url('${resolvePublicAssetPath('/project/hero-york-today.png')}')"` : ''}>
        <p class="eyebrow">York Living Münster</p>
        <h1>Ihr Immobilien-Check in 60 Sekunden</h1>
        <p id="customer-greeting" class="customer-greeting"${appMode === 'customer' && hasCustomerIdentity(initialCustomerIdentity) ? '' : ' hidden'}>${appMode === 'customer' && hasCustomerIdentity(initialCustomerIdentity) ? `Persönliche Berechnung für ${escapeHtml(formatCustomerDisplayName(initialCustomerIdentity))}` : ''}</p>
        <p class="lead">
          ${appMode === 'customer'
            ? 'York Living verbindet kompakte Apartments, Denkmal-AfA und KfW-Förderung im York-Quartier Münster. Auf Basis Ihrer Eingaben zeigt die App eine modellhafte 20-Jahres-Prognose.'
            : `Wählen Sie einen Grundriss, geben Sie Ihr Bruttojahreseinkommen ein und erhalten Sie sofort eine transparente ${projectionYears}-Jahres-Prognose für Ihr mögliches Vermögen.`}
        </p>
        ${appMode === 'customer'
          ? `
        <div class="hero-customer-intro">
          <div class="hero-customer-actions">
            <a
              class="btn btn-secondary hero-location-button"
              href="${MAPS_URL}"
              target="_blank"
              rel="noreferrer noopener"
            >
              Standort auf Google Maps öffnen
            </a>
          </div>
          <div class="hero-project-facts">
            ${customerHeroHighlights
              .map(
                (fact) => `
              <article class="hero-project-fact">
                <p class="hero-project-fact-label">${fact.label}</p>
                <p class="hero-project-fact-value">${fact.value}</p>
                <p class="hero-project-fact-detail">${fact.detail}</p>
              </article>`,
              )
              .join('')}
          </div>
        </div>`
          : ''}
        <div class="hero-actions"${appMode === 'customer' ? ' hidden' : ''}>
          <a
            class="btn btn-secondary btn-link"
            href="${MAPS_URL}"
            target="_blank"
            rel="noreferrer noopener"
          >
            Lage auf Google Maps
          </a>
          <button id="copy-scenario-link" class="btn btn-primary" type="button">Kundenlink generieren</button>
        </div>
        <p id="share-status" class="share-status" role="status" aria-live="polite"${appMode === 'customer' ? ' hidden' : ''}></p>
      </div>
    </section>

    <section class="journey-strip" aria-label="So funktioniert der Immobilien-Check">
      <article class="journey-step">
        <span class="journey-step-number">1</span>
        <div>
          <p class="journey-step-title">Wohnungsoption wählen</p>
          <p class="journey-step-copy">Apartment A oder B auswählen und den Grundriss direkt prüfen.</p>
        </div>
      </article>
      <article class="journey-step">
        <span class="journey-step-number">2</span>
        <div>
          <p class="journey-step-title">Einkommen und Steuermodell setzen</p>
          <p class="journey-step-copy">Bruttojahreseinkommen, Steuermodell und Eigenkapital auf Ihr Szenario anpassen.</p>
        </div>
      </article>
      <article class="journey-step">
        <span class="journey-step-number">3</span>
        <div>
          <p class="journey-step-title">Prognose und Liquidität lesen</p>
          <p class="journey-step-copy">Vermögen, monatliche Wirkung und Detailtabelle darunter gemeinsam einordnen.</p>
        </div>
      </article>
    </section>

    <section class="workspace">
      <section class="panel choose-panel">
        <h2>1. Wählen Sie Ihre Wohnungsoption</h2>
        <div id="apartment-options" class="apartment-options"></div>

        <div class="income-block">
          <h2>2. Ihr Bruttojahreseinkommen</h2>
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
              <legend>Steuermodell</legend>
              <div class="tax-mode-switch" role="radiogroup" aria-label="Steuermodell wählen">
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

          <p class="tax-model-note tax-model-note-inline">
            ${TAX_MODEL_DISCLAIMER}
          </p>

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

        ${appMode === 'admin'
          ? `
        <div class="assumption-grid assumption-grid-featured">
          <article class="assumption-card">
            <p class="assumption-label">Gesamtinvestition</p>
            <p id="out-total-investment" class="assumption-value assumption-value-strong">-</p>
            <p id="out-total-investment-meta" class="assumption-meta">-</p>
          </article>
          <article class="assumption-card">
            <p class="assumption-label">Steuermodell</p>
            <p id="out-tax-label" class="assumption-value assumption-value-strong">-</p>
            <p id="out-tax-rate" class="assumption-meta tax-model-copy">-</p>
          </article>
          <article class="assumption-card">
            <p class="assumption-label">Restschuld nach Zinsbindung</p>
            <p id="out-refinance-debt" class="assumption-value">-</p>
            <p id="out-refinance-meta" class="assumption-meta">-</p>
          </article>
        </div>`
          : ''}
      </section>

      <section class="panel result-panel" aria-live="polite">
        <div class="result-section-head">
          <div>
            <h2>3. Prognose</h2>
            <p class="result-section-copy">
              Lesen Sie die Auswertung in dieser Reihenfolge: erst Vermögen, dann monatliche Liquidität, danach die Details.
            </p>
          </div>
        </div>
        <div class="result-summary-head">
          <p id="result-headline" class="result-headline-copy">Ihr mögliches Vermögen nach ${projectionYears} Jahren</p>
          <p id="out-wealth20" class="wealth-value">-</p>
          <p id="out-wealth-gain" class="wealth-subvalue">-</p>
        </div>

        ${appMode === 'admin'
          ? `
        <div id="budget-card" class="budget-card"></div>

        <div id="comparison-card" class="comparison-card"></div>

        <div class="metric-grid">
          <article class="metric-card">
            <p class="metric-label">Objektwert in ${projectionYears} Jahren</p>
            <p id="out-object-value" class="metric-value">-</p>
          </article>
          <article class="metric-card">
            <p class="metric-label">Kumulierter Cashflow (${projectionYears} Jahre)</p>
            <p id="out-cashflow20" class="metric-value">-</p>
          </article>
        </div>`
          : `
        <div class="result-primary">
          <div id="budget-card" class="budget-card"></div>

          <div class="metric-grid">
            <article class="metric-card">
              <p class="metric-label">Objektwert in ${projectionYears} Jahren</p>
              <p id="out-object-value" class="metric-value">-</p>
            </article>
            <article class="metric-card">
              <p class="metric-label">Restschuld in ${projectionYears} Jahren</p>
              <p id="out-final-debt" class="metric-value">-</p>
            </article>
          </div>
        </div>`}

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
                <span id="liquidity-mode" class="liquidity-mode">Ohne Steuereffekt</span>
              </button>
            </div>
          </div>
          <p id="liquidity-tax-note" class="tax-model-note tax-model-note-compact">-</p>
          <div id="liquidity-view-content" class="liquidity-view-content"></div>
        </div>

        ${appMode === 'admin'
          ? `
        <div class="progress-wrap">
          <div class="progress-meta">
            <p>Vermögensentwicklung über ${projectionYears} Jahre</p>
            <p id="out-path-end">-</p>
          </div>
          <div id="wealth-path" class="wealth-path"></div>
        </div>

        <div id="wealth-composition" class="wealth-composition"></div>`
          : `
        <div class="progress-wrap">
          <div class="section-head">
            <div>
              <p class="section-kicker">Vermögensentwicklung</p>
              <h3 class="section-title">Nettovermögen aus der Immobilie</h3>
            </div>
            <p id="out-path-end" class="section-value">-</p>
          </div>
          <div id="wealth-path" class="wealth-path"></div>
        </div>

        <div id="wealth-composition" class="wealth-composition"></div>

        <div class="detail-stack">
          <details class="secondary-details">
            <summary class="secondary-details-toggle">
              <div>
                <p class="section-kicker">Rechenrahmen</p>
                <span>Finanzierung und Steuermodell im Überblick</span>
              </div>
              <small>Details einblenden</small>
            </summary>
            <div class="secondary-details-body">
              <div class="assumption-grid assumption-grid-featured">
                <article class="assumption-card">
                  <p class="assumption-label">Gesamtinvestition</p>
                  <p id="out-total-investment" class="assumption-value assumption-value-strong">-</p>
                  <p id="out-total-investment-meta" class="assumption-meta">-</p>
                </article>
                <article class="assumption-card">
                  <p class="assumption-label">Steuermodell</p>
                  <p id="out-tax-label" class="assumption-value assumption-value-strong">-</p>
                  <p id="out-tax-rate" class="assumption-meta tax-model-copy">-</p>
                </article>
                <article class="assumption-card">
                  <p class="assumption-label">Restschuld nach Zinsbindung</p>
                  <p id="out-refinance-debt" class="assumption-value">-</p>
                </article>
              </div>
            </div>
          </details>

          <details class="secondary-details">
            <summary class="secondary-details-toggle">
              <div>
                <p class="section-kicker">Optionaler Vergleich</p>
                <span>Immobilie mit Vermögensdepot vergleichen</span>
              </div>
              <small>Alternative Kapitalanlage einblenden</small>
            </summary>
            <div class="secondary-details-body">
              <div id="comparison-card" class="comparison-card"></div>
            </div>
          </details>
        </div>`}
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
          href="${CONSULTATION_PHONE_LINK}"
          aria-label="Jetzt anrufen unter 0151 19690871"
        >
          ${CONSULTATION_PHONE_LABEL}
        </a>
        <a
          class="btn btn-secondary btn-link"
          href="${BOOKING_URL}"
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

  <div id="customer-link-modal" class="dialog-modal" aria-hidden="true"${appMode === 'customer' ? ' hidden' : ''}>
    <div class="dialog-modal-backdrop" data-customer-link-close="true"></div>
    <section
      class="dialog-modal-panel"
      role="dialog"
      aria-modal="true"
      aria-labelledby="customer-link-modal-title"
    >
      <header class="dialog-modal-head">
        <div>
          <p class="eyebrow">Kundenlink</p>
          <h3 id="customer-link-modal-title">Kundenszenario personalisieren</h3>
        </div>
        <button
          id="customer-link-modal-close"
          type="button"
          class="liquidity-view-nav"
          aria-label="Dialog schließen"
        >
          ×
        </button>
      </header>
      <div class="dialog-modal-content">
        <p class="lead dialog-modal-copy">
          Geben Sie optional den Namen des Kunden an. Ohne Namen wird ein generischer Kundenlink erzeugt, den Sie an mehrere Kunden versenden können.
        </p>
        <div class="config-grid dialog-modal-grid">
          <label class="config-field">
            <span class="config-field-label">Vorname Kunde</span>
            <div class="config-input-wrap">
              <input
                id="customer-first-name"
                class="config-input"
                type="text"
                autocomplete="off"
                placeholder="Max"
              />
            </div>
          </label>
          <label class="config-field">
            <span class="config-field-label">Nachname Kunde</span>
            <div class="config-input-wrap">
              <input
                id="customer-last-name"
                class="config-input"
                type="text"
                autocomplete="off"
                placeholder="Mustermann"
              />
            </div>
          </label>
        </div>
        <p id="customer-link-modal-status" class="config-status" role="status" aria-live="polite"></p>
      </div>
      <footer class="dialog-modal-actions">
        <button id="customer-link-cancel" class="btn btn-secondary btn-compact" type="button">Abbrechen</button>
        <button id="customer-link-confirm" class="btn btn-primary btn-compact" type="button">Kundenlink jetzt generieren</button>
      </footer>
    </section>
  </div>

  <div id="preset-open-modal" class="dialog-modal" aria-hidden="true"${appMode === 'customer' ? ' hidden' : ''}>
    <div class="dialog-modal-backdrop" data-preset-open-close="true"></div>
    <section
      class="dialog-modal-panel dialog-modal-panel-compact"
      role="dialog"
      aria-modal="true"
      aria-labelledby="preset-open-modal-title"
    >
      <header class="dialog-modal-head">
        <div>
          <p class="eyebrow">Preset öffnen</p>
          <h3 id="preset-open-modal-title">Ungespeicherte Änderungen sichern?</h3>
        </div>
        <button
          id="preset-open-modal-close"
          type="button"
          class="liquidity-view-nav"
          aria-label="Dialog schließen"
        >
          ×
        </button>
      </header>
      <div class="dialog-modal-content">
        <p class="lead dialog-modal-copy">
          Der aktuelle Editorstand weicht vom zuletzt geladenen Preset ab. Sie können ihn zuerst als JSON sichern oder direkt das nächste Preset öffnen.
        </p>
        <p id="preset-open-modal-status" class="config-status" role="status" aria-live="polite"></p>
      </div>
      <footer class="dialog-modal-actions dialog-modal-actions-compact">
        <button id="preset-open-cancel" class="btn btn-secondary btn-compact" type="button">Abbrechen</button>
        <button id="preset-open-save" class="btn btn-secondary btn-compact" type="button">Aktuellen Stand als JSON speichern</button>
        <button id="preset-open-confirm" class="btn btn-primary btn-compact" type="button">Ohne Speichern öffnen</button>
      </footer>
    </section>
  </div>

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
            hidden
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
const openConfigEditorButton = getElementById<HTMLButtonElement>('open-config-editor')
const configEditor = getElementById<HTMLDivElement>('config-editor')
const configEditorCloseButton = getElementById<HTMLButtonElement>('config-editor-close')
const configForm = getElementById<HTMLFormElement>('config-form')
const configStatus = getElementById<HTMLElement>('config-status')
const presetIdInput = getElementById<HTMLInputElement>('preset-id')
const presetLabelInput = getElementById<HTMLInputElement>('preset-label')
const customerFirstNameInput = getElementById<HTMLInputElement>('customer-first-name')
const customerLastNameInput = getElementById<HTMLInputElement>('customer-last-name')
const customerLinkModal = getElementById<HTMLDivElement>('customer-link-modal')
const customerLinkModalStatus = getElementById<HTMLElement>('customer-link-modal-status')
const customerLinkModalCloseButton = getElementById<HTMLButtonElement>('customer-link-modal-close')
const customerLinkCancelButton = getElementById<HTMLButtonElement>('customer-link-cancel')
const customerLinkConfirmButton = getElementById<HTMLButtonElement>('customer-link-confirm')
const presetOpenModal = getElementById<HTMLDivElement>('preset-open-modal')
const presetOpenModalStatus = getElementById<HTMLElement>('preset-open-modal-status')
const presetOpenModalCloseButton = getElementById<HTMLButtonElement>('preset-open-modal-close')
const presetOpenCancelButton = getElementById<HTMLButtonElement>('preset-open-cancel')
const presetOpenSaveButton = getElementById<HTMLButtonElement>('preset-open-save')
const presetOpenConfirmButton = getElementById<HTMLButtonElement>('preset-open-confirm')
const presetSelector = getElementById<HTMLSelectElement>('preset-selector')
const loadPresetButton = getElementById<HTMLButtonElement>('load-preset')
const previewPresetButton = getElementById<HTMLButtonElement>('preview-preset')
const importPresetFileInput = getElementById<HTMLInputElement>('import-preset-file')
const importPresetButton = getElementById<HTMLButtonElement>('import-preset')
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

let selectedApartmentId: ApartmentId = scenarioDefaults.apartmentId
let selectedTaxTableMode: TaxTableMode = scenarioDefaults.taxTableMode
let annualGrossIncome = scenarioDefaults.annualGrossIncome
let annualGrowthRatePercent = scenarioDefaults.annualGrowthRatePercent
let investedEquity = scenarioDefaults.investedEquity
let depotReturnRatePercent = scenarioDefaults.depotReturnRatePercent
let liquidityViewMode: LiquidityViewMode = 'afterTaxChart'
let heroSlideIndex = 0
let heroSlideIntervalId: number | null = null
let latestProjectionResult: ProjectionResult | null = null
let activeWealthPathIndex: number | null = null
let editorSourcePreset = initialEditorSourcePreset
let loadedProjectPresetId: string | null = initialLoadedProjectPresetId
let editorBaselineSignature = ''
let isEditorDirty = false
let isLiquidityModalOpen = false
let isCustomerLinkModalOpen = false
let isPresetOpenModalOpen = false
let isConfigEditorOpen = false
let pendingPresetOpenAction: (() => Promise<void>) | null = null

hydrateStateFromUrl()
renderApartmentCards()
renderTaxTableSelection()
writeInputValue(annualGrossIncome)
writeGrowthInputValue(annualGrowthRatePercent)
writeEquityInputValue(investedEquity)
presetIdInput.value = activePreset.id
presetLabelInput.value = activePreset.label
customerFirstNameInput.value = initialCustomerIdentity.firstName
customerLastNameInput.value = initialCustomerIdentity.lastName
syncPresetSelector()
renderConfigEditorSummary()
commitEditorBaseline()
renderHeroSlide()
startHeroAutoplay()
if (shouldUseStoredConfig && hasStoredConfig()) {
  setConfigStatus('Lokale Konfigurationsänderungen sind aktiv.')
}
renderProjection()
if (presetContext.notice) {
  setConfigStatus(presetContext.notice)
  setStatus(presetContext.notice)
} else if (appMode === 'admin' && presetContext.hasExplicitPresetParam && hasStoredConfig()) {
  setConfigStatus(`Preset "${activePresetId}" wurde direkt aus der URL geladen. Lokale Browser-Konfiguration bleibt dafür unberücksichtigt.`)
}

incomeInput.addEventListener('input', () => {
  annualGrossIncome = clamp(
    parseNumber(incomeInput.value, annualGrossIncome),
    config.incomeBounds.min,
    config.incomeBounds.max,
  )
  renderConfigEditorSummary()
  refreshEditorDirtyState()
  renderProjection()
})

taxTableInputs.forEach((input) => {
  input.addEventListener('change', () => {
    if (!isTaxTableMode(input.value)) {
      return
    }
    selectedTaxTableMode = input.value
    renderTaxTableSelection()
    renderConfigEditorSummary()
    refreshEditorDirtyState()
    renderProjection()
  })
})

growthInput.addEventListener('input', () => {
  annualGrowthRatePercent = clamp(
    parseNumber(growthInput.value, annualGrowthRatePercent),
    growthBounds.min,
    growthBounds.max,
  )
  renderConfigEditorSummary()
  refreshEditorDirtyState()
  renderProjection()
})

equityInput.addEventListener('input', () => {
  investedEquity = clamp(
    parseNumber(equityInput.value, investedEquity),
    equityBounds.min,
    equityBounds.max,
  )
  renderConfigEditorSummary()
  refreshEditorDirtyState()
  renderProjection()
})

presetIdInput.addEventListener('input', () => {
  const normalized = presetIdInput.value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '')
  presetIdInput.value = normalized
  renderConfigEditorSummary()
  refreshEditorDirtyState()
})

presetLabelInput.addEventListener('input', () => {
  renderConfigEditorSummary()
  refreshEditorDirtyState()
})

configForm.addEventListener('input', () => {
  refreshEditorDirtyState()
})

configForm.addEventListener('change', () => {
  refreshEditorDirtyState()
})

loadPresetButton.addEventListener('click', async () => {
  const nextPresetId = sanitizePresetId(presetSelector.value)
  if (!nextPresetId) {
    setConfigStatus('Bitte wählen Sie zuerst ein Projekt-Preset aus.', true)
    return
  }
  if (loadedProjectPresetId === nextPresetId && !isEditorDirty) {
    setConfigStatus('Dieses Projekt-Preset ist bereits geöffnet.')
    return
  }

  await requestPresetOpen(async () => {
    const nextPreset = await loadProjectPreset(nextPresetId)
    applyRuntimePreset(nextPreset)
    setConfigStatus(`Projekt-Preset "${nextPreset.label}" wurde im Editor geöffnet.`)
  })
})

previewPresetButton.addEventListener('click', () => {
  try {
    const previewPreset = buildCurrentPreset(buildConfigFromForm(configForm))
    savePreviewPreset(previewPreset)
    const previewUrl = buildLocalPreviewUrl(
      selectedApartmentId,
      selectedTaxTableMode,
      annualGrossIncome,
      annualGrowthRatePercent,
      investedEquity,
      depotReturnRatePercent,
      resolveDraftCustomerIdentity(),
    )
    window.open(previewUrl, '_blank', 'noopener,noreferrer')
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Kundenvorschau konnte nicht geöffnet werden.'
    setConfigStatus(`Kundenvorschau konnte nicht geöffnet werden: ${message}`, true)
  }
})

importPresetButton.addEventListener('click', () => {
  importPresetFileInput.click()
})

importPresetFileInput.addEventListener('change', async () => {
  const file = importPresetFileInput.files?.[0]
  importPresetFileInput.value = ''

  if (!file) {
    return
  }

  try {
    const rawValue = await file.text()
    const importedPreset = validatePreset(JSON.parse(rawValue) as unknown)
    await requestPresetOpen(async () => {
      applyRuntimePreset(importedPreset)
      setConfigStatus(`Preset "${importedPreset.label}" wurde aus JSON geöffnet und kann jetzt weiterbearbeitet werden.`)
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Preset konnte nicht gelesen werden.'
    setConfigStatus(`Preset-Import fehlgeschlagen: ${message}`, true)
  }
})

openConfigEditorButton.addEventListener('click', () => {
  openConfigEditor()
})

configEditorCloseButton.addEventListener('click', () => {
  closeConfigEditor()
})

configEditor.addEventListener('click', (event) => {
  const target = event.target
  if (!(target instanceof HTMLElement)) {
    return
  }
  const closeTrigger = target.closest<HTMLElement>('[data-config-editor-close="true"]')
  if (!closeTrigger) {
    return
  }
  closeConfigEditor()
})

copyScenarioButton.addEventListener('click', () => {
  openCustomerLinkModal()
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

customerLinkModalCloseButton.addEventListener('click', () => {
  closeCustomerLinkModal()
})

customerLinkCancelButton.addEventListener('click', () => {
  closeCustomerLinkModal()
})

customerLinkConfirmButton.addEventListener('click', async () => {
  setCustomerLinkModalStatus('')

  try {
    const customerIdentity = resolveDraftCustomerIdentity()
    const customerIdentityOrNull = hasCustomerIdentity(customerIdentity) ? customerIdentity : null
    const scenario = await createCustomerScenarioLink(customerIdentityOrNull)
    const copied = await copyToClipboard(scenario.customerUrl)
    const successMessage = customerIdentityOrNull
      ? 'Personalisierter Kundenlink wurde generiert und kopiert.'
      : 'Generischer Kundenlink wurde generiert und kopiert.'
    setStatus(
      copied
        ? successMessage
        : `${successMessage.replace(' und kopiert.', '')}: ${scenario.customerUrl}`,
    )
    closeCustomerLinkModal()
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unbekannter Fehler'
    if (!isLocalRuntime()) {
      setCustomerLinkModalStatus(message, true)
      return
    }

    try {
      savePreviewPreset(buildCurrentPreset(buildConfigFromForm(configForm)))
      const customerIdentity = resolveDraftCustomerIdentity()
      const customerIdentityOrNull = hasCustomerIdentity(customerIdentity) ? customerIdentity : null
      const previewUrl = buildLocalPreviewUrl(
        selectedApartmentId,
        selectedTaxTableMode,
        annualGrossIncome,
        annualGrowthRatePercent,
        investedEquity,
        depotReturnRatePercent,
        customerIdentityOrNull,
      )
      const copied = await copyToClipboard(previewUrl)
      const fallbackPrefix = customerIdentityOrNull
        ? 'Es wurde stattdessen eine lokale, personalisierte Vorschau-URL kopiert.'
        : 'Es wurde stattdessen eine lokale, generische Vorschau-URL kopiert.'
      const fallbackMessage = copied
        ? `${message} ${fallbackPrefix}`
        : `${message} Lokale Vorschau: ${previewUrl}`
      setStatus(fallbackMessage)
      closeCustomerLinkModal()
    } catch (fallbackError) {
      const fallbackMessage = fallbackError instanceof Error ? fallbackError.message : message
      setCustomerLinkModalStatus(fallbackMessage, true)
    }
  }
})

customerLinkModal.addEventListener('click', (event) => {
  const target = event.target
  if (!(target instanceof HTMLElement)) {
    return
  }
  const closeTrigger = target.closest<HTMLElement>('[data-customer-link-close="true"]')
  if (!closeTrigger) {
    return
  }
  closeCustomerLinkModal()
})

presetOpenModalCloseButton.addEventListener('click', () => {
  closePresetOpenModal()
})

presetOpenCancelButton.addEventListener('click', () => {
  closePresetOpenModal()
})

presetOpenSaveButton.addEventListener('click', () => {
  try {
    exportCurrentPresetAsJson()
    setPresetOpenModalStatus('Aktueller Stand wurde als JSON gespeichert. Sie können jetzt das neue Preset öffnen.')
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Preset konnte nicht gespeichert werden.'
    setPresetOpenModalStatus(message, true)
  }
})

presetOpenConfirmButton.addEventListener('click', async () => {
  await confirmPendingPresetOpen()
})

presetOpenModal.addEventListener('click', (event) => {
  const target = event.target
  if (!(target instanceof HTMLElement)) {
    return
  }
  const closeTrigger = target.closest<HTMLElement>('[data-preset-open-close="true"]')
  if (!closeTrigger) {
    return
  }
  closePresetOpenModal()
})

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
  if (event.key !== 'Escape') {
    return
  }
  if (isPresetOpenModalOpen) {
    closePresetOpenModal()
    return
  }
  if (isCustomerLinkModalOpen) {
    closeCustomerLinkModal()
    return
  }
  if (isLiquidityModalOpen) {
    dismissLiquidityTableModal()
    return
  }
  if (isConfigEditorOpen) {
    closeConfigEditor()
  }
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

copyConfigButton.addEventListener('click', () => {
  try {
    const nextPreset = exportCurrentPresetAsJson()
    setConfigStatus(`Preset "${nextPreset.label}" wurde als JSON gespeichert. Sie können es später über „Aus JSON öffnen“ wieder laden.`)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unbekannter Fehler'
    setConfigStatus(`Preset ist noch nicht gültig: ${message}`, true)
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
      investedEquity = getDefaultEquityForApartment(apartmentId)
      writeEquityInputValue(investedEquity)
      renderApartmentCards()
      renderConfigEditorSummary()
      refreshEditorDirtyState()
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
    depotReturnRatePercent / 100,
  )
  latestProjectionResult = result

  setText('result-headline', `Ihr mögliches Vermögen nach ${projectionYears} Jahren mit ${apartment.label}`)
  setText('out-wealth20', formatCurrency(result.wealth20))
  setText(
    'out-wealth-gain',
    `Vermögenszuwachs ggü. Startvermögen: ${formatSignedCurrency(result.wealthGain20)}`,
  )
  setText('out-object-value', formatCurrency(result.projectedValue20))
  setOptionalText('out-final-debt', formatCurrency(result.finalRemainingDebt))
  setOptionalText('out-cashflow20', formatCurrency(result.cumulativeCashflow20))
  setText('out-growth-rate', `${formatSignedPercent(result.annualGrowthRate * 100)} % pro Jahr`)
  setText('out-equity-amount', formatCurrency(result.startEquity))
  setText('out-path-end', formatCurrency(result.wealth20))
  setText('out-total-investment', formatCurrency(result.totalInvestment))
  setOptionalText(
    'out-total-investment-meta',
    `inkl. ${formatCurrency(result.ancillaryCosts)} Nebenkosten · ${formatPercent(assumptions.ancillaryCostRate * 100)} Quote`,
  )
  setText('out-tax-label', `${formatPercent(result.marginalTaxRate * 100)} %`)
  setText('out-tax-rate', `Grenzsteuersatz
${getTaxTableLabel(result.taxTableMode)} · angenähertes zvE`)
  setOptionalText('liquidity-tax-note', result.taxDisclaimer)
  setText('out-refinance-debt', formatCurrency(result.refinanceDebtBase))
  updateConsultationMailLink(result)
  renderConfigEditorSummary()

  renderBudgetCard(result)
  renderComparisonCard(result)
  renderLiquidityView(result)
  renderWealthPath(result.yearlyWealthPath, appMode === 'admin' ? result.yearlyDepotPath : null)
  renderWealthComposition(result, activeWealthPathIndex)
  syncUrlState()
}

function calculateProjection(
  apartment: ApartmentOption,
  grossAnnualIncome: number,
  annualGrowthRate: number,
  selectedEquity: number,
  taxTableMode: TaxTableMode,
  depotReturnRate: number,
): ProjectionResult {
  const refinanceInterestRate = assumptions.refinanceInterestRate
  const refinanceRepaymentRate = assumptions.refinanceRepaymentRate
  const annualBaseRent = apartment.size * assumptions.rentPerSqm * 12
  const annualManagementCostsFull = (apartment.monthlyManagement + apartment.monthlyOtherCost) * 12
  const annualMaintenanceCostsFull = apartment.monthlyMaintenance * 12
  const taxableIncome = grossAnnualIncome * 0.8
  const annualTax = calculateAnnualIncomeTax(taxableIncome, taxTableMode)
  const marginalTaxRate = calculateMarginalTaxRate(taxableIncome, taxTableMode)
  const taxDisclaimer = TAX_MODEL_DISCLAIMER

  const ancillaryCosts = apartment.purchasePrice * assumptions.ancillaryCostRate
  const totalInvestment = apartment.purchasePrice + ancillaryCosts

  const startEquity = clamp(selectedEquity, equityBounds.min, Math.min(equityBounds.max, totalInvestment))
  const initialNetWealth = startEquity - ancillaryCosts
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
  const zinsbindungEndProjectionYear = assumptions.zinsbindungJahre + 1
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

    if (year === zinsbindungEndProjectionYear + 1) {
      remainingDebt = remainingKfwDebt + remainingBankDebt
      refinanceDebtBase = remainingDebt
      refinanceTargetDebtService = remainingDebt * (refinanceInterestRate + refinanceRepaymentRate)
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
        Math.max(refinanceTargetDebtService - refinanceInterest, 0),
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
    const yearlyAfaAmount = apartment.purchasePrice * assumptions.monumentShare * yearlyAfaRate
    const yearlyTotalInterest = kfwInterest + bankInterest + refinanceInterest
    const vuvEinkuenfte = yearlyNetBeforeDebt - yearlyTotalInterest - yearlyAfaAmount
    const yearlyTaxBenefit = -vuvEinkuenfte * marginalTaxRate
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
    yearlyCashflows.push(yearlyCashflow)

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
  const wealthGain20 = wealth20 - initialNetWealth
  const grossYield = (annualBaseRent / apartment.purchasePrice) * 100
  const yearOneOperatingCosts =
    annualBaseRent * assumptions.vacancyRate + annualManagementCostsFull + annualMaintenanceCostsFull
  const netYieldBeforeDebt = ((annualBaseRent - yearOneOperatingCosts) / apartment.purchasePrice) * 100
  const afaPhaseOneMonthlyLiquidity =
    afaPhaseOneYears > 0 ? afaPhaseOneCashflow / (afaPhaseOneYears * 12) : 0
  const afaPhaseTwoMonthlyLiquidity =
    afaPhaseTwoYears > 0 ? afaPhaseTwoCashflow / (afaPhaseTwoYears * 12) : 0
  const postAfaMonthlyLiquidity = postAfaYears > 0 ? postAfaCashflow / (postAfaYears * 12) : 0
  const afaTotalYears = afaPhaseOneYears + afaPhaseTwoYears
  const afaCombinedMonthlyLiquidity =
    afaTotalYears > 0 ? (afaPhaseOneCashflow + afaPhaseTwoCashflow) / (afaTotalYears * 12) : 0
  const depotCostRate = assumptions.depotCostRate
  const { yearlyPath: yearlyDepotPath, finalBalance: depotBalance } = simulateDepotPath(
    startEquity,
    yearlyCashflows,
    depotReturnRate,
    depotCostRate,
  )
  const depotNetReturnRate = calculateDepotNetReturnRate(depotReturnRate, depotCostRate)
  const requiredDepotGrossReturnRate = findRequiredDepotGrossReturnRate(
    wealth20,
    startEquity,
    yearlyCashflows,
    depotCostRate,
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
    grossYield,
    netYieldBeforeDebt,
    yearlyWealthPath,
    yearlyLiquidityRows,
    depotReturnRate,
    depotNetReturnRate,
    depotCostRate,
    depotTaxRate: DEPOT_CAPITAL_GAINS_TAX_RATE,
    requiredDepotGrossReturnRate,
    depotWealth20: depotBalance,
    yearlyDepotPath,
    finalRemainingDebt: remainingDebt,
  }
}

function calculateDepotNetReturnRate(
  grossReturnRate: number,
  costRate: number = DEFAULT_DEPOT_COST_RATE,
  taxRate: number = DEPOT_CAPITAL_GAINS_TAX_RATE,
): number {
  const afterCostRate = grossReturnRate - costRate
  return afterCostRate > 0 ? afterCostRate * (1 - taxRate) : afterCostRate
}

function simulateDepotPath(
  startBalance: number,
  yearlyCashflows: number[],
  grossReturnRate: number,
  costRate: number = DEFAULT_DEPOT_COST_RATE,
  taxRate: number = DEPOT_CAPITAL_GAINS_TAX_RATE,
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

function findRequiredDepotGrossReturnRate(
  targetWealth: number,
  startBalance: number,
  yearlyCashflows: number[],
  costRate: number = DEFAULT_DEPOT_COST_RATE,
  taxRate: number = DEPOT_CAPITAL_GAINS_TAX_RATE,
): number | null {
  const maxSearchRate = 1
  const zeroRateBalance = simulateDepotPath(startBalance, yearlyCashflows, 0, costRate, taxRate).finalBalance
  if (zeroRateBalance >= targetWealth) {
    return 0
  }

  let lower = 0
  let upper = 0.12
  let upperBalance = simulateDepotPath(startBalance, yearlyCashflows, upper, costRate, taxRate).finalBalance
  while (upperBalance < targetWealth && upper < maxSearchRate) {
    lower = upper
    upper = Math.min(upper * 2, maxSearchRate)
    upperBalance = simulateDepotPath(startBalance, yearlyCashflows, upper, costRate, taxRate).finalBalance
  }

  if (upperBalance < targetWealth) {
    return null
  }

  for (let iteration = 0; iteration < 40; iteration += 1) {
    const midpoint = (lower + upper) / 2
    const midpointBalance = simulateDepotPath(startBalance, yearlyCashflows, midpoint, costRate, taxRate).finalBalance
    if (midpointBalance >= targetWealth) {
      upper = midpoint
    } else {
      lower = midpoint
    }
  }

  return upper
}

function renderBudgetCard(result: ProjectionResult): void {
  const el = getElementById<HTMLDivElement>('budget-card')
  const mainValue = result.afaCombinedMonthlyLiquidity
  const postAfa = result.postAfaMonthlyLiquidity
  const afaYears = result.afaTotalYears

  const toneClass = mainValue >= 0 ? 'tone-positive' : 'tone-negative'

  el.innerHTML = `
    <p class="budget-label">Mittlerer Nettoeffekt aufgrund Abschreibungszeitraum</p>
    <span class="budget-hero ${toneClass}">${formatSignedCurrency(mainValue)} / Monat</span>
    <p class="budget-footnote">Durchschnitt aus AfA Jahr 1–${afaYears}. Ab Jahr ${afaYears + 1} ohne Denkmal-AfA: ca. ${formatSignedCurrency(postAfa)} / Monat.</p>
  `
}

function renderComparisonCard(result: ProjectionResult): void {
  const el = getElementById<HTMLDivElement>('comparison-card')
  const propertyWins = result.wealth20 >= result.depotWealth20
  const diff = result.wealth20 - result.depotWealth20
  const existingSlider = el.querySelector<HTMLInputElement>('#depot-return-rate-inline')

  if (!existingSlider) {
    el.innerHTML = `
      <p class="comparison-eyebrow">Alternative Kapitalanlage</p>
      <p class="comparison-title">Immobilie vs. Vermögensdepot nach ${projectionYears} Jahren</p>
      <p class="comparison-copy">
        Annahme: identisches Startkapital sowie dieselben jährlichen Zusatzaufwände oder Entnahmen
        wie im Immobilien-Szenario.
      </p>
      <div class="comparison-columns">
        <div id="comp-col-property" class="comparison-col">
          <p class="comparison-label">Immobilie</p>
          <p id="comp-val-property" class="comparison-value">-</p>
        </div>
        <div class="comparison-vs">vs.</div>
        <div id="comp-col-depot" class="comparison-col">
          <p class="comparison-label">Depot nach Kosten und Steuer</p>
          <p id="comp-val-depot" class="comparison-value">-</p>
        </div>
      </div>
      <p id="comp-note" class="comparison-note">-</p>
      <div class="comparison-meta">
        <p id="comp-net-return" class="comparison-meta-line">-</p>
        <p id="comp-required-return" class="comparison-meta-line">-</p>
      </div>
      <label class="comparison-slider-label" for="depot-return-rate-inline">
        <span>Marktrendite vor Kosten und Steuer: <strong id="out-depot-return-inline">-</strong></span>
        <input
          id="depot-return-rate-inline"
          class="comparison-slider"
          type="range"
          min="${depotBounds.min}"
          max="${depotBounds.max}"
          step="${depotBounds.step}"
          value="${depotReturnRatePercent}"
        />
      </label>
    `
    el.querySelector<HTMLInputElement>('#depot-return-rate-inline')!.addEventListener('input', (e) => {
      const slider = e.target as HTMLInputElement
      depotReturnRatePercent = clamp(
        parseNumber(slider.value, depotReturnRatePercent),
        depotBounds.min,
        depotBounds.max,
      )
      renderProjection()
    })
  }

  const propCol = el.querySelector('#comp-col-property')!
  const depotCol = el.querySelector('#comp-col-depot')!
  propCol.classList.toggle('comparison-winner', propertyWins)
  depotCol.classList.toggle('comparison-winner', !propertyWins)

  setText('comp-val-property', formatCurrency(result.wealth20))
  setText('comp-val-depot', formatCurrency(result.depotWealth20))
  setText('out-depot-return-inline', `${formatPercent(depotReturnRatePercent)} % p.a. brutto`)
  setText(
    'comp-net-return',
    `Nach Abzug von Kosten und Steuern bleiben ca. ${formatPercent(result.depotNetReturnRate * 100)} % netto.`,
  )
  setText(
    'comp-required-return',
    result.requiredDepotGrossReturnRate === null
      ? 'Break-even zur Immobilie liegt rechnerisch bei mehr als 100 % Brutto-Marktrendite p.a.'
      : `Break-even zur Immobilie liegt bei ca. ${formatPercent(result.requiredDepotGrossReturnRate * 100)} % Brutto-Marktrendite p.a.`,
  )

  const noteEl = getElementById<HTMLElement>('comp-note')
  noteEl.className = `comparison-note ${diff >= 0 ? 'tone-positive' : 'tone-negative'}`
  noteEl.textContent = `Differenz nach ${projectionYears} Jahren: ${formatCurrency(Math.abs(diff))} zugunsten der ${diff >= 0 ? 'Immobilie' : 'Depot-Alternative'}`
}

function renderWealthComposition(result: ProjectionResult, focusIndex: number | null = null): void {
  const el = getElementById<HTMLDivElement>('wealth-composition')
  const displayIndex = focusIndex ?? result.yearlyWealthPath.length - 1
  const snapshot =
    displayIndex === 0
      ? {
          headline: 'Stand bei Erwerb',
          propertyValueLabel: 'Objektwert bei Erwerb',
          propertyValue: result.apartment.purchasePrice,
          cumulativeCashflow: 0,
          remainingDebt: result.initialDebt,
          netWealth: result.initialNetWealth,
          depotValue: result.yearlyDepotPath[0] ?? result.startEquity,
        }
      : (() => {
          const row = result.yearlyLiquidityRows[displayIndex - 1]
          return {
            headline: `Stand nach ${displayIndex} ${displayIndex === 1 ? 'Jahr' : 'Jahren'}`,
            propertyValueLabel: `Objektwert nach ${displayIndex} ${displayIndex === 1 ? 'Jahr' : 'Jahren'}`,
            propertyValue: row.propertyValue,
            cumulativeCashflow: row.cumulativeCashflow,
            remainingDebt: row.remainingDebt,
            netWealth: row.netWealth,
            depotValue: result.yearlyDepotPath[displayIndex] ?? 0,
          }
        })()
  const resultRows = [
    { label: snapshot.propertyValueLabel, value: snapshot.propertyValue },
    { label: 'Kumulierter Cashflow', value: snapshot.cumulativeCashflow },
    { label: 'Restschuld', value: -snapshot.remainingDebt },
  ]

  el.innerHTML = `
    <p class="composition-title">So setzt sich das Ergebnis zusammen</p>
    <div class="composition-group">
      <p class="composition-subtitle">${snapshot.headline}</p>
      <div class="composition-rows">
        ${resultRows
          .map(
            (row) => `
          <div class="composition-row">
            <span>${row.label}</span>
            <span class="${getToneClass(row.value)}">${formatSignedCurrency(row.value)}</span>
          </div>`,
          )
          .join('')}
        <div class="composition-row composition-total">
          <span>Nettovermögen</span>
          <span>${formatCurrency(snapshot.netWealth)}</span>
        </div>
        <div class="composition-row composition-secondary-total">
          <span>Depotwert im selben Jahr</span>
          <span class="${getToneClass(snapshot.depotValue)}">${formatSignedCurrency(snapshot.depotValue)}</span>
        </div>
      </div>
    </div>
  `
}

function renderWealthPath(propertyValues: number[], depotValues: number[] | null = null): void {
  const pathElement = getElementById<HTMLDivElement>('wealth-path')
  const allValues = depotValues ? [...propertyValues, ...depotValues] : propertyValues
  const maxAbs = Math.max(...allValues.map((value) => Math.abs(value)), 1)
  pathElement.style.setProperty('--year-count', String(propertyValues.length))

  pathElement.innerHTML = propertyValues
    .map((value, index) => {
      const height = Math.max((Math.abs(value) / maxAbs) * 100, 3)
      const toneClass = value >= 0 ? 'path-bar-positive' : 'path-bar-negative'
      const depotValue = depotValues?.[index] ?? null
      const markerMarkup = depotValue === null
        ? ''
        : `<span class="path-depot-marker" style="bottom: ${Math.max((Math.abs(depotValue) / maxAbs) * 100, 1).toFixed(2)}%"></span>`
      const label = index === 0 ? '0' : String(index)
      const title = depotValue === null
        ? `${index === 0 ? 'Start' : `Jahr ${index}`}: ${formatCurrency(value)} Nettovermögen`
        : `${index === 0 ? 'Start' : `Jahr ${index}`}: Immobilie ${formatCurrency(value)} | Depot ${formatCurrency(depotValue)}`
      const activeClass = activeWealthPathIndex === index ? ' path-col-active' : ''
      return `
        <div class="path-col${activeClass}" data-wealth-index="${index}" tabindex="0" title="${title}">
          <span class="path-bar-wrap">
            <span class="path-bar ${toneClass}" style="height: ${height.toFixed(2)}%"></span>
            ${markerMarkup}
          </span>
          <span class="path-year">${label}</span>
        </div>
      `
    })
    .join('')

  const syncComposition = (index: number | null): void => {
    activeWealthPathIndex = index
    if (latestProjectionResult) {
      renderWealthComposition(latestProjectionResult, activeWealthPathIndex)
    }
    pathElement.querySelectorAll<HTMLElement>('.path-col').forEach((col) => {
      const isActive = index !== null && Number(col.dataset.wealthIndex) == index
      col.classList.toggle('path-col-active', isActive)
    })
  }

  pathElement.querySelectorAll<HTMLElement>('.path-col').forEach((col) => {
    const index = Number(col.dataset.wealthIndex)
    col.addEventListener('mouseenter', () => syncComposition(index))
    col.addEventListener('focus', () => syncComposition(index))
  })

  pathElement.addEventListener('mouseleave', () => syncComposition(null))
  pathElement.addEventListener('focusout', (event) => {
    const nextTarget = event.relatedTarget
    if (!(nextTarget instanceof Node) || !pathElement.contains(nextTarget)) {
      syncComposition(null)
    }
  })
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
  const modeLabel = basis === 'afterTax' ? 'Mit Steuereffekt' : 'Ohne Steuereffekt'

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
  let totalRent = 0
  let totalInterest = 0
  let totalPrincipal = 0
  let totalAncillaryCost = 0
  let totalTaxBenefit = 0
  let totalLiquidityBeforeTax = 0
  let totalLiquidityAfterTax = 0

  const rows = result.yearlyLiquidityRows
    .map((row, index) => {
      const yearlyInterest = row.kfwInterest + row.bankInterest + row.refinanceInterest
      const yearlyPrincipal = row.kfwPrincipal + row.bankPrincipal + row.refinancePrincipal
      const yearlyAncillaryCost = row.vacancyCost + row.managementCost + row.maintenanceCost
      const liquidityBeforeTax = row.cashflow - row.taxBenefit
      const liquidityAfterTax = row.cashflow
      const depotValue = result.yearlyDepotPath[index + 1] ?? result.depotWealth20
      cumulativeAfterTax += liquidityAfterTax
      totalRent += row.grossRent
      totalInterest += yearlyInterest
      totalPrincipal += yearlyPrincipal
      totalAncillaryCost += yearlyAncillaryCost
      totalTaxBenefit += row.taxBenefit
      totalLiquidityBeforeTax += liquidityBeforeTax
      totalLiquidityAfterTax += liquidityAfterTax

      return `
        <tr>
          <td>${row.calendarYear}</td>
          <td class="${getToneClass(row.grossRent)}">${formatSignedCurrency(row.grossRent)}</td>
          <td class="${getToneClass(-yearlyInterest)}">${formatSignedCurrency(-yearlyInterest)}</td>
          <td class="${getToneClass(-yearlyPrincipal)}">${formatSignedCurrency(-yearlyPrincipal)}</td>
          <td class="${getToneClass(-row.remainingDebt)}">${formatSignedCurrency(-row.remainingDebt)}</td>
          <td class="${getToneClass(-yearlyAncillaryCost)}">${formatSignedCurrency(-yearlyAncillaryCost)}</td>
          <td class="${getToneClass(row.taxBenefit)}">${formatSignedCurrency(row.taxBenefit)}</td>
          <td class="${getToneClass(liquidityBeforeTax)}">${formatSignedCurrency(liquidityBeforeTax)}</td>
          <td class="${getToneClass(liquidityAfterTax)}">${formatSignedCurrency(liquidityAfterTax)}</td>
          <td class="${getToneClass(cumulativeAfterTax)}">${formatSignedCurrency(cumulativeAfterTax)}</td>
          <td class="${getToneClass(row.propertyValue)}">${formatSignedCurrency(row.propertyValue)}</td>
          <td class="${getToneClass(depotValue)}">${formatSignedCurrency(depotValue)}</td>
        </tr>
      `
    })
    .join('')

  const finalRow = result.yearlyLiquidityRows[result.yearlyLiquidityRows.length - 1]
  const finalDepotValue = result.yearlyDepotPath[result.yearlyDepotPath.length - 1] ?? result.depotWealth20
  const summaryRow = finalRow
    ? `
        <tfoot>
          <tr class="liquidity-detail-summary-row">
            <td>Summe</td>
            <td class="${getToneClass(totalRent)}">${formatSignedCurrency(totalRent)}</td>
            <td class="${getToneClass(-totalInterest)}">${formatSignedCurrency(-totalInterest)}</td>
            <td class="${getToneClass(-totalPrincipal)}">${formatSignedCurrency(-totalPrincipal)}</td>
            <td class="${getToneClass(-finalRow.remainingDebt)}">${formatSignedCurrency(-finalRow.remainingDebt)}</td>
            <td class="${getToneClass(-totalAncillaryCost)}">${formatSignedCurrency(-totalAncillaryCost)}</td>
            <td class="${getToneClass(totalTaxBenefit)}">${formatSignedCurrency(totalTaxBenefit)}</td>
            <td class="${getToneClass(totalLiquidityBeforeTax)}">${formatSignedCurrency(totalLiquidityBeforeTax)}</td>
            <td class="${getToneClass(totalLiquidityAfterTax)}">${formatSignedCurrency(totalLiquidityAfterTax)}</td>
            <td class="${getToneClass(cumulativeAfterTax)}">${formatSignedCurrency(cumulativeAfterTax)}</td>
            <td class="${getToneClass(finalRow.propertyValue)}">${formatSignedCurrency(finalRow.propertyValue)}</td>
            <td class="${getToneClass(finalDepotValue)}">${formatSignedCurrency(finalDepotValue)}</td>
          </tr>
        </tfoot>`
    : ''

  return `
    <div class="liquidity-table-card liquidity-table-card-modal">
      <div class="liquidity-table-head">
        <div>
          <p class="liquidity-chart-title">Jährliche Liquiditätsdetails</p>
          <p class="liquidity-chart-copy">${startYear} bis ${endYear} mit allen Jahreswerten.</p>
          <p class="tax-model-note tax-model-note-compact">${result.taxDisclaimer}</p>
        </div>
        <div class="liquidity-table-summary">
          <p class="liquidity-table-summary-label">Startvermögen bei Erwerb</p>
          <p class="liquidity-table-summary-value">${formatCurrency(result.startEquity)} - ${formatCurrency(result.ancillaryCosts)} = ${formatCurrency(result.initialNetWealth)}</p>
        </div>
      </div>
      <div class="liquidity-table-scroll liquidity-table-scroll-modal">
        <table class="liquidity-detail-table" aria-label="Jährliche Einnahmen Ausgaben Details">
          <thead>
            <tr>
              <th>Jahr</th>
              <th>Miete</th>
              <th>Zins</th>
              <th>Tilg.</th>
              <th>Restsch.</th>
              <th>Nebenk.</th>
              <th>Steuereffekt</th>
              <th>Cashflow o. Effekt</th>
              <th>Cashflow m. Effekt</th>
              <th>Kum.</th>
              <th>Immo-Wert</th>
              <th>Depot-Wert</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
          ${summaryRow}
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
  isLiquidityModalOpen = true
  syncBodyModalState()
}

function closeLiquidityModal(): void {
  if (!isLiquidityModalOpen) {
    return
  }

  liquidityModal.classList.remove('liquidity-modal-open')
  liquidityModal.setAttribute('aria-hidden', 'true')
  isLiquidityModalOpen = false
  syncBodyModalState()
}

function openConfigEditor(): void {
  if (appMode === 'customer') {
    return
  }

  configEditor.classList.add('config-editor-open')
  configEditor.setAttribute('aria-hidden', 'false')
  isConfigEditorOpen = true
  syncBodyModalState()
}

function closeConfigEditor(): void {
  if (!isConfigEditorOpen) {
    return
  }

  configEditor.classList.remove('config-editor-open')
  configEditor.setAttribute('aria-hidden', 'true')
  isConfigEditorOpen = false
  syncBodyModalState()
}

function renderConfigEditorSummary(): void {
  const selectedApartment = getApartment(selectedApartmentId)
  const presetLabel = presetLabelInput.value.trim() || editorSourcePreset.label
  const presetId = presetIdInput.value.trim() || resolveCurrentPresetRouteId()

  setOptionalText('config-summary-preset', `${presetLabel} (${presetId})`)
  setOptionalText(
    'config-summary-scenario',
    `${selectedApartment.label} · ${formatCurrency(annualGrossIncome)} · ${getTaxTableLabel(selectedTaxTableMode)}`,
  )
  setOptionalText(
    'config-summary-timing',
    `Kauf ${config.assumptions.purchaseYear} · Miete ab Q${config.assumptions.rentStartQuarter} ${config.assumptions.rentStartYear} · AfA ab Q${config.assumptions.afaStartQuarter} ${config.assumptions.afaStartYear}`,
  )
}

function openCustomerLinkModal(): void {
  if (appMode === 'customer') {
    return
  }

  setCustomerLinkModalStatus('')
  customerLinkModal.classList.add('dialog-modal-open')
  customerLinkModal.setAttribute('aria-hidden', 'false')
  isCustomerLinkModalOpen = true
  syncBodyModalState()
  window.setTimeout(() => customerFirstNameInput.focus(), 40)
}

function closeCustomerLinkModal(): void {
  if (!isCustomerLinkModalOpen) {
    return
  }

  customerLinkModal.classList.remove('dialog-modal-open')
  customerLinkModal.setAttribute('aria-hidden', 'true')
  isCustomerLinkModalOpen = false
  syncBodyModalState()
}

function setCustomerLinkModalStatus(message: string, isError = false): void {
  customerLinkModalStatus.textContent = message
  customerLinkModalStatus.classList.toggle('config-status-error', isError)
}

function openPresetOpenModal(): void {
  if (appMode === 'customer') {
    return
  }

  setPresetOpenModalStatus('')
  presetOpenModal.classList.add('dialog-modal-open')
  presetOpenModal.setAttribute('aria-hidden', 'false')
  isPresetOpenModalOpen = true
  syncBodyModalState()
  window.setTimeout(() => presetOpenConfirmButton.focus(), 40)
}

function closePresetOpenModal(clearPending = true): void {
  if (!isPresetOpenModalOpen) {
    if (clearPending) {
      pendingPresetOpenAction = null
    }
    return
  }

  presetOpenModal.classList.remove('dialog-modal-open')
  presetOpenModal.setAttribute('aria-hidden', 'true')
  isPresetOpenModalOpen = false
  if (clearPending) {
    pendingPresetOpenAction = null
  }
  setPresetOpenModalStatus('')
  syncBodyModalState()
}

function setPresetOpenModalStatus(message: string, isError = false): void {
  presetOpenModalStatus.textContent = message
  presetOpenModalStatus.classList.toggle('config-status-error', isError)
}

async function confirmPendingPresetOpen(): Promise<void> {
  const action = pendingPresetOpenAction
  if (!action) {
    closePresetOpenModal()
    return
  }

  pendingPresetOpenAction = null
  closePresetOpenModal(false)

  try {
    await action()
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Preset konnte nicht geöffnet werden.'
    setConfigStatus(`Preset konnte nicht geöffnet werden: ${message}`, true)
  }
}

async function requestPresetOpen(action: () => Promise<void>): Promise<void> {
  if (!isEditorDirty) {
    await action()
    return
  }

  pendingPresetOpenAction = action
  openPresetOpenModal()
}

function syncBodyModalState(): void {
  document.body.classList.toggle(
    'body-modal-open',
    isLiquidityModalOpen || isCustomerLinkModalOpen || isPresetOpenModalOpen || isConfigEditorOpen,
  )
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

  liquidityViewMode = 'afterTaxChart'
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
    return 'Mit Steuereffekt'
  }
  if (viewMode === 'beforeTaxChart') {
    return 'Ohne Steuereffekt'
  }
  return 'Tabelle'
}

function getLiquidityToggleLabel(viewMode: LiquidityViewMode): string {
  if (viewMode === 'afterTaxChart') {
    return 'Ohne Steuereffekt'
  }
  if (viewMode === 'beforeTaxChart') {
    return 'Tabelle'
  }
  return 'Mit Steuereffekt'
}

function syncUrlState(): void {
  const params = new URLSearchParams()

  if (activeCustomerScenarioId) {
    params.set(CUSTOMER_SCENARIO_QUERY_KEY, activeCustomerScenarioId)
  } else {
    params.set('preset', resolveCurrentPresetRouteId())
    params.set('mode', appMode)

    if (appMode === 'customer') {
      appendCustomerIdentityParams(params, getCurrentCustomerIdentity())
    }
  }

  appendScenarioParams(
    params,
    selectedApartmentId,
    selectedTaxTableMode,
    annualGrossIncome,
    annualGrowthRatePercent,
    investedEquity,
    depotReturnRatePercent,
  )

  const nextUrl = `${window.location.pathname}?${params.toString()}`
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
  investedEquity = getScenarioDefaultEquity(selectedApartmentId)

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

  const depot = params.get('depot')
  if (depot) {
    depotReturnRatePercent = clamp(
      parseNumber(depot, depotReturnRatePercent),
      depotBounds.min,
      depotBounds.max,
    )
  }

}

function buildLocalPreviewUrl(
  apartmentId: ApartmentId,
  taxTableMode: TaxTableMode,
  grossAnnualIncomeValue: number,
  growthRatePercent: number,
  equityAmount: number,
  depotRatePercent: number,
  customerIdentity: CustomerIdentity | null = null,
): string {
  const params = new URLSearchParams()
  params.set(PREVIEW_PRESET_QUERY_KEY, 'local')
  params.set('mode', 'customer')
  appendCustomerIdentityParams(params, customerIdentity)
  appendScenarioParams(
    params,
    apartmentId,
    taxTableMode,
    grossAnnualIncomeValue,
    growthRatePercent,
    equityAmount,
    depotRatePercent,
  )
  return `${window.location.origin}${resolveAppBasePath()}?${params.toString()}`
}

function buildScenarioUrl(
  apartmentId: ApartmentId,
  taxTableMode: TaxTableMode,
  grossAnnualIncomeValue: number,
  growthRatePercent: number,
  equityAmount: number,
  depotRatePercent: number,
  targetMode: AppMode = appMode,
  presetId: string = resolveCurrentPresetRouteId(),
  customerScenarioId: string | null = activeCustomerScenarioId,
  customerIdentity: CustomerIdentity | null = null,
): string {
  const params = new URLSearchParams()

  if (customerScenarioId) {
    params.set(CUSTOMER_SCENARIO_QUERY_KEY, customerScenarioId)
  } else {
    params.set('preset', presetId)
    params.set('mode', targetMode)

    if (targetMode === 'customer') {
      appendCustomerIdentityParams(params, customerIdentity)
    }
  }

  appendScenarioParams(
    params,
    apartmentId,
    taxTableMode,
    grossAnnualIncomeValue,
    growthRatePercent,
    equityAmount,
    depotRatePercent,
  )

  return buildAppUrl(targetMode, params)
}

function buildCustomerScenarioShareUrl(customerScenarioId: string): string {
  const params = new URLSearchParams()
  params.set(CUSTOMER_SCENARIO_QUERY_KEY, customerScenarioId)
  return buildAppUrl('customer', params)
}

function updateConsultationMailLink(result: ProjectionResult): void {
  const customerIdentity = getCurrentCustomerIdentity()
  const scenarioUrl = buildScenarioUrl(
    selectedApartmentId,
    selectedTaxTableMode,
    annualGrossIncome,
    annualGrowthRatePercent,
    investedEquity,
    depotReturnRatePercent,
    'customer',
    resolveDraftPresetId(),
    activeCustomerScenarioId,
    customerIdentity,
  )
  const subject = 'Beratung zum Immobilieninvestment York Living'
  const bodyLines = [
    'Guten Tag Herr Peters,',
    '',
    'bitte kontaktieren Sie mich zeitnah, um ein Beratungsgespräch zum Immobilieninvestment York Living zu vereinbaren.',
    '',
    'Meine aktuelle Berechnung:',
  ]

  if (hasCustomerIdentity(customerIdentity)) {
    bodyLines.push(`- Kunde: ${formatCustomerDisplayName(customerIdentity)}`)
  }

  bodyLines.push(
    `- Wohnungsoption: ${result.apartment.label} (${result.apartment.subtitle})`,
    `- Steuermodell: ${getTaxTableLabel(result.taxTableMode)}`,
    `- Bruttojahreseinkommen: ${formatCurrency(result.annualGrossIncome)}`,
    `- Wertentwicklung p.a.: ${formatSignedPercent(result.annualGrowthRate * 100)} %`,
    `- Eingesetztes Eigenkapital: ${formatCurrency(result.startEquity)}`,
    '- Steuerdarstellung: modellhafter Steuereffekt, ohne Soli/Kirchensteuer',
    '',
    `Szenario-Link: ${scenarioUrl}`,
  )

  const body = bodyLines.join('\n')
  const query = `subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  consultationMailLink.href = `mailto:${CONSULTATION_EMAIL}?${query}`
}

function setText(targetId: string, value: string): void {
  getElementById<HTMLElement>(targetId).textContent = value
}

function setOptionalText(targetId: string, value: string): void {
  const element = document.getElementById(targetId)
  if (element) {
    element.textContent = value
  }
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
        {
          type: 'number',
          id: 'config-zinsbindung-jahre',
          label: 'Zinsbindung (Jahre)',
          hint: 'Dauer der Zinsbindung ab Kaufjahr.',
          mode: 'number',
          min: 5,
          max: 20,
          step: 1,
          get: (value) => value.assumptions.zinsbindungJahre,
          set: (value, next) => {
            value.assumptions.zinsbindungJahre = next
          },
        },
        {
          type: 'number',
          id: 'config-refinance-interest-rate',
          label: 'Anschlusszins',
          hint: 'Zinssatz nach Auslauf der Zinsbindung.',
          mode: 'percent',
          min: 0,
          max: 15,
          step: 0.05,
          get: (value) => value.assumptions.refinanceInterestRate,
          set: (value, next) => {
            value.assumptions.refinanceInterestRate = next
          },
        },
        {
          type: 'number',
          id: 'config-refinance-repayment-rate',
          label: 'Anschlusstilgung',
          hint: 'Tilgungssatz nach Auslauf der Zinsbindung.',
          mode: 'percent',
          min: 0,
          max: 15,
          step: 0.05,
          get: (value) => value.assumptions.refinanceRepaymentRate,
          set: (value, next) => {
            value.assumptions.refinanceRepaymentRate = next
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
          id: 'config-depot-cost-rate',
          label: 'Depotkosten p.a.',
          hint: 'Laufende Kostenquote auf den Depotbestand im Vergleichsmodell.',
          mode: 'percent',
          min: 0,
          max: 5,
          step: 0.1,
          get: (value) => value.assumptions.depotCostRate,
          set: (value, next) => {
            value.assumptions.depotCostRate = next
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
      title: 'AfA & Projektion',
      copy: 'Abschreibungsparameter und Projektionslaufzeit.',
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
  nextConfig.assumptions.depotCostRate = clamp(nextConfig.assumptions.depotCostRate, 0, 0.1)
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

function savePreviewPreset(value: RuntimePreset): void {
  window.localStorage.setItem(PREVIEW_PRESET_STORAGE_KEY, JSON.stringify(value, null, 2))
}

function loadPreviewPreset(): RuntimePreset | null {
  try {
    const rawValue = window.localStorage.getItem(PREVIEW_PRESET_STORAGE_KEY)
    if (!rawValue) {
      return null
    }
    return validatePreset(JSON.parse(rawValue) as unknown)
  } catch {
    window.localStorage.removeItem(PREVIEW_PRESET_STORAGE_KEY)
    return null
  }
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
    zinsbindungJahre: asNumber(
      assumptionsCandidate.zinsbindungJahre,
      'assumptions.zinsbindungJahre',
    ),
    refinanceInterestRate: asNumber(
      assumptionsCandidate.refinanceInterestRate,
      'assumptions.refinanceInterestRate',
    ),
    refinanceRepaymentRate: asNumber(
      assumptionsCandidate.refinanceRepaymentRate,
      'assumptions.refinanceRepaymentRate',
    ),
    monumentShare: asNumber(assumptionsCandidate.monumentShare, 'assumptions.monumentShare'),
    annualGrowthRate: asNumber(
      assumptionsCandidate.annualGrowthRate,
      'assumptions.annualGrowthRate',
    ),
    depotCostRate: asOptionalNumber(
      assumptionsCandidate.depotCostRate,
      DEFAULT_DEPOT_COST_RATE,
      'assumptions.depotCostRate',
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



function buildApartmentSubtitle(apartmentId: ApartmentId, size: number): string {
  const rooms = apartmentId === 'a' ? '1-Zimmer' : '2-Zimmer'
  return `${rooms}, ca. ${Math.round(size)} m²`
}

function setConfigStatus(message: string, isError = false): void {
  configStatus.textContent = message
  configStatus.classList.toggle('config-status-error', isError)
}

function cloneRuntimePreset(preset: RuntimePreset): RuntimePreset {
  return {
    ...preset,
    calculationConfig: deepCloneConfig(preset.calculationConfig),
    scenarioDefaults: { ...preset.scenarioDefaults },
  }
}

function asNumber(value: unknown, path: string): number {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    throw new Error(`${path} muss eine Zahl sein.`)
  }
  return value
}

function asOptionalNumber(value: unknown, fallback: number, path: string): number {
  if (value === undefined || value === null || value === '') {
    return fallback
  }
  return asNumber(value, path)
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

function buildEmbeddedDefaultPreset(sourceConfig: CalculationConfig): RuntimePreset {
  const apartmentId = sourceConfig.defaultApartmentId
  return {
    id: DEFAULT_PRESET_ID,
    label: 'York Living Standard',
    version: '1.0.0',
    updatedAt: '2026-03-07T00:00:00.000Z',
    calculationConfig: deepCloneConfig(sourceConfig),
    scenarioDefaults: {
      apartmentId,
      taxTableMode: 'grund',
      annualGrossIncome: sourceConfig.defaultAnnualGrossIncome,
      annualGrowthRatePercent: sourceConfig.assumptions.annualGrowthRate * 100,
      investedEquity: getDefaultEquityForApartmentFromConfig(sourceConfig, apartmentId),
      depotReturnRatePercent: 6,
    },
  }
}

async function loadPresetManifest(activePresetValue: RuntimePreset): Promise<PresetManifestEntry[]> {
  try {
    const response = await fetch(resolvePublicAssetPath('/presets/manifest.json'), { cache: 'no-store' })
    if (!response.ok) {
      throw new Error('Preset-Manifest konnte nicht geladen werden.')
    }
    const rawManifest = await response.json()
    const entries = validatePresetManifest(rawManifest)
    if (!entries.some((entry) => entry.id === activePresetValue.id)) {
      entries.unshift({ id: activePresetValue.id, label: activePresetValue.label })
    }
    return entries
  } catch {
    return [{ id: activePresetValue.id, label: activePresetValue.label }]
  }
}

async function loadProjectPreset(presetId: string): Promise<RuntimePreset> {
  const response = await fetch(resolvePublicAssetPath(`/presets/${presetId}.json`), {
    cache: 'no-store',
  })
  if (!response.ok) {
    throw new Error(`Preset ${presetId} konnte nicht geladen werden.`)
  }
  const rawPreset = await response.json()
  return validatePreset(rawPreset)
}

async function loadPresetContext(fallbackPreset: RuntimePreset): Promise<PresetContext> {
  const params = new URLSearchParams(window.location.search)
  const requestedPreviewPreset = params.get(PREVIEW_PRESET_QUERY_KEY)
  const requestedCustomerId = sanitizeCustomerScenarioId(params.get(CUSTOMER_SCENARIO_QUERY_KEY))

  if (requestedPreviewPreset === 'local') {
    const previewPreset = loadPreviewPreset()
    if (previewPreset) {
      return {
        mode: 'customer',
        preset: previewPreset,
        notice: 'Lokale Kundenvorschau mit dem aktuellen Editorstand ist aktiv.',
        hasExplicitPresetParam: false,
        customerScenario: null,
        customerScenarioId: null,
      }
    }
  }

  if (requestedCustomerId) {
    try {
      const response = await fetch(buildCustomerScenarioDataUrl(requestedCustomerId), { cache: 'no-store' })
      if (!response.ok) {
        throw new Error(`Kundenszenario ${requestedCustomerId} konnte nicht geladen werden.`)
      }
      const rawScenario = await response.json()
      const scenario = validateCustomerScenario(rawScenario)
      return {
        mode: 'customer',
        preset: scenario.preset,
        notice: null,
        hasExplicitPresetParam: false,
        customerScenario: scenario,
        customerScenarioId: scenario.id,
      }
    } catch {
      return {
        mode: 'customer',
        preset: fallbackPreset,
        notice: `Kundenszenario "${requestedCustomerId}" konnte nicht geladen werden. Es wird das Standard-Preset angezeigt.`,
        hasExplicitPresetParam: false,
        customerScenario: null,
        customerScenarioId: null,
      }
    }
  }

  const requestedMode = params.get('mode')
  const mode: AppMode = isAppMode(requestedMode) ? requestedMode : 'admin'
  const requestedPresetParam = params.get('preset')
  const requestedPresetId = sanitizePresetId(requestedPresetParam) ?? fallbackPreset.id
  const hasExplicitPresetParam = sanitizePresetId(requestedPresetParam) !== null

  try {
    return {
      mode,
      preset: await loadProjectPreset(requestedPresetId),
      notice: null,
      hasExplicitPresetParam,
      customerScenario: null,
      customerScenarioId: null,
    }
  } catch {
    const notice = requestedPresetId === fallbackPreset.id
      ? null
      : `Preset "${requestedPresetId}" konnte nicht geladen werden. Die eingebettete Standardkonfiguration wird verwendet.`

    return {
      mode,
      preset: fallbackPreset,
      notice,
      hasExplicitPresetParam,
      customerScenario: null,
      customerScenarioId: null,
    }
  }
}

function normalizeScenarioDefaults(candidate: ScenarioDefaults, sourceConfig: CalculationConfig): ScenarioDefaults {
  const fallback = buildEmbeddedDefaultPreset(sourceConfig).scenarioDefaults
  const apartmentId = sourceConfig.apartments.some((entry) => entry.id === candidate.apartmentId)
    ? candidate.apartmentId
    : fallback.apartmentId

  return {
    apartmentId,
    taxTableMode: candidate.taxTableMode,
    annualGrossIncome: clamp(candidate.annualGrossIncome, sourceConfig.incomeBounds.min, sourceConfig.incomeBounds.max),
    annualGrowthRatePercent: clamp(candidate.annualGrowthRatePercent, growthBounds.min, growthBounds.max),
    investedEquity: clamp(candidate.investedEquity, equityBounds.min, equityBounds.max),
    depotReturnRatePercent: clamp(candidate.depotReturnRatePercent, depotBounds.min, depotBounds.max),
  }
}

function validatePresetManifest(candidate: unknown): PresetManifestEntry[] {
  const source = Array.isArray(candidate)
    ? candidate
    : isRecord(candidate) && Array.isArray(candidate.presets)
      ? candidate.presets
      : null

  if (!source) {
    throw new Error('Preset-Manifest muss ein Array oder ein Objekt mit presets sein.')
  }

  const entries = source.flatMap((entry) => {
    if (!isRecord(entry)) {
      return []
    }
    const id = sanitizePresetId(typeof entry.id === 'string' ? entry.id : null)
    const label = typeof entry.label === 'string' ? entry.label.trim() : ''
    if (!id || !label) {
      return []
    }
    return [{ id, label }]
  })

  if (!entries.length) {
    throw new Error('Preset-Manifest enthält keine gültigen Einträge.')
  }

  return entries.sort((left, right) => left.label.localeCompare(right.label, 'de'))
}

function validatePreset(candidate: unknown): RuntimePreset {
  if (!isRecord(candidate)) {
    throw new Error('Preset muss ein JSON-Objekt sein.')
  }

  const calculationConfigValue = validateConfig(candidate.calculationConfig)
  const fallbackPreset = buildEmbeddedDefaultPreset(calculationConfigValue)
  const scenarioDefaults = validateScenarioDefaults(candidate.scenarioDefaults, calculationConfigValue)

  return {
    id: typeof candidate.id === 'string' && candidate.id.trim() ? candidate.id.trim() : fallbackPreset.id,
    label: typeof candidate.label === 'string' && candidate.label.trim() ? candidate.label.trim() : fallbackPreset.label,
    version: typeof candidate.version === 'string' && candidate.version.trim() ? candidate.version.trim() : fallbackPreset.version,
    updatedAt:
      typeof candidate.updatedAt === 'string' && candidate.updatedAt.trim()
        ? candidate.updatedAt.trim()
        : fallbackPreset.updatedAt,
    calculationConfig: calculationConfigValue,
    scenarioDefaults,
  }
}

function validateScenarioDefaults(candidate: unknown, sourceConfig: CalculationConfig): ScenarioDefaults {
  const fallback = buildEmbeddedDefaultPreset(sourceConfig).scenarioDefaults
  if (!isRecord(candidate)) {
    return fallback
  }

  const apartmentValue = typeof candidate.apartmentId === 'string' ? candidate.apartmentId : fallback.apartmentId
  const taxValue = typeof candidate.taxTableMode === 'string' ? candidate.taxTableMode : fallback.taxTableMode

  return normalizeScenarioDefaults(
    {
      apartmentId:
        isApartmentId(apartmentValue) && sourceConfig.apartments.some((entry) => entry.id === apartmentValue)
          ? apartmentValue
          : fallback.apartmentId,
      taxTableMode: isTaxTableMode(taxValue) ? taxValue : fallback.taxTableMode,
      annualGrossIncome: asOptionalNumber(candidate.annualGrossIncome, fallback.annualGrossIncome, 'scenarioDefaults.annualGrossIncome'),
      annualGrowthRatePercent: asOptionalNumber(
        candidate.annualGrowthRatePercent,
        fallback.annualGrowthRatePercent,
        'scenarioDefaults.annualGrowthRatePercent',
      ),
      investedEquity: asOptionalNumber(candidate.investedEquity, fallback.investedEquity, 'scenarioDefaults.investedEquity'),
      depotReturnRatePercent: asOptionalNumber(
        candidate.depotReturnRatePercent,
        fallback.depotReturnRatePercent,
        'scenarioDefaults.depotReturnRatePercent',
      ),
    },
    sourceConfig,
  )
}

function getDefaultEquityForApartmentFromConfig(sourceConfig: CalculationConfig, apartmentId: ApartmentId): number {
  const apartment = sourceConfig.apartments.find((entry) => entry.id === apartmentId)
  if (!apartment) {
    return equityBounds.min
  }
  const ancillaryCosts = apartment.purchasePrice * sourceConfig.assumptions.ancillaryCostRate
  return clamp(ancillaryCosts, equityBounds.min, equityBounds.max)
}

function getScenarioDefaultEquity(apartmentId: ApartmentId): number {
  return apartmentId === scenarioDefaults.apartmentId
    ? scenarioDefaults.investedEquity
    : getDefaultEquityForApartment(apartmentId)
}

function buildCurrentPreset(nextConfig: CalculationConfig): RuntimePreset {
  return {
    ...editorSourcePreset,
    id: requireDraftPresetId(),
    label: resolveDraftPresetLabel(),
    updatedAt: new Date().toISOString(),
    calculationConfig: deepCloneConfig(nextConfig),
    scenarioDefaults: {
      apartmentId: selectedApartmentId,
      taxTableMode: selectedTaxTableMode,
      annualGrossIncome,
      annualGrowthRatePercent,
      investedEquity,
      depotReturnRatePercent,
    },
  }
}

function exportCurrentPresetAsJson(): RuntimePreset {
  const nextConfig = buildConfigFromForm(configForm)
  const nextPreset = buildCurrentPreset(nextConfig)
  downloadTextFile(`${nextPreset.id}.json`, JSON.stringify(nextPreset, null, 2))
  return nextPreset
}

function buildEditorDraftSignature(): string {
  const formSnapshot = Object.fromEntries(
    configSections.flatMap((section) =>
      section.fields.map((field) => {
        const element = configForm.querySelector<HTMLInputElement | HTMLSelectElement>(`#${field.id}`)
        return [field.id, element?.value ?? '']
      }),
    ),
  )

  return JSON.stringify({
    presetId: presetIdInput.value.trim(),
    presetLabel: presetLabelInput.value.trim(),
    selectedApartmentId,
    selectedTaxTableMode,
    annualGrossIncome,
    annualGrowthRatePercent,
    investedEquity,
    depotReturnRatePercent,
    formSnapshot,
  })
}

function refreshEditorDirtyState(): void {
  isEditorDirty = buildEditorDraftSignature() !== editorBaselineSignature
  configEditor.classList.toggle('config-editor-dirty', isEditorDirty)
}

function commitEditorBaseline(): void {
  editorBaselineSignature = buildEditorDraftSignature()
  refreshEditorDirtyState()
}

function syncPresetSelector(): void {
  const candidateId = loadedProjectPresetId ?? initialLoadedProjectPresetId ?? presetManifest[0]?.id ?? DEFAULT_PRESET_ID
  if (presetManifest.some((entry) => entry.id === candidateId)) {
    presetSelector.value = candidateId
  }
}

function applyRuntimePreset(preset: RuntimePreset): void {
  editorSourcePreset = cloneRuntimePreset(preset)
  loadedProjectPresetId = presetManifest.some((entry) => entry.id === preset.id) ? preset.id : null

  overwriteConfigSnapshot(config, preset.calculationConfig)
  syncConfigFormValues(configForm, config)

  const nextScenarioDefaults = normalizeScenarioDefaults(preset.scenarioDefaults, config)
  scenarioDefaults.apartmentId = nextScenarioDefaults.apartmentId
  scenarioDefaults.taxTableMode = nextScenarioDefaults.taxTableMode
  scenarioDefaults.annualGrossIncome = nextScenarioDefaults.annualGrossIncome
  scenarioDefaults.annualGrowthRatePercent = nextScenarioDefaults.annualGrowthRatePercent
  scenarioDefaults.investedEquity = nextScenarioDefaults.investedEquity
  scenarioDefaults.depotReturnRatePercent = nextScenarioDefaults.depotReturnRatePercent

  selectedApartmentId = nextScenarioDefaults.apartmentId
  selectedTaxTableMode = nextScenarioDefaults.taxTableMode
  annualGrossIncome = nextScenarioDefaults.annualGrossIncome
  annualGrowthRatePercent = nextScenarioDefaults.annualGrowthRatePercent
  investedEquity = nextScenarioDefaults.investedEquity
  depotReturnRatePercent = nextScenarioDefaults.depotReturnRatePercent

  presetIdInput.value = sanitizePresetId(preset.id) ?? DEFAULT_PRESET_ID
  presetLabelInput.value = preset.label.trim() || 'Neues Preset'
  syncPresetSelector()

  renderApartmentCards()
  renderTaxTableSelection()
  writeInputValue(annualGrossIncome)
  writeGrowthInputValue(annualGrowthRatePercent)
  writeEquityInputValue(investedEquity)
  renderConfigEditorSummary()
  commitEditorBaseline()
  renderProjection()
}

function overwriteConfigSnapshot(target: CalculationConfig, source: CalculationConfig): void {
  const clone = deepCloneConfig(source)
  target.defaultApartmentId = clone.defaultApartmentId
  target.defaultAnnualGrossIncome = clone.defaultAnnualGrossIncome
  Object.assign(target.incomeBounds, clone.incomeBounds)
  Object.assign(target.equityModel, clone.equityModel)

  const { afaSchedule, ...assumptionValues } = clone.assumptions
  Object.assign(target.assumptions, assumptionValues)
  target.assumptions.afaSchedule.splice(
    0,
    target.assumptions.afaSchedule.length,
    ...afaSchedule.map((entry) => ({ ...entry })),
  )

  target.taxBrackets.splice(
    0,
    target.taxBrackets.length,
    ...clone.taxBrackets.map((entry) => ({ ...entry })),
  )

  target.apartments.splice(
    0,
    target.apartments.length,
    ...clone.apartments.map((entry) => ({ ...entry })),
  )
}

function syncConfigFormValues(form: HTMLFormElement, sourceConfig: CalculationConfig): void {
  for (const section of configSections) {
    for (const field of section.fields) {
      if (field.type === 'select') {
        const select = getFormElement<HTMLSelectElement>(form, field.id)
        select.value = field.get(sourceConfig)
        continue
      }

      const input = getFormElement<HTMLInputElement>(form, field.id)
      input.value = formatConfigInputValue(field.get(sourceConfig), field.mode)
    }
  }
}

function renderPresetManifestOptions(entries: PresetManifestEntry[], currentId: string): string {
  return entries
    .map((entry) => {
      const selected = entry.id === currentId ? ' selected' : ''
      return `<option value="${escapeHtml(entry.id)}"${selected}>${escapeHtml(entry.label)}</option>`
    })
    .join('')
}

function resolveCurrentPresetRouteId(): string {
  return loadedProjectPresetId ?? resolveDraftPresetId()
}

function resolveDraftPresetId(): string {
  return sanitizePresetId(presetIdInput.value) ?? loadedProjectPresetId ?? editorSourcePreset.id
}

function requireDraftPresetId(): string {
  const presetId = sanitizePresetId(presetIdInput.value)
  if (!presetId) {
    throw new Error('Preset-ID darf nur Buchstaben, Zahlen und Bindestriche enthalten.')
  }
  return presetId
}

function resolveDraftPresetLabel(): string {
  const label = presetLabelInput.value.trim()
  return label || editorSourcePreset.label
}

function resolveDraftCustomerIdentity(): CustomerIdentity {
  return normalizeCustomerIdentity({
    firstName: customerFirstNameInput.value,
    lastName: customerLastNameInput.value,
  })
}


function getCurrentCustomerIdentity(): CustomerIdentity {
  if (appMode === 'admin') {
    return resolveDraftCustomerIdentity()
  }
  return initialCustomerIdentity
}

function readCustomerIdentityFromParams(params: URLSearchParams): CustomerIdentity {
  return normalizeCustomerIdentity({
    firstName: params.get(CUSTOMER_FIRST_NAME_QUERY_KEY) ?? params.get('firstName') ?? '',
    lastName: params.get(CUSTOMER_LAST_NAME_QUERY_KEY) ?? params.get('lastName') ?? '',
  })
}

function mergeCustomerIdentity(
  primary: CustomerIdentity | null | undefined,
  fallback: CustomerIdentity | null | undefined,
): CustomerIdentity {
  const primaryIdentity = normalizeCustomerIdentity(primary)
  const fallbackIdentity = normalizeCustomerIdentity(fallback)

  return {
    firstName: primaryIdentity.firstName || fallbackIdentity.firstName,
    lastName: primaryIdentity.lastName || fallbackIdentity.lastName,
  }
}

function normalizeCustomerIdentity(candidate: CustomerIdentity | null | undefined): CustomerIdentity {
  return {
    firstName: normalizeCustomerNamePart(candidate?.firstName ?? ''),
    lastName: normalizeCustomerNamePart(candidate?.lastName ?? ''),
  }
}

function normalizeCustomerNamePart(value: string): string {
  return value.replace(/\s+/g, ' ').trim()
}

function hasCustomerIdentity(candidate: CustomerIdentity | null | undefined): boolean {
  const identity = normalizeCustomerIdentity(candidate)
  return Boolean(identity.firstName || identity.lastName)
}

function formatCustomerDisplayName(candidate: CustomerIdentity | null | undefined): string {
  const identity = normalizeCustomerIdentity(candidate)
  return [identity.firstName, identity.lastName].filter(Boolean).join(' ')
}

function appendCustomerIdentityParams(params: URLSearchParams, customerIdentity: CustomerIdentity | null | undefined): void {
  const identity = normalizeCustomerIdentity(customerIdentity)
  if (identity.firstName) {
    params.set(CUSTOMER_FIRST_NAME_QUERY_KEY, identity.firstName)
  }
  if (identity.lastName) {
    params.set(CUSTOMER_LAST_NAME_QUERY_KEY, identity.lastName)
  }
}

function appendScenarioParams(
  params: URLSearchParams,
  apartmentId: ApartmentId,
  taxTableMode: TaxTableMode,
  grossAnnualIncomeValue: number,
  growthRatePercent: number,
  equityAmount: number,
  depotRatePercent: number,
): void {
  params.set('apartment', apartmentId)
  params.set('tax', taxTableMode)
  params.set('gross', String(Math.round(grossAnnualIncomeValue)))
  params.set('growth', String(growthRatePercent))
  params.set('equity', String(Math.round(equityAmount)))
  params.set('depot', String(depotRatePercent))
}

function buildAppUrl(targetMode: AppMode, params: URLSearchParams): string {
  return `${resolveAppOrigin(targetMode)}${resolveAppBasePath()}?${params.toString()}`
}

function resolveAppOrigin(targetMode: AppMode): string {
  if (isLocalRuntime()) {
    return window.location.origin
  }
  return targetMode === 'customer' ? CUSTOMER_APP_ORIGIN : ADVISOR_APP_ORIGIN
}

function resolveAppBasePath(): string {
  return resolvePublicAssetPath('')
}

function buildCustomerScenarioDataUrl(customerScenarioId: string): string {
  return `${CUSTOMER_SCENARIO_DATA_ROOT}/${customerScenarioId}.json`
}

function buildCustomerScenarioApiUrl(): string {
  return `${resolveAppOrigin('customer')}${resolvePublicAssetPath(CUSTOMER_SCENARIO_API_PATH)}`
}

function sanitizeCustomerScenarioId(value: string | null): string | null {
  if (!value) {
    return null
  }
  const normalized = value.trim()
  return /^[a-z0-9_-]+$/i.test(normalized) ? normalized : null
}

function isLocalRuntime(): boolean {
  return LOCAL_APP_HOSTNAMES.has(window.location.hostname)
}

async function createCustomerScenarioLink(customerIdentity: CustomerIdentity | null = null): Promise<{ id: string; customerUrl: string }> {
  const response = await fetch(buildCustomerScenarioApiUrl(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      customer: normalizeCustomerIdentity(customerIdentity),
      preset: buildCurrentPreset(buildConfigFromForm(configForm)),
    }),
  })

  const payload = await parseJsonResponse(response)

  if (!response.ok) {
    const message = extractApiErrorMessage(payload)
    throw new Error(message || `Kundenlink konnte nicht generiert werden (${response.status}).`)
  }

  const customerScenarioId = validateCustomerScenarioCreateResponse(payload)
  return {
    id: customerScenarioId,
    customerUrl: buildCustomerScenarioShareUrl(customerScenarioId),
  }
}

async function parseJsonResponse(response: Response): Promise<unknown> {
  const body = await response.text()
  if (!body) {
    return null
  }

  try {
    return JSON.parse(body)
  } catch {
    return { message: body }
  }
}

function extractApiErrorMessage(payload: unknown): string | null {
  if (!isRecord(payload)) {
    return null
  }

  if (typeof payload.error === 'string' && payload.error.trim()) {
    return payload.error.trim()
  }

  if (typeof payload.message === 'string' && payload.message.trim()) {
    return payload.message.trim()
  }

  return null
}

function validateCustomerScenarioCreateResponse(payload: unknown): string {
  if (!isRecord(payload)) {
    throw new Error('Antwort des Kundenszenario-Endpunkts ist ungültig.')
  }

  const id = sanitizeCustomerScenarioId(typeof payload.id === 'string' ? payload.id : null)
  if (!id) {
    throw new Error('Kundenszenario-ID fehlt in der Serverantwort.')
  }

  return id
}

function validateCustomerScenario(candidate: unknown): CustomerScenarioSnapshot {
  if (!isRecord(candidate)) {
    throw new Error('Kundenszenario muss ein JSON-Objekt sein.')
  }

  const id = sanitizeCustomerScenarioId(typeof candidate.id === 'string' ? candidate.id : null)
  if (!id) {
    throw new Error('Kundenszenario-ID fehlt oder ist ungültig.')
  }

  return {
    id,
    createdAt:
      typeof candidate.createdAt === 'string' && candidate.createdAt.trim()
        ? candidate.createdAt.trim()
        : new Date().toISOString(),
    customer: validateCustomerIdentity(candidate.customer),
    preset: validatePreset(candidate.preset),
  }
}

function validateCustomerIdentity(candidate: unknown): CustomerIdentity {
  if (!isRecord(candidate)) {
    return { firstName: '', lastName: '' }
  }

  return normalizeCustomerIdentity({
    firstName: typeof candidate.firstName === 'string' ? candidate.firstName : '',
    lastName: typeof candidate.lastName === 'string' ? candidate.lastName : '',
  })
}

function downloadTextFile(filename: string, text: string): void {
  const blob = new Blob([text], { type: 'application/json;charset=utf-8' })
  const href = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = href
  anchor.download = filename
  document.body.append(anchor)
  anchor.click()
  anchor.remove()
  window.setTimeout(() => URL.revokeObjectURL(href), 0)
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function sanitizePresetId(value: string | null): string | null {
  if (!value) {
    return null
  }
  const normalized = value.trim()
  return /^[a-z0-9-]+$/i.test(normalized) ? normalized : null
}

function isAppMode(value: string | null): value is AppMode {
  return value === 'admin' || value === 'customer'
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


