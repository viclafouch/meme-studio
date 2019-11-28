import * as React from 'react'
import { useState, useEffect, useContext } from 'react'
import ReactSVG from 'react-svg'
import Studio from './Studio'
import Meme from '@shared/models/Meme'
import Header from '@components/Header/Header'
import Intro from './Intro'
import { DefaultContext, State } from '@store/DefaultContext'
import { SET_MEMES } from '@store/reducer/constants'

function Main(): JSX.Element {
  const [{ memes, onStudio }, dispatch] = useContext<any>(DefaultContext)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [_, setIsError] = useState<boolean>(false)

  useEffect(() => {
    fetch('https://api.imgflip.com/get_memes')
      .then((response: Response): any => response.json())
      .then((response: any): void => {
        if (!response.success) setIsError(true)
        else
          dispatch({
            type: SET_MEMES,
            memes: response.data.memes.map((m: Meme) => new Meme(m))
          })
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
      {!isLoading && !onStudio && <Intro />}
      {!isLoading && onStudio && (
        <div className="wrapper-studio">
          <div className="ld ld-fall-ttb-in studio-header">
            <Header />
          </div>
          <div className="ld ld-float-btt-in studio-body">
            <Studio memes={memes} />
          </div>
        </div>
      )}
    </main>
  )
}

export default Main
