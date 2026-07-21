import type { ReactNode } from 'react'
import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Trash2,
} from 'lucide-react'

import {
  Alert,
  AlertDescription,
} from '@/presentation/components/ui/alert'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/presentation/components/ui/alert-dialog'
import { Badge } from '@/presentation/components/ui/badge'
import { Button } from '@/presentation/components/ui/button'

export function getAdminErrorMessage(
  error: unknown,
  fallback =
    'No fue posible completar la operación.',
): string {
  return (
    error instanceof Error
    && error.message
  )
    ? error.message
    : fallback
}

export function formatAdminCurrency(
  value: string | number,
  currency = 'USD',
): string {
  const amount = Number(value)

  if (!Number.isFinite(amount)) {
    return `${value} ${currency}`
  }

  return new Intl.NumberFormat(
    'es-EC',
    {
      style: 'currency',
      currency,
    },
  ).format(amount)
}

export function formatAdminDate(
  value: string | null,
): string {
  if (!value) {
    return '—'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat(
    'es-EC',
    {
      dateStyle: 'medium',
      timeStyle: value.includes('T')
        ? 'short'
        : undefined,
    },
  ).format(date)
}

export function StatusBadge({
  value,
}: {
  value: string
}) {
  const normalized =
    value.toLowerCase()

  const variant = [
    'activo',
    'activa',
    'disponible',
    'confirmada',
    'aprobado',
    'pagada',
  ].includes(normalized)
    ? 'default'
    : [
        'pendiente',
        'mantenimiento',
        'emitida',
      ].includes(normalized)
      ? 'secondary'
      : 'outline'

  return (
    <Badge
      variant={variant}
      className="capitalize"
    >
      {value.replaceAll('_', ' ')}
    </Badge>
  )
}

interface AdminPageHeaderProps {
  title: string
  description: string
  action?: ReactNode
}

export function AdminPageHeader({
  title,
  description,
  action,
}: AdminPageHeaderProps) {
  return (
    <header className="flex flex-col gap-4 rounded-2xl border bg-background p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {title}
        </h1>

        <p className="mt-2 text-muted-foreground">
          {description}
        </p>
      </div>

      {action}
    </header>
  )
}

export function AdminFeedback({
  error,
  success,
}: {
  error?: string
  success?: string
}) {
  if (!error && !success) {
    return null
  }

  return (
    <Alert
      variant={
        error
          ? 'destructive'
          : 'default'
      }
    >
      {error && (
        <AlertTriangle className="size-4" />
      )}

      <AlertDescription>
        {error || success}
      </AlertDescription>
    </Alert>
  )
}

export function AdminRefreshButton({
  loading,
  onClick,
}: {
  loading: boolean
  onClick: () => void
}) {
  return (
    <Button
      variant="outline"
      onClick={onClick}
      disabled={loading}
    >
      <RefreshCw
        className={
          loading
            ? 'size-4 animate-spin'
            : 'size-4'
        }
      />

      Actualizar
    </Button>
  )
}

export function AdminPagination({
  page,
  count,
  pageSize = 10,
  onChange,
}: {
  page: number
  count: number
  pageSize?: number
  onChange: (page: number) => void
}) {
  const totalPages = Math.max(
    1,
    Math.ceil(count / pageSize),
  )

  return (
    <div className="flex items-center justify-between gap-3 border-t px-4 py-3 text-sm">
      <span className="text-muted-foreground">
        Página {page} de {totalPages}
        {' · '}
        {count} registro(s)
      </span>

      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={page <= 1}
          onClick={() =>
            onChange(page - 1)
          }
        >
          <ChevronLeft className="size-4" />
          Anterior
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={page >= totalPages}
          onClick={() =>
            onChange(page + 1)
          }
        >
          Siguiente
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  )
}

export function DeleteConfirmation({
  label,
  description,
  loading,
  onConfirm,
}: {
  label: string
  description: string
  loading?: boolean
  onConfirm: () => void
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          title={label}
        >
          <Trash2 className="size-4 text-destructive" />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {label}
          </AlertDialogTitle>

          <AlertDialogDescription>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>
            Cancelar
          </AlertDialogCancel>

          <AlertDialogAction
            variant="destructive"
            disabled={loading}
            onClick={onConfirm}
          >
            {loading
              ? 'Eliminando...'
              : 'Eliminar'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}