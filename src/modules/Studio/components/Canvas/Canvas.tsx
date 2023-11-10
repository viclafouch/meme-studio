import React from 'react'
import * as R from 'ramda'
import { Meme } from '@models/Meme'
import { drawText } from '@shared/helpers/canvas'
import { useIsomorphicLayoutEffect } from '@shared/hooks/useIsomorphicLayoutEffect'
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
  const { texts } = useTexts()
  const dimensions = useCanvasDimensions()
  const { showTextAreas } = useTools()
  const { itemIdSelected, setItemIdSelected } = useItemIdSelected()

  useIsomorphicLayoutEffect(() => {
    const canvasElement = canvasElRef.current

    if (canvasElement === null) {
      return () => {}
    }

    const draw = (): void => {
      const context2D = canvasElement.getContext('2d', {
        alpha: true
      }) as CanvasRenderingContext2D
      canvasElement.width = dimensions.width
      canvasElement.height = dimensions.height

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
  }, [texts, canvasElRef, meme, dimensions])

  const onDraggableClick = React.useCallback(
    (itemId: string) => {
      setItemIdSelected(itemId, true)
    },
    [setItemIdSelected]
  )

  return (
    <Styled.Container>
      <Styled.WrapperCanvas
        style={{
          height: dimensions.height,
          width: dimensions.width,
          backgroundImage: `url('https://www.meme-studio.io/templates/${meme.filename}')`
        }}
      >
        {showTextAreas
          ? texts.map((text) => {
              return (
                <Draggable
                  key={text.id}
                  itemId={text.id}
                  canvasHeight={dimensions.height}
                  canvasWidth={dimensions.width}
                  onClick={onDraggableClick}
                  isSelected={itemIdSelected === text.id}
                />
              )
            })
          : null}
        <Styled.Canvas
          ref={canvasElRef}
          width={dimensions.width}
          height={dimensions.height}
        />
      </Styled.WrapperCanvas>
    </Styled.Container>
  )
}

export default Canvas
