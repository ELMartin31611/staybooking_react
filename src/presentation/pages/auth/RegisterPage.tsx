import { useState } from 'react'
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Crown,
  Eye,
  EyeOff,
  Hotel,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
  User,
} from 'lucide-react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { ApiException } from '@/domain/exceptions/api.exception'
import { authUseCase } from '@/infrastructure/factories/auth.factory'
import { localTokenStorage } from '@/infrastructure/storage/local-token-storage'
import { localUserStorage } from '@/infrastructure/storage/local-user-storage'
import {
  Alert,
  AlertDescription,
} from '@/presentation/components/ui/alert'
import { Button } from '@/presentation/components/ui/button'
import { Input } from '@/presentation/components/ui/input'
import { Label } from '@/presentation/components/ui/label'
import { ThemeToggle } from '@/presentation/components/ui/theme-toggle'

const VIP_PERKS = [
  { title: 'Tarifas Exclusivas VIP Neón', desc: 'Acceso directo a los mejores precios sin cargos ocultos' },
  { title: 'Habitaciones VIP Preferenciales', desc: 'Asignación inmediata de pisos superiores' },
  { title: 'Late Check-out Flexible', desc: 'Disfruta más horas de tu estancia' },
  { title: 'Atención Concierge 24/7', desc: 'Asistencia inmediata a través de la app' },
]

function PasswordStrengthMeter({ password }: { password: string }) {
  if (!password) return null

  const hasLength = password.length >= 8
  const hasUpper = /[A-Z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  const hasSpecial = /[^A-Za-z0-9]/.test(password)

  const score = [hasLength, hasUpper, hasNumber, hasSpecial].filter(Boolean).length

  const labels = ['', 'Débil', 'Aceptable', 'Buena', 'Segura Neón']
  const colorClasses = [
    '',
    'bg-destructive',
    'bg-amber-500',
    'bg-yellow-400',
    'bg-[#ff0055] shadow-[0_0_10px_#ff0055]',
  ]
  const textColors = [
    '',
    'text-destructive',
    'text-amber-500',
    'text-yellow-500',
    'text-[#ff0055]',
  ]

  return (
    <div className="space-y-2 pt-1">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-muted-foreground">Fuerza de la contraseña:</span>
        <span className={`text-xs font-black uppercase ${textColors[score]}`}>
          {labels[score]}
        </span>
      </div>
      <div className="grid grid-cols-4 gap-1.5">
        {[1, 2, 3, 4].map((step) => (
          <div
            key={step}
            className={`h-2 rounded-full transition-all duration-300 ${
              step <= score ? colorClasses[score] : 'bg-muted'
            }`}
          />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-x-2 gap-y-1 pt-1 text-[11px] text-muted-foreground font-medium">
        <span className={`flex items-center gap-1 ${hasLength ? 'text-[#ff0055] font-bold' : ''}`}>
          <Check className="size-3" /> Mínimo 8 caracteres
        </span>
        <span className={`flex items-center gap-1 ${hasNumber ? 'text-[#ff0055] font-bold' : ''}`}>
          <Check className="size-3" /> Incluye número
        </span>
        <span className={`flex items-center gap-1 ${hasUpper ? 'text-[#ff0055] font-bold' : ''}`}>
          <Check className="size-3" /> Mayúscula
        </span>
        <span className={`flex items-center gap-1 ${hasSpecial ? 'text-[#ff0055] font-bold' : ''}`}>
          <Check className="size-3" /> Símbolo
        </span>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [acceptTerms, setAcceptTerms] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!acceptTerms) {
      setError('Por favor acepta los términos de uso para registrarte.')
      return
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas escritas no coinciden.')
      return
    }

    const normalizedUsername = username.trim()
    const normalizedEmail = email.trim()

    try {
      setLoading(true)
      setError('')

      await authUseCase.register({
        username: normalizedUsername,
        email: normalizedEmail,
        password,
      })

      const tokens = await authUseCase.login({
        username: normalizedUsername,
        password,
      })

      localTokenStorage.saveTokens(tokens)

      const profile = await authUseCase.getProfile()
      localUserStorage.saveUser(profile)

      navigate('/', { replace: true })
    } catch (caughtError: unknown) {
      localTokenStorage.clearTokens()
      localUserStorage.clearUser()

      if (caughtError instanceof ApiException) {
        setError(caughtError.message)
      } else {
        setError('No se pudo completar el registro. Intenta nuevamente.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="relative grid min-h-screen bg-background text-foreground lg:grid-cols-[1.1fr_1fr] overflow-hidden transition-colors duration-300">
      {/* ═══════════════════════════════════════════════════════
          LEFT PANEL — Imagen con movimiento Neón y Ventajas
          ═══════════════════════════════════════════════════════ */}
      <section className="relative hidden overflow-hidden lg:flex lg:flex-col lg:justify-between lg:p-12">
        {/* Animated Moving Background Image */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1920&q=80"
            alt="Resort Moving Pool"
            className="size-full object-cover hero-ken-burns filter brightness-[0.65] contrast-110 scale-110"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#030305] via-[#030305]/75 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#ff0055]/30 via-[#030305]/80 to-[#030305]" />
          
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,0,85,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,0,85,0.08)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        </div>

        {/* Ambient Glow Orbs */}
        <div className="pointer-events-none absolute -left-20 top-20 size-96 rounded-full bg-[#ff0055]/35 blur-3xl animate-pulse" />
        <div className="pointer-events-none absolute bottom-20 right-20 size-80 rounded-full bg-rose-600/25 blur-3xl animate-pulse [animation-delay:1.5s]" />

        {/* Top Logo */}
        <div className="relative z-10 flex items-center justify-between">
          <Link
            to="/"
            className="group flex items-center gap-3 text-white transition-transform hover:scale-[1.02]"
          >
            <div className="flex size-11 items-center justify-center rounded-2xl bg-black/60 shadow-[0_0_20px_rgba(255,0,85,0.5)] border border-[#ff0055]/60 backdrop-blur-md transition-all group-hover:bg-[#ff0055]">
              <Hotel className="size-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tight text-white drop-shadow-[0_0_10px_rgba(255,0,85,0.8)]">
                Stay<span className="text-[#ff0055]">Booking</span>
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-[#ff0055]">
                Luxury Neon Collection
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-2 rounded-full border border-[#ff0055]/40 bg-black/60 px-3.5 py-1.5 backdrop-blur-md shadow-[0_0_15px_rgba(255,0,85,0.2)]">
            <Crown className="size-4 text-[#ff0055]" />
            <span className="text-xs font-bold text-white">Registro VIP Sin Costo</span>
          </div>
        </div>

        {/* Perks Copy */}
        <div className="relative z-10 max-w-xl space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#ff0055]/50 bg-black/50 px-4 py-2 text-xs font-extrabold tracking-wide text-white backdrop-blur-md shadow-[0_0_15px_rgba(255,0,85,0.3)]">
            <Sparkles className="size-4 text-[#ff0055]" />
            Beneficios Exclusivos de Membresía
          </div>

          <div className="space-y-3">
            <h1 className="text-5xl font-black leading-[1.1] tracking-tight text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)]">
              Tu próximo destino de ensueño a un clic
            </h1>
            <p className="text-lg font-medium leading-relaxed text-slate-200/90 drop-shadow">
              Únete gratis a nuestra comunidad de viajeros exclusivos y accede a beneficios Neón inmediatos.
            </p>
          </div>

          <div className="space-y-3.5 pt-2">
            {VIP_PERKS.map((perk) => (
              <div
                key={perk.title}
                className="flex items-start gap-4 rounded-2xl border border-[#ff0055]/40 bg-black/50 p-4 backdrop-blur-md shadow-[0_0_20px_rgba(255,0,85,0.15)] transition-transform hover:scale-[1.01]"
              >
                <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#ff0055] to-rose-600 text-white shadow-[0_0_10px_#ff0055]">
                  <CheckCircle2 className="size-5" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-white">{perk.title}</h4>
                  <p className="text-xs font-medium text-slate-300">{perk.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Social proof footer */}
        <div className="relative z-10 flex items-center justify-between border-t border-[#ff0055]/30 pt-6 text-white">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {['photo-1534528741775-53994a69daeb', 'photo-1507003211169-0a1dd7228f2d', 'photo-1494790108377-be9c29b29330'].map((id) => (
                <img
                  key={id}
                  src={`https://images.unsplash.com/${id}?auto=format&fit=crop&w=80&q=80`}
                  alt="Member Avatar"
                  className="size-9 rounded-full border-2 border-[#ff0055] object-cover"
                />
              ))}
            </div>
            <div>
              <p className="text-xs font-black text-white">+85,000 Usuarios Registrados</p>
              <p className="text-[11px] text-slate-400">Viajeros alrededor del mundo</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-bold text-[#ff0055]">
            <ShieldCheck className="size-4" />
            100% Verificado
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          RIGHT PANEL — Formulario de Registro Neón
          ═══════════════════════════════════════════════════════ */}
      <section className="relative flex items-center justify-center p-6 sm:p-12 lg:p-16">
        <div className="absolute right-6 top-6 z-20 flex items-center gap-3">
          <ThemeToggle />
        </div>

        <Link
          to="/"
          className="absolute left-6 top-6 flex items-center gap-2 text-foreground lg:hidden"
        >
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/30">
            <Hotel className="size-5" />
          </div>
          <span className="text-xl font-black tracking-tight">StayBooking</span>
        </Link>

        <div className="relative z-10 w-full max-w-md space-y-8">
          <div className="space-y-2 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary shadow-[0_0_10px_rgba(255,0,85,0.2)]">
              <Crown className="size-3.5" />
              Membresía Neón VIP
            </div>
            <h2 className="text-4xl font-black tracking-tight text-foreground">
              Crea tu cuenta gratis
            </h2>
            <p className="text-base font-medium text-muted-foreground">
              Ingresa tus datos para empezar a explorar
            </p>
          </div>

          {/* Social Register */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-border bg-card font-bold text-foreground text-sm shadow-sm transition-all hover:bg-accent hover:border-primary/50 active:scale-[0.98]"
            >
              <svg className="size-5" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.3 8.8 5 12 5z"/>
                <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"/>
                <path fill="#FBBC05" d="M5.3 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.6 7.3C.6 9.3 0 11.6 0 14s.6 4.7 1.6 6.7l3.7-2.9z"/>
                <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.2 0-5.8-2.3-6.7-5.3L1.6 16C3.5 19.8 7.4 23 12 23z"/>
              </svg>
              Google
            </button>

            <button
              type="button"
              className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-border bg-card font-bold text-foreground text-sm shadow-sm transition-all hover:bg-accent hover:border-primary/50 active:scale-[0.98]"
            >
              <svg className="size-5 fill-current" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.4c.66-.8 1.11-1.92.99-3.04-.96.04-2.12.64-2.8 1.44-.61.71-1.14 1.86-1 2.97 1.08.08 2.16-.57 2.81-1.37z"/>
              </svg>
              Apple ID
            </button>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="w-full border-t border-border" />
            <span className="absolute bg-background px-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              o completa los datos
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div className="space-y-1.5">
              <Label htmlFor="username" className="text-xs font-bold uppercase tracking-wider text-foreground">
                Nombre de Usuario
              </Label>
              <div className="group relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-muted-foreground transition-colors group-focus-within:text-primary">
                  <User className="size-5" />
                </div>
                <Input
                  id="username"
                  name="username"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={loading}
                  required
                  placeholder="Elige tu nombre de usuario"
                  className="h-13 rounded-2xl border-2 border-border bg-card pl-12 text-sm font-semibold text-foreground transition-all placeholder:text-muted-foreground/60 focus:border-primary focus:ring-4 focus:ring-primary/20 dark:border-[#ff0055]/30 dark:focus:border-[#ff0055]"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-foreground">
                Correo Electrónico
              </Label>
              <div className="group relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-muted-foreground transition-colors group-focus-within:text-primary">
                  <Mail className="size-5" />
                </div>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                  placeholder="ejemplo@correo.com"
                  className="h-13 rounded-2xl border-2 border-border bg-card pl-12 text-sm font-semibold text-foreground transition-all placeholder:text-muted-foreground/60 focus:border-primary focus:ring-4 focus:ring-primary/20 dark:border-[#ff0055]/30 dark:focus:border-[#ff0055]"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-foreground">
                Contraseña
              </Label>
              <div className="group relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-muted-foreground transition-colors group-focus-within:text-primary">
                  <Lock className="size-5" />
                </div>
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                  placeholder="Mínimo 8 caracteres"
                  className="h-13 rounded-2xl border-2 border-border bg-card pl-12 pr-12 text-sm font-semibold text-foreground transition-all placeholder:text-muted-foreground/60 focus:border-primary focus:ring-4 focus:ring-primary/20 dark:border-[#ff0055]/30 dark:focus:border-[#ff0055]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-muted-foreground transition-colors hover:text-foreground"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="size-5" />
                  ) : (
                    <Eye className="size-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword" className="text-xs font-bold uppercase tracking-wider text-foreground">
                Confirmar Contraseña
              </Label>
              <div className="group relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-muted-foreground transition-colors group-focus-within:text-primary">
                  <Lock className="size-5" />
                </div>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  required
                  placeholder="Repite la contraseña"
                  className="h-13 rounded-2xl border-2 border-border bg-card pl-12 text-sm font-semibold text-foreground transition-all placeholder:text-muted-foreground/60 focus:border-primary focus:ring-4 focus:ring-primary/20 dark:border-[#ff0055]/30 dark:focus:border-[#ff0055]"
                />
              </div>
              <PasswordStrengthMeter password={password} />
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start space-x-2 pt-1">
              <input
                type="checkbox"
                id="terms"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="mt-0.5 size-4 rounded border-border text-primary focus:ring-primary"
              />
              <label htmlFor="terms" className="text-xs font-medium text-muted-foreground cursor-pointer select-none leading-normal">
                Acepto los{' '}
                <span className="font-bold text-primary underline">Términos de Servicio</span> y la{' '}
                <span className="font-bold text-primary underline">Política de Privacidad</span>.
              </label>
            </div>

            {/* Error Alert */}
            {error && (
              <Alert variant="destructive" className="rounded-2xl border border-destructive/40 bg-destructive/10 text-destructive shadow-[0_0_15px_rgba(255,0,85,0.2)]">
                <AlertDescription className="text-sm font-semibold">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="group relative h-14 w-full overflow-hidden rounded-2xl bg-primary text-base font-black text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:scale-[1.01] hover:shadow-xl hover:shadow-primary/40 active:scale-[0.99] disabled:opacity-50"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Registrando cuenta VIP...
                  </span>
                ) : (
                  <>
                    Crear Cuenta Gratis
                    <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </span>
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
            </Button>
          </form>

          {/* Footer Navigation */}
          <div className="space-y-4 pt-1 text-center">
            <p className="text-sm font-semibold text-muted-foreground">
              ¿Ya tienes cuenta?{' '}
              <Link
                to="/login"
                className="font-extrabold text-primary underline-offset-4 transition-all hover:underline"
              >
                Inicia sesión aquí
              </Link>
            </p>

            <Button
              variant="ghost"
              asChild
              className="h-10 text-xs font-bold text-muted-foreground hover:text-foreground"
            >
              <Link to="/">
                ← Volver al sitio principal
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
