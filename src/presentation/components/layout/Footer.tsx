import { Hotel } from 'lucide-react'
import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-border bg-card text-foreground">
      {/* Blobs decorativos */}
      <div className="pointer-events-none absolute right-0 top-0 h-48 w-48 rounded-full bg-primary/6 blur-3xl dark:bg-primary/10" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-40 w-40 rounded-full bg-violet-400/6 blur-3xl dark:bg-violet-500/10" />

      {/* Accent top line */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-3 lg:px-8">

        {/* Brand */}
        <div className="space-y-4">
          <Link to="/" className="inline-flex items-center gap-3 text-foreground">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary shadow-md shadow-primary/25">
              <Hotel className="size-5 text-primary-foreground" />
            </div>
            <div>
              <p className="text-base font-bold text-foreground">StayBooking</p>
              <p className="text-xs text-muted-foreground">Tu plataforma de reservas premium.</p>
            </div>
          </Link>
          <p className="max-w-xs text-sm leading-6 text-muted-foreground">
            Reserva con estilo, gestiona tu viaje y encuentra hoteles premium con una experiencia visual cálida y moderna.
          </p>
        </div>

        {/* Navegación */}
        <div className="space-y-4">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Navegación
          </p>
          <nav className="grid gap-3 text-sm sm:grid-cols-2">
            {[
              { to: '/hoteles',      label: 'Hoteles' },
              { to: '/mis-reservas', label: 'Mis reservas' },
              { to: '/perfil',       label: 'Perfil' },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="font-semibold text-muted-foreground transition-colors hover:text-primary"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Info */}
        <div className="rounded-2xl border border-border bg-background/60 p-6 dark:bg-muted/30">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            StayBooking
          </p>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            Reserva con estilo, gestiona tu viaje y encuentra hoteles premium con una experiencia visual cálida y moderna.
          </p>
          <p className="mt-5 text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">
            © {new Date().getFullYear()} StayBooking
          </p>
        </div>

      </div>
    </footer>
  )
}
