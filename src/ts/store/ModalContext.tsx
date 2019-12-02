import * as React from 'react'
import { createContext, useRef, useState, useEffect } from 'react'

export const ModalContext = createContext<any>(null)

export function ModalProvider(props: any): JSX.Element {
  const modalRef = useRef()
  const [context, setContext] = useState()

  useEffect(() => {
    setContext(modalRef.current)
  }, [])

  return (
    <>
      <ModalContext.Provider value={context}>{props.children}</ModalContext.Provider>
      <div ref={modalRef} id="modal" />
    </>
  )
}
