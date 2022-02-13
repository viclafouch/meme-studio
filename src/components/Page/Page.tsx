import Styled from './page.styled'

type PageProps = {
  children: React.ReactNode
}

const Page = ({ children, ...rest }: PageProps) => {
  return <Styled.Container {...rest}>{children}</Styled.Container>
}

export default Page
