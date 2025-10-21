<template>
  <ClientOnly>
    <div class="flex items-center space-x-4">
      <div
        v-if="isPending"
        class="text-sm text-gray-500"
      >
        Loading...
      </div>

      <div
        v-else-if="!isAuthenticated"
        class="flex items-center space-x-3"
      >
        <span class="text-sm text-gray-700">Not logged in</span>
        <button
          class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          @click="login"
        >
          Login
        </button>
      </div>

      <div
        v-else
        class="flex items-center space-x-3"
      >
        <div class="text-sm">
          <div class="font-medium text-gray-900">
            {{ user?.username || user?.email || 'User' }}
          </div>
          <div class="text-gray-500">
            {{ user?.email }}
          </div>
        </div>
        <button
          class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          @click="logout"
        >
          Logout
        </button>
      </div>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { useKeycloak } from '#imports'

const { isPending, isAuthenticated, user, login, logout } = useKeycloak()
</script>
