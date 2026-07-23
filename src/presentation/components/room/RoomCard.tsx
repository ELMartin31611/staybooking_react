import type { RateReference } from '@/domain/entities/rate-reference.entity'
import type { Room } from '@/domain/entities/room.entity'
import type { RoomImage } from '@/domain/entities/room-image.entity'


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
    <Card className="group overflow-hidden rounded-3xl border border-slate-200/60 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/15 dark:border-zinc-800/60">
      {mainImage ? (
        <div className="relative h-52 overflow-hidden bg-muted">
          <img
            src={mainImage.imagen_url}
            alt={
              mainImage.titulo ||
              `Habitación ${room.numero}`
            }
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        </div>
      ) : (
        <div className="flex h-52 items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-zinc-800 dark:to-zinc-900 text-muted-foreground">
          <p className="text-xs font-semibold">
            Sin imagen disponible
          </p>
        </div>
      )}

      <CardHeader className="p-6 pb-4 space-y-2">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="text-lg font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
            Habitación {room.numero}
          </CardTitle>

          <span className="shrink-0 rounded-full bg-primary/10 px-3 py-0.5 text-xs font-bold text-primary uppercase tracking-wider">
            {room.estado}
          </span>
        </div>

        <p className="text-xs font-semibold text-muted-foreground">
          Piso {room.piso}
        </p>
      </CardHeader>

      <CardContent className="px-6 pb-5 space-y-4">
        <p className="line-clamp-2 min-h-10 text-sm leading-relaxed text-muted-foreground font-medium">
          {room.descripcion ||
            'Sin descripción disponible.'}
        </p>

        <div className="flex flex-wrap gap-2 pt-1">
          <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-zinc-850 dark:text-zinc-400">
            {room.es_fumador
              ? '🚬 Permitido fumar'
              : '🚫 No fumadores'}
          </span>

          {rate && (
            <span className="inline-flex rounded-full bg-indigo-50 px-2.5 py-0.5 text-[10px] font-bold text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-400">
              Desde{' '}
              {formatPrice(
                rate.precio_noche,
                rate.moneda,
              )}
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter className="px-6 pb-6 border-t border-slate-100 dark:border-zinc-850 pt-4">
        <Button
          type="button"
          className="w-full rounded-xl bg-gradient-to-r from-primary to-[#d70466] font-semibold text-sm text-white hover:opacity-90 transition-all duration-200 active:scale-95 shadow-md shadow-primary/10 cursor-pointer"
          onClick={() => onViewDetail?.(room)}
          disabled={!onViewDetail}
        >
          Ver habitación
        </Button>
      </CardFooter>
    </Card>
  )
}