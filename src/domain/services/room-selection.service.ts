import type {
  BookingCartSummary,
  RoomSelection,
} from '@/domain/entities/room-selection.entity'

export class RoomSelectionService {
  add(
    selections: RoomSelection[],
    selection: RoomSelection,
  ): RoomSelection[] {
    const existingSelection = selections.find(
      (item) => item.roomId === selection.roomId,
    )

    if (existingSelection) {
      return selections.map((item) =>
        item.roomId === selection.roomId
          ? {
              ...item,
              quantity: item.quantity + selection.quantity,
            }
          : item,
      )
    }

    return [...selections, selection]
  }

  remove(
    selections: RoomSelection[],
    roomId: number,
  ): RoomSelection[] {
    return selections.filter((item) => item.roomId !== roomId)
  }

  updateQuantity(
    selections: RoomSelection[],
    roomId: number,
    quantity: number,
  ): RoomSelection[] {
    if (quantity <= 0) {
      return this.remove(selections, roomId)
    }

    return selections.map((item) =>
      item.roomId === roomId
        ? {
            ...item,
            quantity,
          }
        : item,
    )
  }

  calculateSummary(
    selections: RoomSelection[],
  ): BookingCartSummary {
    const totalRooms = selections.reduce(
      (total, item) => total + item.quantity,
      0,
    )

    const subtotal = selections.reduce(
      (total, item) =>
        total + item.pricePerNight * item.quantity,
      0,
    )

    return {
      totalRooms,
      subtotal,
    }
  }
}