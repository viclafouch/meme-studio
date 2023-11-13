/* eslint-disable react/require-default-props */
import * as React from 'react'
import { BaseButtonProps } from '@components/Button/Button.types'
import Styled from './Button.styled'

export type ButtonProps = BaseButtonProps & React.ComponentProps<'button'>

// eslint-disable-next-line react/display-name
const Button = React.forwardRef(
  (
    {
      rounded = true,
      fullWidth = false,
      children,
      startAdornment = null,
      color = 'primary',
      ...restProps
    }: ButtonProps,
    ref: React.ForwardedRef<HTMLButtonElement>
  ) => {
    return (
      <Styled.Button
        $fullWidth={fullWidth}
        $rounded={rounded}
        $color={color}
        ref={ref}
        {...restProps}
      >
        {startAdornment ? (
          <span className="button-start-adornment">{startAdornment}</span>
        ) : null}
        {children}
      </Styled.Button>
    )
  }
)

export default Button
