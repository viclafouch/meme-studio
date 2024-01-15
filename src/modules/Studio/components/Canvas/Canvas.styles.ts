import { styled } from '@styled-system/jsx'

export const Wrapper = styled('div', {
  base: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 'full',
    '& [draggable]': {
      visibility: {
        md: 'hidden'
      }
    },
    '&:has([draggable][aria-grabbed="true"]) [draggable]': {
      visibility: 'visible'
    },
    _hover: {
      '& [draggable]': {
        visibility: 'visible'
      }
    }
  }
})
