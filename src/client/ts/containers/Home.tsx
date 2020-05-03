import * as React from 'react'
import { useMemo, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from 'react-router-dom'
import Button from '@client/components/Button/Button'
import Meme from '@client/ts/shared/models/Meme'
import { useMemes } from '@client/ts/shared/hooks'
import LangSelector from '@client/components/LangSelector/LangSelector'
import Footer from '@client/components/Footer/Footer'
import { TOGGLE_THEME } from '@client/store/reducer/constants'
import { shuffle } from '@client/utils/helpers'
import { DefaultState, DefaultContext } from '@client/store/DefaultContext'
import '../../scss/pages/home.scss'

function Home(): JSX.Element {
  const { t } = useTranslation()
  const { memes } = useMemes()
  const [{ theme }, dispatch]: [DefaultState, Function] = useContext(DefaultContext)
  const lastMemes = useMemo(() => shuffle(memes).slice(0, 3), memes)

  return (
    <div className="page home">
      <div className="top-actions">
        <Button
          className="theme-button"
          color="white"
          aria-label={theme === 'dark' ? t('attr.darkTheme') : t('attr.lightTheme')}
          data-theme={theme}
          small
          onClick={(): void =>
            dispatch({
              type: TOGGLE_THEME
            })
          }
        >
          {theme === 'dark' ? (
            <FontAwesomeIcon fixedWidth icon={['fas', 'sun']} />
          ) : (
            <FontAwesomeIcon fixedWidth icon={['fas', 'moon']} />
          )}
        </Button>
        <LangSelector />
      </div>
      <div className="content-one">
        <div className="home-title">
          <Link to="/">
            <img src="images/logo-meme-studio.png" hidden={theme === 'dark'} width={350} alt="Logo Meme Studio" />
            <img src="images/logo-meme-studio-dark.png" hidden={theme === 'light'} width={350} alt="Logo Meme Studio" />
          </Link>
          <p>{t('home.label')}</p>
        </div>
        <div className="home-content">
          <Link to="/create">
            <Button className="home-get-started-btn ld ld-fall-ttb-in" big>
              {t('home.getStarted')}
            </Button>
          </Link>
          <ul className="home-last-memes">
            {lastMemes.map((meme: Meme, index: number) => (
              <li key={index}>
                <article className="home-last-memes-article">
                  <img
                    src={meme.url()}
                    alt={meme.name}
                    width={176}
                    height={((176 / meme.width) * meme.height).toFixed(2)}
                    loading="eager"
                  />
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

export default Home
