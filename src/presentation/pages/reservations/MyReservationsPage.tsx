import { useMemo, useState } from 'react'
import {
  CalendarDays,
  Search,
  Users,
} from 'lucide-react'
import { Link } from 'react-router-dom'

import type {
  Reservation,
  ReservationStatus,
} from '@/domain/entities/reservation.entity'
import {
  EmptyState,
  ErrorState,
  Loader,
} from '@/presentation/components/common'
import { Badge } from '@/presentation/components/ui/badge'
import { Button } from '@/presentation/components/ui/button'
import {
  Card,
  CardContent,
} from '@/presentation/components/ui/card'
import { Input } from '@/presentation/components/ui/input'
import { useReservations } from '@/presentation/hooks/useReservations'

type StatusFilter =
  | 'todas'
  | ReservationStatus

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

function isStatusFilter(
  value: string,
): value is StatusFilter {
  return (
    value === 'todas'
    || value === 'pendiente'
    || value === 'confirmada'
    || value === 'cancelada'
    || value === 'finalizada'
  )
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
      month: 'short',
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

function matchesSearch(
  reservation: Reservation,
  query: string,
): boolean {
  const normalizedQuery =
    query.trim().toLowerCase()

  if (!normalizedQuery) {
    return true
  }

  const searchableText = [
    reservation.codigo,
    reservation.cliente_nombre,
    reservation.estado,
  ]
    .join(' ')
    .toLowerCase()

  return searchableText.includes(
    normalizedQuery,
  )
}

export default function MyReservationsPage() {
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>('todas')

  const {
    data: reservations = [],
    isLoading,
    isError,
    refetch,
  } = useReservations()

  const filteredReservations =
    useMemo(
      () =>
        reservations.filter(
          (reservation) => {
            const matchesStatus =
              statusFilter === 'todas'
              || reservation.estado
                === statusFilter

            return (
              matchesStatus
              && matchesSearch(
                reservation,
                query,
              )
            )
          },
        ),
      [
        query,
        reservations,
        statusFilter,
      ],
    )

  if (isLoading) {
    return (
      <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Loader message="Cargando tus reservas..." />
      </main>
    )
  }

  if (isError) {
    return (
      <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <ErrorState
          title="No pudimos cargar tus reservas"
          message="Comprueba tu conexión e inténtalo nuevamente."
          onRetry={() => {
            void refetch()
          }}
        />
      </main>
    )
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="rounded-3xl bg-gradient-to-br from-primary via-[#e31c5f] to-[#a30d43] p-8 text-primary-foreground">
        <p className="text-sm font-medium text-white/80">
          Gestión de viajes
        </p>

        <h1 className="mt-2 text-3xl font-bold">
          Mis reservas
        </h1>

        <p className="mt-3 max-w-2xl text-white/85">
          Consulta las reservas vinculadas a tu
          cuenta directamente desde StayBooking.
        </p>
      </header>

      <Card className="mt-6">
        <CardContent className="grid gap-4 pt-6 md:grid-cols-[2fr_1fr]">
          <div className="space-y-2">
            <label
              htmlFor="reservation-search"
              className="text-sm font-medium"
            >
              Buscar
            </label>

            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                id="reservation-search"
                className="pl-9"
                placeholder="Código o estado"
                value={query}
                onChange={(event) =>
                  setQuery(event.target.value)
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="reservation-status"
              className="text-sm font-medium"
            >
              Estado
            </label>

            <select
              id="reservation-status"
              value={statusFilter}
              onChange={(event) => {
                const selectedStatus =
                  event.target.value

                if (
                  isStatusFilter(
                    selectedStatus,
                  )
                ) {
                  setStatusFilter(
                    selectedStatus,
                  )
                }
              }}
              className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
            >
              <option value="todas">
                Todas
              </option>

              <option value="pendiente">
                Pendientes
              </option>

              <option value="confirmada">
                Confirmadas
              </option>

              <option value="cancelada">
                Canceladas
              </option>

              <option value="finalizada">
                Finalizadas
              </option>
            </select>
          </div>
        </CardContent>
      </Card>

      <section className="mt-6">
        {filteredReservations.length === 0 ? (
          <EmptyState
            title="No encontramos reservas"
            description={
              reservations.length === 0
                ? 'Cuando realices una reserva aparecerá en esta sección.'
                : 'Prueba con otro término o estado.'
            }
          />
        ) : (
          <div className="grid gap-4">
            {filteredReservations.map(
              (reservation) => (
                <Card key={reservation.id}>
                  <CardContent className="grid gap-5 pt-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-lg font-semibold">
                          Reserva{' '}
                          {reservation.codigo}
                        </h2>

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
                      </div>

                      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-2">
                          <CalendarDays className="size-4" />

                          {formatDate(
                            reservation.fecha_entrada,
                          )}
                          {' → '}
                          {formatDate(
                            reservation.fecha_salida,
                          )}
                        </span>

                        <span className="flex items-center gap-2">
                          <Users className="size-4" />

                          {
                            reservation.cantidad_adultos
                          } adulto(s) y{' '}
                          {
                            reservation.cantidad_ninos
                          } niño(s)
                        </span>
                      </div>

                      <p className="mt-3 text-sm text-muted-foreground">
                        {
                          reservation.numero_noches
                        } noche(s)
                      </p>
                    </div>

                    <div className="flex flex-col items-start gap-3 md:items-end">
                      <p className="text-2xl font-bold">
                        {formatMoney(
                          reservation.total,
                        )}
                      </p>

                      <Button
                        variant="outline"
                        asChild
                      >
                        <Link
                          to={`/mis-reservas/${reservation.id}`}
                        >
                          Ver detalle
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ),
            )}
          </div>
        )}
      </section>
    </main>
  )
}