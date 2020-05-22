import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { useEffect, useState, useContext } from 'react'
import Modal from '@client/components/Modal/Modal'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { fillText } from '@client/utils/index'
import { wait } from '@shared/utils'
import Button from '@client/components/Button/Button'
import TextBox from '@client/ts/shared/models/TextBox'
import { postToTwitter } from '../../../shared/api'
import { TOGGLE_EXPORT_MODAL } from '@client/store/reducer/constants'
import { EditorContext, EditorInt, EditorDispatch } from '@client/store/EditorContext'
import ImageBox from '@client/ts/shared/models/ImageBox'
import './export.scss'

function Export(): JSX.Element {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [img, setImg] = useState<string>('')
  const [{ drawProperties, memeSelected, texts, images }, dispatchEditor]: [EditorInt, EditorDispatch] = useContext(EditorContext)

  useEffect(() => {
    if (img === '') {
      ;(async (): Promise<void> => {
        const { width: oldWidth, height: oldHeight } = drawProperties
        const textBox = texts.map(
          (text: TextBox) =>
            new TextBox({
              ...text,
              centerX: Math.round((text.centerX / oldWidth) * memeSelected.width),
              centerY: Math.round((text.centerY / oldHeight) * memeSelected.height),
              width: Math.round((text.width / oldWidth) * memeSelected.width),
              height: Math.round((text.height / oldHeight) * memeSelected.height)
            })
        )

        const imageBox = images.map(
          (image: ImageBox) =>
            new ImageBox({
              ...image,
              centerX: Math.round((image.centerX / oldWidth) * memeSelected.width),
              centerY: Math.round((image.centerY / oldHeight) * memeSelected.height),
              width: Math.round((image.width / oldWidth) * memeSelected.width),
              height: Math.round((image.height / oldHeight) * memeSelected.height)
            })
        )

        const canvas = document.createElement('canvas')
        canvas.width = memeSelected.width
        canvas.height = memeSelected.height
        const ctx: CanvasRenderingContext2D = canvas.getContext('2d')
        const image = await drawProperties.image
        ctx.drawImage(image, 0, 0, memeSelected.width, memeSelected.height)
        for (const text of textBox) {
          const fontSize: number = text.fontSize
          const y: number = text.centerY
          const x: number = text.centerX
          const maxHeight: number = text.height
          const maxWidth: number = text.width
          fillText({ text, ctx, maxWidth, maxHeight, fontSize, x, y })
        }
        for (const image of imageBox) {
          const dx = Math.round(image.centerX - image.width / 2)
          const dy = Math.round(image.centerY - image.height / 2)
          const img = new Image()
          img.src = image.src
          ctx.drawImage(img, dx, dy, image.width, image.height)
        }
        ctx.save()
        const watermark = 'meme-studio.io'
        const fontSize = 11
        ctx.font = `${fontSize}px Arial`
        const metrics = ctx.measureText(watermark)
        ctx.fillStyle = '#cccccc'
        ctx.textBaseline = 'top'
        ctx.strokeStyle = 'black'
        ctx.lineJoin = 'round'
        const padding = 10
        ctx.fillText(watermark, memeSelected.width - metrics.width - padding, memeSelected.height - fontSize - padding / 2)
        ctx.restore()
        const dataUrl: string = canvas.toDataURL('image/jpg', 1.0)
        setImg(dataUrl)
        await wait()
        setIsLoading(false)
      })()
    }
  }, [setIsLoading, setImg, drawProperties, texts, images, memeSelected, img])

  const shareToTwitter = (e: Event): void => {
    e.preventDefault()
    try {
      setIsLoading(true)
      postToTwitter(img).then((imageUrl: string) =>
        window.open(
          `https://twitter.com/intent/tweet?text=[${t('yourText')}] ${imageUrl}`,
          '_blank',
          'toolbar=0,location=0,menubar=0,width=750,height=750'
        )
      )
    } catch (error) {
      // TODO
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = (): void =>
    dispatchEditor({
      type: TOGGLE_EXPORT_MODAL
    })

  return (
    <Modal onClose={handleClose} isLoading={isLoading}>
      <div className="export">
        <h2 className="export-title">{t('preview')}</h2>
        <div
          className="meme-wrapper-img"
          onContextMenu={(e: React.MouseEvent<HTMLDivElement, MouseEvent>): void => e.preventDefault()}
        >
          <img src={img} className="meme-img" alt={memeSelected.name} />
        </div>
        <span className="meme-info-size">
          {t('studio.fullSize')} {memeSelected.width} x {memeSelected.height}
        </span>
        <div className="meme-actions-share">
          <a
            className="button button-medium button-export button-blue"
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
