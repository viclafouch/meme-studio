import React from 'react'
import { VariantsProps, Wrapper } from './Tooltip.styled'

export type TooltipProps = {
  children: React.ReactNode
  text: string
  disabled?: boolean
} & VariantsProps

const Tooltip = ({
  children,
  text,
  position = 'top',
  disabled = false
}: TooltipProps) => {
  return (
    <Wrapper position={position} aria-disabled={disabled} data-tooltip={text}>
      {children}
    </Wrapper>
  )
}

export default Tooltip
