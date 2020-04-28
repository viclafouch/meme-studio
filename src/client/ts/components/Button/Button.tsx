import * as React from 'react'
import './button.scss'

interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  small?: boolean
  medium?: boolean
  big?: boolean
  onClick?: any
  isLoading: boolean
  disabled: boolean
  isSuccess: boolean
}

function Button(props: ButtonProps): JSX.Element {
  const { big, small, medium, isLoading, isSuccess, ...rest } = props
  const className = ['button']
  if (small) className.push('button-small')
  else if (big) className.push('button-big')
  else className.push('button-medium')

  if (isSuccess) className.push('button-success')

  className.push(props.className || '')

  rest.disabled = isLoading

  return (
    <button {...rest} onClick={props.onClick} className={className.join(' ')}>
      {props.children}
      {isLoading && <span className="button-loader" />}
    </button>
  )
}

Button.defaultProps = {
  small: false,
  medium: true,
  big: false
} as ButtonProps

export default Button
