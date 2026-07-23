import type { Bed } from '@/domain/entities/bed.entity'
import type { RoomTypeBed } from '@/domain/entities/room-type-bed.entity'
import { Badge } from '@/presentation/components/ui/badge'

interface BedListProps {
  roomTypeId: number
  beds: Bed[]
  roomTypeBeds: RoomTypeBed[]
}

export default function BedList({
  roomTypeId,
  beds,
  roomTypeBeds,
}: BedListProps) {
  const assignedBeds = roomTypeBeds
    .filter(
      (relation) =>
        relation.tipo_habitacion === roomTypeId,
    )
    .map((relation) => ({
      relation,
      bed: beds.find(
        (item) => item.id === relation.cama,
      ),
    }))
    .filter(
      (
        item,
      ): item is {
        relation: RoomTypeBed
        bed: Bed
      } => Boolean(item.bed),
    )

  if (assignedBeds.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No hay camas registradas para este tipo de
        habitación.
      </p>
    )
  }

  return (
    <div className="space-y-3">
      <h3 className="font-semibold">Camas</h3>

      <div className="flex flex-wrap gap-2">
        {assignedBeds.map(({ relation, bed }) => (
          <Badge
            key={relation.id}
            variant="secondary"
            className="px-3 py-1"
          >
            {relation.cantidad} × {bed.nombre}
          </Badge>
        ))}
      </div>
    </div>
  )
}