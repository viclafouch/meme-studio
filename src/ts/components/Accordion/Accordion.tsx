import * as React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState, useRef, useLayoutEffect } from 'react'
import './accordion.scss'

type AccordionProps = {
  title: string
  children: React.ReactNode
  removeText: Function
}

function Accordion(props: AccordionProps): JSX.Element {
  const [isActive, setIsActive] = useState<boolean>(false)
  const [currentHeight, setCurrentHeight] = useState<string>('0px')
  const content = useRef<any>(null)

  useLayoutEffect(() => {
    content.current.style.overflow = 'hidden'
    setCurrentHeight(isActive ? `${content.current.scrollHeight}px` : '0px')
    const timeout = setTimeout(() => {
      if (isActive) {
        content.current.style.overflow = 'visible'
        setCurrentHeight('inherit')
      }
    }, 600)
    return (): void => {
      clearTimeout(timeout)
    }
  }, [isActive])

  const handleRemoveText = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
    e.stopPropagation()
    props.removeText()
  }

  return (
    <section className={`Accordion ${isActive ? 'accordion-active' : ''}`}>
      <div className="accordion-trigger" onClick={(): void => setIsActive(!isActive)}>
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
}

export default Accordion
