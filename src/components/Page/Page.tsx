import Head from 'next/head'
import { Box } from '@styled-system/jsx'

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
    <Box
      flex="1"
      display="flex"
      width="full"
      flexDir="column"
      className={className}
    >
      <Head>
        <title>{formatTitle(title)}</title>
      </Head>
      {children}
    </Box>
  )
}

export default Page
