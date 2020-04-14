import * as React from 'react'
import { useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { ReactSVG } from 'react-svg'
import { useTranslation } from 'react-i18next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Button from '@client/components/Button/Button'
import { DefaultContext, DefaultState } from '@client/store/DefaultContext'
import { SET_ON_STUDIO } from '@client/store/reducer/constants'
import LangSelector from '@client/components/LangSelector/LangSelector'
import { useEditor } from '@client/ts/shared/hooks'
import { UseEditorInt } from '@client/ts/shared/validators'
import './header.scss'

type HeaderProps = {
  export?: Function
  isAnimate: boolean
}

function Header(props: HeaderProps): JSX.Element {
  const { t } = useTranslation()
  const [, dispatchDefault]: [DefaultState, Function] = useContext(DefaultContext)
  const [{ memeSelected }]: [UseEditorInt, Function] = useEditor()
  const { location, push } = useHistory()

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>): void => {
    e.preventDefault()
    if (location.pathname === '/')
      dispatchDefault({
        type: SET_ON_STUDIO,
        onStudio: false,
      })
    else push('/')
  }

  return (
    <header className={`header ${props.isAnimate ? 'ld ld-fall-ttb-in' : ''}`}>
      <div>
        <a
          target="_blank"
          href="https://github.com/viclafouch/meme-studio"
          className="github-corner"
          aria-label={t('attr.viewSource')}
          title={t('attr.viewSource')}
        >
          <ReactSVG src="images/github.svg" wrapper="div" className="github-svg" />
        </a>
      </div>
      <div className="center-column">
        <a href="/" onClick={handleClick}>
          <h1>Meme Studio</h1>
        </a>
      </div>
      <div>
        <LangSelector />
        {props.export && (
          <Button className="button-export" disabled={!memeSelected} onClick={props.export}>
            <FontAwesomeIcon icon={['fas', 'arrow-circle-down']} className="icon-arrow-circle-down" />
            <span>{t('studio.export')}</span>
          </Button>
        )}
      </div>
    </header>
  )
}

Header.defaultProps = {
  isAnimate: false,
} as HeaderProps

export default Header
