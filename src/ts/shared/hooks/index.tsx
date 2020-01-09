import { useEffect, useState, useContext } from 'react'
import AbortController from 'abort-controller'
import { DefaultContext } from '@store/DefaultContext'
import { getMemes } from '@shared/api'
import { SET_MEMES, SET_CURSOR_MEMES, SET_HAS_NEXT_MEMES, SET_TEXTS } from '@store/reducer/constants'
import Meme from '@shared/models/Meme'
import { HistoryContext, HistoryState, HistoryDispatcher } from '@store/HistoryContext'
import { EditorState, EditorContext } from '@store/EditorContext'
import { DrawProperties } from '@shared/validators'
import { createText } from '@shared/config-editor'
import { INITIAL } from '@shared/constants'

export function useWindowWidth(): number {
  const [width, setWidth] = useState<number>(window.innerWidth)

  useEffect(() => {
    const handleResize = (): void => setWidth(window.innerWidth)

    window.addEventListener('resize', handleResize)
    return (): void => {
      window.removeEventListener('resize', handleResize)
    }
  })

  return width
}

export function useInitStudio(): Function {
  const [, { setToHistory }]: [HistoryState, HistoryDispatcher] = useContext(HistoryContext)
  const [{ drawProperties, memeSelected }, dispatchEditor]: [EditorState, Function] = useContext(EditorContext)

  return (currentDrawProperty: DrawProperties = drawProperties, currentMemeSelected: Meme = memeSelected): void => {
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

    dispatchEditor({
      type: SET_TEXTS,
      texts
    })
    setToHistory({
      texts,
      drawProperties: currentDrawProperty,
      type: INITIAL
    })
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
