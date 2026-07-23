import type { AddRoomSelectionDto } from '@/application/dto/add-room-selection.dto'
import type {
  BookingCartSummary,
  RoomSelection,
} from '@/domain/entities/room-selection.entity'
import { RoomSelectionService } from '@/domain/services/room-selection.service'

export class RoomSelectionUseCase {
  private readonly service =
    new RoomSelectionService()

  add(
    selections: RoomSelection[],
    input: AddRoomSelectionDto,
  ): RoomSelection[] {
    this.validateInput(input)

    return this.service.add(
      selections,
      {
        roomId: input.roomId,
        hotelId: input.hotelId,
        roomTypeId: input.roomTypeId,
        roomNumber:
          input.roomNumber.trim(),
        roomTypeName:
          input.roomTypeName.trim(),

        referencePricePerNight:
          input.referencePricePerNight,
        currency:
          input.currency
            .trim()
            .toUpperCase()
          || 'USD',
        imageUrl: input.imageUrl,

        includedGuestCapacity:
          input.includedGuestCapacity,
        extraGuestCapacity:
          input.extraGuestCapacity,

        maxAdults: input.maxAdults,
        maxChildren: input.maxChildren,
        maxGuests: input.maxGuests,

        adults: input.adults ?? 1,
        children: input.children ?? 0,
      },
    )
  }

  remove(
    selections: RoomSelection[],
    roomId: number,
  ): RoomSelection[] {
    if (
      !Number.isInteger(roomId)
      || roomId <= 0
    ) {
      throw new Error(
        'La habitación seleccionada no es válida.',
      )
    }

    return this.service.remove(
      selections,
      roomId,
    )
  }

  updateGuests(
    selections: RoomSelection[],
    roomId: number,
    adults: number,
    children: number,
  ): RoomSelection[] {
    return this.service.updateGuests(
      selections,
      roomId,
      adults,
      children,
    )
  }

  summary(
    selections: RoomSelection[],
  ): BookingCartSummary {
    return this.service.calculateSummary(
      selections,
    )
  }

  private validateInput(
    input: AddRoomSelectionDto,
  ): void {
    if (
      !Number.isInteger(input.roomId)
      || input.roomId <= 0
    ) {
      throw new Error(
        'El identificador de la habitación no es válido.',
      )
    }

    if (
      !Number.isInteger(input.hotelId)
      || input.hotelId <= 0
    ) {
      throw new Error(
        'El identificador del hotel no es válido.',
      )
    }

    if (
      !Number.isInteger(input.roomTypeId)
      || input.roomTypeId <= 0
    ) {
      throw new Error(
        'El tipo de habitación no es válido.',
      )
    }

    if (
      input.roomNumber.trim() === ''
      || input.roomTypeName.trim() === ''
    ) {
      throw new Error(
        'La información de la habitación está incompleta.',
      )
    }

    if (
      !Number.isInteger(
        input.includedGuestCapacity,
      )
      || input.includedGuestCapacity < 1
    ) {
      throw new Error(
        'La capacidad incluida no es válida.',
      )
    }

    if (
      !Number.isInteger(
        input.extraGuestCapacity,
      )
      || input.extraGuestCapacity < 0
    ) {
      throw new Error(
        'La capacidad extra no es válida.',
      )
    }

    if (
      input.maxGuests
      !== input.includedGuestCapacity
        + input.extraGuestCapacity
    ) {
      throw new Error(
        'La capacidad máxima no coincide con la configuración.',
      )
    }
  }
}