import Head from 'next/head'
import Styled from './Page.styled'

export type PageProps = {
  children: React.ReactNode
  animatedBackground?: boolean
  title?: string
  className?: string
}

function formatTitle(title?: string) {
  const defaultTitle = 'Meme Studio'

  return title ? `${defaultTitle} | ${title}` : defaultTitle
}

const Page = ({
  children,
  animatedBackground = false,
  title = '',
  className = ''
}: PageProps) => {
  return (
    <Styled.Container
      className={className}
      $animatedBackground={animatedBackground}
    >
      <Head>
        <title>{formatTitle(title)}</title>
      </Head>
      {children}
    </Styled.Container>
  )
}

export default Page
