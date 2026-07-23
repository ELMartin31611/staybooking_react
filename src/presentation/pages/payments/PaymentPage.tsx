import {
  ArrowLeft,
  BadgeCheck,
  Building2,
  CheckCircle2,
  CreditCard,
  FileText,
  Hash,
  Loader2,
  Lock,
  ShieldCheck,
  Zap,
} from 'lucide-react'
import { useState } from 'react'
import type { FormEvent } from 'react'
import {
  Link,
  useParams,
} from 'react-router-dom'

import type { PaymentMethod } from '@/domain/entities/billing.entity'
import { ApiException } from '@/domain/exceptions/api.exception'
import {
  Alert,
  AlertDescription,
} from '@/presentation/components/ui/alert'
import { Button } from '@/presentation/components/ui/button'
import { Input } from '@/presentation/components/ui/input'
import { Label } from '@/presentation/components/ui/label'
import { Separator } from '@/presentation/components/ui/separator'
import { Skeleton } from '@/presentation/components/ui/skeleton'
import {
  useInvoiceByReservation,
  useProcessPayment,
} from '@/presentation/hooks/useBilling'
import { useReservation } from '@/presentation/hooks/useReservations'

function formatCurrency(value: string | number, currency: string): string {
  const amount = Number(value)
  try {
    return new Intl.NumberFormat('es-EC', { style: 'currency', currency }).format(amount)
  } catch {
    return `${amount.toFixed(2)} ${currency}`
  }
}

/* ── Card brand chip visuals ── */
function VisaLogo() {
  return (
    <svg viewBox="0 0 80 26" className="h-5 w-auto" aria-label="Visa">
      <path fill="#1A1F71" d="M32.6 1.3L29.1 24.7h5.5L38 1.3H32.6zM25.6 1.3l-5.2 15.9-0.6-3.2L17.6 3.2A2.3 2.3 0 0015.4 1.3H6.2L6.1 1.8c2.1.5 4 1.3 5.7 2.4l4.8 18.5h5.7L29.5 1.3H25.6zM62.1 16.1L65 8.3l1.7 7.8H62.1zM68.5 1.3h-4.8A2.4 2.4 0 0061.3 3l-8.2 21.7h5.7l1.1-3.2h7l.7 3.2H73L68.5 1.3zM50.5 8.1c0-2.4 5.4-2 7.7-.8l0.8-4.7C57.4 2 55.5 1 52.9 1 47.6 1 43.9 4 43.9 8c0 5.8 7.7 6.1 7.7 9.3 0 2.2-2.6 2.5-5.1 2.1l-1.3-.3-0.8 4.9c1.4.7 3.9 1.3 6.5 1.3 5.5 0 9.1-2.9 9.1-7.4C59.9 11.6 50.5 11 50.5 8.1z" />
    </svg>
  )
}

function MastercardLogo() {
  return (
    <svg viewBox="0 0 38 24" className="h-5 w-auto" aria-label="Mastercard">
      <rect width="38" height="24" rx="4" fill="none" />
      <circle cx="15" cy="12" r="7" fill="#EB001B" />
      <circle cx="23" cy="12" r="7" fill="#F79E1B" />
      <path d="M19 7.3a7 7 0 010 9.4A7 7 0 0119 7.3z" fill="#FF5F00" />
    </svg>
  )
}

function AmexLogo() {
  return (
    <svg viewBox="0 0 60 20" className="h-4 w-auto" aria-label="American Express">
      <rect width="60" height="20" rx="3" fill="#2E77BC" />
      <text x="5" y="15" fontFamily="Arial" fontSize="12" fontWeight="bold" fill="white">AMEX</text>
    </svg>
  )
}

/* ── Credit card visual component ── */
function CreditCardVisual({ selected }: { selected: boolean }) {
  return (
    <div className={`relative h-36 w-full overflow-hidden rounded-2xl transition-all duration-300 ${
      selected
        ? 'shadow-xl shadow-primary/30 scale-[1.02]'
        : 'opacity-70 scale-[0.98]'
    }`}>
      {/* Card gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a0030] via-[#2d0060] to-[#ff0055]" />
      {/* Chip shine */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,rgba(255,255,255,0.12)_0%,transparent_60%)]" />
      {/* Animated shimmer */}
      <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent_30%,rgba(255,255,255,0.06)_50%,transparent_70%)] animate-shimmer" />

      <div className="relative z-10 flex h-full flex-col justify-between p-5">
        {/* Top row */}
        <div className="flex items-start justify-between">
          <div className="flex gap-1.5">
            <div className="size-7 rounded bg-yellow-400/80" />
            <div className="size-7 rounded bg-yellow-400/40" />
          </div>
          <div className="flex flex-col items-end gap-0.5">
            <Lock className="size-3.5 text-white/60" />
            <span className="text-[8px] font-bold uppercase tracking-widest text-white/60">Secured</span>
          </div>
        </div>

        {/* Card number placeholder */}
        <div className="flex items-center gap-2 font-mono text-sm font-bold tracking-[0.25em] text-white/80">
          <span>••••</span>
          <span>••••</span>
          <span>••••</span>
          <span>0000</span>
        </div>

        {/* Bottom row */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[8px] font-bold uppercase tracking-widest text-white/50">Titular</p>
            <p className="text-xs font-bold text-white/90">NOMBRE APELLIDO</p>
          </div>
          <div className="flex items-center gap-2">
            <VisaLogo />
            <MastercardLogo />
            <AmexLogo />
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Bank transfer card ── */
interface BankInfo {
  name: string
  account: string
  accountType: string
  ruc: string
  color: string
  textColor: string
  logoColor: string
}

const BANKS: BankInfo[] = [
  {
    name: 'Banco Pichincha',
    account: '2200123456',
    accountType: 'Cuenta Corriente',
    ruc: '1791281198001',
    color: 'from-[#FF6600] to-[#FF8C00]',
    textColor: 'text-orange-700 dark:text-orange-300',
    logoColor: 'bg-orange-500',
  },
  {
    name: 'Banco de Guayaquil',
    account: '0123456789',
    accountType: 'Cuenta de Ahorros',
    ruc: '0990012345001',
    color: 'from-[#003087] to-[#0052CC]',
    textColor: 'text-blue-700 dark:text-blue-300',
    logoColor: 'bg-blue-700',
  },
]

function BankCard({ bank, selected, onClick }: { bank: BankInfo; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full overflow-hidden rounded-2xl border-2 text-left transition-all duration-200 active:scale-[0.99] ${
        selected
          ? 'border-primary shadow-md shadow-primary/15'
          : 'border-border hover:border-border/80 dark:hover:border-zinc-700'
      }`}
    >
      {/* Bank header */}
      <div className={`flex items-center gap-3 bg-gradient-to-r ${bank.color} p-4`}>
        <div className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${bank.logoColor} shadow-md`}>
          <Building2 className="size-5 text-white" />
        </div>
        <div>
          <p className="text-sm font-extrabold text-white">{bank.name}</p>
          <p className="text-[10px] font-semibold text-white/75">{bank.accountType}</p>
        </div>
        {selected && (
          <BadgeCheck className="ml-auto size-5 shrink-0 text-white" />
        )}
      </div>

      {/* Account details */}
      <div className="space-y-2 bg-card p-4">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Nº de cuenta</span>
          <span className="font-mono text-sm font-extrabold text-foreground">{bank.account}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">RUC</span>
          <span className="font-mono text-xs font-bold text-foreground">{bank.ruc}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Beneficiario</span>
          <span className="text-xs font-bold text-foreground">StayBooking S.A.</span>
        </div>
      </div>
    </button>
  )
}

export default function PaymentPage() {
  const { reservationId } = useParams()
  const id = Number(reservationId)

  const reservationQuery = useReservation(id)
  const invoiceQuery = useInvoiceByReservation(id)
  const processPayment = useProcessPayment()

  const [method, setMethod] = useState<PaymentMethod>('tarjeta')
  const [selectedBank, setSelectedBank] = useState<string>(BANKS[0].name)
  const [reference, setReference] = useState('')
  const [accepted, setAccepted] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage(null)

    if (!accepted) {
      setErrorMessage('Confirma que deseas procesar el pago.')
      return
    }

    if (method === 'transferencia' && reference.trim() === '') {
      setErrorMessage('Ingresa el número de comprobante de la transferencia.')
      return
    }

    try {
      await processPayment.mutateAsync({
        reservationId: id,
        paymentMethod: method,
        reference: reference.trim() || undefined,
      })
    } catch (error: unknown) {
      if (error instanceof ApiException || error instanceof Error) {
        setErrorMessage(error.message)
      } else {
        setErrorMessage('No fue posible procesar el pago.')
      }
    }
  }

  if (reservationQuery.isPending || invoiceQuery.isPending) {
    return (
      <div className="mx-auto my-12 max-w-3xl space-y-4 px-4">
        <Skeleton className="h-10 w-48 rounded-xl" />
        <Skeleton className="h-40 rounded-3xl" />
        <Skeleton className="h-64 rounded-3xl" />
      </div>
    )
  }

  if (reservationQuery.isError || !reservationQuery.data) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-12">
        <Alert variant="destructive" className="rounded-2xl">
          <AlertDescription>No fue posible cargar la reserva.</AlertDescription>
        </Alert>
      </main>
    )
  }

  const reservation = reservationQuery.data
  const result = processPayment.data

  /* ── Success state ── */
  if (result) {
    return (
      <main className="mx-auto max-w-3xl space-y-6 px-4 py-12">
        {/* Success banner */}
        <div className="relative overflow-hidden rounded-3xl border border-emerald-700/30 bg-gradient-to-tr from-emerald-950 via-emerald-900 to-teal-900 p-8 text-white shadow-2xl">
          <div className="pointer-events-none absolute -right-10 -top-10 size-48 rounded-full bg-emerald-400/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-8 left-0 size-32 rounded-full bg-teal-400/10 blur-2xl" />
          <div className="relative z-10 flex items-center gap-5">
            <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-emerald-400/20 shadow-inner">
              <CheckCircle2 className="size-9 text-emerald-300" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-emerald-300/70">Pago procesado</p>
              <h1 className="text-3xl font-black text-white">¡Pago aprobado!</h1>
              <p className="mt-1 text-sm text-emerald-100/75">La reserva fue confirmada y la factura fue emitida exitosamente.</p>
            </div>
          </div>
        </div>

        {/* Invoice card */}
        <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
          <div className="border-b border-border p-6">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
                <FileText className="size-5 text-primary" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Factura emitida</p>
                <p className="text-lg font-extrabold text-foreground">{result.factura.numero_factura}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4 p-6">
            <div className="grid gap-3 rounded-2xl bg-muted/30 dark:bg-muted/20 p-5">
              {[
                { label: 'Reserva', value: result.factura.reserva_codigo },
                { label: 'Transacción', value: result.pago.codigo_transaccion, mono: true },
              ].map(({ label, value, mono }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{label}</span>
                  <strong className={`font-bold text-foreground ${mono ? 'font-mono text-xs' : ''}`}>{value}</strong>
                </div>
              ))}
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Método</span>
                <span className="rounded-full bg-primary/10 px-3 py-0.5 text-xs font-bold text-primary capitalize">
                  {result.pago.metodo_pago}
                </span>
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-muted-foreground">Total pagado</span>
              <strong className="text-3xl font-black text-foreground">
                {formatCurrency(result.factura.total, result.factura.moneda)}
              </strong>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Button asChild className="rounded-xl bg-primary font-bold text-white shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all">
                <Link to={`/facturas/${result.factura.id}`}>
                  <FileText className="mr-2 size-4" />
                  Ver factura completa
                </Link>
              </Button>
              <Button variant="outline" asChild className="rounded-xl font-bold active:scale-95 transition-all">
                <Link to={`/mis-reservas/${reservation.id}`}>Volver a la reserva</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
    )
  }

  /* ── Non-pending state ── */
  if (reservation.estado !== 'pendiente') {
    return (
      <main className="mx-auto max-w-3xl px-4 py-12">
        <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
          <div className="p-12 text-center">
            <div className="mx-auto flex size-16 items-center justify-center rounded-3xl bg-emerald-50 dark:bg-emerald-950/30">
              <CheckCircle2 className="size-9 text-emerald-500" />
            </div>
            <h1 className="mt-5 text-2xl font-extrabold text-foreground">Esta reserva ya no está pendiente</h1>
            <p className="mt-3 text-muted-foreground">
              Estado actual:{' '}
              <span className="font-bold text-foreground capitalize">{reservation.estado}</span>
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {invoiceQuery.data && (
                <Button asChild className="rounded-xl bg-primary font-bold text-white hover:opacity-90 active:scale-95 transition-all">
                  <Link to={`/facturas/${invoiceQuery.data.id}`}>
                    <FileText className="mr-2 size-4" />
                    Ver factura
                  </Link>
                </Button>
              )}
              <Button variant="outline" asChild className="rounded-xl font-bold">
                <Link to={`/mis-reservas/${reservation.id}`}>Ver reserva</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
    )
  }

  /* ── Main payment form ── */
  return (
    <main className="mx-auto w-full max-w-3xl space-y-6 px-4 py-10 sm:px-6">
      {/* Back */}
      <Button variant="ghost" asChild className="rounded-xl font-bold hover:bg-muted transition-all">
        <Link to={`/mis-reservas/${reservation.id}`}>
          <ArrowLeft className="mr-2 size-4" />
          Volver a la reserva
        </Link>
      </Button>

      {/* Header */}
      <header className="relative overflow-hidden rounded-3xl border border-primary/20 bg-card p-7 shadow-sm">
        <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-primary via-[#ff4488] to-[#ff0055]" />
        <div className="pointer-events-none absolute -right-12 -top-12 size-44 rounded-full bg-primary/8 blur-3xl" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/40 bg-emerald-50 px-3.5 py-1.5 text-xs font-bold text-emerald-700 dark:border-emerald-800/40 dark:bg-emerald-950/30 dark:text-emerald-400">
            <ShieldCheck className="size-3.5" />
            Transacción protegida y segura
          </div>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-foreground">
            Pagar Reserva <span className="text-primary">{reservation.codigo}</span>
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Selecciona tu método de pago preferido. El monto es fijo y proviene del sistema.
          </p>
        </div>
      </header>

      {/* Amount card */}
      <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-card via-card to-primary/5 shadow-sm">
        <div className="pointer-events-none absolute -right-8 -top-8 size-36 rounded-full bg-primary/8 blur-2xl" />
        <div className="relative z-10 p-6">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Total a pagar</p>
          <p className="mt-2 text-5xl font-black tracking-tight text-foreground">
            {formatCurrency(reservation.total, reservation.moneda)}
          </p>
          <p className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
            <Lock className="size-3.5" />
            Monto bloqueado — no puede modificarse en el navegador
          </p>
        </div>
      </div>

      {/* Payment form */}
      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Method selectors */}
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <h2 className="flex items-center gap-2 text-base font-extrabold text-foreground">
            <CreditCard className="size-5 text-primary" />
            Método de pago
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">Elige cómo deseas realizar tu pago.</p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {/* Tarjeta button */}
            <button
              type="button"
              disabled={processPayment.isPending}
              onClick={() => setMethod('tarjeta')}
              className={`group rounded-2xl border-2 p-5 text-left transition-all duration-200 active:scale-[0.98] ${
                method === 'tarjeta'
                  ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10 dark:bg-primary/8'
                  : 'border-border hover:border-primary/30 dark:hover:border-zinc-700'
              }`}
            >
              <div className={`flex size-11 items-center justify-center rounded-xl transition-colors ${
                method === 'tarjeta' ? 'bg-primary/15' : 'bg-muted/60'
              }`}>
                <CreditCard className={`size-6 ${method === 'tarjeta' ? 'text-primary' : 'text-muted-foreground'}`} />
              </div>
              <p className="mt-3 font-extrabold text-foreground">Tarjeta de crédito/débito</p>
              <p className="mt-0.5 text-xs text-muted-foreground">Visa · Mastercard · Amex</p>
              {method === 'tarjeta' && (
                <BadgeCheck className="mt-2 size-4 text-primary" />
              )}
            </button>

            {/* Transferencia button */}
            <button
              type="button"
              disabled={processPayment.isPending}
              onClick={() => setMethod('transferencia')}
              className={`group rounded-2xl border-2 p-5 text-left transition-all duration-200 active:scale-[0.98] ${
                method === 'transferencia'
                  ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10 dark:bg-primary/8'
                  : 'border-border hover:border-primary/30 dark:hover:border-zinc-700'
              }`}
            >
              <div className={`flex size-11 items-center justify-center rounded-xl transition-colors ${
                method === 'transferencia' ? 'bg-primary/15' : 'bg-muted/60'
              }`}>
                <Building2 className={`size-6 ${method === 'transferencia' ? 'text-primary' : 'text-muted-foreground'}`} />
              </div>
              <p className="mt-3 font-extrabold text-foreground">Transferencia bancaria</p>
              <p className="mt-0.5 text-xs text-muted-foreground">Pichincha · Guayaquil</p>
              {method === 'transferencia' && (
                <BadgeCheck className="mt-2 size-4 text-primary" />
              )}
            </button>
          </div>

          {/* ── TARJETA: card visual + brand logos ── */}
          {method === 'tarjeta' && (
            <div className="mt-6 space-y-5 animate-in fade-in duration-300">
              <CreditCardVisual selected />

              <div className="rounded-2xl border border-border bg-muted/20 dark:bg-muted/10 p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Zap className="size-4 text-primary" />
                  <p className="text-xs font-bold text-foreground">Tarjetas aceptadas</p>
                </div>
                <div className="flex flex-wrap items-center gap-4 pt-1">
                  <div className="flex items-center gap-2 rounded-xl border border-border bg-white px-4 py-2 dark:bg-zinc-800">
                    <VisaLogo />
                  </div>
                  <div className="flex items-center gap-2 rounded-xl border border-border bg-white px-4 py-2 dark:bg-zinc-800">
                    <MastercardLogo />
                    <span className="text-xs font-bold text-foreground">Mastercard</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-xl border border-border bg-white px-4 py-2 dark:bg-zinc-800">
                    <AmexLogo />
                  </div>
                </div>
                <p className="pt-1 text-[10px] font-semibold text-muted-foreground">
                  Simulación académica — no se solicita ni almacena información real de tarjetas.
                </p>
              </div>
            </div>
          )}

          {/* ── TRANSFERENCIA: bank cards ── */}
          {method === 'transferencia' && (
            <div className="mt-6 space-y-4 animate-in fade-in duration-300">
              <p className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
                <Building2 className="size-3.5 text-primary" />
                Selecciona el banco de destino para la transferencia:
              </p>

              <div className="grid gap-3 sm:grid-cols-2">
                {BANKS.map((bank) => (
                  <BankCard
                    key={bank.name}
                    bank={bank}
                    selected={selectedBank === bank.name}
                    onClick={() => setSelectedBank(bank.name)}
                  />
                ))}
              </div>

              {/* Reference input */}
              <div className="space-y-2 pt-1">
                <Label htmlFor="reference"
                  className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  <Hash className="size-3.5 text-primary" />
                  Número de comprobante de transferencia
                </Label>
                <Input
                  id="reference"
                  maxLength={120}
                  value={reference}
                  disabled={processPayment.isPending}
                  onChange={(event) => setReference(event.target.value)}
                  required
                  className="h-12 rounded-xl border-2 border-border bg-background font-mono text-sm font-semibold focus:border-primary focus:ring-4 focus:ring-primary/15 dark:bg-input dark:border-border"
                  placeholder="Ej. TRF-20240101-001234"
                />
                <p className="text-[10px] font-semibold text-muted-foreground">
                  Ingresa el número de comprobante que recibiste al realizar la transferencia al banco seleccionado.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Acceptance checkbox */}
        <label className="flex cursor-pointer items-start gap-4 rounded-2xl border-2 border-border bg-card p-5 transition-all hover:border-primary/30 hover:bg-primary/3 dark:hover:bg-primary/5">
          <div className="relative mt-0.5">
            <input
              type="checkbox"
              checked={accepted}
              disabled={processPayment.isPending}
              onChange={(event) => setAccepted(event.target.checked)}
              className="peer size-5 rounded-md border-2 border-border accent-primary"
            />
          </div>
          <span className="text-sm font-semibold text-foreground">
            Confirmo que deseo procesar este pago de{' '}
            <strong className="font-black text-primary">
              {formatCurrency(reservation.total, reservation.moneda)}
            </strong>{' '}
            mediante{' '}
            <strong className="text-foreground">
              {method === 'tarjeta' ? 'tarjeta de crédito/débito' : `transferencia bancaria (${selectedBank})`}
            </strong>
            .
          </span>
        </label>

        {/* Security notice */}
        <div className="flex items-start gap-3 rounded-2xl border border-emerald-200/70 bg-emerald-50/60 p-4 dark:border-emerald-900/30 dark:bg-emerald-950/20">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <p className="text-xs font-semibold leading-relaxed text-emerald-800 dark:text-emerald-400">
            <strong>Entorno académico seguro.</strong> StayBooking no solicita, procesa ni almacena
            números de tarjeta real, CVV ni claves bancarias. Esta es una simulación controlada.
          </p>
        </div>

        {/* Error alert */}
        {errorMessage && (
          <Alert variant="destructive" className="rounded-2xl">
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        {/* Submit button */}
        <Button
          type="submit"
          disabled={processPayment.isPending || !accepted}
          className="group h-14 w-full rounded-2xl bg-primary text-base font-black text-primary-foreground shadow-xl shadow-primary/30 transition-all hover:scale-[1.01] hover:shadow-2xl hover:shadow-primary/40 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {processPayment.isPending ? (
            <span className="flex items-center gap-2">
              <Loader2 className="size-5 animate-spin" />
              Procesando pago...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              {method === 'tarjeta' ? (
                <CreditCard className="size-5" />
              ) : (
                <Building2 className="size-5" />
              )}
              Pagar {formatCurrency(reservation.total, reservation.moneda)}
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
            </span>
          )}
        </Button>
      </form>
    </main>
  )
}