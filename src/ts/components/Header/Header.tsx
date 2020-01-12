import * as React from 'react'
import './header.scss'
import Button from '@components/Button/Button'

type HeaderProps = {
  export?: Function
}

function Header(props: HeaderProps): JSX.Element {
  return (
    <header className="header">
      <div></div>
      <div className="center-column">
        <h1>Meme Studio</h1>
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
