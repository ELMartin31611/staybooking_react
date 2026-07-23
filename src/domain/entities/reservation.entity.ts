export type ReservationStatus =
  | 'pendiente'
  | 'confirmada'
  | 'cancelada'
  | 'finalizada'

export type GuestType =
  | 'adulto'
  | 'nino'

export interface ReservationRateBreakdown {
  fecha: string
  tarifa_id: number
  temporada: string

  precio_habitacion: string
  huespedes_incluidos: number
  huespedes_extra: number
  cargo_unitario_extra: string
  subtotal_huespedes_extra: string
  total_noche: string
  moneda: string

  precio_noche?: string
}

export interface ReservationRoom {
  id: number
  reserva: number
  habitacion: number
  habitacion_numero: string
  tipo_habitacion: string
  hotel_id: number
  hotel_nombre: string
  tarifa: number

  precio_noche: string
  noches: number
  cantidad_adultos: number
  cantidad_ninos: number

  cantidad_huespedes_incluidos: number
  cantidad_huespedes_extra: number

  subtotal_habitacion: string
  subtotal_huespedes_extra: string

  subtotal_adultos: string
  subtotal_ninos: string

  subtotal: string
  detalle_tarifas:
    ReservationRateBreakdown[]
  moneda: string
  estado: string
}

export interface ReservationGuest {
  id: number
  reserva: number
  reserva_habitacion: number
  habitacion_id: number
  habitacion_numero: string
  tipo_huesped: GuestType
  nombres: string
  apellidos: string
  tipo_documento: string
  numero_documento: string
  edad: number
  telefono: string | null
  es_titular: boolean
}

export interface ReservationService {
  id: number
  reserva: number
  servicio: number
  nombre: string
  cantidad: number
  precio_unitario: string
  subtotal: string
  moneda: string
}

export interface Reservation {
  id: number
  codigo: string
  cliente: number
  cliente_nombre: string
  fecha_entrada: string
  fecha_salida: string
  numero_noches: number
  cantidad_adultos: number
  cantidad_ninos: number
  estado: ReservationStatus
  subtotal_habitaciones: string
  subtotal_servicios: string
  subtotal: string
  impuestos: string
  descuento: string
  total: string
  moneda: string
  observaciones: string | null
  motivo_cancelacion?: string | null
  fecha_cancelacion?: string | null
  cancelada_por?: number | null
  cancelada_por_nombre?: string | null
  created_at: string
  updated_at: string

  habitaciones_reservadas?:
    ReservationRoom[]

  huespedes?: ReservationGuest[]
  servicios?: ReservationService[]
}