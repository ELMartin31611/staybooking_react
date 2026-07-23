import {
  CalendarDays,
  Loader2,
  Pencil,
  Trash2,
} from 'lucide-react'
import { useState } from 'react'

import type { Season } from '@/domain/entities/season.entity'
import { EmptyState } from '@/presentation/components/common/EmptyState'
import { Badge } from '@/presentation/components/ui/badge'
import { Button } from '@/presentation/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/presentation/components/ui/alert-dialog'
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

interface SeasonTableProps {
  seasons: Season[]
  isLoading: boolean
  deletingId: number | null
  onEdit: (season: Season) => void
  onDelete: (season: Season) => Promise<void>
}

function formatDate(
  value: string,
): string {
  const date = new Date(
    `${value}T00:00:00Z`,
  )

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat(
    'es-EC',
    {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      timeZone: 'UTC',
    },
  ).format(date)
}

function formatPercentage(
  value: string,
): string {
  const percentage = Number(value)

  if (!Number.isFinite(percentage)) {
    return value
  }

  return `${percentage.toFixed(2)}%`
}

function LoadingRows() {
  return Array.from(
    {
      length: 4,
    },
    (_, index) => (
      <TableRow key={index}>
        <TableCell>
          <Skeleton className="h-5 w-36" />
        </TableCell>

        <TableCell>
          <Skeleton className="h-5 w-28" />
        </TableCell>

        <TableCell>
          <Skeleton className="h-5 w-28" />
        </TableCell>

        <TableCell>
          <Skeleton className="h-5 w-16" />
        </TableCell>

        <TableCell>
          <Skeleton className="h-6 w-20 rounded-full" />
        </TableCell>

        <TableCell>
          <Skeleton className="h-8 w-24" />
        </TableCell>
      </TableRow>
    ),
  )
}

export default function SeasonTable({
  seasons,
  isLoading,
  deletingId,
  onEdit,
  onDelete,
}: SeasonTableProps) {
  const [seasonToDelete, setSeasonToDelete] =
    useState<Season | null>(null)

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle>
              Temporadas configuradas
            </CardTitle>

            <p className="mt-1 text-sm text-muted-foreground">
              {seasons.length}{' '}
              {seasons.length === 1
                ? 'temporada'
                : 'temporadas'}
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarDays className="size-4" />
            Fecha final exclusiva
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {!isLoading && seasons.length === 0 ? (
          <EmptyState
            title="No existen temporadas"
            description="Crea una temporada para comenzar a configurar tarifas."
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  Nombre
                </TableHead>

                <TableHead>
                  Inicio
                </TableHead>

                <TableHead>
                  Fin
                </TableHead>

                <TableHead>
                  Incremento
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
                seasons.map((season) => {
                  const isDeleting =
                    deletingId === season.id

                  return (
                    <TableRow key={season.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {season.nombre}
                          </p>

                          {season.descripcion && (
                            <p className="max-w-64 truncate text-xs text-muted-foreground">
                              {season.descripcion}
                            </p>
                          )}
                        </div>
                      </TableCell>

                      <TableCell>
                        {formatDate(
                          season.fecha_inicio,
                        )}
                      </TableCell>

                      <TableCell>
                        {formatDate(
                          season.fecha_fin,
                        )}
                      </TableCell>

                      <TableCell>
                        {formatPercentage(
                          season.porcentaje_incremento,
                        )}
                      </TableCell>

                      <TableCell>
                        <Badge
                          variant={
                            season.is_active
                              ? 'default'
                              : 'secondary'
                          }
                        >
                          {season.is_active
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
                              onEdit(season)
                            }
                            disabled={isDeleting}
                            aria-label={
                              `Editar ${season.nombre}`
                            }
                          >
                            <Pencil className="size-4" />
                          </Button>

                          <Button
                            type="button"
                            size="icon-sm"
                            variant="destructive"
                            onClick={() => setSeasonToDelete(season)}
                            disabled={isDeleting}
                            aria-label={
                              `Eliminar ${season.nombre}`
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
      <AlertDialog
        open={seasonToDelete !== null}
        onOpenChange={(open) => {
          if (!open) setSeasonToDelete(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar esta temporada?</AlertDialogTitle>
            <AlertDialogDescription>
              {seasonToDelete
                ? `“${seasonToDelete.nombre}” y sus tarifas relacionadas pueden dejar de estar disponibles.`
                : ''}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={
                !seasonToDelete
                || deletingId === seasonToDelete.id
              }
              onClick={() => {
                if (seasonToDelete) {
                  void onDelete(seasonToDelete)
                }
              }}
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}