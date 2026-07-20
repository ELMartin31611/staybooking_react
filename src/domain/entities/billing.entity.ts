export type PaymentMethod =
  | 'tarjeta'
  | 'transferencia'
  | 'efectivo'

export type PaymentStatus =
  | 'pendiente'
  | 'aprobado'
  | 'rechazado'

export type InvoiceStatus =
  | 'emitida'
  | 'pagada'
  | 'anulada'

export interface Payment {
  id: number
  reserva: number
  reserva_codigo: string
  codigo_transaccion: string
  metodo_pago: PaymentMethod
  monto: string
  moneda: string
  estado: PaymentStatus
  fecha_pago: string | null
  referencia: string | null
  comprobante_url: string | null
  observaciones: string | null
  created_at: string
  updated_at: string
}

export interface Invoice {
  id: number
  reserva: number
  reserva_codigo: string
  cliente: number
  cliente_nombre: string
  numero_factura: string
  fecha_emision: string
  descripcion: string | null
  fecha_entrada: string
  fecha_salida: string
  numero_noches: number
  subtotal: string
  impuestos: string
  descuento: string
  total: string
  moneda: string
  metodo_pago: PaymentMethod | null
  estado: InvoiceStatus
  created_at: string
  updated_at: string
}

export interface PaymentResult {
  pago: Payment
  factura: Invoice
}

export interface ProcessPaymentInput {
  reservationId: number
  paymentMethod: PaymentMethod
  reference?: string
}