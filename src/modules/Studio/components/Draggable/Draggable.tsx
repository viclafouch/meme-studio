import React from 'react'
import { useMeme } from '@stores/Editor/hooks/useMeme'
import { useText } from '@stores/Editor/hooks/useTexts'
import * as R from 'ramda'

import Styled from './draggable.styled'
import { State } from './draggable.types'
import { move } from './draggable.utils'

type DraggableProps = {
  textId: TextBox['id']
  children: React.ReactNode
  canvasHeight: number
  canvasWidth: number
  ratio: (size: number) => number
}

type Type = 'drag' | 'resize'
// type Side = 'ne' | 'nw' | 'se' | 'sw'

const Draggable = (props: DraggableProps) => {
  const { children, canvasHeight, canvasWidth, ratio, textId } = props
  const meme = useMeme()
  const [text, updater] = useText(textId)
  const [state, setState] = React.useState<State>(() => {
    return {
      mode: false,
      downStartX: null,
      downStartY: null,
      left: text.centerX - R.divide(text.width, 2),
      top: text.centerY - R.divide(text.height, 2),
      width: text.width,
      height: text.height
    }
  })

  const handleMouseDown = (event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    const type = event.currentTarget.getAttribute('data-type') as Type
    if (type === 'drag') {
      setState((prevState) => {
        return {
          ...prevState,
          downStartX: event.pageX - prevState.left,
          downStartY: event.pageY - prevState.top,
          mode: 'dragging'
        }
      })
    }
  }

  const handleMouseUp = React.useCallback(() => {
    setState((prevState) => {
      return {
        ...prevState,
        downStartX: null,
        downStartY: null,
        mode: false
      }
    })
  }, [])

  const handleMouseMove = React.useCallback(
    (event: MouseEvent) => {
      const { left, top } = move(event, state, {
        width: canvasWidth,
        height: canvasHeight
      })

      const centerY = top + state.height / 2
      const centerX = left + state.width / 2
      updater({
        centerX: Math.round((centerX / canvasWidth) * meme.width),
        centerY: Math.round((centerY / canvasHeight) * meme.height)
      })
      setState((prevState) => {
        return {
          ...prevState,
          top,
          left
        }
      })
    },
    [canvasWidth, canvasHeight, state, updater, meme]
  )

  React.useEffect(() => {
    if (state.mode) {
      window.addEventListener('mouseup', handleMouseUp)
      window.addEventListener('mousemove', handleMouseMove)
      return () => {
        window.removeEventListener('mouseup', handleMouseUp)
        window.removeEventListener('mousemove', handleMouseMove)
      }
    }
    return () => {}
  }, [state.mode, handleMouseUp, handleMouseMove])

  const { height, width, left, top } = state

  return (
    <Styled.Draggable
      onMouseDown={handleMouseDown}
      data-type="drag"
      style={{
        height,
        width,
        transform: `translate3d(${left}px, ${top}px, 0) rotate(${text.rotate}deg)`
      }}
    >
      {children}
      <Styled.Resize
        data-type="resize"
        data-side="ne"
        onMouseDown={handleMouseDown}
      />
      <Styled.Resize
        data-type="resize"
        data-side="nw"
        onMouseDown={handleMouseDown}
      />
      <Styled.Resize
        data-type="resize"
        data-side="se"
        onMouseDown={handleMouseDown}
      />
      <Styled.Resize
        data-type="resize"
        data-side="sw"
        onMouseDown={handleMouseDown}
      />
    </Styled.Draggable>
  )
}

export default Draggable
