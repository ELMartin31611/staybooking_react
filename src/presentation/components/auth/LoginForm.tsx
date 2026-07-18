import { useState } from 'react'
import type { FormEvent } from 'react'

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
      className="space-y-4"
    >
      <input
        type="email"
        placeholder="Correo"
        value={email}
        onChange={
          (e) => setEmail(e.target.value)
        }
        required
      />

      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={
          (e) => setPassword(e.target.value)
        }
        required
      />

      {error && <p>{error}</p>}

      <button
        type="submit"
        disabled={loading}
      >
        {loading
          ? 'Ingresando...'
          : 'Ingresar'}
      </button>
    </form>
  )
}
