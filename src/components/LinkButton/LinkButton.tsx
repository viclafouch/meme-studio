import * as React from 'react'
import { BaseButtonProps } from '@components/Button/Button.types'
import Styled from '../Button/Button.styled'

export type LinkButtonProps = BaseButtonProps &
  React.ComponentPropsWithoutRef<'a'>

const LinkButton = React.forwardRef(
  (
    {
      rounded = true,
      fullWidth = false,
      children,
      startAdornment = null,
      color = 'primary',
      ...restProps
    }: LinkButtonProps,
    ref: React.ForwardedRef<HTMLAnchorElement>
  ) => {
    return (
      <Styled.Button
        $fullWidth={fullWidth}
        $rounded={rounded}
        $color={color}
        as="a"
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

export default LinkButton
