import axios, {
  type AxiosError,
  type InternalAxiosRequestConfig,
} from 'axios'

import { apiConfig } from '@/infrastructure/config/api.config'
import { localTokenStorage } from '@/infrastructure/storage/local-token-storage'

import { parseApiError } from './parse-api-error'

interface RetryableRequestConfig
  extends InternalAxiosRequestConfig {
  _retry?: boolean
}

interface RefreshedTokens {
  access_token: string
  refresh_token?: string
}

export const SESSION_EXPIRED_EVENT =
  'staybooking:session-expired'

const refreshClient = axios.create({
  baseURL: apiConfig.baseURL,
  timeout: apiConfig.timeout,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

export const apiClient = axios.create({
  baseURL: apiConfig.baseURL,
  timeout: apiConfig.timeout,
  headers: {
    Accept: 'application/json',
  },
})

let refreshPromise: Promise<string> | null = null

function notifySessionExpired(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent(SESSION_EXPIRED_EVENT),
    )
  }
}

function isAuthenticationRequest(url?: string): boolean {
  if (!url) {
    return false
  }

  return [
    apiConfig.endpoints.auth.login,
    apiConfig.endpoints.auth.register,
    apiConfig.endpoints.auth.refresh,
  ].some((endpoint) => url.includes(endpoint))
}

apiClient.interceptors.request.use(
  (config) => {
    const accessToken = localTokenStorage.getAccessToken()

    if (accessToken) {
      config.headers.set(
        'Authorization',
        `Bearer ${accessToken}`,
      )
    }

    return config
  },
  (error: unknown) => Promise.reject(parseApiError(error)),
)

apiClient.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const status = error.response?.status
    const originalRequest =
      error.config as RetryableRequestConfig | undefined

    const canAttemptRefresh =
      status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !isAuthenticationRequest(originalRequest.url)

    if (!canAttemptRefresh) {
      return Promise.reject(parseApiError(error))
    }

    const refreshToken =
      localTokenStorage.getRefreshToken()

    if (!refreshToken) {
      localTokenStorage.clearTokens()
      notifySessionExpired()

      return Promise.reject(parseApiError(error))
    }

    originalRequest._retry = true

    if (!refreshPromise) {
      refreshPromise = refreshClient
        .post<RefreshedTokens>(
          apiConfig.endpoints.auth.refresh,
          {
            refresh: refreshToken,
          },
        )
        .then(({ data }) => {
          localTokenStorage.updateTokens(data)

          return data.access_token
        })
        .catch((refreshError: unknown) => {
          localTokenStorage.clearTokens()
          notifySessionExpired()

          throw parseApiError(refreshError)
        })
        .finally(() => {
          refreshPromise = null
        })
    }

    try {
      const newAccessToken = await refreshPromise

      originalRequest.headers.set(
        'Authorization',
        `Bearer ${newAccessToken}`,
      )

      return apiClient(originalRequest)
    } catch (refreshError) {
      return Promise.reject(refreshError)
    }
  },
)