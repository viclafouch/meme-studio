import styled from 'styled-components'

export default {
  Container: styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
  `,
  Overlay: styled.div`
    background-repeat: no-repeat;
    background-size: cover;
    filter: opacity(0.4) brightness(88%) blur(0.25rem);
    background-position: center center;
    position: absolute;
    left: -0.25rem;
    top: -0.25rem;
    bottom: -0.25rem;
    right: -0.25rem;
  `
}
