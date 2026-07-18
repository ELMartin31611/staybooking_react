import { Link } from 'react-router-dom'

import BookingCartSummary from '@/presentation/components/reservations/BookingCartSummary'
import SelectedRoomCard from '@/presentation/components/reservations/SelectedRoomCard'
import { useBookingCartStore } from '@/presentation/store/booking-cart.store'

export default function SelectedRoomsPage() {
  const selections = useBookingCartStore(
    (state) => state.selections,
  )

  const summary = useBookingCartStore(
    (state) => state.summary,
  )

  const removeSelection = useBookingCartStore(
    (state) => state.removeSelection,
  )

  const updateQuantity = useBookingCartStore(
    (state) => state.updateQuantity,
  )

  const clearCart = useBookingCartStore(
    (state) => state.clearCart,
  )

  const hasSelections = selections.length > 0

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            StayBooking
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Habitaciones seleccionadas
          </h1>

          <p className="mt-2 max-w-2xl text-slate-600">
            Revisa las habitaciones agregadas antes de continuar
            con el proceso de reserva.
          </p>
        </div>

        {!hasSelections ? (
          <section className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-900">
              Tu selección está vacía
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-slate-600">
              Todavía no has agregado habitaciones. Regresa al
              catálogo y elige una habitación disponible.
            </p>

            <Link
              to="/hoteles"
              className="mt-6 inline-flex rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Explorar hoteles
            </Link>
          </section>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
            <section className="space-y-5">
              {selections.map((selection) => (
                <SelectedRoomCard
                  key={selection.roomId}
                  selection={selection}
                  onRemove={removeSelection}
                  onQuantityChange={updateQuantity}
                />
              ))}
            </section>

            <div className="lg:sticky lg:top-6 lg:self-start">
              <BookingCartSummary
                summary={summary}
                onClear={clearCart}
              />
            </div>
          </div>
        )}
      </section>
    </main>
  )
}