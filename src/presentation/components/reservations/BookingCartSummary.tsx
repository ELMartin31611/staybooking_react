import {
  ArrowRight,
  BedDouble,
  Users,
} from 'lucide-react'

import type {
  BookingCartSummary as Summary,
  BookingServiceSelection,
} from '@/domain/entities/room-selection.entity'
import { Button } from '@/presentation/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/presentation/components/ui/card'
import { Separator } from '@/presentation/components/ui/separator'

interface Props {
  summary: Summary
  currency: string
  hasMissingRates: boolean
  services?: BookingServiceSelection[]
  disabled?: boolean
  onContinue: () => void
}

function money(
  value: number,
  currency: string,
): string {
  return new Intl.NumberFormat(
    'es-EC',
    {
      style: 'currency',
      currency,
    },
  ).format(value)
}

export default function BookingCartSummary({
  summary,
  currency,
  hasMissingRates,
  services = [],
  disabled = false,
  onContinue,
}: Props) {
  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle>
          Resumen de la selección
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="flex justify-between text-sm">
          <span className="inline-flex items-center gap-2 text-muted-foreground">
            <BedDouble className="size-4" />
            Habitaciones
          </span>

          <strong>{summary.totalRooms}</strong>
        </p>

        <p className="flex justify-between text-sm">
          <span className="inline-flex items-center gap-2 text-muted-foreground">
            <Users className="size-4" />
            Adultos
          </span>

          <strong>{summary.totalAdults}</strong>
        </p>

        <p className="flex justify-between text-sm">
          <span className="text-muted-foreground">
            Niños
          </span>

          <strong>{summary.totalChildren}</strong>
        </p>

        <p className="flex justify-between text-sm">
          <span className="text-muted-foreground">
            Huéspedes extra
          </span>

          <strong>
            {summary.totalExtraGuests}
          </strong>
        </p>

        <Separator />

        <div className="flex items-end justify-between gap-3">
          <span className="text-sm text-muted-foreground">
            Referencia por noche
          </span>

          <strong className="text-2xl">
            {money(
              summary.referencePricePerNight,
              currency,
            )}
          </strong>
        </div>

        <p className="text-xs text-muted-foreground">
          El precio se cobra una vez por habitación.
          Únicamente los huéspedes que superen la
          capacidad incluida generan un recargo del 50%.
        </p>

        {summary.referenceServicesSubtotal > 0 && (
          <div className="space-y-2 rounded-xl bg-primary/5 p-3">
            <div className="flex justify-between text-sm">
              <span className="font-medium text-foreground">
                Servicios extra estimados
              </span>
              <strong>
                {money(summary.referenceServicesSubtotal, currency)}
              </strong>
            </div>
            {services.map((service) => (
              <p
                key={service.serviceId}
                className="flex justify-between gap-3 text-xs text-muted-foreground"
              >
                <span>{service.name} × {service.quantity}</span>
                <span>
                  {money(
                    service.unitPrice * service.quantity,
                    service.currency,
                  )}
                </span>
              </p>
            ))}
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          Los servicios y el total definitivo se validan al crear la reserva.
        </p>

        {hasMissingRates && (
          <p className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
            Una habitación no tiene una tarifa válida.
          </p>
        )}

        <Button
          type="button"
          className="w-full"
          disabled={
            disabled
            || summary.totalRooms === 0
            || hasMissingRates
          }
          onClick={onContinue}
        >
          Continuar con huéspedes
          <ArrowRight className="size-4" />
        </Button>
      </CardContent>
    </Card>
  )
}