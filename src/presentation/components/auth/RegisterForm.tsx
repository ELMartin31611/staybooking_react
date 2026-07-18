import { useState } from 'react'
import type {
  ChangeEvent,
  FormEvent,
} from 'react'

import { Button } from '@/presentation/components/ui/button'
import { Input } from '@/presentation/components/ui/input'
import { Label } from '@/presentation/components/ui/label'

type RegisterFormData = {
  username: string
  email: string
  password: string
  first_name: string
  last_name: string
}

interface RegisterFormProps {
  onSubmit: (
    data: RegisterFormData,
  ) => Promise<void>
}

export default function RegisterForm({
  onSubmit,
}: RegisterFormProps) {
  const [form, setForm] = useState<RegisterFormData>({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function change(
    e: ChangeEvent<HTMLInputElement>,
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  async function submit(
    e: FormEvent,
  ) {
    e.preventDefault()

    try {
      setLoading(true)
      setError('')

      await onSubmit(form)
    } catch {
      setError('No se pudo crear la cuenta')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={submit}
      className="space-y-4"
    >
      <div className="space-y-2">
        <Label htmlFor="username">Usuario</Label>

        <Input
          id="username"
          name="username"
          placeholder="usuario"
          value={form.username}
          onChange={change}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="first_name">Nombre</Label>

          <Input
            id="first_name"
            name="first_name"
            placeholder="Juan"
            value={form.first_name}
            onChange={change}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="last_name">Apellido</Label>

          <Input
            id="last_name"
            name="last_name"
            placeholder="Pérez"
            value={form.last_name}
            onChange={change}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Correo electrónico</Label>

        <Input
          id="email"
          type="email"
          name="email"
          placeholder="correo@ejemplo.com"
          value={form.email}
          onChange={change}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Contraseña</Label>

        <Input
          id="password"
          type="password"
          name="password"
          placeholder="********"
          value={form.password}
          onChange={change}
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
        type="submit"
        disabled={loading}
      >
        {loading
          ? 'Creando cuenta...'
          : 'Registrarse'}
      </Button>
    </form>
  )
}
