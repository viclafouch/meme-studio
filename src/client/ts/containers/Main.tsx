import * as React from 'react'
import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { FatalError } from '@client/components/ErrorBoundary/ErrorBoundary'
import { useMemes, useEditor } from '@client/ts/shared/hooks'
import { UseEditorInt } from '../shared/validators'
import Export from './Export'
import Router from '../routes'
import Loader from '@client/components/Loader/Loader'
import { wait } from '@shared/utils'
import { hasRecoverVersion } from '@client/utils/helpers'

function Main(): JSX.Element {
  const { pathname } = useLocation()
  const { fetchNextMemes } = useMemes()
  const [{ isExportModalActive }]: [UseEditorInt, Function] = useEditor()
  const [isLoading, setIsLoading] = useState<boolean>(pathname === '/' || (pathname === '/create' && !hasRecoverVersion()))
  const [isError, setIsError] = useState<boolean>(false)

  useEffect(() => {
    ;(async (): Promise<void> => {
      try {
        await fetchNextMemes()
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
