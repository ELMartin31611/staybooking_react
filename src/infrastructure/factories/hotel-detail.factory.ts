import { HotelDetailUseCase } from '@/application/use-cases/hotel-detail.use-case'
import { AxiosHotelDetailRepository } from '@/infrastructure/adapters/axios-hotel-detail.repository'

const hotelDetailRepository =
  new AxiosHotelDetailRepository()

export const hotelDetailUseCase =
  new HotelDetailUseCase(hotelDetailRepository)