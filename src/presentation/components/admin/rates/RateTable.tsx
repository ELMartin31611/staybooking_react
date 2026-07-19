import {
  Loader2,
  Pencil,
  Trash2,
} from 'lucide-react'

import type { RateReference } from '@/domain/entities/rate-reference.entity'
import { EmptyState } from '@/presentation/components/common/EmptyState'
import { Badge } from '@/presentation/components/ui/badge'
import { Button } from '@/presentation/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/presentation/components/ui/card'
import { Skeleton } from '@/presentation/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/presentation/components/ui/table'

interface RateTableProps {
  rates: RateReference[]
  isLoading: boolean
  deletingId: number | null
  onEdit: (rate: RateReference) => void
  onDelete: (
    rate: RateReference,
  ) => Promise<void>
}

function formatPrice(
  value: string | null,
  currency: string,
): string {
  if (
    value === null
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

function LoadingRows() {
  return Array.from(
    {
      length: 4,
    },
    (_, index) => (
      <TableRow key={index}>
        <TableCell>
          <Skeleton className="h-5 w-32" />
        </TableCell>

        <TableCell>
          <Skeleton className="h-5 w-28" />
        </TableCell>

        <TableCell>
          <Skeleton className="h-5 w-24" />
        </TableCell>

        <TableCell>
          <Skeleton className="h-5 w-24" />
        </TableCell>

        <TableCell>
          <Skeleton className="h-5 w-24" />
        </TableCell>

        <TableCell>
          <Skeleton className="h-6 w-16 rounded-full" />
        </TableCell>

        <TableCell>
          <Skeleton className="h-8 w-24" />
        </TableCell>
      </TableRow>
    ),
  )
}

export default function RateTable({
  rates,
  isLoading,
  deletingId,
  onEdit,
  onDelete,
}: RateTableProps) {
  async function handleDelete(
    rate: RateReference,
  ) {
    const confirmed = window.confirm(
      [
        '¿Eliminar esta tarifa?',
        '',
        `${rate.tipo_habitacion_nombre}`,
        `${rate.temporada_nombre}`,
      ].join('\n'),
    )

    if (!confirmed) {
      return
    }

    await onDelete(rate)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle>
              Tarifas configuradas
            </CardTitle>

            <p className="mt-1 text-sm text-muted-foreground">
              {rates.length}{' '}
              {rates.length === 1
                ? 'tarifa'
                : 'tarifas'}
            </p>
          </div>

          <Badge variant="outline">
            Precios por noche
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        {!isLoading && rates.length === 0 ? (
          <EmptyState
            title="No existen tarifas"
            description="Crea una tarifa para asignar precios a los tipos de habitación."
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  Tipo de habitación
                </TableHead>

                <TableHead>
                  Temporada
                </TableHead>

                <TableHead>
                  Regular
                </TableHead>

                <TableHead>
                  Fin de semana
                </TableHead>

                <TableHead>
                  Persona extra
                </TableHead>

                <TableHead>
                  Estado
                </TableHead>

                <TableHead className="text-right">
                  Acciones
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                <LoadingRows />
              ) : (
                rates.map((rate) => {
                  const isDeleting =
                    deletingId === rate.id

                  return (
                    <TableRow key={rate.id}>
                      <TableCell>
                        <p className="font-medium">
                          {rate.tipo_habitacion_nombre}
                        </p>

                        <p className="text-xs text-muted-foreground">
                          ID {rate.tipo_habitacion}
                        </p>
                      </TableCell>

                      <TableCell>
                        <p>
                          {rate.temporada_nombre}
                        </p>

                        <p className="text-xs text-muted-foreground">
                          {rate.temporada_fecha_inicio}
                          {' → '}
                          {rate.temporada_fecha_fin}
                        </p>
                      </TableCell>

                      <TableCell className="font-medium">
                        {formatPrice(
                          rate.precio_noche,
                          rate.moneda,
                        )}
                      </TableCell>

                      <TableCell>
                        {formatPrice(
                          rate.precio_fin_semana,
                          rate.moneda,
                        )}
                      </TableCell>

                      <TableCell>
                        {formatPrice(
                          rate.precio_persona_extra,
                          rate.moneda,
                        )}
                      </TableCell>

                      <TableCell>
                        <Badge
                          variant={
                            rate.is_active
                              ? 'default'
                              : 'secondary'
                          }
                        >
                          {rate.is_active
                            ? 'Activa'
                            : 'Inactiva'}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Button
                            type="button"
                            size="icon-sm"
                            variant="outline"
                            onClick={() =>
                              onEdit(rate)
                            }
                            disabled={isDeleting}
                            aria-label={
                              `Editar tarifa ${rate.id}`
                            }
                          >
                            <Pencil className="size-4" />
                          </Button>

                          <Button
                            type="button"
                            size="icon-sm"
                            variant="destructive"
                            onClick={() => {
                              void handleDelete(
                                rate,
                              )
                            }}
                            disabled={isDeleting}
                            aria-label={
                              `Eliminar tarifa ${rate.id}`
                            }
                          >
                            {isDeleting ? (
                              <Loader2 className="size-4 animate-spin" />
                            ) : (
                              <Trash2 className="size-4" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}