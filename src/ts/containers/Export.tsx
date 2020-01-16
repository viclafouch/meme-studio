import * as React from 'react'
import { useEffect, useState, useContext, RefObject } from 'react'
import Modal from '@components/Modal/Modal'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { EditorContext, EditorState } from '@store/EditorContext'
import { wait } from '@utils/index'

type ExportProps = {
  onClose: Function
}

function Export(props: ExportProps): JSX.Element {
  const [isLoading, setIsLoading]: [boolean, Function] = useState<boolean>(true)
  const [, , canvasRef]: [EditorState, Function, RefObject<HTMLCanvasElement>] = useContext(EditorContext)
  const [img, setImg]: [string, Function] = useState<string>('')

  useEffect(() => {
    ;(async (): Promise<void> => {
      const dataUrl: string = canvasRef.current.toDataURL()
      setImg(dataUrl)
      await wait()
      setIsLoading(false)
    })()
  }, [])

  const handleClose = (): void => {
    props.onClose()
    setImg(null)
  }

  return (
    <Modal onClose={handleClose} isLoading={isLoading}>
      <div className="export">
        <img src={img} className="meme-img" />
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
