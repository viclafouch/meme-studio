import * as React from 'react'
import { useContext } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { ReactSVG } from 'react-svg'
import { useTranslation } from 'react-i18next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { TOGGLE_EXPORT_MODAL, TOGGLE_THEME } from '@client/store/reducer/constants'
import Button from '@client/components/Button/Button'
import LangSelector from '@client/components/LangSelector/LangSelector'
import { DefaultState, DefaultContext, DefaultDispatch } from '@client/store/DefaultContext'
import { EditorContext, EditorInt, EditorDispatch } from '@client/store/EditorContext'
import './header.scss'

type HeaderProps = {
  isAnimate: boolean
}

function Header(props: HeaderProps): JSX.Element {
  const { t } = useTranslation()
  const { location } = useHistory()
  const [{ theme }, dispatch]: [DefaultState, DefaultDispatch] = useContext(DefaultContext)
  const [{ memeSelected }, dispatchEditor]: [EditorInt, EditorDispatch] = useContext(EditorContext)

  return (
    <header className={`header ${props.isAnimate ? 'ld ld-fall-ttb-in' : ''}`}>
      <div>
        <a
          target="_blank"
          href="https://github.com/viclafouch/meme-studio"
          className="github-corner"
          aria-label={t('attr.viewSource')}
          title={t('attr.viewSource')}
          rel="noreferrer noopener"
        >
          <ReactSVG src="/images/github.svg" wrapper="div" className="github-svg" />
        </a>
      </div>
      <div className="center-column">
        <Link to="/" id="logo">
          <img className="logo" src="/images/logo.png" alt="Logo Meme Studio" />
        </Link>
      </div>
      <div>
        <LangSelector />
        <Button
          className="theme-button"
          color="white"
          aria-label={theme === 'dark' ? t('attr.darkTheme') : t('attr.lightTheme')}
          small
          transparent
          onClick={(): void =>
            dispatch({
              type: TOGGLE_THEME
            })
          }
        >
          {theme === 'dark' ? (
            <FontAwesomeIcon fixedWidth icon={['fas', 'sun']} />
          ) : (
            <FontAwesomeIcon fixedWidth icon={['fas', 'moon']} />
          )}
        </Button>
        {location.pathname.startsWith('/create') && (
          <Button
            className="button-export"
            disabled={!memeSelected}
            color={theme === 'dark' ? 'grey' : 'white'}
            onClick={(): void =>
              dispatchEditor({
                type: TOGGLE_EXPORT_MODAL
              })
            }
          >
            <FontAwesomeIcon icon={['fas', 'arrow-circle-down']} className="icon-arrow-circle-down" />
            <span>{t('studio.export')}</span>
          </Button>
        )}
      </div>
    </header>
  )
}

Header.defaultProps = {
  isAnimate: false
} as HeaderProps

export default Header
