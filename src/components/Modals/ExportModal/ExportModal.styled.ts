import styled from 'styled-components'

export default {
  Container: styled.div`
    text-align: center;
  `,
  Title: styled.h2`
    text-align: center;
    font-size: 1.55em;
    margin-bottom: 20px;
  `,
  Image: styled.img`
    max-width: 100%;
    display: block;
    max-width: 100%;
    max-height: 490px;
    box-shadow:
      0 1px 4px rgba(0, 0, 0, 0.3),
      0 0 40px rgba(0, 0, 0, 0.1) inset;

    &::after {
      content: '';
      z-index: 2;
      height: 100%;
      top: 0;
      left: 0;
      width: 100%;
      position: absolute;
    }
  `,
  SizeText: styled.p`
    text-align: center;
    font-size: 1rem;
    margin-top: 20px;
  `,
  Actions: styled.div`
    display: flex;
    align-items: center;
    max-width: 400px;
    gap: 20px;
    margin: 20px auto 0;
  `
}
