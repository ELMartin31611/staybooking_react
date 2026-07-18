import { AlertCircle, Hotel } from 'lucide-react'
import { useState } from 'react'
import type { FormEvent } from 'react'
import {
  Link,
  useLocation,
  useNavigate,
} from 'react-router-dom'

import { ApiException } from '@/domain/exceptions/api.exception'
import { authUseCase } from '@/infrastructure/factories/auth.factory'
import { localTokenStorage } from '@/infrastructure/storage/local-token-storage'
import {
  Alert,
  AlertDescription,
} from '@/presentation/components/ui/alert'
import { Button } from '@/presentation/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/presentation/components/ui/card'
import { Input } from '@/presentation/components/ui/input'
import { Label } from '@/presentation/components/ui/label'

type LoginLocationState = {
  from?: string
}

export default function LoginPlaceholderPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault()
    setIsSubmitting(true)
    setErrorMessage(null)

    try {
      const tokens = await authUseCase.login({
        email: email.trim(),
        password,
      })

      localTokenStorage.saveTokens(tokens)
      await authUseCase.getProfile()

      const from =
        (location.state as LoginLocationState | null)
          ?.from || '/perfil'

      navigate(from, { replace: true })
    } catch (error: unknown) {
      if (error instanceof ApiException) {
        setErrorMessage(error.message)
      } else {
        setErrorMessage(
          'No fue posible iniciar sesión. Inténtalo nuevamente.',
        )
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <Hotel className="size-6" />
          </div>

          <CardTitle className="text-2xl">Iniciar sesión</CardTitle>

          <CardDescription>
            Ingresa tus credenciales para continuar.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form className="space-y-4" onSubmit={handleLogin}>
            <div className="space-y-2">
              <Label htmlFor="email">Correo</Label>

              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="correo@ejemplo.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                disabled={isSubmitting}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>

              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="********"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                disabled={isSubmitting}
                required
              />
            </div>

            {errorMessage && (
              <Alert variant="destructive">
                <AlertCircle className="size-4" />
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}

            <Button
              className="w-full"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Ingresando...' : 'Ingresar'}
            </Button>
          </form>

          <Button className="mt-3 w-full" variant="outline" asChild>
            <Link to="/">Volver al inicio</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  )
}