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

  getCustomer(profileId: number) {
    return this.repository.getCustomer(profileId)
  }

  createCustomer(
    data: Omit<
      import('@/domain/entities/customer.entity').Customer,
      'id' | 'created_at' | 'updated_at'
    >,
  ) {
    return this.repository.createCustomer(data)
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

  getAddresses(customerId?: number) {
    return this.repository.getAddresses(customerId)
  }

  createAddress(
    data: Omit<import('@/domain/entities/address.entity').Address, 'id'>,
  ) {
    return this.repository.createAddress(data)
  }

  getDocuments(customerId?: number) {
    return this.repository.getDocuments(customerId)
  }

  createDocument(
    data: Omit<import('@/domain/entities/document.entity').Document, 'id'>,
  ) {
    return this.repository.createDocument(data)
  }
}
