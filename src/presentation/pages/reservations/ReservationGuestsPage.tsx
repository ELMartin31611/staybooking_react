import {
  ArrowLeft,
  Baby,
  CalendarDays,
  ShieldCheck,
  UserRound,
} from 'lucide-react'
import {
  useEffect,
  useState,
} from 'react'
import type { FormEvent } from 'react'
import {
  Link,
  useNavigate,
} from 'react-router-dom'

import type { ReservationGuestInput } from '@/application/dtos/create-reservation.dto'
import type { GuestType } from '@/domain/entities/reservation.entity'
import type { RoomSelection } from '@/domain/entities/room-selection.entity'
import { ApiException } from '@/domain/exceptions/api.exception'
import {
  ReservationPricingService,
} from '@/domain/services/reservation-pricing.service'
import type {
  ReservationPricingPreview,
} from '@/domain/services/reservation-pricing.service'
import {
  createRateReferenceUseCase,
} from '@/infrastructure/factories/rate-reference.factory'
import {
  Alert,
  AlertDescription,
} from '@/presentation/components/ui/alert'
import { Badge } from '@/presentation/components/ui/badge'
import { Button } from '@/presentation/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/presentation/components/ui/card'
import { Input } from '@/presentation/components/ui/input'
import { Label } from '@/presentation/components/ui/label'
import { Separator } from '@/presentation/components/ui/separator'
import { Textarea } from '@/presentation/components/ui/textarea'
import {
  useCreateReservation,
} from '@/presentation/hooks/useReservations'
import {
  useBookingCartStore,
} from '@/presentation/store/booking-cart.store'

interface GuestFormState {
  id: string
  roomId: number
  roomNumber: string
  guestType: GuestType

  nombres: string
  apellidos: string
  tipoDocumento: string
  numeroDocumento: string
  edad: string
  telefono: string
  esTitular: boolean
}

type EditableGuestField =
  | 'nombres'
  | 'apellidos'
  | 'tipoDocumento'
  | 'numeroDocumento'
  | 'edad'
  | 'telefono'

const rateReferenceUseCase =
  createRateReferenceUseCase()

const reservationPricingService =
  new ReservationPricingService()

function createGuestForms(
  selections: RoomSelection[],
): GuestFormState[] {
  const forms: GuestFormState[] = []
  let holderAssigned = false

  selections.forEach((selection) => {
    for (
      let index = 0;
      index < selection.adults;
      index += 1
    ) {
      const isHolder = !holderAssigned

      forms.push({
        id: `${selection.roomId}-adult-${index}`,
        roomId: selection.roomId,
        roomNumber: selection.roomNumber,
        guestType: 'adulto',

        nombres: '',
        apellidos: '',
        tipoDocumento: 'cedula',
        numeroDocumento: '',
        edad: '',
        telefono: '',
        esTitular: isHolder,
      })

      if (isHolder) {
        holderAssigned = true
      }
    }

    for (
      let index = 0;
      index < selection.children;
      index += 1
    ) {
      forms.push({
        id: `${selection.roomId}-child-${index}`,
        roomId: selection.roomId,
        roomNumber: selection.roomNumber,
        guestType: 'nino',

        nombres: '',
        apellidos: '',
        tipoDocumento: 'cedula',
        numeroDocumento: '',
        edad: '',
        telefono: '',
        esTitular: false,
      })
    }
  })

  return forms
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

function formatDate(
  value: string,
): string {
  if (!value) {
    return 'No seleccionada'
  }

  const date =
    new Date(`${value}T12:00:00`)

  return new Intl.DateTimeFormat(
    'es-EC',
    {
      dateStyle: 'long',
    },
  ).format(date)
}

function validateGuests(
  guests: GuestFormState[],
  selections: RoomSelection[],
): string | null {
  const expectedGuestCount =
    selections.reduce(
      (total, selection) =>
        total
        + selection.adults
        + selection.children,
      0,
    )

  if (
    guests.length
    !== expectedGuestCount
  ) {
    return (
      'La cantidad de huéspedes no '
      + 'coincide con la selección.'
    )
  }

  for (const selection of selections) {
    const roomGuests = guests.filter(
      (guest) =>
        guest.roomId
        === selection.roomId,
    )

    const adultCount =
      roomGuests.filter(
        (guest) =>
          guest.guestType === 'adulto',
      ).length

    const childCount =
      roomGuests.filter(
        (guest) =>
          guest.guestType === 'nino',
      ).length

    if (
      adultCount !== selection.adults
      || childCount
        !== selection.children
    ) {
      return (
        `Los huéspedes de la habitación `
        + `${selection.roomNumber} no coinciden `
        + 'con la selección.'
      )
    }
  }

  for (const guest of guests) {
    if (
      guest.nombres.trim().length < 2
    ) {
      return (
        'Todos los huéspedes deben '
        + 'tener nombres válidos.'
      )
    }

    if (
      guest.apellidos.trim().length < 2
    ) {
      return (
        'Todos los huéspedes deben '
        + 'tener apellidos válidos.'
      )
    }

    if (
      guest.tipoDocumento.trim() === ''
    ) {
      return (
        'Selecciona el tipo de documento '
        + 'de todos los huéspedes.'
      )
    }

    if (
      guest.numeroDocumento
        .trim()
        .length < 5
    ) {
      return (
        'Todos los huéspedes deben tener '
        + 'un número de documento válido.'
      )
    }

    const age = Number(guest.edad)

    if (
      !Number.isInteger(age)
      || age < 0
      || age > 120
    ) {
      return (
        'La edad de cada huésped debe '
        + 'ser un número válido.'
      )
    }

    if (
      guest.guestType === 'adulto'
      && age < 18
    ) {
      return (
        'Los huéspedes adultos deben '
        + 'tener 18 años o más.'
      )
    }

    if (
      guest.guestType === 'nino'
      && age >= 18
    ) {
      return (
        'Los huéspedes niños deben '
        + 'ser menores de 18 años.'
      )
    }
  }

  const normalizedDocuments =
    guests.map(
      (guest) =>
        guest.numeroDocumento
          .trim()
          .toUpperCase(),
    )

  if (
    new Set(normalizedDocuments).size
    !== normalizedDocuments.length
  ) {
    return (
      'No se puede repetir el '
      + 'documento de un huésped.'
    )
  }

  const holders = guests.filter(
    (guest) => guest.esTitular,
  )

  if (holders.length !== 1) {
    return (
      'Debes seleccionar exactamente '
      + 'un titular de la reserva.'
    )
  }

  if (
    holders[0].guestType !== 'adulto'
  ) {
    return (
      'El titular de la reserva '
      + 'debe ser adulto.'
    )
  }

  return null
}

export default function ReservationGuestsPage() {
  const navigate = useNavigate()

  const {
    selections,
    checkIn,
    checkOut,
    clearCart,
  } = useBookingCartStore()

  const createReservation =
    useCreateReservation()

  const [
    guests,
    setGuests,
  ] = useState<GuestFormState[]>(
    () => createGuestForms(selections),
  )

  const [
    observations,
    setObservations,
  ] = useState('')

  const [
    pricingPreview,
    setPricingPreview,
  ] = useState<
    ReservationPricingPreview | null
  >(null)

  const [
    pricingError,
    setPricingError,
  ] = useState<string | null>(null)

  const [
    isLoadingPricing,
    setIsLoadingPricing,
  ] = useState(false)

  const [
    submissionError,
    setSubmissionError,
  ] = useState<string | null>(null)

  useEffect(() => {
    if (
      selections.length === 0
      || !checkIn
      || !checkOut
    ) {
      setPricingPreview(null)
      return
    }

    let isActive = true

    async function loadPricing() {
      try {
        setIsLoadingPricing(true)
        setPricingError(null)

        const rates =
          await rateReferenceUseCase
            .getRates()

        const preview =
          reservationPricingService
            .calculate(
              selections,
              checkIn,
              checkOut,
              rates,
            )

        if (isActive) {
          setPricingPreview(preview)
        }
      } catch (error: unknown) {
        if (!isActive) {
          return
        }

        setPricingPreview(null)

        setPricingError(
          error instanceof Error
            ? error.message
            : (
                'No fue posible calcular '
                + 'el precio referencial.'
              ),
        )
      } finally {
        if (isActive) {
          setIsLoadingPricing(false)
        }
      }
    }

    void loadPricing()

    return () => {
      isActive = false
    }
  }, [
    selections,
    checkIn,
    checkOut,
  ])

  function updateGuest(
    guestId: string,
    field: EditableGuestField,
    value: string,
  ) {
    setGuests((currentGuests) =>
      currentGuests.map((guest) =>
        guest.id === guestId
          ? {
              ...guest,
              [field]: value,
            }
          : guest,
      ),
    )

    setSubmissionError(null)
  }

  function selectHolder(
    guestId: string,
  ) {
    setGuests((currentGuests) =>
      currentGuests.map((guest) => ({
        ...guest,
        esTitular:
          guest.id === guestId
          && guest.guestType
            === 'adulto',
      })),
    )

    setSubmissionError(null)
  }

  function buildGuestPayload():
    ReservationGuestInput[] {
    return guests.map((guest) => ({
      habitacion_id: guest.roomId,
      tipo_huesped: guest.guestType,
      nombres:
        guest.nombres.trim(),
      apellidos:
        guest.apellidos.trim(),
      tipo_documento:
        guest.tipoDocumento,
      numero_documento:
        guest.numeroDocumento
          .trim()
          .toUpperCase(),
      edad: Number(guest.edad),

      telefono:
        guest.telefono.trim()
        || undefined,

      es_titular:
        guest.esTitular,
    }))
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()
    setSubmissionError(null)

    if (
      selections.length === 0
      || !checkIn
      || !checkOut
    ) {
      setSubmissionError(
        'La selección de la reserva está incompleta.',
      )
      return
    }

    const guestError =
      validateGuests(
        guests,
        selections,
      )

    if (guestError) {
      setSubmissionError(guestError)
      return
    }

    if (
      pricingError
      || !pricingPreview
    ) {
      setSubmissionError(
        pricingError
        || (
          'No fue posible validar '
          + 'el precio de la reserva.'
        ),
      )
      return
    }

    try {
      const reservation =
        await createReservation
          .mutateAsync({
            fecha_entrada: checkIn,
            fecha_salida: checkOut,

            habitaciones:
              selections.map(
                (selection) => ({
                  habitacion_id:
                    selection.roomId,
                  cantidad_adultos:
                    selection.adults,
                  cantidad_ninos:
                    selection.children,
                }),
              ),

            huespedes:
              buildGuestPayload(),

            observaciones:
              observations.trim(),
          })

      clearCart()

      navigate(
        `/mis-reservas/${reservation.id}`,
        {
          replace: true,
          state: {
            created: true,
          },
        },
      )
    } catch (error: unknown) {
      if (
        error instanceof ApiException
        || error instanceof Error
      ) {
        setSubmissionError(
          error.message,
        )
      } else {
        setSubmissionError(
          'No fue posible crear la reserva.',
        )
      }
    }
  }

  if (
    selections.length === 0
    || !checkIn
    || !checkOut
  ) {
    return (
      <main className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6">
        <Card>
          <CardContent className="p-12 text-center">
            <UserRound className="mx-auto size-12 text-muted-foreground" />

            <h1 className="mt-5 text-2xl font-bold">
              No existe una selección activa
            </h1>

            <p className="mt-3 text-muted-foreground">
              Selecciona fechas y habitaciones
              antes de registrar huéspedes.
            </p>

            <Button
              className="mt-6"
              asChild
            >
              <Link to="/hoteles">
                Explorar hoteles
              </Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    )
  }

  const hotelId =
    selections[0].hotelId

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-8">
        <Button
          type="button"
          variant="ghost"
          className="mb-4"
          asChild
        >
          <Link
            to={
              `/reserva/seleccion`
              + `?hotel=${hotelId}`
            }
          >
            <ArrowLeft className="size-4" />
            Volver a habitaciones
          </Link>
        </Button>

        <p className="text-sm font-semibold uppercase tracking-wide text-primary">
          Datos de la reserva
        </p>

        <h1 className="mt-2 text-3xl font-bold">
          Registra a los huéspedes
        </h1>

        <p className="mt-2 max-w-3xl text-muted-foreground">
          Registra únicamente las personas
          que ocuparán las habitaciones.
          Debe existir un único titular adulto.
        </p>
      </header>

      <section className="mb-8 grid gap-4 rounded-2xl border bg-card p-5 sm:grid-cols-3">
        <div>
          <p className="text-sm text-muted-foreground">
            Entrada
          </p>

          <p className="mt-1 inline-flex items-center gap-2 font-medium">
            <CalendarDays className="size-4 text-primary" />
            {formatDate(checkIn)}
          </p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">
            Salida
          </p>

          <p className="mt-1 inline-flex items-center gap-2 font-medium">
            <CalendarDays className="size-4 text-primary" />
            {formatDate(checkOut)}
          </p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">
            Huéspedes
          </p>

          <p className="mt-1 font-medium">
            {guests.length} persona(s)
          </p>
        </div>
      </section>

      {submissionError && (
        <Alert
          variant="destructive"
          className="mb-6"
        >
          <AlertDescription>
            {submissionError}
          </AlertDescription>
        </Alert>
      )}

      <form
        onSubmit={handleSubmit}
        className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]"
      >
        <div className="space-y-6">
          {selections.map(
            (selection) => {
              const roomGuests =
                guests.filter(
                  (guest) =>
                    guest.roomId
                    === selection.roomId,
                )

              return (
                <Card
                  key={selection.roomId}
                >
                  <CardHeader>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <CardTitle>
                          {
                            selection
                              .roomTypeName
                          }
                        </CardTitle>

                        <p className="mt-1 text-sm text-muted-foreground">
                          Habitación física{' '}
                          {
                            selection
                              .roomNumber
                          }
                        </p>
                      </div>

                      <Badge variant="secondary">
                        {selection.adults}{' '}
                        adulto(s),{' '}
                        {selection.children}{' '}
                        niño(s)
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-5">
                    {roomGuests.map(
                      (
                        guest,
                        index,
                      ) => {
                        const isAdult =
                          guest.guestType
                          === 'adulto'

                        const typeNumber =
                          roomGuests
                            .slice(
                              0,
                              index + 1,
                            )
                            .filter(
                              (item) =>
                                item.guestType
                                === guest.guestType,
                            )
                            .length

                        return (
                          <section
                            key={guest.id}
                            className="space-y-4 rounded-xl border p-4"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-3">
                              <div className="flex items-center gap-2">
                                {isAdult ? (
                                  <UserRound className="size-5 text-primary" />
                                ) : (
                                  <Baby className="size-5 text-primary" />
                                )}

                                <h3 className="font-semibold">
                                  {isAdult
                                    ? (
                                        `Adulto `
                                        + typeNumber
                                      )
                                    : (
                                        `Niño `
                                        + typeNumber
                                      )}
                                </h3>
                              </div>

                              {isAdult && (
                                <label className="inline-flex cursor-pointer items-center gap-2 text-sm">
                                  <input
                                    type="radio"
                                    name="reservation-holder"
                                    checked={
                                      guest
                                        .esTitular
                                    }
                                    onChange={() =>
                                      selectHolder(
                                        guest.id,
                                      )
                                    }
                                    className="size-4 accent-primary"
                                  />

                                  Titular de la
                                  reserva
                                </label>
                              )}
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                              <div className="space-y-2">
                                <Label
                                  htmlFor={
                                    `names-`
                                    + guest.id
                                  }
                                >
                                  Nombres
                                </Label>

                                <Input
                                  id={
                                    `names-`
                                    + guest.id
                                  }
                                  value={
                                    guest.nombres
                                  }
                                  maxLength={100}
                                  disabled={
                                    createReservation
                                      .isPending
                                  }
                                  onChange={(
                                    event,
                                  ) =>
                                    updateGuest(
                                      guest.id,
                                      'nombres',
                                      event
                                        .target
                                        .value,
                                    )
                                  }
                                  required
                                />
                              </div>

                              <div className="space-y-2">
                                <Label
                                  htmlFor={
                                    `last-names-`
                                    + guest.id
                                  }
                                >
                                  Apellidos
                                </Label>

                                <Input
                                  id={
                                    `last-names-`
                                    + guest.id
                                  }
                                  value={
                                    guest
                                      .apellidos
                                  }
                                  maxLength={100}
                                  disabled={
                                    createReservation
                                      .isPending
                                  }
                                  onChange={(
                                    event,
                                  ) =>
                                    updateGuest(
                                      guest.id,
                                      'apellidos',
                                      event
                                        .target
                                        .value,
                                    )
                                  }
                                  required
                                />
                              </div>

                              <div className="space-y-2">
                                <Label
                                  htmlFor={
                                    `document-type-`
                                    + guest.id
                                  }
                                >
                                  Tipo de documento
                                </Label>

                                <select
                                  id={
                                    `document-type-`
                                    + guest.id
                                  }
                                  value={
                                    guest
                                      .tipoDocumento
                                  }
                                  disabled={
                                    createReservation
                                      .isPending
                                  }
                                  onChange={(
                                    event,
                                  ) =>
                                    updateGuest(
                                      guest.id,
                                      'tipoDocumento',
                                      event
                                        .target
                                        .value,
                                    )
                                  }
                                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                                >
                                  <option value="cedula">
                                    Cédula
                                  </option>

                                  <option value="pasaporte">
                                    Pasaporte
                                  </option>

                                  <option value="otro">
                                    Otro
                                  </option>
                                </select>
                              </div>

                              <div className="space-y-2">
                                <Label
                                  htmlFor={
                                    `document-`
                                    + guest.id
                                  }
                                >
                                  Número de documento
                                </Label>

                                <Input
                                  id={
                                    `document-`
                                    + guest.id
                                  }
                                  value={
                                    guest
                                      .numeroDocumento
                                  }
                                  maxLength={30}
                                  disabled={
                                    createReservation
                                      .isPending
                                  }
                                  onChange={(
                                    event,
                                  ) =>
                                    updateGuest(
                                      guest.id,
                                      'numeroDocumento',
                                      event
                                        .target
                                        .value,
                                    )
                                  }
                                  required
                                />
                              </div>

                              <div className="space-y-2">
                                <Label
                                  htmlFor={
                                    `age-`
                                    + guest.id
                                  }
                                >
                                  Edad
                                </Label>

                                <Input
                                  id={
                                    `age-`
                                    + guest.id
                                  }
                                  type="number"
                                  min={
                                    isAdult
                                      ? 18
                                      : 0
                                  }
                                  max={
                                    isAdult
                                      ? 120
                                      : 17
                                  }
                                  value={
                                    guest.edad
                                  }
                                  disabled={
                                    createReservation
                                      .isPending
                                  }
                                  onChange={(
                                    event,
                                  ) =>
                                    updateGuest(
                                      guest.id,
                                      'edad',
                                      event
                                        .target
                                        .value,
                                    )
                                  }
                                  required
                                />
                              </div>

                              <div className="space-y-2">
                                <Label
                                  htmlFor={
                                    `phone-`
                                    + guest.id
                                  }
                                >
                                  Teléfono opcional
                                </Label>

                                <Input
                                  id={
                                    `phone-`
                                    + guest.id
                                  }
                                  type="tel"
                                  value={
                                    guest.telefono
                                  }
                                  maxLength={20}
                                  disabled={
                                    createReservation
                                      .isPending
                                  }
                                  onChange={(
                                    event,
                                  ) =>
                                    updateGuest(
                                      guest.id,
                                      'telefono',
                                      event
                                        .target
                                        .value,
                                    )
                                  }
                                />
                              </div>
                            </div>
                          </section>
                        )
                      },
                    )}
                  </CardContent>
                </Card>
              )
            },
          )}

          <Card>
            <CardHeader>
              <CardTitle>
                Observaciones
              </CardTitle>
            </CardHeader>

            <CardContent>
              <Label htmlFor="observations">
                Peticiones especiales opcionales
              </Label>

              <Textarea
                id="observations"
                className="mt-2 min-h-28"
                value={observations}
                maxLength={500}
                disabled={
                  createReservation
                    .isPending
                }
                placeholder="Llegada aproximada, accesibilidad u otra información."
                onChange={(event) =>
                  setObservations(
                    event.target.value,
                  )
                }
              />

              <p className="mt-2 text-xs text-muted-foreground">
                Las peticiones están sujetas
                a disponibilidad del hotel.
              </p>
            </CardContent>
          </Card>
        </div>

        <aside className="lg:self-start">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>
                Resumen de pago
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              {isLoadingPricing && (
                <p className="text-sm text-muted-foreground">
                  Calculando precio...
                </p>
              )}

              {pricingError && (
                <Alert variant="destructive">
                  <AlertDescription>
                    {pricingError}
                  </AlertDescription>
                </Alert>
              )}

              {pricingPreview && (
                <>
                  <div className="flex justify-between gap-3 text-sm">
                    <span className="text-muted-foreground">
                      Noches
                    </span>

                    <strong>
                      {pricingPreview.nights}
                    </strong>
                  </div>

                  <div className="flex justify-between gap-3 text-sm">
                    <span className="text-muted-foreground">
                      Adultos
                    </span>

                    <strong>
                      {
                        pricingPreview
                          .totalAdults
                      }
                    </strong>
                  </div>

                  <div className="flex justify-between gap-3 text-sm">
                    <span className="text-muted-foreground">
                      Niños
                    </span>

                    <strong>
                      {
                        pricingPreview
                          .totalChildren
                      }
                    </strong>
                  </div>

                  <div className="flex justify-between gap-3 text-sm">
                    <span className="text-muted-foreground">
                      Huéspedes extra
                    </span>

                    <strong>
                      {
                        pricingPreview
                          .totalExtraGuests
                      }
                    </strong>
                  </div>

                  <Separator />

                  {pricingPreview.rooms.map(
                    (room) => (
                      <div
                        key={room.roomId}
                        className="space-y-2 rounded-lg border p-3 text-sm"
                      >
                        <div className="flex justify-between gap-3 font-medium">
                          <span>
                            Habitación{' '}
                            {room.roomNumber}
                          </span>

                          <strong>
                            {formatCurrency(
                              room.subtotal,
                              pricingPreview
                                .currency,
                            )}
                          </strong>
                        </div>

                        <div className="flex justify-between gap-3 text-muted-foreground">
                          <span>
                            Habitación ×{' '}
                            {room.nights}{' '}
                            noche(s)
                          </span>

                          <span>
                            {formatCurrency(
                              room
                                .roomSubtotal,
                              pricingPreview
                                .currency,
                            )}
                          </span>
                        </div>

                        <div className="flex justify-between gap-3 text-muted-foreground">
                          <span>
                            {
                              room
                                .extraGuests
                            }{' '}
                            huésped(es) extra
                          </span>

                          <span>
                            {formatCurrency(
                              room
                                .extraGuestsSubtotal,
                              pricingPreview
                                .currency,
                            )}
                          </span>
                        </div>
                      </div>
                    ),
                  )}

                  <Separator />

                  <div className="flex justify-between gap-3 text-sm">
                    <span className="text-muted-foreground">
                      Habitaciones
                    </span>

                    <span>
                      {formatCurrency(
                        pricingPreview
                          .roomsSubtotal,
                        pricingPreview
                          .currency,
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between gap-3 text-sm">
                    <span className="text-muted-foreground">
                      Huéspedes extra
                    </span>

                    <span>
                      {formatCurrency(
                        pricingPreview
                          .extraGuestsSubtotal,
                        pricingPreview
                          .currency,
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between gap-3 text-sm">
                    <span className="text-muted-foreground">
                      Subtotal
                    </span>

                    <span>
                      {formatCurrency(
                        pricingPreview
                          .subtotal,
                        pricingPreview
                          .currency,
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between gap-3 text-sm">
                    <span className="text-muted-foreground">
                      Impuestos 12%
                    </span>

                    <span>
                      {formatCurrency(
                        pricingPreview.taxes,
                        pricingPreview
                          .currency,
                      )}
                    </span>
                  </div>

                  <Separator />

                  <div className="flex items-end justify-between gap-3">
                    <span className="font-medium">
                      Total estimado
                    </span>

                    <strong className="text-2xl">
                      {formatCurrency(
                        pricingPreview.total,
                        pricingPreview
                          .currency,
                      )}
                    </strong>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    El precio base se cobra una
                    vez por habitación. Cada
                    huésped que supere la
                    capacidad incluida genera
                    un recargo del 50%.
                  </p>

                  <p className="text-xs text-muted-foreground">
                    El backend volverá a validar
                    disponibilidad, capacidad,
                    tarifas e impuestos.
                  </p>
                </>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={
                  createReservation
                    .isPending
                  || isLoadingPricing
                  || !pricingPreview
                  || Boolean(pricingError)
                }
              >
                <ShieldCheck className="size-4" />

                {createReservation.isPending
                  ? 'Creando reserva...'
                  : (
                      'Crear reserva '
                      + 'pendiente'
                    )}
              </Button>

              <p className="text-center text-xs text-muted-foreground">
                Todavía no se realizará ningún
                cobro.
              </p>
            </CardContent>
          </Card>
        </aside>
      </form>
    </main>
  )
}