import { ArrowRight } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

import type { HotelPreview } from '@/domain/entities/hotel-preview.entity'
import { localTokenStorage } from '@/infrastructure/storage/local-token-storage'
import {
  EmptyState,
  ErrorState,
  Loader,
} from '@/presentation/components/common'
import { Button } from '@/presentation/components/ui/button'
import { useFeaturedHotelsQuery } from '@/presentation/hooks/useFeaturedHotelsQuery'

import { HotelPreviewCard } from './HotelPreviewCard'

export function FeaturedHotelsSection() {
  const navigate = useNavigate()

  const { data, error, isPending, refetch } = useFeaturedHotelsQuery()

  function handleViewHotel(hotel: HotelPreview): void {
    navigate(`/hoteles/${hotel.id}`)
  }

  function handleReserve(hotel: HotelPreview): void {
    const destination = `/reserva/seleccion?hotel=${hotel.id}`

    if (!localTokenStorage.getAccessToken()) {
      navigate('/login', { state: { from: destination } })
      return
    }

    navigate(destination)
  }

  return (
    <section className="relative overflow-hidden bg-muted/30 py-20 text-foreground dark:bg-muted/20">
      {/* Blobs */}
      <div className="pointer-events-none absolute left-0 top-0 h-64 w-64 rounded-full bg-primary/8 blur-3xl dark:bg-primary/12" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-64 w-64 rounded-full bg-violet-400/8 blur-3xl dark:bg-violet-500/12" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 flex flex-col gap-6 rounded-3xl border border-border bg-card p-8 shadow-sm lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-widest text-primary">
              Descubre StayBooking
            </p>
            <h2 className="mt-3 text-4xl font-black tracking-tight text-foreground sm:text-5xl">
              Hoteles destacados con estilo moderno
            </h2>
            <p className="mt-3 text-base leading-8 text-muted-foreground sm:text-lg">
              Explora opciones seleccionadas por su diseño, ubicación y disponibilidad en tiempo real.
            </p>
          </div>

          <Button
            variant="outline"
            asChild
            className="w-fit rounded-2xl border-border bg-background px-5 py-3 text-sm font-semibold text-foreground transition-all duration-200 hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
          >
            <Link to="/hoteles">
              Ver todos
              <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
        </div>

        {/* Estados */}
        {isPending && <Loader message="Cargando hoteles destacados..." />}

        {error && (
          <ErrorState
            message={error.message}
            onRetry={() => { void refetch() }}
          />
        )}

        {!isPending && !error && data && data.results.length === 0 && (
          <EmptyState
            title="No hay hoteles disponibles"
            description="Todavía no existen hoteles para mostrar."
          />
        )}

        {!isPending && !error && data && data.results.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.results.map((hotel) => (
              <HotelPreviewCard
                key={hotel.id}
                hotel={hotel}
                onViewHotel={handleViewHotel}
                onReserve={handleReserve}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
