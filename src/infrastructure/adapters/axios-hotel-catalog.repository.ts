import type { HotelPreview } from '@/domain/entities/hotel-preview.entity'
import type { PaginatedResult } from '@/domain/entities/paginated-result.entity'
import type {
  HotelCatalogQueryParams,
  HotelCatalogRepository,
} from '@/domain/ports/hotel-catalog.repository'
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
    return this.getHotels({
      page: 1,
      pageSize,
      ordering: 'id',
    })
  }

  async getHotels(
    params: HotelCatalogQueryParams = {},
  ): Promise<PaginatedResult<HotelPreview>> {
    const {
      page = 1,
      pageSize = 12,
      search,
      ordering = 'id',
      categoriaEstrellas,
      permiteMascotas,
      estado,
    } = params

    const requestParams: Record<string, string | number | boolean> = {
      page,
      page_size: pageSize,
      ordering,
    }

    if (search?.trim()) {
      requestParams.search = search.trim()
    }

    if (typeof categoriaEstrellas === 'number') {
      requestParams.categoria_estrellas = categoriaEstrellas
    }

    if (typeof permiteMascotas === 'boolean') {
      requestParams.permite_mascotas = permiteMascotas
    }

    if (estado?.trim()) {
      requestParams.estado = estado.trim()
    }

    const { data } = await apiClient.get<HotelListResponse>(
      apiConfig.endpoints.catalog.hotels,
      {
        params: requestParams,
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