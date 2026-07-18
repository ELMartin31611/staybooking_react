import type { RateReference } from '@/domain/entities/rate-reference.entity'
import { Badge } from '@/presentation/components/ui/badge'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/presentation/components/ui/card'
import { Separator } from '@/presentation/components/ui/separator'

interface ReferencePriceProps {
  roomTypeId: number
  rates: RateReference[]
}

function formatPrice(
  value: string,
  currency: string,
): string {
  const amount = Number(value)

  if (Number.isNaN(amount)) {
    return `${value} ${currency}`
  }

  return new Intl.NumberFormat('es-EC', {
    style: 'currency',
    currency,
  }).format(amount)
}

export default function ReferencePrice({
  roomTypeId,
  rates,
}: ReferencePriceProps) {
  const rate = rates.find(
    (item) =>
      item.tipo_habitacion === roomTypeId &&
      item.is_active,
  )

  if (!rate) {
    return (
      <Card>
        <CardContent className="p-5">
          <p className="text-sm text-muted-foreground">
            No existe una tarifa activa para este tipo de
            habitación.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-lg">
            Tarifa referencial
          </CardTitle>

          <Badge variant="secondary">
            {rate.temporada_nombre}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div>
          <p className="text-sm text-muted-foreground">
            Precio por noche
          </p>

          <p className="text-2xl font-bold">
            {formatPrice(
              rate.precio_noche,
              rate.moneda,
            )}
          </p>
        </div>

        <Separator />

        <div className="grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <p className="text-muted-foreground">
              Fin de semana
            </p>
            <p className="font-medium">
              {formatPrice(
                rate.precio_fin_semana,
                rate.moneda,
              )}
            </p>
          </div>

          <div>
            <p className="text-muted-foreground">
              Persona extra
            </p>
            <p className="font-medium">
              {formatPrice(
                rate.precio_persona_extra,
                rate.moneda,
              )}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}