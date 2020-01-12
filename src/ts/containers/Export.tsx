import * as React from 'react'
import { useEffect, useState } from 'react'
import Modal from '@components/Modal/Modal'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

type ExportProps = {
  onClose: Function
}

function Export(props: ExportProps): JSX.Element {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [img, setImg] = useState<string>('')

  useEffect(() => {
    ;(async (): Promise<void> => {
      //
    })()
  }, [])

  const handleClose = (): void => {
    props.onClose()
    setImg(null)
  }

  return (
    <Modal onClose={handleClose} isLoading={isLoading}>
      <div className="export">
        <div className="meme-img">
          <img src={img} />
        </div>
        <div className="meme-actions-share">
          <a download="meme.png" href={img.replace(/^data:image\/png/, 'data:application/octet-stream')}>
            <button className="share-button" id="share-local">
              <FontAwesomeIcon icon={['fas', 'download']} />
            </button>
          </a>
          <button className="share-button social-share-button" id="share-twitter">
            <FontAwesomeIcon icon={['fab', 'twitter']} />
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default Export
