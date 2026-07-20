import { BillingUseCase } from '@/application/use-cases/billing.use-case'
import { AxiosBillingRepository } from '@/infrastructure/adapters/axios-billing.repository'

export const billingUseCase =
  new BillingUseCase(
    new AxiosBillingRepository(),
  )