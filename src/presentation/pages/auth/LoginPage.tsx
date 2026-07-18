import {
  Link,
  useLocation,
  useNavigate,
} from 'react-router-dom'

import { authUseCase } from '@/infrastructure/factories/auth.factory'
import { localTokenStorage } from '@/infrastructure/storage/local-token-storage'
import LoginForm from '@/presentation/components/auth/LoginForm'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/presentation/components/ui/card'

type LoginLocationState = {
  from?: string
}

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()

  async function handleLogin(
    email: string,
    password: string,
  ) {
    const tokens = await authUseCase.login({
      email,
      password,
    })

    localTokenStorage.saveTokens(tokens)

    await authUseCase.getProfile()

    navigate(
      (location.state as LoginLocationState | null)
        ?.from ?? '/perfil',
      {
        replace: true,
      },
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            Bienvenido a StayBooking
          </CardTitle>

          <CardDescription className="text-center">
            Ingresa para gestionar tus reservas
          </CardDescription>
        </CardHeader>

        <CardContent>
          <LoginForm onSubmit={handleLogin} />

          <p className="mt-4 text-center text-sm text-muted-foreground">
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="text-primary hover:underline">
              Regístrate
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
