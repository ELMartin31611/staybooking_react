import { useState } from 'react'
import {
  CheckCircle2,
  RefreshCw,
} from 'lucide-react'

import type {
  RateReference,
  SaveRoomRateInput,
} from '@/domain/entities/rate-reference.entity'
import type {
  SaveSeasonInput,
  Season,
} from '@/domain/entities/season.entity'
import {
  Alert,
  AlertDescription,
} from '@/presentation/components/ui/alert'
import { Button } from '@/presentation/components/ui/button'
import SeasonForm from '@/presentation/components/admin/rates/SeasonForm'
import SeasonTable from '@/presentation/components/admin/rates/SeasonTable'
import RateForm from '@/presentation/components/admin/rates/RateForm'
import RateTable from '@/presentation/components/admin/rates/RateTable'
import {
  useCreateRateMutation,
  useCreateSeasonMutation,
  useDeleteRateMutation,
  useDeleteSeasonMutation,
  useRatesQuery,
  useRoomTypesQuery,
  useSeasonsQuery,
  useUpdateRateMutation,
  useUpdateSeasonMutation,
} from '@/presentation/hooks/useRateManagement'

function getErrorMessage(
  error: unknown,
  fallback: string,
): string {
  if (error instanceof Error) {
    return error.message
  }

  return fallback
}

export default function AdminRatesPage() {
  const roomTypesQuery = useRoomTypesQuery()
  const seasonsQuery = useSeasonsQuery()
  const ratesQuery = useRatesQuery()

  const createSeasonMutation =
    useCreateSeasonMutation()
  const updateSeasonMutation =
    useUpdateSeasonMutation()
  const deleteSeasonMutation =
    useDeleteSeasonMutation()

  const createRateMutation =
    useCreateRateMutation()
  const updateRateMutation =
    useUpdateRateMutation()
  const deleteRateMutation =
    useDeleteRateMutation()

  const [selectedSeason, setSelectedSeason] =
    useState<Season | null>(null)

  const [selectedRate, setSelectedRate] =
    useState<RateReference | null>(null)

  const [deletingSeasonId, setDeletingSeasonId] =
    useState<number | null>(null)

  const [deletingRateId, setDeletingRateId] =
    useState<number | null>(null)

  const [error, setError] = useState('')
  const [feedback, setFeedback] = useState('')

  const roomTypes =
    roomTypesQuery.data ?? []

  const seasons =
    seasonsQuery.data ?? []

  const rates =
    ratesQuery.data ?? []

  const isSeasonSubmitting =
    createSeasonMutation.isPending
    || updateSeasonMutation.isPending

  const isRateSubmitting =
    createRateMutation.isPending
    || updateRateMutation.isPending

  const hasQueryError =
    roomTypesQuery.isError
    || seasonsQuery.isError
    || ratesQuery.isError

  function clearMessages() {
    setError('')
    setFeedback('')
  }

  async function handleSaveSeason(
    data: SaveSeasonInput,
  ): Promise<void> {
    clearMessages()

    try {
      if (selectedSeason) {
        await updateSeasonMutation.mutateAsync({
          seasonId: selectedSeason.id,
          data,
        })

        setSelectedSeason(null)
        setFeedback(
          'Temporada actualizada correctamente.',
        )
      } else {
        await createSeasonMutation.mutateAsync(
          data,
        )

        setFeedback(
          'Temporada creada correctamente.',
        )
      }
    } catch (caughtError: unknown) {
      const message = getErrorMessage(
        caughtError,
        'No fue posible guardar la temporada.',
      )

      setError(message)
      throw caughtError
    }
  }

  async function handleDeleteSeason(
    season: Season,
  ): Promise<void> {
    clearMessages()
    setDeletingSeasonId(season.id)

    try {
      await deleteSeasonMutation.mutateAsync(
        season.id,
      )

      if (selectedSeason?.id === season.id) {
        setSelectedSeason(null)
      }

      setFeedback(
        'Temporada eliminada correctamente.',
      )
    } catch (caughtError: unknown) {
      setError(
        getErrorMessage(
          caughtError,
          'No fue posible eliminar la temporada.',
        ),
      )
    } finally {
      setDeletingSeasonId(null)
    }
  }

  async function handleSaveRate(
    data: SaveRoomRateInput,
  ): Promise<void> {
    clearMessages()

    try {
      if (selectedRate) {
        await updateRateMutation.mutateAsync({
          rateId: selectedRate.id,
          data,
        })

        setSelectedRate(null)
        setFeedback(
          'Tarifa actualizada correctamente.',
        )
      } else {
        await createRateMutation.mutateAsync(
          data,
        )

        setFeedback(
          'Tarifa creada correctamente.',
        )
      }
    } catch (caughtError: unknown) {
      const message = getErrorMessage(
        caughtError,
        'No fue posible guardar la tarifa.',
      )

      setError(message)
      throw caughtError
    }
  }

  async function handleDeleteRate(
    rate: RateReference,
  ): Promise<void> {
    clearMessages()
    setDeletingRateId(rate.id)

    try {
      await deleteRateMutation.mutateAsync(
        rate.id,
      )

      if (selectedRate?.id === rate.id) {
        setSelectedRate(null)
      }

      setFeedback(
        'Tarifa eliminada correctamente.',
      )
    } catch (caughtError: unknown) {
      setError(
        getErrorMessage(
          caughtError,
          'No fue posible eliminar la tarifa.',
        ),
      )
    } finally {
      setDeletingRateId(null)
    }
  }

  async function handleRetry() {
    clearMessages()

    await Promise.all([
      roomTypesQuery.refetch(),
      seasonsQuery.refetch(),
      ratesQuery.refetch(),
    ])
  }

  function handleEditSeason(
    season: Season,
  ) {
    clearMessages()
    setSelectedSeason(season)

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  function handleEditRate(
    rate: RateReference,
  ) {
    clearMessages()
    setSelectedRate(rate)

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  return (
    <section className="space-y-8">
      <header className="flex flex-col gap-4 rounded-2xl border bg-background p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Temporadas y tarifas
          </h1>

          <p className="mt-2 text-muted-foreground">
            Administra fechas, precios regulares y valores
            especiales de fin de semana.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={() => {
            void handleRetry()
          }}
          disabled={
            roomTypesQuery.isFetching
            || seasonsQuery.isFetching
            || ratesQuery.isFetching
          }
        >
          <RefreshCw
            className={
              roomTypesQuery.isFetching
              || seasonsQuery.isFetching
              || ratesQuery.isFetching
                ? 'size-4 animate-spin'
                : 'size-4'
            }
          />

          Actualizar
        </Button>
      </header>

      {hasQueryError && (
        <Alert variant="destructive">
          <AlertDescription>
            No fue posible cargar toda la información.
            Comprueba tu conexión y vuelve a intentarlo.
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      )}

      {feedback && (
        <Alert>
          <CheckCircle2 className="size-4" />

          <AlertDescription>
            {feedback}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 xl:grid-cols-2">
        <SeasonForm
          season={selectedSeason}
          isSubmitting={isSeasonSubmitting}
          onSubmit={handleSaveSeason}
          onCancel={() => {
            setSelectedSeason(null)
            clearMessages()
          }}
        />

        <RateForm
          rate={selectedRate}
          roomTypes={roomTypes}
          seasons={seasons}
          isSubmitting={isRateSubmitting}
          onSubmit={handleSaveRate}
          onCancel={() => {
            setSelectedRate(null)
            clearMessages()
          }}
        />
      </div>

      <SeasonTable
        seasons={seasons}
        isLoading={seasonsQuery.isLoading}
        deletingId={deletingSeasonId}
        onEdit={handleEditSeason}
        onDelete={handleDeleteSeason}
      />

      <RateTable
        rates={rates}
        isLoading={ratesQuery.isLoading}
        deletingId={deletingRateId}
        onEdit={handleEditRate}
        onDelete={handleDeleteRate}
      />
    </section>
  )
}