import { useEffect, useState } from 'react'
import {
  CalendarCheck,
  Hotel,
  House,
  Menu,
  UserRound,
} from 'lucide-react'
import {
  Link,
  NavLink,
  useNavigate,
} from 'react-router-dom'

import { localTokenStorage } from '@/infrastructure/storage/local-token-storage'
import { localUserStorage } from '@/infrastructure/storage/local-user-storage'
import { Button } from '@/presentation/components/ui/button'
import { ThemeToggle } from '@/presentation/components/ui/theme-toggle'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/presentation/components/ui/sheet'
import { cn } from '@/presentation/utils/cn'

const navigationItems = [
  { label: 'Inicio',       to: '/',            icon: House },
  { label: 'Hoteles',      to: '/hoteles',      icon: Hotel },
  { label: 'Mis reservas', to: '/mis-reservas', icon: CalendarCheck },
  { label: 'Perfil',       to: '/perfil',       icon: UserRound },
]

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const navigate = useNavigate()
  const isAuthenticated = localTokenStorage.hasTokens()
  const user = localUserStorage.getUser()

  /* Detecta scroll para reforzar el blur/fondo */
  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 12)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function handleLogout() {
    localTokenStorage.clearTokens()
    localUserStorage.clearUser()
    navigate('/')
    window.location.reload()
  }

  return (
    <header
      className={cn(
        'sticky top-0 z-50 border-b transition-all duration-300',
        scrolled
          ? 'border-border bg-card/90 shadow-md shadow-black/5 backdrop-blur-xl'
          : 'border-transparent bg-card/70 backdrop-blur-md',
      )}
    >
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link
          to="/"
          className="group flex items-center gap-3 rounded-2xl border border-border/60 bg-background/70 px-3 py-2 text-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-background hover:shadow-md hover:shadow-primary/8"
          aria-label="StayBooking inicio"
        >
          <img
            src="/logo_hotel.png"
            alt="StayBooking logo"
            className="h-10 w-10 rounded-xl object-cover"
          />
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-bold text-foreground">StayBooking</span>
            <span className="text-[11px] text-muted-foreground">Reserva con estilo</span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-0.5 lg:flex">
          {user?.rol === 'ADMIN' && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                cn(
                  'rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-md shadow-primary/25'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                )
              }
            >
              Administración
            </NavLink>
          )}

          {navigationItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                cn(
                  'rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-md shadow-primary/25'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <ThemeToggle />

          {isAuthenticated ? (
            <Button
              variant="outline"
              onClick={handleLogout}
              className="hidden rounded-xl border-border/70 bg-card/80 px-4 py-2 text-sm font-semibold text-foreground transition-all duration-200 hover:border-primary/50 hover:bg-accent hover:text-foreground lg:inline-flex"
            >
              <UserRound className="size-4" />
              Cerrar sesión
            </Button>
          ) : (
            <Button
              className="hidden rounded-xl bg-primary px-5 py-2 text-sm font-bold text-primary-foreground shadow-md shadow-primary/25 transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5 lg:inline-flex"
              asChild
            >
              <Link to="/login">
                <UserRound className="size-4" />
                Iniciar sesión
              </Link>
            </Button>
          )}

          {/* Mobile trigger */}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-xl border border-border/60 bg-card/80 text-foreground hover:bg-accent lg:hidden"
                aria-label="Abrir menú"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="border-border bg-card text-foreground shadow-2xl">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2 text-base font-bold text-foreground">
                  <Hotel className="size-4 text-primary" />
                  StayBooking
                </SheetTitle>
              </SheetHeader>

              <nav className="mt-8 flex flex-col gap-1">
                {user?.rol === 'ADMIN' && (
                  <NavLink
                    to="/admin"
                    onClick={() => setIsMenuOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200',
                        isActive
                          ? 'bg-primary text-primary-foreground shadow-sm'
                          : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                      )
                    }
                  >
                    <UserRound className="size-4" />
                    Administración
                  </NavLink>
                )}

                {navigationItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.to === '/'}
                      onClick={() => setIsMenuOpen(false)}
                      className={({ isActive }) =>
                        cn(
                          'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200',
                          isActive
                            ? 'bg-primary text-primary-foreground shadow-sm'
                            : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                        )
                      }
                    >
                      <Icon className="size-4" />
                      {item.label}
                    </NavLink>
                  )
                })}
              </nav>

              <div className="mt-6 flex flex-col gap-3 border-t border-border pt-6">
                <ThemeToggle />
                {isAuthenticated ? (
                  <Button
                    className="w-full rounded-xl border border-border bg-card text-sm font-semibold text-foreground hover:bg-accent"
                    onClick={() => { handleLogout(); setIsMenuOpen(false) }}
                    variant="outline"
                  >
                    <UserRound className="size-4" />
                    Cerrar sesión
                  </Button>
                ) : (
                  <Button
                    className="w-full rounded-xl bg-primary text-sm font-bold text-primary-foreground shadow-md shadow-primary/20 hover:opacity-90"
                    asChild
                  >
                    <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                      <UserRound className="size-4" />
                      Iniciar sesión
                    </Link>
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>

      </div>
    </header>
  )
}
