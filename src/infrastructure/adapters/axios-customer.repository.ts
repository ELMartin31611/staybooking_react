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

  async getCustomer(profileId: number): Promise<Customer | null> {

    const { data } =
      await apiClient.get<unknown>(
        apiConfig.endpoints.customers.customers,
      )

    const customers = toArray<Customer>(data)

    return customers.find((customer) => customer.perfil === profileId) ?? null

  }

  async createCustomer(
    data: Omit<Customer, 'id' | 'created_at' | 'updated_at'>,
  ): Promise<Customer> {

    const { data: customer } =
      await apiClient.post<Customer>(
        apiConfig.endpoints.customers.customers,
        data,
      )

    return customer

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

  async getAddresses(customerId?: number): Promise<Address[]> {

    const { data } =
      await apiClient.get<unknown>(
        apiConfig.endpoints.customers.addresses,
        {
          params: customerId
            ? { cliente: customerId }
            : undefined,
        },
      )

    const addresses = toArray<Address>(data)

    if (!customerId) {
      return addresses
    }

    return addresses.filter((address) => address.cliente === customerId)

  }

  async createAddress(
    data: Omit<Address, 'id'>,
  ): Promise<Address> {

    const { data: address } =
      await apiClient.post<Address>(
        apiConfig.endpoints.customers.addresses,
        data,
      )

    return address

  }

  async getDocuments(customerId?: number): Promise<Document[]> {

    const { data } =
      await apiClient.get<unknown>(
        apiConfig.endpoints.customers.documents,
        {
          params: customerId
            ? { cliente: customerId }
            : undefined,
        },
      )

    const documents = toArray<Document>(data)

    if (!customerId) {
      return documents
    }

    return documents.filter((document) => document.cliente === customerId)

  }

  async createDocument(
    data: Omit<Document, 'id'>,
  ): Promise<Document> {

    const { data: document } =
      await apiClient.post<Document>(
        apiConfig.endpoints.customers.documents,
        data,
      )

    return document

  }

}
