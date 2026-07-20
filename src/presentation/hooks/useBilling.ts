import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'

import type {
  PaymentMethod,
} from '@/domain/entities/billing.entity'
import {
  billingUseCase,
} from '@/infrastructure/factories/billing.factory'
import {
  reservationQueryKeys,
} from '@/presentation/hooks/useReservations'

export const billingQueryKeys = {
  all: ['billing'] as const,

  invoices: () => [
    ...billingQueryKeys.all,
    'invoices',
  ] as const,

  invoice: (
    invoiceId: number,
  ) => [
    ...billingQueryKeys.invoices(),
    'detail',
    invoiceId,
  ] as const,

  invoiceByReservation: (
    reservationId: number,
  ) => [
    ...billingQueryKeys.invoices(),
    'reservation',
    reservationId,
  ] as const,

  payments: () => [
    ...billingQueryKeys.all,
    'payments',
  ] as const,
}

export function useInvoice(
  invoiceId: number,
) {
  return useQuery({
    queryKey:
      billingQueryKeys.invoice(
        invoiceId,
      ),

    queryFn: () =>
      billingUseCase.getInvoice(
        invoiceId,
      ),

    enabled:
      Number.isInteger(invoiceId)
      && invoiceId > 0,

    staleTime: 60_000,
  })
}

export function useInvoiceByReservation(
  reservationId: number,
) {
  return useQuery({
    queryKey:
      billingQueryKeys
        .invoiceByReservation(
          reservationId,
        ),

    queryFn: () =>
      billingUseCase
        .getInvoiceByReservation(
          reservationId,
        ),

    enabled:
      Number.isInteger(reservationId)
      && reservationId > 0,

    staleTime: 30_000,
  })
}

export function useProcessPayment() {
  const queryClient =
    useQueryClient()

  return useMutation({
    mutationFn: (input: {
      reservationId: number
      paymentMethod: PaymentMethod
      reference?: string
    }) =>
      billingUseCase.processPayment(
        input.reservationId,
        input.paymentMethod,
        input.reference,
      ),

    onSuccess: async (result) => {
      queryClient.setQueryData(
        billingQueryKeys.invoice(
          result.factura.id,
        ),
        result.factura,
      )

      queryClient.setQueryData(
        billingQueryKeys
          .invoiceByReservation(
            result.factura.reserva,
          ),
        result.factura,
      )

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey:
            reservationQueryKeys.all,
        }),

        queryClient.invalidateQueries({
          queryKey:
            billingQueryKeys
              .payments(),
        }),

        queryClient.invalidateQueries({
          queryKey:
            billingQueryKeys
              .invoices(),
        }),
      ])
    },
  })
}