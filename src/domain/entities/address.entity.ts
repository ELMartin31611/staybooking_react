export interface Address {
  id: number
  customer: number
  address_line: string
  city: string
  country: string
  reference?: string
  is_primary?: boolean
}
