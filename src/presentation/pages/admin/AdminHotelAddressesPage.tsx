import { useState } from 'react'
import {
  ArrowLeft,
  MapPin,
  Pencil,
  Plus,
} from 'lucide-react'
import { Link } from 'react-router-dom'

import type {
  AdminHotelAddress,
  SaveHotelAddressInput,
} from '@/domain/entities/admin.entity'
import {
  AdminFeedback,
  AdminPageHeader,
  AdminPagination,
  DeleteConfirmation,
  getAdminErrorMessage,
} from '@/presentation/components/admin/AdminUi'
import HotelAddressFormDialog from '@/presentation/components/admin/hotels/HotelAddressFormDialog'
import { Button } from '@/presentation/components/ui/button'
import {
  Card,
  CardContent,
} from '@/presentation/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/presentation/components/ui/table'
import {
  useAdminHotelAddressesQuery,
  useAllHotelsQuery,
  useCreateHotelAddressMutation,
  useDeleteHotelAddressMutation,
  useUpdateHotelAddressMutation,
} from '@/presentation/hooks/useAdmin'

export default function AdminHotelAddressesPage() {
  const [page, setPage] =
    useState(1)

  const [open, setOpen] =
    useState(false)

  const [
    selected,
    setSelected,
  ] =
    useState<AdminHotelAddress | null>(
      null,
    )

  const [error, setError] =
    useState('')

  const [success, setSuccess] =
    useState('')

  const addressesQuery =
    useAdminHotelAddressesQuery({
      page,
      pageSize: 10,
      ordering: 'ciudad',
    })

  const hotelsQuery =
    useAllHotelsQuery()

  const createMutation =
    useCreateHotelAddressMutation()

  const updateMutation =
    useUpdateHotelAddressMutation()

  const deleteMutation =
    useDeleteHotelAddressMutation()

  const hotelName = (
    id: number,
  ) =>
    hotelsQuery.data?.find(
      (hotel) => hotel.id === id,
    )?.nombre
    ?? `Hotel #${id}`

  async function save(
    input: SaveHotelAddressInput,
  ) {
    setError('')

    try {
      if (selected) {
        await updateMutation.mutateAsync({
          id: selected.id,
          input,
        })

        setSuccess(
          'Dirección actualizada correctamente.',
        )
      } else {
        await createMutation.mutateAsync(
          input,
        )

        setSuccess(
          'Dirección creada correctamente.',
        )
      }

      setOpen(false)
      setSelected(null)
    } catch (caughtError) {
      setError(
        getAdminErrorMessage(
          caughtError,
          'No fue posible guardar la dirección.',
        ),
      )

      throw caughtError
    }
  }

  async function remove(
    id: number,
  ) {
    setError('')
    setSuccess('')

    try {
      await deleteMutation.mutateAsync(id)

      setSuccess(
        'Dirección eliminada correctamente.',
      )
    } catch (caughtError) {
      setError(
        getAdminErrorMessage(
          caughtError,
        ),
      )
    }
  }

  return (
    <section className="space-y-6">
      <AdminPageHeader
        title="Direcciones de hoteles"
        description="Administra las ubicaciones y coordenadas utilizadas en el catálogo."
        action={
          <div className="flex gap-2">
            <Button
              variant="outline"
              asChild
            >
              <Link to="/admin/hoteles">
                <ArrowLeft className="size-4" />
                Hoteles
              </Link>
            </Button>

            <Button
              onClick={() => {
                setSelected(null)
                setOpen(true)
              }}
              disabled={
                !hotelsQuery.data?.length
              }
            >
              <Plus className="size-4" />
              Nueva dirección
            </Button>
          </div>
        }
      />

      <AdminFeedback
        error={error}
        success={success}
      />

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  Hotel
                </TableHead>

                <TableHead>
                  Ubicación
                </TableHead>

                <TableHead>
                  Dirección
                </TableHead>

                <TableHead>
                  Coordenadas
                </TableHead>

                <TableHead className="text-right">
                  Acciones
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {addressesQuery.data?.results.map(
                (address) => (
                  <TableRow
                    key={address.id}
                  >
                    <TableCell className="font-medium">
                      {hotelName(
                        address.hotel,
                      )}
                    </TableCell>

                    <TableCell>
                      <MapPin className="mr-2 inline size-4 text-primary" />
                      {address.ciudad}
                      {', '}
                      {address.provincia}
                    </TableCell>

                    <TableCell>
                      <p>
                        {address.direccion}
                      </p>

                      <p className="max-w-xs truncate text-xs text-muted-foreground">
                        {address.referencia}
                      </p>
                    </TableCell>

                    <TableCell>
                      {address.latitud}
                      {', '}
                      {address.longitud}
                    </TableCell>

                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => {
                            setSelected(
                              address,
                            )
                            setOpen(true)
                          }}
                        >
                          <Pencil className="size-4" />
                        </Button>

                        <DeleteConfirmation
                          label="Eliminar dirección"
                          description="La dirección dejará de estar asociada con el hotel."
                          loading={
                            deleteMutation
                              .isPending
                          }
                          onConfirm={() =>
                            void remove(
                              address.id,
                            )
                          }
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ),
              )}
            </TableBody>
          </Table>

          <AdminPagination
            page={page}
            count={
              addressesQuery.data
                ?.count ?? 0
            }
            onChange={setPage}
          />
        </CardContent>
      </Card>

      <HotelAddressFormDialog
        open={open}
        address={selected}
        hotels={
          hotelsQuery.data ?? []
        }
        loading={
          createMutation.isPending
          || updateMutation.isPending
        }
        onOpenChange={setOpen}
        onSave={save}
      />
    </section>
  )
}