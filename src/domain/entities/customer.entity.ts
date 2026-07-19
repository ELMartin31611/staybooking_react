export interface Customer {
  id: number
  perfil: number
  cedula: string
  nombres: string
  apellidos: string
  fecha_nacimiento?: string | null
  genero?: string | null
  nacionalidad: string
  correo_alternativo?: string | null
  created_at?: string
  updated_at?: string
}
