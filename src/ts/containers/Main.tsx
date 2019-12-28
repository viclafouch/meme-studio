import * as React from 'react'
import { useState, useEffect, useContext } from 'react'
import { ReactSVG } from 'react-svg'
import Studio from './Studio'
import Header from '@components/Header/Header'
import Intro from './Intro'
import Export from './Export'
import { DefaultContext, DefaultState } from '@store/DefaultContext'
import { FatalError } from '@components/ErrorBoundary/ErrorBoundary'
import { wait } from '@utils/index'
import { useMemes } from '@shared/hooks'
import Tools from '@components/Tools/Tools'

function Main(): JSX.Element {
  const { fetchNextMemes } = useMemes()
  const [{ onStudio }]: [DefaultState] = useContext(DefaultContext)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isError, setIsError] = useState<boolean>(false)
  const [isModalExportOpen, setIsModalExportOpen] = useState<boolean>(false)

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
    <main className="Main">
      {isLoading && (
        <div className="is-loading-memes" aria-busy="true">
          <ReactSVG src="images/dual-ball.svg" wrapper="span" />
        </div>
      )}
      {isError && !isLoading && <FatalError />}
      {!isError && !isLoading && !onStudio && <Intro />}
      {!isError && !isLoading && onStudio && (
        <div className="wrapper-studio">
          <div className="ld ld-fall-ttb-in studio-header">
            <Header export={(): void => setIsModalExportOpen(true)} />
          </div>
          <div className="ld ld-float-btt-in studio-body">
            <Tools />
            <Studio />
          </div>
        </div>
      )}

      {isModalExportOpen && <Export onClose={(): void => setIsModalExportOpen(false)} />}
    </main>
  )
}

export default Main
