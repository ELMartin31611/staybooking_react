import axios from 'axios'

import {
  ApiException,
  type FieldErrors,
} from '@/domain/exceptions/api.exception'

type ApiErrorPayload = Record<string, unknown>

function asMessages(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .filter((item): item is string => typeof item === 'string')
  }

  if (typeof value === 'string') {
    return [value]
  }

  return []
}

function flattenMessages(value: unknown): string[] {
  const direct = asMessages(value)

  if (direct.length > 0) {
    return direct
  }

  if (Array.isArray(value)) {
    return value.flatMap(flattenMessages)
  }

  if (value && typeof value === 'object') {
    return Object.values(value).flatMap(flattenMessages)
  }

  return []
}

const fieldLabels: Record<string, string> = {
  cliente: 'Completa la información de tu perfil antes de crear la reserva.',
  fecha_entrada: 'Revisa la fecha de entrada.',
  fecha_salida: 'Revisa la fecha de salida.',
  habitaciones: 'Revisa la selección de habitaciones y capacidades.',
  huespedes: 'Revisa la información de los huéspedes.',
  servicios: 'Revisa los servicios seleccionados.',
  disponibilidad: 'Una o más habitaciones ya no están disponibles.',
  tarifa: 'No existe una tarifa válida para las fechas elegidas.',
  moneda: 'Las habitaciones seleccionadas deben usar la misma moneda.',
}

function extractFieldErrors(data: unknown): FieldErrors | null {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return null
  }

  const payload = data as ApiErrorPayload
  const fieldErrors: FieldErrors = {}

  Object.entries(payload).forEach(([field, value]) => {
    if (field === 'detail' || field === 'non_field_errors') {
      return
    }

    const messages = flattenMessages(value)

    if (messages.length > 0) {
      fieldErrors[field] = messages
    }
  })

  return Object.keys(fieldErrors).length > 0
    ? fieldErrors
    : null
}

function firstFriendlyFieldMessage(
  fieldErrors: FieldErrors | null,
): string | null {
  if (!fieldErrors) {
    return null
  }

  const firstError = Object.entries(fieldErrors)[0]
  if (!firstError) {
    return null
  }

  const [field, messages] = firstError
  return fieldLabels[field] ?? messages?.[0] ?? null
}

function extractDetail(data: unknown): string | null {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return typeof data === 'string' ? data : null
  }

  const payload = data as ApiErrorPayload

  const detailMessages = asMessages(payload.detail)

  if (detailMessages.length > 0) {
    return detailMessages[0]
  }

  const generalMessages = asMessages(payload.non_field_errors)

  return generalMessages.length > 0
    ? generalMessages[0]
    : null
}

export function parseApiError(error: unknown): ApiException {
  if (error instanceof ApiException) {
    return error
  }

  if (!axios.isAxiosError(error)) {
    return new ApiException(
      'Ocurrió un error inesperado. Inténtalo nuevamente.',
    )
  }

  if (error.code === 'ERR_CANCELED') {
    return new ApiException('La solicitud fue cancelada.')
  }

  if (!error.response) {
    return new ApiException(
      'No fue posible conectar con el servidor. Revisa tu conexión.',
    )
  }

  const status = error.response.status
  const data: unknown = error.response.data
  const detail = extractDetail(data)
  const fieldErrors = extractFieldErrors(data)
  const friendlyFieldMessage =
    firstFriendlyFieldMessage(fieldErrors)

  switch (status) {
    case 400:
      return new ApiException(
        detail
        ?? friendlyFieldMessage
        ?? 'Revisa la información ingresada.',
        status,
        fieldErrors,
      )

    case 401:
      return new ApiException(
        'Tu sesión no es válida o ha expirado.',
        status,
      )

    case 403:
      return new ApiException(
        'No tienes permisos para realizar esta acción.',
        status,
      )

    case 404:
      return new ApiException(
        'El recurso solicitado no fue encontrado.',
        status,
      )

    case 429:
      return new ApiException(
        'Has realizado demasiadas solicitudes. Inténtalo más tarde.',
        status,
      )

    default:
      if (status >= 500) {
        return new ApiException(
          'El servidor no pudo procesar la solicitud.',
          status,
        )
      }

      return new ApiException(
        detail ?? 'No fue posible completar la operación.',
        status,
        fieldErrors,
      )
  }
}