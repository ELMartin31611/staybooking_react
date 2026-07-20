import {
  ArrowLeft,
  Building2,
  Printer,
  ReceiptText,
} from 'lucide-react'
import {
  Link,
  useParams,
} from 'react-router-dom'

import {
  Alert,
  AlertDescription,
} from '@/presentation/components/ui/alert'
import { Badge } from '@/presentation/components/ui/badge'
import { Button } from '@/presentation/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/presentation/components/ui/card'
import { Separator } from '@/presentation/components/ui/separator'
import { Skeleton } from '@/presentation/components/ui/skeleton'
import {
  useInvoice,
} from '@/presentation/hooks/useBilling'

function formatCurrency(
  value: string | number,
  currency: string,
): string {
  const amount = Number(value)

  return new Intl.NumberFormat(
    'es-EC',
    {
      style: 'currency',
      currency,
    },
  ).format(amount)
}

function formatDateTime(
  value: string,
): string {
  return new Intl.DateTimeFormat(
    'es-EC',
    {
      dateStyle: 'long',
      timeStyle: 'short',
    },
  ).format(new Date(value))
}

function formatDate(
  value: string,
): string {
  return new Intl.DateTimeFormat(
    'es-EC',
    {
      dateStyle: 'long',
    },
  ).format(
    new Date(`${value}T12:00:00`),
  )
}

export default function InvoicePage() {
  const { invoiceId } = useParams()
  const id = Number(invoiceId)

  const invoiceQuery =
    useInvoice(id)

  if (invoiceQuery.isPending) {
    return (
      <Skeleton className="mx-auto my-12 h-[600px] max-w-4xl rounded-2xl" />
    )
  }

  if (
    invoiceQuery.isError
    || !invoiceQuery.data
  ) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-12">
        <Alert variant="destructive">
          <AlertDescription>
            No fue posible cargar la factura.
          </AlertDescription>
        </Alert>
      </main>
    )
  }

  const invoice =
    invoiceQuery.data

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-10 print:max-w-none print:p-0 sm:px-6">
      <div className="mb-5 flex flex-wrap justify-between gap-3 print:hidden">
        <Button
          variant="ghost"
          asChild
        >
          <Link
            to={
              `/mis-reservas/`
              + invoice.reserva
            }
          >
            <ArrowLeft className="size-4" />
            Ver reserva
          </Link>
        </Button>

        <Button
          type="button"
          onClick={() =>
            window.print()
          }
        >
          <Printer className="size-4" />
          Imprimir factura
        </Button>
      </div>

      <Card className="print:border-0 print:shadow-none">
        <CardHeader className="border-b">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div>
              <p className="inline-flex items-center gap-2 text-sm font-medium text-primary">
                <Building2 className="size-5" />
                StayBooking
              </p>

              <CardTitle className="mt-2 text-2xl">
                Factura{' '}
                {invoice.numero_factura}
              </CardTitle>

              <p className="mt-2 text-sm text-muted-foreground">
                Emitida el{' '}
                {formatDateTime(
                  invoice.fecha_emision,
                )}
              </p>
            </div>

            <Badge>
              {invoice.estado.toUpperCase()}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-7 p-6">
          <Alert>
            <ReceiptText className="size-4" />

            <AlertDescription>
              Comprobante académico generado
              automáticamente después de aprobar
              el pago.
            </AlertDescription>
          </Alert>

          <div className="grid gap-5 sm:grid-cols-2">
            <section>
              <h2 className="font-semibold">
                Cliente
              </h2>

              <p className="mt-2 text-sm">
                {invoice.cliente_nombre}
              </p>

              <p className="text-sm text-muted-foreground">
                Cliente #{invoice.cliente}
              </p>
            </section>

            <section>
              <h2 className="font-semibold">
                Reserva
              </h2>

              <p className="mt-2 text-sm">
                {invoice.reserva_codigo}
              </p>

              <p className="text-sm text-muted-foreground">
                {invoice.numero_noches}{' '}
                noche(s)
              </p>
            </section>
          </div>

          <Separator />

          <div className="grid gap-4 rounded-xl bg-muted/30 p-4 sm:grid-cols-2">
            <div>
              <p className="text-xs text-muted-foreground">
                Entrada
              </p>

              <p className="mt-1 font-medium">
                {formatDate(
                  invoice.fecha_entrada,
                )}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">
                Salida
              </p>

              <p className="mt-1 font-medium">
                {formatDate(
                  invoice.fecha_salida,
                )}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">
                Método de pago
              </p>

              <p className="mt-1 font-medium capitalize">
                {invoice.metodo_pago
                  ?? 'No especificado'}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">
                Moneda
              </p>

              <p className="mt-1 font-medium">
                {invoice.moneda}
              </p>
            </div>
          </div>

          {invoice.descripcion && (
            <section>
              <h2 className="font-semibold">
                Descripción
              </h2>

              <p className="mt-2 text-sm text-muted-foreground">
                {invoice.descripcion}
              </p>
            </section>
          )}

          <Separator />

          <dl className="space-y-3">
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">
                Subtotal
              </dt>

              <dd>
                {formatCurrency(
                  invoice.subtotal,
                  invoice.moneda,
                )}
              </dd>
            </div>

            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">
                Impuestos 12%
              </dt>

              <dd>
                {formatCurrency(
                  invoice.impuestos,
                  invoice.moneda,
                )}
              </dd>
            </div>

            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">
                Descuento
              </dt>

              <dd>
                -{formatCurrency(
                  invoice.descuento,
                  invoice.moneda,
                )}
              </dd>
            </div>

            <Separator />

            <div className="flex items-end justify-between gap-3 text-xl font-bold">
              <dt>Total pagado</dt>

              <dd>
                {formatCurrency(
                  invoice.total,
                  invoice.moneda,
                )}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </main>
  )
}