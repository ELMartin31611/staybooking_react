import { Hotel as HotelIcon, MapPin, Star } from 'lucide-react'

import type { HotelPreview } from '@/domain/entities/hotel-preview.entity'
import { Button } from '@/presentation/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
} from '@/presentation/components/ui/card'

interface HotelPreviewCardProps {
  hotel: HotelPreview
  onViewHotel: (hotel: HotelPreview) => void
  onReserve: (hotel: HotelPreview) => void
}

export function HotelPreviewCard({
  hotel,
  onViewHotel,
  onReserve,
}: HotelPreviewCardProps) {
  const stars = Math.max(0, Math.min(5, hotel.categoria_estrellas))

  return (
    <Card className="group relative flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10">

      {/* ─── Imagen ─────────────────────────────── */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {hotel.logo_url ? (
          <img
            src={hotel.logo_url}
            alt={`Imagen de ${hotel.nombre}`}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-muted">
            <HotelIcon className="size-12 text-primary/30" />
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Sin imagen
            </span>
          </div>
        )}

        {/* Overlay gradiente para legibilidad de badges */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />

        {/* Estado badge — arriba derecha */}
        <span className="absolute right-3 top-3 rounded-full border border-white/25 bg-black/45 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur-sm">
          {hotel.estado || 'Disponible'}
        </span>

        {/* Estrellas — abajo izquierda sobre imagen */}
        <div
          className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full border border-white/20 bg-black/45 px-2.5 py-1 backdrop-blur-sm"
          aria-label={`${stars} estrellas`}
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={[
                'size-3',
                i < stars ? 'fill-amber-400 text-amber-400' : 'fill-white/20 text-white/20',
              ].join(' ')}
            />
          ))}
        </div>
      </div>

      {/* ─── Contenido ──────────────────────────── */}
      <CardContent className="flex flex-1 flex-col gap-3 p-5">
        {/* Nombre */}
        <h3 className="line-clamp-1 text-base font-bold text-foreground transition-colors duration-200 group-hover:text-primary">
          {hotel.nombre}
        </h3>

        {/* Descripción */}
        <p className="line-clamp-2 flex-1 text-sm leading-6 text-muted-foreground">
          {hotel.descripcion || 'Conoce este hotel y sus habitaciones premium.'}
        </p>

        {/* Tags con baja opacidad para no competir con imagen */}
        <div className="flex flex-wrap gap-1.5">
          {hotel.permite_mascotas ? (
            <span className="inline-flex items-center gap-1 rounded-full border border-primary/15 bg-primary/6 px-2.5 py-0.5 text-[11px] font-semibold text-primary dark:bg-primary/10">
              🐾 Mascotas
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full border border-border bg-muted/50 px-2.5 py-0.5 text-[11px] font-semibold text-muted-foreground">
              Sin mascotas
            </span>
          )}
          <span className="inline-flex items-center gap-1 rounded-full border border-border bg-muted/50 px-2.5 py-0.5 text-[11px] font-semibold text-muted-foreground">
            <MapPin className="size-3" />
            Hotel
          </span>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-end gap-3 border-t border-border bg-muted/25 px-5 py-4 dark:bg-muted/15">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewHotel(hotel)}
            className="rounded-xl border-border bg-background text-xs font-semibold text-foreground transition-all hover:border-primary/40 hover:bg-primary/5 hover:text-primary focus-visible:ring-2 focus-visible:ring-primary dark:bg-card"
          >
            Ver
          </Button>

          <Button
            size="sm"
            onClick={() => onReserve(hotel)}
            className="rounded-xl bg-primary px-4 text-xs font-bold text-primary-foreground shadow-md shadow-primary/25 transition-all hover:opacity-90 hover:-translate-y-0.5"
          >
            Reservar
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
