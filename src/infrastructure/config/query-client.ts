import { QueryClient } from '@tanstack/react-query'

import { ApiException } from '@/domain/exceptions/api.exception'

function shouldRetryRequest(
  failureCount: number,
  error: Error,
): boolean {
  if (
    error instanceof ApiException &&
    error.status !== null &&
    error.status < 500
  ) {
    return false
  }

  return failureCount < 2
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: shouldRetryRequest,
      refetchOnWindowFocus: false,
    },

    mutations: {
      retry: false,
    },
  },
})