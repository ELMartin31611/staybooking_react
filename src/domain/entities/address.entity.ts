export interface Address {
  id: number
  cliente: number
  provincia: string
  ciudad: string
  calle_principal: string
  calle_secundaria?: string | null
  referencia?: string | null
  codigo_postal?: string | null
  es_principal?: boolean
}
