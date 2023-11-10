/* eslint-disable react/require-default-props */
import * as React from 'react'
import Styled from './Button.styled'

export type ButtonProps = {
  rounded?: boolean
  fullWidth?: boolean
} & React.ComponentProps<'button'>

// eslint-disable-next-line react/display-name
const Button = React.forwardRef(
  (
    { rounded = true, fullWidth = false, children, ...restProps }: ButtonProps,
    ref: React.ForwardedRef<HTMLButtonElement>
  ) => {
    return (
      <Styled.Button
        $fullWidth={fullWidth}
        $rounded={rounded}
        ref={ref}
        {...restProps}
      >
        {children}
      </Styled.Button>
    )
  }
)

export default Button
