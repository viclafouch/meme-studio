import * as React from 'react'

import Styled from './button.styled'

interface ButtonProps<T extends React.ElementType> {
  as?: T
}

// eslint-disable-next-line react/display-name
const Button = React.forwardRef(
  <T extends React.ElementType = 'button'>(
    props: ButtonProps<T> &
      Omit<React.ComponentPropsWithoutRef<T>, keyof ButtonProps<T>>,
    ref:
      | ((instance: HTMLButtonElement | null) => void)
      | React.RefObject<HTMLButtonElement>
      | null
      | undefined
  ) => {
    const { children, ...rest } = props
    return (
      <Styled.Button ref={ref} {...rest}>
        {children}
      </Styled.Button>
    )
  }
)

Button.defaultProps = {
  as: 'button'
}

export default Button
