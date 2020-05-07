import * as React from 'react'
import { useContext } from 'react'
import { DefaultContext, DefaultState } from '@client/store/DefaultContext'
import './button.scss'

interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  small?: boolean
  medium?: boolean
  big?: boolean
  onClick?: any
  isLoading: boolean
  disabled: boolean
  isSuccess: boolean
  transparent?: boolean
  color?: 'blue' | 'grey' | 'white'
}

function Button(props: ButtonProps): JSX.Element {
  const [{ theme }]: [DefaultState] = useContext(DefaultContext)
  const { big, small, medium, isLoading, isSuccess, transparent, color, ...rest } = props
  const className = ['button']
  if (small) className.push('button-small')
  else if (big) className.push('button-big')
  else className.push('button-medium')

  if (color) className.push(`button-${color}`)

  if (transparent) className.push('button-transparent')
  else if (isSuccess) className.push('button-success')

  className.push(props.className || '')

  return (
    <button {...rest} data-theme={theme} onClick={props.onClick} className={className.join(' ')}>
      {props.children}
      {isLoading && <span className="button-loader" />}
    </button>
  )
}

Button.defaultProps = {
  small: false,
  medium: true,
  big: false,
  transparent: false
} as ButtonProps

export default Button
