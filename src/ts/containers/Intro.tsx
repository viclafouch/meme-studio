import * as React from 'react'
import { useContext } from 'react'
import Button from '@components/Button/Button'
import Meme from '@shared/models/Meme'
import { DefaultContext } from '@store/DefaultContext'
import { SET_ON_STUDIO } from '@store/reducer/constants'
import { useMemes } from '@shared/hooks'

function Intro(): JSX.Element {
  const { memes } = useMemes()
  const [_, dispatch] = useContext<any>(DefaultContext)

  return (
    <div className="intro">
      <div className="intro-title">
        <h1>Meme Studio</h1>
        <p>Create a meme from JPG, GIF or PNG images. Edit your image and make a meme.</p>
      </div>
      <div className="intro-content">
        <Button
          className="intro-get-started-btn ld ld-fall-ttb-in"
          onClick={(): void =>
            dispatch({
              type: SET_ON_STUDIO,
              onStudio: true
            })
          }
        >
          Get started
        </Button>
        <ul className="intro-last-memes">
          {memes.slice(0, 3).map((meme: Meme, index: number) => (
            <li key={index}>
              <article className="intro-last-memes-article">
                <img src={meme.url} alt={meme.name} />
              </article>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Intro
