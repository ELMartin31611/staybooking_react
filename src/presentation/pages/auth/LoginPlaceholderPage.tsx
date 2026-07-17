import { Hotel } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Button } from '@/presentation/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/presentation/components/ui/card'

export default function LoginPlaceholderPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <Hotel className="size-6" />
          </div>

          <CardTitle className="text-2xl">Iniciar sesión</CardTitle>

          <CardDescription>
            Pantalla provisional. La autenticación JWT será implementada por
            el Integrante 1.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Button className="w-full" disabled>
            Login pendiente
          </Button>

          <Button className="mt-3 w-full" variant="outline" asChild>
            <Link to="/">Volver al inicio</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  )
}