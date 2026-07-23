import { Heart, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'

export function AboutSection() {
  return (
    <section id="about" className="relative overflow-hidden py-20 text-foreground">
      <div className="absolute inset-0">
        <img
          src="/staybooking-about-hotel-bg.png"
          alt="Hotel frente al mar al atardecer"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/88 to-background/55 dark:from-background/96 dark:via-background/90 dark:to-background/65" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-background/30" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="space-y-8">
            <div className="max-w-2xl space-y-4">
              <p className="text-xs font-bold uppercase tracking-widest text-primary">
                Sobre StayBooking
              </p>
              <h2 className="text-4xl font-black tracking-tight text-foreground sm:text-5xl">
                Reservas claras para viajes con confianza.
              </h2>
              <p className="text-lg leading-8 text-muted-foreground">
                Hoteles reales, disponibilidad verificada y un proceso sencillo de principio a fin:
                busca, elige, confirma y disfruta.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  icon: MapPin,
                  title: 'Misión clara',
                  description: 'Hoteles confiables y una reserva directa respaldada por la API.',
                },
                {
                  icon: Heart,
                  title: 'Viajes con estilo',
                  description: 'Decisiones simples para disfrutar el viaje sin fricción.',
                },
              ].map((card) => (
                <div
                  key={card.title}
                  className="rounded-2xl border border-border/80 bg-card/90 p-6 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
                >
                  <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary dark:bg-primary/15">
                    <card.icon className="size-5" />
                  </div>
                  <h3 className="text-base font-bold text-foreground">{card.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{card.description}</p>
                </div>
              ))}
            </div>

            <Link
              to="/sobre/como-funciona"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:underline"
            >
              Ver cómo funciona StayBooking →
            </Link>
          </div>

          <div className="grid gap-5">
            <div className="overflow-hidden rounded-3xl border border-border/80 bg-card/90 shadow-sm backdrop-blur-sm">
              <div className="relative h-40 overflow-hidden sm:h-48">
                <img
                  src="/staybooking-home-story.png"
                  alt="Sala de hotel con vista a la ciudad"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
              </div>
              <div className="p-7">
                <p className="text-xs font-bold uppercase tracking-widest text-primary">Nuestra historia</p>
                <h3 className="mt-3 text-2xl font-bold text-foreground">
                  De una idea a una experiencia visual
                </h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  Un proyecto académico que se siente de producto real: comparar, elegir y reservar
                  sin perder claridad en cada paso.
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-border/80 bg-card/90 p-5 shadow-sm backdrop-blur-sm">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Propuesta</p>
                <p className="mt-2 text-base font-semibold text-foreground">Transparencia total</p>
              </div>
              <div className="rounded-2xl border border-primary/25 bg-primary/10 p-5 backdrop-blur-sm dark:bg-primary/15">
                <p className="text-xs font-bold uppercase tracking-widest text-primary">Confianza</p>
                <p className="mt-2 text-base font-semibold text-foreground">Flujo sencillo</p>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-border/80 bg-card/90 p-6 shadow-sm backdrop-blur-sm">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Inspiración visual</p>
              <div className="mt-4 flex items-center gap-5">
                <img
                  src="/staybooking-home-technology.png"
                  alt="Habitación de hotel con tablet de reservas"
                  className="h-20 w-28 rounded-xl object-cover ring-2 ring-border"
                />
                <div>
                  <p className="text-sm font-bold text-foreground">Diseño cercano al viaje</p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    Una interfaz pensada para buscar, comparar y reservar sin ruido.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
