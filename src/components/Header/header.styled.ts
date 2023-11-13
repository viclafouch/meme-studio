import styled from 'styled-components'

export default {
  Header: styled.header`
    height: 5rem;
    width: 100%;
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    padding: 0 0.625rem;
    justify-content: space-between;
    background-color: rgb(100, 159, 255);
    box-shadow: 0 0 0.5rem rgb(0 0 0 / 80%);
    z-index: 999;
    position: relative;
  `,
  LogoBlock: styled.div``,
  RightBlock: styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;
  `
}
