import * as React from 'react'
import { useState, useCallback, useRef, RefObject, useContext } from 'react'
import { Link } from 'react-router-dom'
import Meme from '@client/ts/shared/models/Meme'
import { DefaultContext, DefaultInt } from '@client/store/DefaultContext'
import { wait } from '@shared/utils'
import './gallery.scss'

function Gallery(): JSX.Element {
  const [{ memes, fetchNextMemes, hasNextMemes }]: [DefaultInt] = useContext(DefaultContext)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const scrollerRef: RefObject<HTMLUListElement> = useRef(null)

  const handleScroll = useCallback(async () => {
    const isAtBottom = scrollerRef.current.offsetHeight + scrollerRef.current.scrollTop >= scrollerRef.current.scrollHeight - 150
    if (isAtBottom && !isLoading && hasNextMemes) {
      try {
        setIsLoading(true)
        await wait(200)
        await fetchNextMemes()
      } catch (error) {
        console.warn(error)
      } finally {
        setIsLoading(false)
      }
    }
  }, [fetchNextMemes, isLoading, hasNextMemes])

  return (
    <ul className="gallery" onScroll={handleScroll} ref={scrollerRef}>
      {memes.map(
        (meme: Meme): React.ReactNode => (
          <li key={meme.id} data-id={meme.id} className="gallery-item">
            <Link to={`/create/${meme.id}`} replace>
              <picture>
                <source srcSet={meme.url('.webp')} type="image/webp" />
                <source srcSet={meme.url('.jpg')} type="image/jpeg" />
                <img loading="lazy" width={meme.width} height={meme.height} src={meme.url('.jpg')} alt={meme.name} />
              </picture>
            </Link>
          </li>
        )
      )}
    </ul>
  )
}

export default Gallery
