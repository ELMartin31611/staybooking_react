import { ImagePlus, Pencil, Star, Trash2 } from 'lucide-react'
import { useState } from 'react'

import type { AdminHotel, AdminHotelMedia } from '@/domain/entities/admin.entity'
import { AdminFeedback, getAdminErrorMessage } from '@/presentation/components/admin/AdminUi'
import { Button } from '@/presentation/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/presentation/components/ui/dialog'
import { Input } from '@/presentation/components/ui/input'
import { Label } from '@/presentation/components/ui/label'
import { Textarea } from '@/presentation/components/ui/textarea'
import {
  useCreateHotelMediaMutation,
  useDeleteHotelMediaMutation,
  useHotelMediaQuery,
  useUpdateHotelMediaMutation,
} from '@/presentation/hooks/useAdmin'

interface Props {
  hotel: AdminHotel | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function HotelMediaDialog({ hotel, open, onOpenChange }: Props) {
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [editing, setEditing] = useState<AdminHotelMedia | null>(null)
  const mediaQuery = useHotelMediaQuery(open ? hotel?.id ?? null : null)
  const createMutation = useCreateHotelMediaMutation()
  const updateMutation = useUpdateHotelMediaMutation()
  const deleteMutation = useDeleteHotelMediaMutation()

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!hotel) return
    const form = event.currentTarget
    const data = new FormData(form)
    const file = data.get('archivo')
    const input = {
      hotel: hotel.id,
      tipo: String(data.get('tipo')) as 'imagen' | 'video',
      titulo: String(data.get('titulo') ?? '').trim(),
      descripcion: String(data.get('descripcion') ?? '').trim(),
      orden: Number(data.get('orden') ?? 0),
      es_principal: data.get('es_principal') === 'on',
    }

    try {
      setError('')
      if (editing) {
        await updateMutation.mutateAsync({ id: editing.id, hotelId: hotel.id, input })
        setSuccess('Media actualizada correctamente.')
        setEditing(null)
      } else {
        if (!(file instanceof File) || file.size === 0) {
          setError('Selecciona un archivo de imagen o video.')
          return
        }
        if (file.size > 20 * 1024 * 1024) {
          setError('El archivo supera el límite de 20 MB.')
          return
        }
        await createMutation.mutateAsync({ ...input, archivo: file })
        setSuccess('Media cargada correctamente.')
      }
      form.reset()
    } catch (caught) {
      setError(getAdminErrorMessage(caught, 'No fue posible guardar el archivo.'))
    }
  }

  async function remove(mediaId: number) {
    if (!hotel) return
    try {
      setError('')
      await deleteMutation.mutateAsync({ id: mediaId, hotelId: hotel.id })
      setSuccess('Archivo eliminado correctamente.')
    } catch (caught) {
      setError(getAdminErrorMessage(caught, 'No fue posible eliminar el archivo.'))
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Media de {hotel?.nombre}</DialogTitle>
          <DialogDescription>Sube, ordena, marca el archivo principal o edita la información de imágenes y videos.</DialogDescription>
        </DialogHeader>
        <AdminFeedback error={error} success={success} />
        <form key={editing?.id ?? 'create'} className="grid gap-4 rounded-xl border bg-muted/30 p-4 sm:grid-cols-2" onSubmit={save}>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="hotel-media-file">Archivo {editing ? '(conserva el actual)' : ''}</Label>
            <Input id="hotel-media-file" name="archivo" type="file" accept="image/png,image/jpeg,image/webp,video/mp4,video/webm" required={!editing} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hotel-media-title">Título</Label>
            <Input id="hotel-media-title" name="titulo" defaultValue={editing?.titulo} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hotel-media-type">Tipo</Label>
            <select id="hotel-media-type" name="tipo" defaultValue={editing?.tipo ?? 'imagen'} className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm">
              <option value="imagen">Imagen</option>
              <option value="video">Video</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="hotel-media-order">Orden</Label>
            <Input id="hotel-media-order" name="orden" type="number" min={0} defaultValue={editing?.orden ?? 0} required />
          </div>
          <label className="flex items-end gap-3 pb-2 text-sm font-medium">
            <input name="es_principal" type="checkbox" defaultChecked={editing?.es_principal} />
            Archivo principal
          </label>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="hotel-media-description">Descripción</Label>
            <Textarea id="hotel-media-description" name="descripcion" defaultValue={editing?.descripcion} />
          </div>
          <div className="flex gap-2 sm:col-span-2">
            <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
              <ImagePlus className="size-4" />{editing ? 'Guardar cambios' : 'Subir archivo'}
            </Button>
            {editing && <Button type="button" variant="outline" onClick={() => setEditing(null)}>Cancelar edición</Button>}
          </div>
        </form>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {mediaQuery.data?.map((media) => (
            <article key={media.id} className="overflow-hidden rounded-xl border bg-background">
              <div className="aspect-video bg-muted">
                {media.tipo === 'video'
                  ? <video src={media.archivo_url} controls className="size-full object-cover" />
                  : <img src={media.archivo_url} alt={media.titulo} className="size-full object-cover" />}
              </div>
              <div className="space-y-2 p-3">
                <div className="flex justify-between gap-2">
                  <div><p className="font-medium">{media.titulo}</p><p className="text-xs text-muted-foreground">Orden {media.orden} · {media.tipo}</p></div>
                  {media.es_principal && <Star className="size-4 fill-amber-400 text-amber-400" />}
                </div>
                <p className="line-clamp-2 text-xs text-muted-foreground">{media.descripcion}</p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => setEditing(media)}><Pencil className="size-4" />Editar</Button>
                  <Button size="sm" variant="outline" className="text-destructive" disabled={deleteMutation.isPending} onClick={() => void remove(media.id)}><Trash2 className="size-4" /></Button>
                </div>
              </div>
            </article>
          ))}
        </div>
        {!mediaQuery.isLoading && mediaQuery.data?.length === 0 && <p className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">Este hotel aún no tiene media administrada.</p>}
      </DialogContent>
    </Dialog>
  )
}
