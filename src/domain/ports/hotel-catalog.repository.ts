import type { HotelPreview } from '@/domain/entities/hotel-preview.entity'
import type { PaginatedResult } from '@/domain/entities/paginated-result.entity'

export interface HotelCatalogQueryParams {
  page?: number
  pageSize?: number
  search?: string
  ordering?: string
  categoriaEstrellas?: number | null
  permiteMascotas?: boolean | null
  estado?: string | null
}

export interface HotelCatalogRepository {
  getPreviews(
    pageSize?: number,
  ): Promise<PaginatedResult<HotelPreview>>

  getHotels(
    params?: HotelCatalogQueryParams,
  ): Promise<PaginatedResult<HotelPreview>>
}