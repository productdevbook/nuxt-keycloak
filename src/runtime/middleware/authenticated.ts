import { defineNuxtRouteMiddleware } from '#app'
import { useKeycloak } from '../composables/useKeycloak'

export default defineNuxtRouteMiddleware(async () => {
  if (import.meta.server) return

  const { isAuthenticated, login } = useKeycloak()

  if (!isAuthenticated.value) {
    await login()
    return false
  }
})
