import type { Address } from '@/domain/entities/address.entity'
import type { Customer } from '@/domain/entities/customer.entity'
import type { Document } from '@/domain/entities/document.entity'
import type { UserProfile } from '@/domain/entities/user-profile.entity'

export interface CustomerRepository {
  getProfile(): Promise<UserProfile>

  getCustomer(profileId: number): Promise<Customer | null>

  createCustomer(
    data: Omit<Customer, 'id' | 'created_at' | 'updated_at'>,
  ): Promise<Customer>

  updateCustomer(
    id: number,
    data: Partial<Customer>,
  ): Promise<Customer>

  getAddresses(customerId?: number): Promise<Address[]>

  createAddress(
    data: Omit<Address, 'id'>,
  ): Promise<Address>

  getDocuments(customerId?: number): Promise<Document[]>

  createDocument(
    data: Omit<Document, 'id'>,
  ): Promise<Document>
}
