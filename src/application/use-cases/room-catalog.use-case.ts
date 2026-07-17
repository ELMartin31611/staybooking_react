import type { RoomCatalogRepository } from '@/domain/ports/room-catalog.repository'

export class RoomCatalogUseCase {
  private readonly repository: RoomCatalogRepository

  constructor(repository: RoomCatalogRepository) {
    this.repository = repository
  }

  getRooms() {
    return this.repository.getRooms()
  }

  getRoomImages() {
    return this.repository.getRoomImages()
  }

  getBeds() {
    return this.repository.getBeds()
  }

  getRoomTypeBeds() {
    return this.repository.getRoomTypeBeds()
  }

  getServices() {
    return this.repository.getServices()
  }

  getRoomTypeServices() {
    return this.repository.getRoomTypeServices()
  }
}