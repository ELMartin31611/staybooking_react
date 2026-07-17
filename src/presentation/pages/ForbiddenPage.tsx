import { ShieldX } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Button } from '@/presentation/components/ui/button'

export default function ForbiddenPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <ShieldX className="size-16 text-primary" />

      <h1 className="mt-5 text-4xl font-bold">Acceso denegado</h1>

      <p className="mt-3 text-muted-foreground">
        No tienes el rol necesario para entrar a esta sección.
      </p>

      <Button className="mt-6" asChild>
        <Link to="/">Volver al inicio</Link>
      </Button>
    </main>
  )
}