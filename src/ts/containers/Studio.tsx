import * as React from 'react'
import { useState, useEffect, useRef, useLayoutEffect, useCallback } from 'react'
import Meme from '@shared/models/Meme'
import GalleryTab from '@components/Tabs/Gallery/Gallery'
import CustomizationTab from '@components/Tabs/Customization/Customization'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Button from '@components/Button/Button'
import Text from '@shared/models/Text'
import { randomID } from '@utils/index'

const TAB_GALLERY = 'TAB_GALLERY'
const TAB_CUSTOMIZATION = 'TAB_CUSTOMIZATION'

type StudioProps = {
  memes: Array<Meme>
}

function Studio({ memes }: StudioProps): JSX.Element {
  const [currentTab, setCurrentTab] = useState<string>(TAB_GALLERY)
  const [memeSelected, setMemeSelected] = useState<Meme | null>(null)
  const [texts, setTexts] = useState<Array<Text>>([])
  const canvasRef = useRef(null)

  const initCanvas = useCallback(async () => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, memeSelected.height, memeSelected.width)
    const image = new Image()
    image.src = memeSelected.url
    await new Promise(resolve => {
      image.onload = (): void => {
        ctx.drawImage(image, 0, 0)
        resolve()
      }
    })
  }, [memeSelected])

  useEffect(() => {
    if (memeSelected) {
      setTexts(
        [...Array(memeSelected.boxCount)].map((_, i) => ({
          staticStyles: '',
          value: '',
          id: randomID(),
          color: ''
        }))
      )
    }
  }, [memeSelected])

  useLayoutEffect(() => {
    if (texts.length > 0) {
      const draw = async (): Promise<any> => {
        /* TODO NEED TO FIX REDRAW EVERY TIME */
        await initCanvas()
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        ctx.font = 'italic 18px Arial'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        for (const text of texts) {
          ctx.fillStyle = text.color || 'black'
          ctx.fillText(text.value, 150, 50)
        }
      }
      draw()
    }
  }, [texts])

  return (
    <div className="Studio">
      <div className="Studio__content">
        {memeSelected && (
          <div className="wrapper-canvas">
            <canvas ref={canvasRef} width={memeSelected.width} height={memeSelected.height} id="meme-canvas" />
          </div>
        )}
        {!memeSelected && <span>Select a template</span>}
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
