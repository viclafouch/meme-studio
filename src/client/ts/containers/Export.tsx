import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { useEffect, useState, useContext } from 'react'
import Modal from '@client/components/Modal/Modal'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { EditorContext, EditorState } from '@client/store/EditorContext'
import { fillText } from '@client/utils/index'
import { wait } from '@shared/utils'
import Button from '@client/components/Button/Button'
import TextBox from '@client/ts/shared/models/TextBox'
import { postToTwitter } from '../shared/api'

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
        height: (text.height / oldHeight) * memeSelected.height,
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

  const shareToTwitter = async (e: Event): Promise<void> => {
    e.preventDefault()
    try {
      setIsLoading(true)
      const imageUrl = await postToTwitter(img)
      window.open(`https://twitter.com/intent/tweet?text=[${t('yourText')}] ${imageUrl}`, '_blank').focus()
    } catch (error) {
      // TODO
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = (): void => {
    props.onClose()
    setImg(null)
  }

  return (
    <Modal onClose={handleClose} isLoading={isLoading}>
      <div className="export">
        <h2 className="export-title">{t('preview')}</h2>
        <div
          className="meme-wrapper-img"
          onContextMenu={(e: React.MouseEvent<HTMLDivElement, MouseEvent>): void => e.preventDefault()}
        >
          <img src={img} className="meme-img" />
        </div>
        <span className="meme-info-size">
          {memeSelected.width} x {memeSelected.height}
        </span>
        <div className="meme-actions-share">
          <a
            className="button button-medium button-export"
            id="share-local"
            download="meme.png"
            href={img.replace(/^data:image\/png/, 'data:application/octet-stream')}
          >
            <FontAwesomeIcon icon={['fas', 'arrow-circle-down']} className="icon-arrow-circle-down" />
            {t('download')}
          </a>
          <Button className="button-export" id="export-twitter" onClick={shareToTwitter}>
            <FontAwesomeIcon icon={['fab', 'twitter']} className="icon-twitter" />
            {t('share')}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default Export
