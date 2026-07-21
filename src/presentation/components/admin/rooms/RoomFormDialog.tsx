import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import type {
  AdminHotel,
  Room,
  RoomType,
  SaveRoomInput,
} from '@/domain/entities/admin.entity'
import { Button } from '@/presentation/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/presentation/components/ui/dialog'
import { Input } from '@/presentation/components/ui/input'
import { Label } from '@/presentation/components/ui/label'
import { Textarea } from '@/presentation/components/ui/textarea'

interface Props {
  open: boolean
  room: Room | null
  hotels: AdminHotel[]
  roomTypes: RoomType[]
  loading: boolean
  onOpenChange: (open: boolean) => void
  onSave: (
    input: SaveRoomInput,
  ) => Promise<void>
}

const emptyForm: SaveRoomInput = {
  hotel: 0,
  tipo_habitacion: 0,
  numero: '',
  piso: 1,
  estado: 'disponible',
  descripcion: '',
  es_fumador: false,
  observaciones: '',
}

export default function RoomFormDialog({
  open,
  room,
  hotels,
  roomTypes,
  loading,
  onOpenChange,
  onSave,
}: Props) {
  const [form, setForm] =
    useState<SaveRoomInput>(emptyForm)

  useEffect(() => {
    if (!open) {
      return
    }

    if (room) {
      setForm({
        hotel: room.hotel,
        tipo_habitacion:
          room.tipo_habitacion,
        numero: room.numero,
        piso: room.piso,
        estado: room.estado,
        descripcion: room.descripcion,
        es_fumador: room.es_fumador,
        observaciones: room.observaciones,
      })

      return
    }

    const hotelId =
      hotels[0]?.id ?? 0

    const firstType = roomTypes.find(
      (type) =>
        type.hotel === hotelId,
    )

    setForm({
      ...emptyForm,
      hotel: hotelId,
      tipo_habitacion:
        firstType?.id ?? 0,
    })
  }, [
    hotels,
    open,
    room,
    roomTypes,
  ])

  const availableTypes = useMemo(
    () =>
      roomTypes.filter(
        (type) =>
          type.hotel === form.hotel,
      ),
    [
      form.hotel,
      roomTypes,
    ],
  )

  function update<
    K extends keyof SaveRoomInput,
  >(
    key: K,
    value: SaveRoomInput[K],
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }))
  }

  function changeHotel(
    hotelId: number,
  ) {
    const firstType = roomTypes.find(
      (type) =>
        type.hotel === hotelId,
    )

    setForm((current) => ({
      ...current,
      hotel: hotelId,
      tipo_habitacion:
        firstType?.id ?? 0,
    }))
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {room
              ? 'Editar habitación'
              : 'Crear habitación'}
          </DialogTitle>

          <DialogDescription>
            El tipo seleccionado debe
            pertenecer al mismo hotel.
          </DialogDescription>
        </DialogHeader>

        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault()
            void onSave(form)
          }}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="room-hotel">
                Hotel
              </Label>

              <select
                id="room-hotel"
                className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm"
                value={form.hotel}
                onChange={(event) =>
                  changeHotel(
                    Number(
                      event.target.value,
                    ),
                  )
                }
                required
              >
                <option
                  value={0}
                  disabled
                >
                  Selecciona un hotel
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="room-type">
                Tipo de habitación
              </Label>

              <select
                id="room-type"
                className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm"
                value={
                  form.tipo_habitacion
                }
                onChange={(event) =>
                  update(
                    'tipo_habitacion',
                    Number(
                      event.target.value,
                    ),
                  )
                }
                required
              >
                <option
                  value={0}
                  disabled
                >
                  Selecciona un tipo
                </option>

                {availableTypes.map(
                  (type) => (
                    <option
                      key={type.id}
                      value={type.id}
                    >
                      {type.nombre}
                    </option>
                  ),
                )}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="room-number">
                Número o código
              </Label>

              <Input
                id="room-number"
                value={form.numero}
                onChange={(event) =>
                  update(
                    'numero',
                    event.target.value,
                  )
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="room-floor">
                Piso
              </Label>

              <Input
                id="room-floor"
                type="number"
                min={-5}
                max={200}
                value={form.piso}
                onChange={(event) =>
                  update(
                    'piso',
                    Number(
                      event.target.value,
                    ),
                  )
                }
                required
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="room-status">
                Estado operativo
              </Label>

              <select
                id="room-status"
                className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm"
                value={form.estado}
                onChange={(event) =>
                  update(
                    'estado',
                    event.target.value,
                  )
                }
              >
                <option value="disponible">
                  Disponible
                </option>

                <option value="mantenimiento">
                  Mantenimiento
                </option>

                <option value="inactiva">
                  Inactiva
                </option>

                <option value="bloqueada">
                  Bloqueada
                </option>
              </select>
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="room-description">
                Descripción
              </Label>

              <Textarea
                id="room-description"
                rows={4}
                value={form.descripcion}
                onChange={(event) =>
                  update(
                    'descripcion',
                    event.target.value,
                  )
                }
                required
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="room-notes">
                Observaciones
              </Label>

              <Textarea
                id="room-notes"
                rows={3}
                value={form.observaciones}
                onChange={(event) =>
                  update(
                    'observaciones',
                    event.target.value,
                  )
                }
                required
              />
            </div>

            <label className="flex items-center gap-3 rounded-lg border p-3 sm:col-span-2">
              <input
                type="checkbox"
                checked={form.es_fumador}
                onChange={(event) =>
                  update(
                    'es_fumador',
                    event.target.checked,
                  )
                }
              />

              <span className="text-sm font-medium">
                Habitación habilitada
                para fumadores
              </span>
            </label>
          </div>

          {form.hotel > 0
            && availableTypes.length === 0
            && (
              <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
                Este hotel todavía no
                tiene tipos de habitación.
                Créalo antes de guardar.
              </p>
            )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                onOpenChange(false)
              }
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              disabled={
                loading
                || form.tipo_habitacion < 1
              }
            >
              {loading
                ? 'Guardando...'
                : 'Guardar habitación'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}