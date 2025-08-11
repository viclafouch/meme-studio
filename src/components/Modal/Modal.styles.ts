import { styled } from '@styled-system/jsx'

export const ModalRoot = styled('div', {
  base: {
    position: 'fixed',
    inset: 0,
    zIndex: 1000,
    display: 'flex',
    height: {
      mdDown: '100vh'
    },
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export const ModalOverlay = styled('div', {
  base: {
    position: 'fixed',
    inset: 0,
    zIndex: -1,
    bg: 'rgba(0, 0, 0, 0.5)'
  }
})

export const ModalContent = styled('div', {
  base: {
    maxWidth: '90vw',
    overflowY: 'auto',
    boxShadow: '0 12px 15px 0 rgba(0,0,0,.25)',
    position: 'relative',
    p: 8,
    maxHeight: '100%',
    bg: 'rgb(48, 48, 48)',
    color: 'white'
  }
})
