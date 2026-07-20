import type { BookingCartSummary as BookingCartSummaryData } from '@/domain/entities/room-selection.entity'
import { Button } from '@/presentation/components/ui/button'

interface BookingCartSummaryProps {
  summary: BookingCartSummaryData
  onClear: () => void
  onContinue: () => void
  isChecking: boolean
}

export default function BookingCartSummary({
  summary,
  onClear,
  onContinue,
  isChecking,
}: BookingCartSummaryProps) {
  return (
    <aside className="rounded-2xl border bg-card p-5 shadow-sm">
      <h2 className="text-xl font-semibold">
        Resumen de la selección
      </h2>

      <dl className="mt-5 space-y-4">
        <div className="flex items-center justify-between text-sm">
          <dt className="text-muted-foreground">
            Habitaciones seleccionadas
          </dt>

          <dd className="font-semibold">
            {summary.totalRooms}
          </dd>
        </div>

        <div className="border-t pt-4">
          <div className="flex items-center justify-between">
            <dt className="font-medium text-muted-foreground">
              Referencia por noche
            </dt>

            <dd className="text-2xl font-bold">
              ${summary.subtotal.toFixed(2)}
            </dd>
          </div>

          <p className="mt-2 text-xs text-muted-foreground">
            Este valor es referencial. El total definitivo
            será calculado por el backend según fechas,
            huéspedes, temporadas e impuestos.
          </p>
        </div>
      </dl>

      <Button
        type="button"
        className="mt-6 w-full"
        onClick={onContinue}
        disabled={
          summary.totalRooms === 0
          || isChecking
        }
      >
        {isChecking
          ? 'Verificando disponibilidad...'
          : 'Comprobar disponibilidad'}
      </Button>

      <Button
        type="button"
        variant="outline"
        className="mt-3 w-full"
        onClick={onClear}
        disabled={
          summary.totalRooms === 0
          || isChecking
        }
      >
        Vaciar selección
      </Button>
    </aside>
  )
}