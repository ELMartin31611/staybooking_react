import {
  BedDouble,
  Trash2,
  Users,
} from 'lucide-react'
import { useState } from 'react'

import type { RoomSelection } from '@/domain/entities/room-selection.entity'
import { Badge } from '@/presentation/components/ui/badge'
import { Button } from '@/presentation/components/ui/button'
import {
  Card,
  CardContent,
} from '@/presentation/components/ui/card'
import { Input } from '@/presentation/components/ui/input'
import { Label } from '@/presentation/components/ui/label'

interface SelectedRoomCardProps {
  selection: RoomSelection

  onRemove: (
    roomId: number,
  ) => void

  onGuestsChange: (
    roomId: number,
    adults: number,
    children: number,
  ) => void
}

function money(
  value: number,
  currency: string,
): string {
  return new Intl.NumberFormat(
    'es-EC',
    {
      style: 'currency',
      currency,
    },
  ).format(value)
}

export default function SelectedRoomCard({
  selection,
  onRemove,
  onGuestsChange,
}: SelectedRoomCardProps) {
  const [error, setError] =
    useState<string | null>(null)

  const totalGuests =
    selection.adults
    + selection.children

  const extraGuests = Math.max(
    0,
    totalGuests
      - selection.includedGuestCapacity,
  )

  const roomPrice =
    selection.referencePricePerNight
    ?? 0

  const extraCharge =
    roomPrice * 0.5 * extraGuests

  const nightlyReference =
    roomPrice + extraCharge

  function updateGuests(
    adults: number,
    children: number,
  ) {
    try {
      onGuestsChange(
        selection.roomId,
        adults,
        children,
      )
      setError(null)
    } catch (caughtError: unknown) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : 'No fue posible actualizar los huéspedes.',
      )
    }
  }

  return (
    <Card className="group overflow-hidden rounded-3xl border-primary/15 shadow-sm transition hover:shadow-lg">
      <CardContent className="p-4">
        <div className="overflow-hidden rounded-2xl border border-border bg-muted shadow-sm">
          {selection.imageUrl ? (
            <img
              src={selection.imageUrl}
              alt={`Habitación ${selection.roomNumber}`}
              className="h-40 w-full object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-28 items-center justify-center bg-gradient-to-br from-primary/15 to-muted text-sm font-medium text-muted-foreground">
              Habitación {selection.roomNumber}
            </div>
          )}
        </div>
        <div className="pt-5">
        <div className="flex flex-wrap justify-between gap-4">
          <div>
            <Badge variant="secondary">
              Seleccionada
            </Badge>

            <h3 className="mt-2 text-xl font-semibold">
              {selection.roomTypeName}
            </h3>

            <p className="text-sm text-muted-foreground">
              Habitación física{' '}
              {selection.roomNumber}
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              onRemove(selection.roomId)
            }
          >
            <Trash2 className="size-4" />
            Eliminar
          </Button>
        </div>

        <div className="mt-5 grid gap-4 rounded-xl border bg-muted/20 p-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label
              htmlFor={`adults-${selection.roomId}`}
            >
              Adultos
            </Label>

            <Input
              id={`adults-${selection.roomId}`}
              type="number"
              min={1}
              max={selection.maxAdults}
              value={selection.adults}
              onChange={(event) =>
                updateGuests(
                  Number(event.target.value),
                  selection.children,
                )
              }
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor={`children-${selection.roomId}`}
            >
              Niños
            </Label>

            <Input
              id={`children-${selection.roomId}`}
              type="number"
              min={0}
              max={selection.maxChildren}
              value={selection.children}
              disabled={
                selection.maxChildren === 0
              }
              onChange={(event) =>
                updateGuests(
                  selection.adults,
                  Number(event.target.value),
                )
              }
            />
          </div>
        </div>

        {error && (
          <p className="mt-3 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
            {error}
          </p>
        )}

        <div className="mt-5 space-y-3 border-t pt-4">
          <div className="flex items-center gap-2 text-sm">
            <Users className="size-4 text-primary" />

            <span>
              Incluye hasta{' '}
              <strong>
                {selection.includedGuestCapacity}
              </strong>{' '}
              huésped(es).
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <BedDouble className="size-4 text-primary" />

            <span>
              Permite{' '}
              <strong>
                {selection.extraGuestCapacity}
              </strong>{' '}
              huésped(es) extra.
            </span>
          </div>

          {selection.referencePricePerNight !== null && (
            <div className="rounded-xl bg-muted/40 p-4">
              <div className="flex justify-between gap-3 text-sm">
                <span>
                  Habitación por noche
                </span>

                <strong>
                  {money(
                    roomPrice,
                    selection.currency,
                  )}
                </strong>
              </div>

              <div className="mt-2 flex justify-between gap-3 text-sm">
                <span>
                  {extraGuests} huésped(es) extra
                </span>

                <strong>
                  {money(
                    extraCharge,
                    selection.currency,
                  )}
                </strong>
              </div>

              <div className="mt-3 flex justify-between border-t pt-3">
                <span>
                  Referencia por noche
                </span>

                <strong className="text-xl">
                  {money(
                    nightlyReference,
                    selection.currency,
                  )}
                </strong>
              </div>

              {extraGuests > 0 && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Cada huésped extra añade el
                  50% del precio de la habitación.
                </p>
              )}
            </div>
          )}
        </div>
        </div>
      </CardContent>
    </Card>
  )
}