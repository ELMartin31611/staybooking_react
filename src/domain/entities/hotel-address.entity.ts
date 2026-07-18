export interface HotelAddress {
  id: number
  hotel: number
  pais: string
  provincia: string
  ciudad: string
  direccion: string
  codigo_postal: string | null
  referencia: string | null
  latitud: string | null
  longitud: string | null
}