import { useState } from 'react'
import {
  ImagePlus,
  Star,
  Trash2,
} from 'lucide-react'

import type { Room } from '@/domain/entities/admin.entity'
import {
  AdminFeedback,
  getAdminErrorMessage,
} from '@/presentation/components/admin/AdminUi'
import { Button } from '@/presentation/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/presentation/components/ui/dialog'
import { Input } from '@/presentation/components/ui/input'
import { Label } from '@/presentation/components/ui/label'
import { Textarea } from '@/presentation/components/ui/textarea'
import {
  useCreateRoomImageMutation,
  useDeleteRoomImageMutation,
  useRoomImagesQuery,
} from '@/presentation/hooks/useAdmin'

interface Props {
  open: boolean
  room: Room | null
  onOpenChange: (open: boolean) => void
}

export default function RoomImagesDialog({
  open,
  room,
  onOpenChange,
}: Props) {
  const [error, setError] =
    useState('')

  const [success, setSuccess] =
    useState('')

  const imagesQuery =
    useRoomImagesQuery(
      open
        ? room?.id ?? null
        : null,
    )

  const createMutation =
    useCreateRoomImageMutation()

  const deleteMutation =
    useDeleteRoomImageMutation()

  async function upload(
    event:
      React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    if (!room) {
      return
    }

    const formElement =
      event.currentTarget

    const formData =
      new FormData(formElement)

    const image =
      formData.get('imagen')

    if (
      !(image instanceof File)
      || image.size === 0
    ) {
      setError(
        'Selecciona una imagen.',
      )
      return
    }

    if (
      image.size
      > 2 * 1024 * 1024
    ) {
      setError(
        'La imagen supera el límite de 2 MB.',
      )
      return
    }

    setError('')

    try {
      await createMutation.mutateAsync({
        habitacion: room.id,
        imagen: image,
        titulo: String(
          formData.get('titulo') ?? '',
        ).trim(),
        descripcion: String(
          formData.get(
            'descripcion',
          ) ?? '',
        ).trim(),
        orden: Number(
          formData.get('orden') ?? 0,
        ),
        es_principal:
          formData.get(
            'es_principal',
          ) === 'on',
      })

      formElement.reset()

      setSuccess(
        'Imagen cargada correctamente.',
      )
    } catch (caughtError) {
      setError(
        getAdminErrorMessage(
          caughtError,
          'No fue posible subir la imagen.',
        ),
      )
    }
  }

  async function remove(
    id: number,
  ) {
    if (!room) {
      return
    }

    setError('')

    try {
      await deleteMutation.mutateAsync({
        id,
        roomId: room.id,
      })

      setSuccess(
        'Imagen eliminada correctamente.',
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
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>
            Galería de habitación{' '}
            {room?.numero}
          </DialogTitle>

          <DialogDescription>
            Sube archivos reales al backend.
            Solo una imagen puede ser
            principal.
          </DialogDescription>
        </DialogHeader>

        <AdminFeedback
          error={error}
          success={success}
        />

        <form
          className="grid gap-4 rounded-xl border bg-muted/30 p-4 sm:grid-cols-2"
          onSubmit={upload}
        >
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="room-image-file">
              Archivo
            </Label>

            <Input
              id="room-image-file"
              name="imagen"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="room-image-title">
              Título
            </Label>

            <Input
              id="room-image-title"
              name="titulo"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="room-image-order">
              Orden
            </Label>

            <Input
              id="room-image-order"
              name="orden"
              type="number"
              min={0}
              defaultValue={0}
              required
            />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="room-image-description">
              Descripción
            </Label>

            <Textarea
              id="room-image-description"
              name="descripcion"
              required
            />
          </div>

          <label className="flex items-center gap-3 text-sm font-medium">
            <input
              type="checkbox"
              name="es_principal"
            />
            Imagen principal
          </label>

          <Button
            type="submit"
            disabled={
              createMutation.isPending
            }
          >
            <ImagePlus className="size-4" />

            {createMutation.isPending
              ? 'Subiendo...'
              : 'Subir imagen'}
          </Button>
        </form>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {imagesQuery.data?.map(
            (image) => (
              <article
                key={image.id}
                className="overflow-hidden rounded-xl border bg-background"
              >
                <div className="aspect-video bg-muted">
                  {image.imagen_url && (
                    <img
                      src={
                        image.imagen_url
                      }
                      alt={image.titulo}
                      className="size-full object-cover"
                    />
                  )}
                </div>

                <div className="space-y-2 p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium">
                        {image.titulo}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        Orden {image.orden}
                      </p>
                    </div>

                    {image.es_principal
                      && (
                        <Star className="size-4 fill-amber-400 text-amber-400" />
                      )}
                  </div>

                  <p className="line-clamp-2 text-xs text-muted-foreground">
                    {image.descripcion}
                  </p>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full text-destructive"
                    onClick={() =>
                      void remove(
                        image.id,
                      )
                    }
                    disabled={
                      deleteMutation.isPending
                    }
                  >
                    <Trash2 className="size-4" />
                    Eliminar
                  </Button>
                </div>
              </article>
            ),
          )}
        </div>

        {!imagesQuery.isLoading
          && imagesQuery.data?.length === 0
          && (
            <p className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
              Esta habitación todavía
              no tiene imágenes.
            </p>
          )}
      </DialogContent>
    </Dialog>
  )
}