import * as React from 'react'
import { createContext } from 'react'
import EditorReducer, { Actions } from './reducer/editor'

export interface State {
  textIdSelected: string
}

const initialState: State = {
  textIdSelected: null
}

export const EditorContext = createContext<State | any>(initialState)

export function EditorProvider(props: any): JSX.Element {
  const [state, dispatch] = React.useReducer<React.Reducer<State, Actions>>(EditorReducer, initialState)
  return <EditorContext.Provider value={[state, dispatch]}>{props.children}</EditorContext.Provider>
}
