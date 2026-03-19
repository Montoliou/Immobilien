import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const repoRoot = path.resolve(__dirname, '..', '..')
const dashboardDir = path.join(repoRoot, 'dashboard')
const sourceRoot = path.join(dashboardDir, 'properties')
const targetRoot = path.join(dashboardDir, 'public', 'properties')

async function exists(targetPath) {
  try {
    await fs.access(targetPath)
    return true
  } catch {
    return false
  }
}

function assertString(value, label) {
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error(`${label} fehlt oder ist leer.`)
  }
}

function assertArray(value, label) {
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error(`${label} muss mindestens einen Eintrag enthalten.`)
  }
}

function validateBundle(bundle, slug) {
  if (!bundle || typeof bundle !== 'object') {
    throw new Error(`Bundle ${slug} ist kein JSON-Objekt.`)
  }

  assertString(bundle.identity?.slug, `${slug}.identity.slug`)
  assertString(bundle.identity?.title, `${slug}.identity.title`)
  assertString(bundle.identity?.address, `${slug}.identity.address`)
  assertString(bundle.identity?.city, `${slug}.identity.city`)
  assertString(bundle.identity?.mapUrl, `${slug}.identity.mapUrl`)
  assertString(bundle.contact?.consultationEmail, `${slug}.contact.consultationEmail`)
  assertString(bundle.contact?.consultationPhoneLabel, `${slug}.contact.consultationPhoneLabel`)
  assertString(bundle.contact?.consultationPhoneLink, `${slug}.contact.consultationPhoneLink`)
  assertString(bundle.contact?.bookingUrl, `${slug}.contact.bookingUrl`)
  assertString(bundle.content?.hero?.eyebrow, `${slug}.content.hero.eyebrow`)
  assertString(bundle.content?.hero?.headline, `${slug}.content.hero.headline`)
  assertString(bundle.content?.hero?.intro, `${slug}.content.hero.intro`)
  assertString(bundle.content?.hero?.customerLead, `${slug}.content.hero.customerLead`)
  assertString(bundle.content?.hero?.advisorLead, `${slug}.content.hero.advisorLead`)
  assertString(bundle.content?.hero?.backgroundImage, `${slug}.content.hero.backgroundImage`)
  assertString(bundle.content?.hero?.location?.title, `${slug}.content.hero.location.title`)
  assertString(bundle.content?.hero?.location?.detail, `${slug}.content.hero.location.detail`)
  assertString(bundle.content?.hero?.location?.buttonLabel, `${slug}.content.hero.location.buttonLabel`)
  assertString(bundle.content?.hero?.marketFacts?.title, `${slug}.content.hero.marketFacts.title`)
  assertString(bundle.content?.hero?.marketFacts?.lead, `${slug}.content.hero.marketFacts.lead`)
  assertArray(bundle.content?.hero?.facts, `${slug}.content.hero.facts`)
  assertArray(bundle.content?.hero?.journeySteps, `${slug}.content.hero.journeySteps`)
  assertArray(bundle.content?.hero?.marketFacts?.items, `${slug}.content.hero.marketFacts.items`)
  assertArray(bundle.media?.heroSlides, `${slug}.media.heroSlides`)
  assertArray(bundle.presets, `${slug}.presets`)

  for (const preset of bundle.presets) {
    preset.propertySlug = bundle.identity.slug
  }

  return bundle
}

async function copyRecursive(sourcePath, targetPath) {
  const stats = await fs.stat(sourcePath)
  if (stats.isDirectory()) {
    await fs.mkdir(targetPath, { recursive: true })
    const entries = await fs.readdir(sourcePath)
    for (const entry of entries) {
      await copyRecursive(path.join(sourcePath, entry), path.join(targetPath, entry))
    }
    return
  }

  await fs.mkdir(path.dirname(targetPath), { recursive: true })
  await fs.copyFile(sourcePath, targetPath)
}

async function compileProperty(propertyDirName) {
  const propertyDir = path.join(sourceRoot, propertyDirName)
  const sourceBundlePath = path.join(propertyDir, 'bundle.json')
  const targetPropertyDir = path.join(targetRoot, propertyDirName)
  const mediaSourceDir = path.join(propertyDir, 'media')

  if (!(await exists(sourceBundlePath))) {
    throw new Error(`Property ${propertyDirName} enthält kein bundle.json.`)
  }

  const rawBundle = JSON.parse(await fs.readFile(sourceBundlePath, 'utf-8'))
  const bundle = validateBundle(rawBundle, propertyDirName)

  await fs.mkdir(targetPropertyDir, { recursive: true })
  await fs.writeFile(path.join(targetPropertyDir, 'bundle.json'), `${JSON.stringify(bundle, null, 2)}\n`, 'utf-8')

  if (await exists(mediaSourceDir)) {
    await copyRecursive(mediaSourceDir, path.join(targetPropertyDir, 'media'))
  }

  return bundle.identity.slug
}

async function main() {
  if (!(await exists(sourceRoot))) {
    throw new Error(`Property-Quellordner fehlt: ${sourceRoot}`)
  }

  await fs.rm(targetRoot, { recursive: true, force: true })
  await fs.mkdir(targetRoot, { recursive: true })

  const entries = await fs.readdir(sourceRoot, { withFileTypes: true })
  const propertyDirs = entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name).sort()
  if (!propertyDirs.length) {
    throw new Error('Keine Property-Ordner gefunden.')
  }

  const compiled = []
  for (const propertyDirName of propertyDirs) {
    compiled.push(await compileProperty(propertyDirName))
  }

  console.log(`Compiled properties: ${compiled.join(', ')}`)
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
