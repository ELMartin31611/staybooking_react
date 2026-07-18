import { useState } from 'react'
import type { FormEvent } from 'react'

import { Button } from '@/presentation/components/ui/button'
import { Input } from '@/presentation/components/ui/input'
import { Label } from '@/presentation/components/ui/label'

interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<void>
}

export default function LoginForm({
  onSubmit,
}: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(
    e: FormEvent,
  ) {
    e.preventDefault()

    try {
      setLoading(true)
      setError('')

      await onSubmit(
        email,
        password,
      )
    } catch {
      setError('Credenciales incorrectas')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      <div className="space-y-2">
        <Label htmlFor="email">Correo electrónico</Label>

        <Input
          id="email"
          type="email"
          placeholder="correo@ejemplo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      {error && (
        <p className="text-sm text-destructive">
          {error}
        </p>
      )}

      <Button
        className="w-full"
        size="lg"
        disabled={loading}
      >
        {loading
          ? 'Ingresando...'
          : 'Iniciar sesión'}
      </Button>
    </form>
  )
}
