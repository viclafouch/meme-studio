import { Link } from '@i18n/navigation'
import { styled } from '@styled-system/jsx'

export const MemeTitle = styled('h3', {
  base: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    color: 'black',
    zIndex: 3,
    textAlign: 'center',
    visibility: 'hidden'
  }
})

export const MemeLink = styled(Link, {
  base: {
    display: 'block',
    h: 'full',
    w: 'full',
    pos: 'relative'
  },
  variants: {
    disableHoverShowTitle: {
      false: {
        '&:hover': {
          '& > h3': {
            visibility: 'visible'
          },
          _before: {
            content: "''",
            w: 'full',
            zIndex: 2,
            h: 'full',
            position: 'absolute',
            inset: 0,
            bg: 'rgba(255, 255, 255, 0.65)'
          }
        }
      }
    }
  }
})
