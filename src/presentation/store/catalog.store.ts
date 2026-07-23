import type { HotelFilters } from '@/domain/entities/hotel-filters.entity'

export const defaultCatalogFilters: HotelFilters = {
  search: '',
  stars: null,
  pets: null,
  status: null,
  ordering: '-categoria_estrellas',
  page: 1,
  pageSize: 9,
}

export interface CatalogStoreState {
  filters: HotelFilters
}

export function createCatalogInitialState(): CatalogStoreState {
  return {
    filters: { ...defaultCatalogFilters },
  }
}
