import { useState } from 'react'
import {
  Pencil,
  Plus,
  Search,
} from 'lucide-react'

import type {
  AdminService,
  SaveServiceInput,
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
import { Button } from '@/presentation/components/ui/button'
import {
  Card,
  CardContent,
} from '@/presentation/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/presentation/components/ui/dialog'
import { Input } from '@/presentation/components/ui/input'
import { Label } from '@/presentation/components/ui/label'
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
  useAdminServicesQuery,
  useCreateServiceMutation,
  useDeleteServiceMutation,
  useUpdateServiceMutation,
} from '@/presentation/hooks/useAdmin'

const emptyForm: SaveServiceInput = {
  nombre: '',
  descripcion: '',
  tipo_servicio: 'habitacion',
  precio_extra: '0.00',
  icono: 'CircleCheck',
  is_active: true,
}

export default function AdminServicesPage() {
  const [page, setPage] = useState(1)
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)

  const [selected, setSelected] =
    useState<AdminService | null>(null)

  const [form, setForm] =
    useState<SaveServiceInput>(emptyForm)

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const query = useAdminServicesQuery({
    page,
    pageSize: 10,
    search,
    ordering: 'nombre',
  })

  const createMutation = useCreateServiceMutation()
  const updateMutation = useUpdateServiceMutation()
  const deleteMutation = useDeleteServiceMutation()

  function openForm(
    service?: AdminService,
  ) {
    setSelected(service ?? null)

    setForm(
      service
        ? {
            nombre: service.nombre,
            descripcion: service.descripcion,
            tipo_servicio:
              service.tipo_servicio,
            precio_extra:
              service.precio_extra,
            icono: service.icono,
            is_active: service.is_active,
          }
        : emptyForm,
    )

    setOpen(true)
  }

  function update<
    K extends keyof SaveServiceInput,
  >(
    key: K,
    value: SaveServiceInput[K],
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }))
  }

  async function save(
    event:
      React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()
    setError('')

    try {
      if (selected) {
        await updateMutation.mutateAsync({
          id: selected.id,
          input: form,
        })

        setSuccess(
          'Servicio actualizado correctamente.',
        )
      } else {
        await createMutation.mutateAsync(form)

        setSuccess(
          'Servicio creado correctamente.',
        )
      }

      setOpen(false)
      setSelected(null)
    } catch (caughtError) {
      setError(
        getAdminErrorMessage(
          caughtError,
          'No fue posible guardar el servicio.',
        ),
      )
    }
  }

  async function remove(id: number) {
    setError('')
    setSuccess('')

    try {
      await deleteMutation.mutateAsync(id)

      setSuccess(
        'Servicio eliminado correctamente.',
      )
    } catch (caughtError) {
      setError(
        getAdminErrorMessage(
          caughtError,
          'No se puede eliminar porque está relacionado con habitaciones.',
        ),
      )
    }
  }

  return (
    <section className="space-y-6">
      <AdminPageHeader
        title="Servicios"
        description="Administra servicios incluidos y extras disponibles en StayBooking."
        action={
          <Button onClick={() => openForm()}>
            <Plus className="size-4" />
            Nuevo servicio
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
              placeholder="Buscar servicio..."
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
                <TableHead>Servicio</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Precio extra</TableHead>
                <TableHead>Icono</TableHead>
                <TableHead>Estado</TableHead>

                <TableHead className="text-right">
                  Acciones
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {query.data?.results.map((service) => (
                <TableRow key={service.id}>
                  <TableCell>
                    <p className="font-medium">
                      {service.nombre}
                    </p>

                    <p className="max-w-sm truncate text-xs text-muted-foreground">
                      {service.descripcion}
                    </p>
                  </TableCell>

                  <TableCell className="capitalize">
                    {service.tipo_servicio.replaceAll(
                      '_',
                      ' ',
                    )}
                  </TableCell>

                  <TableCell>
                    {formatAdminCurrency(
                      service.precio_extra,
                    )}
                  </TableCell>

                  <TableCell>
                    {service.icono}
                  </TableCell>

                  <TableCell>
                    <StatusBadge
                      value={
                        service.is_active
                          ? 'activo'
                          : 'inactivo'
                      }
                    />
                  </TableCell>

                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() =>
                          openForm(service)
                        }
                      >
                        <Pencil className="size-4" />
                      </Button>

                      <DeleteConfirmation
                        label="Eliminar servicio"
                        description={`Se eliminará ${service.nombre}.`}
                        loading={
                          deleteMutation.isPending
                        }
                        onConfirm={() =>
                          void remove(service.id)
                        }
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
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
        open={open}
        onOpenChange={setOpen}
      >
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {selected
                ? 'Editar servicio'
                : 'Crear servicio'}
            </DialogTitle>

            <DialogDescription>
              Define si el servicio es gratuito
              o tiene un valor adicional.
            </DialogDescription>
          </DialogHeader>

          <form
            className="space-y-4"
            onSubmit={save}
          >
            <div className="space-y-2">
              <Label htmlFor="service-name">
                Nombre
              </Label>

              <Input
                id="service-name"
                value={form.nombre}
                onChange={(event) =>
                  update(
                    'nombre',
                    event.target.value,
                  )
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="service-description">
                Descripción
              </Label>

              <Textarea
                id="service-description"
                value={form.descripcion}
                onChange={(event) =>
                  update(
                    'descripcion',
                    event.target.value,
                  )
                }
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="service-type">
                  Tipo
                </Label>

                <Input
                  id="service-type"
                  value={form.tipo_servicio}
                  onChange={(event) =>
                    update(
                      'tipo_servicio',
                      event.target.value,
                    )
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="service-price">
                  Precio extra
                </Label>

                <Input
                  id="service-price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.precio_extra}
                  onChange={(event) =>
                    update(
                      'precio_extra',
                      event.target.value,
                    )
                  }
                  required
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="service-icon">
                  Nombre del icono
                </Label>

                <Input
                  id="service-icon"
                  value={form.icono}
                  onChange={(event) =>
                    update(
                      'icono',
                      event.target.value,
                    )
                  }
                  required
                />
              </div>
            </div>

            <label className="flex items-center gap-3 rounded-lg border p-3">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(event) =>
                  update(
                    'is_active',
                    event.target.checked,
                  )
                }
              />

              <span className="text-sm font-medium">
                Servicio activo
              </span>
            </label>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancelar
              </Button>

              <Button
                type="submit"
                disabled={
                  createMutation.isPending
                  || updateMutation.isPending
                }
              >
                Guardar servicio
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  )
}