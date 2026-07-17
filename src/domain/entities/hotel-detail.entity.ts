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
}