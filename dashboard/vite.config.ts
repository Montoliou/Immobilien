import { defineConfig } from 'vite'

function normalizeBasePath(rawBase) {
  if (!rawBase) {
    return '/YorkLiving/'
  }

  const withLeadingSlash = rawBase.startsWith('/') ? rawBase : `/${rawBase}`
  return withLeadingSlash.endsWith('/') ? withLeadingSlash : `${withLeadingSlash}/`
}

export default defineConfig({
  base: normalizeBasePath(process.env.VITE_BASE_PATH),
})
