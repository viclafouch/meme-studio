import { QueryClient } from 'react-query'

export function getQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        keepPreviousData: true,
        retry: false
      }
    }
  })
}
