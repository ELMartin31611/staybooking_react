import { useState } from 'react'
import type {
  ChangeEvent,
  FormEvent,
} from 'react'

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

    setLoading(true)

    try {
      await onSubmit(form)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={submit}
      className="space-y-3"
    >
      <input
        name="username"
        placeholder="Usuario"
        onChange={change}
      />

      <input
        name="first_name"
        placeholder="Nombre"
        onChange={change}
      />

      <input
        name="last_name"
        placeholder="Apellido"
        onChange={change}
      />

      <input
        name="email"
        placeholder="Correo"
        onChange={change}
      />

      <input
        name="password"
        type="password"
        placeholder="Contraseña"
        onChange={change}
      />

      <button disabled={loading}>
        {loading
          ? 'Creando...'
          : 'Registrarse'}
      </button>
    </form>
  )
}
