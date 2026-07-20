import type { RoomSelection } from '@/domain/entities/room-selection.entity'
import { Badge } from '@/presentation/components/ui/badge'
import { Button } from '@/presentation/components/ui/button'

interface SelectedRoomCardProps {
  selection: RoomSelection
  onRemove: (roomId: number) => void

  onQuantityChange?: (
    roomId: number,
    quantity: number,
  ) => void
}

export default function SelectedRoomCard({
  selection,
  onRemove,
}: SelectedRoomCardProps) {
  return (
    <article className="overflow-hidden rounded-2xl border bg-card shadow-sm">
      <div className="grid gap-5 p-5 sm:grid-cols-[170px_1fr]">
        <div className="h-40 overflow-hidden rounded-xl bg-muted sm:h-full">
          {selection.imageUrl ? (
            <img
              src={selection.imageUrl}
              alt={selection.roomTypeName}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full min-h-40 items-center justify-center p-4 text-center text-sm text-muted-foreground">
              Imagen no disponible
            </div>
          )}
        </div>

        <div className="flex flex-col justify-between gap-5">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="secondary">
                Seleccionada
              </Badge>

              <span className="text-sm text-muted-foreground">
                Habitación física {
                  selection.roomNumber
                }
              </span>
            </div>

            <h2 className="mt-3 text-xl font-semibold">
              {selection.roomTypeName}
            </h2>

            <p className="mt-3 text-sm text-muted-foreground">
              Hotel #{selection.hotelId}
            </p>
          </div>

          <div className="flex flex-col gap-4 border-t pt-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Precio referencial por noche
              </p>

              <p className="mt-1 text-xl font-bold">
                ${selection.pricePerNight.toFixed(2)}
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                Una selección corresponde a una sola
                habitación real.
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={() =>
                onRemove(selection.roomId)
              }
            >
              Eliminar
            </Button>
          </div>
        </div>
      </div>
    </article>
  )
}