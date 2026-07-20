export interface RoomType {
  id: number
  hotel: number
  nombre: string
  descripcion: string

  capacidad_adultos: number
  capacidad_ninos: number
  capacidad_total: number
  capacidad_extra: number
  capacidad_maxima: number

  tamano_m2: string
  precio_base: string
  estado: string

  created_at?: string
  updated_at?: string
}