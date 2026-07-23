import type { RoomTypeService } from '@/domain/entities/room-type-service.entity'

export interface HotelDetail {
  id: number
  nombre: string
  descripcion: string
  categoria_estrellas: number
  logo_url: string | null
  estado: string
  permite_mascotas: boolean
  telefono: string | null
  email: string | null
  sitio_web: string | null
  galeria?: {
    imagenes: HotelMedia[]
    videos: HotelMedia[]
  }
  habitaciones?: HotelRoom[]
  servicios?: HotelService[]
  temporadas?: HotelSeason[]
}

export interface HotelMedia {
  id: number
  tipo: 'imagen' | 'video'
  archivo_url: string
  titulo: string
  descripcion: string
  orden: number
  es_principal: boolean
}

export interface HotelRoom {
  id: number
  numero: string
  piso: number
  descripcion: string
  tipo_habitacion: number
  tipo_habitacion_nombre: string
  imagen_principal?: string | null
  capacidad_adultos: number
  capacidad_ninos: number
  capacidad_total: number
  capacidad_extra: number
  capacidad_maxima: number
  servicios: RoomTypeService[]
}

export interface HotelService {
  id: number
  nombre: string
  descripcion: string
  tipo_servicio: string
  precio_extra: string
  imagen_url: string | null
  is_active: boolean
  incluido_en_alguna_habitacion: boolean
  tipos_habitacion_compatibles: Array<{
    tipo_habitacion_id: number
    tipo_habitacion_nombre: string
    incluido: boolean
    precio_personalizado: string | null
  }>
}

export interface HotelSeason {
  id: number
  nombre: string
  fecha_inicio: string
  fecha_fin: string
  porcentaje_incremento: string
  is_active: boolean
}