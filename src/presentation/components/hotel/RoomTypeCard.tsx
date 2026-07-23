import type { RoomType } from '@/domain/entities/room-type.entity'

interface RoomTypeCardProps {
  roomType: RoomType
}

export default function RoomTypeCard({
  roomType,
}: RoomTypeCardProps) {
  return (
    <article className="flex h-full flex-col rounded-3xl border border-slate-200/60 bg-card p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-primary/15 dark:border-zinc-800/60">
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-lg font-bold tracking-tight text-foreground">
          {roomType.nombre}
        </h3>

        <div className="flex flex-wrap justify-end gap-2">
          {roomType.categoria && (
            <span className="shrink-0 rounded-full bg-accent px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-accent-foreground">
              {roomType.categoria}
            </span>
          )}
          <span className="shrink-0 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary uppercase tracking-wider">
            {roomType.estado || 'Disponible'}
          </span>
        </div>
      </div>

      <p className="mt-3.5 flex-1 text-sm leading-relaxed text-muted-foreground font-medium">
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
    <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-3 text-center dark:border-zinc-800 dark:bg-zinc-950/40">
      <p className="text-xl font-extrabold text-foreground">
        {value ?? 0}
      </p>

      <p className="mt-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
        {label}
      </p>
    </div>
  )
}