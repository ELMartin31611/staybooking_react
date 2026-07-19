export interface Season {
  id: number
  nombre: string
  fecha_inicio: string
  fecha_fin: string
  porcentaje_incremento: string
  descripcion: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface SaveSeasonInput {
  nombre: string
  fecha_inicio: string
  fecha_fin: string
  porcentaje_incremento: string
  descripcion: string | null
  is_active: boolean
}