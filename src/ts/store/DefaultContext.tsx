import * as React from 'react'
import { createContext, useReducer, createRef, RefObject } from 'react'
import DefaultReducer from './reducer/default'
import Meme from '@shared/models/Meme'

export interface DefaultState {
  onStudio: boolean
  modalRef: RefObject<HTMLDivElement>
  memes: Array<Meme>
  cursorMemes: {
    before: string
    after: string
  }
  hasNextMemes: boolean
}

const initialState: DefaultState = {
  onStudio: false,
  modalRef: createRef(),
  memes: [],
  cursorMemes: {
    before: null,
    after: null
  },
  hasNextMemes: true
}

export const DefaultContext = createContext<DefaultState | any>(initialState)

export function DefaultProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const [state, updater] = useReducer(DefaultReducer, initialState)
  return (
    <>
      <div ref={state.modalRef} id="modal" />
      <DefaultContext.Provider value={[state, updater]}>{children}</DefaultContext.Provider>
    </>
  )
}
