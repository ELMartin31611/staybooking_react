const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim()

if (!rawApiBaseUrl) {
  throw new Error(
    'La variable VITE_API_BASE_URL no está configurada.',
  )
}

const apiBaseUrl = rawApiBaseUrl.endsWith('/')
  ? rawApiBaseUrl
  : `${rawApiBaseUrl}/`

export const env = Object.freeze({
  apiBaseUrl,
})