import * as React from 'react'
import { useContext } from 'react'
import Button from '@components/Button/Button'
import Meme from '@shared/models/Meme'
import { DefaultContext, DefaultState } from '@store/DefaultContext'
import { SET_ON_STUDIO } from '@store/reducer/constants'
import { useMemes } from '@shared/hooks'
import { useTranslation } from 'react-i18next'

function Intro(): JSX.Element {
  const { t } = useTranslation()
  const { memes } = useMemes()
  const [, dispatch]: [DefaultState, Function] = useContext(DefaultContext)

  return (
    <div className="intro">
      <div className="intro-title">
        <h1>Meme Studio</h1>
        <p>{t('intro.description')}</p>
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
          {t('intro.getStarted')}
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
