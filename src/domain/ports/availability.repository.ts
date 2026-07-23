import type { AvailabilityParams } from '@/application/dtos/availability.dto'
import type {
  Room,
  RoomAvailabilityCalendar,
} from '@/domain/entities/room.entity'

export interface AvailabilityRepository {
  getAvailableRooms(
    params: AvailabilityParams,
  ): Promise<Room[]>

  getRoomCalendar(
    roomId: number,
    from: string,
    to: string,
  ): Promise<RoomAvailabilityCalendar>
}