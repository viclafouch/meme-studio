import styled, { css } from 'styled-components'

const rightPosition = css`
  left: calc(100% + 10px);
  top: 50%;
  transform: translateY(-50%);
`

export default {
  Wrapper: styled.div<{ $position: 'left' | 'right' | 'top' | 'bottom' }>`
    position: relative;
    --background-tooltip: rgba(0, 0, 0, 0.79);

    &::before,
    &::after {
      visibility: hidden;
      position: absolute;
      opacity: 0;
      pointer-events: none;

      ${(props) => {
        return props.$position === 'right' ? rightPosition : null
      }}
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
      margin-left: -5px;
      width: 0;
      border-bottom: 5px solid transparent;
      border-right: 5px solid var(--background-tooltip);
      border-top: 5px solid transparent;
      border-left: 0;
      content: ' ';
      font-size: 0;
      line-height: 0;
    }

    &:hover::after,
    &:hover::before {
      opacity: 1;
      visibility: visible;
    }
  `
}
