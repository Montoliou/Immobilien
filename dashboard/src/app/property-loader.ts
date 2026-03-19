import type { PresetManifestEntry, RuntimePreset } from '../types/dashboard'
import type { PropertyBundle } from '../types/property'
import { DEFAULT_PROPERTY_SLUG, resolvePublicAssetPath } from './app-config'

function normalizeAssetPath(propertySlug: string, assetPath: string): string {
  if (!assetPath) {
    return assetPath
  }
  if (assetPath.startsWith('http://') || assetPath.startsWith('https://') || assetPath.startsWith('/')) {
    return assetPath
  }
  return resolvePublicAssetPath(`properties/${propertySlug}/${assetPath.replace(/^\.\//, '')}`)
}

function normalizeBundleAssets(bundle: PropertyBundle): PropertyBundle {
  const propertySlug = bundle.identity.slug
  return {
    ...bundle,
    content: {
      ...bundle.content,
      hero: {
        ...bundle.content.hero,
        backgroundImage: normalizeAssetPath(propertySlug, bundle.content.hero.backgroundImage),
      },
    },
    media: {
      ...bundle.media,
      heroSlides: bundle.media.heroSlides.map((slide) => ({
        ...slide,
        image: normalizeAssetPath(propertySlug, slide.image),
      })),
      gallery: bundle.media.gallery?.map((entry) => ({
        ...entry,
        image: normalizeAssetPath(propertySlug, entry.image),
      })),
    },
    presets: bundle.presets.map((preset) => ({
      ...preset,
      calculationConfig: {
        ...preset.calculationConfig,
        apartments: preset.calculationConfig.apartments.map((apartment) => ({
          ...apartment,
          image: normalizeAssetPath(propertySlug, apartment.image),
        })),
      },
    })),
  }
}

export function resolvePropertySlug(): string {
  const params = new URLSearchParams(window.location.search)
  const explicit = params.get('property')?.trim().toLowerCase()
  return explicit || DEFAULT_PROPERTY_SLUG
}

export async function loadPropertyBundle(propertySlug: string): Promise<PropertyBundle> {
  const response = await fetch(resolvePublicAssetPath(`properties/${propertySlug}/bundle.json`), { cache: 'no-store' })
  if (!response.ok) {
    throw new Error(`Property-Bundle "${propertySlug}" konnte nicht geladen werden.`)
  }
  const raw = (await response.json()) as PropertyBundle
  return normalizeBundleAssets(raw)
}

export function getDefaultRuntimePreset(bundle: PropertyBundle): RuntimePreset {
  const defaultPreset = bundle.presets[0]
  if (!defaultPreset) {
    throw new Error(`Property-Bundle "${bundle.identity.slug}" enthält keine Presets.`)
  }
  return defaultPreset
}

export function getPresetManifestEntries(bundle: PropertyBundle): PresetManifestEntry[] {
  return bundle.presets
    .map((preset) => ({ id: preset.id, label: preset.label }))
    .sort((left, right) => left.label.localeCompare(right.label, 'de'))
}

export function getProjectPresetFromBundle(bundle: PropertyBundle, presetId: string): RuntimePreset {
  const match = bundle.presets.find((preset) => preset.id === presetId)
  if (!match) {
    throw new Error(`Preset ${presetId} konnte im Bundle ${bundle.identity.slug} nicht geladen werden.`)
  }
  return match
}
