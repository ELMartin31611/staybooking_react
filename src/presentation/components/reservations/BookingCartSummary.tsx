import type { BookingCartSummary as BookingCartSummaryData } from '@/domain/entities/room-selection.entity'

interface BookingCartSummaryProps {
  summary: BookingCartSummaryData
  onClear: () => void
}

export default function BookingCartSummary({
  summary,
  onClear,
}: BookingCartSummaryProps) {
  return (
    <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-900">
        Resumen de la selección
      </h2>

      <div className="mt-5 space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600">
            Habitaciones seleccionadas
          </span>

          <span className="font-semibold text-slate-900">
            {summary.totalRooms}
          </span>
        </div>

        <div className="border-t border-slate-200 pt-4">
          <div className="flex items-center justify-between">
            <span className="text-base font-medium text-slate-700">
              Subtotal
            </span>

            <span className="text-2xl font-bold text-slate-900">
              ${summary.subtotal.toFixed(2)}
            </span>
          </div>

          <p className="mt-2 text-xs text-slate-500">
            El subtotal corresponde al precio por noche de las
            habitaciones seleccionadas.
          </p>
        </div>
      </div>

      <button
        type="button"
        disabled={summary.totalRooms === 0}
        className="mt-6 w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        Continuar con la reserva
      </button>

      <button
        type="button"
        onClick={onClear}
        disabled={summary.totalRooms === 0}
        className="mt-3 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-400"
      >
        Vaciar selección
      </button>
    </aside>
  )
}