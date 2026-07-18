import type { LoginDto } from '@/application/dtos/login.dto'
import type { RegisterDto } from '@/application/dtos/register.dto'
import type { UserProfile } from '@/domain/entities/user-profile.entity'
import type { AuthRepository } from '@/domain/ports/auth.repository'

export class AuthUseCase {
  private readonly repository: AuthRepository

  constructor(repository: AuthRepository) {
    this.repository = repository
  }

  login(data: LoginDto) {
    return this.repository.login(
      data.username,
      data.password,
    )
  }

  register(data: RegisterDto) {
    return this.repository.register(data)
  }

  getProfile() {
    return this.repository.getProfile()
  }

  updateProfile(data: Partial<UserProfile>) {
    return this.repository.updateProfile(data)
  }


}