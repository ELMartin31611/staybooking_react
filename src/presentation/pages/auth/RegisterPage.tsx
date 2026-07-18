import { Link, useNavigate } from 'react-router-dom'

import type { RegisterDto } from '@/application/dtos/register.dto'
import { authUseCase } from '@/infrastructure/factories/auth.factory'
import RegisterForm from '@/presentation/components/auth/RegisterForm'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/presentation/components/ui/card'

export default function RegisterPage() {
  const navigate = useNavigate()

  async function handleRegister(data: RegisterDto) {
    await authUseCase.register(data)

    navigate('/login')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            Crear cuenta
          </CardTitle>

          <CardDescription className="text-center">
            Únete a StayBooking y reserva tu hotel
          </CardDescription>
        </CardHeader>

        <CardContent>
          <RegisterForm onSubmit={handleRegister} />

          <p className="mt-4 text-center text-sm text-muted-foreground">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-primary hover:underline">
              Inicia sesión
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
