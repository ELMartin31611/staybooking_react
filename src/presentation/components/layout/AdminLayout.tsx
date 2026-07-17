import {
  ArrowLeft,
  BedDouble,
  CalendarDays,
  Gauge,
  Hotel,
  ReceiptText,
  Tags,
} from 'lucide-react'
import { Link, NavLink, Outlet } from 'react-router-dom'

import { Button } from '@/presentation/components/ui/button'
import { cn } from '@/presentation/utils/cn'

const adminItems = [
  { label: 'Dashboard', to: '/admin', icon: Gauge, end: true },
  { label: 'Hoteles', to: '/admin/hoteles', icon: Hotel },
  { label: 'Habitaciones', to: '/admin/habitaciones', icon: BedDouble },
  { label: 'Tarifas', to: '/admin/tarifas', icon: Tags },
  { label: 'Reservas', to: '/admin/reservas', icon: CalendarDays },
  { label: 'Facturas', to: '/admin/facturas', icon: ReceiptText },
]

export function AdminLayout() {
  return (
    <div className="min-h-screen bg-muted/40">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r bg-white lg:block">
        <div className="flex h-16 items-center border-b px-6">
          <Link to="/" className="flex items-center gap-2 font-bold">
            <Hotel className="size-5 text-primary" />
            StayBooking Admin
          </Link>
        </div>

        <nav className="space-y-1 p-4">
          {adminItems.map((item) => {
            const Icon = item.icon

            return (
              <NavLink
                key={item.to}
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
          })}
        </nav>
      </aside>

      <div className="lg:pl-64">
        <header className="flex h-16 items-center justify-between border-b bg-white px-4 sm:px-6">
          <h1 className="font-semibold">Panel administrativo</h1>

          <Button variant="outline" size="sm" asChild>
            <Link to="/">
              <ArrowLeft className="size-4" />
              Volver al sitio
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