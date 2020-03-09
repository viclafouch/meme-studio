import * as React from 'react'
import './button.scss'

interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  small?: boolean
  medium?: boolean
  big?: boolean
  onClick?: any
  disabled: boolean
}

function Button(props: ButtonProps): JSX.Element {
  const { big, small, medium, ...rest } = props
  const className = ['button']
  if (small) className.push('button-small')
  else if (big) className.push('button-big')
  else className.push('button-medium')

  className.push(props.className || '')

  return (
    <button {...rest} onClick={props.onClick} className={className.join(' ')}>
      {props.children}
    </button>
  )
}

Button.defaultProps = {
  small: false,
  medium: true,
  big: false
} as ButtonProps

export default Button
