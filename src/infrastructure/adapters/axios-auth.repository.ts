import type { RegisterDto } from '@/application/dtos/register.dto'
import type { AuthTokens } from '@/domain/entities/auth-tokens.entity'
import type { UserProfile } from '@/domain/entities/user-profile.entity'
import type { AuthRepository } from '@/domain/ports/auth.repository'

import { apiConfig } from '@/infrastructure/config/api.config'
import { apiClient } from '@/infrastructure/http/axios-client'

export class AxiosAuthRepository implements AuthRepository {
  async login(
    username: string,
    password: string,
  ): Promise<AuthTokens> {
    const { data } = await apiClient.post<AuthTokens>(
      apiConfig.endpoints.auth.login,
      {
        username,
        password,
      },
    )

    return data
  }

  async register(data: RegisterDto): Promise<void> {
    await apiClient.post(
      apiConfig.endpoints.auth.register,
      data,
    )
  }

  async getProfile(): Promise<UserProfile> {
    const { data } = await apiClient.get<UserProfile>(
      apiConfig.endpoints.auth.profile,
    )

    return data
  }

  async updateProfile(
    data: Partial<UserProfile>,
  ): Promise<UserProfile> {
    const { data: profile } =
      await apiClient.patch<UserProfile>(
        apiConfig.endpoints.auth.profile,
        data,
      )

    const requestedEmail = data.email?.trim()
    const shouldRetryByProfilesEndpoint =
      Boolean(requestedEmail)
      && profile.id
      && requestedEmail !== profile.email

    if (shouldRetryByProfilesEndpoint) {
      try {
        const { data: retriedProfile } =
          await apiClient.patch<UserProfile>(
            `${apiConfig.endpoints.customers.profiles}${profile.id}/`,
            {
              email: requestedEmail,
            },
          )

        return retriedProfile
      } catch {
        // Keep /perfil/ response when fallback endpoint is unavailable.
      }
    }

    return profile
  }


}