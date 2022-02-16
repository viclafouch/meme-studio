import styled from 'styled-components'

export default {
  Container: styled.div`
    height: 100%;
    width: 100%;
    position: relative;
  `,
  WrapperCanvas: styled.div`
    z-index: 2;
    box-shadow: 0 1px 4px rgb(0 0 0 / 30%), 0 0 40px rgb(0 0 0 / 10%) inset;
    background-position: center center;
    background-repeat: no-repeat;
    background-size: 100%;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    display: block;
  `,
  Canvas: styled.canvas`
    z-index: -1;
    position: relative;
  `
}
