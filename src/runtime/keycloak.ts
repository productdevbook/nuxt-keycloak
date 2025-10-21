import Keycloak from 'keycloak-js'
import type { KeycloakConfig, KeycloakInitOptions } from 'keycloak-js'
import type { KeycloakUser } from './types'
import { setAuthenticated, setError, setPending, setKeycloak, setToken, setUser } from './state'
import { isNil } from './utils/helpers'

export type KeycloakInstance = Keycloak | undefined

let $keycloak: KeycloakInstance

async function updateToken(minValidity: number): Promise<string> {
  if (!$keycloak) {
    throw new Error('[nuxt-keycloak] Keycloak not initialized')
  }

  try {
    await $keycloak.updateToken(minValidity)
    if ($keycloak.token && $keycloak.tokenParsed) {
      setToken($keycloak.token, $keycloak.tokenParsed)
    }
    return $keycloak.token!
  }
  catch (err) {
    const error = isNil(err) ? new Error('Failed to refresh token') : (err as Error)
    setError(true, error)
    throw error
  }
}

export async function getToken(minValidity = 10): Promise<string> {
  return updateToken(minValidity)
}

export function createKeycloak(config: KeycloakConfig): KeycloakInstance {
  try {
    $keycloak = new Keycloak(config)
    setKeycloak($keycloak)
  }
  catch (err) {
    setError(true, isNil(err) ? new Error('Failed to create Keycloak adapter') : (err as Error))
  }
  return $keycloak
}

export async function initKeycloak(initConfig: KeycloakInitOptions): Promise<void> {
  if (!$keycloak) {
    setError(true, new Error('Keycloak instance not created'))
    setPending(false)
    return
  }

  try {
    setPending(true)
    const auth = await $keycloak.init(initConfig)
    setAuthenticated(auth)

    if (auth && $keycloak.token && $keycloak.tokenParsed) {
      setToken($keycloak.token, $keycloak.tokenParsed)

      // Load user profile
      const profile = await $keycloak.loadUserProfile()
      setUser(profile as KeycloakUser)
    }
  }
  catch (err) {
    setAuthenticated(false)
    setError(true, isNil(err) ? new Error('Failed to initialize Keycloak') : (err as Error))
  }
  finally {
    setPending(false)
  }
}
