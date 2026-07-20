import type { GuestType } from '@/domain/entities/reservation.entity'

export interface ReservationRoomInput {
  habitacion_id: number
  cantidad_adultos: number
  cantidad_ninos: number
}

export interface ReservationGuestInput {
  habitacion_id: number
  tipo_huesped: GuestType
  nombres: string
  apellidos: string
  tipo_documento: string
  numero_documento: string
  edad: number
  telefono?: string
  es_titular: boolean
}

export interface CreateReservationDto {
  fecha_entrada: string
  fecha_salida: string
  habitaciones: ReservationRoomInput[]
  huespedes: ReservationGuestInput[]
  observaciones?: string
}