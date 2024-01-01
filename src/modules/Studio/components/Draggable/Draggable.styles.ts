import { styled } from '@styled-system/jsx'

const resizeSize = '1.125rem' as const

export const DraggableBox = styled('div', {
  base: {
    position: 'absolute',
    zIndex: 1,
    visibility: 'hidden',
    cursor: 'move',
    bgColor: 'transparent',
    '--color-widget': 'rgba(14, 42, 71, 0.6)',
    border: '0.0625rem dotted var(--color-widget)',
    "&[aria-selected='true']": {
      '--color-widget': 'rgb(48, 91, 161)'
    }
  }
})

export const RotateBox = styled('div', {
  base: {
    h: '1.25rem',
    cursor: 'move',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    bg: 'var(--color-widget)',
    position: 'absolute',
    top: 'calc(100% + 1rem)',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    color: 'rgba(255, 255, 255, 0.6)',
    padding: '0.3rem',
    borderRadius: '0.3rem',
    borderWidth: '0.0625rem',
    borderStyle: 'solid',
    borderColor: 'white'
  }
})

export const ResizeBox = styled('div', {
  base: {
    position: 'absolute',
    w: resizeSize,
    h: resizeSize,
    borderRadius: '50%',
    zIndex: 2,
    transform: 'translate(-50%, -50%)',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'white',
    bg: 'var(--color-widget)',
    "&[data-side='nw'], &[data-side='se']": {
      cursor: 'nwse-resize'
    },
    "&[data-side='ne'],&[data-side='sw']": {
      cursor: 'nesw-resize'
    },
    "&[data-side^='n']": {
      top: 0
    },
    "&[data-side^='s']": {
      top: '100%'
    },
    "&[data-side$='e']": {
      left: '100%'
    },
    "&[data-side$='w']": {
      left: 0
    }
  }
})
