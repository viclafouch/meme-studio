import { useEffect, useState, useContext, useMemo } from 'react'
import AbortController from 'abort-controller'
import { DefaultContext } from '@store/DefaultContext'
import { getMemes } from '@shared/api'
import {
  SET_MEMES,
  SET_CURSOR_MEMES,
  SET_HAS_NEXT_MEMES,
  SET_TEXTS,
  SET_MEME_SELECTED,
  SET_TEXT_ID_SELECTED
} from '@store/reducer/constants'
import Meme from '@shared/models/Meme'
import { HistoryContext, HistoryState, HistoryDispatcher } from '@store/HistoryContext'
import { EditorState, EditorContext } from '@store/EditorContext'
import { DrawProperties } from '@shared/validators'
import { createText } from '@shared/config-editor'
import { INITIAL } from '@shared/constants'

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

export function useInitStudio(): {
  initWithoutMeme: Function
  initWithMeme: Function
} {
  const { isMinLgSize } = useWindowWidth()
  const [, { setToHistory, clearHistory }]: [HistoryState, HistoryDispatcher] = useContext(HistoryContext)
  const [{ drawProperties, memeSelected }, dispatchEditor]: [EditorState, Function] = useContext(EditorContext)

  const initWithoutMeme = (): void => {
    clearHistory()
    document.title = `Meme Studio`
    dispatchEditor({
      type: SET_MEME_SELECTED,
      memeSelected: null
    })
  }

  const initWithMeme = (currentDrawProperty: DrawProperties = drawProperties, currentMemeSelected: Meme = memeSelected): void => {
    const texts = [...Array(currentMemeSelected.boxCount)].map(() => {
      const text = createText({
        centerY: 50,
        centerX: 340,
        height: 100,
        width: 680
      })
      text.height = text.base.height * currentDrawProperty.scale
      text.width = text.base.width * currentDrawProperty.scale
      text.centerY = text.base.centerY * currentDrawProperty.scale
      text.centerX = text.base.centerX * currentDrawProperty.scale
      return text
    })

    document.title = `Meme Studio - ${currentMemeSelected.name}`

    dispatchEditor({
      type: SET_TEXTS,
      texts
    })

    if (!isMinLgSize) {
      dispatchEditor({
        type: SET_TEXT_ID_SELECTED,
        textIdSelected: texts[0].id
      })
    }

    setToHistory({
      texts,
      drawProperties: currentDrawProperty,
      type: INITIAL
    })
  }

  return {
    initWithoutMeme,
    initWithMeme
  }
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
    dispatch({
      type: SET_CURSOR_MEMES,
      cursorMemes: response.cursor
    })
    dispatch({
      type: SET_HAS_NEXT_MEMES,
      hasNextMemes: !!response.cursor.after
    })
    clearTimeout(timeout)
    const newMemes = [...memes, ...response.memes]
    dispatch({
      type: SET_MEMES,
      memes: newMemes
    })
    return newMemes
  }

  return {
    memes,
    hasNextMemes,
    fetchNextMemes
  }
}
