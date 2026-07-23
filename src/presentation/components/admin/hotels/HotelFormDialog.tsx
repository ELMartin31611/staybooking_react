import {
  useEffect,
  useState,
} from 'react'

import type {
  AdminHotel,
  SaveHotelInput,
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

interface HotelFormDialogProps {
  open: boolean
  hotel: AdminHotel | null
  loading: boolean
  onOpenChange: (
    open: boolean,
  ) => void
  onSave: (
    input: SaveHotelInput,
  ) => Promise<void>
}

const emptyForm: SaveHotelInput = {
  nombre: '',
  ruc: '',
  telefono: '',
  email: '',
  descripcion: '',
  categoria_estrellas: 3,
  sitio_web: '',
  logo: null,
  estado: 'activo',
  hora_check_in: '14:00',
  hora_check_out: '12:00',
  permite_mascotas: false,
  edad_minima_reserva: 18,
  politica_cancelacion: '',
}

function fromHotel(
  hotel: AdminHotel,
): SaveHotelInput {
  return {
    nombre: hotel.nombre,
    ruc: hotel.ruc,
    telefono: hotel.telefono,
    email: hotel.email,
    descripcion: hotel.descripcion,
    categoria_estrellas:
      hotel.categoria_estrellas,
    sitio_web: hotel.sitio_web ?? '',
    logo: null,
    estado: hotel.estado,
    hora_check_in:
      hotel.hora_check_in.slice(0, 5),
    hora_check_out:
      hotel.hora_check_out.slice(0, 5),
    permite_mascotas:
      hotel.permite_mascotas,
    edad_minima_reserva:
      hotel.edad_minima_reserva,
    politica_cancelacion:
      hotel.politica_cancelacion,
  }
}

export default function HotelFormDialog({
  open,
  hotel,
  loading,
  onOpenChange,
  onSave,
}: HotelFormDialogProps) {
  const [
    form,
    setForm,
  ] = useState<SaveHotelInput>(
    emptyForm,
  )

  useEffect(() => {
    if (!open) {
      return
    }

    setForm(
      hotel
        ? fromHotel(hotel)
        : emptyForm,
    )
  }, [
    hotel,
    open,
  ])

  function update<
    K extends keyof SaveHotelInput,
  >(
    key: K,
    value: SaveHotelInput[K],
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }))
  }

  async function handleSubmit(
    event:
      React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()
    await onSave(form)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {hotel
              ? 'Editar hotel'
              : 'Crear hotel'}
          </DialogTitle>

          <DialogDescription>
            Completa la información comercial
            y operativa. El logo se carga como
            archivo.
          </DialogDescription>
        </DialogHeader>

        <form
          className="space-y-5"
          onSubmit={handleSubmit}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="hotel-name">
                Nombre
              </Label>

              <Input
                id="hotel-name"
                value={form.nombre}
                onChange={(event) =>
                  update(
                    'nombre',
                    event.target.value,
                  )
                }
                required
                maxLength={150}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hotel-ruc">
                RUC
              </Label>

              <Input
                id="hotel-ruc"
                value={form.ruc}
                onChange={(event) =>
                  update(
                    'ruc',
                    event.target.value,
                  )
                }
                required
                maxLength={20}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hotel-phone">
                Teléfono
              </Label>

              <Input
                id="hotel-phone"
                value={form.telefono}
                onChange={(event) =>
                  update(
                    'telefono',
                    event.target.value,
                  )
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hotel-email">
                Correo
              </Label>

              <Input
                id="hotel-email"
                type="email"
                value={form.email}
                onChange={(event) =>
                  update(
                    'email',
                    event.target.value,
                  )
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hotel-stars">
                Categoría
              </Label>

              <select
                id="hotel-stars"
                className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm"
                value={
                  form.categoria_estrellas
                }
                onChange={(event) =>
                  update(
                    'categoria_estrellas',
                    Number(
                      event.target.value,
                    ),
                  )
                }
              >
                {[
                  1,
                  2,
                  3,
                  4,
                  5,
                ].map((stars) => (
                  <option
                    key={stars}
                    value={stars}
                  >
                    {stars} estrella(s)
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="hotel-status">
                Estado
              </Label>

              <select
                id="hotel-status"
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

                <option value="mantenimiento">
                  Mantenimiento
                </option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="hotel-check-in">
                Hora de entrada
              </Label>

              <Input
                id="hotel-check-in"
                type="time"
                value={form.hora_check_in}
                onChange={(event) =>
                  update(
                    'hora_check_in',
                    event.target.value,
                  )
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hotel-check-out">
                Hora de salida
              </Label>

              <Input
                id="hotel-check-out"
                type="time"
                value={form.hora_check_out}
                onChange={(event) =>
                  update(
                    'hora_check_out',
                    event.target.value,
                  )
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hotel-minimum-age">
                Edad mínima para reservar
              </Label>

              <Input
                id="hotel-minimum-age"
                type="number"
                min={18}
                max={100}
                value={
                  form.edad_minima_reserva
                }
                onChange={(event) =>
                  update(
                    'edad_minima_reserva',
                    Number(
                      event.target.value,
                    ),
                  )
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hotel-website">
                Sitio web (opcional)
              </Label>

              <Input
                id="hotel-website"
                type="url"
                value={form.sitio_web}
                onChange={(event) =>
                  update(
                    'sitio_web',
                    event.target.value,
                  )
                }
                placeholder="https://"
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="hotel-logo">
                {hotel
                  ? 'Cambiar logo (opcional)'
                  : 'Logo del hotel'}
              </Label>

              <Input
                id="hotel-logo"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={(event) =>
                  update(
                    'logo',
                    event.target.files?.[0]
                      ?? null,
                  )
                }
                required={!hotel}
              />

              <p className="text-xs text-muted-foreground">
                PNG, JPG o WebP. Máximo
                2 MB.
              </p>
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="hotel-description">
                Descripción
              </Label>

              <Textarea
                id="hotel-description"
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
              <Label htmlFor="hotel-policy">
                Política de cancelación
              </Label>

              <Textarea
                id="hotel-policy"
                rows={3}
                value={
                  form.politica_cancelacion
                }
                onChange={(event) =>
                  update(
                    'politica_cancelacion',
                    event.target.value,
                  )
                }
                required
              />
            </div>

            <label className="flex items-center gap-3 rounded-lg border p-3 sm:col-span-2">
              <input
                type="checkbox"
                checked={
                  form.permite_mascotas
                }
                onChange={(event) =>
                  update(
                    'permite_mascotas',
                    event.target.checked,
                  )
                }
              />

              <span className="text-sm font-medium">
                El hotel permite mascotas
              </span>
            </label>
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
              disabled={loading}
            >
              {loading
                ? 'Guardando...'
                : hotel
                  ? 'Guardar cambios'
                  : 'Crear hotel'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}