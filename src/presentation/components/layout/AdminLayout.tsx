import {
  ArrowLeft,
  BedDouble,
  CalendarDays,
  CreditCard,
  Gauge,
  Hotel,
  MapPinned,
  Menu,
  Sparkles,
  Tags,
} from 'lucide-react'
import {
  Link,
  NavLink,
  Outlet,
} from 'react-router-dom'

import { Button } from '@/presentation/components/ui/button'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/presentation/components/ui/sheet'
import { ThemeToggle } from '@/presentation/components/ui/theme-toggle'
import { cn } from '@/presentation/utils/cn'

const adminItems = [
  {
    label: 'Dashboard',
    to: '/admin',
    icon: Gauge,
    end: true,
  },
  {
    label: 'Hoteles',
    to: '/admin/hoteles',
    icon: Hotel,
  },
  {
    label: 'Direcciones de hotel',
    to: '/admin/direcciones-hotel',
    icon: MapPinned,
  },
  {
    label: 'Tipos de habitación',
    to: '/admin/tipos-habitacion',
    icon: Tags,
  },
  {
    label: 'Habitaciones',
    to: '/admin/habitaciones',
    icon: BedDouble,
  },
  {
    label: 'Servicios',
    to: '/admin/servicios',
    icon: Sparkles,
  },
  {
    label: 'Temporadas y tarifas',
    to: '/admin/tarifas',
    icon: Tags,
  },
  {
    label: 'Reservas',
    to: '/admin/reservas',
    icon: CalendarDays,
  },
  {
    label: 'Pagos y facturas',
    to: '/admin/cobros',
    icon: CreditCard,
  },
]

function AdminNavigation({
  mobile = false,
}: {
  mobile?: boolean
}) {
  return (
    <nav className="space-y-1.5 p-4">
      {adminItems.map((item) => {
        const Icon = item.icon
        const link = (
          <NavLink
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all duration-200',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-md shadow-primary/25'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground',
              )
            }
          >
            <Icon className="size-4 shrink-0" />
            {item.label}
          </NavLink>
        )

        if (!mobile) {
          return <div key={item.to}>{link}</div>
        }

        return (
          <SheetClose key={item.to} asChild>
            {link}
          </SheetClose>
        )
      })}
    </nav>
  )
}

export function AdminLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-border bg-card lg:block">
        <div className="flex h-18 items-center border-b border-border px-5 py-3">
          <Link
            to="/admin"
            className="flex items-center gap-3 rounded-2xl px-2 py-1.5 transition-colors hover:bg-accent"
          >
            <img
              src="/logo_hotel.png"
              alt="StayBooking"
              className="size-10 rounded-xl object-cover"
            />
            <div className="leading-tight">
              <p className="font-extrabold tracking-tight">
                StayBooking
              </p>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-primary">
                Administración
              </p>
            </div>
          </Link>
        </div>

        <div className="max-h-[calc(100vh-72px)] overflow-y-auto">
          <AdminNavigation />
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 flex min-h-16 items-center justify-between border-b border-border bg-card/90 px-4 py-3 shadow-sm backdrop-blur-xl sm:px-6">
          <div className="flex items-center gap-3">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-xl lg:hidden"
                  aria-label="Abrir menú administrativo"
                >
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>

              <SheetContent
                side="left"
                className="w-80 border-border bg-card p-0"
              >
                <SheetHeader className="h-18 justify-center border-b border-border px-5">
                  <SheetTitle className="flex items-center gap-3">
                    <img
                      src="/logo_hotel.png"
                      alt="StayBooking"
                      className="size-9 rounded-xl object-cover"
                    />
                    StayBooking Admin
                  </SheetTitle>
                </SheetHeader>

                <AdminNavigation mobile />
              </SheetContent>
            </Sheet>

            <div>
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-emerald-500" />
                <h1 className="font-extrabold">
                  Panel administrativo
                </h1>
              </div>
              <p className="hidden text-xs text-muted-foreground sm:block">
                Gestión integral de StayBooking
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl font-semibold"
              asChild
            >
              <Link to="/">
                <ArrowLeft className="size-4" />
                <span className="hidden sm:inline">
                  Volver al sitio
                </span>
              </Link>
            </Button>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
