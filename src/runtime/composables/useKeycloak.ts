import { toRefs } from 'vue'
import { useNuxtApp } from '#app'
import { useKeycloakInstance, useKeycloakState } from '../state'
import { isArray, isNil } from '../utils/helpers'

export function useKeycloak() {
  const nuxtApp = useNuxtApp()
  const keycloak = useKeycloakInstance()
  const state = useKeycloakState()

  // Helper functions
  const hasRoles = (roles: string[]) =>
    isArray(roles) && state.value.isAuthenticated && roles.every(role => state.value.roles.includes(role))

  const hasResourceRoles = (roles: string[], resource: string) =>
    isArray(roles)
    && !isNil(resource)
    && state.value.isAuthenticated
    && !isNil(state.value.resourceRoles)
    && isArray(state.value.resourceRoles[resource])
    && roles.every(role => state.value.resourceRoles[resource]?.includes(role) ?? false)

  const hasRealmRole = (role: string) =>
    state.value.isAuthenticated && state.value.roles.includes(role)

  const hasResourceRole = (role: string, resource: string) =>
    !isNil(resource)
    && state.value.isAuthenticated
    && !isNil(state.value.resourceRoles)
    && isArray(state.value.resourceRoles[resource])
    && (state.value.resourceRoles[resource]?.includes(role) ?? false)

  const isTokenExpired = (minValidity = 0) => {
    return nuxtApp.$keycloak?.isTokenExpired(minValidity) ?? true
  }

  const stateRefs = toRefs(state.value)

  return {
    keycloak,
    ...stateRefs,
    tokenParsed: stateRefs.decodedToken, // Alias for consistency
    login: () => nuxtApp.$keycloak?.login(),
    logout: () => nuxtApp.$keycloak?.logout(),
    hasRoles,
    hasResourceRoles,
    hasRealmRole,
    hasResourceRole,
    isTokenExpired,
  }
}
