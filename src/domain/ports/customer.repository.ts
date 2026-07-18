import type { Address } from '@/domain/entities/address.entity'
import type { Customer } from '@/domain/entities/customer.entity'
import type { Document } from '@/domain/entities/document.entity'
import type { UserProfile } from '@/domain/entities/user-profile.entity'

export interface CustomerRepository {
  getProfile(): Promise<UserProfile>

  getCustomer(): Promise<Customer>

  getAddresses(): Promise<Address[]>

  getDocuments(): Promise<Document[]>
}
