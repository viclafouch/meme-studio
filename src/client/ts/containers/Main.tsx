import * as React from 'react'
import { useState, useEffect } from 'react'
import { ReactSVG } from 'react-svg'
import { useTranslation } from 'react-i18next'
import { FatalError } from '@client/components/ErrorBoundary/ErrorBoundary'
import { wait } from '@shared/utils'
import { useMemes, useEditor } from '@client/ts/shared/hooks'
import { UseEditorInt } from '../shared/validators'
import Export from './Export'
import Router from '../routes'

function Main(): JSX.Element {
  const { i18n } = useTranslation()
  const { fetchNextMemes } = useMemes()
  const [{ isExportModalActive }]: [UseEditorInt, Function] = useEditor()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isError, setIsError] = useState<boolean>(false)

  useEffect(() => {
    ;(async (): Promise<void> => {
      try {
        await fetchNextMemes()
      } catch (error) {
        if (error.name !== 'AbortError') console.warn(error)
        setIsError(true)
      } finally {
        await wait(1000)
        setIsLoading(false)
      }
    })()
  }, [])

  return (
    <main className="main-wrapper">
      {isLoading ? (
        <div className="is-loading-memes" aria-busy="true">
          {i18n.language === 'fr' ? (
            <ReactSVG src="images/dual-ball-fr.svg" wrapper="span" />
          ) : (
            <ReactSVG src="images/dual-ball-en.svg" wrapper="span" />
          )}
        </div>
      ) : isError ? (
        <FatalError />
      ) : (
        <Router />
      )}
      {isExportModalActive && <Export />}
    </main>
  )
}

export default Main
