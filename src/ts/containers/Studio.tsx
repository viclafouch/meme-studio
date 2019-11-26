import * as React from 'react'
import { useState } from 'react'
import Meme from '@shared/models/Meme'

type StudioProps = {
  memes: Array<Meme>
}

function Studio({ memes }: StudioProps): JSX.Element {
  const [state, setState] = useState('memes');
  const [memeUrl, setMemeSelected] = useState(null)
  

  return (
    <div className="Studio">
      <div className="Studio__content">
        {
          memeUrl !== null ? <img src={memeUrl} width="100%" /> : <span>Select a template</span>
        }
      </div>
      <aside className="Studio__aside">
        {/* TODO: each time we update the state, it call the api, need to store meme urls */}
        <div className="buttons__actions">
          <button className={state === 'memes' ? 'active' : null} onClick={(): void => setState('memes')}>Memes</button>
          <button className={state === 'edit' ? 'active' : null} onClick={(): void => setState('edit')}>Edit</button>
        </div>
        {
          state === 'memes' ? <div className="gallery__memes">
            {memes.map(
              ({ id, url, name }: Meme): React.ReactNode => (
                <article key={id} data-id={id} className="meme__article">
                  <img onClick={(): void => setMemeSelected(url)} src={url} alt={name} />
                </article>
              )
            )}
          </div> : <div>Edit your meme</div>
        }
      </aside>
    </div>
  )
}

export default Studio
