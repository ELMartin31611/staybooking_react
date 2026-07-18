import type { Address } from '@/domain/entities/address.entity'
import type { Customer } from '@/domain/entities/customer.entity'
import type { Document } from '@/domain/entities/document.entity'
import type { UserProfile } from '@/domain/entities/user-profile.entity'

export interface CustomerRepository {
  getProfile(): Promise<UserProfile>

  getCustomer(): Promise<Customer>

  updateCustomer(
    id: number,
    data: Partial<Customer>,
  ): Promise<Customer>

  getAddresses(): Promise<Address[]>

  createAddress(
    data: Omit<Address, 'id'>,
  ): Promise<Address>

  getDocuments(): Promise<Document[]>

  createDocument(
    data: Omit<Document, 'id'>,
  ): Promise<Document>
}
