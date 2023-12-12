'use client'

import React from 'react'
import { css } from '@styled-system/css'
import { Box } from '@styled-system/jsx'
import { drawText } from '@viclafouch/meme-studio-utilities/helpers'
import {
  useCanvasDimensions,
  useIsomorphicLayoutEffect,
  useItemIdSelected,
  useMeme,
  useTextboxes,
  useTools,
  useWindowSizeCallback
} from '@viclafouch/meme-studio-utilities/hooks'
import { Meme, TextBox } from '@viclafouch/meme-studio-utilities/schemas'
import Draggable from '../Draggable'

const Canvas = () => {
  const meme = useMeme() as Meme
  const canvasElRef = React.useRef<HTMLCanvasElement>(null)
  const { textboxes, updateTextbox } = useTextboxes()
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
      const context2D = canvasElement.getContext(
        '2d'
      ) as CanvasRenderingContext2D
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
  }, [textboxes, canvasDimensions])

  const onDraggableClick = React.useCallback(
    (item: TextBox) => {
      setItemIdSelected(item.id, true)
    },
    [setItemIdSelected]
  )

  return (
    <Box h="full" w="full" position="relative" ref={containerRef}>
      <div
        className={css({
          bgPosition: 'center',
          bgRepeat: 'no-repeat',
          bgSize: '100%',
          left: '50%',
          top: '50%',
          position: 'absolute',
          transform: 'translate(-50%, -50%)',
          zIndex: 2,
          boxShadow:
            '0 1px 4px rgb(0 0 0 / 30%), 0 0 40px rgb(0 0 0 / 10%) inset'
        })}
        style={{
          height: canvasDimensions.height,
          width: canvasDimensions.width,
          backgroundImage: `url('https://www.meme-studio.io/templates/${meme.imageUrl}')`
        }}
      >
        {isVisibleDraggables && canvasDimensions.height
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
        <canvas
          className={css({ position: 'relative', zIndex: '-1' })}
          ref={canvasElRef}
          width={canvasDimensions.width}
          height={canvasDimensions.height}
        />
      </div>
    </Box>
  )
}

export default Canvas
