interface LoaderProps {
  message?: string
  fullScreen?: boolean
}

export function Loader({
  message = 'Cargando...',
  fullScreen = false,
}: LoaderProps) {
  return (
    <div
      className={
        fullScreen
          ? 'flex min-h-screen flex-col items-center justify-center gap-3'
          : 'flex min-h-40 flex-col items-center justify-center gap-3'
      }
      role="status"
      aria-live="polite"
    >
      <div className="size-9 animate-spin rounded-full border-4 border-primary/25 border-t-primary" />

      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  )
}