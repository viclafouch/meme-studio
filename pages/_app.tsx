import * as React from 'react'
import { Hydrate, QueryClient, QueryClientProvider } from 'react-query'
import type { AppProps } from 'next/app'
import Layout from '@components/Layout/layout'
import { config } from '@fortawesome/fontawesome-svg-core'
import { DefaultProvider } from '@stores/Default.provider'

import '@fortawesome/fontawesome-svg-core/styles.css'
import '../styles/globals.scss'

config.autoAddCss = false

const MyApp = ({ Component, pageProps }: AppProps) => {
  const [queryClient] = React.useState(() => {
    return new QueryClient()
  })

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <Layout>
          <DefaultProvider>
            <Component {...pageProps} />
          </DefaultProvider>
        </Layout>
      </Hydrate>
    </QueryClientProvider>
  )
}

export default MyApp
