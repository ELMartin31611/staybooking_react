import type { CreateReservationDto } from '@/application/dtos/create-reservation.dto'
import type { Reservation } from '@/domain/entities/reservation.entity'

export interface ReservationRepository {
  createReservation(
    data: CreateReservationDto,
  ): Promise<Reservation>

  getReservations(): Promise<Reservation[]>

  getReservationById(
    reservationId: number,
  ): Promise<Reservation>

  cancelReservation(
    reservationId: number,
    reason: string,
  ): Promise<Reservation>
}