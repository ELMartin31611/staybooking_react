import { useQuery } from '@tanstack/react-query'

import type { HotelMedia } from '@/domain/entities/hotel-detail.entity'
import { apiConfig } from '@/infrastructure/config/api.config'
import { apiClient } from '@/infrastructure/http/axios-client'

type MediaResponse = HotelMedia[] | { results: HotelMedia[] }

function getMedia(response: MediaResponse): HotelMedia[] {
  return Array.isArray(response) ? response : response.results
}

export function useHotelMediaQuery(hotelId?: number) {
  return useQuery({
    queryKey: ['hotel-media', hotelId ?? 'home'],
    queryFn: async () => {
      const { data } = await apiClient.get<MediaResponse>(apiConfig.endpoints.catalog.hotelMedia, {
        params: hotelId ? { hotel: hotelId, ordering: 'orden' } : {
          es_principal: true,
          ordering: 'orden',
          page_size: 8,
        },
      })
      return getMedia(data)
    },
    staleTime: 60_000,
  })
}
