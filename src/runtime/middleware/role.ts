import { defineNuxtRouteMiddleware, abortNavigation } from '#app'
import { useKeycloak } from '../composables/useKeycloak'

export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.server) return

  const { isAuthenticated, hasRealmRole, hasResourceRole } = useKeycloak()

  if (!isAuthenticated.value) {
    return abortNavigation({ statusCode: 401 })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const roles = to.meta.keycloakRoles as any
  if (!roles) return

  // Check realm roles
  if (roles.realm) {
    const hasRole = roles.realm.some((r: string) => hasRealmRole(r))
    if (!hasRole) {
      return abortNavigation({ statusCode: 403 })
    }
  }

  // Check resource roles
  if (roles.resource) {
    const { clientId, roles: resourceRoles } = roles.resource
    const hasRole = resourceRoles.some((r: string) => hasResourceRole(r, clientId))
    if (!hasRole) {
      return abortNavigation({ statusCode: 403 })
    }
  }
})
