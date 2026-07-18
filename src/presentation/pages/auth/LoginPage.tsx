import { useState } from 'react'
import type { FormEvent } from 'react'
import {
  Link,
  useLocation,
} from 'react-router-dom'

import { ApiException } from '@/domain/exceptions/api.exception'
import { authUseCase } from '@/infrastructure/factories/auth.factory'
import { localTokenStorage } from '@/infrastructure/storage/local-token-storage'
import { localUserStorage } from '@/infrastructure/storage/local-user-storage'
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
  from?: string | { pathname?: string }
}

function resolveRedirectFrom(
  state: LoginLocationState | null,
): string {
  const from = state?.from

  if (typeof from === 'string') {
    return from
  }

  if (
    from &&
    typeof from === 'object' &&
    typeof from.pathname === 'string'
  ) {
    return from.pathname
  }

  return '/perfil'
}

export default function LoginPage() {
  const location = useLocation()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()

    try {
      setLoading(true)
      setError('')

      const tokens = await authUseCase.login({
        username: username.trim(),
        password,
      })

      localTokenStorage.saveTokens(tokens)

      // Si el endpoint de perfil falla, no bloqueamos el acceso tras login exitoso.
      try {
        const profile = await authUseCase.getProfile()
        localUserStorage.saveUser(profile)
      } catch {
        // Intencionalmente ignorado: ya tenemos tokens válidos.
      }

      window.location.assign(
        resolveRedirectFrom(
          location.state as LoginLocationState | null,
        ),
      )
    } catch (error: unknown) {
      if (error instanceof ApiException) {
        setError(error.message)
      } else {
        setError('No se pudo iniciar sesión')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            Iniciar sesión
          </CardTitle>

          <CardDescription>
            Ingresa con tu cuenta para continuar.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Usuario</Label>

              <Input
                id="username"
                type="text"
                placeholder="Tu usuario"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                disabled={loading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>

              <Input
                id="password"
                type="password"
                placeholder="********"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                disabled={loading}
                required
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? 'Ingresando...' : 'Iniciar sesión'}
            </Button>
          </form>

          <Button className="mt-3 w-full" variant="outline" asChild>
            <Link to="/">Volver al inicio</Link>
          </Button>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="text-primary hover:underline">
              Regístrate
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  )
}
