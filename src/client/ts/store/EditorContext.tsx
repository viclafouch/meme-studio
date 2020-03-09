import * as React from 'react'
import { useReducer, createContext, RefObject, createRef, ReactNode } from 'react'
import Meme from '@client/shared/models/Meme'
import TextBox from '@client/shared/models/TextBox'
import { DrawProperties, HistoryInt } from '@client/shared/validators'
import EditorReducer from './reducer/editor'

export interface EditorState {
  textIdSelected: string
  showTextAreas: boolean
  memeSelected: Meme
  canvasRef: RefObject<HTMLCanvasElement>
  texts: Array<TextBox>
  drawProperties: DrawProperties
  innerDimensions: {
    width: number
    height: number
  }
  history: {
    items: Array<HistoryInt>
    currentIndex: number
  }
}

const initialState: EditorState = {
  textIdSelected: null,
  showTextAreas: true,
  memeSelected: null,
  canvasRef: createRef(),
  texts: [],
  drawProperties: null,
  innerDimensions: {
    width: 0,
    height: 0
  },
  history: {
    items: [],
    currentIndex: 0
  }
}

export const EditorContext = createContext<EditorState | any>(initialState)

export function EditorProvider({ children }: { children: ReactNode }): JSX.Element {
  const [state, updater] = useReducer(EditorReducer, initialState)
  return <EditorContext.Provider value={[state, updater]}>{children}</EditorContext.Provider>
}
