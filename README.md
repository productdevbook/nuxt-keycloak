# Nuxt Keycloak

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

Comprehensive Keycloak authentication module for Nuxt 4 with SSR support, auto token refresh, role-based guards, and TypeScript.

- [✨ &nbsp;Release Notes](/CHANGELOG.md)

## Features

- 🔐 **Hybrid Authentication** - Support for both client-side (SPA) and server-side rendering (SSR) modes
- 🔄 **Auto Token Refresh** - Automatically refresh access tokens before expiration
- 🛡️ **Role-Based Guards** - Protect routes with realm and client/resource roles
- 📘 **TypeScript Support** - Full type safety with comprehensive TypeScript definitions
- 🔍 **Silent Check-SSO** - Non-intrusive authentication check for optional auth
- 🔑 **JWT Verification** - Secure server-side token validation using JWKS with `jose`
- ⚙️ **Configurable** - Every feature can be toggled via configuration
- 🎯 **Production Ready** - Error handling, logging, and security best practices

## Quick Setup

1. Install the module:

```bash
pnpm add nuxt-keycloak
# or
npm install nuxt-keycloak
# or
yarn add nuxt-keycloak
```

2. Add `nuxt-keycloak` to the `modules` section of `nuxt.config.ts`:

```typescript
export default defineNuxtConfig({
  modules: ['nuxt-keycloak'],

  keycloak: {
    url: 'http://localhost:8080',
    realm: 'your-realm',
    clientId: 'your-client-id',
  }
})
```

3. Configure environment variables (optional):

```env
NUXT_PUBLIC_KEYCLOAK_URL=http://localhost:8080
NUXT_PUBLIC_KEYCLOAK_REALM=your-realm
NUXT_PUBLIC_KEYCLOAK_CLIENT_ID=your-client-id
```

That's it! You can now use Keycloak authentication in your Nuxt app ✨


## Usage

### Basic Authentication

Use the `useKeycloak()` composable in your components:

```vue
<script setup>
const { isAuthenticated, user, login, logout } = useKeycloak()
</script>

<template>
  <div>
    <div v-if="!isAuthenticated">
      <button @click="login()">Login</button>
    </div>
    <div v-else>
      <p>Welcome, {{ user?.username }}!</p>
      <button @click="logout()">Logout</button>
    </div>
  </div>
</template>
```

### Protecting Pages

Protect entire pages by adding middleware:

```vue
<!-- pages/dashboard.vue -->
<script setup>
definePageMeta({
  middleware: 'keycloak-auth'
})
</script>
```

### Role-Based Access Control

Protect pages based on Keycloak roles:

```vue
<!-- pages/admin.vue -->
<script setup>
definePageMeta({
  middleware: ['keycloak-auth', 'keycloak-role'],
  keycloakRoles: {
    realm: ['admin'], // Requires 'admin' realm role
    resource: {  // OR requires client role
      clientId: 'my-app',
      roles: ['manager']
    }
  }
})
</script>
```

### Protecting API Routes

Server utilities are automatically available in Nuxt server routes (no import needed):

```typescript
// server/api/protected.ts
export default defineEventHandler(async (event) => {
  // Require authentication - auto-imported
  const user = requireKeycloakAuth(event)

  return {
    message: 'Protected data',
    user
  }
})
```

```typescript
// server/api/admin.ts
export default defineEventHandler(async (event) => {
  // Require specific role - auto-imported
  const user = requireRealmRole(event, 'admin')

  return {
    message: 'Admin data',
    user
  }
})
```

You can also explicitly import from `nuxt-keycloak/server`:

```typescript
// server/api/custom.ts
import { extractToken, verifyKeycloakToken, requireRealmRole } from 'nuxt-keycloak/server'

export default defineEventHandler(async (event) => {
  const token = extractToken(event)
  const user = await verifyKeycloakToken(token)

  // Use imported functions
  requireRealmRole(event, 'admin')

  return { user }
})
```

### Manual Token Verification

For more control, manually verify tokens:

```typescript
// server/api/custom.ts
export default defineEventHandler(async (event) => {
  const token = extractToken(event)

  if (!token) {
    throw createError({
      statusCode: 401,
      message: 'No token provided'
    })
  }

  const user = await verifyKeycloakToken(token)

  if (!user) {
    throw createError({
      statusCode: 401,
      message: 'Invalid token'
    })
  }

  // Check custom logic
  if (!hasRealmRole(event, 'special-access')) {
    throw createError({
      statusCode: 403,
      message: 'Forbidden'
    })
  }

  return { user }
})
```

## Configuration

### Module Options

All configuration options:

```typescript
export default defineNuxtConfig({
  keycloak: {
    // Keycloak server URL
    url: 'http://localhost:8080',

    // Realm name
    realm: 'my-realm',

    // Client ID (must be a public client)
    clientId: 'my-client',

    // Keycloak initialization options
    initOptions: {
      onLoad: 'check-sso', // or 'login-required'
      pkceMethod: 'S256',
      flow: 'standard',
      checkLoginIframe: false,
      silentCheckSsoRedirectUri: 'http://localhost:3000/silent-check-sso.html'
    },

    // Server-side configuration
    server: {
      verifyToken: true, // Enable server-side token verification
      middleware: false, // Enable global middleware
      jwksCacheDuration: 600000 // JWKS cache duration (10 minutes)
    },

    // Client-side configuration
    client: {
      autoRefreshToken: true, // Auto-refresh tokens
      minTokenValidity: 30, // Refresh when < 30s validity
      persistRefreshToken: true // Store refresh token in localStorage
    }
  }
})
```

### Environment Variables

Use environment variables for different environments:

```env
# Public (exposed to client)
NUXT_PUBLIC_KEYCLOAK_URL=https://keycloak.example.com
NUXT_PUBLIC_KEYCLOAK_REALM=production
NUXT_PUBLIC_KEYCLOAK_CLIENT_ID=nuxt-app
NUXT_PUBLIC_APP_URL=https://app.example.com

# Private (server-only)
NUXT_KEYCLOAK_SERVER_VERIFY_TOKEN=true
NUXT_KEYCLOAK_SERVER_MIDDLEWARE=false
```

## API Reference

### Composables

#### `useKeycloak()`

Returns:
- `keycloak` - Keycloak instance (client-side only)
- `isAuthenticated` - Authentication status
- `isInitialized` - Initialization status
- `user` - User profile data
- `token` - Access token
- `tokenParsed` - Parsed token claims
- `login(redirectUri?)` - Redirect to login
- `logout(redirectUri?)` - Logout user
- `register(redirectUri?)` - Redirect to registration
- `updateToken(minValidity?)` - Manually refresh token
- `loadUserProfile()` - Load user profile
- `hasRealmRole(role)` - Check realm role
- `hasResourceRole(role, resource?)` - Check client role
- `isTokenExpired(minValidity?)` - Check token expiration

### Server Utilities

All utilities are **auto-imported** in Nuxt server routes. You can also explicitly import them from `nuxt-keycloak/server`:

```typescript
import {
  verifyKeycloakToken,
  extractToken,
  requireKeycloakAuth
} from 'nuxt-keycloak/server'
```

**Available Functions:**

- `verifyKeycloakToken(token)` - Verify JWT token using JWKS
- `extractToken(event)` - Extract Bearer token from Authorization header
- `getKeycloakUser(event)` - Get authenticated user from context
- `getKeycloakToken(event)` - Get access token from context
- `isAuthenticated(event)` - Check if user is authenticated
- `hasRealmRole(event, role)` - Check if user has realm role
- `hasResourceRole(event, role, resource?)` - Check if user has client role
- `requireKeycloakAuth(event)` - Require authentication (throws 401 if not authenticated)
- `requireRealmRole(event, role)` - Require realm role (throws 403 if missing)
- `requireResourceRole(event, role, resource?)` - Require client role (throws 403 if missing)

### Middleware

- `keycloak-auth` - Protect routes (requires authentication)
- `keycloak-role` - Enforce role-based access (use with route meta)

## Keycloak Setup

### 1. Create a Realm

1. Login to Keycloak Admin Console
2. Create a new realm or use existing
3. Note the realm name

### 2. Create a Client

1. Go to Clients → Create
2. **Client ID**: Your app name (e.g., `nuxt-app`)
3. **Client Protocol**: `openid-connect`
4. **Access Type**: `public` (for SPA/Nuxt)
5. **Valid Redirect URIs**: `http://localhost:3000/*` (or your app URL)
6. **Web Origins**: `http://localhost:3000` (or your app URL)
7. Save

### 3. Configure Client Settings

- **Standard Flow**: Enabled
- **Direct Access Grants**: Enabled (for password grant)
- **Implicit Flow**: Disabled (use PKCE instead)

### 4. Create Roles (Optional)

1. Go to Roles → Add Role
2. Create roles like `admin`, `user`, `manager`
3. Assign roles to users

### 5. Create Users

1. Go to Users → Add User
2. Set username, email, etc.
3. Go to Credentials tab → Set password
4. Go to Role Mappings → Assign roles

## Examples

Check out the [playground](./playground) directory for comprehensive examples:

- **Public Page** - `/` - No authentication required
- **Dashboard** - `/dashboard` - Requires authentication
- **Admin Panel** - `/admin` - Requires 'admin' realm role
- **Profile** - `/profile` - Shows user info and token details

## Troubleshooting

### CORS Errors

Make sure your Keycloak client has the correct **Web Origins** configured. Add your app's origin (e.g., `http://localhost:3000`).

### Token Not Refreshing

Check that:
1. `client.autoRefreshToken` is `true` in config
2. Refresh token is valid and not expired
3. Client has **Standard Flow** enabled in Keycloak

### Silent Check-SSO Not Working

1. Create `/public/silent-check-sso.html` file (see playground)
2. Configure `initOptions.silentCheckSsoRedirectUri` in config
3. Add the URL to **Valid Redirect URIs** in Keycloak client

### Role Middleware Not Working

Ensure:
1. User has the required role assigned in Keycloak
2. Route meta includes `keycloakRoles` configuration
3. Both `keycloak-auth` and `keycloak-role` middlewares are applied

## Contribution

<details>
  <summary>Local development</summary>

  ```bash
  # Install dependencies
  pnpm install

  # Generate type stubs
  pnpm run dev:prepare

  # Develop with the playground
  pnpm run dev

  # Build the playground
  pnpm run dev:build

  # Run ESLint
  pnpm run lint

  # Run Vitest
  pnpm run test
  pnpm run test:watch

  # Release new version
  pnpm run release
  ```

</details>

## Credits

This project was inspired by and builds upon ideas from:
- [vue-keycloak](https://github.com/JoseGoncalves/vue-keycloak) by José Miguel Gonçalves and Gery Hirschfeld (Apache 2.0)

Special thanks to the open-source community for their contributions to Keycloak integration solutions.

## License

[MIT License](./LICENSE)

Copyright (c) 2025

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/nuxt-keycloak/latest.svg?style=flat&colorA=020420&colorB=00DC82
[npm-version-href]: https://npmjs.com/package/nuxt-keycloak

[npm-downloads-src]: https://img.shields.io/npm/dm/nuxt-keycloak.svg?style=flat&colorA=020420&colorB=00DC82
[npm-downloads-href]: https://npm.chart.dev/nuxt-keycloak

[license-src]: https://img.shields.io/npm/l/nuxt-keycloak.svg?style=flat&colorA=020420&colorB=00DC82
[license-href]: https://npmjs.com/package/nuxt-keycloak

[nuxt-src]: https://img.shields.io/badge/Nuxt-020420?logo=nuxt.js
[nuxt-href]: https://nuxt.com
