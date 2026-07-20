import type {
  BookingCartSummary,
  RoomSelection,
} from '@/domain/entities/room-selection.entity'

const EXTRA_GUEST_FACTOR = 0.5

function roundMoney(value: number): number {
  return Math.round(
    (value + Number.EPSILON) * 100,
  ) / 100
}

function getExtraGuests(
  selection: RoomSelection,
): number {
  return Math.max(
    0,
    selection.adults
      + selection.children
      - selection.includedGuestCapacity,
  )
}

export class RoomSelectionService {
  add(
    selections: RoomSelection[],
    selection: RoomSelection,
  ): RoomSelection[] {
    this.validateSelection(selection)

    if (
      selections.some(
        (item) =>
          item.roomId === selection.roomId,
      )
    ) {
      return selections
    }

    if (
      selections.some(
        (item) =>
          item.hotelId !== selection.hotelId,
      )
    ) {
      throw new Error(
        'Solo puedes reservar habitaciones del mismo hotel.',
      )
    }

    return [...selections, selection]
  }

  remove(
    selections: RoomSelection[],
    roomId: number,
  ): RoomSelection[] {
    return selections.filter(
      (selection) =>
        selection.roomId !== roomId,
    )
  }

  updateGuests(
    selections: RoomSelection[],
    roomId: number,
    adults: number,
    children: number,
  ): RoomSelection[] {
    const selection = selections.find(
      (item) => item.roomId === roomId,
    )

    if (!selection) {
      throw new Error(
        'La habitación seleccionada ya no existe.',
      )
    }

    const updatedSelection: RoomSelection = {
      ...selection,
      adults,
      children,
    }

    this.validateSelection(updatedSelection)

    return selections.map((item) =>
      item.roomId === roomId
        ? updatedSelection
        : item,
    )
  }

  calculateSummary(
    selections: RoomSelection[],
  ): BookingCartSummary {
    const totalAdults = selections.reduce(
      (total, selection) =>
        total + selection.adults,
      0,
    )

    const totalChildren = selections.reduce(
      (total, selection) =>
        total + selection.children,
      0,
    )

    const totalExtraGuests =
      selections.reduce(
        (total, selection) =>
          total + getExtraGuests(selection),
        0,
      )

    const referencePricePerNight =
      selections.reduce(
        (total, selection) => {
          const roomPrice =
            selection.referencePricePerNight
            ?? 0

          const extraGuests =
            getExtraGuests(selection)

          const extraCharge =
            roomPrice
            * EXTRA_GUEST_FACTOR
            * extraGuests

          return (
            total
            + roomPrice
            + extraCharge
          )
        },
        0,
      )

    return {
      totalRooms: selections.length,
      totalAdults,
      totalChildren,
      totalExtraGuests,
      referencePricePerNight:
        roundMoney(
          referencePricePerNight,
        ),
    }
  }

  private validateSelection(
    selection: RoomSelection,
  ): void {
    const {
      adults,
      children,
      maxAdults,
      maxChildren,
      maxGuests,
      includedGuestCapacity,
      extraGuestCapacity,
    } = selection

    if (
      !Number.isInteger(adults)
      || !Number.isInteger(children)
    ) {
      throw new Error(
        'La cantidad de huéspedes debe ser un número entero.',
      )
    }

    if (adults < 1) {
      throw new Error(
        'Cada habitación debe tener al menos un adulto.',
      )
    }

    if (children < 0) {
      throw new Error(
        'La cantidad de niños no puede ser negativa.',
      )
    }

    if (adults > maxAdults) {
      throw new Error(
        `Esta habitación permite máximo ${maxAdults} adulto(s).`,
      )
    }

    if (children > maxChildren) {
      if (maxChildren === 0) {
        throw new Error(
          'Esta habitación no permite niños.',
        )
      }

      throw new Error(
        `Esta habitación permite máximo ${maxChildren} niño(s).`,
      )
    }

    if (adults + children > maxGuests) {
      throw new Error(
        `Esta habitación permite máximo ${maxGuests} huésped(es).`,
      )
    }

    if (includedGuestCapacity < 1) {
      throw new Error(
        'La capacidad incluida no es válida.',
      )
    }

    if (extraGuestCapacity < 0) {
      throw new Error(
        'La capacidad extra no es válida.',
      )
    }

    if (
      selection.referencePricePerNight !== null
      && (
        !Number.isFinite(
          selection.referencePricePerNight,
        )
        || selection.referencePricePerNight < 0
      )
    ) {
      throw new Error(
        'El precio de la habitación no es válido.',
      )
    }
  }
}