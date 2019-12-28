import * as React from 'react'
import { createContext, useRef, RefObject } from 'react'
import EditorReducer, { Actions } from './reducer/editor'
import Meme from '@shared/models/Meme'
import TextBox from '@shared/models/TextBox'
import { DrawProperties } from '@shared/validators'

export interface EditorState {
  textIdSelected: string
  showTextAreas: boolean
  memeSelected: Meme
  canvas: HTMLCanvasElement
  texts: Array<TextBox>
  drawProperties: DrawProperties
}

const initialState: EditorState = {
  textIdSelected: null,
  showTextAreas: true,
  memeSelected: null,
  canvas: null,
  texts: [],
  drawProperties: null
}

export const EditorContext = createContext<EditorState | any>(initialState)

export function EditorProvider(props: any): JSX.Element {
  const canvasRef: RefObject<HTMLCanvasElement> = useRef(null)
  const [state, dispatch] = React.useReducer<React.Reducer<EditorState, Actions>>(EditorReducer, initialState)
  return <EditorContext.Provider value={[state, dispatch, canvasRef]}>{props.children}</EditorContext.Provider>
}
