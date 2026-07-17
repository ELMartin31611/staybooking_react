import { RateReferenceUseCase } from '@/application/use-cases/rate-reference.use-case'
import { AxiosRateReferenceRepository } from '@/infrastructure/adapters/axios-rate-reference.repository'

export function createRateReferenceUseCase(): RateReferenceUseCase {
  const repository = new AxiosRateReferenceRepository()

  return new RateReferenceUseCase(repository)
}