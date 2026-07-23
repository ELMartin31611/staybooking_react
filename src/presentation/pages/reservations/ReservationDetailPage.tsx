import {
  CalendarDays,
  CheckCircle2,
  Hotel,
  UserRound,
  Users,
} from 'lucide-react'
import {
  Link,
  useLocation,
  useParams,
} from 'react-router-dom'

import type { ReservationStatus } from '@/domain/entities/reservation.entity'
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
  useReservation,
} from '@/presentation/hooks/useReservations'

function formatCurrency(
  value: string | number,
  currency: string,
): string {
  const amount = Number(value)

  if (!Number.isFinite(amount)) {
    return `${value} ${currency}`
  }

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

function formatDate(
  value: string,
): string {
  const date =
    new Date(`${value}T12:00:00`)

  if (
    Number.isNaN(date.getTime())
  ) {
    return value
  }

  return new Intl.DateTimeFormat(
    'es-EC',
    {
      dateStyle: 'long',
    },
  ).format(date)
}

function formatDateTime(
  value: string,
): string {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat(
    'es-EC',
    {
      dateStyle: 'long',
      timeStyle: 'short',
    },
  ).format(date)
}

function getStatusLabel(
  status: ReservationStatus,
): string {
  const labels:
    Record<ReservationStatus, string> = {
      pendiente: 'Pendiente',
      confirmada: 'Confirmada',
      cancelada: 'Cancelada',
      finalizada: 'Finalizada',
    }

  return labels[status]
}

function getStatusVariant(
  status: ReservationStatus,
):
  | 'default'
  | 'secondary'
  | 'destructive'
  | 'outline' {
  if (status === 'confirmada') {
    return 'default'
  }

  if (status === 'cancelada') {
    return 'destructive'
  }

  if (status === 'pendiente') {
    return 'secondary'
  }

  return 'outline'
}

export default function ReservationDetailPage() {
  const { reservationId } =
    useParams()

  const location = useLocation()
  const id = Number(reservationId)

  const reservationQuery =
    useReservation(id)

  if (reservationQuery.isPending) {
    return (
      <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        <div className="space-y-5">
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-96 rounded-2xl" />
        </div>
      </main>
    )
  }

  if (
    reservationQuery.isError
    || !reservationQuery.data
  ) {
    return (
      <main className="mx-auto w-full max-w-3xl px-4 py-12">
        <Alert variant="destructive">
          <AlertDescription>
            No fue posible cargar la reserva.
          </AlertDescription>
        </Alert>

        <Button
          className="mt-5"
          variant="outline"
          asChild
        >
          <Link to="/mis-reservas">
            Volver a Mis reservas
          </Link>
        </Button>
      </main>
    )
  }

  const reservation =
    reservationQuery.data

  const created =
    (
      location.state as {
        created?: boolean
      } | null
    )?.created === true

  const rooms =
    reservation
      .habitaciones_reservadas
    ?? []

  const guests =
    reservation.huespedes
    ?? []
  const services = reservation.servicios ?? []

  return (
    <main className="mx-auto w-full max-w-6xl space-y-6 px-4 py-10 sm:px-6 lg:px-8">
      {created && (
        <Alert>
          <CheckCircle2 className="size-4" />

          <AlertDescription>
            Reserva creada correctamente.
            Su estado inicial es pendiente
            hasta completar el pago.
          </AlertDescription>
        </Alert>
      )}

      <header className="flex flex-wrap items-start justify-between gap-4 rounded-2xl border bg-card p-6">
        <div>
          <p className="text-sm font-medium text-primary">
            Reserva
          </p>

          <h1 className="mt-1 text-3xl font-bold">
            {reservation.codigo}
          </h1>

          <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <CalendarDays className="size-4" />
              {formatDate(
                reservation.fecha_entrada,
              )}
            </span>

            <span>
              hasta
            </span>

            <span className="inline-flex items-center gap-2">
              <CalendarDays className="size-4" />
              {formatDate(
                reservation.fecha_salida,
              )}
            </span>
          </div>

          <p className="mt-2 text-sm text-muted-foreground">
            {reservation.numero_noches}{' '}
            noche(s)
          </p>
        </div>

        <Badge
          variant={getStatusVariant(
            reservation.estado,
          )}
        >
          {getStatusLabel(
            reservation.estado,
          )}
        </Badge>
      </header>

      {reservation.estado === 'cancelada'
        && (
          <Alert variant="destructive">
            <AlertDescription>
              <span className="font-medium">
                Esta reserva fue cancelada.
              </span>

              {reservation.motivo_cancelacion && (
                <>
                  {' '}
                  Motivo: {reservation.motivo_cancelacion}.
                </>
              )}

              {reservation.fecha_cancelacion && (
                <>
                  {' '}
                  Cancelada el{' '}
                  {formatDateTime(
                    reservation.fecha_cancelacion,
                  )}
                  .
                </>
              )}

              {reservation.cancelada_por_nombre && (
                <>
                  {' '}
                  Registrada por {reservation.cancelada_por_nombre}.
                </>
              )}
            </AlertDescription>
          </Alert>
        )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <section className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold">
                Habitaciones reservadas
              </h2>

              <p className="text-sm text-muted-foreground">
                El precio se cobra una vez por
                habitación. Solo los huéspedes
                extra generan recargo.
              </p>
            </div>

            {rooms.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-sm text-muted-foreground">
                  No existe información de
                  habitaciones para esta reserva.
                </CardContent>
              </Card>
            ) : (
              rooms.map((room) => {
                const baseSubtotal =
                  Number(
                    room
                      .subtotal_habitacion,
                  )

                const displayedBase =
                  baseSubtotal > 0
                    ? baseSubtotal
                    : Math.max(
                        0,
                        Number(room.subtotal)
                        - Number(
                            room.subtotal_huespedes_extra,
                          ),
                      )

                return (
                  <Card key={room.id}>
                    <CardHeader>
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <CardTitle className="inline-flex items-center gap-2">
                            <Hotel className="size-5 text-primary" />

                            {room.hotel_nombre}
                          </CardTitle>

                          <p className="mt-2 text-sm text-muted-foreground">
                            {room.tipo_habitacion}
                            {' · '}
                            Habitación física{' '}
                            {room.habitacion_numero}
                          </p>
                        </div>

                        <Badge variant="outline">
                          {room.estado}
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <div className="grid gap-3 sm:grid-cols-3">
                        <div className="rounded-xl bg-muted/40 p-3">
                          <p className="text-xs text-muted-foreground">
                            Adultos
                          </p>

                          <p className="mt-1 font-semibold">
                            {room.cantidad_adultos}
                          </p>
                        </div>

                        <div className="rounded-xl bg-muted/40 p-3">
                          <p className="text-xs text-muted-foreground">
                            Niños
                          </p>

                          <p className="mt-1 font-semibold">
                            {room.cantidad_ninos}
                          </p>
                        </div>

                        <div className="rounded-xl bg-muted/40 p-3">
                          <p className="text-xs text-muted-foreground">
                            Huéspedes extra
                          </p>

                          <p className="mt-1 font-semibold">
                            {
                              room
                                .cantidad_huespedes_extra
                            }
                          </p>
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-2 text-sm">
                        <p className="flex justify-between gap-3">
                          <span className="text-muted-foreground">
                            Precio promedio por
                            habitación/noche
                          </span>

                          <strong>
                            {formatCurrency(
                              room.precio_noche,
                              room.moneda,
                            )}
                          </strong>
                        </p>

                        <p className="flex justify-between gap-3">
                          <span className="text-muted-foreground">
                            Habitación por{' '}
                            {room.noches} noche(s)
                          </span>

                          <strong>
                            {formatCurrency(
                              displayedBase,
                              room.moneda,
                            )}
                          </strong>
                        </p>

                        <p className="flex justify-between gap-3">
                          <span className="text-muted-foreground">
                            Recargo por huéspedes
                            extra
                          </span>

                          <strong>
                            {formatCurrency(
                              room
                                .subtotal_huespedes_extra,
                              room.moneda,
                            )}
                          </strong>
                        </p>

                        <p className="flex justify-between gap-3 border-t pt-3">
                          <span>
                            Subtotal de habitación
                          </span>

                          <strong>
                            {formatCurrency(
                              room.subtotal,
                              room.moneda,
                            )}
                          </strong>
                        </p>
                      </div>

                      {room.detalle_tarifas.length > 0 && (
                        <details className="rounded-xl border p-4">
                          <summary className="cursor-pointer text-sm font-medium">
                            Ver detalle por noche
                          </summary>

                          <div className="mt-4 space-y-3">
                            {room.detalle_tarifas.map(
                              (detail) => (
                                <div
                                  key={
                                    `${room.id}-${detail.fecha}`
                                  }
                                  className="rounded-lg bg-muted/30 p-3 text-sm"
                                >
                                  <div className="flex flex-wrap justify-between gap-2">
                                    <span>
                                      {formatDate(
                                        detail.fecha,
                                      )}
                                    </span>

                                    <strong>
                                      {formatCurrency(
                                        detail.total_noche
                                        ?? detail.precio_noche
                                        ?? 0,
                                        detail.moneda,
                                      )}
                                    </strong>
                                  </div>

                                  <p className="mt-1 text-xs text-muted-foreground">
                                    {detail.temporada}
                                    {' · '}
                                    {
                                      detail
                                        .huespedes_extra
                                      ?? 0
                                    } huésped(es)
                                    extra
                                  </p>
                                </div>
                              ),
                            )}
                          </div>
                        </details>
                      )}
                    </CardContent>
                  </Card>
                )
              })
            )}
          </section>

          <Card>
            <CardHeader>
              <CardTitle className="inline-flex items-center gap-2">
                <Users className="size-5 text-primary" />
                Huéspedes registrados
              </CardTitle>
            </CardHeader>

            <CardContent>
              {guests.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No existe información de
                  huéspedes.
                </p>
              ) : (
                <div className="divide-y">
                  {guests.map((guest) => (
                    <div
                      key={guest.id}
                      className="flex flex-wrap items-center justify-between gap-4 py-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <UserRound className="size-4" />
                        </div>

                        <div>
                          <p className="font-medium">
                            {guest.nombres}{' '}
                            {guest.apellidos}
                          </p>

                          <p className="text-sm text-muted-foreground">
                            {guest.tipo_huesped
                              === 'adulto'
                              ? 'Adulto'
                              : 'Niño'}
                            {' · '}
                            {guest.edad} años
                            {' · '}
                            Habitación{' '}
                            {
                              guest
                                .habitacion_numero
                            }
                          </p>

                          <p className="text-xs text-muted-foreground">
                            {guest.tipo_documento}
                            {': '}
                            {
                              guest
                                .numero_documento
                            }
                          </p>
                        </div>
                      </div>

                      {guest.es_titular && (
                        <Badge variant="secondary">
                          Titular
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {services.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Servicios adicionales</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {services.map((service) => (
                  <div
                    key={service.id}
                    className="flex justify-between gap-3 text-sm"
                  >
                    <span>
                      {service.nombre} × {service.cantidad}
                    </span>
                    <strong>
                      {formatCurrency(service.subtotal, service.moneda)}
                    </strong>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {reservation.observaciones && (
            <Card>
              <CardHeader>
                <CardTitle>
                  Observaciones
                </CardTitle>
              </CardHeader>

              <CardContent>
                <p className="text-sm">
                  {reservation.observaciones}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        <aside className="lg:self-start">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>
                Resumen de pago
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="flex justify-between gap-3 text-sm">
                <span className="text-muted-foreground">
                  Habitaciones
                </span>

                <strong>
                  {rooms.length}
                </strong>
              </p>

              <p className="flex justify-between gap-3 text-sm">
                <span className="text-muted-foreground">
                  Huéspedes
                </span>

                <strong>
                  {reservation.cantidad_adultos
                    + reservation.cantidad_ninos}
                </strong>
              </p>

              <Separator />

              <p className="flex justify-between gap-3 text-sm">
                <span className="text-muted-foreground">
                  Habitaciones
                </span>

                <strong>
                  {formatCurrency(
                    reservation.subtotal_habitaciones,
                    reservation.moneda,
                  )}
                </strong>
              </p>

              <p className="flex justify-between gap-3 text-sm">
                <span className="text-muted-foreground">
                  Servicios adicionales
                </span>
                <strong>
                  {formatCurrency(
                    reservation.subtotal_servicios,
                    reservation.moneda,
                  )}
                </strong>
              </p>

              <p className="flex justify-between gap-3 text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <strong>
                  {formatCurrency(reservation.subtotal, reservation.moneda)}
                </strong>
              </p>

              <p className="flex justify-between gap-3 text-sm">
                <span className="text-muted-foreground">
                  Impuestos 12%
                </span>

                <strong>
                  {formatCurrency(
                    reservation.impuestos,
                    reservation.moneda,
                  )}
                </strong>
              </p>

              <p className="flex justify-between gap-3 text-sm">
                <span className="text-muted-foreground">
                  Descuento
                </span>

                <strong>
                  {formatCurrency(
                    reservation.descuento,
                    reservation.moneda,
                  )}
                </strong>
              </p>

              <Separator />

              <div className="flex items-end justify-between gap-3">
                <span className="font-medium">
                  Total
                </span>

                <strong className="text-2xl">
                  {formatCurrency(
                    reservation.total,
                    reservation.moneda,
                  )}
                </strong>
              </div>

              {reservation.estado
                === 'pendiente' && (
                <Button
                  className="w-full"
                  asChild
                >
                  <Link
                    to={
                      `/mis-reservas/`
                      + `${reservation.id}`
                      + '/pagar'
                    }
                  >
                    Pagar reserva
                  </Link>
                </Button>
              )}

              {reservation.estado
                === 'confirmada' && (
                <Alert>
                  <CheckCircle2 className="size-4" />

                  <AlertDescription>
                    Esta reserva está confirmada.
                  </AlertDescription>
                </Alert>
              )}

              <Button
                className="w-full"
                variant="outline"
                asChild
              >
                <Link to="/mis-reservas">
                  Volver a Mis reservas
                </Link>
              </Button>
            </CardContent>
          </Card>
        </aside>
      </div>
    </main>
  )
}