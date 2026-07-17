import { Hotel as HotelIcon, Star } from 'lucide-react'

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
  const stars = Math.max(
    0,
    Math.min(5, hotel.categoria_estrellas),
  )

  return (
    <Card className="group overflow-hidden py-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="aspect-[16/10] overflow-hidden bg-muted">
        {hotel.logo_url ? (
          <img
            src={hotel.logo_url}
            alt={`Imagen de ${hotel.nombre}`}
            className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex size-full flex-col items-center justify-center gap-2 text-muted-foreground">
            <HotelIcon className="size-12" />
            <span className="text-sm">Sin imagen disponible</span>
          </div>
        )}
      </div>

      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="line-clamp-1 text-lg font-semibold">
            {hotel.nombre}
          </h3>

          <div
            className="flex shrink-0 items-center gap-1"
            aria-label={`${stars} estrellas`}
          >
            <Star className="size-4 fill-amber-400 text-amber-400" />
            <span className="text-sm font-medium">{stars}</span>
          </div>
        </div>

        <p className="mt-3 line-clamp-2 min-h-10 text-sm text-muted-foreground">
          {hotel.descripcion || 'Conoce este hotel y sus habitaciones.'}
        </p>

        {hotel.permite_mascotas && (
          <span className="mt-3 inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            Acepta mascotas
          </span>
        )}
      </CardContent>

      <CardFooter className="grid grid-cols-2 gap-3 border-t p-5">
        <Button
          variant="outline"
          onClick={() => onViewHotel(hotel)}
        >
          Ver hotel
        </Button>

        <Button onClick={() => onReserve(hotel)}>
          Reservar
        </Button>
      </CardFooter>
    </Card>
  )
}