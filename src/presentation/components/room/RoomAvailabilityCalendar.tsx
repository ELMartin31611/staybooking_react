import {
  addDays,
  eachDayOfInterval,
  format,
  parseISO,
} from 'date-fns'
import { es } from 'date-fns/locale'
import { CalendarDays, Loader2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import type { DateRange } from 'react-day-picker'

import type { RoomAvailabilityCalendar } from '@/domain/entities/room.entity'
import { availabilityUseCase } from '@/infrastructure/factories/availability.factory'
import { Button } from '@/presentation/components/ui/button'
import { Calendar } from '@/presentation/components/ui/calendar'

interface RoomAvailabilityCalendarProps {
  roomId: number
  hotelId: number
  onRangeSelected: (checkIn: string, checkOut: string) => void
}

function toDate(value: string): Date {
  return parseISO(`${value}T12:00:00`)
}

export default function RoomAvailabilityCalendar({
  roomId,
  hotelId,
  onRangeSelected,
}: RoomAvailabilityCalendarProps) {
  const today = useMemo(() => new Date(), [])
  const [calendar, setCalendar] = useState<RoomAvailabilityCalendar | null>(null)
  const [range, setRange] = useState<DateRange | undefined>()
  const [loadError, setLoadError] = useState<string | null>(null)
  const [selectionError, setSelectionError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    const from = format(today, 'yyyy-MM-dd')
    const to = format(addDays(today, 90), 'yyyy-MM-dd')

    void availabilityUseCase.getRoomCalendar(roomId, from, to)
      .then((data) => {
        if (active) setCalendar(data)
      })
      .catch(() => {
        if (active) setLoadError('No fue posible cargar el calendario de disponibilidad.')
      })

    return () => {
      active = false
    }
  }, [roomId, today])

  const unavailableDates = useMemo(
    () => calendar?.dias
      .filter((day) => day.estado !== 'disponible' || day.reservada)
      .map((day) => toDate(day.fecha)) ?? [],
    [calendar],
  )

  function handleSelect(nextRange: DateRange | undefined) {
    if (nextRange?.from && nextRange.to) {
      const unavailable = new Set(
        unavailableDates.map((date) => format(date, 'yyyy-MM-dd')),
      )
      const includesBlockedDay = eachDayOfInterval({
        start: nextRange.from,
        end: nextRange.to,
      }).some((date) => unavailable.has(format(date, 'yyyy-MM-dd')))

      if (includesBlockedDay) {
        setRange(undefined)
        setSelectionError('El rango incluye una noche no disponible. Elige otras fechas.')
        return
      }
    }

    setSelectionError(null)
    setRange(nextRange)
  }

  if (loadError) {
    return <p className="text-sm text-destructive">{loadError}</p>
  }

  if (!calendar) {
    return (
      <div className="flex min-h-72 items-center justify-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        Cargando calendario...
      </div>
    )
  }

  if (!calendar.habitacion.reservable) {
    return <p className="text-sm text-destructive">Esta habitación no está habilitada para reservas.</p>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3 rounded-xl bg-primary/5 p-3 text-sm">
        <CalendarDays className="mt-0.5 size-4 shrink-0 text-primary" />
        <p>Elige entrada y salida. Las fechas ocupadas o no reservables están bloqueadas.</p>
      </div>
      <Calendar
        mode="range"
        locale={es}
        numberOfMonths={1}
        selected={range}
        onSelect={handleSelect}
        disabled={[{ before: today }, ...unavailableDates]}
        excludeDisabled
        className="mx-auto rounded-xl border"
      />
      {selectionError && (
        <p className="text-sm text-destructive">{selectionError}</p>
      )}
      {range?.from && range.to && (
        <Button
          type="button"
          className="w-full"
          onClick={() => onRangeSelected(
            format(range.from!, 'yyyy-MM-dd'),
            format(range.to!, 'yyyy-MM-dd'),
          )}
        >
          Continuar con esta habitación
        </Button>
      )}
      <p className="text-xs text-muted-foreground">
        Hotel #{hotelId} · La disponibilidad se valida nuevamente antes de confirmar la reserva.
      </p>
    </div>
  )
}
