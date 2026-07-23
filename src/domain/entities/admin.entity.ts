import type {
  Invoice,
  Payment,
} from '@/domain/entities/billing.entity'
import type { Reservation } from '@/domain/entities/reservation.entity'
import type { RoomType } from '@/domain/entities/room-type.entity'
import type { Room } from '@/domain/entities/room.entity'

export interface AdminPage<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export interface AdminListParams {
  page?: number
  pageSize?: number
  search?: string
  ordering?: string
  [key: string]: string | number | boolean | undefined
}

export interface AdminHotel {
  id: number
  nombre: string
  ruc: string
  telefono: string
  email: string
  descripcion: string
  categoria_estrellas: number
  sitio_web: string
  logo_url: string | null
  estado: string
  hora_check_in: string
  hora_check_out: string
  permite_mascotas: boolean
  edad_minima_reserva: number
  politica_cancelacion: string
  created_at: string
  updated_at: string
}

export interface SaveHotelInput {
  nombre: string
  ruc: string
  telefono: string
  email: string
  descripcion: string
  categoria_estrellas: number
  sitio_web: string
  logo?: File | null
  estado: string
  hora_check_in: string
  hora_check_out: string
  permite_mascotas: boolean
  edad_minima_reserva: number
  politica_cancelacion: string
}

export interface AdminHotelAddress {
  id: number
  hotel: number
  provincia: string
  ciudad: string
  direccion: string
  referencia: string
  latitud: string
  longitud: string
  created_at: string
  updated_at: string
}

export type SaveHotelAddressInput = Omit<
  AdminHotelAddress,
  'id' | 'created_at' | 'updated_at'
>

export interface SaveRoomTypeInput {
  hotel: number
  nombre: string
  categoria: 'individual' | 'doble' | 'suite' | 'vip' | 'premium' | 'presidencial'
  descripcion: string
  capacidad_adultos: number
  capacidad_ninos: number
  capacidad_total: number
  capacidad_extra: number
  tamano_m2: string
  precio_base: string
  estado: string
}

export interface SaveRoomInput {
  hotel: number
  tipo_habitacion: number
  numero: string
  piso: number
  estado: string
  descripcion: string
  es_fumador: boolean
  observaciones: string
}

export interface AdminRoomImage {
  id: number
  habitacion: number
  habitacion_numero: string
  imagen_url: string | null
  titulo: string
  descripcion: string
  orden: number
  es_principal: boolean
  created_at: string
  updated_at: string
}

export interface SaveRoomImageInput {
  habitacion: number
  imagen: File
  titulo: string
  descripcion: string
  orden: number
  es_principal: boolean
}

export interface AdminHotelMedia {
  id: number
  hotel: number
  hotel_nombre?: string
  tipo: 'imagen' | 'video'
  archivo_url: string
  titulo: string
  descripcion: string
  orden: number
  es_principal: boolean
  created_at: string
  updated_at: string
}

export interface SaveHotelMediaInput {
  hotel: number
  archivo: File
  tipo: 'imagen' | 'video'
  titulo: string
  descripcion: string
  orden: number
  es_principal: boolean
}

export interface AdminService {
  id: number
  nombre: string
  descripcion: string
  tipo_servicio: string
  precio_extra: string
  icono: string
  imagen_url: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export type SaveServiceInput = Omit<
  AdminService,
  'id' | 'imagen_url' | 'created_at' | 'updated_at'
> & {
  imagen?: File | null
}

export interface AdminDashboard {
  hotels: number
  roomTypes: number
  rooms: number
  reservations: number
  pendingReservations: number
  approvedPayments: number
  invoices: number
  recentReservations: Reservation[]
}

export type {
  Invoice,
  Payment,
  Reservation,
  Room,
  RoomType,
}