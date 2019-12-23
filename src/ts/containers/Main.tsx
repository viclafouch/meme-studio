import * as React from 'react'
import AbortController from 'abort-controller'
import { useState, useEffect, useContext, useRef } from 'react'
import { ReactSVG } from 'react-svg'
import Studio from './Studio'
import Header from '@components/Header/Header'
import Intro from './Intro'
import Export from './Export'
import { DefaultContext } from '@store/DefaultContext'
import { SET_MEMES } from '@store/reducer/constants'
import { FatalError } from '@components/ErrorBoundary/ErrorBoundary'
import { getMemes } from '@shared/api'
import { wait } from '@utils/index'

function Main(): JSX.Element {
  const canvasRef = useRef(null)
  const [{ memes, onStudio }, dispatch] = useContext<any>(DefaultContext)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isError, setIsError] = useState<boolean>(false)
  const [isModalExportOpen, setIsModalExportOpen] = useState(false)

  useEffect(() => {
    ;(async (): Promise<void> => {
      const controller: AbortController = new AbortController()
      const timeout: any = setTimeout(() => controller.abort(), 10000)
      try {
        const response = await getMemes({
          signal: controller.signal
        })
        clearTimeout(timeout)
        dispatch({
          type: SET_MEMES,
          memes: response.memes
        })
      } catch (error) {
        if (error.name !== 'AbortError') {
          clearTimeout(timeout)
          console.warn(error)
        }
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
            <Studio memes={memes} ref={canvasRef} />
          </div>
        </div>
      )}

      {isModalExportOpen && <Export onClose={(): void => setIsModalExportOpen(false)} canvas={canvasRef} />}
    </main>
  )
}

export default Main
