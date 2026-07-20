import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  Landmark,
  ShieldCheck,
} from 'lucide-react'
import { useState } from 'react'
import type { FormEvent } from 'react'
import {
  Link,
  useParams,
} from 'react-router-dom'

import type {
  PaymentMethod,
} from '@/domain/entities/billing.entity'
import { ApiException } from '@/domain/exceptions/api.exception'
import {
  Alert,
  AlertDescription,
} from '@/presentation/components/ui/alert'
import { Button } from '@/presentation/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/presentation/components/ui/card'
import { Input } from '@/presentation/components/ui/input'
import { Label } from '@/presentation/components/ui/label'
import { Separator } from '@/presentation/components/ui/separator'
import { Skeleton } from '@/presentation/components/ui/skeleton'
import {
  useInvoiceByReservation,
  useProcessPayment,
} from '@/presentation/hooks/useBilling'
import {
  useReservation,
} from '@/presentation/hooks/useReservations'

function formatCurrency(
  value: string | number,
  currency: string,
): string {
  const amount = Number(value)

  try {
    return new Intl.NumberFormat(
      'es-EC',
      {
        style: 'currency',
        currency,
      },
    ).format(amount)
  } catch {
    return `${amount.toFixed(2)} ${currency}`
  }
}

export default function PaymentPage() {
  const { reservationId } =
    useParams()

  const id = Number(reservationId)

  const reservationQuery =
    useReservation(id)

  const invoiceQuery =
    useInvoiceByReservation(id)

  const processPayment =
    useProcessPayment()

  const [
    method,
    setMethod,
  ] = useState<PaymentMethod>(
    'tarjeta',
  )

  const [
    reference,
    setReference,
  ] = useState('')

  const [
    accepted,
    setAccepted,
  ] = useState(false)

  const [
    errorMessage,
    setErrorMessage,
  ] = useState<string | null>(null)

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()
    setErrorMessage(null)

    if (!accepted) {
      setErrorMessage(
        'Confirma que deseas procesar el pago académico.',
      )
      return
    }

    if (
      method === 'transferencia'
      && reference.trim() === ''
    ) {
      setErrorMessage(
        'Ingresa la referencia de la transferencia.',
      )
      return
    }

    try {
      await processPayment.mutateAsync({
        reservationId: id,
        paymentMethod: method,
        reference:
          reference.trim()
          || undefined,
      })
    } catch (error: unknown) {
      if (
        error instanceof ApiException
        || error instanceof Error
      ) {
        setErrorMessage(
          error.message,
        )
      } else {
        setErrorMessage(
          'No fue posible procesar el pago.',
        )
      }
    }
  }

  if (
    reservationQuery.isPending
    || invoiceQuery.isPending
  ) {
    return (
      <Skeleton className="mx-auto my-12 h-96 max-w-3xl rounded-2xl" />
    )
  }

  if (
    reservationQuery.isError
    || !reservationQuery.data
  ) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-12">
        <Alert variant="destructive">
          <AlertDescription>
            No fue posible cargar la reserva.
          </AlertDescription>
        </Alert>
      </main>
    )
  }

  const reservation =
    reservationQuery.data

  const result =
    processPayment.data

  if (result) {
    return (
      <main className="mx-auto max-w-3xl space-y-6 px-4 py-12">
        <Alert>
          <CheckCircle2 className="size-4" />

          <AlertDescription>
            Pago aprobado. La reserva fue
            confirmada y la factura fue emitida.
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle>
              Factura{' '}
              {
                result.factura
                  .numero_factura
              }
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <p className="flex justify-between gap-3 text-sm">
              <span className="text-muted-foreground">
                Reserva
              </span>

              <strong>
                {
                  result.factura
                    .reserva_codigo
                }
              </strong>
            </p>

            <p className="flex justify-between gap-3 text-sm">
              <span className="text-muted-foreground">
                Transacción
              </span>

              <strong>
                {
                  result.pago
                    .codigo_transaccion
                }
              </strong>
            </p>

            <p className="flex justify-between gap-3 text-sm">
              <span className="text-muted-foreground">
                Método
              </span>

              <strong>
                {
                  result.pago
                    .metodo_pago
                }
              </strong>
            </p>

            <Separator />

            <p className="flex items-end justify-between gap-3">
              <span>
                Total pagado
              </span>

              <strong className="text-2xl">
                {formatCurrency(
                  result.factura.total,
                  result.factura.moneda,
                )}
              </strong>
            </p>

            <Button
              className="w-full"
              asChild
            >
              <Link
                to={
                  `/facturas/`
                  + result.factura.id
                }
              >
                Ver factura completa
              </Link>
            </Button>

            <Button
              className="w-full"
              variant="outline"
              asChild
            >
              <Link
                to={
                  `/mis-reservas/`
                  + reservation.id
                }
              >
                Volver a la reserva
              </Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    )
  }

  if (
    reservation.estado !== 'pendiente'
  ) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-12">
        <Card>
          <CardContent className="p-10 text-center">
            <CheckCircle2 className="mx-auto size-12 text-primary" />

            <h1 className="mt-5 text-2xl font-bold">
              Esta reserva ya no está pendiente
            </h1>

            <p className="mt-3 text-muted-foreground">
              Estado actual:{' '}
              <strong>
                {reservation.estado}
              </strong>
            </p>

            {invoiceQuery.data && (
              <Button
                className="mt-6"
                asChild
              >
                <Link
                  to={
                    `/facturas/`
                    + invoiceQuery.data.id
                  }
                >
                  Ver factura
                </Link>
              </Button>
            )}

            <Button
              className="mt-3"
              variant="outline"
              asChild
            >
              <Link
                to={
                  `/mis-reservas/`
                  + reservation.id
                }
              >
                Ver reserva
              </Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    )
  }

  return (
    <main className="mx-auto w-full max-w-3xl space-y-6 px-4 py-10 sm:px-6">
      <Button
        variant="ghost"
        asChild
      >
        <Link
          to={
            `/mis-reservas/`
            + reservation.id
          }
        >
          <ArrowLeft className="size-4" />
          Volver a la reserva
        </Link>
      </Button>

      <header>
        <p className="inline-flex items-center gap-2 text-sm font-medium text-primary">
          <ShieldCheck className="size-4" />
          Operación protegida
        </p>

        <h1 className="mt-2 text-3xl font-bold">
          Pagar {reservation.codigo}
        </h1>

        <p className="mt-2 text-muted-foreground">
          El monto proviene del backend y no
          puede modificarse en el navegador.
        </p>
      </header>

      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">
            Total a pagar
          </p>

          <p className="mt-1 text-4xl font-bold">
            {formatCurrency(
              reservation.total,
              reservation.moneda,
            )}
          </p>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle className="inline-flex items-center gap-2">
              <CreditCard className="size-5" />
              Método de pago
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-5">
            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                disabled={
                  processPayment.isPending
                }
                onClick={() =>
                  setMethod('tarjeta')
                }
                className={
                  method === 'tarjeta'
                    ? (
                        'rounded-xl border-2 '
                        + 'border-primary '
                        + 'bg-primary/5 p-4 '
                        + 'text-left'
                      )
                    : (
                        'rounded-xl border '
                        + 'p-4 text-left'
                      )
                }
              >
                <CreditCard className="size-5 text-primary" />

                <span className="mt-2 block font-medium">
                  Tarjeta
                </span>

                <span className="text-xs text-muted-foreground">
                  Simulación académica segura
                </span>
              </button>

              <button
                type="button"
                disabled={
                  processPayment.isPending
                }
                onClick={() =>
                  setMethod(
                    'transferencia',
                  )
                }
                className={
                  method
                    === 'transferencia'
                    ? (
                        'rounded-xl border-2 '
                        + 'border-primary '
                        + 'bg-primary/5 p-4 '
                        + 'text-left'
                      )
                    : (
                        'rounded-xl border '
                        + 'p-4 text-left'
                      )
                }
              >
                <Landmark className="size-5 text-primary" />

                <span className="mt-2 block font-medium">
                  Transferencia
                </span>

                <span className="text-xs text-muted-foreground">
                  Requiere una referencia
                </span>
              </button>
            </div>

            {method === 'transferencia' && (
              <div className="space-y-2">
                <Label htmlFor="reference">
                  Referencia de transferencia
                </Label>

                <Input
                  id="reference"
                  maxLength={120}
                  value={reference}
                  disabled={
                    processPayment
                      .isPending
                  }
                  onChange={(event) =>
                    setReference(
                      event.target.value,
                    )
                  }
                  required
                />
              </div>
            )}

            <label className="flex cursor-pointer items-start gap-3 rounded-xl border p-4">
              <input
                type="checkbox"
                checked={accepted}
                disabled={
                  processPayment.isPending
                }
                onChange={(event) =>
                  setAccepted(
                    event.target.checked,
                  )
                }
                className="mt-1 size-4 accent-primary"
              />

              <span className="text-sm">
                Confirmo el pago académico por{' '}
                <strong>
                  {formatCurrency(
                    reservation.total,
                    reservation.moneda,
                  )}
                </strong>
                .
              </span>
            </label>

            <Alert>
              <ShieldCheck className="size-4" />

              <AlertDescription>
                Esta es una simulación académica.
                StayBooking no solicita ni almacena
                números de tarjeta, CVV o claves
                bancarias.
              </AlertDescription>
            </Alert>

            {errorMessage && (
              <Alert variant="destructive">
                <AlertDescription>
                  {errorMessage}
                </AlertDescription>
              </Alert>
            )}

            <Button
              className="w-full"
              type="submit"
              disabled={
                processPayment.isPending
                || !accepted
              }
            >
              {processPayment.isPending
                ? 'Procesando...'
                : (
                    'Pagar '
                    + formatCurrency(
                      reservation.total,
                      reservation.moneda,
                    )
                  )}
            </Button>
          </CardContent>
        </Card>
      </form>
    </main>
  )
}