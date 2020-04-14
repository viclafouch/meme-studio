import * as React from 'react'
import { useContext } from 'react'
import Button from '@client/components/Button/Button'
import Meme from '@client/ts/shared/models/Meme'
import { DefaultContext, DefaultState } from '@client/store/DefaultContext'
import { useMemes } from '@client/ts/shared/hooks'
import { useTranslation } from 'react-i18next'
import LangSelector from '@client/components/LangSelector/LangSelector'
import Footer from '@client/components/Footer/Footer'
import { Link } from 'react-router-dom'

function Intro(): JSX.Element {
  const { t } = useTranslation()
  const { memes } = useMemes()
  const [, dispatch]: [DefaultState, Function] = useContext(DefaultContext)

  return (
    <div className="page intro">
      <LangSelector />
      <div className="content-one">
        <div className="intro-title">
          <h1>Meme Studio</h1>
          <p>{t('intro.description')}</p>
        </div>
        <div className="intro-content">
          <Link to="/create">
            <Button className="intro-get-started-btn ld ld-fall-ttb-in" big>
              {t('intro.getStarted')}
            </Button>
          </Link>

          <ul className="intro-last-memes">
            {memes.slice(0, 3).map((meme: Meme, index: number) => (
              <li key={index}>
                <article className="intro-last-memes-article">
                  <img src={meme.url()} alt={meme.name} />
                </article>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Intro
