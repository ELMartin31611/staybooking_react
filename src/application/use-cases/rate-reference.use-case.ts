import type { RateReferenceRepository } from '@/domain/ports/rate-reference.repository'

export class RateReferenceUseCase {
  private readonly repository:
    RateReferenceRepository

  constructor(
    repository: RateReferenceRepository,
  ) {
    this.repository = repository
  }

  getRates() {
    return this.repository.getRates()
  }

  getCurrentRate(
    roomTypeId: number,
    date: string,
  ) {
    if (
      !Number.isInteger(roomTypeId)
      || roomTypeId <= 0
    ) {
      throw new Error(
        'El tipo de habitación no es válido.',
      )
    }

    if (!date) {
      throw new Error(
        'La fecha para consultar la tarifa es obligatoria.',
      )
    }

    return this.repository.getCurrentRate(
      roomTypeId,
      date,
    )
  }
}