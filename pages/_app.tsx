import * as React from 'react'
import { Hydrate, QueryClientProvider } from 'react-query'
import type { AppProps } from 'next/app'
import { getQueryClient } from 'queries'
import Layout from '@components/Layout/layout'
import { DefaultProvider } from '@stores/Default.provider'
import { ModalOutlet } from '@stores/Modal/Modal.provider'
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import '../styles/globals.scss'

config.autoAddCss = false

const Application = ({ Component, pageProps }: AppProps) => {
  const [queryClient] = React.useState(() => {
    return getQueryClient()
  })

  return (
    <QueryClientProvider client={queryClient}>
      {/* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access */}
      <Hydrate state={pageProps.dehydratedState}>
        <Layout>
          <DefaultProvider>
            <Component {...pageProps} />
            <ModalOutlet />
          </DefaultProvider>
        </Layout>
      </Hydrate>
    </QueryClientProvider>
  )
}

export default Application
