import type { RateReference } from '@/domain/entities/rate-reference.entity'

export interface RateReferenceRepository {
  getRates(): Promise<RateReference[]>

  getCurrentRate(
    roomTypeId: number,
    date: string,
  ): Promise<RateReference>
}