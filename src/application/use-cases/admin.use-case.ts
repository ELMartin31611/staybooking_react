import type {
  AdminListParams,
  SaveHotelAddressInput,
  SaveHotelMediaInput,
  SaveHotelInput,
  SaveRoomImageInput,
  SaveRoomInput,
  SaveRoomTypeInput,
  SaveServiceInput,
} from '@/domain/entities/admin.entity'
import type { AdminRepository } from '@/domain/ports/admin.repository'

export class AdminUseCase {
  private readonly repository: AdminRepository

  constructor(
    repository: AdminRepository,
  ) {
    this.repository = repository
  }

  getDashboard = () =>
    this.repository.getDashboard()

  getHotels = (
    params?: AdminListParams,
  ) =>
    this.repository.getHotels(params)

  getAllHotels = () =>
    this.repository.getAllHotels()

  createHotel = (
    input: SaveHotelInput,
  ) =>
    this.repository.createHotel(input)

  updateHotel = (
    id: number,
    input: Partial<SaveHotelInput>,
  ) =>
    this.repository.updateHotel(id, input)

  deleteHotel = (
    id: number,
  ) =>
    this.repository.deleteHotel(id)

  getHotelMedia = (hotelId: number) =>
    this.repository.getHotelMedia(hotelId)

  createHotelMedia = (
    input: SaveHotelMediaInput,
  ) =>
    this.repository.createHotelMedia(input)

  updateHotelMedia = (
    id: number,
    input: Partial<Omit<SaveHotelMediaInput, 'archivo'>>,
  ) =>
    this.repository.updateHotelMedia(id, input)

  deleteHotelMedia = (id: number) =>
    this.repository.deleteHotelMedia(id)

  getHotelAddresses = (
    params?: AdminListParams,
  ) =>
    this.repository.getHotelAddresses(params)

  createHotelAddress = (
    input: SaveHotelAddressInput,
  ) =>
    this.repository.createHotelAddress(input)

  updateHotelAddress = (
    id: number,
    input: Partial<SaveHotelAddressInput>,
  ) =>
    this.repository.updateHotelAddress(
      id,
      input,
    )

  deleteHotelAddress = (
    id: number,
  ) =>
    this.repository.deleteHotelAddress(id)

  getRoomTypes = (
    params?: AdminListParams,
  ) =>
    this.repository.getRoomTypes(params)

  getAllRoomTypes = () =>
    this.repository.getAllRoomTypes()

  createRoomType = (
    input: SaveRoomTypeInput,
  ) =>
    this.repository.createRoomType(input)

  updateRoomType = (
    id: number,
    input: Partial<SaveRoomTypeInput>,
  ) =>
    this.repository.updateRoomType(
      id,
      input,
    )

  deleteRoomType = (
    id: number,
  ) =>
    this.repository.deleteRoomType(id)

  getRooms = (
    params?: AdminListParams,
  ) =>
    this.repository.getRooms(params)

  createRoom = (
    input: SaveRoomInput,
  ) =>
    this.repository.createRoom(input)

  updateRoom = (
    id: number,
    input: Partial<SaveRoomInput>,
  ) =>
    this.repository.updateRoom(id, input)

  deleteRoom = (
    id: number,
  ) =>
    this.repository.deleteRoom(id)

  getRoomImages = (
    roomId: number,
  ) =>
    this.repository.getRoomImages(roomId)

  createRoomImage = (
    input: SaveRoomImageInput,
  ) =>
    this.repository.createRoomImage(input)

  deleteRoomImage = (
    id: number,
  ) =>
    this.repository.deleteRoomImage(id)

  getServices = (
    params?: AdminListParams,
  ) =>
    this.repository.getServices(params)

  createService = (
    input: SaveServiceInput,
  ) =>
    this.repository.createService(input)

  updateService = (
    id: number,
    input: Partial<SaveServiceInput>,
  ) =>
    this.repository.updateService(id, input)

  deleteService = (
    id: number,
  ) =>
    this.repository.deleteService(id)

  getReservations = (
    params?: AdminListParams,
  ) =>
    this.repository.getReservations(params)

  getReservation = (
    id: number,
  ) =>
    this.repository.getReservation(id)

  getPayments = (
    params?: AdminListParams,
  ) =>
    this.repository.getPayments(params)

  getInvoices = (
    params?: AdminListParams,
  ) =>
    this.repository.getInvoices(params)
}