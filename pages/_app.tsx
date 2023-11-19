import * as React from 'react'
import type { AppProps } from 'next/app'
import { getQueryClient } from 'queries'
import DefaultSeo from '@components/DefaultSeo'
import Layout from '@components/Layout/layout'
import { DefaultProvider } from '@stores/Default.provider'
import { ModalOutlet } from '@stores/Modal/Modal.provider'
import { config } from '@fortawesome/fontawesome-svg-core'
import { HydrationBoundary, QueryClientProvider } from '@tanstack/react-query'
import '@fortawesome/fontawesome-svg-core/styles.css'
import '../styles/globals.scss'

config.autoAddCss = false

const Application = ({ Component, pageProps }: AppProps) => {
  const [queryClient] = React.useState(() => {
    return getQueryClient()
  })

  return (
    <QueryClientProvider client={queryClient}>
      <DefaultSeo />
      <HydrationBoundary state={pageProps.dehydratedState}>
        <Layout>
          <DefaultProvider>
            <Component {...pageProps} />
            <ModalOutlet />
          </DefaultProvider>
        </Layout>
      </HydrationBoundary>
    </QueryClientProvider>
  )
}

export default Application
