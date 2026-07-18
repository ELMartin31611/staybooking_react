import type { AddRoomSelectionDto } from '@/application/dto/add-room-selection.dto'
import type {
  BookingCartSummary,
  RoomSelection,
} from '@/domain/entities/room-selection.entity'
import { RoomSelectionService } from '@/domain/services/room-selection.service'

export class RoomSelectionUseCase {
  private readonly service: RoomSelectionService

  constructor() {
    this.service = new RoomSelectionService()
  }

  add(
    selections: RoomSelection[],
    dto: AddRoomSelectionDto,
  ): RoomSelection[] {
    return this.service.add(selections, {
      ...dto,
      quantity: dto.quantity ?? 1,
    })
  }

  remove(
    selections: RoomSelection[],
    roomId: number,
  ): RoomSelection[] {
    return this.service.remove(selections, roomId)
  }

  updateQuantity(
    selections: RoomSelection[],
    roomId: number,
    quantity: number,
  ): RoomSelection[] {
    return this.service.updateQuantity(
      selections,
      roomId,
      quantity,
    )
  }

  summary(
    selections: RoomSelection[],
  ): BookingCartSummary {
    return this.service.calculateSummary(selections)
  }
}