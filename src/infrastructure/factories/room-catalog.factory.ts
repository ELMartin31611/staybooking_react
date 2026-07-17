import { RoomCatalogUseCase } from '@/application/use-cases/room-catalog.use-case'
import { AxiosRoomCatalogRepository } from '@/infrastructure/adapters/axios-room-catalog.repository'

export function createRoomCatalogUseCase(): RoomCatalogUseCase {
  const repository = new AxiosRoomCatalogRepository()

  return new RoomCatalogUseCase(repository)
}