import styled, { css } from 'styled-components'

const primaryColor = css`
  background-color: #4d90fe;
  border: 1px solid transparent;
  color: #ffffff;

  &:not(:disabled):hover {
    background-color: #649fff;
  }
`

const secondaryColor = css`
  background-color: rgb(68, 68, 68);
  border: 1px solid rgba(189, 189, 189, 0.541);
  color: #ffffff;

  &:not(:disabled):hover {
    background-color: #535353;
  }
`

export const colorCss = {
  primary: primaryColor,
  secondary: secondaryColor
} as const

const Styled = {
  Button: styled.button<{
    $rounded: boolean
    $fullWidth: boolean
    $color: 'primary' | 'secondary'
  }>`
    font-family: Alata, sans-serif;
    font-weight: 500;
    border-radius: ${(props) => {
      return props.$rounded ? '8px' : 0
    }};
    text-decoration: none;
    box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.14);
    display: flex;
    align-items: center;
    justify-content: center;
    width: ${(props) => {
      return props.$fullWidth ? '100%' : 'auto'
    }};
    transition-property: opacity, box-shadow, background-color;
    transition-duration: 0.3s;
    letter-spacing: 0.5px;
    padding: 14px 18px;
    font-size: 16px;
    line-height: 22px;

    ${(props) => {
      return colorCss[props.$color]
    }}

    &:has(span.button-start-adornment) {
      display: flex;
      gap: 8px;
    }

    &:not(:disabled):hover {
      cursor: pointer;
    }
  `
}

export default Styled
