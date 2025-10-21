import { defineEventHandler } from 'h3'
import { getKeycloakUser, getKeycloakToken, isAuthenticated } from '../utils/keycloak'

/**
 * Get current Keycloak session information
 * Returns user data if authenticated, null otherwise
 */
export default defineEventHandler((event) => {
  if (!isAuthenticated(event)) {
    return {
      authenticated: false,
      user: null,
      token: null,
    }
  }

  return {
    authenticated: true,
    user: getKeycloakUser(event),
    token: getKeycloakToken(event),
  }
})
