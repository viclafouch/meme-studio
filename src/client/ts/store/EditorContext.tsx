import * as React from 'react'
import { useReducer, createContext, RefObject, createRef, ReactNode, useMemo, useCallback } from 'react'
import Meme from '@client/ts/shared/models/Meme'
import TextBox from '@client/ts/shared/models/TextBox'
import { DrawProperties, HistoryInt } from '@client/ts/shared/validators'
import EditorReducer from './reducer/editor'
import { TAB_GALLERY, TEXT_ADDED, TEXT_REMOVED, TAB_CUSTOMIZATION } from '@client/ts/shared/constants'
import { debounce } from '../utils'
import { SET_HISTORY, ADD_TEXT, CUSTOM_TEXT, REMOVE_TEXT } from './reducer/constants'
import { hasRecoverVersion } from '@client/utils/helpers'

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
  currentTab: !!hasRecoverVersion() ? TAB_CUSTOMIZATION : TAB_GALLERY,
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

export interface EditorInt extends EditorState {
  canUndo: boolean
  canRedo: boolean
  saveToEditor: Function
}

export const EditorContext = createContext<EditorState | any>(initialState)

export function EditorProvider({ children }: { children: ReactNode }): JSX.Element {
  const [state, updater] = useReducer(EditorReducer, initialState)

  const canUndo = useMemo(() => {
    const index: number = state.history.currentIndex - 1
    return !!state.history.items[index] && state.history.items.length > 1
  }, [state.history.items, state.history.currentIndex])

  const canRedo = useMemo(() => {
    const index: number = state.history.currentIndex + 1
    return !!state.history.items[index] && state.history.items.length > 1
  }, [state.history.items, state.history.currentIndex])

  const setToHistoryDebounced = useCallback(
    debounce((historyType: string) => updater({ type: SET_HISTORY, historyType }), 1000),
    [updater]
  )

  const saveToEditor = useCallback(
    ({ ...args }) => {
      updater(args)
      if (args.type === ADD_TEXT) setToHistoryDebounced(TEXT_ADDED)
      else if (args.type === CUSTOM_TEXT) setToHistoryDebounced(args.historyType)
      else if (args.type === REMOVE_TEXT) setToHistoryDebounced(TEXT_REMOVED)
    },
    [setToHistoryDebounced, updater]
  )

  return (
    <EditorContext.Provider value={[{ ...state, canRedo, canUndo, saveToEditor }, updater]}>{children}</EditorContext.Provider>
  )
}
