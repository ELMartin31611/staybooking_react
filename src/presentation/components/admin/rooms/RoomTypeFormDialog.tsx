import {
  useEffect,
  useState,
} from 'react'

import type {
  AdminHotel,
  RoomType,
  SaveRoomTypeInput,
} from '@/domain/entities/admin.entity'
import {
  ROOM_CATEGORIES,
  type RoomCategory,
} from '@/domain/entities/room-type.entity'
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
  roomType: RoomType | null
  hotels: AdminHotel[]
  loading: boolean
  onOpenChange: (
    open: boolean,
  ) => void
  onSave: (
    input: SaveRoomTypeInput,
  ) => Promise<void>
}

const emptyForm: SaveRoomTypeInput = {
  hotel: 0,
  nombre: 'Individual',
  categoria: 'individual',
  descripcion: '',
  capacidad_adultos: 1,
  capacidad_ninos: 0,
  capacidad_total: 1,
  capacidad_extra: 0,
  tamano_m2: '20.00',
  precio_base: '0.00',
  estado: 'activo',
}

const categoryLabels: Record<RoomCategory, string> = {
  individual: 'Individual',
  doble: 'Doble',
  suite: 'Suite',
  vip: 'VIP',
  premium: 'Premium',
  presidencial: 'Presidencial',
}

export default function RoomTypeFormDialog({
  open,
  roomType,
  hotels,
  loading,
  onOpenChange,
  onSave,
}: Props) {
  const [
    form,
    setForm,
  ] = useState<SaveRoomTypeInput>(
    emptyForm,
  )

  const [
    validation,
    setValidation,
  ] = useState('')

  useEffect(() => {
    if (!open) {
      return
    }

    setValidation('')

    setForm(
      roomType
        ? {
            hotel: roomType.hotel,
            nombre: roomType.nombre,
            categoria: roomType.categoria ?? 'individual',
            descripcion:
              roomType.descripcion,
            capacidad_adultos:
              roomType.capacidad_adultos,
            capacidad_ninos:
              roomType.capacidad_ninos,
            capacidad_total:
              roomType.capacidad_total,
            capacidad_extra:
              roomType.capacidad_extra,
            tamano_m2:
              roomType.tamano_m2,
            precio_base:
              roomType.precio_base,
            estado: roomType.estado,
          }
        : {
            ...emptyForm,
            hotel: hotels[0]?.id ?? 0,
          },
    )
  }, [
    hotels,
    open,
    roomType,
  ])

  function update<
    K extends keyof SaveRoomTypeInput,
  >(
    key: K,
    value: SaveRoomTypeInput[K],
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }))
  }

  async function submit(
    event:
      React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    if (
      form.capacidad_total
      < (
        form.capacidad_adultos
        + form.capacidad_ninos
      )
    ) {
      setValidation(
        'La capacidad incluida debe cubrir adultos y niños configurados.',
      )
      return
    }

    setValidation('')
    await onSave(form)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {roomType
              ? 'Editar tipo de habitación'
              : 'Crear tipo de habitación'}
          </DialogTitle>

          <DialogDescription>
            Define la capacidad incluida,
            cupos adicionales y precio base
            referencial.
          </DialogDescription>
        </DialogHeader>

        <form
          className="space-y-4"
          onSubmit={submit}
        >
          {validation && (
            <p className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              {validation}
            </p>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="room-type-hotel">
                Hotel
              </Label>

              <select
                id="room-type-hotel"
                className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm"
                value={form.hotel}
                onChange={(event) =>
                  update(
                    'hotel',
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
              <Label htmlFor="room-type-category">
                Categoría
              </Label>

              <select
                id="room-type-category"
                className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm"
                value={form.categoria}
                onChange={(event) => {
                  const categoria = event.target.value as RoomCategory
                  setForm((current) => ({
                    ...current,
                    categoria,
                    nombre: categoryLabels[categoria],
                  }))
                }}
                required
              >
                {ROOM_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {categoryLabels[category]}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="room-type-status">
                Estado
              </Label>

              <select
                id="room-type-status"
                className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm"
                value={form.estado}
                onChange={(event) =>
                  update(
                    'estado',
                    event.target.value,
                  )
                }
              >
                <option value="activo">
                  Activo
                </option>

                <option value="inactivo">
                  Inactivo
                </option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="room-type-adults">
                Adultos permitidos
              </Label>

              <Input
                id="room-type-adults"
                type="number"
                min={1}
                value={
                  form.capacidad_adultos
                }
                onChange={(event) =>
                  update(
                    'capacidad_adultos',
                    Number(
                      event.target.value,
                    ),
                  )
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="room-type-children">
                Niños permitidos
              </Label>

              <Input
                id="room-type-children"
                type="number"
                min={0}
                value={
                  form.capacidad_ninos
                }
                onChange={(event) =>
                  update(
                    'capacidad_ninos',
                    Number(
                      event.target.value,
                    ),
                  )
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="room-type-capacity">
                Huéspedes incluidos
              </Label>

              <Input
                id="room-type-capacity"
                type="number"
                min={1}
                value={
                  form.capacidad_total
                }
                onChange={(event) =>
                  update(
                    'capacidad_total',
                    Number(
                      event.target.value,
                    ),
                  )
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="room-type-extra">
                Cupos adicionales
              </Label>

              <Input
                id="room-type-extra"
                type="number"
                min={0}
                value={
                  form.capacidad_extra
                }
                onChange={(event) =>
                  update(
                    'capacidad_extra',
                    Number(
                      event.target.value,
                    ),
                  )
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="room-type-size">
                Tamaño (m²)
              </Label>

              <Input
                id="room-type-size"
                type="number"
                min="0.01"
                step="0.01"
                value={form.tamano_m2}
                onChange={(event) =>
                  update(
                    'tamano_m2',
                    event.target.value,
                  )
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="room-type-price">
                Precio base
              </Label>

              <Input
                id="room-type-price"
                type="number"
                min="0"
                step="0.01"
                value={form.precio_base}
                onChange={(event) =>
                  update(
                    'precio_base',
                    event.target.value,
                  )
                }
                required
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="room-type-description">
                Descripción
              </Label>

              <Textarea
                id="room-type-description"
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
          </div>

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
                || form.hotel < 1
              }
            >
              {loading
                ? 'Guardando...'
                : 'Guardar tipo'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}