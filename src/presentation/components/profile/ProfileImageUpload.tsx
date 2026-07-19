import {
  useEffect,
  useRef,
  useState,
} from 'react'
import type { ChangeEvent } from 'react'
import {
  Camera,
  CheckCircle2,
  UserRound,
} from 'lucide-react'

import type { UserProfile } from '@/domain/entities/user-profile.entity'
import { ApiException } from '@/domain/exceptions/api.exception'
import { apiConfig } from '@/infrastructure/config/api.config'
import { apiClient } from '@/infrastructure/http/axios-client'
import {
  Alert,
  AlertDescription,
} from '@/presentation/components/ui/alert'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/presentation/components/ui/avatar'
import { Button } from '@/presentation/components/ui/button'

const MAX_IMAGE_SIZE = 2 * 1024 * 1024

const ALLOWED_IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
])

interface ProfileImageUploadProps {
  currentImage?: string | null
  onSuccess: (profile: UserProfile) => void
}

export function ProfileImageUpload({
  currentImage,
  onSuccess,
}: ProfileImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    null,
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null)
      return
    }

    const objectUrl = URL.createObjectURL(file)
    setPreviewUrl(objectUrl)

    return () => {
      URL.revokeObjectURL(objectUrl)
    }
  }, [file])

  function handleFileChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const selectedFile = event.target.files?.[0] ?? null

    setError('')
    setSuccess('')

    if (!selectedFile) {
      setFile(null)
      return
    }

    if (!ALLOWED_IMAGE_TYPES.has(selectedFile.type)) {
      setFile(null)
      event.target.value = ''
      setError(
        'Selecciona una imagen JPG, PNG o WebP.',
      )
      return
    }

    if (selectedFile.size > MAX_IMAGE_SIZE) {
      setFile(null)
      event.target.value = ''
      setError(
        'La imagen no puede superar los 2 MB.',
      )
      return
    }

    setFile(selectedFile)
  }

  async function handleUpload() {
    if (!file || loading) {
      return
    }

    const formData = new FormData()

    formData.append(
      'foto',
      file,
      file.name,
    )

    try {
      setLoading(true)
      setError('')
      setSuccess('')

      /*
       * No se establece Content-Type manualmente.
       * Axios genera automáticamente multipart/form-data
       * incluyendo el boundary requerido por Django.
       */
      const { data } = await apiClient.patch<UserProfile>(
        apiConfig.endpoints.auth.profile,
        formData,
      )

      onSuccess(data)
      setFile(null)
      setSuccess(
        'Foto actualizada correctamente.',
      )

      if (inputRef.current) {
        inputRef.current.value = ''
      }
    } catch (caughtError: unknown) {
      setError(
        caughtError instanceof ApiException
          ? caughtError.message
          : 'No fue posible subir la imagen.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4 rounded-xl border bg-muted/30 p-4">
      <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center">
        <Avatar className="size-24" size="lg">
          <AvatarImage
            src={previewUrl ?? currentImage ?? undefined}
            alt="Foto de perfil"
          />

          <AvatarFallback>
            <UserRound className="size-8" />
          </AvatarFallback>
        </Avatar>

        <div className="space-y-2 text-center sm:text-left">
          <p className="text-sm font-medium">
            Foto de perfil
          </p>

          <p className="text-xs text-muted-foreground">
            JPG, PNG o WebP. Máximo 2 MB.
          </p>

          {file && (
            <p className="text-xs text-primary">
              Seleccionada: {file.name}
            </p>
          )}
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert>
          <CheckCircle2 className="size-4" />

          <AlertDescription>
            {success}
          </AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col gap-2 sm:flex-row">
        <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-muted">
          <Camera className="size-4" />
          Seleccionar imagen

          <input
            ref={inputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleFileChange}
            disabled={loading}
          />
        </label>

        <Button
          type="button"
          onClick={handleUpload}
          disabled={!file || loading}
        >
          {loading ? 'Subiendo...' : 'Guardar foto'}
        </Button>
      </div>
    </div>
  )
}