import type { RateReference } from '@/domain/entities/rate-reference.entity'
import type { RoomSelection } from '@/domain/entities/room-selection.entity'

export interface RoomPricingPreview {
  roomId: number
  roomNumber: string
  roomTypeName: string
  nights: number

  includedGuests: number
  extraGuests: number

  roomSubtotal: number
  extraGuestsSubtotal: number
  subtotal: number
}

export interface ReservationPricingPreview {
  nights: number
  totalAdults: number
  totalChildren: number
  totalExtraGuests: number

  roomsSubtotal: number
  extraGuestsSubtotal: number
  subtotal: number
  taxes: number
  total: number

  currency: string
  rooms: RoomPricingPreview[]
}

const EXTRA_GUEST_FACTOR = 0.5
const TAX_RATE = 0.12
const DAY_MS = 86_400_000

function roundMoney(value: number): number {
  return Math.round(
    (value + Number.EPSILON) * 100,
  ) / 100
}

function parseDate(value: string): Date {
  const date =
    new Date(`${value}T00:00:00Z`)

  if (Number.isNaN(date.getTime())) {
    throw new Error(
      'Una fecha de la reserva no es válida.',
    )
  }

  return date
}

function addDays(
  date: Date,
  days: number,
): Date {
  return new Date(
    date.getTime() + days * DAY_MS,
  )
}

function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10)
}

function isWeekend(date: Date): boolean {
  const day = date.getUTCDay()

  return day === 0 || day === 6
}

function parsePrice(
  value: string | null | undefined,
): number {
  const price = Number(value)

  if (
    !Number.isFinite(price)
    || price < 0
  ) {
    throw new Error(
      'Una tarifa contiene un precio inválido.',
    )
  }

  return price
}

export class ReservationPricingService {
  calculate(
    selections: RoomSelection[],
    checkIn: string,
    checkOut: string,
    rates: RateReference[],
  ): ReservationPricingPreview {
    if (selections.length === 0) {
      throw new Error(
        'Selecciona al menos una habitación.',
      )
    }

    const start = parseDate(checkIn)
    const end = parseDate(checkOut)

    const nights = Math.round(
      (
        end.getTime()
        - start.getTime()
      ) / DAY_MS,
    )

    if (nights < 1 || nights > 30) {
      throw new Error(
        'La estancia debe tener entre 1 y 30 noches.',
      )
    }

    const calculatedRooms =
      selections.map((selection) =>
        this.calculateRoom(
          selection,
          start,
          nights,
          rates,
        ),
      )

    const currencies = new Set(
      calculatedRooms.map(
        (room) => room.currency,
      ),
    )

    if (currencies.size !== 1) {
      throw new Error(
        'Las habitaciones utilizan monedas diferentes.',
      )
    }

    const roomsSubtotal = roundMoney(
      calculatedRooms.reduce(
        (total, room) =>
          total + room.roomSubtotal,
        0,
      ),
    )

    const extraGuestsSubtotal =
      roundMoney(
        calculatedRooms.reduce(
          (total, room) =>
            total
            + room.extraGuestsSubtotal,
          0,
        ),
      )

    const subtotal = roundMoney(
      roomsSubtotal
      + extraGuestsSubtotal,
    )

    const taxes = roundMoney(
      subtotal * TAX_RATE,
    )

    const total = roundMoney(
      subtotal + taxes,
    )

    return {
      nights,

      totalAdults: selections.reduce(
        (total, room) =>
          total + room.adults,
        0,
      ),

      totalChildren: selections.reduce(
        (total, room) =>
          total + room.children,
        0,
      ),

      totalExtraGuests:
        calculatedRooms.reduce(
          (total, room) =>
            total + room.extraGuests,
          0,
        ),

      roomsSubtotal,
      extraGuestsSubtotal,
      subtotal,
      taxes,
      total,

      currency:
        calculatedRooms[0]
          ?.currency
        ?? 'USD',

      rooms: calculatedRooms.map(
        ({
          currency: _currency,
          ...room
        }) => room,
      ),
    }
  }

  private calculateRoom(
    selection: RoomSelection,
    start: Date,
    nights: number,
    rates: RateReference[],
  ): RoomPricingPreview & {
    currency: string
  } {
    const totalGuests =
      selection.adults
      + selection.children

    const includedGuests = Math.min(
      totalGuests,
      selection.includedGuestCapacity,
    )

    const extraGuests = Math.max(
      0,
      totalGuests
      - selection.includedGuestCapacity,
    )

    let roomSubtotal = 0
    let extraGuestsSubtotal = 0
    let currency: string | null = null

    for (
      let offset = 0;
      offset < nights;
      offset += 1
    ) {
      const currentDate =
        addDays(start, offset)

      const dateValue =
        formatDate(currentDate)

      const rate = this.findRate(
        selection.roomTypeId,
        dateValue,
        rates,
      )

      if (!rate) {
        throw new Error(
          `No existe tarifa activa para la habitación ${selection.roomNumber} el ${dateValue}.`,
        )
      }

      if (
        currency !== null
        && currency !== rate.moneda
      ) {
        throw new Error(
          `Las tarifas de la habitación ${selection.roomNumber} usan monedas diferentes.`,
        )
      }

      currency = rate.moneda

      const roomNightPrice =
        isWeekend(currentDate)
        && rate.precio_fin_semana
          ? parsePrice(
              rate.precio_fin_semana,
            )
          : parsePrice(
              rate.precio_noche,
            )

      const extraCharge =
        roomNightPrice
        * EXTRA_GUEST_FACTOR
        * extraGuests

      roomSubtotal += roomNightPrice
      extraGuestsSubtotal += extraCharge
    }

    const roundedRoomSubtotal =
      roundMoney(roomSubtotal)

    const roundedExtraSubtotal =
      roundMoney(
        extraGuestsSubtotal,
      )

    return {
      roomId: selection.roomId,
      roomNumber:
        selection.roomNumber,
      roomTypeName:
        selection.roomTypeName,
      nights,
      includedGuests,
      extraGuests,
      roomSubtotal:
        roundedRoomSubtotal,
      extraGuestsSubtotal:
        roundedExtraSubtotal,
      subtotal: roundMoney(
        roundedRoomSubtotal
        + roundedExtraSubtotal,
      ),
      currency:
        currency
        ?? selection.currency
        ?? 'USD',
    }
  }

  private findRate(
    roomTypeId: number,
    currentDate: string,
    rates: RateReference[],
  ): RateReference | undefined {
    return rates
      .filter(
        (rate) =>
          rate.tipo_habitacion
            === roomTypeId
          && rate.is_active
          && rate.temporada_fecha_inicio
            <= currentDate
          && currentDate
            < rate.temporada_fecha_fin,
      )
      .sort(
        (first, second) =>
          second.id - first.id,
      )[0]
  }
}