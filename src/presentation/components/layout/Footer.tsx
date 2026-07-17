import { Hotel } from 'lucide-react'
import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-2 lg:px-8">
        <div>
          <Link to="/" className="inline-flex items-center gap-2">
            <Hotel className="size-5 text-primary" />

            <span className="text-lg font-bold">
              Stay<span className="text-primary">Booking</span>
            </span>
          </Link>

          <p className="mt-3 max-w-md text-sm text-muted-foreground">
            Encuentra hoteles y administra tus reservas de manera sencilla,
            rápida y segura.
          </p>
        </div>

        <div className="md:text-right">
          <p className="text-sm font-medium text-foreground">
            Proyecto académico
          </p>

          <p className="mt-2 text-sm text-muted-foreground">
            React, TypeScript y Django REST Framework
          </p>
        </div>
      </div>

      <div className="border-t py-4 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} StayBooking
      </div>
    </footer>
  )
}