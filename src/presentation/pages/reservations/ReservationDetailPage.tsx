import {
  ArrowLeft,
  CalendarDays,
  ReceiptText,
  Users,
} from 'lucide-react'
import {
  Link,
  useParams,
} from 'react-router-dom'

import type { ReservationStatus } from '@/domain/entities/reservation.entity'
import {
  ErrorState,
  Loader,
} from '@/presentation/components/common'
import { Badge } from '@/presentation/components/ui/badge'
import { Button } from '@/presentation/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/presentation/components/ui/card'
import { Separator } from '@/presentation/components/ui/separator'
import { useReservation } from '@/presentation/hooks/useReservations'

const statusLabels: Record<
  ReservationStatus,
  string
> = {
  pendiente: 'Pendiente',
  confirmada: 'Confirmada',
  cancelada: 'Cancelada',
  finalizada: 'Finalizada',
}

const statusClasses: Record<
  ReservationStatus,
  string
> = {
  pendiente:
    'border-amber-200 bg-amber-50 text-amber-700',
  confirmada:
    'border-emerald-200 bg-emerald-50 text-emerald-700',
  cancelada:
    'border-rose-200 bg-rose-50 text-rose-700',
  finalizada:
    'border-slate-200 bg-slate-50 text-slate-700',
}

function formatDate(value: string): string {
  const date = new Date(`${value}T12:00:00`)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat(
    'es-EC',
    {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    },
  ).format(date)
}

function formatMoney(value: string): string {
  const amount = Number(value)

  if (!Number.isFinite(amount)) {
    return value
  }

  return new Intl.NumberFormat(
    'es-EC',
    {
      style: 'currency',
      currency: 'USD',
    },
  ).format(amount)
}

export default function ReservationDetailPage() {
  const { reservationId: reservationIdParam } =
    useParams()

  const reservationId = Number(
    reservationIdParam,
  )

  const isValidReservationId =
    Number.isInteger(reservationId)
    && reservationId > 0

  const {
    data: reservation,
    isLoading,
    isError,
    refetch,
  } = useReservation(reservationId)

  if (!isValidReservationId) {
    return (
      <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <ErrorState
          title="Reserva no válida"
          message="El identificador de la reserva no es correcto."
        />
      </main>
    )
  }

  if (isLoading) {
    return (
      <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <Loader message="Cargando detalle de la reserva..." />
      </main>
    )
  }

  if (
    isError
    || !reservation
  ) {
    return (
      <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <ErrorState
          title="No pudimos cargar la reserva"
          message="La reserva no existe o no tienes permisos para consultarla."
          onRetry={() => {
            void refetch()
          }}
        />
      </main>
    )
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <Button
        variant="ghost"
        className="mb-6"
        asChild
      >
        <Link to="/mis-reservas">
          <ArrowLeft className="size-4" />
          Volver a mis reservas
        </Link>
      </Button>

      <header className="flex flex-col gap-4 rounded-3xl bg-gradient-to-br from-primary via-[#e31c5f] to-[#a30d43] p-8 text-primary-foreground sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-white/80">
            Detalle de reserva
          </p>

          <h1 className="mt-2 text-3xl font-bold">
            {reservation.codigo}
          </h1>

          <p className="mt-2 text-white/85">
            Reserva de{' '}
            {reservation.cliente_nombre}
          </p>
        </div>

        <Badge
          variant="outline"
          className={
            statusClasses[
              reservation.estado
            ]
          }
        >
          {
            statusLabels[
              reservation.estado
            ]
          }
        </Badge>
      </header>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>
                Datos de la estancia
              </CardTitle>
            </CardHeader>

            <CardContent className="grid gap-5 sm:grid-cols-2">
              <div className="rounded-xl bg-muted/50 p-4">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <CalendarDays className="size-4 text-primary" />
                  Fecha de entrada
                </div>

                <p className="mt-2 text-lg font-semibold">
                  {formatDate(
                    reservation.fecha_entrada,
                  )}
                </p>
              </div>

              <div className="rounded-xl bg-muted/50 p-4">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <CalendarDays className="size-4 text-primary" />
                  Fecha de salida
                </div>

                <p className="mt-2 text-lg font-semibold">
                  {formatDate(
                    reservation.fecha_salida,
                  )}
                </p>
              </div>

              <div className="rounded-xl bg-muted/50 p-4">
                <p className="text-sm text-muted-foreground">
                  Duración
                </p>

                <p className="mt-2 text-lg font-semibold">
                  {
                    reservation.numero_noches
                  } noche(s)
                </p>
              </div>

              <div className="rounded-xl bg-muted/50 p-4">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Users className="size-4 text-primary" />
                  Huéspedes
                </div>

                <p className="mt-2 text-lg font-semibold">
                  {
                    reservation.cantidad_adultos
                  } adulto(s),{' '}
                  {
                    reservation.cantidad_ninos
                  } niño(s)
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                Observaciones
              </CardTitle>
            </CardHeader>

            <CardContent>
              <p className="text-sm text-muted-foreground">
                {reservation.observaciones
                  || 'No se registraron observaciones para esta reserva.'}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ReceiptText className="size-5 text-primary" />
              Resumen económico
            </CardTitle>
          </CardHeader>

          <CardContent>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">
                  Subtotal
                </dt>

                <dd className="font-medium">
                  {formatMoney(
                    reservation.subtotal,
                  )}
                </dd>
              </div>

              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">
                  Impuestos
                </dt>

                <dd className="font-medium">
                  {formatMoney(
                    reservation.impuestos,
                  )}
                </dd>
              </div>

              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">
                  Descuento
                </dt>

                <dd className="font-medium">
                  {formatMoney(
                    reservation.descuento,
                  )}
                </dd>
              </div>

              <Separator />

              <div className="flex items-center justify-between gap-4">
                <dt className="text-base font-semibold">
                  Total
                </dt>

                <dd className="text-2xl font-bold">
                  {formatMoney(
                    reservation.total,
                  )}
                </dd>
              </div>
            </dl>

            {reservation.estado === 'pendiente' && (
              <p className="mt-5 rounded-xl bg-amber-50 p-3 text-sm text-amber-800">
                Esta reserva está pendiente. El pago
                se habilitará en el módulo de pagos.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}