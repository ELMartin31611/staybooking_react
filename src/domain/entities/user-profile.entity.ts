export interface UserProfile {
  id: number
  user?: number
  username: string
  email: string
  rol: string
  telefono?: string | null
  foto_url?: string | null
  estado: string
  created_at?: string
  updated_at?: string

  first_name?: string
  last_name?: string
}