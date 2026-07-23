import { Search } from 'lucide-react'

import { Input } from '@/presentation/components/ui/input'

interface HotelSearchProps {
  value: string
  onChange: (value: string) => void
}

export function HotelSearch({ value, onChange }: HotelSearchProps) {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
        <Search className="size-3.5 text-primary" />
        Buscar hotel
      </label>

      <div className="relative">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/60" />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Escribe el nombre o descripción del alojamiento..."
          className="h-11 w-full rounded-xl border-border bg-background pl-10 pr-4 text-sm font-semibold text-foreground placeholder:text-muted-foreground/60 transition-all focus:border-primary focus:ring-2 focus:ring-primary/15 dark:bg-muted/40"
        />
      </div>
    </div>
  )
}
