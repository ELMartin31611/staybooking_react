import type { AuthTokens } from '@/domain/entities/auth-tokens.entity'
import type { UserProfile } from '@/domain/entities/user-profile.entity'
import type { RegisterDto } from '@/application/dtos/register.dto'

export interface AuthRepository {
  login(
    username: string,
    password: string,
  ): Promise<AuthTokens>

  register(
    data: RegisterDto,
  ): Promise<void>

  getProfile(): Promise<UserProfile>
}
