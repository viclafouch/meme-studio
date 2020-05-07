import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState, useLayoutEffect, useImperativeHandle } from 'react'
import './accordion.scss'

type AccordionProps = {
  title: string
  children: React.ReactNode
  removeText: Function
  duplicateText: Function
  afterOpening?: Function
  defaultOpened: boolean
}

const Accordion = React.forwardRef((props: AccordionProps, ref: any) => {
  const { t } = useTranslation()
  const [isActive, setIsActive]: [boolean, Function] = useState<boolean>(props.defaultOpened)

  useLayoutEffect(() => {
    if (isActive) props.afterOpening && props.afterOpening()
  }, [isActive])

  useImperativeHandle(ref, () => ({
    open: (): void => setIsActive(true),
    close: (): void => setIsActive(false)
  }))

  const handleOpen = (e: React.MouseEvent): void => {
    e.preventDefault()
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

  return (
    <section className={`accordion ${isActive ? 'accordion-active' : ''}`}>
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
      <div className="accordion-content" style={{ height: !isActive ? '0px' : 'auto' }}>
        {props.children}
      </div>
    </section>
  )
})

export default Accordion
