import {
  useEffect,
  useState,
} from 'react'
import type { FormEvent } from 'react'
import { Loader2 } from 'lucide-react'

import type {
  RateReference,
  SaveRoomRateInput,
} from '@/domain/entities/rate-reference.entity'
import type { AdminHotel } from '@/domain/entities/admin.entity'
import type { RoomType } from '@/domain/entities/room-type.entity'
import type { Season } from '@/domain/entities/season.entity'
import {
  Alert,
  AlertDescription,
} from '@/presentation/components/ui/alert'
import { Button } from '@/presentation/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/presentation/components/ui/card'
import { Input } from '@/presentation/components/ui/input'
import { Label } from '@/presentation/components/ui/label'

interface RateFormProps {
  rate?: RateReference | null
  hotels: AdminHotel[]
  roomTypes: RoomType[]
  seasons: Season[]
  isSubmitting: boolean
  onSubmit: (
    data: SaveRoomRateInput,
  ) => Promise<void>
  onCancel?: () => void
}

const EMPTY_FORM: SaveRoomRateInput = {
  tipo_habitacion: 0,
  temporada: 0,
  precio_noche: '',
  precio_fin_semana: null,
  precio_persona_extra: '0.00',
  moneda: 'USD',
  is_active: true,
}

function calculateExtraPersonPrice(
  nightlyPrice: string,
): string {
  const price = Number(nightlyPrice)

  return Number.isFinite(price) && price >= 0
    ? (price * 0.5).toFixed(2)
    : '0.00'
}

function createFormState(
  rate?: RateReference | null,
): SaveRoomRateInput {
  if (!rate) {
    return {
      ...EMPTY_FORM,
    }
  }

  return {
    tipo_habitacion:
      rate.tipo_habitacion,
    temporada:
      rate.temporada,
    precio_noche:
      rate.precio_noche,
    precio_fin_semana:
      rate.precio_fin_semana,
    precio_persona_extra:
      calculateExtraPersonPrice(
        rate.precio_noche,
      ),
    moneda:
      rate.moneda,
    is_active:
      rate.is_active,
  }
}

export default function RateForm({
  rate = null,
  hotels,
  roomTypes,
  seasons,
  isSubmitting,
  onSubmit,
  onCancel,
}: RateFormProps) {
  const [form, setForm] =
    useState<SaveRoomRateInput>(
      createFormState(rate),
    )

  const [error, setError] = useState('')
  const [
    selectedHotelId,
    setSelectedHotelId,
  ] = useState(0)

  const isEditing = rate !== null

  const activeRoomTypes = roomTypes.filter(
    (roomType) =>
      roomType.hotel === selectedHotelId
      && (
        roomType.estado === 'activo'
        || roomType.id === form.tipo_habitacion
      ),
  )

  const activeSeasons = seasons.filter(
    (season) =>
      season.is_active
      || season.id === form.temporada,
  )

  useEffect(() => {
    setForm(
      createFormState(rate),
    )
    setSelectedHotelId(0)
    setError('')
  }, [rate])

  useEffect(() => {
    if (!rate || selectedHotelId > 0) {
      return
    }

    const roomType = roomTypes.find(
      (item) =>
        item.id === rate.tipo_habitacion,
    )

    if (roomType) {
      setSelectedHotelId(roomType.hotel)
    }
  }, [
    rate,
    roomTypes,
    selectedHotelId,
  ])

  function updateField<
    Key extends keyof SaveRoomRateInput,
  >(
    field: Key,
    value: SaveRoomRateInput[Key],
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()
    setError('')

    try {
      await onSubmit(form)

      if (!isEditing) {
        setForm({
          ...EMPTY_FORM,
        })
      }
    } catch (caughtError: unknown) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : 'No fue posible guardar la tarifa.',
      )
    }
  }

  function handleCancel() {
    setForm(
      createFormState(null),
    )
    setError('')
    onCancel?.()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isEditing
            ? 'Editar tarifa'
            : 'Nueva tarifa'}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form
          className="grid gap-4 sm:grid-cols-2"
          onSubmit={handleSubmit}
        >
          <div className="space-y-2">
            <Label htmlFor="rate-hotel">
              Hotel
            </Label>

            <select
              id="rate-hotel"
              value={selectedHotelId}
              onChange={(event) => {
                setSelectedHotelId(
                  Number(event.target.value),
                )
                updateField(
                  'tipo_habitacion',
                  0,
                )
              }}
              disabled={
                isSubmitting
                || hotels.length === 0
              }
              className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
              required
            >
              <option value={0}>
                Seleccionar
              </option>

              {hotels.map((hotel) => (
                <option
                  key={hotel.id}
                  value={hotel.id}
                >
                  {hotel.nombre}
                </option>
              ))}
            </select>

            {hotels.length === 0 && (
              <p className="text-xs text-destructive">
                No existen hoteles disponibles.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="rate-room-type">
              Tipo de habitación
            </Label>

            <select
              id="rate-room-type"
              value={form.tipo_habitacion}
              onChange={(event) =>
                updateField(
                  'tipo_habitacion',
                  Number(event.target.value),
                )
              }
              disabled={
                isSubmitting
                || selectedHotelId === 0
                || activeRoomTypes.length === 0
              }
              className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
              required
            >
              <option value={0}>
                Seleccionar
              </option>

              {activeRoomTypes.map((roomType) => (
                <option
                  key={roomType.id}
                  value={roomType.id}
                >
                  {roomType.nombre}
                </option>
              ))}
            </select>

            {selectedHotelId > 0
              && activeRoomTypes.length === 0
              && (
                <p className="text-xs text-destructive">
                  No existen tipos de habitación activos para este hotel.
                </p>
              )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="rate-season">
              Temporada
            </Label>

            <select
              id="rate-season"
              value={form.temporada}
              onChange={(event) =>
                updateField(
                  'temporada',
                  Number(event.target.value),
                )
              }
              disabled={
                isSubmitting
                || activeSeasons.length === 0
              }
              className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
              required
            >
              <option value={0}>
                Seleccionar
              </option>

              {activeSeasons.map((season) => (
                <option
                  key={season.id}
                  value={season.id}
                >
                  {season.nombre}
                </option>
              ))}
            </select>

            {activeSeasons.length === 0 && (
              <p className="text-xs text-destructive">
                Primero debes crear una temporada activa.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="rate-night-price">
              Precio por noche
            </Label>

            <Input
              id="rate-night-price"
              type="number"
              min="0"
              step="0.01"
              value={form.precio_noche}
              onChange={(event) => {
                const precioNoche = event.target.value
                setForm((current) => ({
                  ...current,
                  precio_noche: precioNoche,
                  precio_persona_extra:
                    calculateExtraPersonPrice(
                      precioNoche,
                    ),
                }))
              }}
              placeholder="100.00"
              disabled={isSubmitting}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rate-weekend-price">
              Precio de fin de semana
            </Label>

            <Input
              id="rate-weekend-price"
              type="number"
              min="0"
              step="0.01"
              value={
                form.precio_fin_semana ?? ''
              }
              onChange={(event) =>
                updateField(
                  'precio_fin_semana',
                  event.target.value || null,
                )
              }
              placeholder="125.00"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rate-extra-person">
              Precio por persona extra (50%)
            </Label>

            <Input
              id="rate-extra-person"
              type="number"
              min="0"
              step="0.01"
              value={form.precio_persona_extra}
              readOnly
              aria-describedby="rate-extra-person-description"
            />

            <p
              id="rate-extra-person-description"
              className="text-xs text-muted-foreground"
            >
              Se calcula automáticamente como el 50% del precio por noche.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="rate-currency">
              Moneda
            </Label>

            <Input
              id="rate-currency"
              value={form.moneda}
              onChange={(event) =>
                updateField(
                  'moneda',
                  event.target.value.toUpperCase(),
                )
              }
              placeholder="USD"
              minLength={3}
              maxLength={10}
              disabled={isSubmitting}
              required
            />
          </div>

          <label className="flex items-center gap-2 text-sm sm:col-span-2">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(event) =>
                updateField(
                  'is_active',
                  event.target.checked,
                )
              }
              disabled={isSubmitting}
              className="size-4 rounded border-input"
            />

            Tarifa activa
          </label>

          {error && (
            <Alert
              variant="destructive"
              className="sm:col-span-2"
            >
              <AlertDescription>
                {error}
              </AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row">
            <Button
              type="submit"
              disabled={
                isSubmitting
                || roomTypes.length === 0
                || activeSeasons.length === 0
              }
            >
              {isSubmitting && (
                <Loader2 className="size-4 animate-spin" />
              )}

              {isEditing
                ? 'Guardar cambios'
                : 'Crear tarifa'}
            </Button>

            {isEditing && (
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                Cancelar edición
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}