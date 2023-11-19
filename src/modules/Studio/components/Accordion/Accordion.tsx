import React from 'react'
import { useIsomorphicLayoutEffect } from '@shared/hooks/useIsomorphicLayoutEffect'
import Styled from './Accordion.styled'

export type AccordionProps = {
  children: React.ReactNode
  isOpened: boolean
  title: string
  onToggle: () => void
  onAfterOpen: () => void
  action?: React.ReactNode
}

const Accordion = ({
  children,
  isOpened,
  title,
  onToggle,
  onAfterOpen,
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
    onToggle()
  }

  const handleTransitionEnd = () => {
    if (isOpened) {
      onAfterOpen()
    }
  }

  return (
    <Styled.Section>
      <Styled.Header tabIndex={0} role="button" onClick={handleToggle}>
        <Styled.Title>{title}</Styled.Title>
        {action ? <Styled.Actions>{action}</Styled.Actions> : null}
      </Styled.Header>
      <Styled.Content
        ref={content}
        style={{ maxHeight: currentHeight }}
        onTransitionEnd={handleTransitionEnd}
      >
        {children}
      </Styled.Content>
    </Styled.Section>
  )
}

export default Accordion
