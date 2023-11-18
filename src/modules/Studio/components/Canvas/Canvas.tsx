import React from 'react'
import { Meme } from '@models/Meme'
import { drawText } from '@shared/helpers/canvas'
import { useIsomorphicLayoutEffect } from '@shared/hooks/useIsomorphicLayoutEffect'
import { useWindowSizeCallback } from '@shared/hooks/useWindowSizeCallback'
import { TextBox } from '@shared/schemas/textbox'
import { useCanvasDimensions } from '@stores/Editor/hooks/useCanvasDimensions'
import { useItemIdSelected } from '@stores/Editor/hooks/useItemIdSelected'
import { useMeme } from '@stores/Editor/hooks/useMeme'
import { useTexts } from '@stores/Editor/hooks/useTexts'
import { useTools } from '@stores/Editor/hooks/useTools'
import Draggable from '../Draggable'
import Styled from './canvas.styled'

const Canvas = () => {
  const meme = useMeme() as Meme
  const canvasElRef = React.useRef<HTMLCanvasElement>(null)
  const { textboxes, updateTextbox } = useTexts()
  const containerRef = React.useRef<HTMLDivElement>(null)
  const { resize, canvasDimensions } = useCanvasDimensions()
  const { isVisibleDraggables } = useTools()
  const { itemIdSelected, setItemIdSelected } = useItemIdSelected()

  useWindowSizeCallback(
    (elementSize) => {
      resize(elementSize)
    },
    { elementRef: containerRef }
  )

  useIsomorphicLayoutEffect(() => {
    const canvasElement = canvasElRef.current

    if (canvasElement === null) {
      return () => {}
    }

    const draw = (): void => {
      const context2D = canvasElement.getContext('2d', {
        alpha: true
      }) as CanvasRenderingContext2D
      canvasElement.width = canvasDimensions.width
      canvasElement.height = canvasDimensions.height

      textboxes.forEach((textbox) => {
        drawText(textbox, context2D)
      })
    }

    const frame = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(frame)
    }
  }, [textboxes, canvasElRef, meme, canvasDimensions])

  const onDraggableClick = React.useCallback(
    (item: TextBox) => {
      setItemIdSelected(item.id, true)
    },
    [setItemIdSelected]
  )

  return (
    <Styled.Container ref={containerRef}>
      <Styled.WrapperCanvas
        style={{
          height: canvasDimensions.height,
          width: canvasDimensions.width,
          backgroundImage: `url('https://www.meme-studio.io/templates/${meme.filename}')`
        }}
      >
        {isVisibleDraggables
          ? textboxes.map((textbox) => {
              return (
                <Draggable
                  key={textbox.id}
                  item={textbox}
                  canvasHeight={canvasDimensions.height}
                  canvasWidth={canvasDimensions.width}
                  updateItem={updateTextbox}
                  onClick={onDraggableClick}
                  isSelected={itemIdSelected === textbox.id}
                />
              )
            })
          : null}
        <Styled.Canvas
          ref={canvasElRef}
          width={canvasDimensions.width}
          height={canvasDimensions.height}
        />
      </Styled.WrapperCanvas>
    </Styled.Container>
  )
}

export default Canvas
