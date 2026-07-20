import type { ReservationRepository } from '@/domain/ports/reservation.repository'

export class ReservationUseCase {
  private readonly repository: ReservationRepository

  constructor(
    repository: ReservationRepository,
  ) {
    this.repository = repository
  }

  getReservations() {
    return this.repository.getReservations()
  }

  getReservationById(
    reservationId: number,
  ) {
    if (
      !Number.isInteger(reservationId)
      || reservationId <= 0
    ) {
      throw new Error(
        'La reserva solicitada no es válida.',
      )
    }

    return this.repository.getReservationById(
      reservationId,
    )
  }
}