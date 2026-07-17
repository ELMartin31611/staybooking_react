export interface HotelPreview {
  id: number
  nombre: string
  descripcion: string
  categoria_estrellas: number
  logo_url: string | null
  estado: string
  permite_mascotas: boolean
}