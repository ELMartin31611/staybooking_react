import { create } from 'zustand'

import type { Bed } from '@/domain/entities/bed.entity'
import type { RateReference } from '@/domain/entities/rate-reference.entity'
import type { Room } from '@/domain/entities/room.entity'
import type { RoomImage } from '@/domain/entities/room-image.entity'
import type { RoomTypeBed } from '@/domain/entities/room-type-bed.entity'
import type { RoomTypeService } from '@/domain/entities/room-type-service.entity'
import type { Service } from '@/domain/entities/service.entity'

import { createRoomCatalogUseCase } from '@/infrastructure/factories/room-catalog.factory'
import { createRateReferenceUseCase } from '@/infrastructure/factories/rate-reference.factory'

const roomCatalogUseCase = createRoomCatalogUseCase()
const rateReferenceUseCase = createRateReferenceUseCase()

interface RoomCatalogState {
  rooms: Room[]
  images: RoomImage[]
  beds: Bed[]
  roomTypeBeds: RoomTypeBed[]
  services: Service[]
  roomTypeServices: RoomTypeService[]
  rates: RateReference[]

  isLoading: boolean
  error: string | null

  loadCatalog: () => Promise<void>

  clearCatalog: () => void
}

export const useRoomCatalogStore =
  create<RoomCatalogState>((set) => ({
    rooms: [],
    images: [],
    beds: [],
    roomTypeBeds: [],
    services: [],
    roomTypeServices: [],
    rates: [],

    isLoading: false,
    error: null,

    loadCatalog: async () => {
      set({
        isLoading: true,
        error: null,
      })

      try {
        const [
          rooms,
          images,
          beds,
          roomTypeBeds,
          services,
          roomTypeServices,
          rates,
        ] = await Promise.all([
          roomCatalogUseCase.getRooms(),
          roomCatalogUseCase.getRoomImages(),
          roomCatalogUseCase.getBeds(),
          roomCatalogUseCase.getRoomTypeBeds(),
          roomCatalogUseCase.getServices(),
          roomCatalogUseCase.getRoomTypeServices(),
          rateReferenceUseCase.getRates(),
        ])

        set({
          rooms,
          images,
          beds,
          roomTypeBeds,
          services,
          roomTypeServices,
          rates,

          isLoading: false,
        })
      } catch {
        set({
          rooms: [],
          images: [],
          beds: [],
          roomTypeBeds: [],
          services: [],
          roomTypeServices: [],
          rates: [],

          isLoading: false,

          error:
            'No fue posible cargar el catálogo de habitaciones.',
        })
      }
    },

    clearCatalog: () => {
      set({
        rooms: [],
        images: [],
        beds: [],
        roomTypeBeds: [],
        services: [],
        roomTypeServices: [],
        rates: [],

        isLoading: false,

        error: null,
      })
    },
  }))