import { defineNuxtPlugin, useRuntimeConfig } from '#app'
import { createKeycloak, initKeycloak } from './keycloak'

// Immediately save and clean OAuth params BEFORE any plugin runs
const STORAGE_KEY = '_kc_oauth_params'
if (typeof window !== 'undefined') {
  if (window.location.hash.includes('state=') || window.location.search.includes('state=')) {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({
      hash: window.location.hash,
      search: window.location.search,
    }))
    window.history.replaceState({}, '', window.location.pathname)
  }
}

export default defineNuxtPlugin({
  name: 'keycloak',
  enforce: 'pre',
  // @ts-expect-error - Nuxt plugin type inference issue
  async setup() {
    const config = useRuntimeConfig()
    const kc = config.public.keycloak as { url: string, realm: string, clientId: string }

    if (!kc?.url || !kc?.realm || !kc?.clientId) {
      return
    }

    // Retrieve saved OAuth params
    const savedParams = sessionStorage.getItem(STORAGE_KEY)
    let hasOAuthParams = false
    let originalHash = ''
    let originalSearch = ''

    if (savedParams) {
      const params = JSON.parse(savedParams)
      hasOAuthParams = true
      originalHash = params.hash
      originalSearch = params.search
      sessionStorage.removeItem(STORAGE_KEY)
    }

    const keycloak = createKeycloak({
      url: kc.url,
      realm: kc.realm,
      clientId: kc.clientId,
    })

    if (!keycloak) {
      return
    }

    // If OAuth redirect, temporarily restore URL for Keycloak to process
    if (hasOAuthParams) {
      const tempUrl = window.location.origin + window.location.pathname + originalSearch + originalHash
      window.history.replaceState({}, '', tempUrl)
    }

    await initKeycloak({
      onLoad: 'check-sso',
      silentCheckSsoRedirectUri: `${window.location.origin}/silent-check-sso.html`,
      pkceMethod: 'S256',
    })

    // Final cleanup - ensure URL is clean
    if (window.location.hash || window.location.search) {
      window.history.replaceState({}, '', window.location.pathname)
    }

    return {
      provide: {
        keycloak,
      },
    }
  },
})
