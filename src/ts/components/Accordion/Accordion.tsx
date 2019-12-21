import * as React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState, useRef, useLayoutEffect, useImperativeHandle } from 'react'
import './accordion.scss'
import { wait } from '@utils/index'

type AccordionProps = {
  title: string
  children: React.ReactNode
  removeText: Function
  ref: any
}

const Accordion = React.forwardRef((props: AccordionProps, ref: any) => {
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

  useImperativeHandle(ref, () => ({
    open: async (): Promise<void> => {
      setIsActive(true)
      await wait(600)
    },
    close: (): void => setIsActive(false)
  }))

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
})

export default Accordion
