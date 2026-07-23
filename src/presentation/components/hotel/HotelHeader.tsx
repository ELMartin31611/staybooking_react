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
    <section className="overflow-hidden rounded-3xl border border-border bg-card shadow-lg">
      <div className="grid gap-0 md:grid-cols-[320px_1fr]">
        <div className="relative flex min-h-64 items-center justify-center bg-muted">
          {hotel.logo_url ? (
            <img
              src={hotel.logo_url}
              alt={`Logo de ${hotel.nombre}`}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="px-6 text-center">
              <p className="text-sm font-semibold text-muted-foreground">
                Este hotel no tiene una imagen disponible
              </p>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-black/5 to-transparent pointer-events-none" />
        </div>

        <div className="flex flex-col justify-center p-6 sm:p-8 md:p-10">
          <div className="mb-4 flex flex-wrap items-center gap-2.5">
            <span className="rounded-full bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary uppercase tracking-wide">
              {hotel.estado || 'Activo'}
            </span>

            {hotel.permite_mascotas && (
              <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                🐾 Acepta mascotas
              </span>
            )}
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            {hotel.nombre}
          </h1>

          <div
            className="mt-3.5 flex w-fit items-center gap-1 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1"
            aria-label={`${stars} estrellas`}
          >
            {Array.from({ length: 5 }).map((_, index) => (
              <span
                key={index}
                className={
                  index < stars
                    ? 'text-lg text-amber-500 font-bold'
                    : 'text-lg text-muted-foreground/35'
                }
              >
                ★
              </span>
            ))}
            <span className="ml-1.5 text-xs font-bold text-amber-800 dark:text-amber-300">{stars} / 5</span>
          </div>

          <p className="mt-5 max-w-3xl text-sm leading-relaxed text-muted-foreground font-medium">
            {hotel.descripcion ||
              'Este hotel todavía no tiene una descripción disponible.'}
          </p>
        </div>
      </div>
    </section>
  )
}