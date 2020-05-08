import * as React from 'react'
import { useLayoutEffect, useContext } from 'react'
import { useWindowWidth } from '@client/ts/shared/hooks'
import { fillText } from '@client/utils/index'
import TextBox from '@client/ts/shared/models/TextBox'
import Draggable from '@client/components/Draggable/Draggable'
import { SET_TEXT_ID_SELECTED } from '@client/store/reducer/constants'
import { EditorInt, EditorContext } from '@client/store/EditorContext'
import './wrapper-canvas.scss'

function WrapperCanvas(): JSX.Element {
  const { isMinLgSize } = useWindowWidth()
  const [{ memeSelected, canvasRef, drawProperties, texts, textIdSelected }, dispatchEditor]: [EditorInt, Function] = useContext(
    EditorContext
  )

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
          const y: number = text.centerY
          const x: number = text.centerX
          const maxHeight: number = text.height
          const maxWidth: number = text.width
          fillText({ text, ctx, maxWidth, maxHeight, fontSize, x, y })
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
          height: drawProperties.height
        }}
      >
        {isMinLgSize &&
          texts.map((text: TextBox) => (
            <Draggable
              key={text.version}
              className="text-box"
              position={{
                x: text.centerX,
                y: text.centerY
              }}
              onClick={(): void => {
                if (text.id !== textIdSelected) {
                  dispatchEditor({
                    type: SET_TEXT_ID_SELECTED,
                    textIdSelected: text.id
                  })
                }
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
