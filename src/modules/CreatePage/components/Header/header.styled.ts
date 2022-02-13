import styled from 'styled-components'

export default {
  Header: styled.header`
    height: 5rem;
    width: 100%;
    display: flex;
    align-items: center;
    padding: 0 0.625rem;
    justify-content: space-between;
    background-color: rgb(100, 159, 255);
    box-shadow: 0 0 0.5rem rgb(0 0 0 / 80%);
    z-index: 9999;
    position: relative;
  `,
  LogoBlock: styled.div`
    flex: 1;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    top: 50%;
    z-index: 2;
  `
}
