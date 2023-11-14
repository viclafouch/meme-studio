import React from 'react'
import * as R from 'ramda'
import { degreeToRad } from '@shared/helpers/number'
import { useText } from '@stores/Editor/hooks/useTexts'
import { faRotateLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Styled from './Draggable.styled'
import { Side, State } from './Draggable.types'
import { move, resize, rotate } from './Draggable.utils'

export type DraggableProps = {
  itemId: string
  canvasHeight: number
  canvasWidth: number
  isSelected: boolean
  onClick: (itemId: string) => void
}

type Type = 'drag' | 'resize' | 'rotate'

const Draggable = ({
  canvasHeight,
  canvasWidth,
  itemId,
  isSelected,
  onClick
}: DraggableProps) => {
  const { text, updateText } = useText(itemId)
  const modeRef = React.useRef<State['mode']>()

  const [state, setState] = React.useState<State>(() => {
    return {
      mode: false,
      downStartX: null,
      downStartY: null,
      downPageX: null,
      downPageY: null,
      widthOnDown: null,
      heightOnDown: null,
      topOnDown: null,
      leftOnDown: null,
      startOffsetTop: null,
      startOffsetLeft: null,
      radOnDown: null,
      rotate: text.rotate,
      left: text.centerX - R.divide(text.width, 2),
      top: text.centerY - R.divide(text.height, 2),
      width: text.width,
      height: text.height
    }
  })

  modeRef.current = state.mode

  React.useEffect(() => {
    if (modeRef.current) {
      const centerY = state.top + state.height / 2
      const centerX = state.left + state.width / 2
      updateText(itemId, {
        width: state.width,
        height: state.height,
        centerX,
        centerY,
        rotate: state.rotate
      })
    }
  }, [
    state.left,
    state.top,
    state.width,
    state.height,
    state.rotate,
    itemId,
    updateText
  ])

  const handleMouseDown = (event: React.MouseEvent) => {
    const { currentTarget, pageX, pageY } = event
    event.preventDefault()
    event.stopPropagation()
    const type = currentTarget.getAttribute('data-type') as Type

    if (type === 'drag') {
      setState((prevState) => {
        return {
          ...prevState,
          downStartX: pageX - prevState.left,
          downStartY: pageY - prevState.top,
          mode: 'dragging'
        }
      })
    } else if (type === 'resize') {
      const side = currentTarget.getAttribute('data-side') as Side
      setState((prevState) => {
        return {
          ...prevState,
          downPageX: pageX,
          downPageY: pageY,
          widthOnDown: prevState.width,
          heightOnDown: prevState.height,
          topOnDown: prevState.top,
          leftOnDown: prevState.left,
          mode: `resizing-${side}`
        }
      })
    } else if (type === 'rotate') {
      const boxElement = event.currentTarget.parentElement as HTMLDivElement
      const { left, top } = boxElement.getBoundingClientRect()
      setState((prevState) => {
        return {
          ...prevState,
          downPageX: event.pageX,
          downPageY: event.pageY,
          startOffsetLeft: left + prevState.width / 2,
          startOffsetTop: top + prevState.height / 2,
          radOnDown: degreeToRad(state.rotate),
          mode: 'rotating'
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
        downPageX: null,
        downPageY: null,
        widthOnDown: null,
        heightOnDown: null,
        leftOnDown: null,
        topOnDown: null,
        startOffsetTop: null,
        startOffsetLeft: null,
        radOnDown: null,
        mode: false
      }
    })
  }, [])

  const handleDraggingMove = React.useCallback(
    (event: MouseEvent) => {
      setState((prevState) => {
        return {
          ...prevState,
          ...move(event, prevState, {
            width: canvasWidth,
            height: canvasHeight
          })
        }
      })
    },
    [canvasWidth, canvasHeight]
  )

  const handleResizeMove = React.useCallback(
    (event: MouseEvent) => {
      setState((prevState) => {
        return {
          ...prevState,
          ...resize(event, prevState, {
            width: canvasWidth,
            height: canvasHeight
          })
        }
      })
    },
    [canvasWidth, canvasHeight]
  )

  const handleRotateMove = React.useCallback((event: MouseEvent) => {
    setState((prevState) => {
      return {
        ...prevState,
        ...rotate(event, prevState)
      }
    })
  }, [])

  React.useEffect(() => {
    if (state.mode !== false) {
      window.addEventListener('mouseup', handleMouseUp)

      if (state.mode === 'dragging') {
        window.addEventListener('mousemove', handleDraggingMove)
      } else if (state.mode.includes('resizing')) {
        window.addEventListener('mousemove', handleResizeMove)
      } else if (state.mode === 'rotating') {
        window.addEventListener('mousemove', handleRotateMove)
      }

      return () => {
        window.removeEventListener('mouseup', handleMouseUp)

        if (state.mode === 'dragging') {
          window.removeEventListener('mousemove', handleDraggingMove)
        } else if (state.mode && state.mode.includes('resizing')) {
          window.removeEventListener('mousemove', handleResizeMove)
        } else if (state.mode === 'rotating') {
          window.removeEventListener('mousemove', handleRotateMove)
        }
      }
    }

    return () => {}
  }, [
    state.mode,
    handleMouseUp,
    handleDraggingMove,
    handleResizeMove,
    handleRotateMove
  ])

  const { height, width, left, top } = state

  return (
    <Styled.Draggable
      onMouseDown={handleMouseDown}
      data-type="drag"
      aria-selected={isSelected}
      onClick={() => {
        return onClick(itemId)
      }}
      draggable
      style={{
        height,
        width,
        transform: `translate3d(${left}px, ${top}px, 0) rotate(${text.rotate}deg)`
      }}
    >
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
      <Styled.Rotate data-type="rotate" onMouseDown={handleMouseDown}>
        <FontAwesomeIcon icon={faRotateLeft} />
      </Styled.Rotate>
    </Styled.Draggable>
  )
}

export default React.memo(Draggable)
