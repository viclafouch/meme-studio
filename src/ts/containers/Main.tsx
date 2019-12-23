import * as React from 'react'
import { useState, useEffect, useContext, useRef } from 'react'
import { ReactSVG } from 'react-svg'
import Studio from './Studio'
import Header from '@components/Header/Header'
import Intro from './Intro'
import Export from './Export'
import { DefaultContext } from '@store/DefaultContext'
import { FatalError } from '@components/ErrorBoundary/ErrorBoundary'
import { wait } from '@utils/index'
import { useMemes } from '@shared/hooks'

function Main(): JSX.Element {
  const canvasRef = useRef(null)
  const { fetchNextMemes } = useMemes()
  const [{ onStudio }] = useContext<any>(DefaultContext)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isError, setIsError] = useState<boolean>(false)
  const [isModalExportOpen, setIsModalExportOpen] = useState(false)

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
            <Studio ref={canvasRef} />
          </div>
        </div>
      )}

      {isModalExportOpen && <Export onClose={(): void => setIsModalExportOpen(false)} canvas={canvasRef} />}
    </main>
  )
}

export default Main
