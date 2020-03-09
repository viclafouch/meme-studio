import * as React from 'react'
import { useContext } from 'react'
import Button from '@client/components/Button/Button'
import Meme from '@client/shared/models/Meme'
import { DefaultContext, DefaultState } from '@client/store/DefaultContext'
import { SET_ON_STUDIO } from '@client/store/reducer/constants'
import { useMemes } from '@client/shared/hooks'
import { useTranslation } from 'react-i18next'
import LangSelector from '@client/components/LangSelector/LangSelector'

function Intro(): JSX.Element {
  const { t } = useTranslation()
  const { memes } = useMemes()
  const [, dispatch]: [DefaultState, Function] = useContext(DefaultContext)

  return (
    <div className="intro">
      <LangSelector />
      <div className="intro-title">
        <h1>Meme Studio</h1>
        <p>{t('intro.description')}</p>
      </div>
      <div className="intro-content">
        <Button
          className="intro-get-started-btn ld ld-fall-ttb-in"
          big
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
