import type { RateReferenceRepository } from '@/domain/ports/rate-reference.repository'

export class RateReferenceUseCase {
  private readonly repository: RateReferenceRepository

  constructor(repository: RateReferenceRepository) {
    this.repository = repository
  }

  getRates() {
    return this.repository.getRates()
  }
}