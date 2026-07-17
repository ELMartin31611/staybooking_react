import { Hotel, UserRound } from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'

import { Button } from '@/presentation/components/ui/button'
import { cn } from '@/presentation/utils/cn'

const navigationItems = [
  { label: 'Inicio', to: '/' },
  { label: 'Hoteles', to: '/hoteles' },
  { label: 'Servicios', to: '/servicios' },
]

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Hotel className="size-5" />
          </div>

          <span className="text-xl font-bold tracking-tight">
            Stay<span className="text-primary">Booking</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navigationItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <Button asChild>
          <Link to="/login">
            <UserRound className="size-4" />
            Iniciar sesión
          </Link>
        </Button>
      </div>
    </header>
  )
}