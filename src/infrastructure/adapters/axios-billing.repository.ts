import type {
  Invoice,
  PaymentResult,
  ProcessPaymentInput,
} from '@/domain/entities/billing.entity'
import type { PaginatedResult } from '@/domain/entities/paginated-result.entity'
import type { BillingRepository } from '@/domain/ports/billing.repository'
import { apiConfig } from '@/infrastructure/config/api.config'
import { apiClient } from '@/infrastructure/http/axios-client'

type InvoiceCollectionResponse =
  | PaginatedResult<Invoice>
  | Invoice[]

function getInvoiceResults(
  response: InvoiceCollectionResponse,
): Invoice[] {
  if (Array.isArray(response)) {
    return response
  }

  return response.results
}

export class AxiosBillingRepository
  implements BillingRepository {
  async processPayment(
    input: ProcessPaymentInput,
  ): Promise<PaymentResult> {
    const { data } =
      await apiClient.post<PaymentResult>(
        `${apiConfig.endpoints.billing.payments}procesar/`,
        {
          reserva_id:
            input.reservationId,
          metodo_pago:
            input.paymentMethod,
          referencia:
            input.reference ?? '',
        },
      )

    return data
  }

  async getInvoice(
    invoiceId: number,
  ): Promise<Invoice> {
    const { data } =
      await apiClient.get<Invoice>(
        `${apiConfig.endpoints.billing.invoices}${invoiceId}/`,
      )

    return data
  }

  async getInvoiceByReservation(
    reservationId: number,
  ): Promise<Invoice | null> {
    const { data } =
      await apiClient.get<InvoiceCollectionResponse>(
        apiConfig.endpoints.billing.invoices,
        {
          params: {
            reserva: reservationId,
            page_size: 1,
          },
        },
      )

    return (
      getInvoiceResults(data)[0]
      ?? null
    )
  }
}