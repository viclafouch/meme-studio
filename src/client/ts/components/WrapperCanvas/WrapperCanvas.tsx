import * as React from 'react'
import { useLayoutEffect, useContext, useCallback } from 'react'
import { useWindowWidth } from '@client/ts/shared/hooks'
import { fillText } from '@client/utils/index'
import TextBox from '@client/ts/shared/models/TextBox'
import Draggable from '@client/components/Draggable/Draggable'
import { SET_ITEM_ID_SELECTED } from '@client/store/reducer/constants'
import { EditorInt, EditorContext } from '@client/store/EditorContext'
import './wrapper-canvas.scss'
import ImageBox from '@client/ts/shared/models/ImageBox'

function WrapperCanvas(): JSX.Element {
  const { isMinLgSize } = useWindowWidth()
  const [
    { memeSelected, images, canvasRef, drawProperties, texts, itemIdSelected, saveToEditor, showTextAreas },
    dispatchEditor
  ]: [EditorInt, Function] = useContext(EditorContext)

  useLayoutEffect(() => {
    const draw = (): void => {
      const canvas: HTMLCanvasElement = canvasRef.current
      const ctx: CanvasRenderingContext2D = canvas.getContext('2d', { alpha: true })
      if (drawProperties) {
        canvas.width = Math.round(drawProperties.width)
        canvas.height = Math.round(drawProperties.height)
        for (const text of texts) {
          const fontSize: number = text.fontSize * drawProperties.scale
          const y: number = text.centerY
          const x: number = text.centerX
          const maxHeight: number = text.height
          const maxWidth: number = text.width
          fillText({ text, ctx, maxWidth, maxHeight, fontSize, x, y })
        }
      }
    }

    const currentDraw = requestAnimationFrame(draw)
    return (): void => cancelAnimationFrame(currentDraw)
  }, [drawProperties, texts])

  const setTextSelected = useCallback(
    (id: TextBox['id']) => {
      dispatchEditor({
        type: SET_ITEM_ID_SELECTED,
        itemIdSelected: id
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
          width: Math.round(drawProperties.width),
          height: Math.round(drawProperties.height),
          backgroundImage: `url('${memeSelected.url()}')`
        }}
      >
        {isMinLgSize &&
          showTextAreas &&
          texts.map((text: TextBox, index: number) => (
            <Draggable
              key={text.version}
              item={text}
              type="text"
              memeSelected={memeSelected}
              drawProperties={drawProperties}
              zIndex={index}
              saveToEditor={saveToEditor}
              isSelected={text.id === itemIdSelected}
              setTextSelected={setTextSelected}
            />
          ))}
        {isMinLgSize &&
          images.map((image: ImageBox, index: number) => (
            <Draggable
              key={image.version}
              item={image}
              type="image"
              memeSelected={memeSelected}
              drawProperties={drawProperties}
              zIndex={index}
              saveToEditor={saveToEditor}
              isSelected={false}
              setTextSelected={setTextSelected}
            />
          ))}
        <canvas
          className="canvas"
          ref={canvasRef}
          width={Math.round(memeSelected.width)}
          height={Math.round(memeSelected.height)}
          id="meme-canvas"
        />
      </div>
    </div>
  )
}

export default WrapperCanvas
