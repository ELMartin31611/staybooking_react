import { useQuery } from '@tanstack/react-query'

import type { HotelPreview } from '@/domain/entities/hotel-preview.entity'
import type { PaginatedResult } from '@/domain/entities/paginated-result.entity'
import type { ApiException } from '@/domain/exceptions/api.exception'
import { checkHotelsConnectionUseCase } from '@/infrastructure/factories/hotel-catalog.factory'

export function useFeaturedHotelsQuery() {
  return useQuery<
    PaginatedResult<HotelPreview>,
    ApiException
  >({
    queryKey: ['hotels', 'featured'],
    queryFn: () =>
      checkHotelsConnectionUseCase.execute(6),
  })
}