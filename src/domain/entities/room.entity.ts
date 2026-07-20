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
}