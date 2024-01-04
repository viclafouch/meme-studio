import { buttonRootStyles } from '@components/Button/Button.styles'
import { styled } from '@styled-system/jsx'

export const TabButton = styled('button', {
  base: {
    ...buttonRootStyles,
    width: 'full',
    color: 'white',
    bgColor: 'primary.dark',
    fontWeight: '600',
    paddingX: '5',
    paddingY: '5',
    fontSize: '1.2rem',
    '&[aria-current="true"]': {
      bgColor: 'primary'
    }
  }
})
