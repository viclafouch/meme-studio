import { useEffect, useState, useContext, useMemo, useCallback } from 'react'
import AbortController from 'abort-controller'
import { DefaultContext, DefaultState } from '@client/store/DefaultContext'
import { getMemes } from '@client/ts/shared/api'
import {
  SET_MEMES,
  ADD_TEXT,
  SET_HISTORY,
  REMOVE_TEXT,
  CUSTOM_TEXT,
  SET_HAS_NEXT_MEMES,
  SET_NUM_PAGE,
} from '@client/store/reducer/constants'
import Meme from '@client/ts/shared/models/Meme'
import { EditorContext, EditorState } from '@client/store/EditorContext'
import { UseEditorInt } from '@client/ts/shared/validators'
import { debounce } from '@client/utils/index'
import { TEXT_ADDED, TEXT_REMOVED } from '@client/ts/shared/constants'
import { useLocation } from 'react-router-dom'
import { wait } from '@shared/utils'

declare global {
  interface Window {
    ga: any
  }
}

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
  fetchNextMemes: Function
  numPage: number
  hasNextMemes: boolean
} {
  const [{ memes, numPage, hasNextMemes }, dispatch]: [DefaultState, Function] = useContext<any>(DefaultContext)

  const fetchNextMemes = async (): Promise<Array<Meme>> => {
    const controller = new AbortController()
    const timeout: any = setTimeout(() => controller.abort(), 10000)
    const currentPage = numPage + 1
    const response = await getMemes(currentPage, {
      signal: controller.signal,
    })
    dispatch({ type: SET_NUM_PAGE, numPage: currentPage })
    dispatch({ type: SET_HAS_NEXT_MEMES, hasNextMemes: currentPage < response.pages })
    clearTimeout(timeout)
    const newMemes = [...memes, ...response.memes]
    dispatch({ type: SET_MEMES, memes: newMemes })
    return newMemes
  }

  return {
    memes,
    fetchNextMemes,
    numPage,
    hasNextMemes,
  }
}

export function usePageViews(): void {
  const location = useLocation()
  useEffect(() => {
    ;(async (): Promise<void> => {
      while (typeof window.ga !== 'function') {
        console.log('awaiting for window.ga')
        await wait(50)
      }
      window.ga('send', {
        hitType: 'pageview',
        page: location.pathname,
      })
    })()
  }, [location])
}
