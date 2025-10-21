import { defineEventHandler } from 'h3'
import { extractToken, verifyKeycloakToken } from '../utils/keycloak'

/**
 * Server middleware to automatically verify Keycloak tokens on all requests
 * This middleware is optional and must be explicitly enabled in module config
 */
export default defineEventHandler(async (event) => {
  // Initialize context
  event.context.keycloak = {
    authenticated: false,
    user: undefined,
    token: undefined,
  }

  // Extract token from Authorization header
  const token = extractToken(event)

  if (!token) {
    // No token present, continue without authentication
    return
  }

  // Verify token
  const user = await verifyKeycloakToken(token)

  if (user) {
    // Token is valid, attach user to context
    event.context.keycloak = {
      authenticated: true,
      user,
      token,
    }
  }
})
