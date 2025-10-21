import { defineEventHandler, createError } from 'h3'

/**
 * Protected API endpoint - requires authentication
 * Demonstrates manual token verification
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

  const user = await verifyKeycloakToken(token)

  if (!user) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized: Invalid token',
    })
  }

  return {
    message: 'This is a protected endpoint',
    timestamp: new Date().toISOString(),
    authenticated: true,
    user: {
      id: user.sub,
      username: user.preferred_username,
      email: user.email,
    },
  }
})
