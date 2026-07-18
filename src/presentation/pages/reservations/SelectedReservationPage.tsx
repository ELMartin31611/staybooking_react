import { useMemo, useState } from 'react'
import { CalendarDays, CheckCircle2, Hotel, Users } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'

import { Button } from '@/presentation/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card'
import { Input } from '@/presentation/components/ui/input'
import { Label } from '@/presentation/components/ui/label'

import {
  reservationsStorage,
  type ReservationRecord,
} from './reservations.storage'

type RoomOption = 'Estandar' | 'Deluxe' | 'Suite Junior'

const roomMultiplier: Record<RoomOption, number> = {
  Estandar: 1,
  Deluxe: 1.35,
  'Suite Junior': 1.7,
}

function buildReservationId(): string {
  return `RSV-${Math.floor(1000 + Math.random() * 9000)}`
}

export default function SelectedReservationPage() {
  const [params] = useSearchParams()
  const hotelId = Number(params.get('hotel') ?? '1')

  const [hotelName, setHotelName] = useState(`Hotel #${hotelId}`)
  const [city, setCity] = useState('Cartagena')
  const [checkIn, setCheckIn] = useState('')
  const [nights, setNights] = useState(2)
  const [guests, setGuests] = useState(2)
  const [roomType, setRoomType] = useState<RoomOption>('Deluxe')
  const [promo, setPromo] = useState('')
  const [savedReservation, setSavedReservation] =
    useState<ReservationRecord | null>(null)

  const baseNightRate = useMemo(() => {
    return 95 + (hotelId % 5) * 15
  }, [hotelId])

  const subtotal = useMemo(() => {
    const roomRate = baseNightRate * roomMultiplier[roomType]
    return roomRate * Math.max(1, nights)
  }, [baseNightRate, nights, roomType])

  const guestsFee = guests > 2 ? (guests - 2) * 20 : 0
  const promoDiscount = promo.trim().toUpperCase() === 'STAY10' ? 0.1 : 0
  const discountAmount = (subtotal + guestsFee) * promoDiscount
  const total = Math.max(0, subtotal + guestsFee - discountAmount)

  function handleConfirmReservation() {
    if (!checkIn) {
      return
    }

    const checkInDate = new Date(checkIn)
    const checkOutDate = new Date(checkInDate)
    checkOutDate.setDate(checkOutDate.getDate() + nights)

    const reservation: ReservationRecord = {
      id: buildReservationId(),
      hotelId,
      hotelName,
      city,
      roomType,
      checkIn,
      checkOut: checkOutDate.toISOString().slice(0, 10),
      nights,
      guests,
      totalUsd: Number(total.toFixed(2)),
      status: 'CONFIRMADA',
      createdAt: new Date().toISOString(),
    }

    reservationsStorage.add(reservation)
    setSavedReservation(reservation)
  }

  return (
    <section className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <div className="rounded-3xl bg-gradient-to-br from-primary via-[#e31c5f] to-[#a30d43] p-8 text-white">
        <p className="text-sm font-medium text-white/80">Reserva inteligente</p>
        <h1 className="mt-2 text-3xl font-bold">Confirmar tu reserva</h1>
        <p className="mt-3 text-white/85">
          Ajusta fechas, tipo de habitación y huéspedes para ver el total en tiempo real.
        </p>
      </div>

      {savedReservation && (
        <Card className="border-emerald-200 bg-emerald-50">
          <CardContent className="flex items-start gap-3 pt-6 text-emerald-900">
            <CheckCircle2 className="mt-0.5 size-5" />
            <div>
              <p className="font-semibold">Reserva creada correctamente</p>
              <p className="text-sm">
                Código {savedReservation.id}. Ya puedes verla en{' '}
                <Link to="/mis-reservas" className="font-semibold underline">
                  Mis reservas
                </Link>
                .
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Datos de la estancia</CardTitle>
          </CardHeader>

          <CardContent className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="hotel-name">Hotel</Label>
                <Input
                  id="hotel-name"
                  value={hotelName}
                  onChange={(event) => setHotelName(event.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">Ciudad</Label>
                <Input
                  id="city"
                  value={city}
                  onChange={(event) => setCity(event.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="checkin">Check-in</Label>
                <Input
                  id="checkin"
                  type="date"
                  value={checkIn}
                  onChange={(event) => setCheckIn(event.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nights">Noches</Label>
                <Input
                  id="nights"
                  type="number"
                  min={1}
                  max={30}
                  value={nights}
                  onChange={(event) => setNights(Number(event.target.value) || 1)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="guests">Huéspedes</Label>
                <Input
                  id="guests"
                  type="number"
                  min={1}
                  max={8}
                  value={guests}
                  onChange={(event) => setGuests(Number(event.target.value) || 1)}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="room-type">Tipo de habitación</Label>
                <select
                  id="room-type"
                  value={roomType}
                  onChange={(event) => setRoomType(event.target.value as RoomOption)}
                  className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
                >
                  <option value="Estandar">Estandar</option>
                  <option value="Deluxe">Deluxe</option>
                  <option value="Suite Junior">Suite Junior</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="promo">Cupón</Label>
                <Input
                  id="promo"
                  value={promo}
                  onChange={(event) => setPromo(event.target.value)}
                  placeholder="Ejemplo: STAY10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resumen dinámico</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="rounded-xl bg-muted p-4 text-sm">
              <p className="flex items-center gap-2 font-medium">
                <Hotel className="size-4" /> {hotelName}
              </p>
              <p className="mt-2 flex items-center gap-2 text-muted-foreground">
                <CalendarDays className="size-4" /> {Math.max(1, nights)} noches
              </p>
              <p className="mt-1 flex items-center gap-2 text-muted-foreground">
                <Users className="size-4" /> {Math.max(1, guests)} huéspedes
              </p>
            </div>

            <div className="space-y-2 text-sm">
              <p className="flex justify-between"><span>Tarifa base</span><b>${subtotal.toFixed(2)}</b></p>
              <p className="flex justify-between"><span>Extra huéspedes</span><b>${guestsFee.toFixed(2)}</b></p>
              <p className="flex justify-between"><span>Descuento</span><b>-${discountAmount.toFixed(2)}</b></p>
              <div className="my-2 border-t" />
              <p className="flex justify-between text-base"><span>Total</span><b>${total.toFixed(2)}</b></p>
            </div>

            <Button className="w-full" onClick={handleConfirmReservation} disabled={!checkIn}>
              Confirmar reserva
            </Button>

            <Button className="w-full" variant="outline" asChild>
              <Link to="/mis-reservas">Ver mis reservas</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
