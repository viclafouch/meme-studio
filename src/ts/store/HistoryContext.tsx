import * as React from 'react'
import { createContext, useState, useCallback, useContext, useMemo } from 'react'
import { debounce } from '@utils/index'
import { EditorContext, EditorState } from './EditorContext'
import TextBox from '@shared/models/TextBox'
import { DrawProperties } from '@shared/validators'
import { SET_DRAW_PROPERTIES, SET_TEXTS } from './reducer/constants'

export const HistoryContext = createContext(null)

export const drawHistory = new Map()

interface HistoryInt {
  type: string
  texts: Array<TextBox>
  drawProperties: DrawProperties
}

export interface HistoryState {
  canUndo: boolean
  canRedo: boolean
}

export interface HistoryDispatcher {
  setToHistory: Function
  clearHistory: Function
  undoHistory: Function
  redoHistory: Function
}

export function HistoryProvider(props: any): JSX.Element {
  const [history, setHistory]: [Array<HistoryInt>, Function] = useState<HistoryInt[]>([])
  const [historyIndex, setHistoryIndex]: [number, Function] = useState<number>(-1)
  const [, dispatchEditor]: [EditorState, Function] = useContext(EditorContext)

  const setToHistory = useCallback(
    debounce(({ texts, drawProperties, type }: HistoryInt) => {
      let index: number
      if (historyIndex <= 0) index = 1
      else index = historyIndex + 1
      const historyUpdated = [...history].slice(0, index) as Array<HistoryInt>
      historyUpdated.push({ texts, drawProperties, type })
      setHistory(historyUpdated)
      setHistoryIndex(historyUpdated.length - 1)
    }, 500),
    [setHistory, setHistoryIndex, history, historyIndex]
  )

  const canUndo: boolean = useMemo(() => {
    const index: number = historyIndex - 1
    return !!history[index]
  }, [history, historyIndex])

  const canRedo: boolean = useMemo(() => {
    const index: number = historyIndex + 1
    return !!history[index]
  }, [history, historyIndex])

  const clearHistory = useCallback(() => {
    setHistory([])
    setHistoryIndex(-1)
  }, [setHistory, setHistoryIndex])

  const undoHistory = useCallback(() => {
    const historyUpdated = [...history] as Array<HistoryInt>
    const index: number = historyIndex - 1
    const previousItem: HistoryInt | undefined = historyUpdated[index]
    if (previousItem) {
      dispatchEditor({
        type: SET_DRAW_PROPERTIES,
        drawProperties: previousItem.drawProperties
      })
      dispatchEditor({
        type: SET_TEXTS,
        texts: previousItem.texts
      })
      setHistoryIndex(index)
    }
  }, [setHistory, history, historyIndex, setHistoryIndex])

  const redoHistory = useCallback(() => {
    const historyUpdated = [...history] as Array<HistoryInt>
    const index: number = historyIndex + 1
    const nextItem: HistoryInt | undefined = historyUpdated[index]
    if (nextItem) {
      dispatchEditor({
        type: SET_DRAW_PROPERTIES,
        drawProperties: nextItem.drawProperties
      })
      dispatchEditor({
        type: SET_TEXTS,
        texts: nextItem.texts
      })
      setHistoryIndex(index)
    }
  }, [setHistory, history, historyIndex, setHistoryIndex])

  return (
    <HistoryContext.Provider
      value={
        [
          { canUndo, canRedo },
          { setToHistory, clearHistory, undoHistory, redoHistory }
        ] as [HistoryState, HistoryDispatcher]
      }
    >
      {props.children}
    </HistoryContext.Provider>
  )
}
