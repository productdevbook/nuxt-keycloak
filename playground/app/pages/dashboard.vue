<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="px-4 py-6 sm:px-0">
    <div class="bg-white shadow rounded-lg p-6">
      <h1 class="text-3xl font-bold text-gray-900 mb-6">
        Dashboard
      </h1>

      <div class="mb-6">
        <p class="text-gray-600 mb-4">
          Welcome to your dashboard! This page is protected and requires authentication.
        </p>

        <div class="bg-green-50 border border-green-200 rounded-lg p-4">
          <p class="text-green-800 font-medium">
            ✓ You are authenticated!
          </p>
          <p class="text-green-700 text-sm mt-1">
            This page uses the <code class="bg-green-100 px-1 rounded">keycloak-auth</code> middleware.
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="border rounded-lg p-4">
          <h2 class="text-xl font-semibold mb-3">
            User Information
          </h2>
          <dl class="space-y-2">
            <div>
              <dt class="text-sm font-medium text-gray-500">
                Username
              </dt>
              <dd class="text-base text-gray-900">
                {{ user?.username || 'N/A' }}
              </dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">
                Email
              </dt>
              <dd class="text-base text-gray-900">
                {{ user?.email || 'N/A' }}
              </dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">
                First Name
              </dt>
              <dd class="text-base text-gray-900">
                {{ user?.firstName || 'N/A' }}
              </dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">
                Last Name
              </dt>
              <dd class="text-base text-gray-900">
                {{ user?.lastName || 'N/A' }}
              </dd>
            </div>
          </dl>
        </div>

        <div class="border rounded-lg p-4">
          <h2 class="text-xl font-semibold mb-3">
            API Test
          </h2>
          <div class="space-y-3">
            <button
              class="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              @click="testPublicAPI"
            >
              Test Public API
            </button>
            <button
              class="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              @click="testProtectedAPI"
            >
              Test Protected API
            </button>

            <div
              v-if="apiResponse"
              class="mt-4 p-3 bg-gray-50 rounded border text-sm"
            >
              <p class="font-medium mb-2">
                API Response:
              </p>
              <pre class="overflow-auto">{{ apiResponse }}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { definePageMeta, getToken, ref, useKeycloak } from '#imports'

const { user } = useKeycloak()
const apiResponse = ref<unknown>(null)

definePageMeta({
  middleware: 'keycloak-auth',
})

async function testPublicAPI() {
  apiResponse.value = await $fetch('/api/public').catch(e => ({ error: e.message }))
}

async function testProtectedAPI() {
  const token = await getToken()
  apiResponse.value = await $fetch('/api/protected', {
    headers: { Authorization: `Bearer ${token}` },
  }).catch(e => ({ error: e.message }))
}
</script>
