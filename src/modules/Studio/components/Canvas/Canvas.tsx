import React from 'react'
import * as R from 'ramda'
import { Meme } from '@models/Meme'
import { drawText } from '@shared/helpers/canvas'
import { useIsomorphicLayoutEffect } from '@shared/hooks/useIsomorphicLayoutEffect'
import { useWindowSizeCallback } from '@shared/hooks/useWindowSizeCallback'
import { TextBox } from '@shared/schemas/textbox'
import { useCanvasDimensions } from '@stores/Editor/hooks/useCanvasDimensions'
import { useHistoryVersion } from '@stores/Editor/hooks/useHistory'
import { useItemIdSelected } from '@stores/Editor/hooks/useItemIdSelected'
import { useMeme } from '@stores/Editor/hooks/useMeme'
import { useTexts } from '@stores/Editor/hooks/useTexts'
import { useTools } from '@stores/Editor/hooks/useTools'
import Draggable from '../Draggable'
import Styled from './canvas.styled'

const Canvas = () => {
  const meme = useMeme() as Meme
  const canvasElRef = React.useRef<HTMLCanvasElement>(null)
  const { texts } = useTexts()
  const containerRef = React.useRef<HTMLDivElement>(null)
  const { resize, canvasDimensions, aspectRatio } = useCanvasDimensions()
  const { showTextAreas } = useTools()
  const historyVersion = useHistoryVersion()
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

      for (let index = 0; index < texts.length; index += 1) {
        const text = texts[index] as TextBox
        drawText(
          {
            ...text,
            value: text.isUppercase ? R.toUpper(text.value) : text.value
          },
          context2D
        )
      }
    }

    const frame = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(frame)
    }
  }, [texts, canvasElRef, meme, canvasDimensions])

  const onDraggableClick = React.useCallback(
    (itemId: string) => {
      setItemIdSelected(itemId, true)
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
        {showTextAreas
          ? texts.map((text) => {
              return (
                <Draggable
                  key={`${historyVersion}-${text.id}`}
                  itemId={text.id}
                  aspectRatio={aspectRatio}
                  canvasHeight={canvasDimensions.height}
                  canvasWidth={canvasDimensions.width}
                  onClick={onDraggableClick}
                  isSelected={itemIdSelected === text.id}
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
