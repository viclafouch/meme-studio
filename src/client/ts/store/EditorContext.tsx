import * as React from 'react'
import { useReducer, createContext, RefObject, createRef, ReactNode, useMemo, useCallback } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import Meme from '@client/ts/shared/models/Meme'
import TextBox from '@client/ts/shared/models/TextBox'
import { DrawProperties, HistoryInt } from '@client/ts/shared/validators'
import EditorReducer, { Actions } from './reducer/editor'
import { TAB_GALLERY, TAB_CUSTOMIZATION } from '@client/ts/shared/constants'
import { SET_HISTORY, ADD_ITEM, CUSTOM_TEXT, REMOVE_ITEM, CUSTOM_IMAGE } from './reducer/constants'
import { hasRecoverVersion } from '@client/utils/helpers'
import ImageBox from '../shared/models/ImageBox'

export interface EditorState {
  itemIdSelected: string
  showTextAreas: boolean
  currentTab: 'TAB_GALLERY' | 'TAB_CUSTOMIZATION' | null
  memeSelected: Meme
  isExportModalActive: boolean
  canvasRef: RefObject<HTMLCanvasElement>
  texts: Array<TextBox>
  images: Array<ImageBox>
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
  itemIdSelected: null,
  showTextAreas: true,
  memeSelected: null,
  currentTab: !!hasRecoverVersion() ? TAB_CUSTOMIZATION : TAB_GALLERY,
  isExportModalActive: false,
  canvasRef: createRef(),
  texts: [],
  images: [],
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
  canErazeAll: boolean
  saveToEditor: (args: Actions) => void
}

export type EditorDispatch = React.Dispatch<Actions>

export const EditorContext = createContext<EditorState | any>(initialState)

export function EditorProvider({ children }: { children: ReactNode }): JSX.Element {
  const [state, updater] = useReducer(EditorReducer, initialState)

  const canUndo = useMemo(() => {
    const index: number = state.history.currentIndex - 1
    return !!state.history.items[index] && state.history.items.length > 0
  }, [state.history.items, state.history.currentIndex])

  const canRedo = useMemo(() => {
    const index: number = state.history.currentIndex + 1
    return !!state.history.items[index] && state.history.items.length > 0
  }, [state.history.items, state.history.currentIndex])

  const canErazeAll = canUndo || canRedo || state.texts.length > 0 || state.images.length > 0

  const [saveToHistory] = useDebouncedCallback((historyType: any) => {
    updater({ type: SET_HISTORY, historyType })
  }, 800)

  const saveToEditor = useCallback(
    ({ ...args }) => {
      updater(args)
      if ([ADD_ITEM, CUSTOM_TEXT, CUSTOM_IMAGE, REMOVE_ITEM].includes(args.type)) {
        saveToHistory(args.historyType)
      }
    },
    [updater, saveToHistory]
  )

  return (
    <EditorContext.Provider value={[{ ...state, canRedo, canUndo, canErazeAll, saveToEditor }, updater]}>
      {children}
    </EditorContext.Provider>
  )
}
