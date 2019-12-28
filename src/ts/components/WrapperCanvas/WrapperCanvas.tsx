import * as React from 'react'
import { useLayoutEffect, useEffect, useContext, useRef, RefObject } from 'react'
import { EditorContext, EditorState } from '@store/EditorContext'
import { useWindowWidth } from '@shared/hooks'
import { innerDemensions, fillText } from '@utils/index'
import { TAB_CUSTOMIZATION } from '@shared/constants'
import { SET_CANVAS, SET_TEXT_ID_SELECTED, SET_DRAW_PROPERTIES, SET_TEXTS } from '@store/reducer/constants'
import TextBox from '@shared/models/TextBox'
import Draggable from '@components/Draggable/Draggable'
import { createText } from '@shared/config-editor'
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
  const windowWidth: number = useWindowWidth()
  const wrapperRef: RefObject<HTMLDivElement> = useRef(null)
  const memeIdRef: any = useRef(null)

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

    const scale: number = Math.min(currentWidth / memeSelected.width, currentHeight / memeSelected.height)

    const drawProperties = {
      width: currentWidth,
      height: currentHeight,
      image: memeSelected.image,
      scale
    }

    dispatchEditor({
      type: SET_DRAW_PROPERTIES,
      drawProperties
    })

    if (memeIdRef.current !== memeSelected.id) {
      ;(memeIdRef as React.MutableRefObject<string>).current = memeSelected.id
      dispatchEditor({
        type: SET_TEXTS,
        texts: [...Array(memeSelected.boxCount)].map(() => {
          const text = createText({
            centerY: 50,
            centerX: 340,
            height: 100,
            width: 680
          })
          text.height = text.base.height * drawProperties.scale
          text.width = text.base.width * drawProperties.scale
          text.centerY = drawProperties.height / 2
          text.centerX = drawProperties.width / 2
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
