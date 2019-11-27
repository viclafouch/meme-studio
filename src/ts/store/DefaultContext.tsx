import * as React from 'react'
import { createContext } from 'react'
import DefaultReducer, { Actions } from './reducer/default'
import Meme from '@shared/models/Meme'

export interface State {
  onStudio: boolean
  memes: Array<Meme>
}

const initialState: State = {
  onStudio: false,
  memes: []
}

export const DefaultContext = createContext<State | any>(initialState)

export function DefaultProvider(props: any): JSX.Element {
  const [state, dispatch] = React.useReducer<React.Reducer<State, Actions>>(DefaultReducer, initialState)
  return <DefaultContext.Provider value={[state, dispatch]}>{props.children}</DefaultContext.Provider>
}
