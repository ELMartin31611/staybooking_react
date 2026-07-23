import { useMemo, useState } from 'react'
import {
  ArrowRight,
  BedDouble,
  CalendarRange,
  Clock,
  Filter,
  LayoutGrid,
  List,
  Moon,
  Search,
  Tag,
  Users2,
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
import { Button } from '@/presentation/components/ui/button'
import { Input } from '@/presentation/components/ui/input'
import { useReservations } from '@/presentation/hooks/useReservations'

type StatusFilter = 'todas' | ReservationStatus
type ViewMode = 'grid' | 'list'

const statusMeta: Record<
  ReservationStatus,
  { label: string; dot: string; bg: string; text: string; border: string }
> = {
  pendiente: {
    label: 'Pendiente',
    dot: 'bg-amber-400',
    bg: 'bg-amber-500/10 dark:bg-amber-500/15',
    text: 'text-amber-700 dark:text-amber-300',
    border: 'border-amber-300/60 dark:border-amber-500/30',
  },
  confirmada: {
    label: 'Confirmada',
    dot: 'bg-emerald-400',
    bg: 'bg-emerald-500/10 dark:bg-emerald-500/15',
    text: 'text-emerald-700 dark:text-emerald-300',
    border: 'border-emerald-300/60 dark:border-emerald-500/30',
  },
  cancelada: {
    label: 'Cancelada',
    dot: 'bg-rose-400',
    bg: 'bg-rose-500/10 dark:bg-rose-500/15',
    text: 'text-rose-700 dark:text-rose-300',
    border: 'border-rose-300/60 dark:border-rose-500/30',
  },
  finalizada: {
    label: 'Finalizada',
    dot: 'bg-slate-400',
    bg: 'bg-muted/60 dark:bg-muted/40',
    text: 'text-muted-foreground',
    border: 'border-border',
  },
}

const STATUS_ACCENT: Record<ReservationStatus, string> = {
  pendiente: 'from-amber-400 to-orange-400',
  confirmada: 'from-emerald-400 to-teal-400',
  cancelada: 'from-rose-500 to-pink-500',
  finalizada: 'from-slate-400 to-slate-500',
}

function isStatusFilter(value: string): value is StatusFilter {
  return ['todas', 'pendiente', 'confirmada', 'cancelada', 'finalizada'].includes(value)
}

function formatDate(value: string): string {
  const date = new Date(`${value}T12:00:00`)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('es-EC', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

function formatMoney(value: string): string {
  const amount = Number(value)
  if (!Number.isFinite(amount)) return value
  return new Intl.NumberFormat('es-EC', { style: 'currency', currency: 'USD' }).format(amount)
}

function matchesSearch(reservation: Reservation, query: string): boolean {
  const q = query.trim().toLowerCase()
  if (!q) return true
  return [reservation.codigo, reservation.cliente_nombre, reservation.estado]
    .join(' ')
    .toLowerCase()
    .includes(q)
}

function ReservationCard({ reservation, view }: { reservation: Reservation; view: ViewMode }) {
  const meta = statusMeta[reservation.estado]
  const accent = STATUS_ACCENT[reservation.estado]

  if (view === 'list') {
    return (
      <article className="group relative overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-px hover:border-primary/30 hover:shadow-lg hover:shadow-primary/8 dark:hover:shadow-primary/5">
        <div className={`absolute left-0 top-0 h-full w-1 bg-gradient-to-b ${accent}`} />
        <div className="grid items-center gap-4 p-5 pl-6 sm:grid-cols-[1fr_auto_auto_auto]">
          {/* Identity */}
          <div className="min-w-0 space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-sm font-extrabold text-foreground">
                Reserva <span className="text-primary">{reservation.codigo}</span>
              </h2>
              <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${meta.bg} ${meta.text} ${meta.border}`}>
                <span className={`size-1.5 rounded-full ${meta.dot}`} />
                {meta.label}
              </span>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-semibold text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <CalendarRange className="size-3.5 text-primary/70" />
                {formatDate(reservation.fecha_entrada)} → {formatDate(reservation.fecha_salida)}
              </span>
              <span className="flex items-center gap-1.5">
                <Users2 className="size-3.5 text-primary/70" />
                {reservation.cantidad_adultos} adulto(s) · {reservation.cantidad_ninos} niño(s)
              </span>
              <span className="flex items-center gap-1.5">
                <Moon className="size-3.5 text-primary/70" />
                {reservation.numero_noches} noche(s)
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="text-right">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Total</p>
            <p className="text-xl font-extrabold text-foreground">{formatMoney(reservation.total)}</p>
          </div>

          {/* CTA */}
          <Button variant="outline" size="sm" asChild
            className="rounded-xl border-border font-bold transition-all hover:border-primary/40 hover:bg-primary/5 hover:text-primary dark:bg-card">
            <Link to={`/mis-reservas/${reservation.id}`} className="flex items-center gap-1.5">
              Ver detalle
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Button>
        </div>
      </article>
    )
  }

  return (
    <article className="group relative overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10 dark:hover:shadow-primary/6">
      {/* Top accent bar */}
      <div className={`h-1 w-full bg-gradient-to-r ${accent}`} />

      <div className="p-6 space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              <Tag className="size-3" />
              Código de reserva
            </div>
            <h2 className="text-xl font-extrabold text-primary">{reservation.codigo}</h2>
          </div>
          <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${meta.bg} ${meta.text} ${meta.border}`}>
            <span className={`size-1.5 rounded-full ${meta.dot}`} />
            {meta.label}
          </span>
        </div>

        {/* Date range visual */}
        <div className="rounded-2xl border border-border bg-muted/30 dark:bg-muted/20 p-4 space-y-2">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            <CalendarRange className="size-3.5 text-primary" />
            Fechas de estadía
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 text-center">
              <p className="text-[10px] font-bold text-muted-foreground uppercase">Entrada</p>
              <p className="text-sm font-extrabold text-foreground">{formatDate(reservation.fecha_entrada)}</p>
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <div className="h-px w-8 bg-primary/40" />
              <ArrowRight className="size-3.5 text-primary" />
            </div>
            <div className="flex-1 text-center">
              <p className="text-[10px] font-bold text-muted-foreground uppercase">Salida</p>
              <p className="text-sm font-extrabold text-foreground">{formatDate(reservation.fecha_salida)}</p>
            </div>
          </div>
        </div>

        {/* Stats chips */}
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-xl bg-muted/50 dark:bg-muted/30 px-3 py-1.5 text-xs font-bold text-muted-foreground">
            <Users2 className="size-3.5 text-primary" />
            {reservation.cantidad_adultos} adulto(s) · {reservation.cantidad_ninos} niño(s)
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-xl bg-muted/50 dark:bg-muted/30 px-3 py-1.5 text-xs font-bold text-muted-foreground">
            <Moon className="size-3.5 text-primary" />
            {reservation.numero_noches} noche(s)
          </span>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border pt-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Total</p>
            <p className="text-2xl font-extrabold text-foreground">{formatMoney(reservation.total)}</p>
          </div>
          <Button asChild
            className="rounded-xl bg-primary font-bold text-primary-foreground shadow-md shadow-primary/20 transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/30 active:scale-[0.98]">
            <Link to={`/mis-reservas/${reservation.id}`} className="flex items-center gap-2">
              Ver detalle
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Button>
        </div>
      </div>
    </article>
  )
}

export default function MyReservationsPage() {
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('todas')
  const [view, setView] = useState<ViewMode>('grid')

  const { data: reservations = [], isLoading, isError, refetch } = useReservations()

  const filteredReservations = useMemo(
    () => reservations.filter((r) => {
      const matchesStatus = statusFilter === 'todas' || r.estado === statusFilter
      return matchesStatus && matchesSearch(r, query)
    }),
    [query, reservations, statusFilter],
  )

  const countByStatus = useMemo(() => ({
    confirmada: reservations.filter((r) => r.estado === 'confirmada').length,
    pendiente: reservations.filter((r) => r.estado === 'pendiente').length,
    cancelada: reservations.filter((r) => r.estado === 'cancelada').length,
    finalizada: reservations.filter((r) => r.estado === 'finalizada').length,
  }), [reservations])

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
          onRetry={() => { void refetch() }}
        />
      </main>
    )
  }

  return (
    <main className="mx-auto w-full max-w-7xl space-y-7 px-4 py-10 sm:px-6 lg:px-8">

      {/* ── Hero Banner ── */}
      <header className="relative overflow-hidden rounded-3xl border border-primary/20 bg-card shadow-sm">
        {/* Neon top strip */}
        <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-primary via-[#ff4488] to-[#ff0055]" />
        {/* Ambient glows */}
        <div className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-primary/10 blur-3xl dark:bg-primary/15" />
        <div className="pointer-events-none absolute -bottom-12 -left-8 size-48 rounded-full bg-rose-400/8 blur-3xl dark:bg-rose-500/12" />

        <div className="relative z-10 p-8 sm:p-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            {/* Title block */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/8 px-3.5 py-1.5 text-xs font-bold uppercase tracking-widest text-primary">
                <BedDouble className="size-3.5" />
                Panel de viajes
              </div>
              <h1 className="mt-4 text-4xl font-black tracking-tight text-foreground">
                Mis Reservas
              </h1>
              <p className="mt-2 max-w-xl text-sm font-medium text-muted-foreground">
                Gestiona todas tus estancias desde un solo lugar — historial, estados y detalles en tiempo real.
              </p>
            </div>

            {/* KPI chips */}
            <div className="flex flex-wrap gap-3">
              <div className="rounded-2xl border border-border bg-background/70 px-5 py-3 text-center dark:bg-muted/30">
                <p className="text-2xl font-extrabold text-foreground">{reservations.length}</p>
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Total</p>
              </div>
              <div className="rounded-2xl border border-emerald-300/40 bg-emerald-50 px-5 py-3 text-center dark:border-emerald-500/25 dark:bg-emerald-500/12">
                <p className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-300">{countByStatus.confirmada}</p>
                <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Confirm.</p>
              </div>
              <div className="rounded-2xl border border-amber-300/40 bg-amber-50 px-5 py-3 text-center dark:border-amber-500/25 dark:bg-amber-500/12">
                <p className="text-2xl font-extrabold text-amber-700 dark:text-amber-300">{countByStatus.pendiente}</p>
                <p className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">Pendiente</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ── Toolbar ── */}
      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:items-end">
        {/* Search */}
        <div className="flex-1 space-y-1.5">
          <label htmlFor="reservation-search"
            className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            <Search className="size-3" />
            Buscar
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/60" />
            <Input
              id="reservation-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por código, cliente o estado..."
              className="h-11 rounded-xl border-border bg-background pl-10 text-sm font-semibold placeholder:text-muted-foreground/50 focus:border-primary focus:ring-2 focus:ring-primary/15 dark:bg-input"
            />
          </div>
        </div>

        {/* Status filter */}
        <div className="sm:w-52 space-y-1.5">
          <label htmlFor="reservation-status"
            className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            <Filter className="size-3" />
            Estado
          </label>
          <div className="relative">
            <select
              id="reservation-status"
              value={statusFilter}
              onChange={(e) => {
                const v = e.target.value
                if (isStatusFilter(v)) setStatusFilter(v)
              }}
              className="h-11 w-full appearance-none rounded-xl border border-border bg-background px-3 pr-8 text-sm font-semibold text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/15 dark:bg-input"
            >
              <option value="todas">Todas</option>
              <option value="pendiente">Pendientes</option>
              <option value="confirmada">Confirmadas</option>
              <option value="cancelada">Canceladas</option>
              <option value="finalizada">Finalizadas</option>
            </select>
            <Clock className="pointer-events-none absolute right-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground/60" />
          </div>
        </div>

        {/* View toggle */}
        <div className="flex gap-1 rounded-xl border border-border bg-muted/40 p-1">
          <button
            type="button"
            onClick={() => setView('grid')}
            aria-label="Ver reservas en cuadrícula"
            className={`flex size-9 items-center justify-center rounded-lg transition-all ${view === 'grid' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-background'}`}
          >
            <LayoutGrid className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => setView('list')}
            aria-label="Ver reservas en lista"
            className={`flex size-9 items-center justify-center rounded-lg transition-all ${view === 'list' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-background'}`}
          >
            <List className="size-4" />
          </button>
        </div>
      </div>

      {/* ── Results counter ── */}
      {filteredReservations.length > 0 && (
        <p className="px-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
          {filteredReservations.length} de {reservations.length} reservas
        </p>
      )}

      {/* ── List ── */}
      <section>
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
          <div className={view === 'grid' ? 'grid gap-5 sm:grid-cols-2 xl:grid-cols-3' : 'space-y-3'}>
            {filteredReservations.map((reservation) => (
              <ReservationCard key={reservation.id} reservation={reservation} view={view} />
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
