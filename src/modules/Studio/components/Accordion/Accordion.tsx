'use client'

import React from 'react'
import { css } from '@styled-system/css'
import { Box, Center } from '@styled-system/jsx'
import { useIsomorphicLayoutEffect } from '@viclafouch/meme-studio-utilities/hooks'

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
    <section
      className={css({
        w: 'full',
        '& + &': {
          borderTop: '1px solid rgba(255, 255, 255, 0.478)'
        }
      })}
    >
      <header
        className={css({
          justifyContent: 'space-between',
          alignItems: 'center',
          display: 'flex',
          p: '5',
          w: 'full',
          bgColor: 'secondary.light',
          cursor: 'pointer',
          color: 'zinc.300'
        })}
        onKeyDown={onToggle}
        tabIndex={0}
        role="button"
        onClick={handleToggle}
      >
        <p
          className={css({
            lineClamp: 1,
            whiteSpace: 'nowrap',
            h: '1rem',
            textOverflow: 'ellipsis',
            maxWidth: '60%',
            fontWeight: '600',
            fontSize: 'xs',
            overflow: 'hidden'
          })}
        >
          {title}
        </p>
        {action ? <Center>{action}</Center> : null}
      </header>
      <Box
        className={css({
          overflow: 'hidden',
          transition: 'max-height 600ms ease',
          willChange: 'max-height',
          bg: 'secondary'
        })}
        ref={content}
        style={{ maxHeight: currentHeight }}
        onTransitionEnd={handleTransitionEnd}
      >
        {children}
      </Box>
    </section>
  )
}

export default Accordion
