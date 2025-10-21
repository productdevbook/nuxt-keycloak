<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="px-4 py-6 sm:px-0">
    <div class="bg-white shadow rounded-lg p-6">
      <h1 class="text-3xl font-bold text-gray-900 mb-6">
        Admin Panel
      </h1>

      <div class="mb-6">
        <div class="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <p class="text-purple-800 font-medium">
            🔒 Restricted Access
          </p>
          <p class="text-purple-700 text-sm mt-1">
            This page requires the <code class="bg-purple-100 px-1 rounded">'admin'</code> realm role.
            It uses the <code class="bg-purple-100 px-1 rounded">keycloak-role</code> middleware.
          </p>
        </div>
      </div>

      <div class="space-y-6">
        <div class="border rounded-lg p-4">
          <h2 class="text-xl font-semibold mb-3">
            Your Roles
          </h2>
          <div class="space-y-4">
            <div>
              <h3 class="text-sm font-medium text-gray-700 mb-2">
                Realm Roles:
              </h3>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="role in tokenParsed?.realm_access?.roles"
                  :key="role"
                  class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {{ role }}
                </span>
                <span
                  v-if="!tokenParsed?.realm_access?.roles?.length"
                  class="text-gray-500 text-sm"
                >
                  No realm roles
                </span>
              </div>
            </div>

            <div>
              <h3 class="text-sm font-medium text-gray-700 mb-2">
                Client Roles:
              </h3>
              <div class="space-y-2">
                <div
                  v-for="(roles, client) in tokenParsed?.resource_access"
                  :key="client"
                >
                  <p class="text-xs text-gray-500 mb-1">
                    {{ client }}:
                  </p>
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="role in roles.roles"
                      :key="role"
                      class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                    >
                      {{ role }}
                    </span>
                  </div>
                </div>
                <span
                  v-if="!Object.keys(tokenParsed?.resource_access || {}).length"
                  class="text-gray-500 text-sm"
                >
                  No client roles
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="border rounded-lg p-4">
          <h2 class="text-xl font-semibold mb-3">
            Admin Actions
          </h2>
          <div class="space-y-3">
            <button
              class="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              @click="testAdminAPI"
            >
              Test Admin API
            </button>

            <div
              v-if="adminResponse"
              class="mt-4 p-3 bg-gray-50 rounded border text-sm"
            >
              <p class="font-medium mb-2">
                API Response:
              </p>
              <pre class="overflow-auto">{{ adminResponse }}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { definePageMeta, getToken, ref, useKeycloak } from '#imports'

const { tokenParsed } = useKeycloak()
const adminResponse = ref<unknown>(null)

definePageMeta({
  middleware: ['keycloak-auth', 'keycloak-role'],
  keycloakRoles: {
    realm: ['admin'],
  },
})

async function testAdminAPI() {
  const token = await getToken()
  adminResponse.value = await $fetch('/api/admin', {
    headers: { Authorization: `Bearer ${token}` },
  }).catch(e => ({ error: e.message }))
}
</script>
