<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="px-4 py-6 sm:px-0">
    <div class="text-center">
      <h1 class="text-4xl font-bold text-gray-900 mb-4">
        Welcome to Nuxt Keycloak
      </h1>
      <p class="text-xl text-gray-600 mb-8">
        Comprehensive Keycloak authentication module for Nuxt 4
      </p>

      <div class="max-w-3xl mx-auto">
        <div class="bg-white shadow rounded-lg p-6 mb-6">
          <h2 class="text-2xl font-semibold mb-4">
            Features
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <div class="border rounded p-4">
              <h3 class="font-medium text-lg mb-2">
                🔐 Hybrid Authentication
              </h3>
              <p class="text-gray-600 text-sm">
                Support for both client-side (SPA) and server-side rendering (SSR) modes
              </p>
            </div>
            <div class="border rounded p-4">
              <h3 class="font-medium text-lg mb-2">
                🔄 Auto Token Refresh
              </h3>
              <p class="text-gray-600 text-sm">
                Automatically refresh access tokens before expiration
              </p>
            </div>
            <div class="border rounded p-4">
              <h3 class="font-medium text-lg mb-2">
                🛡️ Role-Based Guards
              </h3>
              <p class="text-gray-600 text-sm">
                Protect routes with realm and client/resource roles
              </p>
            </div>
            <div class="border rounded p-4">
              <h3 class="font-medium text-lg mb-2">
                📘 TypeScript Support
              </h3>
              <p class="text-gray-600 text-sm">
                Full type safety with comprehensive TypeScript definitions
              </p>
            </div>
            <div class="border rounded p-4">
              <h3 class="font-medium text-lg mb-2">
                🔍 Silent Check-SSO
              </h3>
              <p class="text-gray-600 text-sm">
                Non-intrusive authentication check for optional auth
              </p>
            </div>
            <div class="border rounded p-4">
              <h3 class="font-medium text-lg mb-2">
                🔑 JWT Verification
              </h3>
              <p class="text-gray-600 text-sm">
                Secure server-side token validation using JWKS
              </p>
            </div>
          </div>
        </div>

        <div class="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 class="text-xl font-semibold mb-4 text-blue-900">
            Try the Demo
          </h2>
          <div class="space-y-3 text-left text-sm text-blue-800">
            <p>• <strong>Public Page:</strong> You're on it! No authentication required.</p>
            <p>• <strong>Dashboard:</strong> Requires authentication. Login to access.</p>
            <p>• <strong>Admin:</strong> Requires 'admin' realm role. Only for administrators.</p>
            <p>• <strong>Profile:</strong> View your user information and token details.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>
