import type { Bed } from '@/domain/entities/bed.entity'
import type { RoomTypeBed } from '@/domain/entities/room-type-bed.entity'

interface RoomCapacityProps {
  roomTypeId: number
  beds: Bed[]
  roomTypeBeds: RoomTypeBed[]
}

export default function RoomCapacity({
  roomTypeId,
  beds,
  roomTypeBeds,
}: RoomCapacityProps) {
  const capacity = roomTypeBeds
    .filter(
      (roomTypeBed) =>
        roomTypeBed.tipo_habitacion === roomTypeId,
    )
    .reduce((total, roomTypeBed) => {
      const bed = beds.find(
        (item) => item.id === roomTypeBed.cama,
      )

      if (!bed) {
        return total
      }

      return (
        total +
        bed.capacidad_personas * roomTypeBed.cantidad
      )
    }, 0)

  return (
    <p className="text-sm text-muted-foreground">
      Capacidad:{' '}
      <span className="font-medium text-foreground">
        {capacity > 0
          ? `${capacity} ${
              capacity === 1 ? 'persona' : 'personas'
            }`
          : 'No especificada'}
      </span>
    </p>
  )
}