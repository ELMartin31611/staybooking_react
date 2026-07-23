import { ReservationUseCase } from '@/application/use-cases/reservation.use-case'
import { AxiosReservationRepository } from '@/infrastructure/adapters/axios-reservation.repository'

const reservationRepository =
  new AxiosReservationRepository()

export const reservationUseCase =
  new ReservationUseCase(
    reservationRepository,
  )