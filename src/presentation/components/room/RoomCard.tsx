import type { RateReference } from '@/domain/entities/rate-reference.entity'
import type { Room } from '@/domain/entities/room.entity'
import type { RoomImage } from '@/domain/entities/room-image.entity'
import { Badge } from '@/presentation/components/ui/badge'
import { Button } from '@/presentation/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/presentation/components/ui/card'

interface RoomCardProps {
  room: Room
  images: RoomImage[]
  rates: RateReference[]
  onViewDetail?: (room: Room) => void
}

function formatPrice(
  value: string,
  currency: string,
): string {
  const amount = Number(value)

  if (Number.isNaN(amount)) {
    return `${value} ${currency}`
  }

  return new Intl.NumberFormat('es-EC', {
    style: 'currency',
    currency,
  }).format(amount)
}

export default function RoomCard({
  room,
  images,
  rates,
  onViewDetail,
}: RoomCardProps) {
  const roomImages = images.filter(
    (image) => image.habitacion === room.id,
  )

  const mainImage =
    roomImages.find((image) => image.es_principal) ??
    roomImages[0]

  const rate = rates.find(
    (item) =>
      item.tipo_habitacion ===
        room.tipo_habitacion && item.is_active,
  )

  return (
    <Card className="overflow-hidden">
      {mainImage ? (
        <img
          src={mainImage.imagen_url}
          alt={
            mainImage.titulo ||
            `Habitación ${room.numero}`
          }
          className="h-52 w-full object-cover"
        />
      ) : (
        <div className="flex h-52 items-center justify-center bg-muted">
          <p className="text-sm text-muted-foreground">
            Sin imagen disponible
          </p>
        </div>
      )}

      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <CardTitle>
            Habitación {room.numero}
          </CardTitle>

          <Badge variant="secondary">
            {room.estado}
          </Badge>
        </div>

        <p className="text-sm text-muted-foreground">
          Piso {room.piso}
        </p>
      </CardHeader>

      <CardContent className="space-y-3">
        <p className="line-clamp-3 text-sm">
          {room.descripcion ||
            'Sin descripción disponible.'}
        </p>

        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">
            {room.es_fumador
              ? 'Permite fumar'
              : 'No fumadores'}
          </Badge>

          {rate && (
            <Badge variant="outline">
              Desde{' '}
              {formatPrice(
                rate.precio_noche,
                rate.moneda,
              )}
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter>
        <Button
          type="button"
          className="w-full"
          onClick={() => onViewDetail?.(room)}
          disabled={!onViewDetail}
        >
          Ver habitación
        </Button>
      </CardFooter>
    </Card>
  )
}