import type {
  CalculationConfig,
  HeroSlide,
  RuntimePreset,
  ScenarioDefaults,
} from './dashboard'

export type ReviewStatus = 'draft' | 'reviewed' | 'approved'
export type ConfidenceLevel = 'high' | 'medium' | 'low'

export type PropertyFactCard = {
  id: string
  label: string
  value: string
  detail: string
  explanation: string
}

export type PropertyLocationContent = {
  title: string
  detail: string
  buttonLabel: string
}

export type PropertyMarketFact = {
  id: string
  number: string
  title: string
  copy?: string
  compare?: [string, string]
  barType?: 'single' | 'demand' | 'dual'
  barValue?: number
  secondaryBarValue?: number
}

export type PropertyIdentity = {
  slug: string
  title: string
  subtitle?: string
  address: string
  city: string
  mapUrl: string
}

export type PropertyContact = {
  consultationEmail: string
  consultationPhoneLabel: string
  consultationPhoneLink: string
  bookingUrl: string
}

export type DepreciationProfile = {
  type: 'linear' | 'monument-7i' | 'sanierungsgebiet-7h' | 'combined' | 'special-7b'
  label: string
  confidence: ConfidenceLevel
  notes: string[]
}

export type FundingProfile = {
  type: 'kfw-261' | 'kfw-297-298' | 'bank-loan' | 'other'
  label: string
  confidence: ConfidenceLevel
  notes: string[]
}

export type SubsidyEvent = {
  id: string
  type: 'tilgungszuschuss' | 'sondertilgung' | 'grant'
  label: string
  amount: number
  timing: string
  confidence: ConfidenceLevel
  notes: string[]
}

export type PropertyFinanceModel = {
  defaults: CalculationConfig
  scenarioDefaults: ScenarioDefaults
  taxModelMode: 'approximate'
  taxDisclaimer: string
  depreciationProfile: DepreciationProfile
  fundingProfiles: FundingProfile[]
  subsidyEvents: SubsidyEvent[]
}

export type PropertyBundle = {
  identity: PropertyIdentity
  contact: PropertyContact
  content: {
    hero: {
      eyebrow: string
      headline: string
      intro: string
      customerLead: string
      advisorLead: string
      backgroundImage: string
      facts: PropertyFactCard[]
      location: PropertyLocationContent
      marketFacts: {
        title: string
        lead: string
        items: PropertyMarketFact[]
      }
      journeySteps: Array<{
        title: string
        copy: string
      }>
    }
  }
  media: {
    heroSlides: HeroSlide[]
    gallery?: Array<{ image: string; alt: string; caption?: string }>
  }
  financeModel: PropertyFinanceModel
  presets: RuntimePreset[]
  compliance: {
    reviewStatus: ReviewStatus
    warnings: string[]
    extractionConfidence: Record<string, ConfidenceLevel>
  }
}
