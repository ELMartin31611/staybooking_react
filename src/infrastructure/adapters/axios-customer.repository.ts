import type { CustomerRepository } from '@/domain/ports/customer.repository'
import type { Customer } from '@/domain/entities/customer.entity'
import type { Address } from '@/domain/entities/address.entity'
import type { Document } from '@/domain/entities/document.entity'
import type { UserProfile } from '@/domain/entities/user-profile.entity'

import { apiClient } from '@/infrastructure/http/axios-client'
import { apiConfig } from '@/infrastructure/config/api.config'

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

  async getAddresses(): Promise<Address[]> {

    const { data } =
      await apiClient.get<Address[]>(
        apiConfig.endpoints.customers.addresses
      )

    return data

  }

  async getDocuments(): Promise<Document[]> {

    const { data } =
      await apiClient.get<Document[]>(
        apiConfig.endpoints.customers.documents
      )

    return data

  }

}
