import * as React from 'react'
import { Link, useHistory } from 'react-router-dom'
import { ReactSVG } from 'react-svg'
import { useTranslation } from 'react-i18next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { TOGGLE_EXPORT_MODAL } from '@client/store/reducer/constants'
import Button from '@client/components/Button/Button'
import LangSelector from '@client/components/LangSelector/LangSelector'
import { useEditor } from '@client/ts/shared/hooks'
import { UseEditorInt } from '@client/ts/shared/validators'
import './header.scss'

type HeaderProps = {
  isAnimate: boolean
}

function Header(props: HeaderProps): JSX.Element {
  const { t } = useTranslation()
  const { location } = useHistory()
  const [{ memeSelected }, dispatchEditor]: [UseEditorInt, Function] = useEditor()

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
        {location.pathname.startsWith('/create') && (
          <Button
            className="button-export"
            disabled={!memeSelected}
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
