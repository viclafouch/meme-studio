import React from 'react'
import ReactDOM from 'react-dom'
import * as Styled from './Modal.styles'

export type ModalProps = {
  children: React.ReactNode
  isOpen: boolean
  onClose: () => void
}

const Modal = ({ children, isOpen, onClose }: ModalProps) => {
  return isOpen
    ? ReactDOM.createPortal(
        <Styled.ModalRoot>
          <Styled.ModalOverlay
            onClick={onClose}
            tabIndex={-1}
            role="presentation"
          />
          <Styled.ModalContent>{children}</Styled.ModalContent>
        </Styled.ModalRoot>,
        document.body
      )
    : null
}

export default Modal
