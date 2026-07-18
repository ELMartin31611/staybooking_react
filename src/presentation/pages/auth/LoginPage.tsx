import {
  useLocation,
  useNavigate,
} from 'react-router-dom'

import { authUseCase } from '@/infrastructure/factories/auth.factory'
import { localTokenStorage } from '@/infrastructure/storage/local-token-storage'
import LoginForm from '@/presentation/components/auth/LoginForm'

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
    <div>
      <h1>Iniciar sesión</h1>

      <LoginForm onSubmit={handleLogin} />
    </div>
  )
}
