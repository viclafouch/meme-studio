import * as React from 'react'
import { createContext, useReducer, createRef, RefObject, useLayoutEffect, useCallback } from 'react'
import { DefaultReducer, Actions } from './reducer/default'
import Meme from '@client/ts/shared/models/Meme'
import { getMemes } from '../shared/api'
import { SET_MEMES } from './reducer/constants'

export interface DefaultState {
  modalRef: RefObject<HTMLDivElement>
  memes: Array<Meme>
  numPage: number
  hasNextMemes: boolean
  theme: 'dark' | 'light'
}

const initialState: DefaultState = {
  modalRef: createRef(),
  memes: [],
  numPage: 0,
  hasNextMemes: true,
  theme: document.documentElement.getAttribute('data-theme') as 'dark' | 'light'
}

export type DefaultDispatch = React.Dispatch<Actions>

export const DefaultContext = createContext<DefaultState | any>(initialState)

export interface DefaultInt extends DefaultState {
  fetchNextMemes: () => void
}

export function DefaultProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const [state, updater] = useReducer(DefaultReducer, initialState)

  useLayoutEffect(() => {
    document.documentElement.setAttribute('data-theme', state.theme)
    localStorage.setItem('theme', state.theme)
  }, [state.theme])

  const fetchNextMemes = useCallback(async (): Promise<Array<Meme>> => {
    const controller = new AbortController()
    const timeout: any = setTimeout(() => controller.abort(), 10000)
    const currentPage = state.numPage + 1
    const response = await getMemes(currentPage, {
      signal: controller.signal
    })
    clearTimeout(timeout)
    const newMemes = [...state.memes, ...response.memes]
    updater({
      type: SET_MEMES,
      memes: newMemes,
      numPage: currentPage,
      hasNextMemes: currentPage < response.pages
    })
    return newMemes
  }, [state.numPage, updater, state.memes])

  return (
    <>
      <div ref={state.modalRef} id="modal" />
      <DefaultContext.Provider value={[{ ...state, fetchNextMemes }, updater]}>{children}</DefaultContext.Provider>
    </>
  )
}
