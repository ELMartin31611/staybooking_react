import type { CustomerRepository } from '@/domain/ports/customer.repository'

export class CustomerUseCase {
  private readonly repository: CustomerRepository

  constructor(
    repository: CustomerRepository,
  ) {
    this.repository = repository
  }

  getProfile() {
    return this.repository.getProfile()
  }

  getCustomer() {
    return this.repository.getCustomer()
  }

  updateCustomer(
    id: number,
    data: Partial<import('@/domain/entities/customer.entity').Customer>,
  ) {
    return this.repository.updateCustomer(
      id,
      data,
    )
  }

  getAddresses() {
    return this.repository.getAddresses()
  }

  getDocuments() {
    return this.repository.getDocuments()
  }
}
