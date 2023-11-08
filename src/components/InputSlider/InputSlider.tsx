import * as React from 'react'
import Styled from './input-slider.styled'

// eslint-disable-next-line react/display-name
const Button = React.forwardRef(
  <T extends React.ElementType = 'input'>(
    props: React.ComponentPropsWithoutRef<T>,
    ref:
      | ((instance: HTMLInputElement | null) => void)
      | React.RefObject<HTMLInputElement>
      | null
      | undefined
  ) => {
    return <Styled.Input type="range" ref={ref} {...props} />
  }
)

export default Button
