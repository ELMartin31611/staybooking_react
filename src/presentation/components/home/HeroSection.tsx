import {
  CalendarDays,
  Hotel,
  MapPin,
  Search,
} from 'lucide-react'
import { Link } from 'react-router-dom'

import { Button } from '@/presentation/components/ui/button'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary via-[#e31c5f] to-[#a30d43] text-white">
      <div className="absolute -right-24 -top-24 size-96 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -bottom-32 -left-24 size-96 rounded-full bg-black/10 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-28">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-medium backdrop-blur">
            <Hotel className="size-4" />
            Tu próxima estadía comienza aquí
          </span>

          <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Encuentra el hotel ideal para tu viaje
          </h1>

          <p className="mt-6 max-w-xl text-lg text-white/85">
            Explora hoteles, descubre habitaciones y administra todas tus
            reservas desde StayBooking.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              size="lg"
              variant="secondary"
              asChild
            >
              <Link to="/hoteles">
                <Search className="size-5" />
                Explorar hoteles
              </Link>
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="border-white/40 bg-white/10 text-white hover:bg-white hover:text-primary"
              asChild
            >
              <Link to="/mis-reservas">
                <CalendarDays className="size-5" />
                Mis reservas
              </Link>
            </Button>
          </div>
        </div>

        <div className="hidden items-center justify-center lg:flex">
          <div className="w-full max-w-md rounded-3xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur">
            <MapPin className="size-10 text-white" />

            <h2 className="mt-5 text-2xl font-semibold">
              Hoteles reales
            </h2>

            <p className="mt-3 text-white/80">
              La información mostrada proviene directamente de nuestra API
              Django REST.
            </p>

            <div className="mt-6 grid grid-cols-3 gap-3 text-center">
              <div className="rounded-xl bg-white/10 p-3">
                <p className="text-2xl font-bold">100%</p>
                <p className="text-xs text-white/70">Real</p>
              </div>

              <div className="rounded-xl bg-white/10 p-3">
                <p className="text-2xl font-bold">JWT</p>
                <p className="text-xs text-white/70">Seguro</p>
              </div>

              <div className="rounded-xl bg-white/10 p-3">
                <p className="text-2xl font-bold">24/7</p>
                <p className="text-xs text-white/70">Disponible</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}