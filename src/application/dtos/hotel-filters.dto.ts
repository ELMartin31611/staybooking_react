import type { HotelStatusFilter } from '@/domain/entities/hotel-filters.entity'

export interface HotelFiltersDto {
  search?: string
  stars?: number | null
  pets?: boolean | null
  status?: HotelStatusFilter | null
  ordering?: string
  page?: number
  pageSize?: number
}
