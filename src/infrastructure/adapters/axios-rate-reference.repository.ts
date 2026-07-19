import type { RateReference } from '@/domain/entities/rate-reference.entity'
import type { RateReferenceRepository } from '@/domain/ports/rate-reference.repository'
import { apiConfig } from '@/infrastructure/config/api.config'
import { apiClient } from '@/infrastructure/http/axios-client'

interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

type RateCollectionResponse =
  | PaginatedResponse<RateReference>
  | RateReference[]

function getResults(
  response: RateCollectionResponse,
): RateReference[] {
  if (Array.isArray(response)) {
    return response
  }

  return response.results
}

export class AxiosRateReferenceRepository
  implements RateReferenceRepository {
  async getRates(): Promise<RateReference[]> {
    const { data } =
      await apiClient.get<RateCollectionResponse>(
        apiConfig.endpoints.rates.roomRates,
        {
          params: {
            page_size: 100,
            is_active: true,
          },
        },
      )

    return getResults(data)
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