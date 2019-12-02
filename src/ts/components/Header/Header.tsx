import * as React from 'react'
import './header.scss'
import Button from '@components/Button/Button'

function Header(): JSX.Element {
  return (
    <header className="Header">
      <div></div>
      <div className="center-column">
        <h1>Meme Studio</h1>
      </div>
      <div>
        <Button className="button-export">Export Meme</Button>
      </div>
    </header>
  )
}

export default Header
