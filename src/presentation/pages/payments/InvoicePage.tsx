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

const invoiceStatusClasses: Record<string, string> = {
  pagada: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400',
  pendiente: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400',
  cancelada: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:text-rose-400',
}

export default function InvoicePage() {
  const { invoiceId } = useParams()
  const id = Number(invoiceId)

  const invoiceQuery =
    useInvoice(id)

  if (invoiceQuery.isPending) {
    return (
      <div className="mx-auto my-12 max-w-4xl space-y-4 px-4">
        <Skeleton className="h-10 w-48 rounded-xl" />
        <Skeleton className="h-48 rounded-3xl" />
        <Skeleton className="h-96 rounded-3xl" />
      </div>
    )
  }

  if (
    invoiceQuery.isError
    || !invoiceQuery.data
  ) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-12">
        <Alert variant="destructive" className="rounded-2xl">
          <AlertDescription>
            No fue posible cargar la factura.
          </AlertDescription>
        </Alert>
      </main>
    )
  }

  const invoice =
    invoiceQuery.data

  const statusClass = invoiceStatusClasses[invoice.estado] ?? invoiceStatusClasses['pendiente']

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-10 print:max-w-none print:p-0 sm:px-6 space-y-6">
      {/* Top bar actions */}
      <div className="flex flex-wrap justify-between gap-3 print:hidden">
        <Button
          variant="ghost"
          asChild
          className="rounded-xl font-bold hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all"
        >
          <Link
            to={
              `/mis-reservas/`
              + invoice.reserva
            }
          >
            <ArrowLeft className="size-4 mr-1" />
            Ver reserva
          </Link>
        </Button>

        <Button
          type="button"
          onClick={() =>
            window.print()
          }
          className="rounded-xl bg-gradient-to-r from-primary to-[#d70466] hover:opacity-90 font-bold text-white active:scale-95 transition-all print:hidden"
        >
          <Printer className="size-4 mr-2" />
          Imprimir factura
        </Button>
      </div>

      {/* Invoice card */}
      <Card className="rounded-3xl border border-slate-200/60 shadow-sm dark:border-zinc-800/60 overflow-hidden print:border-0 print:shadow-none">
        {/* Header */}
        <CardHeader className="border-b border-slate-100 dark:border-zinc-800 p-0 overflow-hidden">
          <div className="relative bg-gradient-to-tr from-slate-950 via-[#1d1b3c] to-slate-900 p-8 text-white">
            <div className="absolute -right-16 -top-16 size-64 rounded-full bg-primary/20 blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-wrap items-start justify-between gap-5">
              <div>
                <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/60">
                  <Building2 className="size-4" />
                  StayBooking
                </p>

                <h1 className="mt-3 text-2xl font-extrabold tracking-tight">
                  Factura {invoice.numero_factura}
                </h1>

                <p className="mt-2 text-sm text-white/60 font-medium">
                  Emitida el {formatDateTime(invoice.fecha_emision)}
                </p>
              </div>

              <Badge
                className={`rounded-full px-4 py-1 text-xs font-bold uppercase tracking-wider border ${statusClass}`}
              >
                {invoice.estado.toUpperCase()}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 sm:p-8 space-y-8">
          {/* Academic notice */}
          <div className="flex items-start gap-3 rounded-2xl border border-blue-200 bg-blue-50/50 p-4 dark:border-blue-900/30 dark:bg-blue-950/20 print:hidden">
            <ReceiptText className="mt-0.5 size-4 shrink-0 text-blue-600 dark:text-blue-400" />
            <p className="text-xs font-semibold text-blue-800 dark:text-blue-400">
              Comprobante académico generado automáticamente después de aprobar el pago.
            </p>
          </div>

          {/* Client & Reservation info */}
          <div className="grid gap-6 sm:grid-cols-2">
            <section className="rounded-2xl border border-slate-100 bg-slate-50/50 p-5 dark:border-zinc-800 dark:bg-zinc-900/30">
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">
                Cliente
              </h2>

              <p className="text-base font-bold text-foreground">
                {invoice.cliente_nombre}
              </p>

              <p className="text-xs font-semibold text-muted-foreground mt-1">
                Cliente #{invoice.cliente}
              </p>
            </section>

            <section className="rounded-2xl border border-slate-100 bg-slate-50/50 p-5 dark:border-zinc-800 dark:bg-zinc-900/30">
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">
                Reserva
              </h2>

              <p className="text-base font-bold text-foreground">
                {invoice.reserva_codigo}
              </p>

              <p className="text-xs font-semibold text-muted-foreground mt-1">
                {invoice.numero_noches} noche(s)
              </p>
            </section>
          </div>

          {/* Stay details */}
          <div className="grid gap-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-5 sm:grid-cols-2 lg:grid-cols-4 dark:border-zinc-800 dark:bg-zinc-900/30">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Entrada
              </p>
              <p className="mt-1.5 text-sm font-bold text-foreground">
                {formatDate(invoice.fecha_entrada)}
              </p>
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Salida
              </p>
              <p className="mt-1.5 text-sm font-bold text-foreground">
                {formatDate(invoice.fecha_salida)}
              </p>
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Método de pago
              </p>
              <p className="mt-1.5 text-sm font-bold text-foreground capitalize">
                {invoice.metodo_pago ?? 'No especificado'}
              </p>
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Moneda
              </p>
              <p className="mt-1.5 text-sm font-bold text-foreground">
                {invoice.moneda}
              </p>
            </div>
          </div>

          {invoice.descripcion && (
            <section>
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">
                Descripción
              </h2>

              <p className="text-sm font-medium text-muted-foreground leading-relaxed">
                {invoice.descripcion}
              </p>
            </section>
          )}

          {invoice.detalle_lineas?.habitaciones?.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Habitaciones
              </h2>

              {invoice.detalle_lineas.habitaciones.map((room) => (
                <div
                  key={room.habitacion_numero}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-100 p-4 text-sm dark:border-zinc-800"
                >
                  <div>
                    <p className="font-bold">
                      {room.tipo_habitacion} · Habitación {room.habitacion_numero}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {room.noches} noche(s)
                      {room.huespedes_extra > 0
                        ? ` · ${room.huespedes_extra} huésped(es) extra`
                        : ''}
                    </p>
                  </div>
                  <strong>{formatCurrency(room.subtotal, invoice.moneda)}</strong>
                </div>
              ))}
            </section>
          )}

          {invoice.detalle_lineas?.servicios_adicionales?.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Servicios adicionales
              </h2>

              {invoice.detalle_lineas.servicios_adicionales.map((service) => (
                <div
                  key={`${service.nombre}-${service.precio_unitario}`}
                  className="flex justify-between gap-3 text-sm"
                >
                  <span>{service.nombre} × {service.cantidad}</span>
                  <strong>
                    {formatCurrency(service.subtotal, service.moneda ?? invoice.moneda)}
                  </strong>
                </div>
              ))}
            </section>
          )}

          <Separator />

          {/* Amounts */}
          <dl className="space-y-3">
            <div className="flex justify-between items-center">
              <dt className="text-sm font-semibold text-muted-foreground">Subtotal</dt>
              <dd className="text-sm font-bold text-foreground">
                {formatCurrency(invoice.subtotal, invoice.moneda)}
              </dd>
            </div>

            <div className="flex justify-between items-center">
              <dt className="text-sm font-semibold text-muted-foreground">Impuestos 12%</dt>
              <dd className="text-sm font-bold text-foreground">
                {formatCurrency(invoice.impuestos, invoice.moneda)}
              </dd>
            </div>

            <div className="flex justify-between items-center">
              <dt className="text-sm font-semibold text-muted-foreground">Descuento</dt>
              <dd className="text-sm font-bold text-emerald-600">
                -{formatCurrency(invoice.descuento, invoice.moneda)}
              </dd>
            </div>

            <Separator />

            <div className="flex items-center justify-between rounded-2xl bg-slate-50 dark:bg-zinc-900/50 p-4">
              <dt className="text-base font-bold text-foreground">Total pagado</dt>
              <dd className="text-3xl font-extrabold bg-gradient-to-r from-foreground to-slate-600 bg-clip-text text-transparent">
                {formatCurrency(invoice.total, invoice.moneda)}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </main>
  )
}