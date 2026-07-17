import { CheckHotelsConnectionUseCase } from '@/application/use-cases/check-hotels-connection.use-case'
import { AxiosHotelCatalogRepository } from '@/infrastructure/adapters/axios-hotel-catalog.repository'

const hotelCatalogRepository =
  new AxiosHotelCatalogRepository()

export const checkHotelsConnectionUseCase =
  new CheckHotelsConnectionUseCase(
    hotelCatalogRepository,
  )