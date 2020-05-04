import * as React from 'react'
import { useState, useEffect } from 'react'
import { FatalError } from '@client/components/ErrorBoundary/ErrorBoundary'
import { useMemes, useEditor } from '@client/ts/shared/hooks'
import { UseEditorInt } from '../shared/validators'
import Export from './Export'
import Router from '../routes'

function Main(): JSX.Element {
  const { fetchNextMemes } = useMemes()
  const [{ isExportModalActive }]: [UseEditorInt, Function] = useEditor()
  const [isError, setIsError] = useState<boolean>(false)

  useEffect(() => {
    ;(async (): Promise<void> => {
      try {
        await fetchNextMemes()
      } catch (error) {
        if (error.name !== 'AbortError') console.warn(error)
        setIsError(true)
      }
    })()
  }, [])

  return (
    <main className="main-wrapper">
      {isError ? <FatalError /> : <Router />}
      {isExportModalActive && <Export />}
    </main>
  )
}

export default Main
