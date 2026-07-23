import { AdminUseCase } from '@/application/use-cases/admin.use-case'
import { AxiosAdminRepository } from '@/infrastructure/adapters/axios-admin.repository'

const repository =
  new AxiosAdminRepository()

export const adminUseCase =
  new AdminUseCase(repository)