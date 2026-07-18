export type HotelStatusFilter = 'ACTIVO' | 'INACTIVO'

export interface HotelFilters {
  search: string
  stars: number | null
  pets: boolean | null
  status: HotelStatusFilter | null
  ordering: string
  page: number
  pageSize: number
}
