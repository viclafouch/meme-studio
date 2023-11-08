import Head from 'next/head'
import Styled from './page.styled'

interface PageProps extends React.ButtonHTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  animatedBackground?: boolean
  title?: string
}

function formatTitle(title?: string) {
  const defaultTitle = 'Meme Studio'

  return title ? `${defaultTitle} | ${title}` : defaultTitle
}

const Page = ({
  children,
  animatedBackground = false,
  title = '',
  ...restProps
}: PageProps) => {
  return (
    <Styled.Container {...restProps} $animatedBackground={animatedBackground}>
      <Head>
        <title>{formatTitle(title)}</title>
      </Head>
      {children}
    </Styled.Container>
  )
}

export default Page
