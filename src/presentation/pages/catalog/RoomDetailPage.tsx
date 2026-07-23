import { useEffect } from 'react'
import {
  useNavigate,
  useParams,
} from 'react-router-dom'

import BedList from '@/presentation/components/room/BedList'
import ReferencePrice from '@/presentation/components/room/ReferencePrice'
import RoomCapacity from '@/presentation/components/room/RoomCapacity'
import RoomAvailabilityCalendar from '@/presentation/components/room/RoomAvailabilityCalendar'
import RoomGallery from '@/presentation/components/room/RoomGallery'
import ServiceList from '@/presentation/components/room/ServiceList'


import { Button } from '@/presentation/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/presentation/components/ui/card'
import { Separator } from '@/presentation/components/ui/separator'
import { useRoomCatalogStore } from '@/presentation/store/room-catalog.store'

export default function RoomDetailPage() {
  const { roomId } = useParams()
  const navigate = useNavigate()

  const rooms = useRoomCatalogStore(
    (state) => state.rooms,
  )
  const images = useRoomCatalogStore(
    (state) => state.images,
  )
  const beds = useRoomCatalogStore(
    (state) => state.beds,
  )
  const roomTypeBeds = useRoomCatalogStore(
    (state) => state.roomTypeBeds,
  )
  const services = useRoomCatalogStore(
    (state) => state.services,
  )
  const roomTypeServices = useRoomCatalogStore(
    (state) => state.roomTypeServices,
  )
  const rates = useRoomCatalogStore(
    (state) => state.rates,
  )
  const isLoading = useRoomCatalogStore(
    (state) => state.isLoading,
  )
  const error = useRoomCatalogStore(
    (state) => state.error,
  )
  const loadCatalog = useRoomCatalogStore(
    (state) => state.loadCatalog,
  )
  const clearCatalog = useRoomCatalogStore(
    (state) => state.clearCatalog,
  )

  const parsedRoomId = Number(roomId)

  const hasValidRoomId =
    Number.isInteger(parsedRoomId) &&
    parsedRoomId > 0

  const room = rooms.find(
    (item) => item.id === parsedRoomId,
  )

  const roomImages = images.filter(
    (image) => image.habitacion === parsedRoomId,
  )

  useEffect(() => {
    if (!hasValidRoomId) {
      clearCatalog()
      return
    }

    void loadCatalog()

    return () => {
      clearCatalog()
    }
  }, [
    clearCatalog,
    hasValidRoomId,
    loadCatalog,
  ])

  if (!hasValidRoomId) {
    return (
      <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-2xl border bg-card p-8 text-center shadow-sm">
          <h1 className="text-2xl font-semibold">
            Habitación no válida
          </h1>

          <p className="mt-3 text-muted-foreground">
            El identificador de la habitación no es
            correcto.
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
            Cargando información de la habitación...
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
            No se pudo cargar la habitación
          </h1>

          <p className="mt-3 text-muted-foreground">
            {error}
          </p>

          <Button
            type="button"
            className="mt-6"
            onClick={() => {
              void loadCatalog()
            }}
          >
            Intentar nuevamente
          </Button>
        </div>
      </main>
    )
  }

  if (!room) {
    return (
      <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-2xl border bg-card p-8 text-center shadow-sm">
          <h1 className="text-2xl font-semibold">
            Habitación no encontrada
          </h1>

          <p className="mt-3 text-muted-foreground">
            No existe información para la habitación
            solicitada.
          </p>
        </div>
      </main>
    )
  }

  const handleContinueToBooking = (
    checkIn?: string,
    checkOut?: string,
  ) => {
    const params = new URLSearchParams({
      hotel: String(room.hotel),
    })

    if (checkIn && checkOut) {
      params.set('checkIn', checkIn)
      params.set('checkOut', checkOut)
    }

    navigate(`/reserva/seleccion?${params}`)
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="space-y-8">
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-tr from-slate-950 via-[#1d1b3c] to-slate-900 p-8 text-white shadow-xl sm:p-10 border border-white/5">
          <div className="absolute -right-16 -top-16 size-64 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
          <div className="absolute -left-16 -bottom-16 size-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-bold text-primary uppercase tracking-wider">
                Hotel #{room.hotel}
              </p>

              <h1 className="mt-1.5 text-3xl font-extrabold tracking-tight sm:text-4xl bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
                Habitación {room.numero}
              </h1>

              <p className="mt-2 text-sm font-semibold text-slate-350">
                Ubicada en el Piso {room.piso}
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5">
              <span className="rounded-full bg-primary/20 border border-primary/30 px-3.5 py-1 text-xs font-bold text-white uppercase tracking-wider">
                {room.estado}
              </span>

              <span className="rounded-full bg-white/10 border border-white/10 px-3.5 py-1 text-xs font-bold text-white uppercase tracking-wider">
                {room.es_fumador
                  ? '🚬 Permite fumar'
                  : '🚫 No fumadores'}
              </span>
            </div>
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
          <div className="space-y-8">
            <RoomGallery
              images={roomImages}
              roomNumber={room.numero}
            />

            <Card className="rounded-3xl border border-slate-200/60 bg-card shadow-sm dark:border-zinc-800/60 overflow-hidden">
              <CardHeader className="p-6 pb-4">
                <CardTitle className="text-xl font-bold text-foreground">
                  Información de la habitación
                </CardTitle>
              </CardHeader>

              <CardContent className="p-6 pt-0 space-y-6">
                <div>
                  <h2 className="text-sm font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider">
                    Descripción
                  </h2>

                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground font-medium">
                    {room.descripcion ||
                      'Esta habitación no tiene una descripción registrada.'}
                  </p>
                </div>

                <Separator className="border-slate-100 dark:border-zinc-850" />

                <RoomCapacity
                  roomTypeId={room.tipo_habitacion}
                  beds={beds}
                  roomTypeBeds={roomTypeBeds}
                />

                <Separator className="border-slate-100 dark:border-zinc-850" />

                <BedList
                  roomTypeId={room.tipo_habitacion}
                  beds={beds}
                  roomTypeBeds={roomTypeBeds}
                />

                {room.observaciones && (
                  <>
                    <Separator className="border-slate-100 dark:border-zinc-850" />

                    <div>
                      <h2 className="text-sm font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider">
                        Observaciones
                      </h2>

                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground font-medium">
                        {room.observaciones}
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card
              id="availability-calendar"
              className="rounded-3xl border border-slate-200/60 bg-card shadow-sm dark:border-zinc-800/60"
            >
              <CardHeader className="p-6 pb-2">
                <CardTitle className="text-xl font-bold">
                  Elige tus fechas
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Consulta la disponibilidad real antes de continuar.
                </p>
              </CardHeader>
              <CardContent className="p-6 pt-2">
                <RoomAvailabilityCalendar
                  roomId={room.id}
                  hotelId={room.hotel}
                  onRangeSelected={(checkIn, checkOut) =>
                    handleContinueToBooking(checkIn, checkOut)}
                />
              </CardContent>
            </Card>

            <ServiceList
              roomTypeId={room.tipo_habitacion}
              services={services}
              roomTypeServices={roomTypeServices}
            />
          </div>

          <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
            <ReferencePrice
              roomTypeId={room.tipo_habitacion}
              rates={rates}
            />

            <Card className="rounded-3xl border border-slate-200/60 bg-card shadow-sm dark:border-zinc-800/60 overflow-hidden">
              <CardContent className="p-6 space-y-5">
                <div>
                  <h2 className="text-base font-bold text-foreground">
                    ¿Deseas reservar?
                  </h2>

                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground font-medium">
                  Selecciona las fechas en el calendario para preparar tu reserva.
                  </p>
                </div>

                <Button
                  type="button"
                  className="w-full rounded-xl bg-gradient-to-r from-primary to-[#d70466] font-bold text-sm text-white hover:opacity-90 transition-all duration-200 active:scale-95 shadow-md shadow-primary/15 h-11 cursor-pointer"
                  onClick={() =>
                    document
                      .getElementById('availability-calendar')
                      ?.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center',
                      })}
                >
                  Ver disponibilidad
                </Button>
              </CardContent>
            </Card>
          </aside>
        </section>
      </div>
    </main>
  )
}