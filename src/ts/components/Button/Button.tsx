import * as React from 'react'
import './button.scss'

function Button(props: any): JSX.Element {
  return (
    <button {...props} onClick={props.onClick} className={'button ' + (props.className || '')}>
      {props.children}
    </button>
  )
}

export default Button
