import type {
  AdminDashboard,
  AdminHotel,
  AdminHotelAddress,
  AdminHotelMedia,
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
  SaveHotelMediaInput,
  SaveHotelInput,
  SaveRoomImageInput,
  SaveRoomInput,
  SaveRoomTypeInput,
  SaveServiceInput,
} from '@/domain/entities/admin.entity'

export interface AdminRepository {
  getDashboard(): Promise<AdminDashboard>

  getHotels(
    params?: AdminListParams,
  ): Promise<AdminPage<AdminHotel>>

  getAllHotels(): Promise<AdminHotel[]>

  createHotel(
    input: SaveHotelInput,
  ): Promise<AdminHotel>

  updateHotel(
    id: number,
    input: Partial<SaveHotelInput>,
  ): Promise<AdminHotel>

  deleteHotel(id: number): Promise<void>

  getHotelMedia(hotelId: number): Promise<AdminHotelMedia[]>

  createHotelMedia(
    input: SaveHotelMediaInput,
  ): Promise<AdminHotelMedia>

  updateHotelMedia(
    id: number,
    input: Partial<Omit<SaveHotelMediaInput, 'archivo'>>,
  ): Promise<AdminHotelMedia>

  deleteHotelMedia(id: number): Promise<void>

  getHotelAddresses(
    params?: AdminListParams,
  ): Promise<AdminPage<AdminHotelAddress>>

  createHotelAddress(
    input: SaveHotelAddressInput,
  ): Promise<AdminHotelAddress>

  updateHotelAddress(
    id: number,
    input: Partial<SaveHotelAddressInput>,
  ): Promise<AdminHotelAddress>

  deleteHotelAddress(id: number): Promise<void>

  getRoomTypes(
    params?: AdminListParams,
  ): Promise<AdminPage<RoomType>>

  getAllRoomTypes(): Promise<RoomType[]>

  createRoomType(
    input: SaveRoomTypeInput,
  ): Promise<RoomType>

  updateRoomType(
    id: number,
    input: Partial<SaveRoomTypeInput>,
  ): Promise<RoomType>

  deleteRoomType(id: number): Promise<void>

  getRooms(
    params?: AdminListParams,
  ): Promise<AdminPage<Room>>

  createRoom(
    input: SaveRoomInput,
  ): Promise<Room>

  updateRoom(
    id: number,
    input: Partial<SaveRoomInput>,
  ): Promise<Room>

  deleteRoom(id: number): Promise<void>

  getRoomImages(
    roomId: number,
  ): Promise<AdminRoomImage[]>

  createRoomImage(
    input: SaveRoomImageInput,
  ): Promise<AdminRoomImage>

  deleteRoomImage(id: number): Promise<void>

  getServices(
    params?: AdminListParams,
  ): Promise<AdminPage<AdminService>>

  createService(
    input: SaveServiceInput,
  ): Promise<AdminService>

  updateService(
    id: number,
    input: Partial<SaveServiceInput>,
  ): Promise<AdminService>

  deleteService(id: number): Promise<void>

  getReservations(
    params?: AdminListParams,
  ): Promise<AdminPage<Reservation>>

  getReservation(
    id: number,
  ): Promise<Reservation>

  getPayments(
    params?: AdminListParams,
  ): Promise<AdminPage<Payment>>

  getInvoices(
    params?: AdminListParams,
  ): Promise<AdminPage<Invoice>>
}