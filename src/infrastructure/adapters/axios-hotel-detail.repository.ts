import type { HotelAddress } from '@/domain/entities/hotel-address.entity'
import type { HotelDetail } from '@/domain/entities/hotel-detail.entity'
import type { PaginatedResult } from '@/domain/entities/paginated-result.entity'
import type { RoomType } from '@/domain/entities/room-type.entity'
import type { HotelDetailRepository } from '@/domain/ports/hotel-detail.repository'
import { apiConfig } from '@/infrastructure/config/api.config'
import { apiClient } from '@/infrastructure/http/axios-client'

type HotelAddressResponse =
  | PaginatedResult<HotelAddress>
  | HotelAddress[]

type RoomTypeResponse =
  | PaginatedResult<RoomType>
  | RoomType[]

function getResults<T>(
  response: PaginatedResult<T> | T[],
): T[] {
  if (Array.isArray(response)) {
    return response
  }

  return response.results
}

export class AxiosHotelDetailRepository
  implements HotelDetailRepository {
  async getHotelById(
    hotelId: number,
  ): Promise<HotelDetail> {
    const { data } = await apiClient.get<HotelDetail>(
      `${apiConfig.endpoints.catalog.hotels}${hotelId}/detalle/`,
    )

    return data
  }

  async getAddressByHotelId(
    hotelId: number,
  ): Promise<HotelAddress | null> {
    const { data } =
      await apiClient.get<HotelAddressResponse>(
        apiConfig.endpoints.catalog.hotelAddresses,
        {
          params: {
            hotel: hotelId,
          },
        },
      )

    const addresses = getResults(data)

    return addresses[0] ?? null
  }

  async getRoomTypesByHotelId(
    hotelId: number,
  ): Promise<RoomType[]> {
    const { data } =
      await apiClient.get<RoomTypeResponse>(
        apiConfig.endpoints.catalog.roomTypes,
        {
          params: {
            hotel: hotelId,
          },
        },
      )

    return getResults(data)
  }
}