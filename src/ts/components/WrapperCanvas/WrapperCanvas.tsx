import * as React from 'react'
import { useLayoutEffect } from 'react'
import { useWindowWidth, useEditor } from '@shared/hooks'
import { fillText } from '@utils/index'
import TextBox from '@shared/models/TextBox'
import Draggable from '@components/Draggable/Draggable'
import { UseEditorInt } from '@shared/validators'
import { SET_TEXT_ID_SELECTED } from '@store/reducer/constants'
import { TAB_CUSTOMIZATION } from '@shared/constants'
import './wrapper-canvas.scss'

function WrapperCanvas(props: any): JSX.Element {
  const { isMinLgSize } = useWindowWidth()
  const [{ memeSelected, canvasRef, drawProperties, texts, textIdSelected }, dispatchEditor]: [
    UseEditorInt,
    Function
  ] = useEditor()

  useLayoutEffect(() => {
    const canvas: HTMLCanvasElement = canvasRef.current
    const ctx: CanvasRenderingContext2D = canvas.getContext('2d')
    if (drawProperties) {
      canvas.width = drawProperties.width
      canvas.height = drawProperties.height
      drawProperties.image.then(image => {
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
        style={{
          width: drawProperties.width,
          height: drawProperties.height
        }}
      >
        {isMinLgSize &&
          texts.map((text: TextBox) => (
            <Draggable
              key={text.id}
              className="text-box"
              position={{
                x: text.centerX,
                y: text.centerY
              }}
              onClick={(): void => {
                if (textIdSelected !== text.id) {
                  dispatchEditor({
                    type: SET_TEXT_ID_SELECTED,
                    textIdSelected: text.id
                  })
                }
                props.changeTab(TAB_CUSTOMIZATION)
              }}
              height={text.height}
              width={text.width}
              rotate={text.rotate}
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
