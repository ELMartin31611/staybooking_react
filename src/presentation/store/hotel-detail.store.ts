import { create } from 'zustand'

import type { HotelAddress } from '@/domain/entities/hotel-address.entity'
import type { HotelDetail } from '@/domain/entities/hotel-detail.entity'
import type { RoomType } from '@/domain/entities/room-type.entity'
import { hotelDetailUseCase } from '@/infrastructure/factories/hotel-detail.factory'

interface HotelDetailState {
  hotel: HotelDetail | null
  address: HotelAddress | null
  roomTypes: RoomType[]
  isLoading: boolean
  error: string | null

  loadHotelDetail: (hotelId: number) => Promise<void>
  clearHotelDetail: () => void
}

export const useHotelDetailStore =
  create<HotelDetailState>((set) => ({
    hotel: null,
    address: null,
    roomTypes: [],
    isLoading: false,
    error: null,

    loadHotelDetail: async (hotelId) => {
      set({
        isLoading: true,
        error: null,
      })

      try {
        const result =
          await hotelDetailUseCase.execute(hotelId)

        set({
          hotel: result.hotel,
          address: result.address,
          roomTypes: result.roomTypes,
          isLoading: false,
        })
      } catch {
        set({
          hotel: null,
          address: null,
          roomTypes: [],
          isLoading: false,
          error:
            'No fue posible cargar el detalle del hotel.',
        })
      }
    },

    clearHotelDetail: () => {
      set({
        hotel: null,
        address: null,
        roomTypes: [],
        isLoading: false,
        error: null,
      })
    },
  }))