import { CheckHotelsConnectionUseCase } from '@/application/use-cases/check-hotels-connection.use-case'
import { HotelCatalogUseCase } from '@/application/use-cases/hotel-catalog.use-case'
import { AxiosHotelCatalogRepository } from '@/infrastructure/adapters/axios-hotel-catalog.repository'

const hotelCatalogRepository =
  new AxiosHotelCatalogRepository()

export const checkHotelsConnectionUseCase =
  new CheckHotelsConnectionUseCase(
    hotelCatalogRepository,
  )

export const hotelCatalogUseCase =
  new HotelCatalogUseCase(
    hotelCatalogRepository,
  )
