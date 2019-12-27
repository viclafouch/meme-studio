import * as React from 'react'
import { useState, useEffect, useRef, useLayoutEffect, useCallback, useContext } from 'react'
import Meme from '@shared/models/Meme'
import Gallery from '@components/Tabs/Gallery/Gallery'
import Customization from '@components/Tabs/Customization/Customization'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Button from '@components/Button/Button'
import TextBox from '@shared/models/TextBox'
import { randomID, innerDemensions, fillText } from '@utils/index'
import { useWindowWidth } from '@shared/hooks/index'
import { CanvasProperties } from '@shared/validators/index'
import Draggable from '@components/Draggable/Draggable'
import Tab from '@components/Tabs/Tab'
import { EditorContext } from '@store/EditorContext'
import { SET_TEXT_ID_SELECTED } from '@store/reducer/constants'

const TAB_GALLERY = 'TAB_GALLERY'
const TAB_CUSTOMIZATION = 'TAB_CUSTOMIZATION'

type StudioProps = {
  forwardedRef: React.MutableRefObject<HTMLCanvasElement>
}

function Studio(props: StudioProps): JSX.Element {
  const [currentTab, setCurrentTab] = useState<string>(TAB_GALLERY)
  const [{ textIdSelected }, dispatchEditor] = useContext(EditorContext)
  const [memeSelected, setMemeSelected] = useState<Meme | null>(null)
  const [canvasProperties, setCanvasProperties] = useState<CanvasProperties | null>(null)
  const contentRef = useRef<HTMLDivElement>(null)
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

        texts = texts.map((text: any) => {
          text.height = text.base.height * scale
          text.width = text.base.width * scale
          text.centerY = text.base.centerY * scale
          text.centerX = text.base.centerX * scale
          return text
        })

        return {
          texts: texts,
          width: currentWidth,
          height: currentHeight,
          image: memeSelected.image,
          name: memeSelected.name,
          textIdSelected: null,
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
          transform: 0,
          centerY: 50,
          centerX: 340,
          height: 100,
          width: 680,
          base: {
            centerY: 50,
            centerX: 340,
            height: 100,
            width: 680
          },
          fontSize: 22,
          fontFamily: 'Impact',
          textAlign: 'center',
          alignVertical: 'middle',
          value: '',
          id: randomID(),
          color: '#ffffff',
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

          const top: number = text.centerY
          const left: number = text.centerX

          const height: number = text.height
          const width: number = text.width

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
                <Draggable
                  key={text.id}
                  className="text-box"
                  position={{
                    x: text.centerX,
                    y: text.centerY
                  }}
                  onClick={(): void => {
                    setCurrentTab(TAB_CUSTOMIZATION)
                    dispatchEditor({
                      type: SET_TEXT_ID_SELECTED,
                      textIdSelected: text.id
                    })
                  }}
                  height={text.height}
                  width={text.width}
                  rotate={text.transform}
                  onMove={handleCustomize}
                  canvasProperties={canvasProperties}
                  id={text.id}
                  active={text.id === textIdSelected}
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
        <div className="tabs__buttons__container">
          <Button
            className={currentTab === TAB_GALLERY ? 'tab__button__active' : null}
            onClick={(): void => setCurrentTab(TAB_GALLERY)}
            id="tab-gallery-btn"
          >
            <FontAwesomeIcon className="icon-image" icon={['fas', 'image']} />
          </Button>
          <Button
            className={currentTab === TAB_CUSTOMIZATION ? 'tab__button__active' : null}
            onClick={(): void => setCurrentTab(TAB_CUSTOMIZATION)}
            id="tab-customization-btn"
          >
            <FontAwesomeIcon className="icon-heading" icon={['fas', 'heading']} />
          </Button>
        </div>
        <Tab active={currentTab === TAB_GALLERY} id="gallery-tab">
          <Gallery onSelectMeme={(meme: Meme): void => setMemeSelected(meme)} />
        </Tab>
        <Tab active={currentTab === TAB_CUSTOMIZATION} id="customization-tab">
          <Customization canvasProperties={canvasProperties} onCustomize={handleCustomize} />
        </Tab>
      </aside>
    </div>
  )
}

export default React.forwardRef((props: any, ref) => {
  return <Studio {...props} forwardedRef={ref} />
})
