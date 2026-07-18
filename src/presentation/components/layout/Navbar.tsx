import { useState } from 'react'
import {
  CalendarCheck,
  Hotel,
  House,
  Menu,
  Sparkles,
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/presentation/components/ui/sheet'
import { cn } from '@/presentation/utils/cn'

const navigationItems = [
  { label: 'Inicio', to: '/', icon: House },
  { label: 'Hoteles', to: '/hoteles', icon: Hotel },
  { label: 'Servicios', to: '/servicios', icon: Sparkles },
  {
    label: 'Mis reservas',
    to: '/mis-reservas',
    icon: CalendarCheck,
  },
  { label: 'Perfil', to: '/perfil', icon: UserRound },
]

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigate = useNavigate()
  const isAuthenticated =
    localTokenStorage.hasTokens()
  const user = localUserStorage.getUser()

  function handleLogout() {
    localTokenStorage.clearTokens()
    localUserStorage.clearUser()
    navigate('/')
    window.location.reload()
  }

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

        <nav className="hidden items-center gap-1 lg:flex">
          {user?.rol === 'ADMIN' && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                cn(
                  'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
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
                  'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
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

        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <Button
              variant="outline"
              onClick={handleLogout}
            >
              <UserRound className="size-4" />
              Cerrar sesión
            </Button>
          ) : (
            <Button
              className="hidden sm:inline-flex"
              asChild
            >
              <Link to="/login">
                <UserRound className="size-4" />
                Iniciar sesión
              </Link>
            </Button>
          )}

          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="lg:hidden"
                aria-label="Abrir menú"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>

            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Hotel className="size-5 text-primary" />
                  StayBooking
                </SheetTitle>
              </SheetHeader>

              <nav className="mt-8 flex flex-col gap-2">
                {user?.rol === 'ADMIN' && (
                  <NavLink
                    to="/admin"
                    onClick={() => setIsMenuOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium',
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground',
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
                          'flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium',
                          isActive
                            ? 'bg-primary text-primary-foreground'
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                        )
                      }
                    >
                      <Icon className="size-4" />
                      {item.label}
                    </NavLink>
                  )
                })}
              </nav>

              {isAuthenticated ? (
                <Button
                  className="mt-6 w-full"
                  onClick={() => {
                    handleLogout()
                    setIsMenuOpen(false)
                  }}
                >
                  <UserRound className="size-4" />
                  Cerrar sesión
                </Button>
              ) : (
                <Button className="mt-6 w-full" asChild>
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <UserRound className="size-4" />
                    Iniciar sesión
                  </Link>
                </Button>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}