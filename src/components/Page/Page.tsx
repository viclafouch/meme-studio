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

const Page = ({ children, animatedBackground, title, ...rest }: PageProps) => {
  return (
    <Styled.Container {...rest} $animatedBackground={animatedBackground}>
      <Head>
        <title>{formatTitle(title)}</title>
      </Head>
      {children}
    </Styled.Container>
  )
}

Page.defaultProps = {
  animatedBackground: false,
  title: ''
}

export default Page
