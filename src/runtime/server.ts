/**
 * Server utilities for nuxt-keycloak module
 * These utilities can be imported directly from 'nuxt-keycloak/server'
 * or auto-imported in Nuxt server routes
 */

export {
  verifyKeycloakToken,
  extractToken,
  getKeycloakUser,
  getKeycloakToken,
  isAuthenticated,
  hasRealmRole,
  hasResourceRole,
  requireKeycloakAuth,
  requireRealmRole,
  requireResourceRole,
} from './server/utils/keycloak'
