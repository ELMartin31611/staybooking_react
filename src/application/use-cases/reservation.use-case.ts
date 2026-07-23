import type { CreateReservationDto } from '@/application/dtos/create-reservation.dto'
import type { ReservationRepository } from '@/domain/ports/reservation.repository'

export class ReservationUseCase {
  private readonly repository: ReservationRepository

  constructor(
    repository: ReservationRepository,
  ) {
    this.repository = repository
  }

  createReservation(
    data: CreateReservationDto,
  ) {
    if (
      !data.fecha_entrada
      || !data.fecha_salida
    ) {
      throw new Error(
        'Selecciona las fechas de la reserva.',
      )
    }

    if (
      data.fecha_salida
      <= data.fecha_entrada
    ) {
      throw new Error(
        'La fecha de salida debe ser posterior a la entrada.',
      )
    }

    if (data.habitaciones.length === 0) {
      throw new Error(
        'Selecciona al menos una habitación.',
      )
    }

    if (data.huespedes.length === 0) {
      throw new Error(
        'Registra los huéspedes de la reserva.',
      )
    }

    return this.repository.createReservation(
      data,
    )
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

  cancelReservation(
    reservationId: number,
    reason: string,
  ) {
    if (
      !Number.isInteger(reservationId)
      || reservationId <= 0
    ) {
      throw new Error(
        'La reserva que deseas cancelar no es válida.',
      )
    }

    if (!reason.trim()) {
      throw new Error(
        'Ingresa el motivo de la cancelación.',
      )
    }

    return this.repository.cancelReservation(
      reservationId,
      reason.trim(),
    )
  }
}