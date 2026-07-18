import type { Room } from '@/domain/entities/room.entity'
import type { RoomImage } from '@/domain/entities/room-image.entity'
import type { Bed } from '@/domain/entities/bed.entity'
import type { RoomTypeBed } from '@/domain/entities/room-type-bed.entity'
import type { Service } from '@/domain/entities/service.entity'
import type { RoomTypeService } from '@/domain/entities/room-type-service.entity'

export interface RoomCatalogRepository {
  getRooms(): Promise<Room[]>

  getRoomImages(): Promise<RoomImage[]>

  getBeds(): Promise<Bed[]>

  getRoomTypeBeds(): Promise<RoomTypeBed[]>

  getServices(): Promise<Service[]>

  getRoomTypeServices(): Promise<RoomTypeService[]>
}