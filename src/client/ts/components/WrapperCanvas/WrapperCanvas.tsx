import * as React from 'react'
import { useLayoutEffect, useContext, useCallback } from 'react'
import { useWindowWidth } from '@client/ts/shared/hooks'
import { fillText } from '@client/utils/index'
import TextBox from '@client/ts/shared/models/TextBox'
import Draggable from '@client/components/Draggable/Draggable'
import { SET_TEXT_ID_SELECTED } from '@client/store/reducer/constants'
import { EditorInt, EditorContext } from '@client/store/EditorContext'
import './wrapper-canvas.scss'

function WrapperCanvas(): JSX.Element {
  const { isMinLgSize } = useWindowWidth()
  const [{ memeSelected, canvasRef, drawProperties, texts, textIdSelected, saveToEditor }, dispatchEditor]: [
    EditorInt,
    Function
  ] = useContext(EditorContext)

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

  const setTextSelected = useCallback(
    (id: TextBox['id']) => {
      dispatchEditor({
        type: SET_TEXT_ID_SELECTED,
        textIdSelected: id
      })
    },
    [dispatchEditor]
  )

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
          texts.map((text: TextBox, index: number) => (
            <Draggable
              key={text.version}
              text={text}
              memeSelected={memeSelected}
              drawProperties={drawProperties}
              zIndex={index}
              saveToEditor={saveToEditor}
              isSelected={text.id === textIdSelected}
              setTextSelected={setTextSelected}
            />
          ))}
      </div>
      <canvas className="canvas" ref={canvasRef} width={memeSelected.width} height={memeSelected.height} id="meme-canvas" />
    </div>
  )
}

export default WrapperCanvas
