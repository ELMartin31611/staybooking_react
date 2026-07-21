import type {
  AdminDashboard,
  AdminHotel,
  AdminHotelAddress,
  AdminListParams,
  AdminPage,
  AdminRoomImage,
  AdminService,
  Invoice,
  Payment,
  Reservation,
  Room,
  RoomType,
  SaveHotelAddressInput,
  SaveHotelInput,
  SaveRoomImageInput,
  SaveRoomInput,
  SaveRoomTypeInput,
  SaveServiceInput,
} from '@/domain/entities/admin.entity'
import type { AdminRepository } from '@/domain/ports/admin.repository'
import { apiConfig } from '@/infrastructure/config/api.config'
import { apiClient } from '@/infrastructure/http/axios-client'

type CollectionResponse<T> =
  | AdminPage<T>
  | T[]

function normalizePage<T>(
  data: CollectionResponse<T>,
): AdminPage<T> {
  if (Array.isArray(data)) {
    return {
      count: data.length,
      next: null,
      previous: null,
      results: data,
    }
  }

  return data
}

function requestParams(
  params?: AdminListParams,
) {
  if (!params) {
    return undefined
  }

  const {
    pageSize,
    ...rest
  } = params

  return {
    ...rest,
    page_size: pageSize,
  }
}

function appendFormValue(
  formData: FormData,
  key: string,
  value:
    | string
    | number
    | boolean
    | File
    | null
    | undefined,
) {
  if (
    value === null
    || value === undefined
  ) {
    return
  }

  if (value instanceof File) {
    formData.append(key, value)
    return
  }

  formData.append(
    key,
    String(value),
  )
}

function hotelFormData(
  input: Partial<SaveHotelInput>,
): FormData {
  const formData = new FormData()

  Object.entries(input).forEach(
    ([key, value]) => {
      appendFormValue(
        formData,
        key,
        value as
          | string
          | number
          | boolean
          | File
          | null,
      )
    },
  )

  return formData
}

async function getPage<T>(
  endpoint: string,
  params?: AdminListParams,
): Promise<AdminPage<T>> {
  const { data } =
    await apiClient.get<CollectionResponse<T>>(
      endpoint,
      {
        params: requestParams(params),
      },
    )

  return normalizePage(data)
}

export class AxiosAdminRepository
  implements AdminRepository {
  async getDashboard(): Promise<AdminDashboard> {
    const [
      hotels,
      roomTypes,
      rooms,
      reservations,
      pendingReservations,
      approvedPayments,
      invoices,
      recentReservations,
    ] = await Promise.all([
      getPage<AdminHotel>(
        apiConfig.endpoints.catalog.hotels,
        {
          pageSize: 1,
        },
      ),

      getPage<RoomType>(
        apiConfig.endpoints.catalog.roomTypes,
        {
          pageSize: 1,
        },
      ),

      getPage<Room>(
        apiConfig.endpoints.catalog.rooms,
        {
          pageSize: 1,
        },
      ),

      getPage<Reservation>(
        apiConfig.endpoints.reservations
          .reservations,
        {
          pageSize: 1,
        },
      ),

      getPage<Reservation>(
        apiConfig.endpoints.reservations
          .reservations,
        {
          pageSize: 1,
          estado: 'pendiente',
        },
      ),

      getPage<Payment>(
        apiConfig.endpoints.billing.payments,
        {
          pageSize: 1,
          estado: 'aprobado',
        },
      ),

      getPage<Invoice>(
        apiConfig.endpoints.billing.invoices,
        {
          pageSize: 1,
        },
      ),

      getPage<Reservation>(
        apiConfig.endpoints.reservations
          .reservations,
        {
          pageSize: 5,
          ordering: '-created_at',
        },
      ),
    ])

    return {
      hotels: hotels.count,
      roomTypes: roomTypes.count,
      rooms: rooms.count,
      reservations: reservations.count,
      pendingReservations:
        pendingReservations.count,
      approvedPayments:
        approvedPayments.count,
      invoices: invoices.count,
      recentReservations:
        recentReservations.results,
    }
  }

  getHotels(
    params?: AdminListParams,
  ) {
    return getPage<AdminHotel>(
      apiConfig.endpoints.catalog.hotels,
      params,
    )
  }

  async getAllHotels(): Promise<AdminHotel[]> {
    const page = await this.getHotels({
      pageSize: 100,
      ordering: 'nombre',
    })

    return page.results
  }

  async createHotel(
    input: SaveHotelInput,
  ): Promise<AdminHotel> {
    const { data } =
      await apiClient.post<AdminHotel>(
        apiConfig.endpoints.catalog.hotels,
        hotelFormData(input),
      )

    return data
  }

  async updateHotel(
    id: number,
    input: Partial<SaveHotelInput>,
  ): Promise<AdminHotel> {
    const { data } =
      await apiClient.patch<AdminHotel>(
        `${apiConfig.endpoints.catalog.hotels}${id}/`,
        hotelFormData(input),
      )

    return data
  }

  async deleteHotel(
    id: number,
  ): Promise<void> {
    await apiClient.delete(
      `${apiConfig.endpoints.catalog.hotels}${id}/`,
    )
  }

  getHotelAddresses(
    params?: AdminListParams,
  ) {
    return getPage<AdminHotelAddress>(
      apiConfig.endpoints.catalog
        .hotelAddresses,
      params,
    )
  }

  async createHotelAddress(
    input: SaveHotelAddressInput,
  ): Promise<AdminHotelAddress> {
    const { data } =
      await apiClient.post<AdminHotelAddress>(
        apiConfig.endpoints.catalog
          .hotelAddresses,
        input,
      )

    return data
  }

  async updateHotelAddress(
    id: number,
    input: Partial<SaveHotelAddressInput>,
  ): Promise<AdminHotelAddress> {
    const { data } =
      await apiClient.patch<AdminHotelAddress>(
        `${apiConfig.endpoints.catalog.hotelAddresses}${id}/`,
        input,
      )

    return data
  }

  async deleteHotelAddress(
    id: number,
  ): Promise<void> {
    await apiClient.delete(
      `${apiConfig.endpoints.catalog.hotelAddresses}${id}/`,
    )
  }

  getRoomTypes(
    params?: AdminListParams,
  ) {
    return getPage<RoomType>(
      apiConfig.endpoints.catalog.roomTypes,
      params,
    )
  }

  async getAllRoomTypes(): Promise<RoomType[]> {
    const page = await this.getRoomTypes({
      pageSize: 100,
      ordering: 'nombre',
    })

    return page.results
  }

  async createRoomType(
    input: SaveRoomTypeInput,
  ): Promise<RoomType> {
    const { data } =
      await apiClient.post<RoomType>(
        apiConfig.endpoints.catalog.roomTypes,
        input,
      )

    return data
  }

  async updateRoomType(
    id: number,
    input: Partial<SaveRoomTypeInput>,
  ): Promise<RoomType> {
    const { data } =
      await apiClient.patch<RoomType>(
        `${apiConfig.endpoints.catalog.roomTypes}${id}/`,
        input,
      )

    return data
  }

  async deleteRoomType(
    id: number,
  ): Promise<void> {
    await apiClient.delete(
      `${apiConfig.endpoints.catalog.roomTypes}${id}/`,
    )
  }

  getRooms(
    params?: AdminListParams,
  ) {
    return getPage<Room>(
      apiConfig.endpoints.catalog.rooms,
      params,
    )
  }

  async createRoom(
    input: SaveRoomInput,
  ): Promise<Room> {
    const { data } =
      await apiClient.post<Room>(
        apiConfig.endpoints.catalog.rooms,
        input,
      )

    return data
  }

  async updateRoom(
    id: number,
    input: Partial<SaveRoomInput>,
  ): Promise<Room> {
    const { data } =
      await apiClient.patch<Room>(
        `${apiConfig.endpoints.catalog.rooms}${id}/`,
        input,
      )

    return data
  }

  async deleteRoom(
    id: number,
  ): Promise<void> {
    await apiClient.delete(
      `${apiConfig.endpoints.catalog.rooms}${id}/`,
    )
  }

  async getRoomImages(
    roomId: number,
  ): Promise<AdminRoomImage[]> {
    const page =
      await getPage<AdminRoomImage>(
        apiConfig.endpoints.catalog.images,
        {
          pageSize: 100,
          habitacion: roomId,
          ordering: 'orden',
        },
      )

    return page.results
  }

  async createRoomImage(
    input: SaveRoomImageInput,
  ): Promise<AdminRoomImage> {
    const formData = new FormData()

    appendFormValue(
      formData,
      'habitacion',
      input.habitacion,
    )

    appendFormValue(
      formData,
      'imagen',
      input.imagen,
    )

    appendFormValue(
      formData,
      'titulo',
      input.titulo,
    )

    appendFormValue(
      formData,
      'descripcion',
      input.descripcion,
    )

    appendFormValue(
      formData,
      'orden',
      input.orden,
    )

    appendFormValue(
      formData,
      'es_principal',
      input.es_principal,
    )

    const { data } =
      await apiClient.post<AdminRoomImage>(
        apiConfig.endpoints.catalog.images,
        formData,
      )

    return data
  }

  async deleteRoomImage(
    id: number,
  ): Promise<void> {
    await apiClient.delete(
      `${apiConfig.endpoints.catalog.images}${id}/`,
    )
  }

  getServices(
    params?: AdminListParams,
  ) {
    return getPage<AdminService>(
      apiConfig.endpoints.catalog.services,
      params,
    )
  }

  async createService(
    input: SaveServiceInput,
  ): Promise<AdminService> {
    const { data } =
      await apiClient.post<AdminService>(
        apiConfig.endpoints.catalog.services,
        input,
      )

    return data
  }

  async updateService(
    id: number,
    input: Partial<SaveServiceInput>,
  ): Promise<AdminService> {
    const { data } =
      await apiClient.patch<AdminService>(
        `${apiConfig.endpoints.catalog.services}${id}/`,
        input,
      )

    return data
  }

  async deleteService(
    id: number,
  ): Promise<void> {
    await apiClient.delete(
      `${apiConfig.endpoints.catalog.services}${id}/`,
    )
  }

  getReservations(
    params?: AdminListParams,
  ) {
    return getPage<Reservation>(
      apiConfig.endpoints.reservations
        .reservations,
      params,
    )
  }

  async getReservation(
    id: number,
  ): Promise<Reservation> {
    const { data } =
      await apiClient.get<Reservation>(
        `${apiConfig.endpoints.reservations.reservations}${id}/`,
      )

    return data
  }

  getPayments(
    params?: AdminListParams,
  ) {
    return getPage<Payment>(
      apiConfig.endpoints.billing.payments,
      params,
    )
  }

  getInvoices(
    params?: AdminListParams,
  ) {
    return getPage<Invoice>(
      apiConfig.endpoints.billing.invoices,
      params,
    )
  }
}