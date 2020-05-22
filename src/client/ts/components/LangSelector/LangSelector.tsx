import * as React from 'react'
import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '@client/components/Button/Button'
import { TFunction } from 'i18next'
import { Modal } from '@client/components/Modal/Modal'
import { useWindowWidth } from '@client/ts/shared/hooks'
import './lang-selector.scss'

function LangSelector(): JSX.Element {
  const [isActive, setIsActive] = useState<boolean>(false)
  const { isMinMdSize } = useWindowWidth()
  const { i18n } = useTranslation()

  const handleClick = useCallback(
    (e: MouseEvent): void => {
      e.preventDefault()
      setIsActive(false)
    },
    [setIsActive]
  )

  useEffect(() => {
    if (isActive) document.addEventListener('click', handleClick, false)
    return (): void => document.removeEventListener('click', handleClick, false)
  }, [isActive, handleClick])

  useEffect(() => {
    window.localStorage.setItem('i18nextLng', i18n.language)
  }, [i18n.language])

  return (
    <div className={`lang-selector ${isActive ? 'lang-selector-active' : ''}`}>
      <Button arial-label="lang" transparent small className="lang-selector-btn" onClick={() => setIsActive(true)}>
        <img
          src={i18n.options.resources[i18n.language].flag as string}
          alt={i18n.options.resources[i18n.language].name as string}
          className="lang-flag"
        />
      </Button>
      {isMinMdSize && (
        <div className="lang-selector-popup">
          <ul className="lang-selector-list">
            {Object.keys(i18n.options.resources).map((key: string) => (
              <li key={key}>
                <div className="lang-selector-list-item" onClick={(): Promise<TFunction> => i18n.changeLanguage(key)}>
                  {i18n.options.resources[key].name}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      {!isMinMdSize && isActive && (
        <Modal maxWidth={380} onClose={(): void => setIsActive(false)} id="lang-selector-modal">
          <ul className="lang-selector-list">
            {Object.keys(i18n.options.resources).map((key: string) => (
              <li key={key}>
                <div className="lang-selector-list-item" onClick={(): Promise<TFunction> => i18n.changeLanguage(key)}>
                  {i18n.options.resources[key].name}
                </div>
              </li>
            ))}
          </ul>
        </Modal>
      )}
    </div>
  )
}

export default LangSelector
