import { defineNuxtModule, addPlugin, createResolver, addServerHandler, addImportsDir, addServerImportsDir } from '@nuxt/kit'
import { defu } from 'defu'
import type { ModuleOptions } from './runtime/types'

export type { ModuleOptions }

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-keycloak',
    configKey: 'keycloak',
    compatibility: {
      nuxt: '^3.0.0 || ^4.0.0',
    },
  },
  defaults: {
    url: '',
    realm: '',
    clientId: '',
    initOptions: {},
    server: {
      verifyToken: true,
      middleware: false,
      jwksCacheDuration: 600000, // 10 minutes
      rejectUnauthorized: true, // Set to false in development for self-signed certs
    },
    client: {
      autoRefreshToken: true,
      minTokenValidity: 30,
      persistRefreshToken: true,
    },
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)

    // Merge module options with runtime config
    nuxt.options.runtimeConfig.public.keycloak = defu(
      nuxt.options.runtimeConfig.public.keycloak,
      {
        url: options.url,
        realm: options.realm,
        clientId: options.clientId,
        initOptions: options.initOptions,
        client: options.client,
      },
    )

    // Server-side config (private)
    nuxt.options.runtimeConfig.keycloak = defu(
      nuxt.options.runtimeConfig.keycloak,
      {
        server: options.server,
      },
    )

    // Add type templates
    nuxt.hook('prepare:types', ({ references }) => {
      references.push({ path: resolver.resolve('./runtime/types') })
    })

    // Add composables (auto-imports all composables from the directory)
    addImportsDir(resolver.resolve('./runtime/composables'))

    // Add utils (getToken, helpers)
    addImportsDir(resolver.resolve('./runtime/utils'))

    // Add server utilities
    addServerImportsDir(resolver.resolve('./runtime/server/utils'))

    // Add client plugin
    addPlugin(resolver.resolve('./runtime/plugin.client'))

    // Add server middleware if enabled
    if (options.server?.middleware) {
      addServerHandler({
        handler: resolver.resolve('./runtime/server/middleware/auth'),
        middleware: true,
      })
    }

    // Add API handlers
    addServerHandler({
      route: '/api/_keycloak/session',
      handler: resolver.resolve('./runtime/server/api/session.get'),
    })

    addServerHandler({
      route: '/api/_keycloak/refresh',
      handler: resolver.resolve('./runtime/server/api/refresh.post'),
    })

    // Add middleware directory
    nuxt.hook('app:resolve', (app) => {
      app.middleware.push({
        name: 'keycloak-auth',
        path: resolver.resolve('./runtime/middleware/authenticated'),
        global: false,
      })
      app.middleware.push({
        name: 'keycloak-role',
        path: resolver.resolve('./runtime/middleware/role'),
        global: false,
      })
    })
  },
})
