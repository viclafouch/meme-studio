import * as React from 'react'
import { createContext, useState, useCallback, useContext, useMemo } from 'react'
import { debounce, randomID } from '@utils/index'
import { EditorContext, EditorState } from './EditorContext'
import TextBox from '@shared/models/TextBox'
import { DrawProperties } from '@shared/validators'
import { SET_DRAW_PROPERTIES, SET_TEXTS, SET_TEXT_ID_SELECTED } from './reducer/constants'
import { INITIAL } from '@shared/constants'

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
  setToHistoryDebounced: Function
}

export function HistoryProvider(props: any): JSX.Element {
  const [history, setHistory]: [Array<HistoryInt>, Function] = useState<HistoryInt[]>([])
  const [historyIndex, setHistoryIndex]: [number, Function] = useState<number>(-1)
  const [{ drawProperties }, dispatchEditor]: [EditorState, Function] = useContext(EditorContext)

  const setToHistory = useCallback(
    ({ texts, drawProperties, type }: HistoryInt) => {
      let index: number
      if (historyIndex <= 0) index = 1
      else index = historyIndex + 1
      const historyUpdated = [...(type === INITIAL ? [] : history)].slice(0, index) as Array<HistoryInt>
      historyUpdated.push({ texts, drawProperties, type })
      setHistory(historyUpdated)
      setHistoryIndex(type === INITIAL ? 0 : historyUpdated.length - 1)
    },
    [setHistory, setHistoryIndex, history, historyIndex]
  )

  const setToHistoryDebounced = useCallback(
    debounce((args: HistoryInt) => setToHistory(args), 500),
    [setToHistory]
  )

  const canUndo: boolean = useMemo(() => {
    const index: number = historyIndex - 1
    return !!history[index] && history.length > 1
  }, [history, historyIndex])

  const canRedo: boolean = useMemo(() => {
    const index: number = historyIndex + 1
    return !!history[index] && history.length > 1
  }, [history, historyIndex])

  const clearHistory = useCallback(() => {
    setHistory([])
    setHistoryIndex(-1)
  }, [setHistory, setHistoryIndex])

  const checkNewSize = ({
    oldProperties,
    newProperties,
    texts
  }: {
    oldProperties: DrawProperties
    newProperties: DrawProperties
    texts: Array<TextBox>
  }): { newDrawProperties: DrawProperties; texts: Array<TextBox> } => {
    let drawProperties: DrawProperties
    if (oldProperties.scale !== newProperties.scale) {
      drawProperties = { ...newProperties }
      const oldWidth = oldProperties.width
      const oldHeight = oldProperties.height
      texts = texts.map((text: TextBox) => ({
        ...text,
        height: (text.height / oldHeight) * drawProperties.height,
        width: (text.width / oldWidth) * drawProperties.width,
        centerX: (text.centerX / oldWidth) * drawProperties.width,
        centerY: (text.centerY / oldHeight) * drawProperties.height
      }))
    } else {
      drawProperties = { ...oldProperties }
    }

    return {
      newDrawProperties: drawProperties,
      texts: texts.map((text: TextBox) => ({
        ...text,
        id: randomID()
      }))
    }
  }

  const undoHistory = useCallback(() => {
    const historyUpdated = [...history] as Array<HistoryInt>
    const index: number = historyIndex - 1
    const previousItem: HistoryInt | undefined = historyUpdated[index]

    if (previousItem) {
      const { newDrawProperties, texts } = checkNewSize({
        oldProperties: previousItem.drawProperties,
        newProperties: drawProperties,
        texts: [...previousItem.texts]
      })
      dispatchEditor({
        type: SET_DRAW_PROPERTIES,
        drawProperties: newDrawProperties
      })
      dispatchEditor({
        type: SET_TEXTS,
        texts
      })
      dispatchEditor({
        type: SET_TEXT_ID_SELECTED,
        textIdSelected: texts[index] ? texts[index].id : null
      })
      setHistoryIndex(index)
    }
  }, [setHistory, history, historyIndex, setHistoryIndex, drawProperties])

  const redoHistory = useCallback(() => {
    const historyUpdated = [...history] as Array<HistoryInt>
    const index: number = historyIndex + 1
    const nextItem: HistoryInt | undefined = historyUpdated[index]
    if (nextItem) {
      const { newDrawProperties, texts } = checkNewSize({
        oldProperties: nextItem.drawProperties,
        newProperties: drawProperties,
        texts: [...nextItem.texts]
      })
      dispatchEditor({
        type: SET_DRAW_PROPERTIES,
        drawProperties: newDrawProperties
      })
      dispatchEditor({
        type: SET_TEXTS,
        texts
      })
      dispatchEditor({
        type: SET_TEXT_ID_SELECTED,
        textIdSelected: texts[index] ? texts[index].id : null
      })
      setHistoryIndex(index)
    }
  }, [setHistory, history, historyIndex, setHistoryIndex, drawProperties])

  return (
    <HistoryContext.Provider
      value={
        [
          { canUndo, canRedo },
          { setToHistory, clearHistory, undoHistory, redoHistory, setToHistoryDebounced }
        ] as [HistoryState, HistoryDispatcher]
      }
    >
      {props.children}
    </HistoryContext.Provider>
  )
}
