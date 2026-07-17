import { CircleAlert } from 'lucide-react'

import { Button } from '@/presentation/components/ui/button'

interface ErrorStateProps {
  title?: string
  message?: string
  onRetry?: () => void
}

export function ErrorState({
  title = 'No pudimos cargar la información',
  message = 'Inténtalo nuevamente en unos momentos.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div
      className="flex min-h-56 flex-col items-center justify-center rounded-2xl border border-destructive/20 bg-card p-8 text-center"
      role="alert"
    >
      <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <CircleAlert className="size-6" />
      </div>

      <h2 className="text-lg font-semibold">{title}</h2>

      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        {message}
      </p>

      {onRetry && (
        <Button className="mt-5" onClick={onRetry}>
          Volver a intentar
        </Button>
      )}
    </div>
  )
}