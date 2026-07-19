import { useState } from 'react'
import type { FormEvent } from 'react'
import {
  Link,
  useNavigate,
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

export default function RegisterPage() {
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    const normalizedUsername = username.trim()
    const normalizedEmail = email.trim()

    try {
      setLoading(true)
      setError('')

      /*
       * Primero se crea la cuenta.
       */
      await authUseCase.register({
        username: normalizedUsername,
        email: normalizedEmail,
        password,
      })

      /*
       * Después se inicia sesión automáticamente
       * utilizando las mismas credenciales.
       */
      const tokens = await authUseCase.login({
        username: normalizedUsername,
        password,
      })

      localTokenStorage.saveTokens(tokens)

      const profile = await authUseCase.getProfile()
      localUserStorage.saveUser(profile)

      navigate(
        '/',
        {
          replace: true,
        },
      )
    } catch (caughtError: unknown) {
      localTokenStorage.clearTokens()
      localUserStorage.clearUser()

      if (caughtError instanceof ApiException) {
        setError(caughtError.message)
      } else {
        setError(
          'No se pudo crear la cuenta.',
        )
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-8">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            Crear cuenta
          </CardTitle>

          <CardDescription>
            Regístrate para reservar en StayBooking.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="username">
                Usuario
              </Label>

              <Input
                id="username"
                name="username"
                autoComplete="username"
                value={username}
                onChange={(event) =>
                  setUsername(event.target.value)
                }
                disabled={loading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">
                Correo
              </Label>

              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                disabled={loading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">
                Contraseña
              </Label>

              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                minLength={8}
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                disabled={loading}
                required
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <Button
              className="w-full"
              type="submit"
              disabled={loading}
            >
              {loading
                ? 'Creando cuenta...'
                : 'Registrarse'}
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            ¿Ya tienes cuenta?{' '}

            <Link
              to="/login"
              className="text-primary hover:underline"
            >
              Inicia sesión
            </Link>
          </p>

          <Button
            className="mt-3 w-full"
            variant="outline"
            asChild
          >
            <Link to="/">
              Volver al inicio
            </Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  )
}