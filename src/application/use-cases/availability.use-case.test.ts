import { describe, expect, it, vi } from 'vitest'

import { AvailabilityUseCase } from '@/application/use-cases/availability.use-case'
import type { AvailabilityRepository } from '@/domain/ports/availability.repository'

function createRepository(): AvailabilityRepository {
  return {
    getAvailableRooms: vi.fn().mockResolvedValue([]),
    getRoomCalendar: vi.fn().mockResolvedValue({
      habitacion: {
        id: 4,
        numero: '401',
        hotel_id: 2,
        hotel_nombre: 'Hotel prueba',
        reservable: true,
      },
      desde: '2026-08-01',
      hasta: '2026-08-15',
      dias: [],
    }),
  }
}

describe('AvailabilityUseCase', () => {
  it('rejects an invalid calendar range before calling the API', () => {
    const repository = createRepository()
    const useCase = new AvailabilityUseCase(repository)

    expect(() => useCase.getRoomCalendar(4, '2026-08-15', '2026-08-15'))
      .toThrow('Selecciona un rango de fechas válido.')
    expect(repository.getRoomCalendar).not.toHaveBeenCalled()
  })

  it('requests the backend calendar for a valid room range', async () => {
    const repository = createRepository()
    const useCase = new AvailabilityUseCase(repository)

    await useCase.getRoomCalendar(4, '2026-08-01', '2026-08-15')

    expect(repository.getRoomCalendar).toHaveBeenCalledWith(
      4,
      '2026-08-01',
      '2026-08-15',
    )
  })
})
