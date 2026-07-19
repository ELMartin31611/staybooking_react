import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'

import type {
  SaveRoomRateInput,
} from '@/domain/entities/rate-reference.entity'
import type {
  SaveSeasonInput,
} from '@/domain/entities/season.entity'
import { rateManagementUseCase } from '@/infrastructure/factories/rate-management.factory'

const rateManagementKeys = {
  root: ['rate-management'] as const,

  roomTypes: [
    'rate-management',
    'room-types',
  ] as const,

  seasons: [
    'rate-management',
    'seasons',
  ] as const,

  rates: [
    'rate-management',
    'rates',
  ] as const,
}

interface UpdateSeasonVariables {
  seasonId: number
  data: Partial<SaveSeasonInput>
}

interface UpdateRateVariables {
  rateId: number
  data: Partial<SaveRoomRateInput>
}

export function useRoomTypesQuery() {
  return useQuery({
    queryKey: rateManagementKeys.roomTypes,
    queryFn: () =>
      rateManagementUseCase.getRoomTypes(),
    staleTime: 5 * 60 * 1000,
  })
}

export function useSeasonsQuery() {
  return useQuery({
    queryKey: rateManagementKeys.seasons,
    queryFn: () =>
      rateManagementUseCase.getSeasons(),
  })
}

export function useRatesQuery() {
  return useQuery({
    queryKey: rateManagementKeys.rates,
    queryFn: () =>
      rateManagementUseCase.getRates(),
  })
}

export function useCreateSeasonMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (
      data: SaveSeasonInput,
    ) =>
      rateManagementUseCase.createSeason(
        data,
      ),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: rateManagementKeys.seasons,
      })
    },
  })
}

export function useUpdateSeasonMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      seasonId,
      data,
    }: UpdateSeasonVariables) =>
      rateManagementUseCase.updateSeason(
        seasonId,
        data,
      ),

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: rateManagementKeys.seasons,
        }),
        queryClient.invalidateQueries({
          queryKey: rateManagementKeys.rates,
        }),
      ])
    },
  })
}

export function useDeleteSeasonMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (
      seasonId: number,
    ) =>
      rateManagementUseCase.deleteSeason(
        seasonId,
      ),

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: rateManagementKeys.seasons,
        }),
        queryClient.invalidateQueries({
          queryKey: rateManagementKeys.rates,
        }),
      ])
    },
  })
}

export function useCreateRateMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (
      data: SaveRoomRateInput,
    ) =>
      rateManagementUseCase.createRate(
        data,
      ),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: rateManagementKeys.rates,
      })
    },
  })
}

export function useUpdateRateMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      rateId,
      data,
    }: UpdateRateVariables) =>
      rateManagementUseCase.updateRate(
        rateId,
        data,
      ),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: rateManagementKeys.rates,
      })
    },
  })
}

export function useDeleteRateMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (
      rateId: number,
    ) =>
      rateManagementUseCase.deleteRate(
        rateId,
      ),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: rateManagementKeys.rates,
      })
    },
  })
}