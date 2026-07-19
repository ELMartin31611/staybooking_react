export interface Document {
  id: number
  cliente: number
  tipo_documento: string
  numero_documento: string
  archivo_url?: string | null
  fecha_emision?: string | null
  fecha_expiracion?: string | null
  verificado?: boolean
}
