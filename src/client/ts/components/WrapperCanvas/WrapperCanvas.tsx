import * as React from 'react'
import * as WebFont from 'webfontloader'
import { useLayoutEffect, useContext, useCallback } from 'react'
import { useWindowWidth } from '@client/ts/shared/hooks'
import { fillText } from '@client/utils/index'
import TextBox from '@client/ts/shared/models/TextBox'
import Draggable from '@client/components/Draggable/Draggable'
import { SET_ITEM_ID_SELECTED } from '@client/store/reducer/constants'
import { EditorInt, EditorContext, EditorDispatch } from '@client/store/EditorContext'
import ImageBox from '@client/ts/shared/models/ImageBox'
import { FONTS_FAMILY } from '@shared/config'
import './wrapper-canvas.scss'

export const loadFonts = new Promise(resolve => {
  WebFont.load({
    custom: {
      families: FONTS_FAMILY,
      urls: ['/fonts.css']
    },
    active: resolve
  })
})

function WrapperCanvas(): JSX.Element {
  const { isMinLgSize } = useWindowWidth()
  const [
    { memeSelected, images, canvasRef, drawProperties, texts, itemIdSelected, saveToEditor, showTextAreas },
    dispatchEditor
  ]: [EditorInt, EditorDispatch] = useContext(EditorContext)

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
  }, [drawProperties, texts, canvasRef])

  const setItemSelected = useCallback(
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
        {isMinLgSize && (
          <>
            {texts.map((text: TextBox, index: number) => (
              <Draggable
                key={text.version}
                item={text}
                type="text"
                memeSelected={memeSelected}
                drawProperties={drawProperties}
                zIndex={index}
                saveToEditor={saveToEditor}
                isSelected={text.id === itemIdSelected}
                isShowing={showTextAreas}
                setItemSelected={setItemSelected}
              />
            ))}
            {images.map((image: ImageBox, index: number) => (
              <Draggable
                key={image.version}
                item={image}
                type="image"
                memeSelected={memeSelected}
                drawProperties={drawProperties}
                zIndex={texts.length + index + 1}
                saveToEditor={saveToEditor}
                isSelected={image.id === itemIdSelected}
                isShowing={showTextAreas}
                setItemSelected={setItemSelected}
              />
            ))}
          </>
        )}
        <canvas className="canvas" ref={canvasRef} width={drawProperties.width} height={drawProperties.height} id="meme-canvas" />
      </div>
    </div>
  )
}

export default WrapperCanvas
