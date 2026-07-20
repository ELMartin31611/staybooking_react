import { AvailabilityUseCase } from '@/application/use-cases/availability.use-case'
import { AxiosAvailabilityRepository } from '@/infrastructure/adapters/axios-availability.repository'

const availabilityRepository =
  new AxiosAvailabilityRepository()

export const availabilityUseCase =
  new AvailabilityUseCase(
    availabilityRepository,
  )