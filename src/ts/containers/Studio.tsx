import * as React from 'react'
import { useState, useEffect, useRef, useLayoutEffect, useCallback } from 'react'
import Meme from '@shared/models/Meme'
import GalleryTab from '@components/Tabs/Gallery/Gallery'
import CustomizationTab from '@components/Tabs/Customization/Customization'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Button from '@components/Button/Button'
import TextBox from '@shared/models/TextBox'
import { randomID, innerDemensions } from '@utils/index'
import { useWindowWidth } from '@utils/hooks'

const TAB_GALLERY = 'TAB_GALLERY'
const TAB_CUSTOMIZATION = 'TAB_CUSTOMIZATION'

type StudioProps = {
  memes: Array<Meme>
}

function Studio({ memes }: StudioProps): JSX.Element {
  const [currentTab, setCurrentTab] = useState<string>(TAB_GALLERY)
  const [memeSelected, setMemeSelected] = useState<Meme | null>(null)
  const [texts, setTexts] = useState<Array<TextBox>>([])
  const canvasRef = useRef<any>(null)
  const contentRef = useRef<any>(null)
  const windowWidth = useWindowWidth()

  const initCanvas = useCallback(
    (memeSelected: Meme) => {
      const canvas: HTMLCanvasElement = canvasRef.current
      const ctx: CanvasRenderingContext2D = canvas.getContext('2d')
      if (memeSelected) {
        let currentWidth: number = memeSelected.width
        let currentHeight: number = memeSelected.height
        const content: HTMLElement = contentRef.current
        const { width: maxWidth, height: maxHeight }: any = innerDemensions(content)

        if (currentWidth > maxWidth) {
          const ratioW: number = maxWidth / memeSelected.width
          currentWidth = maxWidth
          currentHeight = memeSelected.height * ratioW
        }

        if (currentHeight > maxHeight) {
          const ratioH: number = maxHeight / currentHeight
          currentWidth = currentWidth * ratioH
          currentHeight = currentHeight * ratioH
        }

        canvasRef.current.width = currentWidth
        canvasRef.current.height = currentHeight

        ctx.drawImage(memeSelected.image, 0, 0, currentWidth, currentHeight)
      }
      return (): void => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
      }
    },
    [windowWidth]
  )

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    context.font = 'italic 18px Arial'
    context.textAlign = 'center'
    context.textBaseline = 'middle'
    for (const text of texts) {
      context.fillStyle = text.color || 'black'
      context.fillText(text.value, text.left, text.top)
    }
    return (): void => {
      context.clearRect(0, 0, canvas.width, canvas.height)
    }
  }, [texts])

  useEffect(() => {
    if (memeSelected) {
      setTexts(
        [...Array(memeSelected.boxCount)].map((_, i) => ({
          transform: '',
          top: 22 * i + 1,
          left: 22 * i,
          fontSize: 22 + i,
          fontFamily: 'Arial',
          value: '',
          id: randomID(),
          color: ''
        }))
      )
    }
  }, [memeSelected])

  useEffect(() => {
    draw()
  }, [draw])

  useLayoutEffect(() => {
    initCanvas(memeSelected)
    console.log('changed')
  }, [initCanvas, memeSelected])

  return (
    <div className="Studio">
      <div className="Studio__content" ref={contentRef}>
        <div className={`${texts.length > 0 ? 'show' : 'hide'}`}>
          <canvas
            className="canvas"
            ref={canvasRef}
            width={memeSelected ? memeSelected.width : 0}
            height={memeSelected ? memeSelected.height : 0}
            id="meme-canvas"
          />
        </div>
        <span className={`${texts.length === 0 ? 'show' : 'hide'}`}>Select a template</span>
      </div>
      <aside className="Studio__aside">
        <div className="buttons__actions">
          <Button
            className={currentTab === TAB_GALLERY ? 'tab-button-active' : null}
            onClick={(): void => setCurrentTab(TAB_GALLERY)}
            id="tab-gallery-btn"
          >
            <FontAwesomeIcon icon="image" />
          </Button>
          <Button
            className={currentTab === TAB_CUSTOMIZATION ? 'tab-button-active' : null}
            onClick={(): void => setCurrentTab(TAB_CUSTOMIZATION)}
            id="tab-customization-btn"
          >
            <FontAwesomeIcon icon="heading" />
          </Button>
        </div>
        <div
          className={`studio__tab ${currentTab === TAB_GALLERY ? 'studio__tab__active' : null}`}
          aria-hidden={currentTab !== TAB_GALLERY}
          id="gallery-tab"
        >
          <GalleryTab memes={memes} onSelectMeme={(meme: Meme): void => setMemeSelected(meme)} />
        </div>
        <div
          className={`studio__tab ${currentTab === TAB_CUSTOMIZATION ? 'studio__tab__active' : null}`}
          aria-hidden={currentTab !== TAB_CUSTOMIZATION}
          id="customization-tab"
        >
          <CustomizationTab memeSelected={memeSelected} texts={texts} onChangeTexts={setTexts} />
        </div>
      </aside>
    </div>
  )
}

export default Studio
