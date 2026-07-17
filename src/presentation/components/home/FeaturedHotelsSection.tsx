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

  const {
    data,
    error,
    isPending,
    refetch,
  } = useFeaturedHotelsQuery()

  function handleViewHotel(hotel: HotelPreview): void {
    navigate(`/hoteles/${hotel.id}`)
  }

  function handleReserve(hotel: HotelPreview): void {
    const destination =
      `/reserva/seleccion?hotel=${hotel.id}`

    if (!localTokenStorage.getAccessToken()) {
      navigate('/login', {
        state: {
          from: destination,
        },
      })

      return
    }

    navigate(destination)
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-semibold text-primary">
            Descubre StayBooking
          </p>

          <h2 className="mt-2 text-3xl font-bold tracking-tight">
            Hoteles destacados
          </h2>

          <p className="mt-3 text-muted-foreground">
            Opciones obtenidas directamente desde nuestra API.
          </p>
        </div>

        <Button variant="outline" asChild>
          <Link to="/hoteles">
            Ver todos
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>

      {isPending && (
        <Loader message="Cargando hoteles destacados..." />
      )}

      {error && (
        <ErrorState
          message={error.message}
          onRetry={() => {
            void refetch()
          }}
        />
      )}

      {!isPending &&
        !error &&
        data &&
        data.results.length === 0 && (
          <EmptyState
            title="No hay hoteles disponibles"
            description="Todavía no existen hoteles para mostrar."
          />
        )}

      {!isPending &&
        !error &&
        data &&
        data.results.length > 0 && (
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
    </section>
  )
}