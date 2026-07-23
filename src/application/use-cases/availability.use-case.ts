import type { AvailabilityParams } from '@/application/dtos/availability.dto'
import type { AvailabilityRepository } from '@/domain/ports/availability.repository'

function getLocalDate(): string {
  const today = new Date()
  const timezoneOffset = today.getTimezoneOffset()

  return new Date(
    today.getTime() - timezoneOffset * 60_000,
  )
    .toISOString()
    .slice(0, 10)
}

function calculateNights(
  checkIn: string,
  checkOut: string,
): number {
  const start = new Date(`${checkIn}T12:00:00`)
  const end = new Date(`${checkOut}T12:00:00`)

  if (
    Number.isNaN(start.getTime())
    || Number.isNaN(end.getTime())
  ) {
    return 0
  }

  return Math.round(
    (end.getTime() - start.getTime()) / 86_400_000,
  )
}

export class AvailabilityUseCase {
  private readonly repository: AvailabilityRepository

  constructor(repository: AvailabilityRepository) {
    this.repository = repository
  }

  getAvailableRooms(params: AvailabilityParams) {
    if (
      !Number.isInteger(params.hotel)
      || params.hotel <= 0
    ) {
      throw new Error(
        'El hotel seleccionado no es válido.',
      )
    }

    if (
      !params.fecha_entrada
      || !params.fecha_salida
    ) {
      throw new Error(
        'Selecciona las fechas de entrada y salida.',
      )
    }

    if (params.fecha_entrada < getLocalDate()) {
      throw new Error(
        'La fecha de entrada no puede ser pasada.',
      )
    }

    if (
      params.fecha_salida
      <= params.fecha_entrada
    ) {
      throw new Error(
        'La fecha de salida debe ser posterior a la entrada.',
      )
    }

    const nights = calculateNights(
      params.fecha_entrada,
      params.fecha_salida,
    )

    if (nights <= 0) {
      throw new Error(
        'Las fechas seleccionadas no son válidas.',
      )
    }

    if (nights > 30) {
      throw new Error(
        'La estancia máxima permitida es de 30 noches.',
      )
    }

    if (
      params.cantidad_adultos !== undefined
      && (
        !Number.isInteger(params.cantidad_adultos)
        || params.cantidad_adultos < 1
      )
    ) {
      throw new Error(
        'La cantidad de adultos no es válida.',
      )
    }

    if (
      params.cantidad_ninos !== undefined
      && (
        !Number.isInteger(params.cantidad_ninos)
        || params.cantidad_ninos < 0
      )
    ) {
      throw new Error(
        'La cantidad de niños no es válida.',
      )
    }

    return this.repository.getAvailableRooms(params)
  }

  getRoomCalendar(
    roomId: number,
    from: string,
    to: string,
  ) {
    if (!Number.isInteger(roomId) || roomId < 1) {
      throw new Error('La habitación seleccionada no es válida.')
    }

    if (!from || !to || to <= from) {
      throw new Error('Selecciona un rango de fechas válido.')
    }

    return this.repository.getRoomCalendar(roomId, from, to)
  }
}