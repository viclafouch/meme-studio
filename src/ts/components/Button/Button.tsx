import * as React from 'react'
import './button.scss'

function Button(props: any): JSX.Element {
  return (
    <button onClick={props.onClick} className={'button ' + (props.className || '')} id={props.id || ''}>
      {props.children}
    </button>
  )
}

export default Button
