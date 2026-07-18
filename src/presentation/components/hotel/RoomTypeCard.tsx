import type { RoomType } from '@/domain/entities/room-type.entity'

interface RoomTypeCardProps {
  roomType: RoomType
}

export default function RoomTypeCard({
  roomType,
}: RoomTypeCardProps) {
  return (
    <article className="flex h-full flex-col rounded-2xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-xl font-semibold">
          {roomType.nombre}
        </h3>

        <span className="shrink-0 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          {roomType.estado || 'Disponible'}
        </span>
      </div>

      <p className="mt-4 flex-1 leading-7 text-muted-foreground">
        {roomType.descripcion ||
          'Este tipo de habitación no tiene una descripción disponible.'}
      </p>

      <div className="mt-6 grid grid-cols-3 gap-3">
        <CapacityItem
          label="Adultos"
          value={roomType.capacidad_adultos}
        />

        <CapacityItem
          label="Niños"
          value={roomType.capacidad_ninos}
        />

        <CapacityItem
          label="Total"
          value={roomType.capacidad_total}
        />
      </div>
    </article>
  )
}

interface CapacityItemProps {
  label: string
  value: number
}

function CapacityItem({
  label,
  value,
}: CapacityItemProps) {
  return (
    <div className="rounded-xl bg-muted p-3 text-center">
      <p className="text-xl font-bold">
        {value ?? 0}
      </p>

      <p className="mt-1 text-xs text-muted-foreground">
        {label}
      </p>
    </div>
  )
}