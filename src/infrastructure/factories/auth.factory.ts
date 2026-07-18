import { AuthUseCase } from '@/application/use-cases/auth.use-case'
import { AxiosAuthRepository } from '@/infrastructure/adapters/axios-auth.repository'

const authRepository =
  new AxiosAuthRepository()

export const authUseCase =
  new AuthUseCase(
    authRepository,
  )
