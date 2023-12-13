'use client'

import React from 'react'
import { css } from '@styled-system/css'
import { Box } from '@styled-system/jsx'
import {
  useCanvasDimensions,
  useDrawing,
  useItemIdSelected,
  useMeme,
  useTextboxes,
  useTools
} from '@viclafouch/meme-studio-utilities/hooks'
import { Meme, TextBox } from '@viclafouch/meme-studio-utilities/schemas'
import Draggable from '../Draggable'

const Canvas = () => {
  const meme = useMeme() as Meme
  const canvasElRef = React.useRef<HTMLCanvasElement>(null)
  const { textboxes, updateTextbox } = useTextboxes()
  const containerRef = React.useRef<HTMLDivElement>(null)
  const { canvasDimensions } = useCanvasDimensions()
  const { isVisibleDraggables } = useTools()
  const { itemIdSelected, setItemIdSelected } = useItemIdSelected()

  useDrawing({
    canvasElRef,
    containerRef
  })

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
          backgroundImage: `url('${meme.imageUrl}')`
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
