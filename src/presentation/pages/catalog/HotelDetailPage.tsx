import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { CheckCircle2, Sparkles } from 'lucide-react'

import HotelHeader from '@/presentation/components/hotel/HotelHeader'
import HotelInformation from '@/presentation/components/hotel/HotelInformation'
import { useHotelDetailStore } from '@/presentation/store/hotel-detail.store'

export default function HotelDetailPage() {
  const { hotelId } = useParams()

  const hotel = useHotelDetailStore(
    (state) => state.hotel,
  )
  const address = useHotelDetailStore(
    (state) => state.address,
  )
  const isLoading = useHotelDetailStore(
    (state) => state.isLoading,
  )
  const error = useHotelDetailStore(
    (state) => state.error,
  )
  const loadHotelDetail = useHotelDetailStore(
    (state) => state.loadHotelDetail,
  )
  const clearHotelDetail = useHotelDetailStore(
    (state) => state.clearHotelDetail,
  )

  const parsedHotelId = Number(hotelId)
  const hasValidHotelId =
    Number.isInteger(parsedHotelId) &&
    parsedHotelId > 0

  useEffect(() => {
    if (!hasValidHotelId) {
      clearHotelDetail()
      return
    }

    void loadHotelDetail(parsedHotelId)

    return () => {
      clearHotelDetail()
    }
  }, [
    clearHotelDetail,
    hasValidHotelId,
    loadHotelDetail,
    parsedHotelId,
  ])

  if (!hasValidHotelId) {
    return (
      <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-2xl border bg-card p-8 text-center shadow-sm">
          <h1 className="text-2xl font-semibold">
            Hotel no válido
          </h1>

          <p className="mt-3 text-muted-foreground">
            El identificador del hotel no es correcto.
          </p>
        </div>
      </main>
    )
  }

  if (isLoading) {
    return (
      <main className="mx-auto flex min-h-[60vh] w-full max-w-7xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-muted border-t-primary" />

          <p className="mt-4 text-muted-foreground">
            Cargando información del hotel...
          </p>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-8 text-center">
          <h1 className="text-2xl font-semibold text-destructive">
            No se pudo cargar el hotel
          </h1>

          <p className="mt-3 text-muted-foreground">
            {error}
          </p>

          <button
            type="button"
            onClick={() => {
              void loadHotelDetail(parsedHotelId)
            }}
            className="mt-6 rounded-lg bg-primary px-5 py-2.5 font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Intentar nuevamente
          </button>
        </div>
      </main>
    )
  }

  if (!hotel) {
    return (
      <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-2xl border bg-card p-8 text-center shadow-sm">
          <h1 className="text-2xl font-semibold">
            Hotel no encontrado
          </h1>

          <p className="mt-3 text-muted-foreground">
            No existe información para este hotel.
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="space-y-8">
        <HotelHeader hotel={hotel} />

        <HotelInformation
          hotel={hotel}
          address={address}
        />

        {hotel.galeria && (
          <section className="overflow-hidden rounded-3xl border border-border bg-card p-5 shadow-sm">
            <div className="mb-4">
              <h2 className="text-2xl font-semibold text-foreground">Descubre el hotel</h2>
              <p className="mt-1 text-muted-foreground">
                Espacios reales para una reserva con confianza.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {hotel.galeria.imagenes.slice(0, 3).map((media) => (
                <img
                  key={media.id}
                  src={media.archivo_url}
                  alt={media.titulo}
                  className="h-52 w-full rounded-2xl object-cover transition-transform duration-500 hover:scale-[1.02]"
                />
              ))}
              {hotel.galeria.videos.slice(0, 1).map((media) => (
                <video
                  key={media.id}
                  className="h-52 w-full rounded-2xl object-cover"
                  controls
                  muted
                  playsInline
                  src={media.archivo_url}
                />
              ))}
            </div>
          </section>
        )}

        {hotel.temporadas && hotel.temporadas.length > 0 && (
          <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-foreground">Temporadas disponibles</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              {hotel.temporadas.map((season) => (
                <Link
                  key={season.id}
                  to={`/reserva/seleccion?hotel=${hotel.id}`}
                  className="rounded-xl border border-primary/25 bg-primary/5 px-4 py-3 text-sm font-semibold text-foreground transition hover:bg-primary hover:text-primary-foreground"
                >
                  {season.nombre} · {season.fecha_inicio} a {season.fecha_fin}
                </Link>
              ))}
            </div>
          </section>
        )}

        {hotel.habitaciones && hotel.habitaciones.length > 0 && (
          <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-primary">
                  Alojamiento
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-foreground">
                  Habitaciones del hotel
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Elige la habitación que mejor se adapta a tu estancia.
                </p>
              </div>
              <span className="rounded-full bg-primary/10 px-3 py-1.5 text-sm font-semibold text-primary">
                {hotel.habitaciones.length} disponibles
              </span>
            </div>
            <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {hotel.habitaciones.map((room) => (
                <article
                  key={room.id}
                  className="group overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg"
                >
                  {room.imagen_principal ? (
                    <img src={room.imagen_principal} alt={`Habitación ${room.numero}`} className="h-48 w-full object-cover transition duration-500 group-hover:scale-105" />
                  ) : (
                    <div className="flex h-48 items-center justify-center bg-muted p-6 text-center text-sm text-muted-foreground">Esta habitación aún no tiene una imagen cargada.</div>
                  )}
                  <div className="p-5">
                    <p className="text-sm text-primary">Habitación {room.numero} · Piso {room.piso}</p>
                    <h3 className="mt-1 text-lg font-semibold text-foreground">{room.tipo_habitacion_nombre}</h3>
                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{room.descripcion}</p>
                    <p className="mt-3 text-sm text-muted-foreground">
                      {room.capacidad_total} incluidos · {room.capacidad_extra} extra · máximo {room.capacidad_maxima}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {room.servicios.filter((service) => service.incluido).slice(0, 2).map((service) => (
                        <span key={service.id} className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                          {service.servicio_nombre}
                        </span>
                      ))}
                    </div>
                    <div className="mt-5 flex gap-3">
                      <Link
                        to={`/habitaciones/${room.id}`}
                        className="rounded-xl border border-border px-3 py-2 text-sm font-semibold text-foreground transition hover:border-primary/40 hover:text-primary"
                      >
                        Ver habitación
                      </Link>
                      <Link
                        to={`/reserva/seleccion?hotel=${hotel.id}`}
                        className="rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
                      >
                        Reservar
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {hotel.servicios && hotel.servicios.length > 0 && (
          <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-foreground">
              Servicios del hotel
            </h2>
            <p className="mt-1 text-muted-foreground">
              Comodidades y experiencias disponibles durante tu estancia.
            </p>
            {[
              {
                title: 'Servicios incluidos',
                description: 'Disfrútalos sin costo adicional en habitaciones compatibles.',
                services: hotel.servicios.filter(
                  (service) => service.incluido_en_alguna_habitacion,
                ),
                badge: 'Incluido',
              },
              {
                title: 'Extras disponibles',
                description: 'Agrega experiencias opcionales durante tu reserva.',
                services: hotel.servicios.filter(
                  (service) => !service.incluido_en_alguna_habitacion,
                ),
                badge: 'Servicio extra',
              },
            ].map((group) => group.services.length > 0 && (
              <div key={group.title} className="mt-7">
                <h3 className="font-semibold text-foreground">{group.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{group.description}</p>
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {group.services.map((service) => (
                    <article
                      key={service.id}
                      className="group overflow-hidden rounded-2xl border bg-card shadow-sm transition hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg"
                    >
                      {service.imagen_url ? (
                        <div className="relative h-40 overflow-hidden">
                          <img
                            src={service.imagen_url}
                            alt={service.nombre}
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                          <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full bg-card/90 px-2.5 py-1 text-xs font-bold text-foreground backdrop-blur">
                            {group.badge === 'Incluido'
                              ? <CheckCircle2 className="size-3.5 text-primary" />
                              : <Sparkles className="size-3.5 text-primary" />}
                            {group.badge}
                          </span>
                        </div>
                      ) : (
                        <div className="relative flex h-40 flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-primary/20 via-primary/5 to-muted text-center">
                          <div className="absolute -right-6 -top-6 size-24 rounded-full bg-primary/15 blur-2xl" />
                          <div className="relative flex size-12 items-center justify-center rounded-2xl bg-card/80 text-primary shadow-sm">
                            <Sparkles className="size-6" />
                          </div>
                          <span className="relative mt-2 text-xs font-semibold text-muted-foreground">
                            Imagen del servicio
                          </span>
                        </div>
                      )}
                      <div className="p-4">
                        <p className="text-xs font-bold uppercase tracking-wide text-primary">
                          {service.tipo_servicio || group.badge}
                          {group.badge === 'Servicio extra' ? ` · ${service.precio_extra}` : ''}
                        </p>
                        <h4 className="mt-2 font-semibold text-foreground">{service.nombre}</h4>
                        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{service.descripcion}</p>
                        <p className="mt-3 line-clamp-1 text-xs text-muted-foreground">
                          {service.tipos_habitacion_compatibles
                            .map((roomType) => roomType.tipo_habitacion_nombre)
                            .join(', ')}
                        </p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          <Link
                            to={`/servicios/${service.id}`}
                            className="inline-flex rounded-xl border border-border px-3 py-2 text-sm font-semibold text-foreground transition hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
                          >
                            Ver servicio
                          </Link>
                          {group.badge === 'Servicio extra' && (
                            <Link
                              to={`/reserva/seleccion?hotel=${hotel.id}`}
                              className="inline-flex rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-90"
                            >
                              Agregar a la reserva
                            </Link>
                          )}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ))}
          </section>
        )}

      </div>
    </main>
  )
}