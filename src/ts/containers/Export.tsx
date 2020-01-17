import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { useEffect, useState, useContext } from 'react'
import Modal from '@components/Modal/Modal'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { EditorContext, EditorState } from '@store/EditorContext'
import { wait, fillText } from '@utils/index'
import Button from '@components/Button/Button'
import TextBox from '@shared/models/TextBox'

type ExportProps = {
  onClose: Function
}

function Export(props: ExportProps): JSX.Element {
  const { t } = useTranslation()
  const [isLoading, setIsLoading]: [boolean, Function] = useState<boolean>(true)
  const [img, setImg]: [string, Function] = useState<string>('')
  const [{ drawProperties, memeSelected, texts }]: [EditorState] = useContext(EditorContext)

  useEffect(() => {
    ;(async (): Promise<void> => {
      const { width: oldWidth, height: oldHeight } = drawProperties
      const textBox = texts.map((text: TextBox) => ({
        ...text,
        centerX: (text.centerX / oldWidth) * memeSelected.width,
        centerY: (text.centerY / oldHeight) * memeSelected.height,
        width: (text.width / oldWidth) * memeSelected.width,
        height: (text.height / oldHeight) * memeSelected.height
      }))
      const canvas = document.createElement('canvas')
      canvas.width = memeSelected.width
      canvas.height = memeSelected.height
      const ctx: CanvasRenderingContext2D = canvas.getContext('2d')
      const image = await drawProperties.image
      ctx.drawImage(image, 0, 0, memeSelected.width, memeSelected.height)
      for (const text of textBox) {
        const fontSize: number = text.fontSize
        const top: number = text.centerY
        const left: number = text.centerX
        const height: number = text.height
        const width: number = text.width
        fillText(text, ctx, width, height, fontSize, left, top)
      }
      const dataUrl: string = canvas.toDataURL()
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
        <h2 className="export-title">Prévisualisation</h2>
        <img src={img} className="meme-img" />
        <span className="meme-info-size">
          {memeSelected.width} x {memeSelected.height}
        </span>
        <div className="meme-actions-share">
          <a download="meme.png" href={img.replace(/^data:image\/png/, 'data:application/octet-stream')}>
            <Button className="button-export">
              <FontAwesomeIcon icon={['fas', 'arrow-circle-down']} className="icon-arrow-circle-down" />
              {t('download')}
            </Button>
          </a>
        </div>
      </div>
    </Modal>
  )
}

export default Export
