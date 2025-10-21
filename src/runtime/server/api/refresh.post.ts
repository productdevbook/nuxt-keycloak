import { defineEventHandler, readBody, createError } from 'h3'
import { verifyKeycloakToken } from '../utils/keycloak'

/**
 * Refresh Keycloak token endpoint
 * This is a placeholder - actual token refresh should be done client-side
 * This endpoint is for validating tokens server-side
 */
export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body || !body.token) {
    throw createError({
      statusCode: 400,
      message: 'Bad Request: Token required',
    })
  }

  const verified = await verifyKeycloakToken(body.token)

  if (!verified) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized: Invalid token',
    })
  }

  return {
    valid: true,
    user: verified,
  }
})
