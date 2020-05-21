import * as React from 'react'
import { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from 'react-router-dom'
import Button from '@client/components/Button/Button'
import LangSelector from '@client/components/LangSelector/LangSelector'
import Footer from '@client/components/Footer/Footer'
import { TOGGLE_THEME } from '@client/store/reducer/constants'
import { shuffle } from '@client/utils/helpers'
import { DefaultState, DefaultContext, DefaultDispatch } from '@client/store/DefaultContext'
import { StudioAsync } from '../routes'
import '@client/scss/pages/home.scss'

interface MemeExample {
  width: number
  height: number
  filename: string
}

export const lastExamples: Array<MemeExample> = shuffle([
  {
    height: 480,
    width: 640,
    filename: 'meme-0.png'
  },
  {
    height: 700,
    width: 568,
    filename: 'meme-1.png'
  },
  {
    height: 410,
    width: 500,
    filename: 'meme-2.png'
  },
  {
    height: 353,
    width: 502,
    filename: 'meme-3.png'
  },
  {
    height: 601,
    width: 480,
    filename: 'meme-4.png'
  },
  {
    height: 494,
    width: 500,
    filename: 'meme-5.png'
  },
  {
    height: 400,
    width: 600,
    filename: 'meme-6.png'
  },
  {
    height: 600,
    width: 600,
    filename: 'meme-7.png'
  },
  {
    height: 446,
    width: 600,
    filename: 'meme-8.png'
  },
  {
    height: 499,
    width: 600,
    filename: 'meme-9.png'
  }
]).slice(0, 3)

function Home(): JSX.Element {
  const { t } = useTranslation()
  const [{ theme }, dispatch]: [DefaultState, DefaultDispatch] = useContext(DefaultContext)

  return (
    <div className="page home live-background">
      <div className="top-actions">
        <LangSelector />
        <Button
          className="theme-button"
          color="white"
          aria-label={theme === 'dark' ? t('attr.darkTheme') : t('attr.lightTheme')}
          small
          transparent
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
      </div>
      <div className="content-one">
        <div className="home-title">
          <Link to="/">
            <picture hidden={theme === 'dark'}>
              <source srcSet="/images/logo-meme-studio.webp" type="image/webp" />
              <source srcSet="/images/logo-meme-studio.png" type="image/png" />
              <img loading="eager" width={350} src="/images/logo-meme-studio.png" alt="Logo Meme Studio" />
            </picture>
            <picture hidden={theme === 'light'}>
              <source srcSet="/images/logo-meme-studio-dark.webp" type="image/webp" />
              <source srcSet="/images/logo-meme-studio-dark.png" type="image/png" />
              <img loading="eager" width={350} src="/images/logo-meme-studio-dark.png" alt="Logo Meme Studio" />
            </picture>
          </Link>
          <p>{t('home.label')}</p>
        </div>
        <div className="home-content">
          <Link to="/create">
            <Button
              tabIndex={-1}
              onMouseOver={StudioAsync.preload}
              color="blue"
              className="home-get-started-btn ld ld-fall-ttb-in"
              big
            >
              {t('home.getStarted')}
            </Button>
          </Link>
          <ul className="home-last-memes">
            {lastExamples.map(({ width, height, filename }: MemeExample, index: number) => (
              <li key={index}>
                <article className="home-last-memes-article">
                  <picture>
                    <source srcSet={`/images/examples/${filename}`.replace('.png', '.webp')} type="image/webp" />
                    <source srcSet={`/images/examples/${filename}`} type="image/png" />
                    <img
                      loading="eager"
                      width={176}
                      height={((176 / width) * height).toFixed(2)}
                      src={`/images/examples/${filename}`}
                      alt={`Meme ${index + 1}`}
                    />
                  </picture>
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
