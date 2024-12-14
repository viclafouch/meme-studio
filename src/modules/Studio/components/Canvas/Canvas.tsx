'use client'

import React from 'react'
import Image from 'next/image'
import { css } from '@styled-system/css'
import { Box } from '@styled-system/jsx'
import {
  useCanvasDimensions,
  useDrawing,
  useItemIdSelected,
  useMeme,
  useTextboxes,
  useTopBlock
} from '@viclafouch/meme-studio-utilities/hooks'
import type { Meme, TextBox } from '@viclafouch/meme-studio-utilities/schemas'
import Draggable from '../Draggable'
import * as Styled from './Canvas.styles'

const Canvas = () => {
  const meme = useMeme() as Meme
  const canvasElRef = React.useRef<HTMLCanvasElement>(null!)
  const { textboxes, updateTextbox } = useTextboxes()
  const containerRef = React.useRef<HTMLDivElement>(null!)
  const { canvasDimensions, calculByAspectRatio } = useCanvasDimensions()
  const topBlock = useTopBlock()
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

  const topBlockHeight = calculByAspectRatio(topBlock.baseHeight)

  return (
    <Styled.Wrapper ref={containerRef}>
      <Box
        zIndex={2}
        position="relative"
        shadow="0 1px 4px rgb(0 0 0 / 30%), 0 0 40px rgb(0 0 0 / 10%) inset"
        style={{ width: canvasDimensions.width }}
      >
        {topBlock.isVisible ? (
          <Box
            bg="white"
            position="absolute"
            left="0"
            right="0"
            top="0"
            w="full"
            zIndex={-1}
            style={{ height: topBlockHeight }}
          />
        ) : null}
        <Image
          src={meme.imageUrl}
          priority
          unoptimized
          alt={meme.name}
          className={css({
            zIndex: -1,
            objectFit: 'cover',
            position: 'absolute',
            left: 0,
            right: 0
          })}
          style={{
            top: topBlock.isVisible ? topBlockHeight : 0,
            height: 'auto'
          }}
          width={canvasDimensions.width}
          height={canvasDimensions.height}
        />
        {canvasDimensions.height
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
      </Box>
    </Styled.Wrapper>
  )
}

export default Canvas
