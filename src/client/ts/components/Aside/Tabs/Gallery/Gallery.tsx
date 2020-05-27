import * as React from 'react'
import { Link } from 'react-router-dom'
import Meme from '@client/ts/shared/models/Meme'
import { useTranslation } from 'react-i18next'
import { useInfinityMemes } from '@client/ts/shared/hooks/memes'
import './gallery.scss'

function Gallery(): JSX.Element {
  const { i18n } = useTranslation()
  const { setQuery, query, memes, ref, handleScroll } = useInfinityMemes()

  return (
    <div className="gallery">
      <div className="gallery-search-field">
        <input
          type="text"
          spellCheck="false"
          autoComplete="off"
          placeholder="Rechercher un meme"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
      </div>
      <ul className="gallery-list" onScroll={handleScroll} ref={ref}>
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
    </div>
  )
}

export default Gallery
