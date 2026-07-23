import type { RateReference } from '@/domain/entities/rate-reference.entity'


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
  value: string | null | undefined,
  currency: string,
): string {
  if (
    value === null
    || value === undefined
    || value.trim() === ''
  ) {
    return 'No configurado'
  }

  const amount = Number(value)

  if (!Number.isFinite(amount)) {
    return `${value} ${currency}`.trim()
  }

  try {
    return new Intl.NumberFormat(
      'es-EC',
      {
        style: 'currency',
        currency,
      },
    ).format(amount)
  } catch {
    return `${amount.toFixed(2)} ${currency}`.trim()
  }
}

export default function ReferencePrice({
  roomTypeId,
  rates,
}: ReferencePriceProps) {
  const rate = rates.find(
    (item) =>
      item.tipo_habitacion === roomTypeId
      && item.is_active,
  )

  if (!rate) {
    return (
      <Card className="rounded-3xl border border-slate-200/60 bg-card p-6 shadow-sm dark:border-zinc-800/60">
        <CardContent className="p-0">
          <p className="text-sm font-semibold text-muted-foreground text-center">
            No existe una tarifa activa para este tipo de habitación.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="rounded-3xl border border-slate-200/60 bg-card shadow-sm dark:border-zinc-800/60 overflow-hidden">
      <CardHeader className="p-6 pb-3">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-base font-bold tracking-tight text-foreground">
            Tarifa referencial
          </CardTitle>

          <span className="rounded-full bg-primary/10 px-3 py-0.5 text-[11px] font-bold text-primary uppercase tracking-wider">
            {rate.temporada_nombre}
          </span>
        </div>
      </CardHeader>

      <CardContent className="p-6 pt-0 space-y-4">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Precio por noche
          </p>

          <p className="text-3xl font-extrabold bg-gradient-to-r from-primary to-[#d70466] bg-clip-text text-transparent mt-1">
            {formatPrice(
              rate.precio_noche,
              rate.moneda,
            )}
          </p>
        </div>

        <p className="text-[11px] font-semibold text-muted-foreground">
          Vigente desde <span className="font-bold text-slate-700 dark:text-zinc-300">{rate.temporada_fecha_inicio}</span> hasta <span className="font-bold text-slate-700 dark:text-zinc-300">{rate.temporada_fecha_fin}</span> (fin exclusivo)
        </p>

        <Separator className="border-slate-100 dark:border-zinc-800" />

        <div className="grid gap-4 text-sm grid-cols-2">
          <div className="rounded-2xl bg-slate-50/50 p-3.5 border border-slate-100/50 dark:bg-zinc-950/40 dark:border-zinc-800/60">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Fin de semana
            </p>

            <p className="font-bold text-foreground mt-1.5 text-base">
              {formatPrice(
                rate.precio_fin_semana,
                rate.moneda,
              )}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50/50 p-3.5 border border-slate-100/50 dark:bg-zinc-950/40 dark:border-zinc-800/60">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Persona extra
            </p>

            <p className="font-bold text-foreground mt-1.5 text-base">
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

