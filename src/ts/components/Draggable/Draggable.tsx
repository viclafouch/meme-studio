import * as React from 'react'
import { useState, useEffect, useCallback, useRef } from 'react'
import { CanvasProperties } from '@shared/validators'
import TextBox from '@shared/models/TextBox'

type DraggableProps = {
  position: {
    x: number
    y: number
  }
  className?: string
  children: React.ReactNode
  height: number
  width: number
  onMove: Function
  canvasProperties: CanvasProperties
  id: string
}

export function Draggable(props: DraggableProps): JSX.Element {
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const el = useRef<any>(null)
  const [position, setPosition] = useState({
    left: props.position.x,
    top: props.position.y,
    startX: null,
    startY: null
  })

  const handleMouseMove = useCallback(
    ({ clientX, clientY }: MouseEvent): void => {
      if (isDragging) {
        const { canvasProperties, height, width, id, onMove } = props
        let top: number = clientY - position.startY
        let left: number = clientX - position.startX
        if (top < 0) top = 0
        else if (top + height >= canvasProperties.height) top = canvasProperties.height - height
        if (left < 0) left = 0
        else if (left + width >= canvasProperties.width) left = canvasProperties.width - width
        setPosition({
          ...position,
          top,
          left
        })
        const textsUpdated = [...canvasProperties.texts] as any
        const textIndex = textsUpdated.findIndex((t: TextBox) => t.id === id)
        textsUpdated[textIndex].centerY = top * canvasProperties.scale + height / 2
        // textsUpdated[textIndex].centerX = left + width
        onMove(textsUpdated)
      }
    },
    [isDragging, props]
  )

  // mouse left click hold
  const handleMouseDown = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault()
      setPosition({
        ...position,
        startX: event.clientX - position.left,
        startY: event.clientY - position.top
      })
      setIsDragging(true)
    },
    [position]
  )

  // mouse left click release
  const handleMouseUp = useCallback(() => {
    if (isDragging) setIsDragging(false)
  }, [isDragging])

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    return (): void => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [handleMouseMove])

  return (
    <div
      ref={el}
      className={props.className || ''}
      onMouseDown={handleMouseDown}
      style={{
        left: position.left,
        top: position.top,
        height: props.height,
        width: props.width
      }}
    >
      {props.children}
    </div>
  )
}

export default Draggable
