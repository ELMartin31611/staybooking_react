import { useState } from 'react'
import { Camera, UserRound } from 'lucide-react'

import { apiClient } from '@/infrastructure/http/axios-client'
import { apiConfig } from '@/infrastructure/config/api.config'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/presentation/components/ui/avatar'
import { Button } from '@/presentation/components/ui/button'

interface Props {
  currentImage?: string | null
  onSuccess: () => void
}

export function ProfileImageUpload({
  currentImage,
  onSuccess,
}: Props) {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleUpload() {
    if (!file) return

    const formData = new FormData()

    formData.append('foto', file)

    try {
      setLoading(true)

      await apiClient.patch(
        apiConfig.endpoints.auth.profile,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      )

      onSuccess()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4 rounded-xl border bg-muted/30 p-4">
      <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center">
        <Avatar className="size-24" size="lg">
          <AvatarImage src={currentImage ?? undefined} alt="Foto perfil" />
          <AvatarFallback>
            <UserRound className="size-8" />
          </AvatarFallback>
        </Avatar>

        <div className="space-y-2 text-center sm:text-left">
          <p className="text-sm font-medium">Foto de perfil</p>

          <p className="text-xs text-muted-foreground">
            JPG, PNG o WEBP. Tamaño recomendado 600x600.
          </p>

          {file && (
            <p className="text-xs text-primary">
              Seleccionado: {file.name}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-muted">
          <Camera className="size-4" />
          Seleccionar imagen
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) =>
              setFile(event.target.files?.[0] ?? null)
            }
          />
        </label>

        <Button
          onClick={handleUpload}
          disabled={!file || loading}
        >
          {loading ? 'Subiendo...' : 'Guardar foto'}
        </Button>
      </div>
    </div>
  )
}