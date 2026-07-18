import { Search } from 'lucide-react'

import { Input } from '@/presentation/components/ui/input'

interface HotelSearchProps {
  value: string
  onChange: (value: string) => void
}

export function HotelSearch({
  value,
  onChange,
}: HotelSearchProps) {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-medium">
        <Search className="size-4 text-primary" />
        Buscar hotel
      </label>

      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Nombre o descripción"
      />
    </div>
  )
}
