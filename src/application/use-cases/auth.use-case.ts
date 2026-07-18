import type { LoginDto } from '../dtos/login.dto'
import type { RegisterDto } from '../dtos/register.dto'
import type { AuthRepository } from '@/domain/ports/auth.repository'

export class AuthUseCase {
  private readonly repository: AuthRepository

  constructor(
    repository: AuthRepository,
  ) {
    this.repository = repository
  }

  login(data: LoginDto) {
    return this.repository.login(
      data.email,
      data.password,
    )
  }

  register(data: RegisterDto) {
    return this.repository.register(data)
  }

  getProfile() {
    return this.repository.getProfile()
  }
}
