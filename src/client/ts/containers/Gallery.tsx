import * as React from 'react'
import { useState, useCallback, RefObject, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Header from '@client/components/Header/Header'
import Button from '@client/components/Button/Button'
import Footer from '@client/components/Footer/Footer'
import { useMemes } from '../shared/hooks'
import Meme from '../shared/models/Meme'
import { StudioAsync } from '../routes'
import '@client/scss/pages/gallery.scss'

function Gallery(): JSX.Element {
  const { t } = useTranslation()
  const { memes, fetchNextMemes, hasNextMemes } = useMemes()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const scrollerRef: RefObject<HTMLElement> = useRef(null)

  const handleScroll = useCallback(async () => {
    const isAtBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 100
    if (isAtBottom && !isLoading && hasNextMemes) {
      try {
        setIsLoading(true)
        await fetchNextMemes()
      } catch (error) {
        console.warn(error)
      } finally {
        setIsLoading(false)
      }
    }
  }, [fetchNextMemes, isLoading, hasNextMemes])

  useEffect(() => {
    handleScroll()
    window.addEventListener('scroll', handleScroll, false)
    return (): void => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [handleScroll])

  return (
    <div className="page gallery" id="test">
      <Header />
      <div className="content-one">
        <section className="gallery-body" ref={scrollerRef}>
          <div className="container">
            <h1>{t('gallery.minTitle')}</h1>
          </div>
          <ul className="container">
            {memes.map(
              (meme: Meme): React.ReactNode => (
                <li key={meme.id} data-id={meme.id} className="gallery-item">
                  <Link to={`/create/${meme.id}`}>
                    <picture>
                      <source srcSet={meme.url('.webp')} type="image/webp" />
                      <source srcSet={meme.url()} type="image/jpeg" />
                      <img loading="lazy" width={meme.width} height={meme.height} src={meme.url()} alt={meme.name} />
                    </picture>
                    <h3>{meme.name}</h3>
                  </Link>
                </li>
              )
            )}
          </ul>
          {!hasNextMemes && (
            <div className="cta-end container">
              <h2> {t('titles.titleA')}</h2>
              <Link to="/create">
                <Button color="blue" onMouseOver={(): void => StudioAsync.preload()} big tabIndex={-1}>
                  {t('makeMyMeme')}
                </Button>
              </Link>
            </div>
          )}
        </section>
      </div>
      <Footer />
    </div>
  )
}

export default Gallery
