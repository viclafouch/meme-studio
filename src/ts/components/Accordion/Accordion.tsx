import * as React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState, useRef, useLayoutEffect, useImperativeHandle } from 'react'
import './accordion.scss'
import { wait } from '@utils/index'

const durationAccordion = 600

type AccordionProps = {
  title: string
  children: React.ReactNode
  removeText: Function
  afterOpening?: Function
  afterImmediateOpening?: Function
  ref: any
}

const Accordion = React.forwardRef((props: AccordionProps, ref: any) => {
  const [isActive, setIsActive] = useState<boolean>(false)
  const [currentHeight, setCurrentHeight] = useState<string>('0px')
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
    setIsActive(!isActive)
  }

  const handleRemoveText = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
    e.stopPropagation()
    props.removeText()
  }

  const cssVar = { '--accordion-duration': durationAccordion + 'ms' } as React.CSSProperties

  return (
    <section className={`Accordion ${isActive ? 'accordion-active' : ''}`} style={cssVar}>
      <div className="accordion-trigger" onClick={handleOpen}>
        <p className="accordion-title">{props.title}</p>
        <button
          aria-label="Remove Text"
          className="accordion-remove-text"
          onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => handleRemoveText(e)}
        >
          <FontAwesomeIcon icon={['fas', 'trash-alt']} />
        </button>
      </div>
      <div className="accordion-content" ref={content} style={{ maxHeight: `${currentHeight}` }}>
        {props.children}
      </div>
    </section>
  )
})

export default Accordion
