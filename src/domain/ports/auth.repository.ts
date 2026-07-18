
import type { AuthTokens } from '@/domain/entities/auth-tokens.entity'
import type { UserProfile } from '@/domain/entities/user-profile.entity'
import type { RegisterDto } from '@/application/dtos/register.dto'

export interface AuthRepository {
  login(
    username: string,

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

  
  updateProfile(
    data: Partial<UserProfile>,
  ): Promise<UserProfile>

}
