import React from 'react'
import Styled from './Tooltip.styled'

export type TooltipProps = {
  children: React.ReactNode
  text: string
  position: 'left' | 'right' | 'top' | 'bottom'
}

const Tooltip = ({ children, text, position }: TooltipProps) => {
  return (
    <Styled.Wrapper $position={position} data-tooltip={text}>
      {children}
    </Styled.Wrapper>
  )
}

export default Tooltip
