import * as React from 'react'
import Button from '@client/components/Button/Button'
import Meme from '@client/ts/shared/models/Meme'
import { useMemes } from '@client/ts/shared/hooks'
import { useTranslation } from 'react-i18next'
import LangSelector from '@client/components/LangSelector/LangSelector'
import Footer from '@client/components/Footer/Footer'
import { Link } from 'react-router-dom'
import '../../scss/pages/home.scss'

function Intro(): JSX.Element {
  const { t } = useTranslation()
  const { memes } = useMemes()

  return (
    <div className="page home">
      <LangSelector />
      <div className="content-one">
        <div className="home-title">
          <h1>Meme Studio</h1>
          <p>{t('home.description')}</p>
        </div>
        <div className="home-content">
          <Link to="/create">
            <Button className="home-get-started-btn ld ld-fall-ttb-in" big>
              {t('home.getStarted')}
            </Button>
          </Link>
          <ul className="home-last-memes">
            {memes.slice(0, 3).map((meme: Meme, index: number) => (
              <li key={index}>
                <article className="home-last-memes-article">
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
