export const UserRole = {
  ADMIN: 'ADMIN',
  USUARIO: 'USUARIO',
} as const

export type UserRole =
  (typeof UserRole)[keyof typeof UserRole]
