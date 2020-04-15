import * as React from 'react'
import { useState, useEffect } from 'react'
import { FatalError } from '@client/components/ErrorBoundary/ErrorBoundary'
import { useMemes, useEditor } from '@client/ts/shared/hooks'
import { UseEditorInt } from '../shared/validators'
import Export from './Export'
import Router from '../routes'
import { useLocation } from 'react-router-dom'
import Loader from '@client/components/Loader/Loader'
import { wait } from '@shared/utils'
import { setLocalStorage } from '../utils'
import { hasRecoverVersion } from '@client/utils/helpers'

function Main(): JSX.Element {
  const { pathname } = useLocation()
  const { fetchNextMemes } = useMemes()
  const [{ isExportModalActive }]: [UseEditorInt, Function] = useEditor()
  const [isLoading, setIsLoading] = useState<boolean>(() => {
    if (pathname === '/' || pathname === '/create') {
      if ((pathname === '/' && window.localStorage.getItem('lastMemes')) || (pathname === '/create' && hasRecoverVersion())) {
        return false
      }
      return true
    }
    return false
  })
  const [isError, setIsError] = useState<boolean>(false)

  useEffect(() => {
    ;(async (): Promise<void> => {
      try {
        const memes = await fetchNextMemes()
        setLocalStorage({
          lastMemes: memes.slice(0, 3),
        })
        await wait(1000)
      } catch (error) {
        if (error.name !== 'AbortError') console.warn(error)
        setIsError(true)
      } finally {
        setIsLoading(false)
      }
    })()
  }, [])

  return (
    <main className="main-wrapper">
      {isLoading ? <Loader /> : isError ? <FatalError /> : <Router />}
      {isExportModalActive && <Export />}
    </main>
  )
}

export default Main
