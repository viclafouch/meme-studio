import styled, { css } from 'styled-components'

type ContainerProps = Partial<{
  $animatedBackground: boolean
}>

const animatedBackgroundCss = css`
  background-image: url('https://www.meme-studio.io/images/particles.svg');
  background-attachment: fixed;
  background-repeat: repeat-y;
  background-size: cover;
`

const Styled = {
  Container: styled.div<ContainerProps>`
    flex: 1;
    width: 100%;
    display: flex;
    flex-direction: column;

    ${(props) => {
      return props.$animatedBackground ? animatedBackgroundCss : ''
    }}
  `
}

export default Styled
