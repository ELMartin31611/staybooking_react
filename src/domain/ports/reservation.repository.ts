import type { Reservation } from '@/domain/entities/reservation.entity'

export interface ReservationRepository {
  getReservations(): Promise<Reservation[]>

  getReservationById(
    reservationId: number,
  ): Promise<Reservation>
}