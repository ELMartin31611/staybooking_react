import {
  CheckCircle2,
  LockKeyhole,
  Server,
} from 'lucide-react'

import { ApiException } from '@/domain/exceptions/api.exception'
import { useBackendConnectionQuery } from '@/presentation/hooks/useBackendConnectionQuery'

import { ErrorState } from './ErrorState'
import { Loader } from './Loader'

export function BackendConnectionStatus() {
  const {
    data,
    error,
    isPending,
    refetch,
  } = useBackendConnectionQuery()

  if (isPending) {
    return (
      <Loader message="Comprobando conexión con Django..." />
    )
  }

  if (error) {
    const isProtectedEndpoint =
      error instanceof ApiException &&
      (error.status === 401 || error.status === 403)

    if (isProtectedEndpoint) {
      return (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
          <div className="flex items-start gap-4">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
              <LockKeyhole className="size-5" />
            </div>

            <div>
              <h2 className="font-semibold text-amber-950">
                Backend disponible
              </h2>

              <p className="mt-1 text-sm text-amber-800">
                Django respondió correctamente, pero el listado de hoteles
                todavía requiere autenticación. La lectura pública debe
                habilitarse en el backend.
              </p>
            </div>
          </div>
        </div>
      )
    }

    return (
      <ErrorState
        title="No se pudo conectar con el backend"
        message={error.message}
        onRetry={() => {
          void refetch()
        }}
      />
    )
  }

  return (
    <div className="rounded-2xl border border-green-200 bg-green-50 p-6">
      <div className="flex items-start gap-4">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-700">
          <CheckCircle2 className="size-5" />
        </div>

        <div>
          <h2 className="font-semibold text-green-950">
            Conexión exitosa
          </h2>

          <p className="mt-1 text-sm text-green-800">
            React se conectó con Django mediante GET /hoteles/.
            La API reportó {data.count} hotel(es).
          </p>

          <p className="mt-2 flex items-center gap-2 text-xs text-green-700">
            <Server className="size-3.5" />
            StayBooking API en línea
          </p>
        </div>
      </div>
    </div>
  )
}