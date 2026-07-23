import type {
  RateReference,
  SaveRoomRateInput,
} from '@/domain/entities/rate-reference.entity'
import type { RoomType } from '@/domain/entities/room-type.entity'
import type {
  SaveSeasonInput,
  Season,
} from '@/domain/entities/season.entity'

export interface RateManagementRepository {
  getRoomTypes(): Promise<RoomType[]>

  getSeasons(): Promise<Season[]>

  createSeason(
    data: SaveSeasonInput,
  ): Promise<Season>

  updateSeason(
    seasonId: number,
    data: Partial<SaveSeasonInput>,
  ): Promise<Season>

  deleteSeason(
    seasonId: number,
  ): Promise<void>

  getRates(): Promise<RateReference[]>

  createRate(
    data: SaveRoomRateInput,
  ): Promise<RateReference>

  updateRate(
    rateId: number,
    data: Partial<SaveRoomRateInput>,
  ): Promise<RateReference>

  deleteRate(
    rateId: number,
  ): Promise<void>

  getCurrentRate(
    roomTypeId: number,
    date: string,
  ): Promise<RateReference>
}