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
import { Switch, Route } from 'react-router-dom'
import About from './About'

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
      {isLoading ? (
        <div className="is-loading-memes" aria-busy="true">
          <ReactSVG src="images/dual-ball.svg" wrapper="span" />
        </div>
      ) : isError ? (
        <FatalError />
      ) : (
        <Switch>
          <Route path="/about">
            <About />
          </Route>
          <Route path="/">{!onStudio ? <Intro /> : <Studio setIsModalExportOpen={setIsModalExportOpen} />}</Route>
        </Switch>
      )}
      {isModalExportOpen && <Export onClose={(): void => setIsModalExportOpen(false)} />}
    </main>
  )
}

export default Main
