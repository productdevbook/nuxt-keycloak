export default defineNuxtConfig({
  modules: ['../src/module', '@nuxtjs/tailwindcss'],
  devtools: { enabled: true },
  compatibilityDate: '2025-01-21',

  keycloak: {
    url: 'http://localhost:8080',
    realm: 'nuxt-app',
    clientId: 'nuxt-client',
    server: {
      rejectUnauthorized: false, // Allow self-signed certificates in development
    },
  },
})
