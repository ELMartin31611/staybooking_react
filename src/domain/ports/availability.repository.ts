import type { AvailabilityParams } from '@/application/dtos/availability.dto'
import type { Room } from '@/domain/entities/room.entity'

export interface AvailabilityRepository {
  getAvailableRooms(
    params: AvailabilityParams,
  ): Promise<Room[]>
}