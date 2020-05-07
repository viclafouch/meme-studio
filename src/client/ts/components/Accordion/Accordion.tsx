import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState, useRef, useLayoutEffect, useImperativeHandle } from 'react'
import { wait } from '@shared/utils'
import './accordion.scss'

const durationAccordion = 600

type AccordionProps = {
  title: string
  children: React.ReactNode
  removeText: Function
  duplicateText: Function
  afterOpening?: Function
  afterImmediateOpening?: Function
  defaultOpened: boolean
}

const Accordion = React.forwardRef((props: AccordionProps, ref: any) => {
  const { t } = useTranslation()
  const [isActive, setIsActive]: [boolean, Function] = useState<boolean>(props.defaultOpened)
  const [currentHeight, setCurrentHeight]: [string, Function] = useState<string>(props.defaultOpened ? 'inherit' : '0px')
  const content = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    content.current.style.overflow = 'hidden'
    setCurrentHeight(isActive ? `${content.current.scrollHeight}px` : '0px')
    if (isActive) props.afterImmediateOpening && props.afterImmediateOpening()
    const timeout = setTimeout(() => {
      if (isActive) {
        content.current.style.overflow = 'visible'
        setCurrentHeight('inherit')
        props.afterOpening && props.afterOpening()
      }
    }, durationAccordion)
    return (): void => {
      clearTimeout(timeout)
    }
  }, [isActive])

  useImperativeHandle(ref, () => ({
    open: async (): Promise<void> => {
      setIsActive(true)
      await wait(durationAccordion)
    },
    close: (): void => setIsActive(false)
  }))

  const handleOpen = (e: React.MouseEvent): void => {
    e.preventDefault()
    e.stopPropagation()
    setIsActive(!isActive)
  }

  const handleRemoveText = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
    e.stopPropagation()
    props.removeText()
  }

  const handleDuplicate = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
    e.stopPropagation()
    props.duplicateText()
  }

  const cssVar = { '--accordion-duration': durationAccordion + 'ms' } as React.CSSProperties

  return (
    <section className={`accordion ${isActive ? 'accordion-active' : ''}`} style={cssVar}>
      <div className="accordion-trigger" onClick={handleOpen}>
        <p className="accordion-title">{props.title}</p>
        <div>
          <button
            data-tooltip={t('attr.duplicate')}
            aria-label={t('attr.duplicate')}
            className="accordion-remove-text"
            onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => handleDuplicate(e)}
          >
            <FontAwesomeIcon icon={['fas', 'clone']} />
          </button>
          <button
            data-tooltip={t('attr.delete')}
            aria-label={t('attr.delete')}
            className="accordion-remove-text"
            onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => handleRemoveText(e)}
          >
            <FontAwesomeIcon icon={['fas', 'trash-alt']} />
          </button>
        </div>
      </div>
      <div className="accordion-content" ref={content} style={{ maxHeight: `${currentHeight}` }}>
        {props.children}
      </div>
    </section>
  )
})

export default Accordion
