import type {
  RateReference,
  SaveRoomRateInput,
} from '@/domain/entities/rate-reference.entity'
import type { RoomType } from '@/domain/entities/room-type.entity'
import type {
  SaveSeasonInput,
  Season,
} from '@/domain/entities/season.entity'
import type { RateManagementRepository } from '@/domain/ports/rate-management.repository'
import { apiConfig } from '@/infrastructure/config/api.config'
import { apiClient } from '@/infrastructure/http/axios-client'

interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

type CollectionResponse<T> =
  | PaginatedResponse<T>
  | T[]

function getResults<T>(
  response: CollectionResponse<T>,
): T[] {
  if (Array.isArray(response)) {
    return response
  }

  return response.results
}

export class AxiosRateManagementRepository
  implements RateManagementRepository {
  async getRoomTypes(): Promise<RoomType[]> {
    const { data } =
      await apiClient.get<
        CollectionResponse<RoomType>
      >(
        apiConfig.endpoints.catalog.roomTypes,
        {
          params: {
            page_size: 100,
            ordering: 'nombre',
          },
        },
      )

    return getResults(data)
  }

  async getSeasons(): Promise<Season[]> {
    const { data } =
      await apiClient.get<
        CollectionResponse<Season>
      >(
        apiConfig.endpoints.rates.seasons,
        {
          params: {
            page_size: 100,
            ordering: 'fecha_inicio',
          },
        },
      )

    return getResults(data)
  }

  async createSeason(
    season: SaveSeasonInput,
  ): Promise<Season> {
    const { data } =
      await apiClient.post<Season>(
        apiConfig.endpoints.rates.seasons,
        season,
      )

    return data
  }

  async updateSeason(
    seasonId: number,
    season: Partial<SaveSeasonInput>,
  ): Promise<Season> {
    const { data } =
      await apiClient.patch<Season>(
        `${apiConfig.endpoints.rates.seasons}${seasonId}/`,
        season,
      )

    return data
  }

  async deleteSeason(
    seasonId: number,
  ): Promise<void> {
    await apiClient.delete(
      `${apiConfig.endpoints.rates.seasons}${seasonId}/`,
    )
  }

  async getRates(): Promise<RateReference[]> {
    const { data } =
      await apiClient.get<
        CollectionResponse<RateReference>
      >(
        apiConfig.endpoints.rates.roomRates,
        {
          params: {
            page_size: 100,
            ordering: 'id',
          },
        },
      )

    return getResults(data)
  }

  async createRate(
    rate: SaveRoomRateInput,
  ): Promise<RateReference> {
    const { data } =
      await apiClient.post<RateReference>(
        apiConfig.endpoints.rates.roomRates,
        rate,
      )

    return data
  }

  async updateRate(
    rateId: number,
    rate: Partial<SaveRoomRateInput>,
  ): Promise<RateReference> {
    const { data } =
      await apiClient.patch<RateReference>(
        `${apiConfig.endpoints.rates.roomRates}${rateId}/`,
        rate,
      )

    return data
  }

  async deleteRate(
    rateId: number,
  ): Promise<void> {
    await apiClient.delete(
      `${apiConfig.endpoints.rates.roomRates}${rateId}/`,
    )
  }

  async getCurrentRate(
    roomTypeId: number,
    date: string,
  ): Promise<RateReference> {
    const { data } =
      await apiClient.get<RateReference>(
        `${apiConfig.endpoints.rates.roomRates}vigente/`,
        {
          params: {
            tipo_habitacion: roomTypeId,
            fecha: date,
          },
        },
      )

    return data
  }
}