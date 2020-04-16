import * as React from 'react'
import { useLayoutEffect, useEffect } from 'react'
import { useWindowWidth, useEditor } from '@client/ts/shared/hooks'
import { fillText } from '@client/utils/index'
import TextBox from '@client/ts/shared/models/TextBox'
import Draggable from '@client/components/Draggable/Draggable'
import { UseEditorInt } from '@client/ts/shared/validators'
import { SET_TEXT_ID_SELECTED } from '@client/store/reducer/constants'
import { TAB_CUSTOMIZATION } from '@client/ts/shared/constants'
import './wrapper-canvas.scss'

function WrapperCanvas(props: any): JSX.Element {
  const { isMinLgSize } = useWindowWidth()
  const [{ memeSelected, canvasRef, drawProperties, texts, textIdSelected }, dispatchEditor]: [
    UseEditorInt,
    Function
  ] = useEditor()

  useEffect(() => {
    const textIdSelected: string = window.localStorage.getItem('textIdSelected')
    if (textIdSelected) {
      dispatchEditor({
        type: SET_TEXT_ID_SELECTED,
        textIdSelected: JSON.parse(textIdSelected),
      })
    }
  }, [])

  useLayoutEffect(() => {
    const canvas: HTMLCanvasElement = canvasRef.current
    const ctx: CanvasRenderingContext2D = canvas.getContext('2d')
    if (drawProperties) {
      canvas.width = drawProperties.width
      canvas.height = drawProperties.height
      drawProperties.image.then((image) => {
        ctx.drawImage(image, 0, 0, drawProperties.width, drawProperties.height)
        for (const text of texts) {
          const fontSize: number = text.fontSize * drawProperties.scale
          const top: number = text.centerY
          const left: number = text.centerX
          const height: number = text.height
          const width: number = text.width
          fillText(text, ctx, width, height, fontSize, left, top)
        }
      })
    }
    return (): void => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
  }, [drawProperties, texts])

  return (
    <div className="wrapper-canvas">
      <div
        className="wrapper-canvas-container"
        onContextMenu={(e: React.MouseEvent<HTMLDivElement, MouseEvent>): void => e.preventDefault()}
        style={{
          width: drawProperties.width,
          height: drawProperties.height,
        }}
      >
        {isMinLgSize &&
          texts.map((text: TextBox) => (
            <Draggable
              key={text.id}
              className="text-box"
              position={{
                x: text.centerX,
                y: text.centerY,
              }}
              onClick={(): void => {
                if (textIdSelected !== text.id) {
                  dispatchEditor({
                    type: SET_TEXT_ID_SELECTED,
                    textIdSelected: text.id,
                  })
                }
                props.changeTab(TAB_CUSTOMIZATION)
              }}
              height={text.height}
              width={text.width}
              rotate={text.rotate}
              memeWidth={memeSelected.width}
              memeHeight={memeSelected.height}
              drawProperties={drawProperties}
              id={text.id}
              active={text.id === textIdSelected}
            />
          ))}
      </div>
      <canvas className="canvas" ref={canvasRef} width={memeSelected.width} height={memeSelected.height} id="meme-canvas" />
    </div>
  )
}

export default WrapperCanvas
