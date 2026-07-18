import type { RoomSelection } from '@/domain/entities/room-selection.entity'

interface SelectedRoomCardProps {
  selection: RoomSelection
  onRemove: (roomId: number) => void
  onQuantityChange: (roomId: number, quantity: number) => void
}

export default function SelectedRoomCard({
  selection,
  onRemove,
  onQuantityChange,
}: SelectedRoomCardProps) {
  const total = selection.pricePerNight * selection.quantity

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="grid gap-4 p-4 sm:grid-cols-[160px_1fr]">
        <div className="h-40 overflow-hidden rounded-xl bg-slate-100 sm:h-full">
          {selection.imageUrl ? (
            <img
              src={selection.imageUrl}
              alt={selection.roomTypeName}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full min-h-40 items-center justify-center px-4 text-center text-sm text-slate-500">
              Imagen no disponible
            </div>
          )}
        </div>

        <div className="flex flex-col justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-blue-600">
              Habitación {selection.roomNumber}
            </p>

            <h2 className="mt-1 text-xl font-semibold text-slate-900">
              {selection.roomTypeName}
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Precio por noche
            </p>

            <p className="text-lg font-semibold text-slate-900">
              ${selection.pricePerNight.toFixed(2)}
            </p>
          </div>

          <div className="flex flex-col gap-4 border-t border-slate-100 pt-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <label
                htmlFor={`quantity-${selection.roomId}`}
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Cantidad
              </label>

              <select
                id={`quantity-${selection.roomId}`}
                value={selection.quantity}
                onChange={(event) =>
                  onQuantityChange(
                    selection.roomId,
                    Number(event.target.value),
                  )
                }
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                {[1, 2, 3, 4, 5].map((quantity) => (
                  <option key={quantity} value={quantity}>
                    {quantity}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end justify-between gap-6 sm:justify-end">
              <div className="text-right">
                <p className="text-sm text-slate-500">
                  Total
                </p>

                <p className="text-xl font-bold text-slate-900">
                  ${total.toFixed(2)}
                </p>
              </div>

              <button
                type="button"
                onClick={() => onRemove(selection.roomId)}
                className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}