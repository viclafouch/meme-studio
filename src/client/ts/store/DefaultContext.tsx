import * as React from 'react'
import { createContext, useReducer, createRef, RefObject } from 'react'
import DefaultReducer from './reducer/default'
import Meme from '@client/ts/shared/models/Meme'

export interface DefaultState {
  onStudio: boolean
  modalRef: RefObject<HTMLDivElement>
  memes: Array<Meme>
  numPage: number
  hasNextMemes: boolean
}

const initialState: DefaultState = {
  onStudio: false,
  modalRef: createRef(),
  memes: [],
  numPage: 0,
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
