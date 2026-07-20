import { useState } from 'react'
import { Search } from 'lucide-react'
import {
  Link,
  useSearchParams,
} from 'react-router-dom'

import type { RateReference } from '@/domain/entities/rate-reference.entity'
import type { Room } from '@/domain/entities/room.entity'
import { ApiException } from '@/domain/exceptions/api.exception'
import { availabilityUseCase } from '@/infrastructure/factories/availability.factory'
import { rateReferenceUseCase } from '@/infrastructure/factories/rate-reference.factory'
import AvailableRoomCard from '@/presentation/components/reservations/AvailableRoomCard'
import BookingCartSummary from '@/presentation/components/reservations/BookingCartSummary'
import SelectedRoomCard from '@/presentation/components/reservations/SelectedRoomCard'
import {
  Alert,
  AlertDescription,
} from '@/presentation/components/ui/alert'
import { Button } from '@/presentation/components/ui/button'
import {
  Card,
  CardContent,
} from '@/presentation/components/ui/card'
import { Input } from '@/presentation/components/ui/input'
import { Label } from '@/presentation/components/ui/label'
import { useBookingCartStore } from '@/presentation/store/booking-cart.store'

function getLocalDate(
  daysFromToday = 0,
): string {
  const date = new Date()

  date.setDate(
    date.getDate() + daysFromToday,
  )

  const timezoneOffset =
    date.getTimezoneOffset()

  return new Date(
    date.getTime() - timezoneOffset * 60_000,
  )
    .toISOString()
    .slice(0, 10)
}

function findRoomRate(
  room: Room,
  rates: RateReference[],
  checkIn: string,
): RateReference | undefined {
  return rates.find(
    (rate) =>
      rate.tipo_habitacion
        === room.tipo_habitacion
      && rate.is_active
      && rate.temporada_fecha_inicio
        <= checkIn
      && rate.temporada_fecha_fin
        >= checkIn,
  )
}

function getRatePrice(
  rate: RateReference | undefined,
): number | null {
  if (!rate) {
    return null
  }

  const value =
    rate.precio_aplicable
    || rate.precio_noche

  const amount = Number(value)

  if (
    !Number.isFinite(amount)
    || amount <= 0
  ) {
    return null
  }

  return amount
}

export default function SelectedRoomsPage() {
  const [searchParams] = useSearchParams()

  const [availableRooms, setAvailableRooms] =
    useState<Room[] | null>(null)
  const [rates, setRates] =
    useState<RateReference[]>([])
  const [isSearching, setIsSearching] =
    useState(false)
  const [isChecking, setIsChecking] =
    useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] =
    useState('')

  const {
    selections,
    summary,
    checkIn,
    checkOut,
    addSelection,
    removeSelection,
    updateQuantity,
    setDates,
    clearCart,
  } = useBookingCartStore()

  const queryHotelId = Number(
    searchParams.get('hotel'),
  )

  const selectedHotelId =
    selections[0]?.hotelId ?? 0

  const activeHotelId =
    Number.isInteger(queryHotelId)
    && queryHotelId > 0
      ? queryHotelId
      : selectedHotelId

  function resetMessages() {
    setError('')
    setSuccessMessage('')
  }

  function handleDateChange(
    newCheckIn: string,
    newCheckOut: string,
  ) {
    resetMessages()
    setAvailableRooms(null)
    setRates([])
    setDates(newCheckIn, newCheckOut)
  }

  async function handleSearchAvailability() {
    resetMessages()

    if (
      !Number.isInteger(activeHotelId)
      || activeHotelId <= 0
    ) {
      setError(
        'Selecciona un hotel antes de buscar habitaciones.',
      )
      return
    }

    try {
      setIsSearching(true)

      const [
        roomsResponse,
        ratesResponse,
      ] = await Promise.all([
        availabilityUseCase
          .getAvailableRooms({
            hotel: activeHotelId,
            fecha_entrada: checkIn,
            fecha_salida: checkOut,
          }),

        rateReferenceUseCase.getRates(),
      ])

      setAvailableRooms(roomsResponse)
      setRates(ratesResponse)

      if (roomsResponse.length === 0) {
        setError(
          'No existen habitaciones disponibles para esas fechas. Prueba con otras fechas.',
        )
        return
      }

      setSuccessMessage(
        `Encontramos ${roomsResponse.length} habitación(es) disponible(s).`,
      )
    } catch (caughtError: unknown) {
      if (caughtError instanceof ApiException) {
        setError(caughtError.message)
      } else if (caughtError instanceof Error) {
        setError(caughtError.message)
      } else {
        setError(
          'No se pudieron buscar las habitaciones disponibles.',
        )
      }
    } finally {
      setIsSearching(false)
    }
  }

  function handleSelectRoom(room: Room) {
    resetMessages()

    const belongsToAnotherHotel =
      selections.length > 0
      && selections.some(
        (selection) =>
          selection.hotelId !== room.hotel,
      )

    if (belongsToAnotherHotel) {
      setError(
        'No puedes mezclar habitaciones de hoteles diferentes en una misma reserva.',
      )
      return
    }

    const rate = findRoomRate(
      room,
      rates,
      checkIn,
    )

    const pricePerNight =
      getRatePrice(rate)

    if (
      !rate
      || pricePerNight === null
    ) {
      setError(
        'Esta habitación no tiene una tarifa activa para la fecha seleccionada.',
      )
      return
    }

    addSelection({
      roomId: room.id,
      hotelId: room.hotel,
      roomTypeId:
        room.tipo_habitacion,
      roomNumber: room.numero,
      roomTypeName:
        room.tipo_habitacion_nombre
        || rate.tipo_habitacion_nombre,
      pricePerNight,
      imageUrl: null,
      quantity: 1,
    })

    setSuccessMessage(
      `Habitación ${room.numero} agregada a tu reserva.`,
    )
  }

  function handleRemoveRoom(
    roomId: number,
  ) {
    resetMessages()
    removeSelection(roomId)
  }

  function handleQuantityChange(
    roomId: number,
    quantity: number,
  ) {
    resetMessages()
    updateQuantity(
      roomId,
      quantity,
    )
  }

  function handleClearCart() {
    resetMessages()
    clearCart()
  }

  async function handleCheckSelectedRooms() {
    resetMessages()

    if (selections.length === 0) {
      setError(
        'Selecciona al menos una habitación.',
      )
      return
    }

    const selectedHotelIds = new Set(
      selections.map(
        (selection) => selection.hotelId,
      ),
    )

    if (selectedHotelIds.size !== 1) {
      setError(
        'Todas las habitaciones deben pertenecer al mismo hotel.',
      )
      return
    }

    const repeatedRooms =
      selections.filter(
        (selection) =>
          selection.quantity > 1,
      )

    if (repeatedRooms.length > 0) {
      setError(
        'Cada habitación física solo puede seleccionarse una vez. Usa cantidad 1.',
      )
      return
    }

    const hotelId =
      selections[0]?.hotelId

    if (!hotelId) {
      setError(
        'No se pudo identificar el hotel de la reserva.',
      )
      return
    }

    try {
      setIsChecking(true)

      const rooms =
        await availabilityUseCase
          .getAvailableRooms({
            hotel: hotelId,
            fecha_entrada: checkIn,
            fecha_salida: checkOut,
          })

      const availableIds = new Set(
        rooms.map((room) => room.id),
      )

      const unavailableSelections =
        selections.filter(
          (selection) =>
            !availableIds.has(
              selection.roomId,
            ),
        )

      if (
        unavailableSelections.length > 0
      ) {
        const roomNumbers =
          unavailableSelections
            .map(
              (selection) =>
                `habitación ${selection.roomNumber}`,
            )
            .join(', ')

        setError(
          `Ya no está disponible: ${roomNumbers}. Elimínala o cambia las fechas.`,
        )
        return
      }

      setSuccessMessage(
        'Las habitaciones seleccionadas siguen disponibles. Ya puedes continuar con los huéspedes.',
      )
    } catch (caughtError: unknown) {
      if (caughtError instanceof ApiException) {
        setError(caughtError.message)
      } else if (caughtError instanceof Error) {
        setError(caughtError.message)
      } else {
        setError(
          'No se pudo confirmar la disponibilidad.',
        )
      }
    } finally {
      setIsChecking(false)
    }
  }

  const hasValidHotel =
    Number.isInteger(activeHotelId)
    && activeHotelId > 0

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">
          Reserva segura
        </p>

        <h1 className="mt-2 text-3xl font-bold">
          Busca tu habitación
        </h1>

        <p className="mt-2 max-w-2xl text-muted-foreground">
          Selecciona las fechas para consultar
          cuáles habitaciones están realmente
          disponibles en el hotel.
        </p>
      </header>

      {!hasValidHotel ? (
        <section className="rounded-2xl border border-dashed bg-card px-6 py-16 text-center">
          <h2 className="text-2xl font-semibold">
            Selecciona un hotel
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Debes comenzar la reserva desde el
            catálogo o desde el detalle de un hotel.
          </p>

          <Button
            className="mt-6"
            asChild
          >
            <Link to="/hoteles">
              Explorar hoteles
            </Link>
          </Button>
        </section>
      ) : (
        <div className="space-y-8">
          <Card>
            <CardContent className="pt-6">
              <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end">
                <div className="space-y-2">
                  <Label htmlFor="check-in">
                    Fecha de entrada
                  </Label>

                  <Input
                    id="check-in"
                    type="date"
                    min={getLocalDate()}
                    max={getLocalDate(365)}
                    value={checkIn}
                    onChange={(event) =>
                      handleDateChange(
                        event.target.value,
                        checkOut,
                      )
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="check-out">
                    Fecha de salida
                  </Label>

                  <Input
                    id="check-out"
                    type="date"
                    min={
                      checkIn
                      || getLocalDate(1)
                    }
                    max={getLocalDate(395)}
                    value={checkOut}
                    onChange={(event) =>
                      handleDateChange(
                        checkIn,
                        event.target.value,
                      )
                    }
                  />
                </div>

                <Button
                  type="button"
                  onClick={
                    handleSearchAvailability
                  }
                  disabled={isSearching}
                >
                  <Search className="size-4" />

                  {isSearching
                    ? 'Buscando...'
                    : 'Buscar disponibles'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>
                {error}
              </AlertDescription>
            </Alert>
          )}

          {successMessage && (
            <Alert>
              <AlertDescription>
                {successMessage}
              </AlertDescription>
            </Alert>
          )}

          {availableRooms !== null && (
            <section>
              <div className="mb-5">
                <h2 className="text-2xl font-semibold">
                  Habitaciones disponibles
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Solo mostramos habitaciones que
                  el backend confirmó como libres.
                </p>
              </div>

              {availableRooms.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <p className="font-semibold">
                      No hay habitaciones disponibles
                    </p>

                    <p className="mt-2 text-sm text-muted-foreground">
                      Cambia las fechas e inténtalo
                      nuevamente.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {availableRooms.map((room) => {
                    const rate = findRoomRate(
                      room,
                      rates,
                      checkIn,
                    )

                    const pricePerNight =
                      getRatePrice(rate)

                    const isSelected =
                      selections.some(
                        (selection) =>
                          selection.roomId
                            === room.id,
                      )

                    return (
                      <AvailableRoomCard
                        key={room.id}
                        room={room}
                        pricePerNight={
                          pricePerNight
                        }
                        currency={
                          rate?.moneda ?? 'USD'
                        }
                        isSelected={
                          isSelected
                        }
                        onSelect={() =>
                          handleSelectRoom(room)
                        }
                      />
                    )
                  })}
                </div>
              )}
            </section>
          )}

          {selections.length > 0 && (
            <section>
              <div className="mb-5">
                <h2 className="text-2xl font-semibold">
                  Tu selección
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Revisa las habitaciones antes
                  de continuar.
                </p>
              </div>

              <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
                <div className="space-y-5">
                  {selections.map(
                    (selection) => (
                      <SelectedRoomCard
                        key={
                          selection.roomId
                        }
                        selection={
                          selection
                        }
                        onRemove={
                          handleRemoveRoom
                        }
                        onQuantityChange={
                          handleQuantityChange
                        }
                      />
                    ),
                  )}
                </div>

                <div className="lg:sticky lg:top-24 lg:self-start">
                  <BookingCartSummary
                    summary={summary}
                    onClear={
                      handleClearCart
                    }
                    onContinue={
                      handleCheckSelectedRooms
                    }
                    isChecking={
                      isChecking
                    }
                  />
                </div>
              </div>
            </section>
          )}
        </div>
      )}
    </main>
  )
}