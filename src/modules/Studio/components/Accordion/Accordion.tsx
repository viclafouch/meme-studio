import React from 'react'
import { useIsomorphicLayoutEffect } from '@shared/hooks/useIsomorphicLayoutEffect'
import Styled from './Accordion.styled'

export type AccordionProps = {
  children: React.ReactNode
  isOpened: boolean
  title: string
  onToggle: (id: string) => void
  id: string
  action?: React.ReactNode
}

const Accordion = ({
  children,
  isOpened,
  title,
  onToggle,
  id,
  action = null
}: AccordionProps) => {
  const [currentHeight, setCurrentHeight] = React.useState<number>(0)
  const content = React.useRef<HTMLDivElement>(null)

  useIsomorphicLayoutEffect(() => {
    if (content.current) {
      setCurrentHeight(isOpened ? content.current.scrollHeight : 0)
    }
  }, [isOpened])

  const handleToggle = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault()
    onToggle(id)
  }

  return (
    <Styled.Section id={id}>
      <Styled.Header tabIndex={0} role="button" onClick={handleToggle}>
        <Styled.Title>{title}</Styled.Title>
        {action ? <Styled.Actions>{action}</Styled.Actions> : null}
      </Styled.Header>
      <Styled.Content ref={content} style={{ maxHeight: currentHeight }}>
        {children}
      </Styled.Content>
    </Styled.Section>
  )
}

export default Accordion
