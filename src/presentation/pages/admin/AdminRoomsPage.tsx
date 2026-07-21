
import { useState } from 'react'
import {
  Images,
  Pencil,
  Plus,
  Search,
} from 'lucide-react'

import type {
  Room,
  SaveRoomInput,
} from '@/domain/entities/admin.entity'
import {
  AdminFeedback,
  AdminPageHeader,
  AdminPagination,
  DeleteConfirmation,
  getAdminErrorMessage,
  StatusBadge,
} from '@/presentation/components/admin/AdminUi'
import RoomFormDialog from '@/presentation/components/admin/rooms/RoomFormDialog'
import RoomImagesDialog from '@/presentation/components/admin/rooms/RoomImagesDialog'
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
  useAdminRoomsQuery,
  useAllHotelsQuery,
  useAllRoomTypesQuery,
  useCreateRoomMutation,
  useDeleteRoomMutation,
  useUpdateRoomMutation,
} from '@/presentation/hooks/useAdmin'

export default function AdminRoomsPage() {
  const [page, setPage] = useState(1)
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [hotelFilter, setHotelFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [galleryOpen, setGalleryOpen] = useState(false)

  const [selected, setSelected] =
    useState<Room | null>(null)

  const [galleryRoom, setGalleryRoom] =
    useState<Room | null>(null)

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const query = useAdminRoomsQuery({
    page,
    pageSize: 10,
    search,
    ordering: 'id',
    hotel: hotelFilter || undefined,
    estado: statusFilter || undefined,
  })

  const hotelsQuery = useAllHotelsQuery()
  const roomTypesQuery = useAllRoomTypesQuery()
  const createMutation = useCreateRoomMutation()
  const updateMutation = useUpdateRoomMutation()
  const deleteMutation = useDeleteRoomMutation()

  async function save(
    input: SaveRoomInput,
  ) {
    setError('')

    try {
      if (selected) {
        await updateMutation.mutateAsync({
          id: selected.id,
          input,
        })

        setSuccess(
          'Habitación actualizada correctamente.',
        )
      } else {
        await createMutation.mutateAsync(input)

        setSuccess(
          'Habitación creada correctamente.',
        )
      }

      setFormOpen(false)
      setSelected(null)
    } catch (caughtError) {
      setError(
        getAdminErrorMessage(
          caughtError,
          'No fue posible guardar la habitación.',
        ),
      )

      throw caughtError
    }
  }

  async function remove(id: number) {
    setError('')
    setSuccess('')

    try {
      await deleteMutation.mutateAsync(id)

      setSuccess(
        'Habitación eliminada correctamente.',
      )
    } catch (caughtError) {
      setError(
        getAdminErrorMessage(
          caughtError,
          'No se puede eliminar una habitación relacionada con reservas.',
        ),
      )
    }
  }

  return (
    <section className="space-y-6">
      <AdminPageHeader
        title="Habitaciones"
        description="Administra habitaciones físicas y carga sus imágenes directamente al backend."
        action={
          <Button
            onClick={() => {
              setSelected(null)
              setFormOpen(true)
            }}
            disabled={
              !hotelsQuery.data?.length
              || !roomTypesQuery.data?.length
            }
          >
            <Plus className="size-4" />
            Nueva habitación
          </Button>
        }
      />

      <AdminFeedback
        error={error}
        success={success}
      />

      <Card>
        <CardContent className="p-4">
          <form
            className="grid gap-3 lg:grid-cols-[1fr_220px_200px_auto]"
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
              placeholder="Número, descripción u observaciones..."
            />

            <select
              className="h-9 rounded-lg border border-input bg-background px-3 text-sm"
              value={hotelFilter}
              onChange={(event) => {
                setPage(1)
                setHotelFilter(event.target.value)
              }}
            >
              <option value="">
                Todos los hoteles
              </option>

              {hotelsQuery.data?.map((hotel) => (
                <option
                  key={hotel.id}
                  value={hotel.id}
                >
                  {hotel.nombre}
                </option>
              ))}
            </select>

            <select
              className="h-9 rounded-lg border border-input bg-background px-3 text-sm"
              value={statusFilter}
              onChange={(event) => {
                setPage(1)
                setStatusFilter(event.target.value)
              }}
            >
              <option value="">
                Todos los estados
              </option>

              <option value="disponible">
                Disponible
              </option>

              <option value="mantenimiento">
                Mantenimiento
              </option>

              <option value="inactiva">
                Inactiva
              </option>

              <option value="bloqueada">
                Bloqueada
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
                <TableHead>Habitación</TableHead>
                <TableHead>Hotel</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Capacidad</TableHead>
                <TableHead>Estado</TableHead>

                <TableHead className="text-right">
                  Acciones
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {query.data?.results.map((room) => (
                <TableRow key={room.id}>
                  <TableCell>
                    <p className="font-medium">
                      Habitación {room.numero}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      Piso {room.piso}
                    </p>
                  </TableCell>

                  <TableCell>
                    {room.hotel_nombre
                      ?? `Hotel #${room.hotel}`}
                  </TableCell>

                  <TableCell>
                    {room.tipo_habitacion_nombre
                      ?? `Tipo #${room.tipo_habitacion}`}
                  </TableCell>

                  <TableCell>
                    {room.capacidad_total ?? '—'}
                    {' incluidos + '}
                    {room.capacidad_extra ?? 0}
                    {' extra'}
                  </TableCell>

                  <TableCell>
                    <StatusBadge
                      value={room.estado}
                    />
                  </TableCell>

                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        title="Galería"
                        onClick={() => {
                          setGalleryRoom(room)
                          setGalleryOpen(true)
                        }}
                      >
                        <Images className="size-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon-sm"
                        title="Editar"
                        onClick={() => {
                          setSelected(room)
                          setFormOpen(true)
                        }}
                      >
                        <Pencil className="size-4" />
                      </Button>

                      <DeleteConfirmation
                        label="Eliminar habitación"
                        description={`Se eliminará la habitación ${room.numero}.`}
                        loading={
                          deleteMutation.isPending
                        }
                        onConfirm={() =>
                          void remove(room.id)
                        }
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}

              {!query.isLoading
                && query.data?.results.length === 0
                && (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="h-28 text-center text-muted-foreground"
                    >
                      No existen habitaciones
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

      <RoomFormDialog
        open={formOpen}
        room={selected}
        hotels={hotelsQuery.data ?? []}
        roomTypes={roomTypesQuery.data ?? []}
        loading={
          createMutation.isPending
          || updateMutation.isPending
        }
        onOpenChange={setFormOpen}
        onSave={save}
      />

      <RoomImagesDialog
        open={galleryOpen}
        room={galleryRoom}
        onOpenChange={setGalleryOpen}
      />
    </section>
  )
}