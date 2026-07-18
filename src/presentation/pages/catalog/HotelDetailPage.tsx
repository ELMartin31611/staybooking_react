import { useEffect } from 'react'
import { useParams } from 'react-router-dom'

import HotelHeader from '@/presentation/components/hotel/HotelHeader'
import HotelInformation from '@/presentation/components/hotel/HotelInformation'
import RoomTypeCard from '@/presentation/components/hotel/RoomTypeCard'
import { useHotelDetailStore } from '@/presentation/store/hotel-detail.store'

export default function HotelDetailPage() {
  const { hotelId } = useParams()

  const hotel = useHotelDetailStore(
    (state) => state.hotel,
  )
  const address = useHotelDetailStore(
    (state) => state.address,
  )
  const roomTypes = useHotelDetailStore(
    (state) => state.roomTypes,
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

        <section>
          <div>
            <h2 className="text-2xl font-semibold">
              Tipos de habitación
            </h2>

            <p className="mt-2 text-muted-foreground">
              Conoce las opciones disponibles en este hotel.
            </p>
          </div>

          {roomTypes.length > 0 ? (
            <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {roomTypes.map((roomType) => (
                <RoomTypeCard
                  key={roomType.id}
                  roomType={roomType}
                />
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-2xl border border-dashed bg-muted/30 p-10 text-center">
              <h3 className="text-lg font-semibold">
                No hay tipos de habitación
              </h3>

              <p className="mt-2 text-muted-foreground">
                Este hotel todavía no tiene tipos de habitación publicados.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}