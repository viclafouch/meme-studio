import * as React from 'react'
import { useLayoutEffect, useEffect, useContext, useRef, RefObject } from 'react'
import { EditorContext, EditorState } from '@store/EditorContext'
import { useWindowWidth } from '@shared/hooks'
import { innerDemensions, fillText } from '@utils/index'
import { TAB_CUSTOMIZATION, INITIAL } from '@shared/constants'
import { SET_CANVAS, SET_TEXT_ID_SELECTED, SET_DRAW_PROPERTIES, SET_TEXTS } from '@store/reducer/constants'
import TextBox from '@shared/models/TextBox'
import Draggable from '@components/Draggable/Draggable'
import { createText } from '@shared/config-editor'
import { HistoryContext, HistoryState, HistoryDispatcher } from '@store/HistoryContext'
import './wrapper-canvas.scss'

type WrapperCanvasProps = {
  changeTab: Function
  onCustomizeTexts: Function
}

function WrapperCanvas(props: WrapperCanvasProps): JSX.Element {
  const [{ memeSelected, texts, textIdSelected, drawProperties }, dispatchEditor, canvasRef]: [
    EditorState,
    Function,
    RefObject<HTMLCanvasElement>
  ] = useContext(EditorContext)
  const [, { clearHistory, setToHistory }]: [HistoryState, HistoryDispatcher] = useContext(HistoryContext)
  const windowWidth: number = useWindowWidth()
  const wrapperRef: RefObject<HTMLDivElement> = useRef(null)
  const memeIdRef: RefObject<string> = useRef(null)

  useEffect(() => {
    dispatchEditor({
      type: SET_CANVAS,
      canvas: canvasRef.current
    })
  }, [])

  useEffect(() => {
    let currentWidth: number = memeSelected.width
    let currentHeight: number = memeSelected.height
    let ratioW = 1
    let ratioH = 1
    const wrapper: HTMLElement = wrapperRef.current
    const { width: maxWidth, height: maxHeight }: any = innerDemensions(wrapper)

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

    const canvas: HTMLCanvasElement = canvasRef.current
    canvas.width = currentWidth
    canvas.height = currentHeight

    const { width: oldWidth, height: oldHeight } = drawProperties || {}

    const scale: number = Math.min(currentWidth / memeSelected.width, currentHeight / memeSelected.height)

    const newDrawProperties = {
      width: currentWidth,
      height: currentHeight,
      image: memeSelected.image,
      scale
    }

    dispatchEditor({
      type: SET_DRAW_PROPERTIES,
      drawProperties: newDrawProperties
    })

    if (memeIdRef.current !== memeSelected.id) {
      ;(memeIdRef as React.MutableRefObject<string>).current = memeSelected.id // avoid readOnly

      const texts = [...Array(memeSelected.boxCount)].map(() => {
        const text = createText({
          centerY: 50,
          centerX: 340,
          height: 100,
          width: 680
        })
        text.height = text.base.height * newDrawProperties.scale
        text.width = text.base.width * newDrawProperties.scale
        text.centerY = text.base.centerY * newDrawProperties.scale
        text.centerX = text.base.centerX * newDrawProperties.scale
        return text
      })

      dispatchEditor({
        type: SET_TEXTS,
        texts
      })

      clearHistory()
      setToHistory({
        texts,
        drawProperties: newDrawProperties,
        type: INITIAL
      })
    } else {
      dispatchEditor({
        type: SET_TEXTS,
        texts: texts.map((text: TextBox) => {
          text.centerX = (text.centerX / oldWidth) * newDrawProperties.width
          text.centerY = (text.centerY / oldHeight) * newDrawProperties.height
          text.width = (text.width / oldWidth) * newDrawProperties.width
          text.height = (text.height / oldHeight) * newDrawProperties.height
          return text
        })
      })
    }
  }, [windowWidth, memeSelected])

  useLayoutEffect(() => {
    const canvas: HTMLCanvasElement = canvasRef.current
    const ctx: CanvasRenderingContext2D = canvas.getContext('2d')
    ;(async (): Promise<void> => {
      if (drawProperties) {
        const image = await drawProperties.image
        ctx.drawImage(image, 0, 0, drawProperties.width, drawProperties.height)
        for (const text of texts) {
          const fontSize: number = text.fontSize * drawProperties.scale

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
  }, [drawProperties, texts])

  return (
    <div className="Wrapper-canvas" ref={wrapperRef}>
      <div
        className="wrapper-text-boxes"
        style={{
          width: drawProperties ? drawProperties.width : '100%',
          height: drawProperties ? drawProperties.height : 'auto'
        }}
      >
        {texts.map((text: TextBox) => (
          <Draggable
            key={text.id}
            className="text-box"
            position={{
              x: text.centerX,
              y: text.centerY
            }}
            onClick={(): void => {
              if (text.id !== textIdSelected)
                dispatchEditor({
                  type: SET_TEXT_ID_SELECTED,
                  textIdSelected: text.id
                })
              props.changeTab(TAB_CUSTOMIZATION)
            }}
            height={text.height}
            width={text.width}
            rotate={text.transform}
            onMove={props.onCustomizeTexts}
            drawProperties={drawProperties}
            id={text.id}
            active={text.id === textIdSelected}
          />
        ))}
      </div>
      <canvas
        className="canvas"
        ref={canvasRef}
        width={memeSelected ? memeSelected.width : 0}
        height={memeSelected ? memeSelected.height : 0}
        id="meme-canvas"
      />
    </div>
  )
}

export default WrapperCanvas
