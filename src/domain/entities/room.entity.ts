export interface Room {
  id: number
  numero: string
  piso: number
  estado: string
  descripcion: string
  es_fumador: boolean
  observaciones: string
  created_at: string
  updated_at: string

  hotel: number
  hotel_nombre?: string

  tipo_habitacion: number
  tipo_habitacion_nombre?: string

  capacidad_adultos?: number
  capacidad_ninos?: number
  capacidad_total?: number
  capacidad_extra?: number
  capacidad_maxima?: number
  imagen_principal?: string | null
  servicios?: {
    id: number
    servicio: number
    servicio_nombre: string
    incluido: boolean
    precio_personalizado: string | null
  }[]
}

export interface RoomCalendarDay {
  fecha: string
  estado:
    | 'disponible'
    | 'reservada'
    | 'pasada'
    | 'no_reservable'
  reservada: boolean
}

export interface RoomAvailabilityCalendar {
  habitacion: {
    id: number
    numero: string
    hotel_id: number
    hotel_nombre: string
    reservable: boolean
  }
  desde: string
  hasta: string
  dias: RoomCalendarDay[]
}