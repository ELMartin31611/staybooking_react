import { Filter } from 'lucide-react'

import type { HotelStatusFilter } from '@/domain/entities/hotel-filters.entity'

interface HotelFiltersProps {
  stars: number | null
  pets: boolean | null
  status: HotelStatusFilter | null
  onStarsChange: (value: number | null) => void
  onPetsChange: (value: boolean | null) => void
  onStatusChange: (value: HotelStatusFilter | null) => void
}

export function HotelFilters({
  stars,
  pets,
  status,
  onStarsChange,
  onPetsChange,
  onStatusChange,
}: HotelFiltersProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium">
          <Filter className="size-4 text-primary" />
          Estrellas
        </label>

        <select
          value={stars ?? ''}
          onChange={(event) => {
            const value = event.target.value
            onStarsChange(value === '' ? null : Number(value))
          }}
          className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
        >
          <option value="">Todas</option>
          <option value="5">5 estrellas</option>
          <option value="4">4 estrellas</option>
          <option value="3">3 estrellas</option>
          <option value="2">2 estrellas</option>
          <option value="1">1 estrella</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium">
          <Filter className="size-4 text-primary" />
          Mascotas
        </label>

        <select
          value={pets === null ? '' : String(pets)}
          onChange={(event) => {
            const value = event.target.value
            if (value === '') {
              onPetsChange(null)
              return
            }

            onPetsChange(value === 'true')
          }}
          className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
        >
          <option value="">Todas</option>
          <option value="true">Acepta mascotas</option>
          <option value="false">No acepta mascotas</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium">
          <Filter className="size-4 text-primary" />
          Estado
        </label>

        <select
          value={status ?? ''}
          onChange={(event) => {
            const value = event.target.value
            onStatusChange(
              value === ''
                ? null
                : (value as HotelStatusFilter),
            )
          }}
          className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
        >
          <option value="">Todos</option>
          <option value="ACTIVO">Activo</option>
          <option value="INACTIVO">Inactivo</option>
        </select>
      </div>
    </div>
  )
}
