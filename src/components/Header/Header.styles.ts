import { styled } from '@styled-system/jsx'

export const Bubble = styled('a', {
  base: {
    position: 'absolute',
    backgroundColor: 'white',
    height: '38px',
    width: '76px',
    borderBottomLeftRadius: '76px',
    borderBottomRightRadius: '76px',
    boxShadow:
      '0 1px 4px rgba(0, 0, 0, 0.3), 0 0 40px rgba(0, 0, 0, 0.1) inset',
    overflow: 'hidden',
    color: 'black',

    '& svg': {
      position: 'absolute',
      left: '6px',
      width: '66px',
      top: '-39px',
      transform: 'rotate(135deg)',
      transition: '0.3s top'
    },

    '&:hover svg': {
      top: '-34px',

      '& .github-arm': {
        animation: 'octocat 560ms ease-in-out'
      }
    }
  }
})
