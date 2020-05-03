import * as React from 'react'
import { useReducer, createContext, RefObject, createRef, ReactNode } from 'react'
import Meme from '@client/ts/shared/models/Meme'
import TextBox from '@client/ts/shared/models/TextBox'
import { DrawProperties, HistoryInt } from '@client/ts/shared/validators'
import EditorReducer from './reducer/editor'
import { TAB_CUSTOMIZATION, TAB_GALLERY } from '@client/ts/shared/constants'

export interface EditorState {
  textIdSelected: string
  showTextAreas: boolean
  currentTab: 'TAB_GALLERY' | 'TAB_CUSTOMIZATION' | null
  memeSelected: Meme
  isExportModalActive: boolean
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
  currentTab: TAB_GALLERY,
  isExportModalActive: false,
  canvasRef: createRef(),
  texts: [],
  drawProperties: null,
  innerDimensions: {
    width: 0,
    height: 0
  },
  history: {
    items: [],
    currentIndex: -1
  }
}

export const EditorContext = createContext<EditorState | any>(initialState)

export function EditorProvider({ children }: { children: ReactNode }): JSX.Element {
  const [state, updater] = useReducer(EditorReducer, initialState)
  return <EditorContext.Provider value={[state, updater]}>{children}</EditorContext.Provider>
}
