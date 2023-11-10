import styled, { css } from 'styled-components'

const rightPosition = css`
  &::before {
    left: calc(100% + 10px);
    top: 50%;
    transform: translateY(-50%);
  }

  &::after {
    left: calc(100% + 10px);
    top: 50%;
    transform: translateY(-50%);
    border-bottom: 5px solid transparent;
    border-right: 5px solid var(--background-tooltip);
    border-top: 5px solid transparent;
  }
`

const topPosition = css`
  &::before {
    left: 50%;
    bottom: calc(100% + 10px);
    transform: translateX(-50%);
  }

  &::after {
    bottom: 125%;
    left: 50%;
    border-top: 5px solid var(--background-tooltip);
    border-right: 5px solid transparent;
    border-left: 5px solid transparent;
  }
`

const leftPosition = css``
const bottomPosition = css``

export const cssByPosition = {
  top: topPosition,
  right: rightPosition,
  bottom: bottomPosition,
  left: leftPosition
} as const

export default {
  Wrapper: styled.div<{
    $position: 'left' | 'right' | 'top' | 'bottom'
    $disabled?: boolean
  }>`
    position: relative;
    --background-tooltip: rgba(0, 0, 0, 0.79);

    &::before,
    &::after {
      visibility: hidden;
      position: absolute;
      opacity: 0;
      pointer-events: none;
    }

    &::before {
      z-index: 2;
      padding: 6px 5px;
      max-width: 200px;
      line-height: 1.45;
      border-radius: 3px;
      color: #ffffff;
      background-color: var(--background-tooltip);
      content: attr(data-tooltip);
      white-space: nowrap;
      text-align: center;
      font-size: 11.5px;
      text-transform: none;
    }

    &::after {
      width: 0;
      margin-left: -5px;
      content: ' ';
      font-size: 0;
      line-height: 0;
    }

    ${(props) => {
      return cssByPosition[props.$position]
    }}

    ${(props) => {
      return !props.$disabled
        ? css`
            &:hover::after,
            &:hover::before {
              opacity: 1;
              visibility: visible;
            }
          `
        : null
    }}
  `
}
