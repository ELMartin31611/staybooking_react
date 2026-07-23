export interface Service {
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