import { useMemo, useState } from 'react'
import { Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
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

function getVisiblePages(
  currentPage: number,
  totalPages: number,
) {
  const pages = new Set<number>()

  pages.add(1)
  pages.add(totalPages)
  pages.add(currentPage)
  pages.add(currentPage - 1)
  pages.add(currentPage + 1)

  return Array.from(pages)
    .filter((page) => page >= 1 && page <= totalPages)
    .sort((a, b) => a - b)
}

export default function HotelsCatalogPage() {
  const navigate = useNavigate()
  const [state, setState] = useState(createCatalogInitialState)

  const { filters } = state

  const {
    data,
    error,
    isPending,
    refetch,
  } = useQuery({
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

  const totalPages = data
    ? Math.max(1, Math.ceil(data.count / filters.pageSize))
    : 1

  const visiblePages = useMemo(
    () => getVisiblePages(filters.page, totalPages),
    [filters.page, totalPages],
  )

  function updateFilters(
    patch: Partial<typeof filters>,
  ) {
    setState((current) => ({
      ...current,
      filters: {
        ...current.filters,
        ...patch,
      },
    }))
  }

  function handleViewHotel(hotel: HotelPreview) {
    navigate(`/hoteles/${hotel.id}`)
  }

  function handleReserve(hotel: HotelPreview) {
    const destination = `/reserva/seleccion?hotel=${hotel.id}`

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
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-3xl bg-gradient-to-br from-primary via-[#e31c5f] to-[#a30d43] p-8 text-white shadow-xl sm:p-10">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-medium backdrop-blur">
          <Sparkles className="size-4" />
          Catálogo StayBooking
        </span>

        <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">
          Encuentra hoteles por filtros y búsqueda
        </h1>
      </div>

      <div className="mt-8 rounded-2xl border bg-card p-5 shadow-sm">
        <div className="grid gap-4">
          <HotelSearch
            value={filters.search}
            onChange={(value) =>
              updateFilters({
                search: value,
                page: 1,
              })
            }
          />

          <HotelFilters
            stars={filters.stars}
            pets={filters.pets}
            status={filters.status}
            onStarsChange={(stars) =>
              updateFilters({ stars, page: 1 })
            }
            onPetsChange={(pets) =>
              updateFilters({ pets, page: 1 })
            }
            onStatusChange={(status) =>
              updateFilters({ status, page: 1 })
            }
          />
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t pt-4">
          <p className="text-sm text-muted-foreground">
            {data
              ? `Mostrando ${data.results.length} de ${data.count} hoteles`
              : 'Preparando consulta'}
          </p>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setState({
                  filters: { ...defaultCatalogFilters },
                })
              }}
            >
              Limpiar filtros
            </Button>

            <Button
              variant="outline"
              onClick={() => {
                void refetch()
              }}
            >
              Refrescar
            </Button>
          </div>
        </div>
      </div>

      {isPending && (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: filters.pageSize }).map((_, index) => (
            <HotelCardSkeleton key={index} />
          ))}
        </div>
      )}

      {error && !isPending && (
        <div className="mt-8">
          <ErrorState
            message={error.message}
            onRetry={() => {
              void refetch()
            }}
          />
        </div>
      )}

      {!isPending &&
        !error &&
        data &&
        data.results.length === 0 && (
          <div className="mt-8">
            <EmptyState
              title="No hay hoteles para mostrar"
              description="Prueba con otros filtros o limpia la búsqueda."
            />
          </div>
        )}

      {!isPending &&
        !error &&
        data &&
        data.results.length > 0 && (
          <>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
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
              <div className="mt-10 flex justify-center">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        text="Anterior"
                        className={
                          filters.page <= 1
                            ? 'pointer-events-none opacity-50'
                            : ''
                        }
                        onClick={(event) => {
                          event.preventDefault()
                          updateFilters({
                            page: Math.max(1, filters.page - 1),
                          })
                        }}
                      />
                    </PaginationItem>

                    {visiblePages.map((pageNumber, index) => {
                      const previousPage = visiblePages[index - 1]
                      const showEllipsis =
                        previousPage && pageNumber - previousPage > 1

                      return (
                        <PaginationItem key={pageNumber}>
                          {showEllipsis && <PaginationEllipsis />}

                          <PaginationLink
                            href="#"
                            isActive={pageNumber === filters.page}
                            onClick={(event) => {
                              event.preventDefault()
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
                        className={
                          filters.page >= totalPages
                            ? 'pointer-events-none opacity-50'
                            : ''
                        }
                        onClick={(event) => {
                          event.preventDefault()
                          updateFilters({
                            page: Math.min(totalPages, filters.page + 1),
                          })
                        }}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}
    </section>
  )
}
