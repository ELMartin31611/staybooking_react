import type { PaginatedResult } from '@/domain/entities/paginated-result.entity'
import type { Reservation } from '@/domain/entities/reservation.entity'
import type { ReservationRepository } from '@/domain/ports/reservation.repository'
import { apiConfig } from '@/infrastructure/config/api.config'
import { apiClient } from '@/infrastructure/http/axios-client'

type ReservationCollectionResponse =
  | PaginatedResult<Reservation>
  | Reservation[]

function getReservations(
  response: ReservationCollectionResponse,
): Reservation[] {
  if (Array.isArray(response)) {
    return response
  }

  return response.results
}

export class AxiosReservationRepository
  implements ReservationRepository {
  async getReservations(): Promise<Reservation[]> {
    const { data } =
      await apiClient.get<ReservationCollectionResponse>(
        apiConfig.endpoints.reservations.reservations,
        {
          params: {
            page_size: 100,
            ordering: '-created_at',
          },
        },
      )

    return getReservations(data)
  }

  async getReservationById(
    reservationId: number,
  ): Promise<Reservation> {
    const { data } =
      await apiClient.get<Reservation>(
        `${apiConfig.endpoints.reservations.reservations}${reservationId}/`,
      )

    return data
  }
}