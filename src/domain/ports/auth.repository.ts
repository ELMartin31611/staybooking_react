import type { RegisterDto } from '@/application/dtos/register.dto'
import type { AuthTokens } from '@/domain/entities/auth-tokens.entity'
import type { UserProfile } from '@/domain/entities/user-profile.entity'

export interface AuthRepository {
  login(
    email: string,
    password: string,
  ): Promise<AuthTokens>

  register(
    data: RegisterDto,
  ): Promise<void>

  getProfile(): Promise<UserProfile>
}
