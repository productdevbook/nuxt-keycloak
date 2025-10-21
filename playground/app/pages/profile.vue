<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="px-4 py-6 sm:px-0">
    <div class="bg-white shadow rounded-lg p-6">
      <h1 class="text-3xl font-bold text-gray-900 mb-6">
        User Profile
      </h1>

      <div class="space-y-6">
        <div class="border rounded-lg p-4">
          <h2 class="text-xl font-semibold mb-3">
            Profile Information
          </h2>
          <dl class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <dt class="text-sm font-medium text-gray-500">
                User ID
              </dt>
              <dd class="text-base text-gray-900 mt-1">
                {{ tokenParsed?.sub || 'N/A' }}
              </dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">
                Username
              </dt>
              <dd class="text-base text-gray-900 mt-1">
                {{ tokenParsed?.preferred_username || user?.username || 'N/A' }}
              </dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">
                Email
              </dt>
              <dd class="text-base text-gray-900 mt-1">
                {{ tokenParsed?.email || user?.email || 'N/A' }}
              </dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">
                Email Verified
              </dt>
              <dd class="text-base text-gray-900 mt-1">
                <span :class="tokenParsed?.email_verified ? 'text-green-600' : 'text-red-600'">
                  {{ tokenParsed?.email_verified ? 'Yes' : 'No' }}
                </span>
              </dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">
                Name
              </dt>
              <dd class="text-base text-gray-900 mt-1">
                {{ tokenParsed?.name || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'N/A' }}
              </dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">
                Session State
              </dt>
              <dd class="text-base text-gray-900 mt-1 truncate">
                {{ tokenParsed?.session_state || 'N/A' }}
              </dd>
            </div>
          </dl>
        </div>

        <div class="border rounded-lg p-4">
          <h2 class="text-xl font-semibold mb-3">
            Token Information
          </h2>
          <div class="space-y-4">
            <div>
              <dt class="text-sm font-medium text-gray-500 mb-1">
                Token Issued At
              </dt>
              <dd class="text-base text-gray-900">
                {{ formatTimestamp(tokenParsed?.iat) }}
              </dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500 mb-1">
                Token Expires At
              </dt>
              <dd class="text-base text-gray-900">
                {{ formatTimestamp(tokenParsed?.exp) }}
              </dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500 mb-1">
                Token Expired
              </dt>
              <dd class="text-base">
                <span :class="isTokenExpired() ? 'text-red-600' : 'text-green-600'">
                  {{ isTokenExpired() ? 'Yes' : 'No' }}
                </span>
              </dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500 mb-1">
                Scopes
              </dt>
              <dd class="text-base text-gray-900">
                {{ tokenParsed?.scope || 'N/A' }}
              </dd>
            </div>
          </div>
        </div>

        <div class="border rounded-lg p-4">
          <h2 class="text-xl font-semibold mb-3">
            Access Token
          </h2>
          <div class="bg-gray-50 p-3 rounded text-xs font-mono break-all">
            {{ token || 'No token available' }}
          </div>
          <button
            v-if="token"
            class="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            @click="copyToken"
          >
            {{ copied ? 'Copied!' : 'Copy Token' }}
          </button>
        </div>

        <div class="border rounded-lg p-4">
          <h2 class="text-xl font-semibold mb-3">
            Parsed Token Claims
          </h2>
          <div class="bg-gray-50 p-3 rounded text-xs font-mono overflow-auto max-h-96">
            <pre>{{ JSON.stringify(tokenParsed, null, 2) }}</pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { definePageMeta, ref, useKeycloak } from '#imports'

const { user, token, tokenParsed, isTokenExpired } = useKeycloak()
const copied = ref(false)

definePageMeta({
  middleware: 'keycloak-auth',
})

function formatTimestamp(timestamp?: number) {
  if (!timestamp) return 'N/A'
  return new Date(timestamp * 1000).toLocaleString()
}

async function copyToken() {
  if (!token.value) return
  await navigator.clipboard.writeText(token.value)
  copied.value = true
  setTimeout(() => {
    copied.value = false
  }, 2000)
}
</script>
