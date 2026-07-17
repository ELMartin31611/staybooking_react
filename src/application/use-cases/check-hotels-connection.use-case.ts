import type { HotelPreview } from '@/domain/entities/hotel-preview.entity'
import type { PaginatedResult } from '@/domain/entities/paginated-result.entity'
import type { HotelCatalogRepository } from '@/domain/ports/hotel-catalog.repository'

export class CheckHotelsConnectionUseCase {
  private readonly repository: HotelCatalogRepository

  constructor(repository: HotelCatalogRepository) {
    this.repository = repository
  }

  execute(
    pageSize = 3,
  ): Promise<PaginatedResult<HotelPreview>> {
    return this.repository.getPreviews(pageSize)
  }
}