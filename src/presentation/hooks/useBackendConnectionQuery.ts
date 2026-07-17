import { useQuery } from '@tanstack/react-query'

import type { HotelPreview } from '@/domain/entities/hotel-preview.entity'
import type { PaginatedResult } from '@/domain/entities/paginated-result.entity'
import type { ApiException } from '@/domain/exceptions/api.exception'
import { checkHotelsConnectionUseCase } from '@/infrastructure/factories/hotel-catalog.factory'

export function useBackendConnectionQuery() {
  return useQuery<
    PaginatedResult<HotelPreview>,
    ApiException
  >({
    queryKey: ['system', 'connection', 'hotels'],
    queryFn: () =>
      checkHotelsConnectionUseCase.execute(3),
  })
}