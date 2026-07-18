import { CustomerUseCase } from '@/application/use-cases/customer.use-case'

import { AxiosCustomerRepository } from '@/infrastructure/adapters/axios-customer.repository'

const customerRepository =
  new AxiosCustomerRepository()

export const customerUseCase =
  new CustomerUseCase(
    customerRepository,
  )
