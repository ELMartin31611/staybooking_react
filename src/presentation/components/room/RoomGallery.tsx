import { useMemo, useState } from 'react'
import { ImageOff } from 'lucide-react'

import type { RoomImage } from '@/domain/entities/room-image.entity'

interface RoomGalleryProps {
  images: RoomImage[]
  roomNumber: string
}

export default function RoomGallery({
  images,
  roomNumber,
}: RoomGalleryProps) {
  const orderedImages = useMemo(
    () =>
      [...images].sort((first, second) => {
        if (
          first.es_principal !== second.es_principal
        ) {
          return first.es_principal ? -1 : 1
        }

        return first.orden - second.orden
      }),
    [images],
  )

  const [selectedImageId, setSelectedImageId] =
    useState<number | null>(
      orderedImages[0]?.id ?? null,
    )

  const selectedImage =
    orderedImages.find(
      (image) => image.id === selectedImageId,
    ) ?? orderedImages[0]

  if (!selectedImage) {
    return (
      <div className="flex min-h-72 flex-col items-center justify-center rounded-3xl border border-dashed bg-muted/60 p-6 text-center">
        <ImageOff className="size-10 text-muted-foreground" aria-hidden="true" />
        <p className="mt-3 font-medium text-foreground">
          Aún no hay imágenes de esta habitación.
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Habitación {roomNumber}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-3xl border border-slate-200/60 bg-muted dark:border-zinc-800/60">
        <img
          src={selectedImage.imagen_url}
          alt={
            selectedImage.titulo ||
            `Habitación ${roomNumber}`
          }
          className="h-80 w-full object-cover md:h-[450px] transition-transform duration-700 hover:scale-[1.01]"
        />
      </div>

      {orderedImages.length > 1 && (
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-6 md:grid-cols-8">
          {orderedImages.map((image) => {
            const isSelected =
              image.id === selectedImage.id

            return (
              <button
                key={image.id}
                type="button"
                onClick={() =>
                  setSelectedImageId(image.id)
                }
                className={`overflow-hidden rounded-xl border-2 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer ${
                  isSelected
                    ? 'border-primary shadow-md shadow-primary/10'
                    : 'border-transparent opacity-75 hover:opacity-100'
                }`}
                aria-label={`Mostrar ${image.titulo}`}
              >
                <img
                  src={image.imagen_url}
                  alt={image.titulo}
                  className="h-16 w-full object-cover"
                />
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}