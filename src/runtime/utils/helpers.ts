export function isArray(value: unknown): boolean {
  return Array.isArray(value)
}

export function isNil(value: unknown): boolean {
  return value === undefined || value === null
}

export function isString(value: unknown): boolean {
  return typeof value === 'string'
}
