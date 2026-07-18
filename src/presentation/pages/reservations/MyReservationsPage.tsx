import { useMemo, useState } from 'react'
import { CalendarClock, Search, XCircle } from 'lucide-react'

import { Button } from '@/presentation/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card'
import { Input } from '@/presentation/components/ui/input'

import {
  reservationsStorage,
  type ReservationRecord,
  type ReservationStatus,
} from './reservations.storage'

function statusClasses(status: ReservationStatus): string {
  if (status === 'CONFIRMADA') {
    return 'bg-emerald-100 text-emerald-700'
  }

  if (status === 'PENDIENTE') {
    return 'bg-amber-100 text-amber-700'
  }

  return 'bg-rose-100 text-rose-700'
}

export default function MyReservationsPage() {
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] =
    useState<'TODAS' | ReservationStatus>('TODAS')
  const [reservations, setReservations] = useState<ReservationRecord[]>(() =>
    reservationsStorage.getAll(),
  )

  const filteredReservations = useMemo(() => {
    return reservations.filter((reservation) => {
      const matchesStatus =
        statusFilter === 'TODAS' || reservation.status === statusFilter

      const searchTarget = `${reservation.hotelName} ${reservation.city} ${reservation.id}`.toLowerCase()
      const matchesSearch = searchTarget.includes(query.toLowerCase().trim())

      return matchesStatus && matchesSearch
    })
  }, [query, reservations, statusFilter])

  function handleCancelReservation(id: string) {
    const updated = reservations.map((reservation) => {
      if (reservation.id !== id) {
        return reservation
      }

      return {
        ...reservation,
        status: 'CANCELADA' as ReservationStatus,
      }
    })

    setReservations(updated)
    reservationsStorage.saveAll(updated)
  }

  return (
    <section className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <div className="rounded-3xl bg-gradient-to-br from-primary via-[#e31c5f] to-[#a30d43] p-8 text-white">
        <p className="text-sm font-medium text-white/80">Gestión de viajes</p>
        <h1 className="mt-2 text-3xl font-bold">Mis reservas</h1>
        <p className="mt-3 text-white/85">
          Busca, filtra y administra tus reservas activas en tiempo real.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtro rápido</CardTitle>
        </CardHeader>

        <CardContent className="grid gap-4 md:grid-cols-[2fr_1fr]">
          <div className="space-y-2">
            <label className="text-sm font-medium">Buscar</label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="pl-9"
                placeholder="Hotel, ciudad o código"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Estado</label>
            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value as 'TODAS' | ReservationStatus)
              }
              className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
            >
              <option value="TODAS">Todas</option>
              <option value="CONFIRMADA">Confirmadas</option>
              <option value="PENDIENTE">Pendientes</option>
              <option value="CANCELADA">Canceladas</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {filteredReservations.length === 0 ? (
        <Card>
          <CardContent className="flex min-h-40 flex-col items-center justify-center gap-2 text-center">
            <CalendarClock className="size-8 text-muted-foreground" />
            <p className="font-medium">No encontramos reservas</p>
            <p className="text-sm text-muted-foreground">
              Prueba otro filtro o crea una reserva desde el catálogo.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredReservations.map((reservation) => (
            <Card key={reservation.id}>
              <CardContent className="grid gap-4 pt-6 md:grid-cols-[2fr_1fr_auto] md:items-center">
                <div>
                  <p className="font-semibold">{reservation.hotelName}</p>
                  <p className="text-sm text-muted-foreground">
                    {reservation.city} · {reservation.roomType}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {reservation.checkIn} → {reservation.checkOut} · {reservation.nights} noches · {reservation.guests} huéspedes
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">Código {reservation.id}</p>
                </div>

                <div>
                  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusClasses(reservation.status)}`}>
                    {reservation.status}
                  </span>
                  <p className="mt-3 text-lg font-bold">${reservation.totalUsd.toFixed(2)}</p>
                </div>

                <div className="flex gap-2 md:justify-end">
                  {reservation.status !== 'CANCELADA' && (
                    <Button
                      variant="outline"
                      onClick={() => handleCancelReservation(reservation.id)}
                    >
                      <XCircle className="size-4" />
                      Cancelar
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  )
}
