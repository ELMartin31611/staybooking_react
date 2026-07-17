import { SearchX } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Button } from '@/presentation/components/ui/button'

export default function NotFoundPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <p className="text-lg font-semibold text-primary">Error 404</p>

      <SearchX className="mt-5 size-16 text-muted-foreground" />

      <h1 className="mt-5 text-4xl font-bold">Página no encontrada</h1>

      <p className="mt-3 text-muted-foreground">
        La dirección ingresada no existe en StayBooking.
      </p>

      <Button className="mt-6" asChild>
        <Link to="/">Volver al inicio</Link>
      </Button>
    </main>
  )
}