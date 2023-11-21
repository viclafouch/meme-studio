import Head from 'next/head'
import { cx } from '@styled-system/css'
import * as styles from './Page.styles'

export type PageProps = {
  children: React.ReactNode
  title?: string
  className?: string
}

function formatTitle(title?: string) {
  const defaultTitle = 'Meme Studio'

  return title ? `${defaultTitle} | ${title}` : defaultTitle
}

const Page = ({ children, title = '', className = '' }: PageProps) => {
  return (
    <div className={cx(styles.containerCss, className)}>
      <Head>
        <title>{formatTitle(title)}</title>
      </Head>
      {children}
    </div>
  )
}

export default Page
