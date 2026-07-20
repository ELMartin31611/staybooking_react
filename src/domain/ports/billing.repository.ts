import type {
  Invoice,
  PaymentResult,
  ProcessPaymentInput,
} from '@/domain/entities/billing.entity'

export interface BillingRepository {
  processPayment(
    input: ProcessPaymentInput,
  ): Promise<PaymentResult>

  getInvoice(
    invoiceId: number,
  ): Promise<Invoice>

  getInvoiceByReservation(
    reservationId: number,
  ): Promise<Invoice | null>
}