import type { HotelPreview } from '@/domain/entities/hotel-preview.entity'
import type { PaginatedResult } from '@/domain/entities/paginated-result.entity'

export interface HotelCatalogRepository {
  getPreviews(
    pageSize?: number,
  ): Promise<PaginatedResult<HotelPreview>>
}