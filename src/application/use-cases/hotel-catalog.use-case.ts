import type { HotelPreview } from '@/domain/entities/hotel-preview.entity'
import type { PaginatedResult } from '@/domain/entities/paginated-result.entity'
import type { HotelCatalogRepository } from '@/domain/ports/hotel-catalog.repository'
import type { HotelFiltersDto } from '@/application/dtos/hotel-filters.dto'

export class HotelCatalogUseCase {
  private readonly repository: HotelCatalogRepository

  constructor(repository: HotelCatalogRepository) {
    this.repository = repository
  }

  getFeatured(
    pageSize = 6,
  ): Promise<PaginatedResult<HotelPreview>> {
    return this.repository.getPreviews(pageSize)
  }

  list(
    filters: HotelFiltersDto,
  ): Promise<PaginatedResult<HotelPreview>> {
    return this.repository.getHotels({
      page: filters.page,
      pageSize: filters.pageSize,
      search: filters.search,
      ordering: filters.ordering,
      categoriaEstrellas: filters.stars ?? null,
      permiteMascotas: filters.pets ?? null,
      estado: filters.status ?? null,
    })
  }
}
