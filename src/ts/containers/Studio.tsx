import * as React from 'react'
import { useState, useEffect, useRef, useLayoutEffect, useCallback } from 'react'
import Meme from '@shared/models/Meme'
import GalleryTab from '@components/Tabs/Gallery/Gallery'
import CustomizationTab from '@components/Tabs/Customization/Customization'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Button from '@components/Button/Button'
import TextBox from '@shared/models/TextBox'
import { randomID, innerDemensions, fillText } from '@utils/index'
import { useWindowWidth } from '@shared/hooks/index'
import { CanvasProperties } from '@shared/validators/index'

const TAB_GALLERY = 'TAB_GALLERY'
const TAB_CUSTOMIZATION = 'TAB_CUSTOMIZATION'

type StudioProps = {
  memes: Array<Meme>
}

function Studio(props: any): JSX.Element {
  const [currentTab, setCurrentTab] = useState<string>(TAB_GALLERY)
  const [memeSelected, setMemeSelected] = useState<Meme | null>(null)
  const [canvasProperties, setCanvasProperties] = useState<CanvasProperties | null>(null)
  const contentRef = useRef<any>(null)
  const windowWidth = useWindowWidth()

  const calcCanvasProperties = useCallback(
    (memeSelected: Meme, texts: Array<TextBox>) => {
      if (memeSelected) {
        let currentWidth: number = memeSelected.width
        let currentHeight: number = memeSelected.height
        let ratioW = 1
        let ratioH = 1
        const content: HTMLElement = contentRef.current
        const { width: maxWidth, height: maxHeight }: any = innerDemensions(content)

        if (currentWidth > maxWidth) {
          ratioW = maxWidth / memeSelected.width
          currentWidth = maxWidth
          currentHeight = memeSelected.height * ratioW
        }

        if (currentHeight > maxHeight) {
          ratioH = maxHeight / currentHeight
          currentWidth = currentWidth * ratioH
          currentHeight = currentHeight * ratioH
        }

        const canvas: HTMLCanvasElement = props.forwardedRef.current
        canvas.width = currentWidth
        canvas.height = currentHeight

        const scale: number = Math.min(currentWidth / memeSelected.width, currentHeight / memeSelected.height)

        return {
          texts: texts,
          width: currentWidth,
          height: currentHeight,
          image: memeSelected.image,
          scale
        }
      }
    },
    [windowWidth]
  )

  const handleCustomize = (texts: Array<TextBox>): void => {
    setCanvasProperties({
      ...canvasProperties,
      texts
    })
  }

  useEffect(() => {
    if (memeSelected) {
      const properties = calcCanvasProperties(
        memeSelected,
        [...Array(1)].map((_, i) => ({
          transform: '',
          centerY: 50,
          centerX: 340,
          height: 100,
          width: 680,
          fontSize: 22,
          fontFamily: 'serif',
          textAlign: 'center',
          alignVertical: 'middle',
          value: '',
          id: randomID(),
          color: '#000000',
          isUppercase: false
        }))
      )
      setCanvasProperties(properties)
    }
  }, [memeSelected])

  useEffect(() => {
    if (memeSelected) {
      const properties = calcCanvasProperties(memeSelected, canvasProperties.texts)
      setCanvasProperties(properties)
    }
  }, [calcCanvasProperties])

  useLayoutEffect(() => {
    const canvas: HTMLCanvasElement = props.forwardedRef.current
    const ctx: CanvasRenderingContext2D = canvas.getContext('2d')
    ;(async (): Promise<void> => {
      if (canvasProperties) {
        const image = await canvasProperties.image
        ctx.drawImage(image, 0, 0, canvasProperties.width, canvasProperties.height)
        for (const text of canvasProperties.texts) {
          const fontSize: number = text.fontSize * canvasProperties.scale

          const top: number = text.centerY * canvasProperties.scale
          const left: number = text.centerX * canvasProperties.scale

          const height = text.height * canvasProperties.scale
          const width = text.width * canvasProperties.scale

          fillText(text, ctx, width, height, fontSize, left, top)
        }
      }
    })()
    return (): void => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
  }, [canvasProperties])

  return (
    <div className="Studio">
      <div className="Studio__content" ref={contentRef}>
        <div className={`${memeSelected ? 'show' : 'hide'}`}>
          {canvasProperties && (
            <div
              className="wrapper-text-boxes"
              style={{
                width: canvasProperties.width,
                height: canvasProperties.height
              }}
            >
              {canvasProperties.texts.map((text: TextBox) => (
                <div
                  key={text.id}
                  className="text-box"
                  style={{
                    height: text.height * canvasProperties.scale,
                    width: text.width * canvasProperties.scale,
                    top: text.centerY * canvasProperties.scale - (text.height * canvasProperties.scale) / 2,
                    left: text.centerX * canvasProperties.scale - (text.width * canvasProperties.scale) / 2
                  }}
                />
              ))}
            </div>
          )}
          <canvas
            className="canvas"
            ref={props.forwardedRef}
            width={memeSelected ? memeSelected.width : 0}
            height={memeSelected ? memeSelected.height : 0}
            id="meme-canvas"
          />
        </div>
        <span className={`${memeSelected ? 'hide' : 'show'}`}>Select a template</span>
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
          <GalleryTab memes={props.memes} onSelectMeme={(meme: Meme): void => setMemeSelected(meme)} />
        </div>
        <div
          className={`studio__tab ${currentTab === TAB_CUSTOMIZATION ? 'studio__tab__active' : null}`}
          aria-hidden={currentTab !== TAB_CUSTOMIZATION}
          id="customization-tab"
        >
          <CustomizationTab memeSelected={memeSelected} canvasProperties={canvasProperties} onCustomize={handleCustomize} />
        </div>
      </aside>
    </div>
  )
}

export default React.forwardRef((props: StudioProps, ref) => {
  return <Studio {...props} forwardedRef={ref} />
})
