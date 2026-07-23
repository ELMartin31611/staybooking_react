import { useMemo, useState } from 'react'
import { Sparkles } from 'lucide-react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'

import type { HotelPreview } from '@/domain/entities/hotel-preview.entity'
import { hotelCatalogUseCase } from '@/infrastructure/factories/hotel-catalog.factory'
import { localTokenStorage } from '@/infrastructure/storage/local-token-storage'
import {
  EmptyState,
  ErrorState,
} from '@/presentation/components/common'
import { HotelCard } from '@/presentation/components/catalog/HotelCard'
import { HotelCardSkeleton } from '@/presentation/components/catalog/HotelCardSkeleton'
import { HotelFilters } from '@/presentation/components/catalog/HotelFilters'
import { HotelSearch } from '@/presentation/components/catalog/HotelSearch'
import { Button } from '@/presentation/components/ui/button'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/presentation/components/ui/pagination'
import {
  createCatalogInitialState,
  defaultCatalogFilters,
} from '@/presentation/store/catalog.store'

function getVisiblePages(currentPage: number, totalPages: number) {
  const pages = new Set<number>()
  pages.add(1)
  pages.add(totalPages)
  pages.add(currentPage)
  pages.add(currentPage - 1)
  pages.add(currentPage + 1)
  return Array.from(pages)
    .filter((p) => p >= 1 && p <= totalPages)
    .sort((a, b) => a - b)
}

export default function HotelsCatalogPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [state, setState] = useState(() => {
    const initial = createCatalogInitialState()
    const search = searchParams.get('search')?.trim()

    return search
      ? {
          ...initial,
          filters: {
            ...initial.filters,
            search,
          },
        }
      : initial
  })
  const { filters } = state

  const { data, error, isPending, refetch } = useQuery({
    queryKey: ['hotels', 'catalog', filters],
    queryFn: () =>
      hotelCatalogUseCase.list({
        page: filters.page,
        pageSize: filters.pageSize,
        search: filters.search,
        stars: filters.stars,
        pets: filters.pets,
        status: filters.status,
        ordering: filters.ordering,
      }),
  })

  const totalPages = data ? Math.max(1, Math.ceil(data.count / filters.pageSize)) : 1

  const visiblePages = useMemo(
    () => getVisiblePages(filters.page, totalPages),
    [filters.page, totalPages],
  )

  function updateFilters(patch: Partial<typeof filters>) {
    setState((current) => ({
      ...current,
      filters: { ...current.filters, ...patch },
    }))
  }

  function handleViewHotel(hotel: HotelPreview) {
    navigate(`/hoteles/${hotel.id}`)
  }

  function handleReserve(hotel: HotelPreview) {
    const destination = `/reserva/seleccion?hotel=${hotel.id}`
    if (!localTokenStorage.getAccessToken()) {
      navigate('/login', { state: { from: destination } })
      return
    }
    navigate(destination)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">

      {/* Page hero */}
      <header className="relative overflow-hidden rounded-3xl border border-primary/15 bg-card p-8 shadow-sm sm:p-10">
        {/* Accent bar */}
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-violet-500 to-fuchsia-400" />
        {/* Blobs */}
        <div className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-primary/8 blur-3xl dark:bg-primary/12" />
        <div className="pointer-events-none absolute -left-16 -bottom-16 size-64 rounded-full bg-violet-400/8 blur-3xl dark:bg-violet-500/12" />

        <div className="relative z-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-4 py-2 text-sm font-semibold text-primary dark:bg-primary/12">
            <Sparkles className="size-4" />
            Catálogo StayBooking
          </span>

          <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Encuentra tu hotel ideal
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Explora y compara entre nuestras mejores opciones disponibles, con datos actualizados en tiempo real.
          </p>
        </div>
      </header>

      {/* Filtros */}
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
        <div className="grid gap-6">
          <HotelSearch
            value={filters.search}
            onChange={(value) => updateFilters({ search: value, page: 1 })}
          />

          <div className="border-t border-border pt-5">
            <HotelFilters
              stars={filters.stars}
              pets={filters.pets}
              status={filters.status}
              onStarsChange={(stars) => updateFilters({ stars, page: 1 })}
              onPetsChange={(pets) => updateFilters({ pets, page: 1 })}
              onStatusChange={(status) => updateFilters({ status, page: 1 })}
            />
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-5">
          <p className="text-sm font-semibold text-muted-foreground">
            {data
              ? `Mostrando ${data.results.length} de ${data.count} hoteles`
              : 'Preparando consulta...'}
          </p>

          <div className="flex gap-2.5">
            <Button
              variant="outline"
              onClick={() => setState({ filters: { ...defaultCatalogFilters } })}
              className="rounded-xl border-border bg-background text-sm font-semibold text-foreground hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
            >
              Limpiar filtros
            </Button>

            <Button
              variant="outline"
              onClick={() => { void refetch() }}
              className="rounded-xl border-border bg-background text-sm font-semibold text-foreground hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
            >
              Refrescar
            </Button>
          </div>
        </div>
      </div>

      {/* Skeletons */}
      {isPending && (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: filters.pageSize }).map((_, i) => (
            <HotelCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Error */}
      {error && !isPending && (
        <ErrorState
          message={error.message}
          onRetry={() => { void refetch() }}
        />
      )}

      {/* Empty */}
      {!isPending && !error && data && data.results.length === 0 && (
        <div className="rounded-2xl border border-dashed border-border bg-card p-2">
          <EmptyState
            title="No hay hoteles para mostrar"
            description="Prueba con otros filtros o vuelve a ver todos los hoteles."
          />
          <div className="flex justify-center pb-6">
            <Button
              variant="outline"
              onClick={() => setState({ filters: { ...defaultCatalogFilters } })}
              className="rounded-xl border-border bg-background font-semibold text-foreground hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
            >
              Ver todos los hoteles
            </Button>
          </div>
        </div>
      )}

      {/* Grid de hoteles */}
      {!isPending && !error && data && data.results.length > 0 && (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {data.results.map((hotel) => (
              <HotelCard
                key={hotel.id}
                hotel={hotel}
                onViewHotel={handleViewHotel}
                onReserve={handleReserve}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center pt-2">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      text="Anterior"
                      className={filters.page <= 1 ? 'pointer-events-none opacity-40' : ''}
                      onClick={(e) => {
                        e.preventDefault()
                        updateFilters({ page: Math.max(1, filters.page - 1) })
                      }}
                    />
                  </PaginationItem>

                  {visiblePages.map((pageNumber, index) => {
                    const prev = visiblePages[index - 1]
                    const showEllipsis = prev && pageNumber - prev > 1

                    return (
                      <PaginationItem key={pageNumber}>
                        {showEllipsis && <PaginationEllipsis />}
                        <PaginationLink
                          href="#"
                          isActive={pageNumber === filters.page}
                          onClick={(e) => {
                            e.preventDefault()
                            updateFilters({ page: pageNumber })
                          }}
                        >
                          {pageNumber}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  })}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      text="Siguiente"
                      className={filters.page >= totalPages ? 'pointer-events-none opacity-40' : ''}
                      onClick={(e) => {
                        e.preventDefault()
                        updateFilters({ page: Math.min(totalPages, filters.page + 1) })
                      }}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}
    </div>
  )
}
