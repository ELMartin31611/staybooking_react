import { Filter, Star, Sparkles } from 'lucide-react'

import type { HotelStatusFilter } from '@/domain/entities/hotel-filters.entity'

interface HotelFiltersProps {
  stars: number | null
  pets: boolean | null
  status: HotelStatusFilter | null
  onStarsChange: (value: number | null) => void
  onPetsChange: (value: boolean | null) => void
  onStatusChange: (value: HotelStatusFilter | null) => void
}

const selectClass =
  'h-11 w-full appearance-none rounded-xl border border-border bg-background px-3.5 pr-10 text-sm font-semibold text-foreground outline-none transition-all hover:border-primary/40 focus:border-primary focus:ring-2 focus:ring-primary/15 dark:bg-muted/40'

export function HotelFilters({
  stars,
  pets,
  status,
  onStarsChange,
  onPetsChange,
  onStatusChange,
}: HotelFiltersProps) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3">
      {/* Estrellas */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
          <Star className="size-3.5 fill-amber-400 text-amber-400" />
          Estrellas
        </label>
        <select
          value={stars ?? ''}
          onChange={(e) => {
            const v = e.target.value
            onStarsChange(v === '' ? null : Number(v))
          }}
          className={selectClass}
        >
          <option value="">Todas las estrellas</option>
          <option value="5">⭐⭐⭐⭐⭐ 5 estrellas</option>
          <option value="4">⭐⭐⭐⭐ 4 estrellas</option>
          <option value="3">⭐⭐⭐ 3 estrellas</option>
          <option value="2">⭐⭐ 2 estrellas</option>
          <option value="1">⭐ 1 estrella</option>
        </select>
      </div>

      {/* Mascotas */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
          <Sparkles className="size-3.5 text-primary" />
          Mascotas
        </label>
        <select
          value={pets === null ? '' : String(pets)}
          onChange={(e) => {
            const v = e.target.value
            if (v === '') { onPetsChange(null); return }
            onPetsChange(v === 'true')
          }}
          className={selectClass}
        >
          <option value="">Cualquier política</option>
          <option value="true">🐾 Acepta mascotas</option>
          <option value="false">🚫 No acepta mascotas</option>
        </select>
      </div>

      {/* Estado */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
          <Filter className="size-3.5 text-primary" />
          Estado del Hotel
        </label>
        <select
          value={status ?? ''}
          onChange={(e) => {
            const v = e.target.value
            onStatusChange(v === '' ? null : (v as HotelStatusFilter))
          }}
          className={selectClass}
        >
          <option value="">Todos los estados</option>
          <option value="ACTIVO">Activos únicamente</option>
          <option value="INACTIVO">Inactivos únicamente</option>
        </select>
      </div>
    </div>
  )
}
