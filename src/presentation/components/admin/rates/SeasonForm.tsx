import {
  useEffect,
  useState,
} from 'react'
import type { FormEvent } from 'react'
import { Loader2 } from 'lucide-react'

import type {
  SaveSeasonInput,
  Season,
} from '@/domain/entities/season.entity'
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
import { Textarea } from '@/presentation/components/ui/textarea'

interface SeasonFormProps {
  season?: Season | null
  isSubmitting: boolean
  onSubmit: (
    data: SaveSeasonInput,
  ) => Promise<void>
  onCancel?: () => void
}

const EMPTY_FORM: SaveSeasonInput = {
  nombre: '',
  fecha_inicio: '',
  fecha_fin: '',
  porcentaje_incremento: '0.00',
  descripcion: null,
  is_active: true,
}

function createFormState(
  season?: Season | null,
): SaveSeasonInput {
  if (!season) {
    return {
      ...EMPTY_FORM,
    }
  }

  return {
    nombre: season.nombre,
    fecha_inicio: season.fecha_inicio,
    fecha_fin: season.fecha_fin,
    porcentaje_incremento:
      season.porcentaje_incremento,
    descripcion: season.descripcion,
    is_active: season.is_active,
  }
}

export default function SeasonForm({
  season = null,
  isSubmitting,
  onSubmit,
  onCancel,
}: SeasonFormProps) {
  const [form, setForm] =
    useState<SaveSeasonInput>(
      createFormState(season),
    )

  const [error, setError] = useState('')

  const isEditing = season !== null

  useEffect(() => {
    setForm(
      createFormState(season),
    )
    setError('')
  }, [season])

  function updateField<
    Key extends keyof SaveSeasonInput,
  >(
    field: Key,
    value: SaveSeasonInput[Key],
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
          : 'No fue posible guardar la temporada.',
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
    <Card className="overflow-hidden rounded-3xl border-primary/15 shadow-sm">
      <CardHeader className="border-b bg-gradient-to-br from-primary/10 via-card to-card p-6">
        <p className="text-xs font-bold uppercase tracking-widest text-primary">
          Configuración de calendario
        </p>
        <CardTitle className="mt-2 text-2xl">
          {isEditing
            ? 'Editar temporada'
            : 'Nueva temporada'}
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6">
        <form
          className="grid gap-5 sm:grid-cols-2"
          onSubmit={handleSubmit}
        >
          <div className="space-y-2 rounded-2xl border bg-muted/20 p-4 sm:col-span-2">
            <Label htmlFor="season-name">
              Nombre
            </Label>

            <Input
              id="season-name"
              value={form.nombre}
              onChange={(event) =>
                updateField(
                  'nombre',
                  event.target.value,
                )
              }
              placeholder="Temporada alta"
              maxLength={150}
              disabled={isSubmitting}
              required
            />
          </div>

          <div className="space-y-2 rounded-2xl border bg-card p-4">
            <Label htmlFor="season-start">
              Fecha de inicio
            </Label>

            <Input
              id="season-start"
              type="date"
              value={form.fecha_inicio}
              onChange={(event) =>
                updateField(
                  'fecha_inicio',
                  event.target.value,
                )
              }
              disabled={isSubmitting}
              required
            />
          </div>

          <div className="space-y-2 rounded-2xl border bg-card p-4">
            <Label htmlFor="season-end">
              Fecha de finalización
            </Label>

            <Input
              id="season-end"
              type="date"
              min={form.fecha_inicio || undefined}
              value={form.fecha_fin}
              onChange={(event) =>
                updateField(
                  'fecha_fin',
                  event.target.value,
                )
              }
              disabled={isSubmitting}
              required
            />

            <p className="text-xs text-muted-foreground">
              La fecha final es exclusiva.
            </p>
          </div>

          <div className="space-y-2 rounded-2xl border bg-card p-4 sm:col-span-2">
            <Label htmlFor="season-increase">
              Incremento porcentual informativo
            </Label>

            <Input
              id="season-increase"
              type="number"
              min="0"
              step="0.01"
              value={form.porcentaje_incremento}
              onChange={(event) =>
                updateField(
                  'porcentaje_incremento',
                  event.target.value,
                )
              }
              disabled={isSubmitting}
              required
            />
            <p className="text-xs text-muted-foreground">
              La tarifa final se define en cada tarifa de habitación; este
              valor sirve como referencia de temporada.
            </p>
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="season-description">
              Descripción
            </Label>

            <Textarea
              id="season-description"
              value={form.descripcion ?? ''}
              onChange={(event) =>
                updateField(
                  'descripcion',
                  event.target.value || null,
                )
              }
              placeholder="Descripción opcional"
              disabled={isSubmitting}
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

            Temporada activa
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
              disabled={isSubmitting}
            >
              {isSubmitting && (
                <Loader2 className="size-4 animate-spin" />
              )}

              {isEditing
                ? 'Guardar cambios'
                : 'Crear temporada'}
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