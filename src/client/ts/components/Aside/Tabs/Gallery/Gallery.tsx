import * as React from 'react'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Meme from '@client/ts/shared/models/Meme'
import { useTranslation } from 'react-i18next'
import { useInfinityMemes } from '@client/ts/shared/hooks/memes'
import Button from '@client/components/Button/Button'
import './gallery.scss'

function Gallery(): JSX.Element {
  const { t, i18n } = useTranslation()
  const { setQuery, query, memes, ref, handleScroll, isLoading, isError, retry } = useInfinityMemes()
  const [showLoader, setShowLoader] = useState<boolean>(true)

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>
    if (isLoading) {
      timeout = setTimeout(() => {
        setShowLoader(true)
      }, 1000)
    } else {
      setShowLoader(false)
    }
    return () => {
      clearTimeout(timeout)
    }
  }, [isLoading])

  return (
    <div className="gallery">
      <div className="gallery-search-field">
        <input
          type="text"
          spellCheck="false"
          autoComplete="off"
          placeholder={t('searchForAMeme')}
          value={query}
          onKeyDown={e => e.stopPropagation()}
          onChange={e => setQuery(e.target.value)}
        />
      </div>
      <div className="gallery-list-scrollable" onScroll={handleScroll} ref={ref}>
        <ul className="gallery-list">
          {memes.map(
            (meme: Meme): React.ReactNode => (
              <li key={meme.id} data-id={meme.id} className="gallery-item">
                <Link to={`/create/${meme.id}`} replace>
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
                </Link>
              </li>
            )
          )}
        </ul>
        {showLoader && (
          <div className="gallery-loading gallery-text-bottom">
            {t('loading')}
            <span className="dot">.</span>
            <span className="dot">.</span>
            <span className="dot">.</span>
          </div>
        )}
        {!isLoading && !isError && memes.length === 0 && (
          <div className="gallery-not-result gallery-text-bottom">{t('noResult')}</div>
        )}
        {isError && (
          <div className="gallery-error gallery-text-bottom">
            <p>{t('oops')}</p>
            <Button small onClick={retry}>
              {t('retry')}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Gallery
