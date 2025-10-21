export default defineNuxtConfig({
  modules: ['../src/module', '@nuxtjs/tailwindcss'],
  devtools: { enabled: true },
  compatibilityDate: '2025-01-21',

  keycloak: {
    url: 'https://sso.sayfa.page',
    realm: 'sayfa',
    clientId: 'sayfa-nuxt',
    server: {
      rejectUnauthorized: false, // Allow self-signed certificates in development
    },
  },
})
