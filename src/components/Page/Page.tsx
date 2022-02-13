import Styled from './page.styled'

interface PageProps extends React.ButtonHTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  animatedBackground?: boolean
}

const Page = ({ children, animatedBackground, ...rest }: PageProps) => {
  return (
    <Styled.Container {...rest} $animatedBackground={animatedBackground}>
      {children}
    </Styled.Container>
  )
}

Page.defaultProps = {
  animatedBackground: false
}

export default Page
