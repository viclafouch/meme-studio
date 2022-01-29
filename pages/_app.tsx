import type { AppProps } from 'next/app'
import Layout from '@components/Layout/layout'
import { DefaultProvider } from '@stores/Default.provider'

import '../styles/globals.scss'

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <Layout>
      <DefaultProvider>
        <Component {...pageProps} />
      </DefaultProvider>
    </Layout>
  )
}

export default MyApp
