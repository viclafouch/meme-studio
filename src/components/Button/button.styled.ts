import styled from 'styled-components'

const Styled = {
  Button: styled.button<{ $rounded: boolean; $fullWidth: boolean }>`
    font-family: Alata, sans-serif;
    background-color: #4d90fe;
    color: #ffffff;
    font-weight: 500;
    border-radius: ${(props) => {
      return props.$rounded ? '8px' : 0
    }};
    box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.14);
    display: flex;
    align-items: center;
    justify-content: center;
    border: 0;
    width: ${(props) => {
      return props.$fullWidth ? '100%' : 'auto'
    }};
    transition-property: opacity, box-shadow, background-color;
    transition-duration: 0.3s;
    letter-spacing: 0.5px;
    padding: 14px 18px;
    font-size: 16px;
    line-height: 22px;

    &:not(:disabled):hover {
      cursor: pointer;
      background-color: #649fff;
    }
  `
}

export default Styled
