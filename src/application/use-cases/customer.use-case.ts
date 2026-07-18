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

  createAddress(
    data: Omit<import('@/domain/entities/address.entity').Address, 'id'>,
  ) {
    return this.repository.createAddress(data)
  }

  getDocuments() {
    return this.repository.getDocuments()
  }

  createDocument(
    data: Omit<import('@/domain/entities/document.entity').Document, 'id'>,
  ) {
    return this.repository.createDocument(data)
  }
}
