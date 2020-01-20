import * as React from 'react'
import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useTranslation } from 'react-i18next'
import Button from '@components/Button/Button'
import './lang-selector.scss'
import { TFunction } from 'i18next'
import { Modal } from '@components/Modal/Modal'
import { useWindowWidth } from '@shared/hooks'

function LangSelector(): JSX.Element {
  const [isActive, setIsActive]: [boolean, Function] = useState(false)
  const windowWidth = useWindowWidth()
  const { i18n } = useTranslation()

  const handleClick = (e: MouseEvent): void => {
    e.preventDefault()
    setIsActive(!isActive)
  }

  useEffect(() => {
    if (isActive) document.addEventListener('click', handleClick, false)
    return (): void => document.removeEventListener('click', handleClick, false)
  }, [isActive])

  useEffect(() => {
    window.localStorage.setItem('i18nextLng', i18n.language)
  }, [i18n.language])

  return (
    <div className={`lang-selector ${isActive ? 'lang-selector-active' : ''}`}>
      <Button className="lang-selector-btn" onClick={handleClick}>
        {windowWidth < 768 ? (
          <img src={i18n.options.resources[i18n.language].flag as string} className="lang-flag" />
        ) : (
          <>
            <FontAwesomeIcon icon={['fas', 'globe']} className="icon-globe" />
            <span>{i18n.options.resources[i18n.language].name}</span>
          </>
        )}
      </Button>
      {windowWidth >= 768 && (
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
      {windowWidth < 768 && isActive && (
        <Modal onClose={(): void => setIsActive(false)} id="lang-selector-modal">
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
