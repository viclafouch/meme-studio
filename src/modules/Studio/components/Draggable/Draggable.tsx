import React from 'react'
import * as R from 'ramda'
import { degreeToRad } from '@shared/helpers/number'
import { useEvent } from '@shared/hooks/useEvent'
import { TextBox } from '@shared/schemas/textbox'
import { faRotateLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Styled from './Draggable.styled'
import { Side, State } from './Draggable.types'
import { move, resize, rotate } from './Draggable.utils'

export type DraggableProps = {
  item: TextBox
  updateItem: (itemId: string, itemValues: Partial<TextBox>) => void
  canvasHeight: number
  canvasWidth: number
  isSelected: boolean
  onClick: (item: TextBox) => void
}

type Type = 'drag' | 'resize' | 'rotate'

function getInitialState(): State {
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
    radOnDown: null
  }
}

const Draggable = ({
  canvasHeight,
  canvasWidth,
  item,
  updateItem,
  isSelected,
  onClick
}: DraggableProps) => {
  const modeRef = React.useRef<State['mode']>()

  const [state, setState] = React.useState<State>(() => {
    return getInitialState()
  })

  const { height, width, rotate: rotateDeg } = item
  const left = item.centerX - R.divide(width, 2)
  const top = item.centerY - R.divide(height, 2)
  modeRef.current = state.mode

  const handleMouseDown = (event: React.MouseEvent) => {
    const { currentTarget, pageX, pageY } = event
    event.preventDefault()
    event.stopPropagation()
    const type = currentTarget.getAttribute('data-type') as Type

    if (type === 'drag') {
      setState((prevState) => {
        return {
          ...prevState,
          downStartX: pageX - left,
          downStartY: pageY - top,
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
          widthOnDown: width,
          heightOnDown: height,
          topOnDown: top,
          leftOnDown: left,
          mode: `resizing-${side}`
        }
      })
    } else if (type === 'rotate') {
      const boxElement = event.currentTarget.parentElement as HTMLDivElement
      const boxBounding = boxElement.getBoundingClientRect()
      setState((prevState) => {
        return {
          ...prevState,
          downPageX: event.pageX,
          downPageY: event.pageY,
          startOffsetLeft: boxBounding.left + width / 2,
          startOffsetTop: boxBounding.top + height / 2,
          radOnDown: degreeToRad(rotateDeg),
          mode: 'rotating'
        }
      })
    }
  }

  const handleMouseUp = () => {
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
  }

  const handleDraggingMove = useEvent((event: MouseEvent) => {
    const positions = move(
      event,
      state,
      {
        height,
        width
      },
      {
        width: canvasWidth,
        height: canvasHeight
      }
    )

    const centerY = Math.floor(positions.top + height / 2)
    const centerX = Math.floor(positions.left + width / 2)

    updateItem(item.id, {
      centerY,
      centerX
    })
  })

  const handleResizeMove = useEvent((event: MouseEvent) => {
    const resizer = resize(
      event,
      state,
      {
        height,
        width,
        top,
        left
      },
      {
        width: canvasWidth,
        height: canvasHeight
      }
    )

    const centerY = resizer.top + resizer.height / 2
    const centerX = resizer.left + resizer.width / 2

    updateItem(item.id, {
      centerY,
      centerX,
      height: resizer.height,
      width: resizer.width
    })
  })

  const handleRotateMove = useEvent((event: MouseEvent) => {
    const rotater = rotate(event, state)

    updateItem(item.id, {
      rotate: rotater.rotateDeg
    })
  })

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
  }, [state.mode, handleDraggingMove, handleResizeMove, handleRotateMove])

  return (
    <Styled.Draggable
      onMouseDown={handleMouseDown}
      data-type="drag"
      aria-selected={isSelected}
      onClick={() => {
        return onClick(item)
      }}
      draggable
      style={{
        height,
        width,
        transform: `translate3d(${left}px, ${top}px, 0) rotate(${rotateDeg}deg)`
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
