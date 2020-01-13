import * as React from 'react'
import { useContext } from 'react'
import { useHistory } from 'react-router-dom'
import './header.scss'
import Button from '@components/Button/Button'
import { DefaultContext, DefaultState } from '@store/DefaultContext'
import { SET_ON_STUDIO } from '@store/reducer/constants'

type HeaderProps = {
  export?: Function
}

function Header(props: HeaderProps): JSX.Element {
  const [, dispatchDefault]: [DefaultState, Function] = useContext(DefaultContext)
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
      <div></div>
      <div className="center-column">
        <a href="/" onClick={handleClick}>
          <h1>Meme Studio</h1>
        </a>
      </div>
      <div>
        <Button className="button-export" onClick={props.export}>
          Export Meme
        </Button>
      </div>
    </header>
  )
}

export default Header
