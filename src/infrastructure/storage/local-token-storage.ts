import type {
  AuthTokens,
  RefreshedTokens,
} from '@/domain/entities/auth-tokens.entity'

const ACCESS_TOKEN_KEY = 'access_token'
const REFRESH_TOKEN_KEY = 'refresh_token'

export const localTokenStorage = {
  getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY)
  },

  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY)
  },

  saveTokens(tokens: AuthTokens): void {
    localStorage.setItem(ACCESS_TOKEN_KEY, tokens.access)
    localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refresh)
  },

  updateTokens(tokens: RefreshedTokens): void {
    localStorage.setItem(ACCESS_TOKEN_KEY, tokens.access)

    if (tokens.refresh) {
      localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refresh)
    }
  },

  clearTokens(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
  },

  hasTokens(): boolean {
    return Boolean(
      localStorage.getItem(ACCESS_TOKEN_KEY) &&
      localStorage.getItem(REFRESH_TOKEN_KEY),
    )
  },
}