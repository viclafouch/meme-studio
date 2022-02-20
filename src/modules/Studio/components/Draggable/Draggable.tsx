import React from 'react'

import Styled from './draggable.styled'

type DraggableProps = {
  children: React.ReactNode
  height: number
  width: number
  canvasHeight: number
  canvasWidth: number
  x: number
  y: number
  rotate: number
}

type State = {
  x: DraggableProps['x']
  y: DraggableProps['y']
  height: DraggableProps['height']
  width: DraggableProps['width']
  mode: false | 'dragging'
  downStartX: Nullable<number>
  downStartY: Nullable<number>
}

type Type = 'drag' | 'resize'
type Side = 'ne' | 'nw' | 'se' | 'sw'

const Draggable = (props: DraggableProps) => {
  const { children, width, height, x, y, rotate, canvasHeight, canvasWidth } =
    props
  const [state, setState] = React.useState<State>({
    mode: false,
    downStartX: null,
    downStartY: null,
    height,
    width,
    x,
    y
  })

  const handleMouseDown = (event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    const type = event.currentTarget.getAttribute('data-type') as Type
    if (type === 'drag') {
      setState((prevState) => {
        return {
          ...prevState,
          downStartX: event.pageX - prevState.x,
          downStartY: event.pageY - prevState.y,
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
      const { pageY, pageX } = event
      setState((prevState) => {
        let top = pageY - (prevState.downStartY as number)
        let left = pageX - (prevState.downStartX as number)
        if (top < 0) {
          top = 0
        } else if (top + prevState.height >= canvasHeight) {
          top = canvasHeight - prevState.height
        }
        if (left < 0) {
          left = 0
        } else if (left + prevState.width >= canvasWidth) {
          left = canvasWidth - prevState.width
        }
        return {
          ...prevState,
          x: left,
          y: top
        }
      })
    },
    [canvasWidth, canvasHeight]
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

  console.log(state)

  return (
    <Styled.Draggable
      onMouseDown={handleMouseDown}
      data-type="drag"
      style={{
        height: state.height,
        width: state.width,
        transform: `translate3d(${state.x}px, ${state.y}px, 0) rotate(${rotate}deg)`
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
