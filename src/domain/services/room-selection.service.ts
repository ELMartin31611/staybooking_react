import type {
  BookingCartSummary,
  RoomSelection,
} from '@/domain/entities/room-selection.entity'

export class RoomSelectionService {
  add(
    selections: RoomSelection[],
    selection: RoomSelection,
  ): RoomSelection[] {
    const alreadySelected =
      selections.some(
        (item) =>
          item.roomId === selection.roomId,
      )

    if (alreadySelected) {
      return selections
    }

    return [
      ...selections,
      {
        ...selection,
        quantity: 1,
      },
    ]
  }

  remove(
    selections: RoomSelection[],
    roomId: number,
  ): RoomSelection[] {
    return selections.filter(
      (item) =>
        item.roomId !== roomId,
    )
  }

  updateQuantity(
    selections: RoomSelection[],
    roomId: number,
    _quantity: number,
  ): RoomSelection[] {
    return selections.map(
      (item) =>
        item.roomId === roomId
          ? {
              ...item,
              quantity: 1,
            }
          : item,
    )
  }

  calculateSummary(
    selections: RoomSelection[],
  ): BookingCartSummary {
    const normalizedSelections =
      selections.map(
        (selection) => ({
          ...selection,
          quantity: 1,
        }),
      )

    const totalRooms =
      normalizedSelections.length

    const subtotal =
      normalizedSelections.reduce(
        (total, item) =>
          total + item.pricePerNight,
        0,
      )

    return {
      totalRooms,
      subtotal,
    }
  }
}