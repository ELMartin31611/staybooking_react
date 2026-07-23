import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import {
  Car,
  Coffee,
  Dumbbell,
  Search,
  ShieldCheck,
  Sparkles,
  UtensilsCrossed,
  Waves,
  Wifi,
} from 'lucide-react'

import type { Service } from '@/domain/entities/service.entity'
import { createRoomCatalogUseCase } from '@/infrastructure/factories/room-catalog.factory'
import {
  EmptyState,
  ErrorState,
  Loader,
} from '@/presentation/components/common'
import { Badge } from '@/presentation/components/ui/badge'
import { Input } from '@/presentation/components/ui/input'

const roomCatalogUseCase = createRoomCatalogUseCase()

const serviceIcons = {
  transporte: Car,
  alimentacion: UtensilsCrossed,
  alimentación: UtensilsCrossed,
  restaurante: UtensilsCrossed,
  bienestar: Waves,
  spa: Waves,
  gimnasio: Dumbbell,
  internet: Wifi,
  wifi: Wifi,
  desayuno: Coffee,
} as const

function getServiceIcon(service: Service) {
  const searchableText = `${service.tipo_servicio} ${service.nombre}`
    .trim()
    .toLowerCase()

  const entry = Object.entries(serviceIcons).find(([keyword]) =>
    searchableText.includes(keyword),
  )

  return entry?.[1] ?? Sparkles
}

function formatPrice(value: string): string {
  const amount = Number(value)

  if (!Number.isFinite(amount) || amount <= 0) {
    return 'Incluido'
  }

  return new Intl.NumberFormat('es-EC', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

export default function ServicesPage() {
  const [search, setSearch] = useState('')
  const [type, setType] = useState('todos')

  const servicesQuery = useQuery({
    queryKey: ['catalog', 'services'],
    queryFn: () => roomCatalogUseCase.getServices(),
    staleTime: 60_000,
  })

  const activeServices = useMemo(
    () => (servicesQuery.data ?? []).filter((service) => service.is_active),
    [servicesQuery.data],
  )

  const types = useMemo(
    () => Array.from(
      new Set(
        activeServices
          .map((service) => service.tipo_servicio.trim())
          .filter(Boolean),
      ),
    ).sort((a, b) => a.localeCompare(b, 'es')),
    [activeServices],
  )

  const filteredServices = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    return activeServices.filter((service) => {
      const matchesType =
        type === 'todos'
        || service.tipo_servicio === type
      const matchesSearch =
        normalizedSearch === ''
        || service.nombre.toLowerCase().includes(normalizedSearch)
        || service.descripcion.toLowerCase().includes(normalizedSearch)

      return matchesType && matchesSearch
    })
  }, [activeServices, search, type])

  return (
    <div className="min-h-screen bg-background pb-16 transition-colors duration-300">
      <section className="relative overflow-hidden border-b border-border bg-slate-950 py-20 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,0,85,0.32),transparent_42%),radial-gradient(circle_at_bottom_right,rgba(124,58,237,0.28),transparent_38%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:4rem_4rem]" />

        <div className="relative z-10 mx-auto max-w-4xl space-y-6 px-4 text-center sm:px-6 lg:px-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/15 px-4 py-2 text-xs font-extrabold uppercase tracking-widest backdrop-blur">
            <Sparkles className="size-4 text-primary" />
            Servicios reales de StayBooking
          </span>

          <h1 className="text-4xl font-black tracking-tight sm:text-6xl">
            Comodidad en cada detalle
          </h1>

          <p className="mx-auto max-w-2xl text-base font-medium leading-relaxed text-slate-300 sm:text-lg">
            Consulta las prestaciones registradas en nuestros hoteles y revisa
            cuáles están incluidas o tienen un valor adicional.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-5 pt-2 text-sm font-semibold text-slate-200">
            <span className="flex items-center gap-2">
              <ShieldCheck className="size-5 text-emerald-400" />
              Información del backend
            </span>
            <span className="flex items-center gap-2">
              <Wifi className="size-5 text-sky-400" />
              Servicios actualizados
            </span>
            <span className="flex items-center gap-2">
              <Waves className="size-5 text-violet-400" />
              Experiencias para tu estancia
            </span>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl space-y-8 px-4 pt-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 rounded-3xl border border-border bg-card p-5 shadow-sm lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setType('todos')}
              className={
                type === 'todos'
                  ? 'rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground shadow-md shadow-primary/20'
                  : 'rounded-xl border border-border bg-background px-4 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-accent hover:text-foreground'
              }
            >
              Todos
            </button>

            {types.map((serviceType) => (
              <button
                key={serviceType}
                type="button"
                onClick={() => setType(serviceType)}
                className={
                  type === serviceType
                    ? 'rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground shadow-md shadow-primary/20'
                    : 'rounded-xl border border-border bg-background px-4 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-accent hover:text-foreground'
                }
              >
                {serviceType}
              </button>
            ))}
          </div>

          <div className="relative w-full lg:max-w-sm">
            <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar un servicio..."
              className="h-11 rounded-xl pl-10"
            />
          </div>
        </div>

        {servicesQuery.isPending && (
          <Loader message="Cargando servicios..." />
        )}

        {servicesQuery.isError && (
          <ErrorState
            title="No pudimos cargar los servicios"
            message="Comprueba tu conexión e inténtalo nuevamente."
            onRetry={() => {
              void servicesQuery.refetch()
            }}
          />
        )}

        {!servicesQuery.isPending
          && !servicesQuery.isError
          && filteredServices.length === 0 && (
            <EmptyState
              title="No encontramos servicios"
              description="Prueba con otra búsqueda o categoría."
            />
          )}

        {!servicesQuery.isPending
          && !servicesQuery.isError
          && filteredServices.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filteredServices.map((service) => {
                const Icon = getServiceIcon(service)
                const price = formatPrice(service.precio_extra)

                return (
                  <article
                    key={service.id}
                    className="group relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10"
                  >
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-fuchsia-500 to-violet-500" />

                    <div className="flex items-start justify-between gap-4">
                      {service.imagen_url ? (
                        <img
                          src={service.imagen_url}
                          alt={service.nombre}
                          className="h-20 w-28 rounded-2xl object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                        />
                      ) : (
                        <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
                          <Icon className="size-7" />
                        </div>
                      )}
                      <Badge
                        variant={price === 'Incluido' ? 'secondary' : 'outline'}
                        className="rounded-full"
                      >
                        {price}
                      </Badge>
                    </div>

                    <div className="mt-6 space-y-3">
                      <p className="text-xs font-extrabold uppercase tracking-widest text-primary">
                        {service.tipo_servicio || 'Servicio'}
                      </p>
                      <h2 className="text-xl font-black tracking-tight text-foreground">
                        {service.nombre}
                      </h2>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {service.descripcion || 'Servicio disponible para huéspedes de StayBooking.'}
                      </p>
                    </div>

                    <Link
                      to={`/servicios/${service.id}`}
                      className="mt-5 inline-flex rounded-xl border border-border px-3 py-2 text-sm font-semibold text-foreground transition hover:border-primary/40 hover:text-primary"
                    >
                      Ver servicio
                    </Link>
                  </article>
                )
              })}
            </div>
          )}
      </main>
    </div>
  )
}
