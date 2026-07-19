import { RateManagementUseCase } from '@/application/use-cases/rate-management.use-case'
import { AxiosRateManagementRepository } from '@/infrastructure/adapters/axios-rate-management.repository'

export function createRateManagementUseCase():
  RateManagementUseCase {
  const repository =
    new AxiosRateManagementRepository()

  return new RateManagementUseCase(
    repository,
  )
}

export const rateManagementUseCase =
  createRateManagementUseCase()