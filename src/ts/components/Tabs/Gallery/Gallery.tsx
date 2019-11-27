import * as React from 'react'
import { memo } from 'react'
import Meme from '@shared/models/Meme'
import './gallery.scss'

type GalleryProps = {
  memes: Array<Meme>
  onSelectMeme: Function
}

function Gallery({ memes, onSelectMeme }: GalleryProps): JSX.Element {
  return (
    <ul className="Gallery">
      {memes.map(
        (meme: Meme): React.ReactNode => (
          <li key={meme.id} data-id={meme.id} className="meme__item">
            <img onClick={(): void => onSelectMeme(meme)} src={meme.url} alt={meme.name} />
          </li>
        )
      )}
    </ul>
  )
}

export default memo(Gallery)
