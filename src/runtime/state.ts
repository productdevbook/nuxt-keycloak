import { useState } from '#app'
import type { KeycloakTokenParsed } from 'keycloak-js'
import type { KeycloakUser } from './types'
import type { KeycloakInstance } from './keycloak'
import { isString } from './utils/helpers'

export interface KeycloakState {
  isAuthenticated: boolean
  hasFailed: boolean
  error: Error | null
  isPending: boolean
  user: KeycloakUser | null
  token: string
  decodedToken: KeycloakTokenParsed | null
  username: string
  userId: string
  roles: string[]
  resourceRoles: Record<string, string[]>
}

export function useKeycloakInstance() {
  return useState<KeycloakInstance>('keycloak-instance', () => undefined)
}

export function useKeycloakState() {
  return useState<KeycloakState>('keycloak-state', () => ({
    isAuthenticated: false,
    hasFailed: false,
    error: null,
    isPending: true,
    user: null,
    token: '',
    decodedToken: null,
    username: '',
    userId: '',
    roles: [],
    resourceRoles: {},
  }))
}

export function setKeycloak(value: KeycloakInstance): void {
  const keycloak = useKeycloakInstance()
  keycloak.value = value
}

export function setToken(token: string, tokenParsed: KeycloakTokenParsed): void {
  const state = useKeycloakState()
  state.value.token = token
  state.value.decodedToken = tokenParsed
  state.value.roles = tokenParsed.realm_access?.roles || []
  state.value.username = tokenParsed.preferred_username || ''
  state.value.userId = tokenParsed.sub || ''
  state.value.resourceRoles = tokenParsed.resource_access
    ? Object.fromEntries(Object.entries(tokenParsed.resource_access).map(([key, value]) => [key, value.roles]))
    : {}
}

export function setUser(user: KeycloakUser | null): void {
  const state = useKeycloakState()
  state.value.user = user
}

interface ErrorString {
  error: string
}
type ErrorLike = Error | ErrorString | string

export function setError(value: boolean, err?: ErrorLike): void {
  const state = useKeycloakState()
  state.value.hasFailed = value
  if (!err) {
    state.value.error = null
    return
  }

  if (err instanceof Error) {
    state.value.error = err
  }
  else if (isString((err as ErrorString)?.error)) {
    state.value.error = new Error((err as ErrorString).error)
  }
  else if (isString(err)) {
    state.value.error = new Error(err as string)
  }
  else {
    state.value.error = new Error('Unknown error')
  }

  state.value.error.name = '[nuxt-keycloak]'
  console.error(state.value.error)
}

export function setPending(value: boolean): void {
  const state = useKeycloakState()
  state.value.isPending = value
}

export function setAuthenticated(value: boolean): void {
  const state = useKeycloakState()
  state.value.isAuthenticated = value
}
