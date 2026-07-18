import type { Bed } from '@/domain/entities/bed.entity'
import type { Room } from '@/domain/entities/room.entity'
import type { RoomImage } from '@/domain/entities/room-image.entity'
import type { RoomTypeBed } from '@/domain/entities/room-type-bed.entity'
import type { RoomTypeService } from '@/domain/entities/room-type-service.entity'
import type { Service } from '@/domain/entities/service.entity'
import type { RoomCatalogRepository } from '@/domain/ports/room-catalog.repository'
import { apiConfig } from '@/infrastructure/config/api.config'
import { apiClient } from '@/infrastructure/http/axios-client'

interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export class AxiosRoomCatalogRepository
  implements RoomCatalogRepository
{
  async getRooms(): Promise<Room[]> {
    const { data } = await apiClient.get<
      PaginatedResponse<Room>
    >(apiConfig.endpoints.catalog.rooms)

    return data.results
  }

  async getRoomImages(): Promise<RoomImage[]> {
    const { data } = await apiClient.get<
      PaginatedResponse<RoomImage>
    >(apiConfig.endpoints.catalog.images)

    return data.results
  }

  async getBeds(): Promise<Bed[]> {
    const { data } = await apiClient.get<
      PaginatedResponse<Bed>
    >(apiConfig.endpoints.catalog.beds)

    return data.results
  }

  async getRoomTypeBeds(): Promise<RoomTypeBed[]> {
    const { data } = await apiClient.get<
      PaginatedResponse<RoomTypeBed>
    >(apiConfig.endpoints.catalog.roomTypeBeds)

    return data.results
  }

  async getServices(): Promise<Service[]> {
    const { data } = await apiClient.get<
      PaginatedResponse<Service>
    >(apiConfig.endpoints.catalog.services)

    return data.results
  }

  async getRoomTypeServices(): Promise<
    RoomTypeService[]
  > {
    const { data } = await apiClient.get<
      PaginatedResponse<RoomTypeService>
    >(apiConfig.endpoints.catalog.roomTypeServices)

    return data.results
  }
}