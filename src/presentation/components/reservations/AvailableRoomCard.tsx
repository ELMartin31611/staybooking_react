import {
  BedDouble,
  Building2,
  Users,
} from 'lucide-react'

import type { Room } from '@/domain/entities/room.entity'
import { Badge } from '@/presentation/components/ui/badge'
import { Button } from '@/presentation/components/ui/button'
import {
  Card,
  CardContent,
} from '@/presentation/components/ui/card'

interface AvailableRoomCardProps {
  room: Room
  pricePerNight: number | null
  currency: string
  isSelected: boolean
  onSelect: () => void
}

function formatMoney(
  amount: number,
  currency: string,
): string {
  try {
    return new Intl.NumberFormat(
      'es-EC',
      {
        style: 'currency',
        currency,
      },
    ).format(amount)
  } catch {
    return `${amount.toFixed(2)} ${currency}`
  }
}

export default function AvailableRoomCard({
  room,
  pricePerNight,
  currency,
  isSelected,
  onSelect,
}: AvailableRoomCardProps) {
  const roomTypeName =
    room.tipo_habitacion_nombre
    || `Tipo de habitación #${room.tipo_habitacion}`

  const hasCapacity =
    room.capacidad_total !== undefined
    || room.capacidad_adultos !== undefined
    || room.capacidad_ninos !== undefined

  return (
    <Card className="overflow-hidden">
      <CardContent className="grid gap-5 p-5 md:grid-cols-[minmax(0,1fr)_220px] md:items-center">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="secondary">
              Disponible
            </Badge>

            <span className="text-sm text-muted-foreground">
              Habitación {room.numero}
            </span>
          </div>

          <h3 className="mt-3 text-xl font-semibold">
            {roomTypeName}
          </h3>

          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <Building2 className="size-4 text-primary" />
              Piso {room.piso}
            </span>

            <span className="flex items-center gap-2">
              <BedDouble className="size-4 text-primary" />
              Habitación física {room.numero}
            </span>

            {hasCapacity && (
              <span className="flex items-center gap-2">
                <Users className="size-4 text-primary" />

                Máximo{' '}
                {room.capacidad_total ?? 'por confirmar'}{' '}
                huésped(es)
              </span>
            )}
          </div>

          {hasCapacity && (
            <p className="mt-3 text-sm text-muted-foreground">
              Capacidad: {
                room.capacidad_adultos ?? 0
              } adulto(s) y {
                room.capacidad_ninos ?? 0
              } niño(s).
            </p>
          )}

          <p className="mt-4 text-sm text-muted-foreground">
            {room.descripcion
              || 'Sin descripción adicional.'}
          </p>

          {room.es_fumador && (
            <p className="mt-2 text-xs font-medium text-amber-700">
              Habitación para fumadores
            </p>
          )}
        </div>

        <div className="rounded-2xl bg-muted/50 p-5">
          <p className="text-sm text-muted-foreground">
            Precio referencial por noche
          </p>

          {pricePerNight !== null ? (
            <>
              <p className="mt-2 text-2xl font-bold">
                {formatMoney(
                  pricePerNight,
                  currency,
                )}
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                El total definitivo será calculado
                por el backend.
              </p>
            </>
          ) : (
            <p className="mt-2 text-sm font-medium text-destructive">
              Sin tarifa activa para las fechas
              seleccionadas.
            </p>
          )}

          <Button
            type="button"
            className="mt-5 w-full"
            variant={
              isSelected
                ? 'secondary'
                : 'default'
            }
            onClick={onSelect}
            disabled={
              isSelected
              || pricePerNight === null
            }
          >
            {isSelected
              ? 'Habitación seleccionada'
              : 'Seleccionar habitación'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}