import * as React from 'react'
import { useContext, memo } from 'react'
import { createPortal } from 'react-dom'
import { ModalContext } from '@store/ModalContext'
import './modal.scss'

type ModalProps = {
  onClose: Function
  children: React.ReactNode
  isLoading: boolean
}
export function Modal({ onClose, isLoading, children }: ModalProps): JSX.Element {
  const modalNode = useContext(ModalContext)

  return modalNode
    ? createPortal(
        <div className="Modal ld ld-fade-in">
          <div className="modal-overlay" onClick={(): void => !isLoading && onClose()} />
          {isLoading && <div className="modal-content-loading">Loading</div>}
          {!isLoading && <div className="modal-content">{children}</div>}
        </div>,
        modalNode
      )
    : null
}

export default memo(Modal)
