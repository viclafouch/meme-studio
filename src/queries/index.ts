import { IS_PROD } from '@shared/constants/env'
import { QueryClient } from '@tanstack/react-query'

export function getQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 1000,
        refetchOnWindowFocus: IS_PROD,
        retry: false
      }
    }
  })
}
