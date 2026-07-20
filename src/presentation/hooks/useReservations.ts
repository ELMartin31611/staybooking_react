import { useQuery } from '@tanstack/react-query'

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