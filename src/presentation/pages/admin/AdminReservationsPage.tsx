import { useState } from 'react'
import {
  CircleX,
  Eye,
  Search,
  Users,
} from 'lucide-react'
import {
  useSearchParams,
} from 'react-router-dom'

import {
  AdminPageHeader,
  AdminPagination,
  formatAdminCurrency,
  formatAdminDate,
  getAdminErrorMessage,
  StatusBadge,
} from '@/presentation/components/admin/AdminUi'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/presentation/components/ui/alert-dialog'
import { Button } from '@/presentation/components/ui/button'
import {
  Card,
  CardContent,
} from '@/presentation/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/presentation/components/ui/dialog'
import { Input } from '@/presentation/components/ui/input'
import { Separator } from '@/presentation/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/presentation/components/ui/table'
import { Textarea } from '@/presentation/components/ui/textarea'
import {
  useAdminReservationQuery,
  useAdminReservationsQuery,
} from '@/presentation/hooks/useAdmin'
import {
  useCancelReservation,
} from '@/presentation/hooks/useReservations'
import { toast } from 'sonner'

export default function AdminReservationsPage() {
  const [urlParams] = useSearchParams()
  const [page, setPage] = useState(1)
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')

  const [status, setStatus] = useState(
    urlParams.get('estado') ?? '',
  )

  const [selectedId, setSelectedId] =
    useState<number | null>(null)
  const [isCancelDialogOpen, setIsCancelDialogOpen] =
    useState(false)
  const [cancellationReason, setCancellationReason] =
    useState('')

  const query = useAdminReservationsQuery({
    page,
    pageSize: 10,
    search,
    estado: status || undefined,
    ordering: '-created_at',
  })

  const detailQuery =
    useAdminReservationQuery(selectedId)

  const detail = detailQuery.data
  const cancelReservation = useCancelReservation()

  const handleCancelReservation = async () => {
    if (!detail) {
      return
    }

    const reason = cancellationReason.trim()

    if (!reason) {
      toast.error(
        'Ingresa el motivo de la cancelación.',
      )
      return
    }

    try {
      await cancelReservation.mutateAsync({
        reservationId: detail.id,
        reason,
      })

      setCancellationReason('')
      setIsCancelDialogOpen(false)
      toast.success('Reserva cancelada correctamente.')
    } catch (error) {
      toast.error(
        getAdminErrorMessage(
          error,
          'No fue posible cancelar la reserva.',
        ),
      )
    }
  }

  return (
    <section className="space-y-6">
      <AdminPageHeader
        title="Historial de reservas"
        description="Consulta todas las reservas, huéspedes, habitaciones y valores calculados por el backend."
      />

      <Card>
        <CardContent className="p-4">
          <form
            className="grid gap-3 sm:grid-cols-[1fr_220px_auto]"
            onSubmit={(event) => {
              event.preventDefault()
              setPage(1)
              setSearch(searchInput.trim())
            }}
          >
            <Input
              value={searchInput}
              onChange={(event) =>
                setSearchInput(event.target.value)
              }
              placeholder="Código o nombre del cliente..."
            />

            <select
              className="h-9 rounded-lg border border-input bg-background px-3 text-sm"
              value={status}
              onChange={(event) => {
                setPage(1)
                setStatus(event.target.value)
              }}
            >
              <option value="">
                Todos los estados
              </option>

              <option value="pendiente">
                Pendiente
              </option>

              <option value="confirmada">
                Confirmada
              </option>

              <option value="cancelada">
                Cancelada
              </option>

              <option value="finalizada">
                Finalizada
              </option>
            </select>

            <Button
              type="submit"
              variant="outline"
            >
              <Search className="size-4" />
              Buscar
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Estancia</TableHead>
                <TableHead>Huéspedes</TableHead>
                <TableHead>Estado</TableHead>

                <TableHead className="text-right">
                  Total
                </TableHead>

                <TableHead className="text-right">
                  Detalle
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {query.data?.results.map(
                (reservation) => (
                  <TableRow key={reservation.id}>
                    <TableCell>
                      <p className="font-medium">
                        {reservation.codigo}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        {formatAdminDate(
                          reservation.created_at,
                        )}
                      </p>
                    </TableCell>

                    <TableCell>
                      {reservation.cliente_nombre}
                    </TableCell>

                    <TableCell>
                      {formatAdminDate(
                        reservation.fecha_entrada,
                      )}
                      {' – '}
                      {formatAdminDate(
                        reservation.fecha_salida,
                      )}

                      <p className="text-xs text-muted-foreground">
                        {reservation.numero_noches}
                        {' noche(s)'}
                      </p>
                    </TableCell>

                    <TableCell>
                      <Users className="mr-1 inline size-4" />
                      {reservation.cantidad_adultos}
                      {' adulto(s), '}
                      {reservation.cantidad_ninos}
                      {' niño(s)'}
                    </TableCell>

                    <TableCell>
                      <StatusBadge
                        value={reservation.estado}
                      />
                    </TableCell>

                    <TableCell className="text-right font-medium">
                      {formatAdminCurrency(
                        reservation.total,
                        reservation.moneda,
                      )}
                    </TableCell>

                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() =>
                          setSelectedId(
                            reservation.id,
                          )
                        }
                      >
                        <Eye className="size-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ),
              )}

              {!query.isLoading
                && query.data?.results.length === 0
                && (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="h-28 text-center text-muted-foreground"
                    >
                      No existen reservas
                      con esos filtros.
                    </TableCell>
                  </TableRow>
                )}
            </TableBody>
          </Table>

          <AdminPagination
            page={page}
            count={query.data?.count ?? 0}
            onChange={setPage}
          />
        </CardContent>
      </Card>

      <Dialog
        open={selectedId !== null}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedId(null)
          }
        }}
      >
        <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              Reserva {detail?.codigo ?? ''}
            </DialogTitle>

            <DialogDescription>
              Detalle completo de la reserva
              seleccionado desde el historial.
            </DialogDescription>
          </DialogHeader>

          {detailQuery.isLoading && (
            <p className="py-10 text-center text-muted-foreground">
              Cargando detalle...
            </p>
          )}

          {detail && (
            <div className="space-y-6">
              <div className="grid gap-4 rounded-xl border p-4 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <p className="text-xs text-muted-foreground">
                    Cliente
                  </p>

                  <p className="font-medium">
                    {detail.cliente_nombre}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">
                    Estado
                  </p>

                  <StatusBadge
                    value={detail.estado}
                  />
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">
                    Entrada
                  </p>

                  <p className="font-medium">
                    {formatAdminDate(
                      detail.fecha_entrada,
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">
                    Salida
                  </p>

                  <p className="font-medium">
                    {formatAdminDate(
                      detail.fecha_salida,
                    )}
                  </p>
                </div>
              </div>

              {detail.estado === 'cancelada'
                && (
                  <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4">
                    <p className="font-medium text-destructive">
                      Reserva cancelada
                    </p>

                    {detail.motivo_cancelacion && (
                      <p className="mt-2 text-sm">
                        <span className="font-medium">
                          Motivo:
                        </span>
                        {' '}
                        {detail.motivo_cancelacion}
                      </p>
                    )}

                    {detail.fecha_cancelacion && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        Cancelada el{' '}
                        {formatAdminDate(
                          detail.fecha_cancelacion,
                        )}
                      </p>
                    )}

                    {detail.cancelada_por_nombre && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        Registrada por {detail.cancelada_por_nombre}
                      </p>
                    )}
                  </div>
                )}

              {(detail.estado === 'pendiente'
                || detail.estado === 'confirmada')
                && (
                  <Button
                    variant="destructive"
                    onClick={() =>
                      setIsCancelDialogOpen(true)
                    }
                  >
                    <CircleX className="size-4" />
                    Cancelar reserva
                  </Button>
                )}

              <div>
                <h3 className="mb-3 font-semibold">
                  Habitaciones
                </h3>

                <div className="space-y-3">
                  {detail.habitaciones_reservadas?.map(
                    (room) => (
                      <div
                        key={room.id}
                        className="flex flex-col justify-between gap-3 rounded-xl border p-4 sm:flex-row sm:items-center"
                      >
                        <div>
                          <p className="font-medium">
                            {room.hotel_nombre}
                            {' · Habitación '}
                            {room.habitacion_numero}
                          </p>

                          <p className="text-sm text-muted-foreground">
                            {room.tipo_habitacion}
                            {' · '}
                            {room.cantidad_adultos}
                            {' adulto(s) y '}
                            {room.cantidad_ninos}
                            {' niño(s)'}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="font-semibold">
                            {formatAdminCurrency(
                              room.subtotal,
                              room.moneda,
                            )}
                          </p>

                          {room.cantidad_huespedes_extra > 0 && (
                            <p className="text-xs text-muted-foreground">
                              Incluye{' '}
                              {room.cantidad_huespedes_extra}
                              {' huésped(es) extra'}
                            </p>
                          )}
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>

              <div>
                <h3 className="mb-3 font-semibold">
                  Huéspedes registrados
                </h3>

                <div className="grid gap-3 sm:grid-cols-2">
                  {detail.huespedes?.map(
                    (guest) => (
                      <div
                        key={guest.id}
                        className="rounded-xl border p-4"
                      >
                        <div className="flex items-center justify-between">
                          <p className="font-medium">
                            {guest.nombres}
                            {' '}
                            {guest.apellidos}
                          </p>

                          {guest.es_titular && (
                            <StatusBadge value="titular" />
                          )}
                        </div>

                        <p className="text-sm text-muted-foreground">
                          {guest.tipo_documento}
                          {': '}
                          {guest.numero_documento}
                        </p>

                        <p className="text-xs text-muted-foreground">
                          {guest.tipo_huesped}
                          {' · '}
                          {guest.edad}
                          {' años · Habitación '}
                          {guest.habitacion_numero}
                        </p>
                      </div>
                    ),
                  )}
                </div>
              </div>

              <Separator />

              <div className="ml-auto max-w-sm space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>

                  <span>
                    {formatAdminCurrency(
                      detail.subtotal,
                      detail.moneda,
                    )}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Impuestos</span>

                  <span>
                    {formatAdminCurrency(
                      detail.impuestos,
                      detail.moneda,
                    )}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Descuento</span>

                  <span>
                    -
                    {formatAdminCurrency(
                      detail.descuento,
                      detail.moneda,
                    )}
                  </span>
                </div>

                <div className="flex justify-between border-t pt-2 text-lg font-bold">
                  <span>Total</span>

                  <span>
                    {formatAdminCurrency(
                      detail.total,
                      detail.moneda,
                    )}
                  </span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={isCancelDialogOpen}
        onOpenChange={(open) => {
          if (!cancelReservation.isPending) {
            setIsCancelDialogOpen(open)
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              ¿Cancelar reserva?
            </AlertDialogTitle>

            <AlertDialogDescription>
              Esta acción cambiará el estado de la
              reserva a cancelada. Indica el motivo
              para continuar.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-2">
            <label
              htmlFor="cancellation-reason"
              className="text-sm font-medium"
            >
              Motivo de cancelación
            </label>

            <Textarea
              id="cancellation-reason"
              value={cancellationReason}
              onChange={(event) =>
                setCancellationReason(event.target.value)
              }
              placeholder="Describe el motivo de la cancelación"
              disabled={cancelReservation.isPending}
              required
            />
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={cancelReservation.isPending}
            >
              Volver
            </AlertDialogCancel>

            <Button
              variant="destructive"
              onClick={() => {
                void handleCancelReservation()
              }}
              disabled={
                cancelReservation.isPending
                || !cancellationReason.trim()
              }
            >
              {cancelReservation.isPending
                ? 'Cancelando...'
                : 'Confirmar cancelación'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  )
}