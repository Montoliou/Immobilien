export const ADVISOR_APP_ORIGIN = 'https://mlp-mediziner-beratung.de'
export const CUSTOMER_APP_ORIGIN = 'https://montolio.de'
export const CUSTOMER_SCENARIO_QUERY_KEY = 'customer'
export const CUSTOMER_FIRST_NAME_QUERY_KEY = 'first'
export const CUSTOMER_LAST_NAME_QUERY_KEY = 'last'
export const CUSTOMER_SCENARIO_API_PATH = '/api/create-customer-scenario.php'
export const LOCAL_APP_HOSTNAMES = new Set(['127.0.0.1', 'localhost'])
export const DEFAULT_PROPERTY_SLUG = (import.meta.env.VITE_PROPERTY_SLUG || 'yorkliving').trim().toLowerCase()
export const DEFAULT_DEPOT_COST_RATE = 0.008
export const DEPOT_CAPITAL_GAINS_TAX_RATE = 0.26375
export const TAX_MODEL_DISCLAIMER =
  'Steuerliche Wirkung modellhaft: Grundlage ist ein angenähertes zvE; Soli und Kirchensteuer sind nicht berücksichtigt.'

export function isLocalRuntime(hostname: string = window.location.hostname): boolean {
  return LOCAL_APP_HOSTNAMES.has(hostname)
}

export function resolvePublicAssetPath(path: string): string {
  const normalizedPath = path.startsWith('/') ? path.slice(1) : path
  const base = import.meta.env.BASE_URL || '/'
  const normalizedBase = base.endsWith('/') ? base : `${base}/`
  return normalizedPath ? `${normalizedBase}${normalizedPath}` : normalizedBase
}

export function resolveRuntimeBaseSegment(): string {
  const base = (import.meta.env.BASE_URL || '/').replace(/^\/+|\/+$/g, '')
  return base || 'YorkLiving'
}

export function resolveCustomerScenarioDataRoot(): string {
  return `/${resolveRuntimeBaseSegment()}-data/customer-scenarios`
}
