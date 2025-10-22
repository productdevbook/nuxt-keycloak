import type Keycloak from 'keycloak-js'
import type { KeycloakInitOptions } from 'keycloak-js'

// Re-export all Keycloak types directly from keycloak-js
export type {
  KeycloakTokenParsed,
  KeycloakProfile,
  KeycloakConfig,
  KeycloakInitOptions,
  KeycloakLoginOptions,
  KeycloakLogoutOptions,
  KeycloakRegisterOptions,
  KeycloakAccountOptions,
  KeycloakResourceAccess,
  KeycloakRoles,
  KeycloakError,
  KeycloakAdapter,
  KeycloakOnLoad,
  KeycloakResponseMode,
  KeycloakResponseType,
  KeycloakFlow,
  KeycloakPkceMethod,
} from 'keycloak-js'

// Alias KeycloakProfile as KeycloakUser for consistency
export type { KeycloakProfile as KeycloakUser } from 'keycloak-js'

// Module configuration types
export interface ModuleOptions {
  url: string
  realm: string
  clientId: string
  initOptions?: Partial<KeycloakInitOptions>
  server?: {
    verifyToken?: boolean | 'decode'
    middleware?: boolean
    jwksCacheDuration?: number
    rejectUnauthorized?: boolean
  }
  client?: {
    autoRefreshToken?: boolean
    minTokenValidity?: number
    persistRefreshToken?: boolean
  }
}

// Nuxt-specific module augmentations
declare module '#app' {
  interface NuxtApp {
    $keycloak?: Keycloak
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $keycloak?: Keycloak
  }
}

declare module 'h3' {
  interface H3EventContext {
    keycloak?: {
      token?: string | null
      user?: import('keycloak-js').KeycloakTokenParsed | null
      authenticated?: boolean
    }
  }
}
