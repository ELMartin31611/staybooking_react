import {
  BedDouble,
  CalendarClock,
  CalendarDays,
  CheckCircle2,
  Hotel,
  ReceiptText,
  Tags,
} from 'lucide-react'
import { Link } from 'react-router-dom'

import {
  AdminPageHeader,
  AdminRefreshButton,
  formatAdminCurrency,
  formatAdminDate,
  StatusBadge,
} from '@/presentation/components/admin/AdminUi'
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
import {
  useAdminDashboardQuery,
} from '@/presentation/hooks/useAdmin'

export default function AdminDashboardPage() {
  const query =
    useAdminDashboardQuery()

  const data = query.data

  const cards = [
    {
      label: 'Hoteles',
      value: data?.hotels,
      icon: Hotel,
      to: '/admin/hoteles',
    },
    {
      label: 'Tipos',
      value: data?.roomTypes,
      icon: Tags,
      to: '/admin/tipos-habitacion',
    },
    {
      label: 'Habitaciones',
      value: data?.rooms,
      icon: BedDouble,
      to: '/admin/habitaciones',
    },
    {
      label: 'Reservas',
      value: data?.reservations,
      icon: CalendarDays,
      to: '/admin/reservas',
    },
    {
      label: 'Pendientes',
      value:
        data?.pendingReservations,
      icon: CalendarClock,
      to: '/admin/reservas?estado=pendiente',
    },
    {
      label: 'Pagos aprobados',
      value: data?.approvedPayments,
      icon: CheckCircle2,
      to: '/admin/cobros',
    },
    {
      label: 'Facturas',
      value: data?.invoices,
      icon: ReceiptText,
      to: '/admin/cobros',
    },
  ]

  return (
    <section className="space-y-6">
      <AdminPageHeader
        title="Resumen administrativo"
        description="Indicadores reales obtenidos desde la API de StayBooking."
        action={
          <AdminRefreshButton
            loading={query.isFetching}
            onClick={() =>
              void query.refetch()
            }
          />
        }
      />

      {query.isError && (
        <Card className="border-destructive">
          <CardContent className="p-5 text-sm text-destructive">
            No fue posible cargar el
            resumen administrativo.
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon

          return (
            <Link
              key={card.label}
              to={card.to}
            >
              <Card className="h-full transition hover:-translate-y-0.5 hover:shadow-md">
                <CardContent className="flex items-center justify-between p-5">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {card.label}
                    </p>

                    {query.isLoading
                      ? (
                        <Skeleton className="mt-2 h-8 w-16" />
                      )
                      : (
                        <p className="mt-1 text-3xl font-bold">
                          {card.value ?? 0}
                        </p>
                      )}
                  </div>

                  <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                    <Icon className="size-6" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>
            Reservas recientes
          </CardTitle>

          <Button
            variant="outline"
            size="sm"
            asChild
          >
            <Link to="/admin/reservas">
              Ver historial
            </Link>
          </Button>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  Código
                </TableHead>

                <TableHead>
                  Cliente
                </TableHead>

                <TableHead>
                  Entrada
                </TableHead>

                <TableHead>
                  Estado
                </TableHead>

                <TableHead className="text-right">
                  Total
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {data?.recentReservations.map(
                (reservation) => (
                  <TableRow
                    key={reservation.id}
                  >
                    <TableCell className="font-medium">
                      {reservation.codigo}
                    </TableCell>

                    <TableCell>
                      {
                        reservation
                          .cliente_nombre
                      }
                    </TableCell>

                    <TableCell>
                      {formatAdminDate(
                        reservation
                          .fecha_entrada,
                      )}
                    </TableCell>

                    <TableCell>
                      <StatusBadge
                        value={
                          reservation
                            .estado
                        }
                      />
                    </TableCell>

                    <TableCell className="text-right font-medium">
                      {formatAdminCurrency(
                        reservation.total,
                        reservation.moneda,
                      )}
                    </TableCell>
                  </TableRow>
                ),
              )}

              {!query.isLoading
                && data?.recentReservations
                  .length === 0
                && (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-24 text-center text-muted-foreground"
                    >
                      Todavía no existen
                      reservas.
                    </TableCell>
                  </TableRow>
                )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </section>
  )
}