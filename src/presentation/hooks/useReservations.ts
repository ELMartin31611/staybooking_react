import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'

import type { CreateReservationDto } from '@/application/dtos/create-reservation.dto'
import { reservationUseCase } from '@/infrastructure/factories/reservation.factory'

export const reservationQueryKeys = {
  all: ['reservations'] as const,

  detail: (
    reservationId: number,
  ) => [
    ...reservationQueryKeys.all,
    'detail',
    reservationId,
  ] as const,
}

export function useReservations() {
  return useQuery({
    queryKey: reservationQueryKeys.all,

    queryFn: () =>
      reservationUseCase.getReservations(),

    staleTime: 30_000,
  })
}

export function useReservation(
  reservationId: number,
) {
  return useQuery({
    queryKey:
      reservationQueryKeys.detail(
        reservationId,
      ),

    queryFn: () =>
      reservationUseCase
        .getReservationById(
          reservationId,
        ),

    enabled:
      Number.isInteger(reservationId)
      && reservationId > 0,

    staleTime: 30_000,
  })
}

export function useCreateReservation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (
      data: CreateReservationDto,
    ) =>
      reservationUseCase
        .createReservation(data),

    onSuccess: async (reservation) => {
      queryClient.setQueryData(
        reservationQueryKeys.detail(
          reservation.id,
        ),
        reservation,
      )

      await queryClient.invalidateQueries({
        queryKey: reservationQueryKeys.all,
      })
    },
  })
}

export function useCancelReservation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      reservationId,
      reason,
    }: {
      reservationId: number
      reason: string
    }) =>
      reservationUseCase.cancelReservation(
        reservationId,
        reason,
      ),

    onSuccess: async (reservation) => {
      queryClient.setQueryData(
        reservationQueryKeys.detail(
          reservation.id,
        ),
        reservation,
      )

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: reservationQueryKeys.all,
        }),
        queryClient.invalidateQueries({
          queryKey: ['admin', 'reservations'],
        }),
        queryClient.invalidateQueries({
          queryKey: ['admin', 'dashboard'],
        }),
      ])
    },
  })
}