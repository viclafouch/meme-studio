import React from 'react'
import Styled from './Tooltip.styled'

export type TooltipProps = {
  children: React.ReactNode
  text: string
  disabled?: boolean
  position: 'left' | 'right' | 'top' | 'bottom'
}

const Tooltip = ({
  children,
  text,
  position,
  disabled = false
}: TooltipProps) => {
  return (
    <Styled.Wrapper
      $disabled={disabled}
      $position={position}
      data-tooltip={text}
    >
      {children}
    </Styled.Wrapper>
  )
}

export default Tooltip
