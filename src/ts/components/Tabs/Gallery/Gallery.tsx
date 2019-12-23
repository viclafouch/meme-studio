import * as React from 'react'
import { memo, useState, useCallback, useRef } from 'react'
import Meme from '@shared/models/Meme'
import './gallery.scss'
import { useMemes } from '@shared/hooks'
import { wait } from '@utils/index'

type GalleryProps = {
  onSelectMeme: Function
}

function Gallery({ onSelectMeme }: GalleryProps): JSX.Element {
  const { memes, fetchNextMemes, hasNextMemes } = useMemes()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const scrollerRef = useRef<HTMLUListElement>(null)

  const handleScroll = useCallback(async () => {
    const isAtBottom = scrollerRef.current.offsetHeight + scrollerRef.current.scrollTop >= scrollerRef.current.scrollHeight - 150
    if (isAtBottom && !isLoading && hasNextMemes) {
      try {
        setIsLoading(true)
        await wait(200)
        await fetchNextMemes()
      } catch (error) {
        console.warn(error)
      }
    }
  }, [fetchNextMemes, isLoading])

  return (
    <ul className="Gallery" onScroll={handleScroll} ref={scrollerRef}>
      {memes.map(
        (meme: Meme): React.ReactNode => (
          <li key={meme.id} data-id={meme.id} className="meme__item">
            <img
              loading="lazy"
              width={meme.width}
              height={meme.height}
              onClick={(): void => onSelectMeme(meme)}
              src={meme.url}
              alt={meme.name}
            />
          </li>
        )
      )}
    </ul>
  )
}

export default memo(Gallery)
