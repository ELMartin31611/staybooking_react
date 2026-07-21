import { useState } from 'react'
import {
  Pencil,
  Plus,
  Search,
  Users,
} from 'lucide-react'

import type {
  RoomType,
  SaveRoomTypeInput,
} from '@/domain/entities/admin.entity'
import {
  AdminFeedback,
  AdminPageHeader,
  AdminPagination,
  DeleteConfirmation,
  formatAdminCurrency,
  getAdminErrorMessage,
  StatusBadge,
} from '@/presentation/components/admin/AdminUi'
import RoomTypeFormDialog from '@/presentation/components/admin/rooms/RoomTypeFormDialog'
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
  useAdminRoomTypesQuery,
  useAllHotelsQuery,
  useCreateRoomTypeMutation,
  useDeleteRoomTypeMutation,
  useUpdateRoomTypeMutation,
} from '@/presentation/hooks/useAdmin'

export default function AdminRoomTypesPage() {
  const [page, setPage] = useState(1)
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)

  const [selected, setSelected] =
    useState<RoomType | null>(null)

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const query = useAdminRoomTypesQuery({
    page,
    pageSize: 10,
    search,
    ordering: 'nombre',
  })

  const hotelsQuery = useAllHotelsQuery()
  const createMutation = useCreateRoomTypeMutation()
  const updateMutation = useUpdateRoomTypeMutation()
  const deleteMutation = useDeleteRoomTypeMutation()

  const hotelName = (id: number) =>
    hotelsQuery.data?.find(
      (hotel) => hotel.id === id,
    )?.nombre ?? `Hotel #${id}`

  async function save(
    input: SaveRoomTypeInput,
  ) {
    setError('')

    try {
      if (selected) {
        await updateMutation.mutateAsync({
          id: selected.id,
          input,
        })

        setSuccess(
          'Tipo de habitación actualizado correctamente.',
        )
      } else {
        await createMutation.mutateAsync(input)

        setSuccess(
          'Tipo de habitación creado correctamente.',
        )
      }

      setOpen(false)
      setSelected(null)
    } catch (caughtError) {
      setError(
        getAdminErrorMessage(
          caughtError,
          'No fue posible guardar el tipo de habitación.',
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
        'Tipo de habitación eliminado correctamente.',
      )
    } catch (caughtError) {
      setError(
        getAdminErrorMessage(
          caughtError,
          'No se puede eliminar porque tiene habitaciones o tarifas relacionadas.',
        ),
      )
    }
  }

  return (
    <section className="space-y-6">
      <AdminPageHeader
        title="Tipos de habitación"
        description="Configura capacidad incluida, cupos extra y precio base por hotel."
        action={
          <Button
            onClick={() => {
              setSelected(null)
              setOpen(true)
            }}
            disabled={!hotelsQuery.data?.length}
          >
            <Plus className="size-4" />
            Nuevo tipo
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
            className="flex gap-2"
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
              placeholder="Buscar tipo por nombre o descripción..."
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
                <TableHead>Tipo</TableHead>
                <TableHead>Hotel</TableHead>
                <TableHead>Capacidad</TableHead>
                <TableHead>Precio base</TableHead>
                <TableHead>Estado</TableHead>

                <TableHead className="text-right">
                  Acciones
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {query.data?.results.map(
                (roomType) => (
                  <TableRow key={roomType.id}>
                    <TableCell>
                      <p className="font-medium">
                        {roomType.nombre}
                      </p>

                      <p className="max-w-xs truncate text-xs text-muted-foreground">
                        {roomType.descripcion}
                      </p>
                    </TableCell>

                    <TableCell>
                      {hotelName(roomType.hotel)}
                    </TableCell>

                    <TableCell>
                      <Users className="mr-1 inline size-4 text-primary" />
                      {roomType.capacidad_total}
                      {' incluidos + '}
                      {roomType.capacidad_extra}
                      {' extra'}
                    </TableCell>

                    <TableCell>
                      {formatAdminCurrency(
                        roomType.precio_base,
                      )}
                    </TableCell>

                    <TableCell>
                      <StatusBadge
                        value={roomType.estado}
                      />
                    </TableCell>

                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => {
                            setSelected(roomType)
                            setOpen(true)
                          }}
                        >
                          <Pencil className="size-4" />
                        </Button>

                        <DeleteConfirmation
                          label="Eliminar tipo"
                          description={`Se eliminará ${roomType.nombre}.`}
                          loading={
                            deleteMutation.isPending
                          }
                          onConfirm={() =>
                            void remove(roomType.id)
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
            count={query.data?.count ?? 0}
            onChange={setPage}
          />
        </CardContent>
      </Card>

      <RoomTypeFormDialog
        open={open}
        roomType={selected}
        hotels={hotelsQuery.data ?? []}
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