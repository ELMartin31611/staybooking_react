import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'

import type {
  AdminListParams,
  SaveHotelAddressInput,
  SaveHotelInput,
  SaveRoomImageInput,
  SaveRoomInput,
  SaveRoomTypeInput,
  SaveServiceInput,
} from '@/domain/entities/admin.entity'
import { adminUseCase } from '@/infrastructure/factories/admin.factory'

export const adminKeys = {
  root: ['admin'] as const,
  dashboard: ['admin', 'dashboard'] as const,
  hotels: ['admin', 'hotels'] as const,
  addresses: ['admin', 'hotel-addresses'] as const,
  roomTypes: ['admin', 'room-types'] as const,
  rooms: ['admin', 'rooms'] as const,
  images: ['admin', 'room-images'] as const,
  services: ['admin', 'services'] as const,
  reservations: ['admin', 'reservations'] as const,
  payments: ['admin', 'payments'] as const,
  invoices: ['admin', 'invoices'] as const,
}

export function useAdminDashboardQuery() {
  return useQuery({
    queryKey: adminKeys.dashboard,
    queryFn: adminUseCase.getDashboard,
    staleTime: 30_000,
  })
}

export function useAdminHotelsQuery(
  params: AdminListParams,
) {
  return useQuery({
    queryKey: [
      ...adminKeys.hotels,
      params,
    ],
    queryFn: () =>
      adminUseCase.getHotels(params),
  })
}

export function useAllHotelsQuery() {
  return useQuery({
    queryKey: [
      ...adminKeys.hotels,
      'all',
    ],
    queryFn: adminUseCase.getAllHotels,
    staleTime: 60_000,
  })
}

export function useCreateHotelMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (
      input: SaveHotelInput,
    ) =>
      adminUseCase.createHotel(input),

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: adminKeys.hotels,
        }),

        queryClient.invalidateQueries({
          queryKey: adminKeys.dashboard,
        }),
      ])
    },
  })
}

export function useUpdateHotelMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: number
      input: Partial<SaveHotelInput>
    }) =>
      adminUseCase.updateHotel(
        id,
        input,
      ),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: adminKeys.hotels,
      })
    },
  })
}

export function useDeleteHotelMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: adminUseCase.deleteHotel,

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: adminKeys.hotels,
        }),

        queryClient.invalidateQueries({
          queryKey: adminKeys.dashboard,
        }),
      ])
    },
  })
}

export function useAdminHotelAddressesQuery(
  params: AdminListParams,
) {
  return useQuery({
    queryKey: [
      ...adminKeys.addresses,
      params,
    ],

    queryFn: () =>
      adminUseCase.getHotelAddresses(
        params,
      ),
  })
}

export function useCreateHotelAddressMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (
      input: SaveHotelAddressInput,
    ) =>
      adminUseCase.createHotelAddress(
        input,
      ),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: adminKeys.addresses,
      })
    },
  })
}

export function useUpdateHotelAddressMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: number
      input: Partial<SaveHotelAddressInput>
    }) =>
      adminUseCase.updateHotelAddress(
        id,
        input,
      ),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: adminKeys.addresses,
      })
    },
  })
}

export function useDeleteHotelAddressMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn:
      adminUseCase.deleteHotelAddress,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: adminKeys.addresses,
      })
    },
  })
}

export function useAdminRoomTypesQuery(
  params: AdminListParams,
) {
  return useQuery({
    queryKey: [
      ...adminKeys.roomTypes,
      params,
    ],

    queryFn: () =>
      adminUseCase.getRoomTypes(params),
  })
}

export function useAllRoomTypesQuery() {
  return useQuery({
    queryKey: [
      ...adminKeys.roomTypes,
      'all',
    ],

    queryFn:
      adminUseCase.getAllRoomTypes,

    staleTime: 60_000,
  })
}

export function useCreateRoomTypeMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (
      input: SaveRoomTypeInput,
    ) =>
      adminUseCase.createRoomType(
        input,
      ),

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: adminKeys.roomTypes,
        }),

        queryClient.invalidateQueries({
          queryKey: adminKeys.dashboard,
        }),
      ])
    },
  })
}

export function useUpdateRoomTypeMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: number
      input: Partial<SaveRoomTypeInput>
    }) =>
      adminUseCase.updateRoomType(
        id,
        input,
      ),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: adminKeys.roomTypes,
      })
    },
  })
}

export function useDeleteRoomTypeMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn:
      adminUseCase.deleteRoomType,

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: adminKeys.roomTypes,
        }),

        queryClient.invalidateQueries({
          queryKey: adminKeys.dashboard,
        }),
      ])
    },
  })
}

export function useAdminRoomsQuery(
  params: AdminListParams,
) {
  return useQuery({
    queryKey: [
      ...adminKeys.rooms,
      params,
    ],

    queryFn: () =>
      adminUseCase.getRooms(params),
  })
}

export function useCreateRoomMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (
      input: SaveRoomInput,
    ) =>
      adminUseCase.createRoom(input),

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: adminKeys.rooms,
        }),

        queryClient.invalidateQueries({
          queryKey: adminKeys.dashboard,
        }),
      ])
    },
  })
}

export function useUpdateRoomMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: number
      input: Partial<SaveRoomInput>
    }) =>
      adminUseCase.updateRoom(
        id,
        input,
      ),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: adminKeys.rooms,
      })
    },
  })
}

export function useDeleteRoomMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: adminUseCase.deleteRoom,

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: adminKeys.rooms,
        }),

        queryClient.invalidateQueries({
          queryKey: adminKeys.dashboard,
        }),
      ])
    },
  })
}

export function useRoomImagesQuery(
  roomId: number | null,
) {
  return useQuery({
    queryKey: [
      ...adminKeys.images,
      roomId,
    ],

    queryFn: () =>
      adminUseCase.getRoomImages(
        roomId as number,
      ),

    enabled:
      roomId !== null
      && roomId > 0,
  })
}

export function useCreateRoomImageMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (
      input: SaveRoomImageInput,
    ) =>
      adminUseCase.createRoomImage(
        input,
      ),

    onSuccess: async (
      _,
      input,
    ) => {
      await queryClient.invalidateQueries({
        queryKey: [
          ...adminKeys.images,
          input.habitacion,
        ],
      })
    },
  })
}

export function useDeleteRoomImageMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
    }: {
      id: number
      roomId: number
    }) =>
      adminUseCase.deleteRoomImage(id),

    onSuccess: async (
      _,
      variables,
    ) => {
      await queryClient.invalidateQueries({
        queryKey: [
          ...adminKeys.images,
          variables.roomId,
        ],
      })
    },
  })
}

export function useAdminServicesQuery(
  params: AdminListParams,
) {
  return useQuery({
    queryKey: [
      ...adminKeys.services,
      params,
    ],

    queryFn: () =>
      adminUseCase.getServices(params),
  })
}

export function useCreateServiceMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (
      input: SaveServiceInput,
    ) =>
      adminUseCase.createService(input),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: adminKeys.services,
      })
    },
  })
}

export function useUpdateServiceMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: number
      input: Partial<SaveServiceInput>
    }) =>
      adminUseCase.updateService(
        id,
        input,
      ),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: adminKeys.services,
      })
    },
  })
}

export function useDeleteServiceMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn:
      adminUseCase.deleteService,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: adminKeys.services,
      })
    },
  })
}

export function useAdminReservationsQuery(
  params: AdminListParams,
) {
  return useQuery({
    queryKey: [
      ...adminKeys.reservations,
      params,
    ],

    queryFn: () =>
      adminUseCase.getReservations(
        params,
      ),
  })
}

export function useAdminReservationQuery(
  id: number | null,
) {
  return useQuery({
    queryKey: [
      ...adminKeys.reservations,
      'detail',
      id,
    ],

    queryFn: () =>
      adminUseCase.getReservation(
        id as number,
      ),

    enabled:
      id !== null
      && id > 0,
  })
}

export function useAdminPaymentsQuery(
  params: AdminListParams,
) {
  return useQuery({
    queryKey: [
      ...adminKeys.payments,
      params,
    ],

    queryFn: () =>
      adminUseCase.getPayments(params),
  })
}

export function useAdminInvoicesQuery(
  params: AdminListParams,
) {
  return useQuery({
    queryKey: [
      ...adminKeys.invoices,
      params,
    ],

    queryFn: () =>
      adminUseCase.getInvoices(params),
  })
}