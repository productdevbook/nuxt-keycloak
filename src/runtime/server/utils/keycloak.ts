import { createRemoteJWKSet, jwtVerify, customFetch } from 'jose'
import type { H3Event } from 'h3'
import { createError, useRuntimeConfig } from '#imports'
import type { KeycloakTokenParsed } from 'keycloak-js'
import { Agent } from 'undici'

// Cache for JWKS
let jwksCache: ReturnType<typeof createRemoteJWKSet> | null = null
let jwksCacheTime = 0

/**
 * Get or create JWKS remote key set
 */
function getJWKS() {
  const config = useRuntimeConfig()
  const keycloakConfig = config.public.keycloak
  const serverConfig = config.keycloak

  const cacheDuration = serverConfig?.server?.jwksCacheDuration || 600000 // 10 minutes default
  const rejectUnauthorized = (serverConfig?.server as { rejectUnauthorized?: boolean })?.rejectUnauthorized ?? true
  const now = Date.now()

  // Return cached JWKS if still valid
  if (jwksCache && (now - jwksCacheTime) < cacheDuration) {
    return jwksCache
  }

  // Create new JWKS
  const jwksUrl = `${keycloakConfig.url}/realms/${keycloakConfig.realm}/protocol/openid-connect/certs`

  // Create JWKS with custom fetch for SSL handling
  jwksCache = createRemoteJWKSet(new URL(jwksUrl), {
    cacheMaxAge: cacheDuration,
    [customFetch]: (url, options) => {
      return fetch(url, {
        ...options,
        // @ts-expect-error - undici dispatcher is not in standard fetch types
        dispatcher: new Agent({
          connect: { rejectUnauthorized },
        }),
      })
    },
  })
  jwksCacheTime = now

  return jwksCache
}

/**
 * Verify Keycloak JWT token
 *
 * @param token - The JWT token to verify
 * @returns The verified token payload or null if invalid
 */
export async function verifyKeycloakToken(token: string): Promise<KeycloakTokenParsed | null> {
  try {
    const config = useRuntimeConfig()
    const keycloakConfig = config.public.keycloak

    const jwks = getJWKS()

    const { payload } = await jwtVerify(token, jwks, {
      issuer: `${keycloakConfig.url}/realms/${keycloakConfig.realm}`,
    })

    return payload as KeycloakTokenParsed
  }
  catch (error) {
    console.error('[nuxt-keycloak] Token verification failed:', error)
    return null
  }
}

/**
 * Extract Bearer token from request headers
 *
 * @param event - H3 event object
 * @returns The extracted token or null
 */
export function extractToken(event: H3Event): string | null {
  const authorization = event.node.req.headers.authorization

  if (!authorization) {
    return null
  }

  const parts = authorization.split(' ')

  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null
  }

  return parts[1] || null
}

/**
 * Get authenticated user from request
 *
 * @param event - H3 event object
 * @returns The Keycloak user data or null
 */
export function getKeycloakUser(event: H3Event): KeycloakTokenParsed | null {
  return event.context.keycloak?.user || null
}

/**
 * Get access token from request
 *
 * @param event - H3 event object
 * @returns The access token or null
 */
export function getKeycloakToken(event: H3Event): string | null {
  return event.context.keycloak?.token || null
}

/**
 * Check if user is authenticated
 *
 * @param event - H3 event object
 * @returns True if authenticated
 */
export function isAuthenticated(event: H3Event): boolean {
  return event.context.keycloak?.authenticated || false
}

/**
 * Check if user has a realm role
 *
 * @param event - H3 event object
 * @param role - The role to check
 * @returns True if user has the role
 */
export function hasRealmRole(event: H3Event, role: string): boolean {
  const user = getKeycloakUser(event)
  if (!user || !user.realm_access) {
    return false
  }
  return user.realm_access.roles.includes(role)
}

/**
 * Check if user has a resource/client role
 *
 * @param event - H3 event object
 * @param role - The role to check
 * @param resource - The resource/client ID (defaults to configured clientId)
 * @returns True if user has the role
 */
export function hasResourceRole(event: H3Event, role: string, resource?: string): boolean {
  const user = getKeycloakUser(event)
  if (!user || !user.resource_access) {
    return false
  }

  const config = useRuntimeConfig()
  const keycloakConfig = config.public.keycloak
  const resourceId = resource || keycloakConfig.clientId

  const resourceRoles = user.resource_access[resourceId]
  if (!resourceRoles) {
    return false
  }

  return resourceRoles.roles.includes(role)
}

/**
 * Require authentication for API route
 * Throws 401 error if not authenticated
 *
 * @param event - H3 event object
 * @returns The authenticated user
 */
export function requireKeycloakAuth(event: H3Event): KeycloakTokenParsed {
  if (!isAuthenticated(event)) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized: Authentication required',
    })
  }

  return getKeycloakUser(event)!
}

/**
 * Require specific realm role for API route
 * Throws 403 error if user doesn't have the role
 *
 * @param event - H3 event object
 * @param role - The required role
 * @returns The authenticated user
 */
export function requireRealmRole(event: H3Event, role: string): KeycloakTokenParsed {
  const user = requireKeycloakAuth(event)

  if (!hasRealmRole(event, role)) {
    throw createError({
      statusCode: 403,
      message: `Forbidden: Realm role '${role}' required`,
    })
  }

  return user
}

/**
 * Require specific resource/client role for API route
 * Throws 403 error if user doesn't have the role
 *
 * @param event - H3 event object
 * @param role - The required role
 * @param resource - The resource/client ID (defaults to configured clientId)
 * @returns The authenticated user
 */
export function requireResourceRole(event: H3Event, role: string, resource?: string): KeycloakTokenParsed {
  const user = requireKeycloakAuth(event)

  if (!hasResourceRole(event, role, resource)) {
    const resourceName = resource || 'default'
    throw createError({
      statusCode: 403,
      message: `Forbidden: Resource role '${role}' for '${resourceName}' required`,
    })
  }

  return user
}
