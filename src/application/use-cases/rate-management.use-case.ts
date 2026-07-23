import type {
  RateReference,
  SaveRoomRateInput,
} from '@/domain/entities/rate-reference.entity'
import type { RoomType } from '@/domain/entities/room-type.entity'
import type {
  SaveSeasonInput,
  Season,
} from '@/domain/entities/season.entity'
import type { RateManagementRepository } from '@/domain/ports/rate-management.repository'

function validatePositiveId(
  value: number,
  label: string,
): void {
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`${label} no es válido.`)
  }
}

function validateDate(
  value: string | undefined,
  label: string,
  required: boolean,
): void {
  if (value === undefined) {
    if (required) {
      throw new Error(`${label} es obligatoria.`)
    }

    return
  }

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(
    value,
  )

  if (!match) {
    throw new Error(
      `${label} debe tener el formato YYYY-MM-DD.`,
    )
  }

  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])

  const date = new Date(
    Date.UTC(
      year,
      month - 1,
      day,
    ),
  )

  const isValid =
    date.getUTCFullYear() === year
    && date.getUTCMonth() === month - 1
    && date.getUTCDate() === day

  if (!isValid) {
    throw new Error(`${label} no es válida.`)
  }
}

function validateMoney(
  value: string | undefined,
  label: string,
  required: boolean,
): void {
  if (
    value === undefined
    || value.trim() === ''
  ) {
    if (required) {
      throw new Error(`${label} es obligatorio.`)
    }

    return
  }

  const amount = Number(value)

  if (!Number.isFinite(amount) || amount < 0) {
    throw new Error(
      `${label} debe ser un número mayor o igual a cero.`,
    )
  }
}

function validateSeason(
  data: Partial<SaveSeasonInput>,
  required: boolean,
): void {
  if (
    required
    && (
      data.nombre === undefined
      || data.nombre.trim() === ''
    )
  ) {
    throw new Error(
      'El nombre de la temporada es obligatorio.',
    )
  }

  if (
    data.nombre !== undefined
    && data.nombre.trim() === ''
  ) {
    throw new Error(
      'El nombre de la temporada no puede estar vacío.',
    )
  }

  validateDate(
    data.fecha_inicio,
    'La fecha de inicio',
    required,
  )
  validateDate(
    data.fecha_fin,
    'La fecha de finalización',
    required,
  )
  validateMoney(
    data.porcentaje_incremento,
    'El porcentaje de incremento',
    required,
  )

  if (
    data.fecha_inicio !== undefined
    && data.fecha_fin !== undefined
    && data.fecha_fin <= data.fecha_inicio
  ) {
    throw new Error(
      'La fecha de finalización debe ser mayor que la fecha de inicio.',
    )
  }
}

function validateRate(
  data: Partial<SaveRoomRateInput>,
  required: boolean,
): void {
  if (
    required
    && data.tipo_habitacion === undefined
  ) {
    throw new Error(
      'Debes seleccionar un tipo de habitación.',
    )
  }

  if (data.tipo_habitacion !== undefined) {
    validatePositiveId(
      data.tipo_habitacion,
      'El tipo de habitación',
    )
  }

  if (
    required
    && data.temporada === undefined
  ) {
    throw new Error(
      'Debes seleccionar una temporada.',
    )
  }

  if (data.temporada !== undefined) {
    validatePositiveId(
      data.temporada,
      'La temporada',
    )
  }

  validateMoney(
    data.precio_noche,
    'El precio por noche',
    required,
  )
  validateMoney(
    data.precio_fin_semana ?? undefined,
    'El precio de fin de semana',
    false,
  )
  validateMoney(
    data.precio_persona_extra,
    'El precio por persona extra',
    required,
  )

  if (
    required
    && (
      data.moneda === undefined
      || data.moneda.trim() === ''
    )
  ) {
    throw new Error(
      'La moneda es obligatoria.',
    )
  }

  if (
    data.moneda !== undefined
    && (
      data.moneda.trim().length < 3
      || data.moneda.trim().length > 10
    )
  ) {
    throw new Error(
      'La moneda debe tener entre 3 y 10 caracteres.',
    )
  }
}

export class RateManagementUseCase {
  private readonly repository: RateManagementRepository

  constructor(
    repository: RateManagementRepository,
  ) {
    this.repository = repository
  }

  getRoomTypes(): Promise<RoomType[]> {
    return this.repository.getRoomTypes()
  }

  getSeasons(): Promise<Season[]> {
    return this.repository.getSeasons()
  }

  createSeason(
    data: SaveSeasonInput,
  ): Promise<Season> {
    const normalized: SaveSeasonInput = {
      ...data,
      nombre: data.nombre.trim(),
      porcentaje_incremento:
        data.porcentaje_incremento.trim(),
      descripcion:
        data.descripcion?.trim() || null,
    }

    validateSeason(
      normalized,
      true,
    )

    return this.repository.createSeason(
      normalized,
    )
  }

  updateSeason(
    seasonId: number,
    data: Partial<SaveSeasonInput>,
  ): Promise<Season> {
    validatePositiveId(
      seasonId,
      'La temporada',
    )

    if (Object.keys(data).length === 0) {
      throw new Error(
        'No existen cambios para guardar.',
      )
    }

    const normalized: Partial<SaveSeasonInput> = {
      ...data,
    }

    if (data.nombre !== undefined) {
      normalized.nombre = data.nombre.trim()
    }

    if (
      data.porcentaje_incremento !== undefined
    ) {
      normalized.porcentaje_incremento =
        data.porcentaje_incremento.trim()
    }

    if (data.descripcion !== undefined) {
      normalized.descripcion =
        data.descripcion?.trim() || null
    }

    validateSeason(
      normalized,
      false,
    )

    return this.repository.updateSeason(
      seasonId,
      normalized,
    )
  }

  deleteSeason(
    seasonId: number,
  ): Promise<void> {
    validatePositiveId(
      seasonId,
      'La temporada',
    )

    return this.repository.deleteSeason(
      seasonId,
    )
  }

  getRates(): Promise<RateReference[]> {
    return this.repository.getRates()
  }

  createRate(
    data: SaveRoomRateInput,
  ): Promise<RateReference> {
    const normalized: SaveRoomRateInput = {
      ...data,
      precio_noche:
        data.precio_noche.trim(),
      precio_fin_semana:
        data.precio_fin_semana?.trim() || null,
      precio_persona_extra:
        data.precio_persona_extra.trim(),
      moneda:
        data.moneda.trim().toUpperCase(),
    }

    validateRate(
      normalized,
      true,
    )

    return this.repository.createRate(
      normalized,
    )
  }

  updateRate(
    rateId: number,
    data: Partial<SaveRoomRateInput>,
  ): Promise<RateReference> {
    validatePositiveId(
      rateId,
      'La tarifa',
    )

    if (Object.keys(data).length === 0) {
      throw new Error(
        'No existen cambios para guardar.',
      )
    }

    const normalized: Partial<SaveRoomRateInput> = {
      ...data,
    }

    if (data.precio_noche !== undefined) {
      normalized.precio_noche =
        data.precio_noche.trim()
    }

    if (
      data.precio_fin_semana !== undefined
    ) {
      normalized.precio_fin_semana =
        data.precio_fin_semana?.trim() || null
    }

    if (
      data.precio_persona_extra !== undefined
    ) {
      normalized.precio_persona_extra =
        data.precio_persona_extra.trim()
    }

    if (data.moneda !== undefined) {
      normalized.moneda =
        data.moneda.trim().toUpperCase()
    }

    validateRate(
      normalized,
      false,
    )

    return this.repository.updateRate(
      rateId,
      normalized,
    )
  }

  deleteRate(
    rateId: number,
  ): Promise<void> {
    validatePositiveId(
      rateId,
      'La tarifa',
    )

    return this.repository.deleteRate(
      rateId,
    )
  }

  getCurrentRate(
    roomTypeId: number,
    date: string,
  ): Promise<RateReference> {
    validatePositiveId(
      roomTypeId,
      'El tipo de habitación',
    )
    validateDate(
      date,
      'La fecha',
      true,
    )

    return this.repository.getCurrentRate(
      roomTypeId,
      date,
    )
  }
}