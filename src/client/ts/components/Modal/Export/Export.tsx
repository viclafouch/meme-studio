import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { useEffect, useState, useContext, useCallback, useMemo } from 'react'
import Modal from '@client/components/Modal/Modal'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Button from '@client/components/Button/Button'
import TextBox from '@client/ts/shared/models/TextBox'
import { postToTwitter } from '../../../shared/api'
import { TOGGLE_EXPORT_MODAL } from '@client/store/reducer/constants'
import { EditorContext, EditorInt, EditorDispatch } from '@client/store/EditorContext'
import ImageBox from '@client/ts/shared/models/ImageBox'
import { exportMeme } from '@client/utils/helpers'
import { useWindowWidth } from '@client/ts/shared/hooks'
import { wait } from '@shared/utils'
import './export.scss'

declare global {
  interface Window {
    ClipboardItem: any
  }

  interface Clipboard extends EventTarget {
    write(arg0: any[]): any
    readText(): Promise<string>
    writeText(data: string): Promise<void>
  }
}

const isBrowserCanCopyImg = 'ClipboardItem' in window

function Export(): JSX.Element {
  const { t, i18n } = useTranslation()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isError, setIsError] = useState<boolean>(false)
  const [isTweeting, setIsTweeting] = useState<boolean>(false)
  const [isCopied, setIsCopied] = useState<boolean>(false)
  const [imageTweet, setImageTweet] = useState<string>('')
  const [blob, setBlob] = useState<Blob>(null)
  const { isMinLgSize } = useWindowWidth()
  const [{ drawProperties, memeSelected, texts, images }, dispatchEditor]: [EditorInt, EditorDispatch] = useContext(EditorContext)

  const imageSrc: string = useMemo(() => {
    if (blob) {
      const src = URL.createObjectURL(blob)
      return src
    } else return ''
  }, [blob])

  useEffect(() => {
    if (!blob) {
      ;(async (): Promise<void> => {
        const { width: oldWidth, height: oldHeight } = drawProperties

        const blob = await exportMeme({
          texts: texts.map(
            (text: TextBox) =>
              new TextBox({
                ...text,
                centerX: Math.round((text.centerX / oldWidth) * memeSelected.width),
                centerY: Math.round((text.centerY / oldHeight) * memeSelected.height),
                width: Math.round((text.width / oldWidth) * memeSelected.width),
                height: Math.round((text.height / oldHeight) * memeSelected.height)
              })
          ),
          images: images.map(
            (image: ImageBox) =>
              new ImageBox({
                ...image,
                centerX: Math.round((image.centerX / oldWidth) * memeSelected.width),
                centerY: Math.round((image.centerY / oldHeight) * memeSelected.height),
                width: Math.round((image.width / oldWidth) * memeSelected.width),
                height: Math.round((image.height / oldHeight) * memeSelected.height)
              })
          ),
          memeSelected,
          drawProperties
        })

        setBlob(blob)
        setIsLoading(false)
      })()
    }
  }, [setIsLoading, setBlob, drawProperties, texts, images, memeSelected, blob])

  const shareToTwitter = useCallback(
    async (e: Event): Promise<void> => {
      e.preventDefault()
      if (blob) {
        try {
          setIsError(false)
          if (imageTweet) {
            window.open(
              `https://twitter.com/intent/tweet?text=[${t('yourText')}] ${imageTweet}`,
              '_blank',
              'toolbar=0,location=0,menubar=0,width=750,height=750'
            )
          } else {
            setIsTweeting(true)
            await wait()
            const base64: string = await new Promise((resolve, reject) => {
              const reader = new window.FileReader()
              reader.readAsDataURL(blob)
              reader.onerror = reject
              reader.onloadend = () => {
                resolve(reader.result as string)
              }
            })
            const tweetUrl = await postToTwitter(base64)
            setImageTweet(tweetUrl)
            window.open(
              `https://twitter.com/intent/tweet?text=[${t('yourText')}] ${tweetUrl}`,
              '_blank',
              'toolbar=0,location=0,menubar=0,width=750,height=750'
            )
          }
        } catch (error) {
          setIsError(true)
          console.error(error)
        } finally {
          setIsTweeting(false)
        }
      }
    },
    [t, imageTweet, blob]
  )

  const copy = useCallback(async () => {
    if (isBrowserCanCopyImg) {
      try {
        setIsError(false)
        await navigator.clipboard.write([
          new window.ClipboardItem({
            [blob.type]: blob
          })
        ])
        setIsCopied(true)
      } catch (error) {
        setIsError(true)
        console.error(error)
      }
    }
  }, [blob])

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>
    if (isCopied) {
      timeout = setTimeout(() => {
        setIsCopied(false)
      }, 3000)
    }
    return () => {
      clearTimeout(timeout)
    }
  }, [isCopied])

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
          <img src={imageSrc} className="meme-img" alt={memeSelected.name(i18n.language)} />
        </div>
        <span className="meme-info-size">
          {t('studio.fullSize')} {memeSelected.width} x {memeSelected.height}
        </span>
        <div className="meme-actions-share">
          <a className="button button-medium button-export button-blue" id="share-local" download="meme.png" href={imageSrc}>
            <FontAwesomeIcon icon={['fas', 'arrow-circle-down']} className="icon-arrow-circle-down" />
            {t('download')}
          </a>
          {isMinLgSize && (
            <Button
              className={`button-export ${isBrowserCanCopyImg ? 'tooltip-disabled' : ''}`}
              id="export-copy"
              onClick={copy}
              data-tooltip={t('browserNotSupported')}
              disabled={!isBrowserCanCopyImg}
            >
              <i className="feature-test">
                <FontAwesomeIcon icon={['fas', 'flask']} className="icon-flask" />
              </i>
              <FontAwesomeIcon icon={['fas', 'clipboard']} className="icon-twitter" />
              {t('copy')}
            </Button>
          )}
          <Button
            className="button-export"
            id="export-twitter"
            onClick={shareToTwitter}
            isLoading={isTweeting}
            disabled={isTweeting}
          >
            <FontAwesomeIcon icon={['fab', 'twitter']} className="icon-twitter" />
            {t('share')}
          </Button>
        </div>
        {isError && <p className="error-export">{t('unknownError')}</p>}
        {!isError && isCopied && <p className="copied-export">{t('imageCopied')}</p>}
      </div>
    </Modal>
  )
}

export default Export
