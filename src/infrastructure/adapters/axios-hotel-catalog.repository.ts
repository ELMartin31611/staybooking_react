import type { HotelPreview } from '@/domain/entities/hotel-preview.entity'
import type { PaginatedResult } from '@/domain/entities/paginated-result.entity'
import type { HotelCatalogRepository } from '@/domain/ports/hotel-catalog.repository'
import { apiConfig } from '@/infrastructure/config/api.config'
import { apiClient } from '@/infrastructure/http/axios-client'

type HotelListResponse =
  | PaginatedResult<HotelPreview>
  | HotelPreview[]

export class AxiosHotelCatalogRepository
  implements HotelCatalogRepository {
  async getPreviews(
    pageSize = 3,
  ): Promise<PaginatedResult<HotelPreview>> {
    const { data } = await apiClient.get<HotelListResponse>(
      apiConfig.endpoints.catalog.hotels,
      {
        params: {
          page: 1,
          page_size: pageSize,
          ordering: 'id',
        },
      },
    )

    if (Array.isArray(data)) {
      return {
        count: data.length,
        next: null,
        previous: null,
        results: data,
      }
    }

    return data
  }
}