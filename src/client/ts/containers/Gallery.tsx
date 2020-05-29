import * as React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Header from '@client/components/Header/Header'
import Button from '@client/components/Button/Button'
import Footer from '@client/components/Footer/Footer'
import Meme from '../shared/models/Meme'
import { StudioAsync } from '../routes'
import { useInfinityMemes } from '../shared/hooks/memes'
import '@client/scss/pages/gallery.scss'

function Gallery(): JSX.Element {
  const { t, i18n } = useTranslation()
  const { memes, hasMore, isLoading, isError, retry } = useInfinityMemes({
    isWindow: true
  })

  return (
    <div className="page gallery">
      <Header />
      <div className="content-one">
        <section className="gallery-body">
          <div className="container">
            <h1>{t('gallery.minTitle')}</h1>
          </div>
          <div className="gallery-list-container container">
            <ul className="gallery-list">
              {memes.map(
                (meme: Meme): React.ReactNode => (
                  <li key={meme.id} data-id={meme.id} className="gallery-item">
                    <Link to={`/create/${meme.id}`}>
                      <picture>
                        <source srcSet={meme.url('.webp')} type="image/webp" />
                        <source srcSet={meme.url('.jpg')} type="image/jpeg" />
                        <img
                          loading="lazy"
                          width={meme.width}
                          height={meme.height}
                          src={meme.url('.jpg')}
                          alt={meme.name(i18n.language)}
                        />
                      </picture>
                      <h3>{meme.name(i18n.language)}</h3>
                    </Link>
                  </li>
                )
              )}
            </ul>
            {isLoading && <img src="/images/spinner.gif" className="spinner" alt="Loading" />}
            {!isLoading && isError && (
              <div className="gallery-error">
                <p>{t('oops')}</p>
                <Button small onClick={retry}>
                  {t('retry')}
                </Button>
              </div>
            )}
            {!hasMore && !isError && !isLoading && (
              <div className="cta-end container">
                <h2> {t('titles.titleA')}</h2>
                <Link to="/create">
                  <Button color="blue" onMouseOver={StudioAsync.preload} big tabIndex={-1}>
                    {t('makeMyMeme')}
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </section>
      </div>
      <Footer />
    </div>
  )
}

export default Gallery
