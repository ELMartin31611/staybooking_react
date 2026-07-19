export interface RateReference {
  id: number

  tipo_habitacion: number
  tipo_habitacion_nombre: string

  temporada: number
  temporada_nombre: string
  temporada_fecha_inicio: string
  temporada_fecha_fin: string

  precio_noche: string
  precio_fin_semana: string | null
  precio_persona_extra: string
  precio_aplicable: string

  moneda: string
  is_active: boolean

  created_at: string
  updated_at: string
}

export interface SaveRoomRateInput {
  tipo_habitacion: number
  temporada: number
  precio_noche: string
  precio_fin_semana: string | null
  precio_persona_extra: string
  moneda: string
  is_active: boolean
}