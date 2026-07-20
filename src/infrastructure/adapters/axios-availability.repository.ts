import type { AvailabilityParams } from '@/application/dtos/availability.dto'
import type { PaginatedResult } from '@/domain/entities/paginated-result.entity'
import type { Room } from '@/domain/entities/room.entity'
import type { AvailabilityRepository } from '@/domain/ports/availability.repository'
import { apiConfig } from '@/infrastructure/config/api.config'
import { apiClient } from '@/infrastructure/http/axios-client'

type AvailabilityResponse =
  | PaginatedResult<Room>
  | Room[]

function getRooms(
  response: AvailabilityResponse,
): Room[] {
  if (Array.isArray(response)) {
    return response
  }

  return response.results
}

export class AxiosAvailabilityRepository
  implements AvailabilityRepository {
  async getAvailableRooms(
    params: AvailabilityParams,
  ): Promise<Room[]> {
    const { data } =
      await apiClient.get<AvailabilityResponse>(
        `${apiConfig.endpoints.catalog.rooms}disponibles/`,
        {
          params: {
            ...params,
            page_size: 100,
          },
        },
      )

    return getRooms(data)
  }
}