import { useMemo, useState } from 'react'

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
      <div className="flex min-h-72 items-center justify-center rounded-xl border bg-muted">
        <p className="text-sm text-muted-foreground">
          La habitación {roomNumber} no tiene imágenes.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-xl border bg-muted">
        <img
          src={selectedImage.imagen_url}
          alt={
            selectedImage.titulo ||
            `Habitación ${roomNumber}`
          }
          className="h-80 w-full object-cover md:h-96"
        />
      </div>

      {orderedImages.length > 1 && (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
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
                className={`overflow-hidden rounded-lg border-2 ${
                  isSelected
                    ? 'border-primary'
                    : 'border-transparent'
                }`}
                aria-label={`Mostrar ${image.titulo}`}
              >
                <img
                  src={image.imagen_url}
                  alt={image.titulo}
                  className="h-20 w-full object-cover"
                />
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}