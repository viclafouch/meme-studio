import { cva } from '@styled-system/css'
import { styled } from '@styled-system/jsx'
import { RecipeVariantProps } from '@styled-system/types'

const styles = cva({
  base: {
    position: 'relative',
    '--background-tooltip': 'rgba(0, 0, 0, 0.79)',

    _before: {
      visibility: 'hidden',
      opacity: 0,
      position: 'absolute',
      pointerEvents: 'none',
      zIndex: 2,
      maxWidth: '200px',
      textAlign: 'center',
      color: 'white',
      padding: '6px 5px',
      borderRadius: '3px',
      whiteSpace: 'nowrap',
      textTransform: 'none',
      bgColor: 'var(--background-tooltip)',
      fontSize: 'x-small',
      content: 'attr(data-tooltip)'
    },

    _after: {
      visibility: 'hidden',
      opacity: 0,
      position: 'absolute',
      pointerEvents: 'none',
      zIndex: 2,
      marginLeft: '-5px',
      fontSize: 0,
      lineHeight: 0,
      content: '""'
    },

    '&:not([aria-disabled="true"]):hover': {
      '&:before, &:after': {
        visibility: 'visible',
        opacity: 1
      }
    }
  },
  variants: {
    position: {
      top: {
        _before: {
          left: '50%',
          bottom: 'calc(100% + 10px)',
          transform: 'translateX(-50%)'
        },

        _after: {
          bottom: '125%',
          left: '50%',
          borderRight: '5px solid transparent',
          borderTop: '5px solid var(--background-tooltip)',
          borderLeft: '5px solid transparent'
        }
      },
      right: {
        _before: {
          left: 'calc(100% + 10px)',
          top: '50%',
          transform: 'translateY(-50%)'
        },

        _after: {
          left: 'calc(100% + 10px)',
          top: '50%',
          transform: 'translateY(-50%)',
          borderBottom: '5px solid transparent',
          borderRight: '5px solid var(--background-tooltip)',
          borderTop: '5px solid transparent'
        }
      },
      bottom: {},
      left: {}
    }
  }
})

export const Wrapper = styled('div', styles)

export type VariantsProps = RecipeVariantProps<typeof styles>
