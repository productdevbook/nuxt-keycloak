import { defineEventHandler } from 'h3'

/**
 * Public API endpoint - no authentication required
 */
export default defineEventHandler(() => {
  return {
    message: 'This is a public endpoint',
    timestamp: new Date().toISOString(),
    authenticated: false,
  }
})
