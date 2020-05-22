import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState, useRef, useLayoutEffect, useCallback } from 'react'
import './accordion.scss'

const durationAccordion = 600
const cssVar = { '--accordion-duration': durationAccordion + 'ms' } as React.CSSProperties

type AccordionProps = {
  id: string
  type: 'text' | 'image'
  title: string
  defaultOpened: boolean
  children: React.ReactNode
  onToggle: (id: string, opened: boolean) => void
  onRemove?: (type: 'text' | 'image', id: string) => void
  onDuplicate?: (type: 'text' | 'image', id: string) => void
}

const Accordion = (props: AccordionProps): JSX.Element => {
  const { t } = useTranslation()
  const [currentHeight, setCurrentHeight] = useState<number | 'none'>(props.defaultOpened ? 'none' : 0)
  const content = useRef<HTMLDivElement>(null)

  const { onRemove, onDuplicate, type, id } = props

  useLayoutEffect(() => {
    if (currentHeight === 'none' || content.current.scrollHeight) {
      setCurrentHeight(props.defaultOpened ? content.current.scrollHeight : 0)
    }
  }, [props.defaultOpened, setCurrentHeight, currentHeight])

  const handleRemove = useCallback(
    (e: React.MouseEvent): void => {
      e.stopPropagation()
      onRemove && onRemove(type, id)
    },
    [onRemove, id, type]
  )

  const handleDuplicate = useCallback(
    (e: React.MouseEvent): void => {
      e.stopPropagation()
      onDuplicate && onDuplicate(type, id)
    },
    [onDuplicate, type, id]
  )

  return (
    <section className={`accordion ${props.defaultOpened ? 'accordion-active' : ''}`} style={cssVar}>
      <div className="accordion-trigger" onClick={(): void => props.onToggle(props.id, !props.defaultOpened)}>
        <p className="accordion-title">{props.title}</p>
        <div>
          {props.onDuplicate && (
            <button
              data-tooltip={t('attr.duplicate')}
              aria-label={t('attr.duplicate')}
              className="accordion-remove-text"
              onClick={handleDuplicate}
            >
              <FontAwesomeIcon icon={['fas', 'clone']} />
            </button>
          )}
          {props.onRemove && (
            <button
              data-tooltip={t('attr.delete')}
              aria-label={t('attr.delete')}
              className="accordion-remove-text"
              onClick={handleRemove}
            >
              <FontAwesomeIcon icon={['fas', 'trash-alt']} />
            </button>
          )}
        </div>
      </div>
      <div className="accordion-content" ref={content} style={{ maxHeight: currentHeight }}>
        {props.children}
      </div>
    </section>
  )
}

export default Accordion
