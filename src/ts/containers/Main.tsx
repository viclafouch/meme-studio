import * as React from 'react'
import AbortController from 'abort-controller'
import { useState, useEffect, useContext, useRef } from 'react'
import { ReactSVG } from 'react-svg'
import Studio from './Studio'
import Meme from '@shared/models/Meme'
import Header from '@components/Header/Header'
import Intro from './Intro'
import Export from './Export'
import { DefaultContext } from '@store/DefaultContext'
import { SET_MEMES } from '@store/reducer/constants'
import { FatalError } from '@components/ErrorBoundary/ErrorBoundary'

function Main(): JSX.Element {
  const canvasRef = useRef(null)
  const [{ memes, onStudio }, dispatch] = useContext<any>(DefaultContext)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isError, setIsError] = useState<boolean>(false)
  const [isModalExportOpen, setIsModalExportOpen] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10000)
    fetch('https://api.imgflip.com/get_memes', { signal: controller.signal })
      .then((response: Response): any => {
        clearTimeout(timeout)
        return response.json()
      })
      .then((response: any): void => {
        if (!response.success) throw new Error(response)
        else
          dispatch({
            type: SET_MEMES,
            memes: response.data.memes.map((m: Meme) => new Meme(m))
          })
      })
      .catch(e => {
        console.warn(e)
        setIsError(true)
      })
      .finally(async () => {
        await new Promise(resolve => setTimeout(resolve, 1000))
        setIsLoading(false)
      })
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
