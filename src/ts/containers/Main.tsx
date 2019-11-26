import * as React from 'react'
import { useState, useEffect } from 'react'
import Button from '../components/Button/Button'
import Meme from '../shared/models/Meme'

function Main(): JSX.Element {
  const [memes, setMemes] = useState([])
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    fetch('https://api.imgflip.com/get_memes')
      .then(response => response.json())
      .then(response => {
        if (!response.success) setIsError(true)
        else setMemes(response.data.memes.map((m: Meme) => new Meme(m)))
      })
  }, [])

  return (
    <main>
      <div className="main__header">
        <h1>Meme Studio</h1>
        <p>Create a meme from JPG, GIF or PNG images. Edit your image and make a meme.</p>
      </div>
      <div className="main__body">
        <Button className="get_started_button ld ld-fall-ttb-in">Get started</Button>
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
    </main>
  )
}

export default Main
