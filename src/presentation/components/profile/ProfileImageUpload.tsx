import { useState } from 'react'

import { apiClient } from '@/infrastructure/http/axios-client'
import { apiConfig } from '@/infrastructure/config/api.config'
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
    <div className="space-y-3">
      {currentImage && (
        <img
          src={currentImage}
          alt="Foto perfil"
          className="size-28 rounded-full object-cover"
        />
      )}

      <input
        type="file"
        accept="image/*"
        onChange={(event) =>
          setFile(event.target.files?.[0] ?? null)
        }
      />

      <Button
        onClick={handleUpload}
        disabled={!file || loading}
      >
        {loading
          ? 'Subiendo...'
          : 'Cambiar foto'}
      </Button>
    </div>
  )
}