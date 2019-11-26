import * as React from 'react'
import { useState, useEffect } from 'react'
import ReactSVG from 'react-svg'
import Button from '@components/Button/Button'
import Studio from './Studio'
import Meme from '@shared/models/Meme'

function Main(): JSX.Element {
  const [memes, setMemes] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const [isOnStudio, setIsOnStudio] = useState(false)

  useEffect(() => {
    fetch('https://api.imgflip.com/get_memes')
      .then((response: Response): any => response.json())
      .then((response: any): void => {
        if (!response.success) setIsError(true)
        else setMemes(response.data.memes.map((m: Meme) => new Meme(m)))
      })
      .finally(async () => {
        await new Promise(resolve => setTimeout(resolve, 1000))
        setIsLoading(false)
      })
  }, [])

  return (
    <main>
      {isLoading ? (
        <div className="is-loading-memes" aria-busy="true">
          <ReactSVG src="images/dual-ball.svg" wrapper="span" />
        </div>
      ) : (
        <>
          <div className="main__header">
            <h1>Meme Studio</h1>
            <p>Create a meme from JPG, GIF or PNG images. Edit your image and make a meme.</p>
          </div>
          <div className="main__body">
            {!isOnStudio ? (
              <div className="main__body__intro">
                <Button className="get_started_button ld ld-fall-ttb-in" onClick={(): void => setIsOnStudio(true)}>
                  Get started
                </Button>
                <ul className="last-memes">
                  {memes.slice(0, 3).map((meme: Meme, index: number) => (
                    <li key={index}>
                      <article className="last-meme__article">
                        <img src={meme.url} alt={meme.name} />
                      </article>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="ld ld-power-on main__body__studio">
                <Studio memes={memes} />
              </div>
            )}
          </div>
        </>
      )}
    </main>
  )
}

export default Main
