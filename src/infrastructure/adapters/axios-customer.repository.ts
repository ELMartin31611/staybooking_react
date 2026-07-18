import type { CustomerRepository } from '@/domain/ports/customer.repository'
import type { Customer } from '@/domain/entities/customer.entity'
import type { Address } from '@/domain/entities/address.entity'
import type { Document } from '@/domain/entities/document.entity'
import type { UserProfile } from '@/domain/entities/user-profile.entity'

import { apiClient } from '@/infrastructure/http/axios-client'
import { apiConfig } from '@/infrastructure/config/api.config'

function toArray<T>(value: unknown): T[] {
  if (Array.isArray(value)) {
    return value as T[]
  }

  if (
    value &&
    typeof value === 'object' &&
    'results' in value &&
    Array.isArray((value as { results?: unknown }).results)
  ) {
    return (value as { results: T[] }).results
  }

  if (
    value &&
    typeof value === 'object' &&
    'data' in value &&
    Array.isArray((value as { data?: unknown }).data)
  ) {
    return (value as { data: T[] }).data
  }

  return []
}

export class AxiosCustomerRepository
  implements CustomerRepository
{

  async getProfile(): Promise<UserProfile> {

    const { data } =
      await apiClient.get<UserProfile>(
        apiConfig.endpoints.auth.profile
      )

    return data

  }

  async getCustomer(): Promise<Customer> {

    const { data } =
      await apiClient.get<Customer>(
        apiConfig.endpoints.customers.customers
      )

    return data

  }

  async updateCustomer(
    id: number,
    data: Partial<Customer>,
  ): Promise<Customer> {

    const { data: customer } =
      await apiClient.patch<Customer>(
        `${apiConfig.endpoints.customers.customers}${id}/`,
        data,
      )

    return customer

  }

  async getAddresses(): Promise<Address[]> {

    const { data } =
      await apiClient.get<unknown>(
        apiConfig.endpoints.customers.addresses
      )

    return toArray<Address>(data)

  }

  async getDocuments(): Promise<Document[]> {

    const { data } =
      await apiClient.get<unknown>(
        apiConfig.endpoints.customers.documents
      )

    return toArray<Document>(data)

  }

}
