import { defineEventHandler } from 'h3'

/**
 * Test endpoint - demonstrates importing from nuxt-keycloak/server
 */
export default defineEventHandler(async (event) => {
  // Using imported functions from nuxt-keycloak/server
  const token = extractToken(event)

  if (!token) {
    return {
      message: 'No token provided',
      importTest: 'SUCCESS - functions imported from nuxt-keycloak/server',
    }
  }

  const user = requireKeycloakAuth(event)

  return {
    message: 'Import test successful',
    importTest: 'SUCCESS - functions imported from nuxt-keycloak/server',
    user: {
      id: user.sub,
      username: user.preferred_username,
    },
  }
})
