# Troubleshooting Guide

## Problem: "Invalid Redirect URI"

This error occurs when you use a redirect URI that is not whitelisted in your Keycloak client configuration.

## Solution

### 1. Access Keycloak Admin Console
```
https://your-keycloak-server.com/admin/
```

### 2. Select Your Realm
- From the left menu, select your realm (e.g., **"my-realm"**)

### 3. Open Client Settings
- From the left menu, select **Clients**
- Find and click on your client (e.g., **"my-nuxt-app"**)

### 4. Add Valid Redirect URIs

In the **Settings** tab, add these URLs:

```
http://localhost:3000/*
http://localhost:3000
https://your-domain.com/*
```

**NOTE:** You can use wildcards (`*`) but using specific paths is more secure in production.

### 5. Add Valid Post Logout Redirect URIs

```
http://localhost:3000/*
http://localhost:3000
https://your-domain.com/*
```

### 6. Add Web Origins (for CORS)

```
http://localhost:3000
https://your-domain.com
```

### 7. Other Important Settings

**Access Type:** `public`

**Standard Flow Enabled:** `ON`

**Direct Access Grants Enabled:** `ON` (optional)

**Valid Post Logout Redirect URIs:** Same as above

### 8. Save Changes

Click the **Save** button at the bottom of the page.

## Test the Configuration

1. Restart your application: `pnpm run dev`
2. You should see in the console:
   ```
   [nuxt-keycloak] Login redirect URI: http://localhost:3000/dashboard
   ```
3. Click the login button
4. You should no longer see the error!

## Still Getting Errors?

Check the redirect URI shown in the console and make sure **exactly** this URL is whitelisted in Keycloak.

Example:
```
Console: http://localhost:3000/dashboard
Keycloak: http://localhost:3000/* ✅
```

## Other Common Issues

### CORS Errors

Make sure your Keycloak client has the correct **Web Origins** configured. Add your app's origin (e.g., `http://localhost:3000`).

### Token Not Refreshing

Check that:
1. `client.autoRefreshToken` is `true` in config
2. Refresh token is valid and not expired
3. Client has **Standard Flow** enabled in Keycloak

### Silent Check-SSO Not Working

The module automatically creates `/public/silent-check-sso.html` for you. If you need to customize it:

1. The file is automatically generated in your `public/` directory
2. Configure `initOptions.silentCheckSsoRedirectUri` in config (e.g., `http://localhost:3000/silent-check-sso.html`)
3. Add the URL to **Valid Redirect URIs** in Keycloak client

### Role Middleware Not Working

Ensure:
1. User has the required role assigned in Keycloak
2. Route meta includes `keycloakRoles` configuration
3. Both `keycloak-auth` and `keycloak-role` middlewares are applied

### SSL Certificate Verification Issues

If you're using self-signed certificates in development, you can disable SSL verification:

```typescript
export default defineNuxtConfig({
  keycloak: {
    server: {
      rejectUnauthorized: false // Disable in development only!
    }
  }
})
```

**Warning:** Never disable SSL verification in production!
