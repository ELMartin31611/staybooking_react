import type { HotelAddress } from '@/domain/entities/hotel-address.entity'
import type { HotelDetail } from '@/domain/entities/hotel-detail.entity'
import type { RoomType } from '@/domain/entities/room-type.entity'
import type { HotelDetailRepository } from '@/domain/ports/hotel-detail.repository'

export interface HotelDetailResult {
  hotel: HotelDetail
  address: HotelAddress | null
  roomTypes: RoomType[]
}

export class HotelDetailUseCase {
  private readonly repository: HotelDetailRepository

  constructor(repository: HotelDetailRepository) {
    this.repository = repository
  }

  async execute(hotelId: number): Promise<HotelDetailResult> {
    const [hotel, address, roomTypes] = await Promise.all([
      this.repository.getHotelById(hotelId),
      this.repository.getAddressByHotelId(hotelId),
      this.repository.getRoomTypesByHotelId(hotelId),
    ])

    return {
      hotel,
      address,
      roomTypes,
    }
  }
}