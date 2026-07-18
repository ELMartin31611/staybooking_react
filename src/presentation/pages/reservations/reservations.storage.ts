export type ReservationStatus =
  | 'CONFIRMADA'
  | 'PENDIENTE'
  | 'CANCELADA'

export interface ReservationRecord {
  id: string
  hotelId: number
  hotelName: string
  city: string
  roomType: string
  checkIn: string
  checkOut: string
  nights: number
  guests: number
  totalUsd: number
  status: ReservationStatus
  createdAt: string
}

const STORAGE_KEY = 'staybooking_reservations'

const seededReservations: ReservationRecord[] = [
  {
    id: 'RSV-2041',
    hotelId: 1,
    hotelName: 'Hotel Costa Azul',
    city: 'Cartagena',
    roomType: 'Suite Junior',
    checkIn: '2026-08-03',
    checkOut: '2026-08-06',
    nights: 3,
    guests: 2,
    totalUsd: 390,
    status: 'CONFIRMADA',
    createdAt: '2026-07-01T08:00:00.000Z',
  },
  {
    id: 'RSV-1988',
    hotelId: 4,
    hotelName: 'Andes View Resort',
    city: 'Medellin',
    roomType: 'Estandar',
    checkIn: '2026-07-24',
    checkOut: '2026-07-26',
    nights: 2,
    guests: 1,
    totalUsd: 160,
    status: 'PENDIENTE',
    createdAt: '2026-07-12T10:20:00.000Z',
  },
]

function safelyParseReservations(
  value: string | null,
): ReservationRecord[] {
  if (!value) {
    return []
  }

  try {
    const parsed = JSON.parse(value)

    if (!Array.isArray(parsed)) {
      return []
    }

    return parsed as ReservationRecord[]
  } catch {
    return []
  }
}

export const reservationsStorage = {
  getAll(): ReservationRecord[] {
    const persisted = safelyParseReservations(
      localStorage.getItem(STORAGE_KEY),
    )

    if (persisted.length > 0) {
      return persisted
    }

    return seededReservations
  },

  saveAll(reservations: ReservationRecord[]): void {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(reservations),
    )
  },

  add(reservation: ReservationRecord): ReservationRecord[] {
    const current = this.getAll()
    const updated = [reservation, ...current]
    this.saveAll(updated)
    return updated
  },
}
