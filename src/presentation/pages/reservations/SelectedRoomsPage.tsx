import {
  BedDouble,
  Building2,
  CheckCircle2,
  Search,
  Users,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import {
  Link,
  useNavigate,
  useSearchParams,
} from 'react-router-dom'

import type { RateReference } from '@/domain/entities/rate-reference.entity'
import type { Room } from '@/domain/entities/room.entity'
import type { RoomTypeService } from '@/domain/entities/room-type-service.entity'
import type { Service } from '@/domain/entities/service.entity'
import { ApiException } from '@/domain/exceptions/api.exception'
import { availabilityUseCase } from '@/infrastructure/factories/availability.factory'
import { createRateReferenceUseCase } from '@/infrastructure/factories/rate-reference.factory'
import { createRoomCatalogUseCase } from '@/infrastructure/factories/room-catalog.factory'
import BookingCartSummary from '@/presentation/components/reservations/BookingCartSummary'
import SelectedRoomCard from '@/presentation/components/reservations/SelectedRoomCard'
import {
  Alert,
  AlertDescription,
} from '@/presentation/components/ui/alert'
import { Badge } from '@/presentation/components/ui/badge'
import { Button } from '@/presentation/components/ui/button'
import {
  Card,
  CardContent,
} from '@/presentation/components/ui/card'
import { Input } from '@/presentation/components/ui/input'
import { Label } from '@/presentation/components/ui/label'
import { useBookingCartStore } from '@/presentation/store/booking-cart.store'

const rateReferenceUseCase =
  createRateReferenceUseCase()
const roomCatalogUseCase =
  createRoomCatalogUseCase()

function localDate(
  daysFromToday = 0,
): string {
  const value = new Date()

  value.setDate(
    value.getDate() + daysFromToday,
  )

  const offset =
    value.getTimezoneOffset()

  return new Date(
    value.getTime() - offset * 60_000,
  )
    .toISOString()
    .slice(0, 10)
}

function getStayLength(
  checkIn: string,
  checkOut: string,
): number {
  const start =
    new Date(`${checkIn}T12:00:00`)

  const end =
    new Date(`${checkOut}T12:00:00`)

  return Math.round(
    (
      end.getTime()
      - start.getTime()
    ) / 86_400_000,
  )
}

function formatCurrency(
  value: number,
  currency: string,
): string {
  try {
    return new Intl.NumberFormat(
      'es-EC',
      {
        style: 'currency',
        currency,
      },
    ).format(value)
  } catch {
    return `${value.toFixed(2)} ${currency}`
  }
}

function getPositiveInteger(
  value: number | undefined,
  fallback: number,
): number {
  return (
    Number.isInteger(value)
    && Number(value) >= 0
  )
    ? Number(value)
    : fallback
}

export default function SelectedRoomsPage() {
  const navigate = useNavigate()
  const [searchParams] =
    useSearchParams()

  const {
    selections,
    summary,
    checkIn,
    checkOut,
    addSelection,
    removeSelection,
    updateGuests,
    services: selectedServices,
    addService,
    updateServiceQuantity,
    setDates,
    clearSelections,
  } = useBookingCartStore()

  const [
    availableRooms,
    setAvailableRooms,
  ] = useState<Room[]>([])

  const [
    ratesByRoomType,
    setRatesByRoomType,
  ] = useState<
    Record<number, RateReference>
  >({})
  const [services, setServices] =
    useState<Service[]>([])
  const [roomTypeServices, setRoomTypeServices] =
    useState<RoomTypeService[]>([])

  const [
    hasSearched,
    setHasSearched,
  ] = useState(false)

  const [
    isSearching,
    setIsSearching,
  ] = useState(false)

  const [
    isChecking,
    setIsChecking,
  ] = useState(false)

  const [
    message,
    setMessage,
  ] = useState<string | null>(null)

  const [
    errorMessage,
    setErrorMessage,
  ] = useState<string | null>(null)

  const hotelId = useMemo(() => {
    const queryHotelId = Number(
      searchParams.get('hotel'),
    )

    if (
      Number.isInteger(queryHotelId)
      && queryHotelId > 0
    ) {
      return queryHotelId
    }

    return selections[0]?.hotelId
      ?? null
  }, [searchParams, selections])

  useEffect(() => {
    const nextCheckIn = searchParams.get('checkIn')
    const nextCheckOut = searchParams.get('checkOut')

    if (
      nextCheckIn
      && nextCheckOut
      && nextCheckOut > nextCheckIn
    ) {
      setDates(nextCheckIn, nextCheckOut)
    }
  }, [searchParams, setDates])

  const selectedRoomIds = useMemo(
    () =>
      new Set(
        selections.map(
          (selection) =>
            selection.roomId,
        ),
      ),
    [selections],
  )

  const currency =
    selections[0]?.currency
    ?? 'USD'

  const hasMissingRates =
    selections.some(
      (selection) =>
        selection
          .referencePricePerNight
        === null,
    )

  const additionalServices = useMemo(() => {
    const roomTypeIds = new Set(
      selections.map((selection) => selection.roomTypeId),
    )

    return services.flatMap((service) => {
      if (!service.is_active) {
        return []
      }

      const relations = roomTypeServices.filter(
        (relation) =>
          relation.servicio === service.id
          && roomTypeIds.has(relation.tipo_habitacion),
      )
      return relations.length > 0 && !relations.some((item) => item.incluido)
        ? [{ service, relations }]
        : []
    })
  }, [roomTypeServices, selections, services])

  const includedServices = useMemo(() => {
    const roomTypeIds = new Set(
      selections.map((selection) => selection.roomTypeId),
    )

    return services.flatMap((service) => {
      if (!service.is_active) {
        return []
      }

      const relations = roomTypeServices.filter(
        (relation) =>
          relation.servicio === service.id
          && roomTypeIds.has(relation.tipo_habitacion),
      )

      return relations.some((relation) => relation.incluido)
        ? [{ service, relations }]
        : []
    })
  }, [roomTypeServices, selections, services])

  function validateDates():
    string | null {
    if (!checkIn || !checkOut) {
      return (
        'Selecciona las fechas de '
        + 'entrada y salida.'
      )
    }

    if (checkIn < localDate()) {
      return (
        'La fecha de entrada no '
        + 'puede ser pasada.'
      )
    }

    if (checkOut <= checkIn) {
      return (
        'La fecha de salida debe ser '
        + 'posterior a la entrada.'
      )
    }

    const nights = getStayLength(
      checkIn,
      checkOut,
    )

    if (nights < 1) {
      return (
        'La reserva debe tener al '
        + 'menos una noche.'
      )
    }

    if (nights > 30) {
      return (
        'La estancia máxima permitida '
        + 'es de 30 noches.'
      )
    }

    return null
  }

  function handleDateChange(
    nextCheckIn: string,
    nextCheckOut: string,
  ) {
    setDates(
      nextCheckIn,
      nextCheckOut,
    )
    clearSelections()
    setAvailableRooms([])
    setRatesByRoomType({})
    setHasSearched(false)
    setMessage(null)
    setErrorMessage(null)
  }

  async function loadCurrentRates(
    rooms: Room[],
  ): Promise<
    Record<number, RateReference>
  > {
    const roomTypeIds =
      Array.from(
        new Set(
          rooms.map(
            (room) =>
              room.tipo_habitacion,
          ),
        ),
      )

    const entries =
      await Promise.all(
        roomTypeIds.map(
          async (roomTypeId) => {
            try {
              const rate =
                await rateReferenceUseCase
                  .getCurrentRate(
                    roomTypeId,
                    checkIn,
                  )

              return [
                roomTypeId,
                rate,
              ] as const
            } catch {
              return null
            }
          },
        ),
      )

    const rateMap:
      Record<number, RateReference> = {}

    entries.forEach((entry) => {
      if (entry) {
        rateMap[entry[0]] =
          entry[1]
      }
    })

    return rateMap
  }

  async function handleSearch() {
    setErrorMessage(null)
    setMessage(null)

    const dateError =
      validateDates()

    if (dateError) {
      setErrorMessage(dateError)
      return
    }

    if (!hotelId) {
      setErrorMessage(
        'No fue posible identificar el hotel.',
      )
      return
    }

    try {
      setIsSearching(true)

      const [rooms, catalogServices, relations] =
        await Promise.all([
          availabilityUseCase.getAvailableRooms({
            hotel: hotelId,
            fecha_entrada: checkIn,
            fecha_salida: checkOut,
            cantidad_adultos: 1,
            cantidad_ninos: 0,
          }),
          roomCatalogUseCase.getServices(),
          roomCatalogUseCase.getRoomTypeServices(),
        ])

      const rates =
        await loadCurrentRates(rooms)

      setAvailableRooms(rooms)
      setRatesByRoomType(rates)
      setServices(catalogServices)
      setRoomTypeServices(relations)
      setHasSearched(true)

      if (rooms.length === 0) {
        setMessage(
          'No existen habitaciones disponibles para esas fechas.',
        )
      } else {
        setMessage(
          `Encontramos ${rooms.length} habitación(es) disponible(s).`,
        )
      }
    } catch (error: unknown) {
      setAvailableRooms([])
      setRatesByRoomType({})
      setHasSearched(true)

      if (
        error instanceof ApiException
        || error instanceof Error
      ) {
        setErrorMessage(
          error.message,
        )
      } else {
        setErrorMessage(
          'No fue posible consultar la disponibilidad.',
        )
      }
    } finally {
      setIsSearching(false)
    }
  }

  function handleSelectRoom(
    room: Room,
  ) {
    setErrorMessage(null)

    const rate =
      ratesByRoomType[
        room.tipo_habitacion
      ]

    if (!rate) {
      setErrorMessage(
        'Esta habitación no tiene una tarifa vigente.',
      )
      return
    }

    const baseAdults =
      getPositiveInteger(
        room.capacidad_adultos,
        1,
      )

    const baseChildren =
      getPositiveInteger(
        room.capacidad_ninos,
        0,
      )

    const includedGuestCapacity =
      getPositiveInteger(
        room.capacidad_total,
        baseAdults + baseChildren,
      )

    const extraGuestCapacity =
      getPositiveInteger(
        room.capacidad_extra,
        0,
      )

    const maxAdults =
      baseAdults
      + extraGuestCapacity

    const maxChildren =
      baseChildren > 0
        ? baseChildren
          + extraGuestCapacity
        : 0

    const maxGuests =
      getPositiveInteger(
        room.capacidad_maxima,
        includedGuestCapacity
          + extraGuestCapacity,
      )

    const referencePrice =
      Number(
        rate.precio_aplicable
        || rate.precio_noche,
      )

    try {
      addSelection({
        roomId: room.id,
        hotelId: room.hotel,
        roomTypeId:
          room.tipo_habitacion,
        roomNumber: room.numero,

        roomTypeName:
          room.tipo_habitacion_nombre
          || (
            'Tipo de habitación #'
            + room.tipo_habitacion
          ),

        referencePricePerNight:
          Number.isFinite(
            referencePrice,
          )
            ? referencePrice
            : null,

        currency:
          rate.moneda || 'USD',

        imageUrl: room.imagen_principal ?? null,

        includedGuestCapacity,
        extraGuestCapacity,

        maxAdults,
        maxChildren,
        maxGuests,

        adults: 1,
        children: 0,
      })

      setMessage(
        `La habitación ${room.numero} fue agregada.`,
      )
    } catch (error: unknown) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : (
              'No fue posible seleccionar '
              + 'la habitación.'
            ),
      )
    }
  }

  async function handleContinue() {
    setErrorMessage(null)
    setMessage(null)

    const dateError =
      validateDates()

    if (dateError) {
      setErrorMessage(dateError)
      return
    }

    if (selections.length === 0) {
      setErrorMessage(
        'Selecciona al menos una habitación.',
      )
      return
    }

    const reservationHotelId =
      selections[0].hotelId

    try {
      setIsChecking(true)

      const availableResult =
        await availabilityUseCase
          .getAvailableRooms({
            hotel:
              reservationHotelId,
            fecha_entrada: checkIn,
            fecha_salida: checkOut,
            cantidad_adultos: 1,
            cantidad_ninos: 0,
          })

      const availableIds =
        new Set(
          availableResult.map(
            (room) => room.id,
          ),
        )

      const unavailable =
        selections.filter(
          (selection) =>
            !availableIds.has(
              selection.roomId,
            ),
        )

      if (unavailable.length > 0) {
        setErrorMessage(
          `Ya no están disponibles: ${unavailable
            .map(
              (selection) =>
                `habitación ${selection.roomNumber}`,
            )
            .join(', ')}.`,
        )
        return
      }

      navigate('/reserva/huespedes')
    } catch (error: unknown) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : (
              'No fue posible comprobar '
              + 'la disponibilidad.'
            ),
      )
    } finally {
      setIsChecking(false)
    }
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">
          Reserva segura
        </p>

        <h1 className="mt-2 text-3xl font-bold">
          Busca tu habitación
        </h1>

        <p className="mt-2 max-w-3xl text-muted-foreground">
          El precio se cobra una vez por
          habitación. Los huéspedes adicionales
          a la capacidad incluida generan un
          recargo.
        </p>

        <ol className="mt-6 flex flex-wrap gap-2 text-xs font-semibold">
          {['Fechas', 'Habitaciones', 'Extras', 'Huéspedes', 'Confirmación'].map(
            (step, index) => (
              <li
                key={step}
                className={`rounded-full px-3 py-1.5 ${
                  index <= 2
                    ? 'bg-primary/10 text-primary'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {index + 1}. {step}
              </li>
            ),
          )}
        </ol>
      </header>

      {!hotelId ? (
        <section className="rounded-2xl border border-dashed p-12 text-center">
          <Building2 className="mx-auto size-10 text-muted-foreground" />

          <h2 className="mt-4 text-2xl font-semibold">
            Primero selecciona un hotel
          </h2>

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
          <section className="grid gap-4 rounded-2xl border bg-card p-5 lg:grid-cols-[1fr_1fr_auto] lg:items-end">
            <div className="space-y-2">
              <Label htmlFor="check-in">
                Fecha de entrada
              </Label>

              <Input
                id="check-in"
                type="date"
                min={localDate()}
                max={localDate(730)}
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
                  || localDate(1)
                }
                max={localDate(760)}
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
              disabled={isSearching}
              onClick={handleSearch}
            >
              <Search className="size-4" />

              {isSearching
                ? 'Buscando...'
                : 'Buscar disponibles'}
            </Button>
          </section>

          {errorMessage && (
            <Alert variant="destructive">
              <AlertDescription>
                {errorMessage}
              </AlertDescription>
            </Alert>
          )}

          {message && (
            <Alert>
              <AlertDescription>
                {message}
              </AlertDescription>
            </Alert>
          )}

          {hasSearched && !errorMessage && (
            <section className="space-y-5">
              <div>
                <h2 className="text-2xl font-bold">
                  Habitaciones disponibles
                </h2>

                <p className="text-sm text-muted-foreground">
                  Disponibilidad confirmada por
                  el backend.
                </p>
              </div>

              {availableRooms.length === 0 ? (
                <div className="rounded-2xl border border-dashed p-10 text-center text-muted-foreground">
                  No encontramos habitaciones
                  libres para esas fechas.
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {availableRooms.map(
                    (room) => {
                      const rate =
                        ratesByRoomType[
                          room
                            .tipo_habitacion
                        ]

                      const selected =
                        selectedRoomIds.has(
                          room.id,
                        )

                      const price = rate
                        ? Number(
                            rate
                              .precio_aplicable
                            || rate
                              .precio_noche,
                          )
                        : null

                      const included =
                        room
                          .capacidad_total
                        ?? 1

                      const extra =
                        room
                          .capacidad_extra
                        ?? 0

                      const maximum =
                        room
                          .capacidad_maxima
                        ?? included + extra

                      return (
                        <Card
                          key={room.id}
                          className="group overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl"
                        >
                          <CardContent className="p-0">
                            {room.imagen_principal ? (
                              <img
                                src={room.imagen_principal}
                                alt={`Habitación ${room.numero}`}
                                className="h-44 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                            ) : (
                              <div className="flex h-44 items-center justify-center bg-gradient-to-br from-primary/15 via-muted to-background text-sm font-medium text-muted-foreground">
                                Habitación {room.numero}
                              </div>
                            )}
                            <div className="grid gap-5 p-5">
                            <div className="space-y-3">
                              <div className="flex flex-wrap items-center gap-2">
                                <Badge variant="secondary">
                                  Disponible
                                </Badge>

                                <span className="text-sm text-muted-foreground">
                                  Habitación{' '}
                                  {room.numero}
                                </span>
                              </div>

                              <h3 className="text-xl font-semibold">
                                {room
                                  .tipo_habitacion_nombre
                                  || (
                                    `Tipo #${room.tipo_habitacion}`
                                  )}
                              </h3>

                              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                <span className="inline-flex items-center gap-1">
                                  <Building2 className="size-4" />
                                  Piso{' '}
                                  {room.piso}
                                </span>

                                <span className="inline-flex items-center gap-1">
                                  <Users className="size-4" />
                                  Máximo{' '}
                                  {maximum}
                                </span>

                                <span className="inline-flex items-center gap-1">
                                  <BedDouble className="size-4" />
                                  {included}{' '}
                                  incluidos
                                </span>
                              </div>

                              <p className="text-sm text-muted-foreground">
                                Permite {extra}{' '}
                                huésped(es) extra
                                con un recargo del 50%
                                cada uno.
                              </p>

                              {room.descripcion && (
                                <p className="text-sm">
                                  {
                                    room
                                      .descripcion
                                  }
                                </p>
                              )}
                            </div>

                            <div className="space-y-4 rounded-xl bg-muted/40 p-5">
                              <div>
                                <p className="text-sm text-muted-foreground">
                                  Precio de la
                                  habitación por
                                  noche
                                </p>

                                {rate
                                && price !== null
                                && Number.isFinite(
                                  price,
                                ) ? (
                                  <p className="text-2xl font-bold">
                                    {formatCurrency(
                                      price,
                                      rate.moneda,
                                    )}
                                  </p>
                                ) : (
                                  <p className="text-sm text-destructive">
                                    Sin tarifa
                                    activa.
                                  </p>
                                )}
                              </div>

                              <Button
                                type="button"
                                className="w-full"
                                disabled={
                                  selected
                                  || !rate
                                }
                                onClick={() =>
                                  handleSelectRoom(
                                    room,
                                  )
                                }
                              >
                                {selected
                                  ? (
                                      'Habitación '
                                      + 'seleccionada'
                                    )
                                  : (
                                      'Seleccionar '
                                      + 'habitación'
                                    )}
                              </Button>
                            </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    },
                  )}
                </div>
              )}
            </section>
          )}

          {selections.length > 0 && (
            <section className="space-y-5">
              <div>
                <h2 className="text-2xl font-bold">
                  Tu selección
                </h2>

                <p className="text-sm text-muted-foreground">
                  Define los ocupantes de cada
                  habitación.
                </p>
              </div>

              <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
                <div className="space-y-5">
                  {selections.map(
                    (selection) => (
                      <SelectedRoomCard
                        key={
                          selection
                            .roomId
                        }
                        selection={
                          selection
                        }
                        onRemove={
                          removeSelection
                        }
                        onGuestsChange={
                          updateGuests
                        }
                      />
                    ),
                  )}

                  <Card>
                    <CardContent className="space-y-4 p-5">
                      <div>
                        <h3 className="text-xl font-semibold">
                          Mejora tu estancia
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Agrega servicios opcionales a tu reserva. Django
                          confirma el precio y la compatibilidad final.
                        </p>
                      </div>

                      {includedServices.length > 0 && (
                        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
                          <p className="font-medium text-foreground">
                            Incluidos en tu estancia
                          </p>
                          <div className="mt-3 grid gap-3 sm:grid-cols-2">
                            {includedServices.map(({ service }) => (
                              <div
                                key={service.id}
                                className="flex items-center gap-3 rounded-xl border bg-card p-2.5 shadow-sm"
                              >
                                {service.imagen_url ? (
                                  <img
                                    src={service.imagen_url}
                                    alt={service.nombre}
                                    className="size-11 rounded-lg object-cover"
                                  />
                                ) : (
                                  <div className="flex size-11 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-muted text-primary">
                                    <CheckCircle2 className="size-5" />
                                  </div>
                                )}
                                <div>
                                  <p className="text-sm font-medium text-foreground">
                                    {service.nombre}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    Sin costo adicional
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {additionalServices.length === 0 && (
                        <div className="rounded-2xl border border-dashed bg-muted/30 p-6 text-center">
                          <p className="font-medium text-foreground">
                            No hay servicios extra para esta selección.
                          </p>
                          <p className="mt-1 text-sm text-muted-foreground">
                            Desde Administración vincula un servicio como
                            “extra” al tipo de habitación y vuelve a buscar
                            disponibilidad.
                          </p>
                        </div>
                      )}

                      {additionalServices.map(({ service, relations }) => {
                        const selected = selectedServices.find(
                          (item) => item.serviceId === service.id,
                        )
                        const price = Number(
                          relations.find(
                            (item) => item.precio_personalizado !== null,
                          )?.precio_personalizado ?? service.precio_extra,
                        )
                        return (
                          <div
                            key={service.id}
                            className={`rounded-2xl border p-4 transition-all ${
                              selected
                                ? 'border-primary/40 bg-primary/5 shadow-sm'
                                : 'bg-card hover:border-primary/25'
                            }`}
                          >
                            <div className="flex flex-wrap items-center gap-4">
                              {service.imagen_url ? (
                                <img
                                  src={service.imagen_url}
                                  alt={service.nombre}
                                  className="h-20 w-28 rounded-xl object-cover"
                                />
                              ) : (
                                <div className="flex h-20 w-28 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-muted text-xs font-medium text-muted-foreground">
                                  Servicio extra
                                </div>
                              )}
                              <div>
                              <p className="font-medium">{service.nombre}</p>
                              <p className="text-sm text-muted-foreground">
                                {service.descripcion}
                              </p>
                              <p className="mt-2 text-sm font-semibold text-primary">
                                {formatCurrency(price, currency)} por unidad
                              </p>
                              </div>
                            </div>

                            {selected ? (
                              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t pt-4">
                                <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                                  Agregado
                                </span>
                                <p className="text-sm font-semibold">
                                  Subtotal: {formatCurrency(
                                    selected.unitPrice,
                                    selected.currency,
                                  )}
                                </p>
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => updateServiceQuantity(
                                    service.id,
                                    0,
                                  )}
                                >
                                  Quitar
                                </Button>
                              </div>
                            ) : (
                              <Button
                                className="mt-4"
                                type="button"
                                variant="outline"
                                onClick={() => addService({
                                  serviceId: service.id,
                                  roomTypeIds: relations.map(
                                    (item) => item.tipo_habitacion,
                                  ),
                                  name: service.nombre,
                                  description: service.descripcion,
                                  imageUrl: service.imagen_url,
                                  unitPrice: Number.isFinite(price) ? price : 0,
                                  currency,
                                })}
                              >
                                Agregar servicio
                              </Button>
                            )}
                          </div>
                        )
                      })}
                    </CardContent>
                  </Card>
                </div>

                <div className="lg:self-start">
                  <BookingCartSummary
                    summary={summary}
                    currency={currency}
                    hasMissingRates={
                      hasMissingRates
                    }
                    services={selectedServices}
                    disabled={isChecking}
                    onContinue={
                      handleContinue
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