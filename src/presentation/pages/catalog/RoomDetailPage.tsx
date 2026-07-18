import { useEffect } from 'react'
import {
  useNavigate,
  useParams,
} from 'react-router-dom'

import BedList from '@/presentation/components/room/BedList'
import ReferencePrice from '@/presentation/components/room/ReferencePrice'
import RoomCapacity from '@/presentation/components/room/RoomCapacity'
import RoomGallery from '@/presentation/components/room/RoomGallery'
import ServiceList from '@/presentation/components/room/ServiceList'
import { Badge } from '@/presentation/components/ui/badge'
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

  const handleContinueToCart = () => {
    navigate('/cart', {
      state: {
        roomId: room.id,
        hotelId: room.hotel,
        roomTypeId: room.tipo_habitacion,
      },
    })
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="space-y-8">
        <section className="space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-medium text-primary">
                Hotel #{room.hotel}
              </p>

              <h1 className="mt-1 text-3xl font-bold tracking-tight">
                Habitación {room.numero}
              </h1>

              <p className="mt-2 text-muted-foreground">
                Piso {room.piso}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">
                {room.estado}
              </Badge>

              <Badge variant="outline">
                {room.es_fumador
                  ? 'Permite fumar'
                  : 'No fumadores'}
              </Badge>
            </div>
          </div>

          <Separator />
        </section>

        <section className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)]">
          <div className="space-y-8">
            <RoomGallery
              images={roomImages}
              roomNumber={room.numero}
            />

            <Card>
              <CardHeader>
                <CardTitle>
                  Información de la habitación
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-5">
                <div>
                  <h2 className="font-semibold">
                    Descripción
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {room.descripcion ||
                      'Esta habitación no tiene una descripción registrada.'}
                  </p>
                </div>

                <Separator />

                <RoomCapacity
                  roomTypeId={room.tipo_habitacion}
                  beds={beds}
                  roomTypeBeds={roomTypeBeds}
                />

                <Separator />

                <BedList
                  roomTypeId={room.tipo_habitacion}
                  beds={beds}
                  roomTypeBeds={roomTypeBeds}
                />

                {room.observaciones && (
                  <>
                    <Separator />

                    <div>
                      <h2 className="font-semibold">
                        Observaciones
                      </h2>

                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        {room.observaciones}
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <ServiceList
              roomTypeId={room.tipo_habitacion}
              services={services}
              roomTypeServices={roomTypeServices}
            />
          </div>

          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <ReferencePrice
              roomTypeId={room.tipo_habitacion}
              rates={rates}
            />

            <Card>
              <CardContent className="space-y-4 p-5">
                <div>
                  <h2 className="font-semibold">
                    ¿Deseas reservar?
                  </h2>

                  <p className="mt-2 text-sm text-muted-foreground">
                    Continúa para seleccionar esta
                    habitación y preparar tu reserva.
                  </p>
                </div>

                <Button
                  type="button"
                  className="w-full"
                  onClick={handleContinueToCart}
                >
                  Agregar al carrito
                </Button>
              </CardContent>
            </Card>
          </aside>
        </section>
      </div>
    </main>
  )
}