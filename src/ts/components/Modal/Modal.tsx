import * as React from 'react'
import { useContext, memo } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useTranslation } from 'react-i18next'
import { createPortal } from 'react-dom'
import { ModalContext } from '@store/ModalContext'
import './modal.scss'

type ModalProps = {
  onClose: Function
  children: React.ReactNode
  isLoading?: boolean
  id?: string
}
export function Modal({ onClose, isLoading, children, id }: ModalProps): JSX.Element {
  const { t } = useTranslation()
  const modalNode = useContext(ModalContext)

  return modalNode
    ? createPortal(
        <div className="modal ld ld-fade-in" id={id}>
          <div className="modal-overlay" onClick={(): void => !isLoading && onClose()} />
          {isLoading && <div className="modal-content-loading">{t('loading')}</div>}
          {!isLoading && (
            <div className="modal-content">
              <span role="button" className="modal-close" aria-label={t('attr.close')} onClick={(): void => onClose()}>
                <FontAwesomeIcon icon={['fas', 'times']} className="icon-times" />
              </span>
              {children}
            </div>
          )}
        </div>,
        modalNode
      )
    : null
}

Modal.defaultProps = {
  isLoading: false,
  id: ''
} as ModalProps

export default memo(Modal)
