export type ReservationStatus =
  | 'pendiente'
  | 'confirmada'
  | 'cancelada'
  | 'finalizada'

export interface Reservation {
  id: number
  codigo: string
  cliente: number
  cliente_nombre: string
  fecha_entrada: string
  fecha_salida: string
  numero_noches: number
  cantidad_adultos: number
  cantidad_ninos: number
  estado: ReservationStatus
  subtotal: string
  impuestos: string
  descuento: string
  total: string
  observaciones: string | null
  created_at: string
  updated_at: string
}