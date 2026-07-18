import type { HotelAddress } from '@/domain/entities/hotel-address.entity'
import type { HotelDetail } from '@/domain/entities/hotel-detail.entity'
import type { RoomType } from '@/domain/entities/room-type.entity'

export interface HotelDetailRepository {
  getHotelById(hotelId: number): Promise<HotelDetail>

  getAddressByHotelId(
    hotelId: number,
  ): Promise<HotelAddress | null>

  getRoomTypesByHotelId(
    hotelId: number,
  ): Promise<RoomType[]>
}