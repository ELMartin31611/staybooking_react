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

export class AxiosRateReferenceRepository
  implements RateReferenceRepository
{
  async getRates(): Promise<RateReference[]> {
    const { data } = await apiClient.get<
      PaginatedResponse<RateReference>
    >(apiConfig.endpoints.rates.roomRates)

    return data.results
  }
}