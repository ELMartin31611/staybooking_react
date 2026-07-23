import { useState } from 'react'
import {
  ArrowRight,
  CheckCircle,
  Eye,
  EyeOff,
  Hotel,
  Lock,
  ShieldCheck,
  Sparkles,
  Star,
  User,
} from 'lucide-react'
import type { FormEvent } from 'react'
import {
  Link,
  useLocation,
  useNavigate,
} from 'react-router-dom'

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

interface LoginLocationState {
  from?: string | {
    pathname?: string
  }
}

function isSafeInternalPath(path: string): boolean {
  return (
    path.startsWith('/')
    && !path.startsWith('//')
    && path !== '/login'
    && path !== '/register'
  )
}

function resolveRedirect(state: LoginLocationState | null): string {
  const from = state?.from

  if (
    typeof from === 'string'
    && isSafeInternalPath(from)
  ) {
    return from
  }

  if (
    from
    && typeof from === 'object'
    && typeof from.pathname === 'string'
    && isSafeInternalPath(from.pathname)
  ) {
    return from.pathname
  }

  return '/'
}

export default function LoginPage() {
  const location = useLocation()
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    try {
      setLoading(true)
      setError('')

      const tokens = await authUseCase.login({
        username: username.trim(),
        password,
      })

      localTokenStorage.saveTokens(tokens)

      const profile = await authUseCase.getProfile()
      localUserStorage.saveUser(profile)

      navigate(resolveRedirect(location.state as LoginLocationState | null), { replace: true })
    } catch (caughtError: unknown) {
      localTokenStorage.clearTokens()
      localUserStorage.clearUser()

      if (caughtError instanceof ApiException) {
        setError(caughtError.message)
      } else {
        setError('No se pudo iniciar sesión. Verifica que tus datos sean correctos.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="relative grid min-h-screen bg-background text-foreground lg:grid-cols-[1.1fr_1fr] overflow-hidden transition-colors duration-300">
      {/* ═══════════════════════════════════════════════════════
          LEFT PANEL — Imagen con movimiento y líneas Neón
          ═══════════════════════════════════════════════════════ */}
      <section className="relative hidden overflow-hidden lg:flex lg:flex-col lg:justify-between lg:p-12">
        {/* Animated Moving Background Image (Ken-Burns infinite zoom + slow motion pan) */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1920&q=80"
            alt="Moving Luxury Hotel background"
            className="size-full object-cover hero-ken-burns filter brightness-[0.7] contrast-110 scale-110"
          />

          {/* Deep dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#030305] via-[#030305]/75 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#ff0055]/30 via-[#030305]/80 to-[#030305]" />
          
          {/* Subtle Cyber Grid Lines with Neon Glow */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,0,85,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,0,85,0.08)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        </div>

        {/* Floating Neon Lights */}
        <div className="pointer-events-none absolute -left-20 top-10 size-96 rounded-full bg-[#ff0055]/30 blur-3xl animate-pulse" />
        <div className="pointer-events-none absolute bottom-10 right-10 size-80 rounded-full bg-rose-600/25 blur-3xl animate-pulse [animation-delay:1s]" />

        {/* Top Header Logo */}
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
            <ShieldCheck className="size-4 text-[#ff0055]" />
            <span className="text-xs font-bold text-white">Reserva VIP 100% Segura</span>
          </div>
        </div>

        {/* Center Hero Card */}
        <div className="relative z-10 max-w-xl space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#ff0055]/50 bg-black/50 px-4 py-2 text-xs font-extrabold tracking-wide text-white backdrop-blur-md shadow-[0_0_15px_rgba(255,0,85,0.3)]">
            <Sparkles className="size-4 text-[#ff0055] animate-spin" />
            Experiencia de Hospedaje Inmersiva
          </div>

          <div className="space-y-4">
            <h1 className="text-5xl font-black leading-[1.1] tracking-tight text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)]">
              Descubre la elegancia con movimiento y estilo Neón
            </h1>
            <p className="text-lg font-medium leading-relaxed text-slate-200/90 drop-shadow">
              Tarifas exclusivas, suites de alto standing y atención personalizada las 24 horas del día.
            </p>
          </div>

          {/* Social Proof Floating Card */}
          <div className="glass-card-dark rounded-3xl p-6 border border-[#ff0055]/40 shadow-[0_0_30px_rgba(255,0,85,0.25)] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="size-4 fill-[#ff0055] text-[#ff0055]" />
                ))}
              </div>
              <span className="text-xs font-bold text-white/90">★ 4.98 Excelencia Garantizada</span>
            </div>
            <p className="text-sm italic font-semibold text-slate-100">
              "El diseño de la plataforma y la facilidad de reservar mi suite favorita es sencillamente insuperable."
            </p>
            <div className="flex items-center gap-3 pt-1">
              <div className="flex size-9 items-center justify-center rounded-full bg-gradient-to-tr from-[#ff0055] to-rose-600 font-bold text-white text-xs shadow-md">
                VIP
              </div>
              <div>
                <p className="text-xs font-bold text-white">Carlos Gutiérrez</p>
                <p className="text-[11px] text-[#ff0055] font-semibold">Miembro Platinum</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Stats Row */}
        <div className="relative z-10 grid grid-cols-3 gap-4 border-t border-[#ff0055]/30 pt-6 text-white">
          <div>
            <p className="text-3xl font-black text-white drop-shadow-[0_0_10px_rgba(255,0,85,0.6)]">500+</p>
            <p className="text-xs font-semibold text-slate-300">Hoteles Exclusivos</p>
          </div>
          <div>
            <p className="text-3xl font-black text-white drop-shadow-[0_0_10px_rgba(255,0,85,0.6)]">99.9%</p>
            <p className="text-xs font-semibold text-slate-300">Satisfacción</p>
          </div>
          <div>
            <p className="text-3xl font-black text-white drop-shadow-[0_0_10px_rgba(255,0,85,0.6)]">24/7</p>
            <p className="text-xs font-semibold text-slate-300">Soporte Concierge</p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          RIGHT PANEL — Formulario de Inicio de Sesión Neón
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
              <CheckCircle className="size-3.5" />
              Acceso a tu cuenta VIP
            </div>
            <h2 className="text-4xl font-black tracking-tight text-foreground">
              Bienvenido de nuevo
            </h2>
            <p className="text-base font-medium text-muted-foreground">
              Ingresa tus credenciales para acceder al catálogo
            </p>
          </div>

          {/* Social Quick Login Buttons */}
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
              o con usuario
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div className="space-y-2">
              <Label htmlFor="username" className="text-xs font-bold uppercase tracking-wider text-foreground">
                Usuario
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
                  placeholder="Tu usuario de acceso"
                  className="h-14 rounded-2xl border-2 border-border bg-card pl-12 text-base font-semibold text-foreground transition-all placeholder:text-muted-foreground/60 focus:border-primary focus:ring-4 focus:ring-primary/20 dark:border-[#ff0055]/30 dark:focus:border-[#ff0055]"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Contraseña
                </Label>
                <a
                  href="#forgot"
                  onClick={(e) => {
                    e.preventDefault()
                    alert('Verifica con tu administrador o intenta registrándote nuevamente.')
                  }}
                  className="text-xs font-bold text-primary hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
              <div className="group relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-muted-foreground transition-colors group-focus-within:text-primary">
                  <Lock className="size-5" />
                </div>
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                  placeholder="••••••••••••"
                  className="h-14 rounded-2xl border-2 border-border bg-card pl-12 pr-12 text-base font-semibold text-foreground transition-all placeholder:text-muted-foreground/60 focus:border-primary focus:ring-4 focus:ring-primary/20 dark:border-[#ff0055]/30 dark:focus:border-[#ff0055]"
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

            {/* Remember Me Checkbox */}
            <div className="flex items-center space-x-2 pt-1">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="size-4 rounded border-border text-primary focus:ring-primary"
              />
              <label htmlFor="remember" className="text-xs font-bold text-muted-foreground cursor-pointer select-none">
                Mantener sesión activa
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
                    Iniciando sesión...
                  </span>
                ) : (
                  <>
                    Iniciar Sesión VIP
                    <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </span>
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
            </Button>
          </form>

          {/* Footer Navigation */}
          <div className="space-y-4 pt-2 text-center">
            <p className="text-sm font-semibold text-muted-foreground">
              ¿Aún no tienes cuenta?{' '}
              <Link
                to="/register"
                className="font-extrabold text-primary underline-offset-4 transition-all hover:underline"
              >
                Regístrate gratis
              </Link>
            </p>

            <Button
              variant="ghost"
              asChild
              className="h-10 text-xs font-bold text-muted-foreground hover:text-foreground"
            >
              <Link to="/">
                ← Volver a la página principal
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
