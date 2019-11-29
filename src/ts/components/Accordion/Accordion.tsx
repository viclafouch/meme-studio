import * as React from 'react'
import { useState, useRef, useLayoutEffect, useEffect } from 'react'
import './accordion.scss'

type AccordionProps = {
  title: string
  children: React.ReactNode
}

function Accordion(props: AccordionProps): JSX.Element {
  const [isActive, setIsActive] = useState<boolean>(false)
  const [currentHeight, setCurrentHeight] = useState<string>('0px')
  const content = useRef<any>(null)

  useEffect(() => {
    setCurrentHeight(isActive ? `${content.current.scrollHeight}px` : '0px')
    const timeout = setTimeout(() => {
      if (isActive) setCurrentHeight('inherit')
    }, 600)
    return (): void => {
      clearTimeout(timeout)
    }
  }, [isActive])

  return (
    <section className={`Accordion ${isActive ? 'accordion-active' : ''}`}>
      <button className="accordion-button" onClick={(): void => setIsActive(!isActive)}>
        <p className="accordion-title">{props.title}</p>
      </button>
      <div className="accordion-content" ref={content} style={{ maxHeight: `${currentHeight}` }}>
        {props.children}
      </div>
    </section>
  )
}

export default Accordion
