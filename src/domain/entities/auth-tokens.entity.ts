export interface AuthTokens {
  access: string
  refresh: string
}

export interface RefreshedTokens {
  access: string
  refresh?: string
}