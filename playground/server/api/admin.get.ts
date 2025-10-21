import { defineEventHandler, createError } from 'h3'

/**
 * Admin API endpoint - requires 'admin' realm role
 * Demonstrates role-based access control
 */
export default defineEventHandler(async (event) => {
  // Extract and verify token - auto-imported from nuxt-keycloak module
  const token = extractToken(event)

  if (!token) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized: No token provided',
    })
  }

  // Verify token and attach to context
  const user = await verifyKeycloakToken(token)

  if (!user) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized: Invalid token',
    })
  }

  // Attach to context for requireRealmRole
  event.context.keycloak = {
    authenticated: true,
    user,
    token,
  }

  // Require admin role
  requireRealmRole(event, 'admin')

  return {
    message: 'Welcome to the admin endpoint',
    timestamp: new Date().toISOString(),
    authenticated: true,
    roles: user.realm_access?.roles || [],
    user: {
      id: user.sub,
      username: user.preferred_username,
      email: user.email,
    },
  }
})
