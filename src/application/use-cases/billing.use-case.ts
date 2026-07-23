import type {
  PaymentMethod,
} from '@/domain/entities/billing.entity'
import type {
  BillingRepository,
} from '@/domain/ports/billing.repository'

export class BillingUseCase {
  private readonly repository:
    BillingRepository

  constructor(
    repository: BillingRepository,
  ) {
    this.repository = repository
  }

  processPayment(
    reservationId: number,
    paymentMethod: PaymentMethod,
    reference?: string,
  ) {
    this.validateId(
      reservationId,
      'La reserva no es válida.',
    )

    const normalizedReference =
      reference?.trim() ?? ''

    if (
      paymentMethod === 'transferencia'
      && normalizedReference === ''
    ) {
      throw new Error(
        'La referencia es obligatoria para transferencias.',
      )
    }

    return this.repository.processPayment({
      reservationId,
      paymentMethod,
      reference:
        normalizedReference || undefined,
    })
  }

  getInvoice(
    invoiceId: number,
  ) {
    this.validateId(
      invoiceId,
      'La factura no es válida.',
    )

    return this.repository.getInvoice(
      invoiceId,
    )
  }

  getInvoiceByReservation(
    reservationId: number,
  ) {
    this.validateId(
      reservationId,
      'La reserva no es válida.',
    )

    return (
      this.repository
        .getInvoiceByReservation(
          reservationId,
        )
    )
  }

  private validateId(
    value: number,
    message: string,
  ) {
    if (
      !Number.isInteger(value)
      || value <= 0
    ) {
      throw new Error(message)
    }
  }
}