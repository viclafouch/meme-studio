import * as React from 'react'
import { useContext, useCallback, memo, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useTranslation } from 'react-i18next'
import { createPortal } from 'react-dom'
import { DefaultContext, DefaultState } from '@client/store/DefaultContext'
import './modal.scss'

type ModalProps = {
  onClose: () => void
  children: React.ReactNode
  isLoading?: boolean
  id?: string
  maxWidth?: number
}
export function Modal({ onClose, isLoading, children, id, maxWidth }: ModalProps): JSX.Element {
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
  }, [handleEscape])

  return createPortal(
    <div className="modal ld ld-fade-in" id={id}>
      <div className="modal-overlay" onClick={(): void => !isLoading && onClose()} />
      {isLoading && <div className="modal-loading">{t('loading')}</div>}
      {!isLoading && (
        <span role="button" className="modal-close" aria-label={t('attr.close')} onClick={(): void => onClose()}>
          <FontAwesomeIcon icon={['fas', 'times']} className="icon-times" />
        </span>
      )}
      {!isLoading && (
        <div className="modal-content ld ld-float-ttb-in" style={{ maxWidth }}>
          {children}
        </div>
      )}
    </div>,
    modalRef.current
  )
}

Modal.defaultProps = {
  isLoading: false,
  id: '',
  maxWidth: 700
} as ModalProps

export default memo(Modal)
