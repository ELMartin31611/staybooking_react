import type { HotelDetail } from '@/domain/entities/hotel-detail.entity'

interface HotelHeaderProps {
  hotel: HotelDetail
}

export default function HotelHeader({
  hotel,
}: HotelHeaderProps) {
  const stars = Math.max(
    0,
    Math.min(5, hotel.categoria_estrellas ?? 0),
  )

  return (
    <section className="overflow-hidden rounded-2xl border bg-card shadow-sm">
      <div className="grid gap-0 md:grid-cols-[280px_1fr]">
        <div className="flex min-h-64 items-center justify-center bg-muted">
          {hotel.logo_url ? (
            <img
              src={hotel.logo_url}
              alt={`Logo de ${hotel.nombre}`}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="px-6 text-center">
              <p className="text-sm font-medium text-muted-foreground">
                Este hotel no tiene una imagen disponible
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-col justify-center p-6 md:p-8">
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              {hotel.estado || 'Estado no disponible'}
            </span>

            {hotel.permite_mascotas && (
              <span className="rounded-full bg-muted px-3 py-1 text-sm font-medium">
                Acepta mascotas
              </span>
            )}
          </div>

          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            {hotel.nombre}
          </h1>

          <div
            className="mt-3 flex items-center gap-1"
            aria-label={`${stars} estrellas`}
          >
            {Array.from({ length: 5 }).map((_, index) => (
              <span
                key={index}
                className={
                  index < stars
                    ? 'text-xl text-yellow-500'
                    : 'text-xl text-muted-foreground/30'
                }
              >
                ★
              </span>
            ))}
          </div>

          <p className="mt-5 max-w-3xl leading-7 text-muted-foreground">
            {hotel.descripcion ||
              'Este hotel todavía no tiene una descripción disponible.'}
          </p>
        </div>
      </div>
    </section>
  )
}