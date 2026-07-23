import { useEffect, useMemo, useState } from 'react'
import {
  ArrowRight,
  CalendarDays,
  Hotel,
  Search,
  Sparkles,
  Users,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/presentation/components/ui/button'
import { useHotelMediaQuery } from '@/presentation/hooks/useHotelMedia'

/* ─── Stats ──────────────────────────────────────────────── */
const stats = [
  { label: 'Reservas claras',     value: 'Sin costos ocultos', icon: CalendarDays },
  { label: 'Hoteles seleccionados', value: 'Calidad confiable',  icon: Sparkles     },
  { label: 'Tu control',          value: 'Todo en un lugar',   icon: Hotel        },
]

/* ─── Slides para la imagen de fondo ─────────────────────── */
const slides = [
  {
    src: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600&q=80&auto=format',
    alt: 'Hotel de lujo con piscina',
  },
  {
    src: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1600&q=80&auto=format',
    alt: 'Habitación de hotel elegante',
  },
  {
    src: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1600&q=80&auto=format',
    alt: 'Vista panorámica hotel de montaña',
  },
]

export function HeroSection() {
  const navigate = useNavigate()
  const mediaQuery = useHotelMediaQuery()

  /* ── Buscador rápido state ── */
  const [destination, setDestination] = useState('')
  const [guests, setGuests] = useState('1')

  /* ── Slideshow state ── */
  const [activeSlide, setActiveSlide] = useState(0)
  const heroSlides = useMemo(
    () => mediaQuery.data?.length
      ? mediaQuery.data.map((media) => ({
          src: media.archivo_url,
          alt: media.titulo || 'Experiencia StayBooking',
          type: media.tipo,
        }))
      : slides.map((slide) => ({ ...slide, type: 'imagen' as const })),
    [mediaQuery.data],
  )

  useEffect(() => {
    setActiveSlide(0)
  }, [heroSlides.length])

  useEffect(() => {
    const timer = window.setInterval(
      () => setActiveSlide((current) => (current + 1) % heroSlides.length),
      6000,
    )
    return () => window.clearInterval(timer)
  }, [heroSlides.length])

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    navigate(`/hoteles${destination ? `?search=${encodeURIComponent(destination)}` : ''}`)
  }

  return (
    <section className="relative min-h-[88vh] overflow-hidden text-white">

      {/* ══════════════════════════════════════════
          FONDO — imagen con animación Ken Burns
      ══════════════════════════════════════════ */}
      <div className="absolute inset-0">
        {heroSlides.map((slide, i) => (
          <div
            key={slide.src}
            className={[
              'absolute inset-0 transition-opacity duration-1000',
              i === activeSlide ? 'opacity-100' : 'opacity-0',
            ].join(' ')}
          >
            {slide.type === 'video' ? (
              <video
                src={slide.src}
                className="h-full w-full object-cover"
                autoPlay={i === activeSlide}
                muted
                loop
                playsInline
              />
            ) : (
              <img
                src={slide.src}
                alt={slide.alt}
                className={[
                  'h-full w-full object-cover',
                  i === activeSlide ? 'hero-ken-burns' : '',
                ].join(' ')}
              />
            )}
          </div>
        ))}

        {/* Overlay degradado: oscurece la imagen y garantiza contraste */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70 dark:from-black/70 dark:via-black/60 dark:to-black/80" />

        {/* Overlay de color de marca */}
        <div className="absolute inset-0 bg-gradient-to-tr from-rose-600/18 via-transparent to-red-500/8 mix-blend-multiply" />
      </div>

      {/* ══════════════════════════════════════════
          CONTENIDO PRINCIPAL
      ══════════════════════════════════════════ */}
      <div className="relative mx-auto flex max-w-7xl flex-col items-start justify-center gap-10 px-4 py-24 sm:px-6 lg:px-8 lg:py-32">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm">
          <Hotel className="size-4 text-rose-300" />
          Bienvenido a StayBooking
        </div>

        {/* Titular */}
        <div className="max-w-3xl space-y-5">
          <h1 className="text-5xl font-black tracking-tight leading-[1.1] drop-shadow-lg sm:text-6xl lg:text-7xl">
            Tu próxima{' '}
            <span className="bg-gradient-to-r from-rose-300 via-rose-200 to-red-200 bg-clip-text text-transparent">
              estadía perfecta
            </span>{' '}
            te espera
          </h1>
          <p className="max-w-xl text-lg leading-8 text-white/85 drop-shadow sm:text-xl">
            Reserva hoteles de calidad en minutos. Compara opciones, elige con confianza y viaja con estilo.
          </p>
        </div>

        {/* ─── BARRA DE BÚSQUEDA RÁPIDA ─────────────────── */}
        <form
          onSubmit={handleSearch}
          className="w-full max-w-3xl overflow-hidden rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md shadow-2xl"
        >
          <div className="grid gap-0 sm:grid-cols-[1fr_auto_auto]">
            {/* Destino */}
            <div className="flex items-center gap-3 border-b border-white/15 px-5 py-4 sm:border-b-0 sm:border-r">
              <Search className="size-5 shrink-0 text-rose-300" />
              <div className="flex flex-col">
                <label htmlFor="hero-dest" className="text-[10px] font-bold uppercase tracking-widest text-white/60">
                  Destino
                </label>
                <input
                  id="hero-dest"
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="¿A dónde vas?"
                  className="bg-transparent text-sm font-semibold text-white placeholder:text-white/40 outline-none w-full"
                />
              </div>
            </div>

            {/* Huéspedes */}
            <div className="flex items-center gap-3 border-b border-white/15 px-5 py-4 sm:border-b-0 sm:border-r">
              <Users className="size-5 shrink-0 text-rose-300" />
              <div className="flex flex-col">
                <label htmlFor="hero-guests" className="text-[10px] font-bold uppercase tracking-widest text-white/60">
                  Huéspedes
                </label>
                <select
                  id="hero-guests"
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className="bg-transparent text-sm font-semibold text-white outline-none cursor-pointer"
                >
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <option key={n} value={n} className="text-foreground bg-card">
                      {n} {n === 1 ? 'huésped' : 'huéspedes'}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Botón buscar */}
            <div className="flex items-center p-2.5">
              <Button
                type="submit"
                className="h-full w-full rounded-xl bg-primary px-6 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/30 transition-all duration-300 hover:opacity-90 hover:-translate-y-0.5 sm:w-auto sm:px-8"
              >
                <Search className="size-4" />
                <span className="ml-2">Buscar</span>
              </Button>
            </div>
          </div>
        </form>

        {/* CTA secundario */}
        <button
          onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
          className="group inline-flex items-center gap-2 text-sm font-semibold text-white/80 transition-all duration-300 hover:text-white"
        >
          <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          Nuestra historia
        </button>

        {/* ─── STAT CARDS ───────────────────────────────── */}
        <div className="grid w-full max-w-3xl gap-3 sm:grid-cols-3">
          {stats.map((item) => (
            <div
              key={item.label}
              className="group rounded-2xl border border-white/15 bg-white/8 p-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-white/30 hover:bg-white/12 hover:shadow-lg"
            >
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-rose-300">
                <item.icon className="size-5" />
              </div>
              <p className="text-sm font-bold text-white">{item.label}</p>
              <p className="mt-0.5 text-xs text-white/65">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════
          CONTROLES DEL SLIDESHOW
      ══════════════════════════════════════════ */}
      <div className="absolute bottom-7 right-6 flex items-center gap-2">
        {heroSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveSlide(i)}
            aria-label={`Ir a imagen ${i + 1}`}
            className={[
              'rounded-full transition-all duration-300',
              i === activeSlide
                ? 'w-7 h-2.5 bg-primary shadow-md shadow-primary/40'
                : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/70',
            ].join(' ')}
          />
        ))}
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 opacity-60">
        <span className="text-[10px] font-bold uppercase tracking-widest text-white">Scroll</span>
        <div className="h-8 w-px bg-gradient-to-b from-white/60 to-transparent" />
      </div>
    </section>
  )
}
