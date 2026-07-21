import {
  ArrowLeft,
  BedDouble,
  CalendarDays,
  CreditCard,
  Gauge,
  Hotel,
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
    <nav className="space-y-1 p-4">
      {adminItems.map((item) => {
        const Icon = item.icon

        const link = (
          <NavLink
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
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

        return mobile
          ? (
            <SheetClose
              key={item.to}
              asChild
            >
              {link}
            </SheetClose>
          )
          : (
            <div key={item.to}>
              {link}
            </div>
          )
      })}
    </nav>
  )
}

export function AdminLayout() {
  return (
    <div className="min-h-screen bg-muted/40">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r bg-background lg:block">
        <div className="flex h-16 items-center border-b px-6">
          <Link
            to="/admin"
            className="flex items-center gap-2 font-bold"
          >
            <Hotel className="size-5 text-primary" />
            StayBooking Admin
          </Link>
        </div>

        <AdminNavigation />
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-background/95 px-4 backdrop-blur sm:px-6">
          <div className="flex items-center gap-3">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="lg:hidden"
                >
                  <Menu className="size-5" />

                  <span className="sr-only">
                    Abrir menú administrativo
                  </span>
                </Button>
              </SheetTrigger>

              <SheetContent
                side="left"
                className="w-72 p-0"
              >
                <SheetHeader className="h-16 justify-center border-b px-5">
                  <SheetTitle className="flex items-center gap-2">
                    <Hotel className="size-5 text-primary" />
                    StayBooking Admin
                  </SheetTitle>
                </SheetHeader>

                <AdminNavigation mobile />
              </SheetContent>
            </Sheet>

            <h1 className="font-semibold">
              Panel administrativo
            </h1>
          </div>

          <Button
            variant="outline"
            size="sm"
            asChild
          >
            <Link to="/">
              <ArrowLeft className="size-4" />

              <span className="hidden sm:inline">
                Volver al sitio
              </span>
            </Link>
          </Button>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}