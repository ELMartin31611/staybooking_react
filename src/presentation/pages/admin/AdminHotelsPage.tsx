import { useState } from 'react'
import {
  ImageOff,
  MapPin,
  Pencil,
  Plus,
  Search,
} from 'lucide-react'
import { Link } from 'react-router-dom'

import type {
  AdminHotel,
  SaveHotelInput,
} from '@/domain/entities/admin.entity'
import {
  AdminFeedback,
  AdminPageHeader,
  AdminPagination,
  DeleteConfirmation,
  getAdminErrorMessage,
  StatusBadge,
} from '@/presentation/components/admin/AdminUi'
import HotelFormDialog from '@/presentation/components/admin/hotels/HotelFormDialog'
import { Button } from '@/presentation/components/ui/button'
import {
  Card,
  CardContent,
} from '@/presentation/components/ui/card'
import { Input } from '@/presentation/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/presentation/components/ui/table'
import {
  useAdminHotelsQuery,
  useCreateHotelMutation,
  useDeleteHotelMutation,
  useUpdateHotelMutation,
} from '@/presentation/hooks/useAdmin'

export default function AdminHotelsPage() {
  const [page, setPage] =
    useState(1)

  const [
    searchInput,
    setSearchInput,
  ] = useState('')

  const [search, setSearch] =
    useState('')

  const [
    dialogOpen,
    setDialogOpen,
  ] = useState(false)

  const [
    selected,
    setSelected,
  ] = useState<AdminHotel | null>(
    null,
  )

  const [error, setError] =
    useState('')

  const [success, setSuccess] =
    useState('')

  const query = useAdminHotelsQuery({
    page,
    pageSize: 10,
    search,
    ordering: 'nombre',
  })

  const createMutation =
    useCreateHotelMutation()

  const updateMutation =
    useUpdateHotelMutation()

  const deleteMutation =
    useDeleteHotelMutation()

  function openCreate() {
    setSelected(null)
    setError('')
    setSuccess('')
    setDialogOpen(true)
  }

  function openEdit(
    hotel: AdminHotel,
  ) {
    setSelected(hotel)
    setError('')
    setSuccess('')
    setDialogOpen(true)
  }

  async function saveHotel(
    input: SaveHotelInput,
  ) {
    setError('')

    try {
      if (selected) {
        await updateMutation.mutateAsync({
          id: selected.id,
          input,
        })

        setSuccess(
          'Hotel actualizado correctamente.',
        )
      } else {
        await createMutation.mutateAsync(
          input,
        )

        setSuccess(
          'Hotel creado correctamente.',
        )
      }

      setDialogOpen(false)
      setSelected(null)
    } catch (caughtError) {
      setError(
        getAdminErrorMessage(
          caughtError,
          'No fue posible guardar el hotel.',
        ),
      )

      throw caughtError
    }
  }

  async function deleteHotel(
    id: number,
  ) {
    setError('')
    setSuccess('')

    try {
      await deleteMutation.mutateAsync(id)

      setSuccess(
        'Hotel eliminado correctamente.',
      )
    } catch (caughtError) {
      setError(
        getAdminErrorMessage(
          caughtError,
          'No se puede eliminar el hotel porque tiene información relacionada.',
        ),
      )
    }
  }

  return (
    <section className="space-y-6">
      <AdminPageHeader
        title="Hoteles"
        description="Crea, actualiza y elimina hoteles utilizando logos cargados desde el dispositivo."
        action={
          <div className="flex gap-2">
            <Button
              variant="outline"
              asChild
            >
              <Link to="/admin/direcciones-hotel">
                <MapPin className="size-4" />
                Direcciones
              </Link>
            </Button>

            <Button
              onClick={openCreate}
            >
              <Plus className="size-4" />
              Nuevo hotel
            </Button>
          </div>
        }
      />

      <AdminFeedback
        error={error}
        success={success}
      />

      <Card>
        <CardContent className="p-4">
          <form
            className="flex gap-2"
            onSubmit={(event) => {
              event.preventDefault()
              setPage(1)
              setSearch(
                searchInput.trim(),
              )
            }}
          >
            <Input
              value={searchInput}
              onChange={(event) =>
                setSearchInput(
                  event.target.value,
                )
              }
              placeholder="Buscar por nombre, RUC, teléfono o correo..."
            />

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
                <TableHead>
                  Hotel
                </TableHead>

                <TableHead>
                  Contacto
                </TableHead>

                <TableHead>
                  Categoría
                </TableHead>

                <TableHead>
                  Estado
                </TableHead>

                <TableHead>
                  Horario
                </TableHead>

                <TableHead className="text-right">
                  Acciones
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {query.data?.results.map(
                (hotel) => (
                  <TableRow
                    key={hotel.id}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-muted">
                          {hotel.logo_url
                            ? (
                              <img
                                src={
                                  hotel.logo_url
                                }
                                alt={
                                  hotel.nombre
                                }
                                className="size-full object-cover"
                              />
                            )
                            : (
                              <ImageOff className="size-5 text-muted-foreground" />
                            )}
                        </div>

                        <div>
                          <p className="font-medium">
                            {hotel.nombre}
                          </p>

                          <p className="text-xs text-muted-foreground">
                            RUC {hotel.ruc}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <p>
                        {hotel.email}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        {hotel.telefono}
                      </p>
                    </TableCell>

                    <TableCell>
                      {'★'.repeat(
                        hotel
                          .categoria_estrellas,
                      )}
                    </TableCell>

                    <TableCell>
                      <StatusBadge
                        value={hotel.estado}
                      />
                    </TableCell>

                    <TableCell>
                      {hotel.hora_check_in
                        .slice(0, 5)}
                      {' – '}
                      {hotel.hora_check_out
                        .slice(0, 5)}
                    </TableCell>

                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() =>
                            openEdit(hotel)
                          }
                          title="Editar hotel"
                        >
                          <Pencil className="size-4" />
                        </Button>

                        <DeleteConfirmation
                          label="Eliminar hotel"
                          description={`Se eliminará ${hotel.nombre}. Esta acción no se puede deshacer.`}
                          loading={
                            deleteMutation
                              .isPending
                          }
                          onConfirm={() =>
                            void deleteHotel(
                              hotel.id,
                            )
                          }
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ),
              )}

              {!query.isLoading
                && query.data?.results
                  .length === 0
                && (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="h-28 text-center text-muted-foreground"
                    >
                      No existen hoteles
                      con esos filtros.
                    </TableCell>
                  </TableRow>
                )}
            </TableBody>
          </Table>

          <AdminPagination
            page={page}
            count={
              query.data?.count ?? 0
            }
            onChange={setPage}
          />
        </CardContent>
      </Card>

      <HotelFormDialog
        open={dialogOpen}
        hotel={selected}
        loading={
          createMutation.isPending
          || updateMutation.isPending
        }
        onOpenChange={setDialogOpen}
        onSave={saveHotel}
      />
    </section>
  )
}