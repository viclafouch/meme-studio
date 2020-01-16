import * as React from 'react'
import { useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { ReactSVG } from 'react-svg'
import { useTranslation } from 'react-i18next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './header.scss'
import Button from '@components/Button/Button'
import { DefaultContext, DefaultState } from '@store/DefaultContext'
import { SET_ON_STUDIO } from '@store/reducer/constants'
import LangSelector from '@components/LangSelector/LangSelector'
import { EditorContext, EditorState } from '@store/EditorContext'

type HeaderProps = {
  export?: Function
}

function Header(props: HeaderProps): JSX.Element {
  const { t } = useTranslation()
  const [, dispatchDefault]: [DefaultState, Function] = useContext(DefaultContext)
  const [{ memeSelected }]: [EditorState, Function] = useContext(EditorContext)
  const { location, push } = useHistory()

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>): void => {
    e.preventDefault()
    if (location.pathname === '/')
      dispatchDefault({
        type: SET_ON_STUDIO,
        onStudio: false
      })
    else push('/')
  }

  return (
    <header className="header">
      <div>
        <a
          target="_blank"
          href="https://github.com/viclafouch/meme-studio"
          className="github-corner"
          aria-label={t('viewSource')}
          title={t('viewSource')}
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
        <Button className="button-export" disabled={!memeSelected} onClick={props.export}>
          <FontAwesomeIcon icon={['fas', 'arrow-circle-down']} className="icon-arrow-circle-down" />
          {t('studio.export')}
        </Button>
      </div>
    </header>
  )
}

export default Header
