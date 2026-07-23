import { useState, type FormEvent } from 'react'

import type { Customer } from '@/domain/entities/customer.entity'
import type { UserProfile } from '@/domain/entities/user-profile.entity'

import { Button } from '@/presentation/components/ui/button'
import { Card, CardContent } from '@/presentation/components/ui/card'
import { Input } from '@/presentation/components/ui/input'
import { Label } from '@/presentation/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/presentation/components/ui/select'

function normalizeCatalogValue(value?: string | null): string {
  if (!value) {
    return ''
  }

  return value
    .trim()
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

  const GENEROS = ['FEMENINO', 'MASCULINO'] as const

const NACIONALIDADES = [
  { value: 'ECUATORIANA', label: '🇪🇨 Ecuatoriana' },
  { value: 'COLOMBIANA', label: '🇨🇴 Colombiana' },
  { value: 'PERUANA', label: '🇵🇪 Peruana' },
  { value: 'VENEZOLANA', label: '🇻🇪 Venezolana' },
  { value: 'ARGENTINA', label: '🇦🇷 Argentina' },
  { value: 'CHILENA', label: '🇨🇱 Chilena' },
  { value: 'MEXICANA', label: '🇲🇽 Mexicana' },
  { value: 'ESPANOLA', label: '🇪🇸 Española' },
  { value: 'ESTADOUNIDENSE', label: '🇺🇸 Estadounidense' },
  { value: 'BRASILENA', label: '🇧🇷 Brasileña' },
  { value: 'BOLIVIANA', label: '🇧🇴 Boliviana' },
  { value: 'OTRA', label: '🌎 Otra' },
] as const

const NACIONALIDAD_VALUES = NACIONALIDADES.map((item) => item.value)

function toAllowedValue(
  rawValue: string | null | undefined,
  allowedValues: readonly string[],
): string {
  const normalized = normalizeCatalogValue(rawValue)

  return allowedValues.includes(normalized)
    ? normalized
    : ''
}

interface EditProfileFormProps {
  profile: UserProfile
  customer: Customer | null
  onSubmit: (
    profileData: Partial<UserProfile>,
    customerData: Partial<Customer>,
  ) => Promise<void>
  onCancel?: () => void
}

export default function EditProfileForm({
  profile,
  customer,
  onSubmit,
  onCancel,
}: EditProfileFormProps) {
  const [username, setUsername] = useState(profile.username ?? '')
  const [email, setEmail] = useState(profile.email ?? '')
  const [telefono, setTelefono] = useState(profile.telefono ?? '')
  const [firstName, setFirstName] = useState(profile.first_name ?? '')
  const [lastName, setLastName] = useState(profile.last_name ?? '')

  const [cedula, setCedula] = useState(customer?.cedula ?? '')
  const [nombres, setNombres] = useState(customer?.nombres ?? '')
  const [apellidos, setApellidos] = useState(customer?.apellidos ?? '')
  const [fechaNacimiento, setFechaNacimiento] = useState(
    customer?.fecha_nacimiento ?? '',
  )
  const [genero, setGenero] = useState(
    toAllowedValue(customer?.genero, GENEROS),
  )
  const [nacionalidad, setNacionalidad] = useState(
    toAllowedValue(customer?.nacionalidad, NACIONALIDAD_VALUES),
  )
  const [correoAlternativo, setCorreoAlternativo] = useState(
    customer?.correo_alternativo ?? '',
  )

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()

    try {
      setLoading(true)
      setError('')

      await onSubmit(
        {
          username: username.trim(),
          email: email.trim(),
          telefono: telefono.trim() || null,
          first_name: firstName.trim(),
          last_name: lastName.trim(),
        },
        {
          cedula: cedula.trim(),
          nombres: nombres.trim(),
          apellidos: apellidos.trim(),
          fecha_nacimiento: fechaNacimiento.trim() || null,
          genero: toAllowedValue(genero, GENEROS) || null,
          nacionalidad: toAllowedValue(
            nacionalidad,
            NACIONALIDAD_VALUES,
          ),
          correo_alternativo: correoAlternativo.trim() || null,
        },
      )
    } catch {
      setError('No se pudieron guardar los cambios')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Usuario</h2>

            <p className="text-sm text-muted-foreground">
              Datos de tu cuenta (como te mostramos en la plataforma).
            </p>

            <div className="space-y-2">
              <Label htmlFor="username">Usuario</Label>
              <Input
                id="username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                disabled={loading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Correo</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                disabled={loading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefono">Teléfono</Label>
              <Input
                id="telefono"
                type="tel"
                value={telefono}
                onChange={(event) => setTelefono(event.target.value)}
                disabled={loading}
                placeholder="Opcional"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="first_name">Nombre para mostrar</Label>
                <Input
                  id="first_name"
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="last_name">Apellido para mostrar</Label>
                <Input
                  id="last_name"
                  value={lastName}
                  onChange={(event) => setLastName(event.target.value)}
                  disabled={loading}
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Datos del cliente (documento de identidad)</h2>

            <p className="text-sm text-muted-foreground">
              Debe coincidir exactamente con tu cedula o documento oficial.
            </p>

            <div className="space-y-2">
              <Label htmlFor="cedula">Cédula</Label>
              <Input
                id="cedula"
                value={cedula}
                onChange={(event) => setCedula(event.target.value)}
                disabled={loading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nombres">Nombres (segun documento)</Label>
              <Input
                id="nombres"
                value={nombres}
                onChange={(event) => setNombres(event.target.value)}
                disabled={loading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="apellidos">Apellidos (segun documento)</Label>
              <Input
                id="apellidos"
                value={apellidos}
                onChange={(event) => setApellidos(event.target.value)}
                disabled={loading}
                required
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="fecha_nacimiento">Fecha nacimiento</Label>
                <Input
                  id="fecha_nacimiento"
                  type="date"
                  value={fechaNacimiento}
                  onChange={(event) => setFechaNacimiento(event.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="genero">Género</Label>
                <Select
                  value={genero}
                  onValueChange={setGenero}
                  disabled={loading}
                >
                  <SelectTrigger
                    id="genero"
                    className="w-full"
                  >
                    <SelectValue placeholder="Selecciona tu género" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem
                      value="FEMENINO"
                      className="cursor-pointer focus:bg-primary/10 focus:text-primary data-[state=checked]:bg-primary/10 data-[state=checked]:text-primary"
                    >
                      🙋‍♀️ Femenino
                    </SelectItem>
                    <SelectItem
                      value="MASCULINO"
                      className="cursor-pointer focus:bg-primary/10 focus:text-primary data-[state=checked]:bg-primary/10 data-[state=checked]:text-primary"
                    >
                      🙋‍♂️ Masculino
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="nacionalidad">Nacionalidad</Label>
              <Select
                value={nacionalidad}
                onValueChange={setNacionalidad}
                disabled={loading}
              >
                <SelectTrigger
                  id="nacionalidad"
                  className="w-full"
                >
                  <SelectValue placeholder="Selecciona tu nacionalidad" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem
                    value="ECUATORIANA"
                    className="cursor-pointer focus:bg-primary/10 focus:text-primary data-[state=checked]:bg-primary/10 data-[state=checked]:text-primary"
                  >
                    🇪🇨 Ecuatoriana
                  </SelectItem>
                  <SelectItem
                    value="COLOMBIANA"
                    className="cursor-pointer focus:bg-primary/10 focus:text-primary data-[state=checked]:bg-primary/10 data-[state=checked]:text-primary"
                  >
                    🇨🇴 Colombiana
                  </SelectItem>
                  <SelectItem
                    value="PERUANA"
                    className="cursor-pointer focus:bg-primary/10 focus:text-primary data-[state=checked]:bg-primary/10 data-[state=checked]:text-primary"
                  >
                    🇵🇪 Peruana
                  </SelectItem>
                  <SelectItem
                    value="VENEZOLANA"
                    className="cursor-pointer focus:bg-primary/10 focus:text-primary data-[state=checked]:bg-primary/10 data-[state=checked]:text-primary"
                  >
                    🇻🇪 Venezolana
                  </SelectItem>
                  <SelectItem
                    value="ARGENTINA"
                    className="cursor-pointer focus:bg-primary/10 focus:text-primary data-[state=checked]:bg-primary/10 data-[state=checked]:text-primary"
                  >
                    🇦🇷 Argentina
                  </SelectItem>
                  <SelectItem
                    value="CHILENA"
                    className="cursor-pointer focus:bg-primary/10 focus:text-primary data-[state=checked]:bg-primary/10 data-[state=checked]:text-primary"
                  >
                    🇨🇱 Chilena
                  </SelectItem>
                  <SelectItem
                    value="MEXICANA"
                    className="cursor-pointer focus:bg-primary/10 focus:text-primary data-[state=checked]:bg-primary/10 data-[state=checked]:text-primary"
                  >
                    🇲🇽 Mexicana
                  </SelectItem>
                  <SelectItem
                    value="ESPAÑOLA"
                    className="cursor-pointer focus:bg-primary/10 focus:text-primary data-[state=checked]:bg-primary/10 data-[state=checked]:text-primary"
                  >
                    🇪🇸 Española
                  </SelectItem>
                  <SelectItem
                    value="ESTADOUNIDENSE"
                    className="cursor-pointer focus:bg-primary/10 focus:text-primary data-[state=checked]:bg-primary/10 data-[state=checked]:text-primary"
                  >
                    🇺🇸 Estadounidense
                  </SelectItem>
                  <SelectItem
                    value="BRASILEÑA"
                    className="cursor-pointer focus:bg-primary/10 focus:text-primary data-[state=checked]:bg-primary/10 data-[state=checked]:text-primary"
                  >
                    🇧🇷 Brasileña
                  </SelectItem>
                  <SelectItem
                    value="BOLIVIANA"
                    className="cursor-pointer focus:bg-primary/10 focus:text-primary data-[state=checked]:bg-primary/10 data-[state=checked]:text-primary"
                  >
                    🇧🇴 Boliviana
                  </SelectItem>
                  <SelectItem
                    value="OTRA"
                    className="cursor-pointer focus:bg-primary/10 focus:text-primary data-[state=checked]:bg-primary/10 data-[state=checked]:text-primary"
                  >
                    🌎 Otra
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="correo_alternativo">Correo alternativo</Label>
              <Input
                id="correo_alternativo"
                type="email"
                value={correoAlternativo}
                onChange={(event) => setCorreoAlternativo(event.target.value)}
                disabled={loading}
                placeholder="Opcional"
              />
            </div>
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar cambios'}
            </Button>

            {onCancel && (
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={onCancel}
                disabled={loading}
              >
                Cancelar
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
