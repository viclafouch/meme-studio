import { useEffect, useState, useContext, useMemo, useCallback } from 'react'
import AbortController from 'abort-controller'
import { DefaultContext } from '@store/DefaultContext'
import { getMemes } from '@shared/api'
import {
  SET_MEMES,
  SET_CURSOR_MEMES,
  SET_HAS_NEXT_MEMES,
  ADD_TEXT,
  SET_HISTORY,
  REMOVE_TEXT,
  CUSTOM_TEXT
} from '@store/reducer/constants'
import Meme from '@shared/models/Meme'
import { EditorContext, EditorState } from '@store/EditorContext'
import { UseEditorInt } from '@shared/validators'
import { debounce } from '@utils/index'
import { TEXT_ADDED, TEXT_REMOVED } from '@shared/constants'

export const useEditor = (): [UseEditorInt, Function] => {
  const [state, dispatch]: [EditorState, Function] = useContext(EditorContext)

  const canUndo = useMemo(() => {
    const index: number = state.history.currentIndex - 1
    return !!state.history.items[index] && state.history.items.length > 1
  }, [state.history.items, state.history.currentIndex])

  const canRedo = useMemo(() => {
    const index: number = state.history.currentIndex + 1
    return !!state.history.items[index] && state.history.items.length > 1
  }, [state.history.items, state.history.currentIndex])

  const setToHistoryDebounced = useCallback(
    debounce((historyType: string) => dispatch({ type: SET_HISTORY, historyType }), 300),
    [dispatch]
  )

  const saveToEditor = useCallback(
    (args: any) => {
      dispatch(args)
      if (args.type === ADD_TEXT) setToHistoryDebounced(TEXT_ADDED)
      else if (args.type === CUSTOM_TEXT) setToHistoryDebounced(args.historyType)
      else if (args.type === REMOVE_TEXT) setToHistoryDebounced(TEXT_REMOVED)
    },
    [setToHistoryDebounced, dispatch]
  )

  return [{ ...state, canRedo, canUndo, saveToEditor }, dispatch]
}

export function useWindowWidth(): {
  isMinMdSize: boolean
  isMinLgSize: boolean
  isMinXlSize: boolean
  width: number
} {
  const [width, setWidth] = useState<number>(window.innerWidth)

  const isMinMdSize: boolean = useMemo(() => width >= 768, [width])
  const isMinLgSize: boolean = useMemo(() => width >= 992, [width])
  const isMinXlSize: boolean = useMemo(() => width >= 1200, [width])

  useEffect(() => {
    const handleResize = (): void => setWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return (): void => {
      window.removeEventListener('resize', handleResize)
    }
  })

  return { width, isMinMdSize, isMinLgSize, isMinXlSize }
}

export function useMemes(): {
  memes: Array<Meme>
  hasNextMemes: boolean
  fetchNextMemes: Function
} {
  const [{ memes, cursorMemes, hasNextMemes }, dispatch] = useContext<any>(DefaultContext)

  const fetchNextMemes = async (): Promise<Array<Meme>> => {
    if (!hasNextMemes) return memes
    const controller = new AbortController()
    const timeout: any = setTimeout(() => controller.abort(), 10000)
    const response = await getMemes(
      {
        ...(cursorMemes.after ? { after: cursorMemes.after } : null)
      },
      {
        signal: controller.signal
      }
    )

    dispatch({ type: SET_CURSOR_MEMES, cursorMemes: response.cursor })
    dispatch({ type: SET_HAS_NEXT_MEMES, hasNextMemes: !!response.cursor.after })
    clearTimeout(timeout)
    const newMemes = [...memes, ...response.memes]
    dispatch({ type: SET_MEMES, memes: newMemes })
    return newMemes
  }

  return {
    memes,
    hasNextMemes,
    fetchNextMemes
  }
}
