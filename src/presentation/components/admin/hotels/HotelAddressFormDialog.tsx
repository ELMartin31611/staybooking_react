import {
  useEffect,
  useState,
} from 'react'

import type {
  AdminHotel,
  AdminHotelAddress,
  SaveHotelAddressInput,
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
  address: AdminHotelAddress | null
  hotels: AdminHotel[]
  loading: boolean
  onOpenChange: (
    open: boolean,
  ) => void
  onSave: (
    input: SaveHotelAddressInput,
  ) => Promise<void>
}

const emptyForm: SaveHotelAddressInput = {
  hotel: 0,
  provincia: '',
  ciudad: '',
  direccion: '',
  referencia: '',
  latitud: '0.0000000',
  longitud: '0.0000000',
}

export default function HotelAddressFormDialog({
  open,
  address,
  hotels,
  loading,
  onOpenChange,
  onSave,
}: Props) {
  const [
    form,
    setForm,
  ] = useState<SaveHotelAddressInput>(
    emptyForm,
  )

  useEffect(() => {
    if (!open) {
      return
    }

    setForm(
      address
        ? {
            hotel: address.hotel,
            provincia: address.provincia,
            ciudad: address.ciudad,
            direccion: address.direccion,
            referencia: address.referencia,
            latitud: address.latitud,
            longitud: address.longitud,
          }
        : {
            ...emptyForm,
            hotel: hotels[0]?.id ?? 0,
          },
    )
  }, [
    address,
    hotels,
    open,
  ])

  function update<
    K extends keyof SaveHotelAddressInput,
  >(
    key: K,
    value: SaveHotelAddressInput[K],
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }))
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {address
              ? 'Editar dirección'
              : 'Agregar dirección'}
          </DialogTitle>

          <DialogDescription>
            Registra una ubicación real
            asociada con un hotel.
          </DialogDescription>
        </DialogHeader>

        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault()
            void onSave(form)
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="address-hotel">
              Hotel
            </Label>

            <select
              id="address-hotel"
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

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="address-province">
                Provincia
              </Label>

              <Input
                id="address-province"
                value={form.provincia}
                onChange={(event) =>
                  update(
                    'provincia',
                    event.target.value,
                  )
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address-city">
                Ciudad
              </Label>

              <Input
                id="address-city"
                value={form.ciudad}
                onChange={(event) =>
                  update(
                    'ciudad',
                    event.target.value,
                  )
                }
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address-line">
              Dirección
            </Label>

            <Input
              id="address-line"
              value={form.direccion}
              onChange={(event) =>
                update(
                  'direccion',
                  event.target.value,
                )
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address-reference">
              Referencia
            </Label>

            <Textarea
              id="address-reference"
              value={form.referencia}
              onChange={(event) =>
                update(
                  'referencia',
                  event.target.value,
                )
              }
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="address-latitude">
                Latitud
              </Label>

              <Input
                id="address-latitude"
                type="number"
                step="0.0000001"
                value={form.latitud}
                onChange={(event) =>
                  update(
                    'latitud',
                    event.target.value,
                  )
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address-longitude">
                Longitud
              </Label>

              <Input
                id="address-longitude"
                type="number"
                step="0.0000001"
                value={form.longitud}
                onChange={(event) =>
                  update(
                    'longitud',
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
                : 'Guardar dirección'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}