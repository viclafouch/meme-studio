import * as React from 'react'
import { useContext, useCallback, memo, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useTranslation } from 'react-i18next'
import { createPortal } from 'react-dom'
import { DefaultContext, DefaultState } from '@client/store/DefaultContext'
import './modal.scss'

type ModalProps = {
  onClose: Function
  children: React.ReactNode
  isLoading?: boolean
  id?: string
}
export function Modal({ onClose, isLoading, children, id }: ModalProps): JSX.Element {
  const { t } = useTranslation()
  const [{ modalRef }]: [DefaultState] = useContext(DefaultContext)

  const handleEscape = useCallback(
    event => {
      if (event.keyCode === 27) onClose()
    },
    [onClose]
  )

  useEffect(() => {
    document.addEventListener('keydown', handleEscape, false)
    return (): void => {
      document.removeEventListener('keydown', handleEscape, false)
    }
  }, [])

  return createPortal(
    <div className="modal ld ld-fade-in" id={id}>
      <div className="modal-overlay" onClick={(): void => !isLoading && onClose()} />
      {isLoading && <div className="modal-content-loading">{t('loading')}</div>}
      {!isLoading && (
        <div className="modal-content ld ld-float-ttb-in">
          <span role="button" className="modal-close" aria-label={t('attr.close')} onClick={(): void => onClose()}>
            <FontAwesomeIcon icon={['fas', 'times']} className="icon-times" />
          </span>
          <div className="modal-content-scrollable">{children}</div>
        </div>
      )}
    </div>,
    modalRef.current
  )
}

Modal.defaultProps = {
  isLoading: false,
  id: ''
} as ModalProps

export default memo(Modal)
