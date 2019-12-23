import { useEffect, useState, useContext } from 'react'
import AbortController from 'abort-controller'
import { DefaultContext } from '@store/DefaultContext'
import { getMemes } from '@shared/api'
import { SET_MEMES, SET_CURSOR_MEMES, SET_HAS_NEXT_MEMES } from '@store/reducer/constants'
import Meme from '@shared/models/Meme'

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
