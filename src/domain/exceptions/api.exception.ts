export type FieldErrors = Record<string, string[]>

export class ApiException extends Error {
  readonly status: number | null
  readonly fieldErrors: FieldErrors | null

  constructor(
    message: string,
    status: number | null = null,
    fieldErrors: FieldErrors | null = null,
  ) {
    super(message)

    this.name = 'ApiException'
    this.status = status
    this.fieldErrors = fieldErrors
  }
}