import { useNavigate } from 'react-router-dom'

import type { RegisterDto } from '@/application/dtos/register.dto'
import { authUseCase } from '@/infrastructure/factories/auth.factory'
import RegisterForm from '@/presentation/components/auth/RegisterForm'

export default function RegisterPage() {
  const navigate = useNavigate()

  async function handleRegister(data: RegisterDto) {
    await authUseCase.register(data)

    navigate('/login')
  }

  return (
    <div>
      <h1>Crear cuenta</h1>

      <RegisterForm onSubmit={handleRegister} />
    </div>
  )
}
